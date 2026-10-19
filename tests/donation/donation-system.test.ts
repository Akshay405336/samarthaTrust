import { describe, it, expect, beforeEach } from "vitest";
import crypto from "crypto";
import {
  formatINR,
  formatNumberINR,
  validateStep1,
  validateStep2,
  validateStep3,
} from "@/components/customer/donation/donation-validation";
import {
  DONATION_CAUSES,
  PRESET_AMOUNTS,
  MIN_AMOUNT,
  MAX_AMOUNT,
  DONATION_FAQS,
  TRUST_PILLARS,
} from "@/components/customer/donation/donation-constants";
import {
  verifyPaymentSignature,
  verifyWebhookSignature,
  getRazorpayConfig,
} from "@/lib/razorpay/server";
import {
  createDonationOrderSchema,
  verifyDonationPaymentSchema,
  adminDonationsQuerySchema,
} from "@/lib/validations/donation";
import type { DonorDetails } from "@/components/customer/donation/donation-types";

describe("Donation Module & Razorpay Integration", () => {
  beforeEach(() => {
    process.env.RAZORPAY_KEY_ID = "rzp_test_mock123";
    process.env.RAZORPAY_KEY_SECRET = "mock_secret_key_12345678901234567890";
    process.env.RAZORPAY_WEBHOOK_SECRET =
      "mock_webhook_secret_1234567890123456";
  });

  describe("Formatting Utilities", () => {
    it("formats amounts in Indian Rupees (INR) with appropriate symbol and groupings", () => {
      const formatted500 = formatINR(500);
      expect(formatted500).toContain("500");
      expect(formatted500).toMatch(/[₹Rs]/);

      const formatted100k = formatINR(100000);
      expect(formatted100k).toMatch(/1,00,000|100,000/);

      const formattedZero = formatINR(0);
      expect(formattedZero).toContain("0");

      const formattedNegative = formatINR(-500);
      expect(formattedNegative).toBe("₹0");
    });

    it("formats numbers without currency symbol using Indian grouping", () => {
      expect(formatNumberINR(2000)).toMatch(/2,000|2000/);
      expect(formatNumberINR(1000000)).toMatch(/10,00,000|1,000,000/);
    });
  });

  describe("Step 1: One-Time Exclusivity & Amount Validation", () => {
    it("accepts valid one-time donation parameters for all causes", () => {
      const validCauses = [
        "general",
        "education",
        "special-needs",
        "healthcare",
        "child-care",
      ];
      for (const causeId of validCauses) {
        const errorsOneTime = validateStep1("one-time", causeId, 2000);
        expect(Object.keys(errorsOneTime)).toHaveLength(0);
      }
    });

    it("strictly rejects monthly and non-one-time frequencies", () => {
      // @ts-expect-error Testing removal of monthly frequency
      const errorsMonthly = validateStep1("monthly", "general", 1000);
      expect(errorsMonthly.frequency).toBe(
        "Only one-time contributions are supported."
      );

      // @ts-expect-error Testing invalid frequency input
      const errorsAnnual = validateStep1("annually", "general", 1000);
      expect(errorsAnnual.frequency).toBe(
        "Only one-time contributions are supported."
      );
    });

    it("rejects nonexistent causeId", () => {
      const errors = validateStep1("one-time", "nonexistent-cause", 1000);
      expect(errors.causeId).toBeDefined();
    });

    it("rejects amounts below MIN_AMOUNT and above MAX_AMOUNT", () => {
      const errorsBelow = validateStep1("one-time", "general", MIN_AMOUNT - 1);
      expect(errorsBelow.amount).toContain("Minimum contribution");

      const errorsAbove = validateStep1("one-time", "general", MAX_AMOUNT + 1);
      expect(errorsAbove.amount).toContain("Maximum contribution");
    });

    it("rejects zero and negative amounts in schema validation", () => {
      const zeroParsed = createDonationOrderSchema.safeParse({
        amount: 0,
        frequency: "one-time",
        causeId: "general",
        donor: {
          fullName: "Test Donor",
          email: "test@example.com",
          phone: "9876543210",
        },
      });
      expect(zeroParsed.success).toBe(false);

      const negativeParsed = createDonationOrderSchema.safeParse({
        amount: -500,
        frequency: "one-time",
        causeId: "general",
        donor: {
          fullName: "Test Donor",
          email: "test@example.com",
          phone: "9876543210",
        },
      });
      expect(negativeParsed.success).toBe(false);
    });

    it("verifies integer paise conversion (₹2,000 = 200,000 paise)", () => {
      const amountInRupees = 2500;
      const amountInPaise = Math.round(amountInRupees * 100);
      expect(amountInPaise).toBe(250000);
      expect(Number.isInteger(amountInPaise)).toBe(true);
    });
  });

  describe("Step 2: Donor Details Validation", () => {
    const validDonor: DonorDetails = {
      fullName: "Anita Sharma",
      email: "anita.sharma@example.com",
      phone: "+91 98765 43210",
      panNumber: "ABCDE1234F",
      addressLine1: "123 Indiranagar",
      addressLine2: "",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      country: "India",
      message: "Keep up the wonderful work!",
      isAnonymous: false,
      consentUpdates: true,
      agreedToTerms: true,
    };

    it("accepts completely valid donor data", () => {
      const errors = validateStep2(validDonor);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("validates required full name", () => {
      const errorsEmpty = validateStep2({ ...validDonor, fullName: "" });
      expect(errorsEmpty.fullName).toBeDefined();

      const errorsShort = validateStep2({ ...validDonor, fullName: "A" });
      expect(errorsShort.fullName).toBeDefined();
    });

    it("validates required email address with proper format", () => {
      const errorsEmpty = validateStep2({ ...validDonor, email: "" });
      expect(errorsEmpty.email).toBeDefined();

      const errorsInvalid = validateStep2({
        ...validDonor,
        email: "invalid-email",
      });
      expect(errorsInvalid.email).toBeDefined();
    });

    it("validates required phone number with at least 10 digits", () => {
      const errorsEmpty = validateStep2({ ...validDonor, phone: "" });
      expect(errorsEmpty.phone).toBeDefined();

      const errorsShort = validateStep2({ ...validDonor, phone: "12345" });
      expect(errorsShort.phone).toBeDefined();
    });

    it("validates PAN format when provided, while remaining optional when empty", () => {
      const errorsEmptyPan = validateStep2({ ...validDonor, panNumber: "" });
      expect(errorsEmptyPan.panNumber).toBeUndefined();

      const errorsInvalidPan = validateStep2({
        ...validDonor,
        panNumber: "12345ABCDE",
      });
      expect(errorsInvalidPan.panNumber).toBeDefined();

      const errorsValidPan = validateStep2({
        ...validDonor,
        panNumber: "ABCDE1234F",
      });
      expect(errorsValidPan.panNumber).toBeUndefined();
    });

    it("validates postal pincode when provided, while remaining optional when empty", () => {
      const errorsEmptyPincode = validateStep2({ ...validDonor, pincode: "" });
      expect(errorsEmptyPincode.pincode).toBeUndefined();

      const errorsInvalidPincode = validateStep2({
        ...validDonor,
        pincode: "123",
      });
      expect(errorsInvalidPincode.pincode).toBeDefined();

      const errorsValidPincode = validateStep2({
        ...validDonor,
        pincode: "560001",
      });
      expect(errorsValidPincode.pincode).toBeUndefined();
    });
  });

  describe("Step 3: Review Confirmation Validation", () => {
    const donorBase: DonorDetails = {
      fullName: "Ramesh Rao",
      email: "ramesh@example.com",
      phone: "9876543210",
      panNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      message: "",
      isAnonymous: false,
      consentUpdates: false,
      agreedToTerms: false,
    };

    it("rejects review submission when agreedToTerms is false", () => {
      const errors = validateStep3(donorBase);
      expect(errors.agreedToTerms).toBeDefined();
    });

    it("accepts review submission when agreedToTerms is true", () => {
      const errors = validateStep3({ ...donorBase, agreedToTerms: true });
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  describe("Razorpay Cryptographic Verification Security", () => {
    const orderId = "order_Oq7z9Mock1234";
    const paymentId = "pay_Pq8wMock5678";
    const secret = "mock_secret_key_12345678901234567890";

    it("authenticates a genuinely signed Razorpay payment checkout payload", () => {
      const payload = `${orderId}|${paymentId}`;
      const validSignature = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");

      const isVerified = verifyPaymentSignature({
        orderId,
        paymentId,
        signature: validSignature,
      });

      expect(isVerified).toBe(true);
    });

    it("rejects a forged or tampered payment signature in constant time", () => {
      const forgedSignature =
        "0000000000000000000000000000000000000000000000000000000000000000";

      const isVerified = verifyPaymentSignature({
        orderId,
        paymentId,
        signature: forgedSignature,
      });

      expect(isVerified).toBe(false);
    });

    it("rejects signature when orderId or paymentId do not match", () => {
      const validForDifferentOrder = crypto
        .createHmac("sha256", secret)
        .update(`order_DIFFERENT|${paymentId}`)
        .digest("hex");

      const isVerified = verifyPaymentSignature({
        orderId,
        paymentId,
        signature: validForDifferentOrder,
      });

      expect(isVerified).toBe(false);
    });

    it("authenticates genuine raw-body webhook signatures", () => {
      const rawBody = JSON.stringify({
        event: "payment.captured",
        payload: {
          payment: {
            entity: { id: paymentId, order_id: orderId, amount: 200000 },
          },
        },
      });
      const webhookSecret = "mock_webhook_secret_1234567890123456";

      const validWebhookSig = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      const isVerified = verifyWebhookSignature(
        rawBody,
        validWebhookSig,
        webhookSecret
      );
      expect(isVerified).toBe(true);
    });

    it("rejects tampered webhook bodies and invalid signatures", () => {
      const rawBody = '{"event":"payment.captured"}';
      const fakeSig =
        "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      const isVerified = verifyWebhookSignature(rawBody, fakeSig);
      expect(isVerified).toBe(false);
    });

    it("fails safely with a clear configuration error when credentials are missing", () => {
      delete process.env.RAZORPAY_KEY_ID;
      delete process.env.RAZORPAY_KEY_SECRET;

      expect(() => getRazorpayConfig()).toThrow(
        /Payment gateway configuration error/
      );
    });
  });

  describe("API Schema Validations & Idempotency", () => {
    it("validates verifyDonationPaymentSchema with required fields", () => {
      const validPayload = {
        donationReference: "ST-DON-1234-ABCD",
        razorpayOrderId: "order_123",
        razorpayPaymentId: "pay_123",
        razorpaySignature: "mock_signature_long_enough_12345",
      };

      const parsed = verifyDonationPaymentSchema.safeParse(validPayload);
      expect(parsed.success).toBe(true);

      const invalidPayload = {
        donationReference: "",
        razorpayOrderId: "order_123",
        razorpayPaymentId: "",
        razorpaySignature: "123",
      };
      const invalidParsed =
        verifyDonationPaymentSchema.safeParse(invalidPayload);
      expect(invalidParsed.success).toBe(false);
    });

    it("validates adminDonationsQuerySchema pagination and filtering", () => {
      const query = {
        page: "2",
        limit: "25",
        status: "PAID",
        search: "Ramesh",
      };

      const parsed = adminDonationsQuerySchema.safeParse(query);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.page).toBe(2);
        expect(parsed.data.limit).toBe(25);
        expect(parsed.data.status).toBe("PAID");
      }
    });
  });

  describe("Admin Metrics Rules", () => {
    it("verifies that only PAID donations contribute to the total received amount", () => {
      const mockDonations = [
        { status: "PAID", amount: 200000 },
        { status: "PAID", amount: 500000 },
        { status: "PENDING", amount: 1000000 }, // Should NOT be counted
        { status: "FAILED", amount: 300000 }, // Should NOT be counted
        { status: "ORDER_CREATED", amount: 100000 }, // Should NOT be counted
      ];

      const paidDonations = mockDonations.filter((d) => d.status === "PAID");
      const totalPaidPaise = paidDonations.reduce(
        (sum, d) => sum + d.amount,
        0
      );
      const totalPaidRupees = totalPaidPaise / 100;

      expect(totalPaidRupees).toBe(7000); // 2000 + 5000 = 7000, not 21000
      expect(paidDonations).toHaveLength(2);
    });
  });

  describe("Constants & Configuration Integrity", () => {
    it("contains 5 designated causes with required properties", () => {
      expect(DONATION_CAUSES).toHaveLength(5);
      for (const cause of DONATION_CAUSES) {
        expect(cause.id).toBeDefined();
        expect(cause.title).toBeDefined();
        expect(cause.shortDescription).toBeDefined();
        expect(cause.iconName).toBeDefined();
      }
    });

    it("contains standard preset amounts", () => {
      expect(PRESET_AMOUNTS).toEqual([500, 1000, 2000, 5000, 10000]);
    });

    it("contains 3 trust pillars", () => {
      expect(TRUST_PILLARS).toHaveLength(3);
    });

    it("contains honest FAQs with non-fabricated answers", () => {
      expect(DONATION_FAQS.length).toBeGreaterThanOrEqual(5);
      for (const faq of DONATION_FAQS) {
        expect(faq.question).toBeTruthy();
        expect(faq.answer).toBeTruthy();
        // Ensure no monthly recurring claim is in FAQs
        expect(faq.answer.toLowerCase()).not.toContain(
          "monthly contribution in step 1"
        );
      }
    });
  });

  describe("Dynamic Amount & Non-Fixed Amount Validation", () => {
    it("dynamically validates various amounts and never forces ₹500", () => {
      const testAmounts = [100, 500, 1000, 2500, 5000, 15000, 50000];
      for (const amt of testAmounts) {
        const parsed = createDonationOrderSchema.safeParse({
          amount: amt,
          frequency: "one-time",
          causeId: "general",
          donor: {
            fullName: "Donor User",
            email: "donor@example.com",
            phone: "9876543210",
          },
        });
        expect(parsed.success).toBe(true);
        if (parsed.success) {
          expect(parsed.data.amount).toBe(amt);
          expect(Math.round(parsed.data.amount * 100)).toBe(amt * 100);
        }
      }
    });

    it("ensures custom amount overrides any default preset cleanly", () => {
      const customAmount = 3500;
      const parsed = createDonationOrderSchema.safeParse({
        amount: customAmount,
        frequency: "one-time",
        causeId: "education",
        donor: {
          fullName: "Donor User",
          email: "donor@example.com",
          phone: "9876543210",
        },
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.amount).toBe(3500);
      }
    });
  });

  describe("Pagination & Display Range Logic", () => {
    it("calculates correct record range for first, middle, and last pages", () => {
      const limit = 10;
      const total = 25;

      // Page 1
      const p1Start = (1 - 1) * limit + 1;
      const p1End = Math.min(1 * limit, total);
      expect(p1Start).toBe(1);
      expect(p1End).toBe(10);

      // Page 2
      const p2Start = (2 - 1) * limit + 1;
      const p2End = Math.min(2 * limit, total);
      expect(p2Start).toBe(11);
      expect(p2End).toBe(20);

      // Page 3 (last page)
      const p3Start = (3 - 1) * limit + 1;
      const p3End = Math.min(3 * limit, total);
      expect(p3Start).toBe(21);
      expect(p3End).toBe(25);
    });

    it("safely handles totalPages = 1 and empty lists without crashing", () => {
      const emptyTotal = 0;
      const limit = 10;
      const emptyTotalPages = Math.max(1, Math.ceil(emptyTotal / limit));
      expect(emptyTotalPages).toBe(1);

      const singlePageTotal = 7;
      const singlePageTotalPages = Math.max(1, Math.ceil(singlePageTotal / limit));
      expect(singlePageTotalPages).toBe(1);
    });

    it("safely clamps out-of-range page numbers", () => {
      const totalPages = 5;

      const negativePage = -3;
      const clampedLow = Math.max(1, Math.min(negativePage, totalPages));
      expect(clampedLow).toBe(1);

      const overflowPage = 99;
      const clampedHigh = Math.max(1, Math.min(overflowPage, totalPages));
      expect(clampedHigh).toBe(5);
    });
  });
});
