import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  CONTACT_OFFICE,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_FAQS,
  INQUIRY_TYPES,
  BRANCH_LOCATIONS,
} from "@/components/customer/contact/contact-constants";
import { contactFormSchema } from "@/lib/validations/contact";
import { POST as contactPostHandler } from "@/app/api/contact/route";
import {
  escapeHtml,
  buildEmailSubject,
  buildContactEmailHtml,
  buildContactEmailText,
  sendContactEmail,
  mockSentEmails,
} from "@/lib/email/contact-email-service";

describe("Contact Module & Validation System", () => {
  describe("Verified Contact Information & Constants", () => {
    it("has the verified official address for Samartha Trust in Yeshwanthpur, Bengaluru", () => {
      expect(CONTACT_OFFICE.fullAddress).toBe(
        "No. 9, 6th Cross, B.K. Nagar, Yeshwanthpur, Bengaluru, Karnataka 560022"
      );
      expect(CONTACT_OFFICE.city).toBe("Bengaluru");
      expect(CONTACT_OFFICE.state).toBe("Karnataka");
      expect(CONTACT_OFFICE.pincode).toBe("560022");
      expect(CONTACT_OFFICE.googleMapsUrl).toContain("maps/search");
      expect(CONTACT_OFFICE.googleMapsUrl).toContain("Yeshwanthpur");
    });

    it("has the verified official email and phone numbers", () => {
      expect(CONTACT_EMAIL).toBe("info@samarthatrust.org");
      expect(CONTACT_PHONE.raw).toBe("9740919104");
      expect(CONTACT_PHONE.tel).toBe("+919740919104");
      expect(CONTACT_PHONE.display).toBe("+91 97409 19104");
    });

    it("includes all 5 required FAQ entries with informative answers", () => {
      expect(CONTACT_FAQS.length).toBe(5);

      const questions = CONTACT_FAQS.map((f) => f.question);
      expect(questions).toContain("How can I contact Samartha Trust?");
      expect(questions).toContain("How can I volunteer?");
      expect(questions).toContain("How can I enquire about donations?");
      expect(questions).toContain("How can an organization discuss a partnership?");
      expect(questions).toContain("What should I include in my message?");

      CONTACT_FAQS.forEach((faq) => {
        expect(faq.question.length).toBeGreaterThan(10);
        expect(faq.answer.length).toBeGreaterThan(20);
      });
    });

    it("provides the standard set of inquiry types", () => {
      expect(INQUIRY_TYPES).toContain("General Inquiry");
      expect(INQUIRY_TYPES).toContain("Volunteering");
      expect(INQUIRY_TYPES).toContain("Donations & Receipts");
      expect(INQUIRY_TYPES).toContain("CSR & Institutional Partnerships");
      expect(INQUIRY_TYPES).toContain("Programs & Beneficiary Support");
      expect(INQUIRY_TYPES).toContain("Other");
    });
  });

  describe("Three Separate Branch Locations", () => {
    it("configures all three distinct Samartha Trust branches", () => {
      expect(BRANCH_LOCATIONS.length).toBe(3);

      const ids = BRANCH_LOCATIONS.map((b) => b.id);
      expect(ids).toContain("boys-hostel");
      expect(ids).toContain("tamil-kannada-school");
      expect(ids).toContain("girls-home");
    });

    it("verifies Branch 1: Samartha Trust Dr. Raju's Boys Hostel details", () => {
      const branch1 = BRANCH_LOCATIONS.find((b) => b.id === "boys-hostel")!;
      expect(branch1.name).toBe("Samartha Trust Dr. Raju's Boys Hostel");
      expect(branch1.address).toBe(
        "#13/14, 80ft Road, Nagarbhavi Main Road, Chandra Layout, Bangalore - 560072"
      );
      expect(branch1.phoneTel).toBe("+919740919104");
      expect(branch1.whatsappMessage).toBe(
        "Hello Samartha Trust, I would like to enquire about the Boys Hostel."
      );
      expect(branch1.whatsappUrl).toContain("https://wa.me/919740919104");
      expect(branch1.whatsappUrl).toContain(
        encodeURIComponent("Hello Samartha Trust, I would like to enquire about the Boys Hostel.")
      );
      expect(branch1.googleMapsUrl).toContain("maps/search");
      expect(branch1.googleMapsUrl).toContain("Chandra%20Layout");
    });

    it("verifies Branch 2: Samartha Trust Govt Tamil Kannada School details", () => {
      const branch2 = BRANCH_LOCATIONS.find((b) => b.id === "tamil-kannada-school")!;
      expect(branch2.name).toBe("Samartha Trust Govt Tamil Kannada School");
      expect(branch2.address).toBe(
        "Anjanappa Gardens, Cottonpete, Bengaluru - 560053"
      );
      expect(branch2.phoneTel).toBe("+919740919104");
      expect(branch2.whatsappMessage).toBe(
        "Hello Samartha Trust, I would like to enquire about the Govt Tamil Kannada School."
      );
      expect(branch2.whatsappUrl).toContain("https://wa.me/919740919104");
      expect(branch2.whatsappUrl).toContain(
        encodeURIComponent("Hello Samartha Trust, I would like to enquire about the Govt Tamil Kannada School.")
      );
      expect(branch2.googleMapsUrl).toContain("maps/search");
      expect(branch2.googleMapsUrl).toContain("Cottonpete");
    });

    it("verifies Branch 3: Samartha Trust Girl's Home details", () => {
      const branch3 = BRANCH_LOCATIONS.find((b) => b.id === "girls-home")!;
      expect(branch3.name).toBe("Samartha Trust Girl's Home");
      expect(branch3.address).toBe(
        "Govt Model School, Adugodi, Bengaluru - 560030"
      );
      expect(branch3.phoneTel).toBe("+919740919104");
      expect(branch3.whatsappMessage).toBe(
        "Hello Samartha Trust, I would like to enquire about the Girl's Home."
      );
      expect(branch3.whatsappUrl).toContain("https://wa.me/919740919104");
      expect(branch3.whatsappUrl).toContain(
        encodeURIComponent("Hello Samartha Trust, I would like to enquire about the Girl's Home.")
      );
      expect(branch3.googleMapsUrl).toContain("maps/search");
      expect(branch3.googleMapsUrl).toContain("Adugodi");
    });

    it("ensures all three branch addresses and locations are distinct", () => {
      const addresses = BRANCH_LOCATIONS.map((b) => b.address);
      const uniqueAddresses = new Set(addresses);
      expect(uniqueAddresses.size).toBe(3);

      // Distinct from registered office
      addresses.forEach((addr) => {
        expect(addr).not.toBe(CONTACT_OFFICE.fullAddress);
      });
    });
  });

  describe("Contact Form Validation Schema", () => {
    const validData = {
      fullName: "Ananya Sharma",
      email: "ananya.sharma@example.com",
      phone: "+91 98765 43210",
      inquiryType: "Volunteering",
      subject: "Volunteering for health outreach camp",
      message:
        "Hello Samartha Trust, I am a trained physiotherapist and would love to volunteer at your weekend camps.",
    };

    it("validates correct form submissions successfully", () => {
      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("allows optional phone numbers and inquiryType", () => {
      const withoutPhone = { ...validData, phone: "" };
      const parsedWithoutPhone = contactFormSchema.safeParse(withoutPhone);
      expect(parsedWithoutPhone.success).toBe(true);

      const withoutInquiry = { ...validData, inquiryType: undefined };
      const parsedWithoutInquiry = contactFormSchema.safeParse(withoutInquiry);
      expect(parsedWithoutInquiry.success).toBe(true);
    });

    it("rejects names that are too short", () => {
      const invalid = { ...validData, fullName: "A" };
      const result = contactFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 2 characters");
      }
    });

    it("rejects invalid email formats", () => {
      const invalid = { ...validData, email: "invalid-email-address" };
      const result = contactFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("valid email");
      }
    });

    it("rejects messages that are too short", () => {
      const invalid = { ...validData, message: "Hi" };
      const result = contactFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 10 characters");
      }
    });

    it("rejects subjects that are too short", () => {
      const invalid = { ...validData, subject: "Hi" };
      const result = contactFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 3 characters");
      }
    });
  });

  describe("Email Delivery Service (Brevo / Contact Email)", () => {
    beforeEach(() => {
      mockSentEmails.length = 0;
    });

    it("properly escapes HTML input to prevent injection in emails", () => {
      const dangerous = '<script>alert("xss")</script> & <b>bold</b>';
      const safe = escapeHtml(dangerous);
      expect(safe).not.toContain("<script>");
      expect(safe).toContain("&lt;script&gt;");
      expect(safe).toContain("&amp;");
    });

    it("builds the descriptive subject line based on inquiry type", () => {
      const subject = buildEmailSubject("Volunteering", "Weekend Camps");
      expect(subject).toBe("[Samartha Trust Contact] Volunteering: Weekend Camps");

      const defaultSubject = buildEmailSubject(undefined, undefined);
      expect(defaultSubject).toBe("[Samartha Trust Contact] General Inquiry: Inquiry regarding General Inquiry");
    });

    it("generates professional HTML and plain-text email bodies", () => {
      const payload = {
        fullName: "Kavita Rao",
        email: "kavita@example.com",
        phone: "+91 97409 19104",
        inquiryType: "CSR & Institutional Partnerships",
        subject: "CSR Grant Opportunity",
        message: "We would like to propose a CSR grant for special education.",
      };

      const html = buildContactEmailHtml(payload, "ST-INQ-TEST-001", "Monday, October 19, 2026");
      expect(html).toContain("ST-INQ-TEST-001");
      expect(html).toContain("Kavita Rao");
      expect(html).toContain("kavita@example.com");
      expect(html).toContain("CSR &amp; Institutional Partnerships");
      expect(html).toContain("Reply-To Instruction");

      const text = buildContactEmailText(payload, "ST-INQ-TEST-001", "Monday, October 19, 2026");
      expect(text).toContain("ST-INQ-TEST-001");
      expect(text).toContain("Kavita Rao");
      expect(text).toContain("kavita@example.com");
    });

    it("delivers email to info@samarthatrust.org and sets replyTo to the visitor", async () => {
      process.env.MOCK_EMAIL_DELIVERY = "true";

      const payload = {
        fullName: "Rahul Verma",
        email: "rahul.verma@example.com",
        phone: "+91 98765 43210",
        inquiryType: "Volunteering",
        subject: "Doctor volunteering inquiry",
        message: "I am a pediatrician wanting to assist in rural camps.",
      };

      const result = await sendContactEmail(payload);
      expect(result.success).toBe(true);
      expect(result.referenceId).toMatch(/^ST-INQ-/);

      expect(mockSentEmails.length).toBe(1);
      const sent = mockSentEmails[0];
      expect(sent.to).toBe("info@samarthatrust.org");
      expect(sent.replyTo).toBe("rahul.verma@example.com");
      expect(sent.subject).toContain("[Samartha Trust Contact] Volunteering");
    });
  });

  describe("Contact API Route Handler (/api/contact)", () => {
    beforeEach(() => {
      process.env.MOCK_EMAIL_DELIVERY = "true";
      mockSentEmails.length = 0;
    });

    it("returns 200 with reference ID upon successful submission and email delivery", async () => {
      const req = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Vikram Sethi",
          email: "vikram@example.com",
          phone: "9876543210",
          inquiryType: "CSR & Institutional Partnerships",
          subject: "CSR Collaboration with Samartha Trust",
          message:
            "We would like to partner with Samartha Trust under our annual CSR outreach grant. Please connect us with your director.",
        }),
      });

      const res = await contactPostHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.referenceId).toMatch(/^ST-INQ-/);
      expect(json.message).toContain("received your inquiry");

      // Verify email was actually recorded
      expect(mockSentEmails.length).toBe(1);
      expect(mockSentEmails[0].to).toBe("info@samarthatrust.org");
      expect(mockSentEmails[0].replyTo).toBe("vikram@example.com");
    });

    it("returns 400 with field errors for invalid contact inquiries", async () => {
      const req = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "",
          email: "not-an-email",
          phone: "",
          subject: "",
          message: "Short",
        }),
      });

      const res = await contactPostHandler(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.fieldErrors).toBeDefined();
      expect(json.fieldErrors.fullName).toBeDefined();
      expect(json.fieldErrors.email).toBeDefined();
      expect(json.fieldErrors.subject).toBeDefined();
      expect(json.fieldErrors.message).toBeDefined();

      // No email should be sent on validation failure
      expect(mockSentEmails.length).toBe(0);
    });

    it("handles malformed JSON gracefully with 500 error", async () => {
      const req = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ bad json",
      });

      const res = await contactPostHandler(req);
      expect(res.status).toBe(500);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toBeDefined();
    });
  });
});
