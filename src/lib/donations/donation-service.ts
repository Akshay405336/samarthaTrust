import crypto from "crypto";
import { DonationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  getRazorpayClient,
  getPublicRazorpayKeyId,
  verifyPaymentSignature,
  verifyWebhookSignature,
} from "@/lib/razorpay/server";
import { DONATION_CAUSES } from "@/components/customer/donation/donation-constants";
import type {
  CreateDonationOrderInput,
  VerifyDonationPaymentInput,
  AdminDonationsQueryInput,
} from "@/lib/validations/donation";

export interface CreateDonationOrderResult {
  success: boolean;
  donationReference: string;
  orderId: string;
  amount: number; // in paise
  amountInRupees: number;
  currency: string;
  keyId: string;
  donor: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    donationReference: string;
    causeId: string;
    causeTitle: string;
  };
}

export interface VerifyDonationPaymentResult {
  success: boolean;
  referenceId: string;
  paymentId: string;
  orderId: string;
  amountInRupees: number;
  currency: string;
  causeTitle: string;
  donorName: string;
  isAnonymous: boolean;
  capturedAt: string | null;
  status: string;
  isPending?: boolean;
  isDuplicate?: boolean;
}

export interface SafeDonationStatus {
  referenceId: string;
  status: DonationStatus;
  amountInRupees: number;
  currency: string;
  causeId: string;
  causeTitle: string;
  donorName: string;
  isAnonymous: boolean;
  paymentId?: string;
  capturedAt?: string;
  createdAt: string;
}

/**
 * Generate a unique, safe public donation reference (e.g. ST-DON-XXXX-XXXX)
 */
function generateDonationReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `ST-DON-${timestamp}-${random}`;
}

/**
 * Creates a server-controlled donation attempt and matching Razorpay Order.
 */
export async function createDonationOrder(
  input: CreateDonationOrderInput
): Promise<CreateDonationOrderResult> {
  const cause =
    DONATION_CAUSES.find((c) => c.id === input.causeId) || DONATION_CAUSES[0];

  // Amount in integer paise (e.g. ₹2000 = 200000 paise)
  const amountInPaise = Math.round(input.amount * 100);
  const referenceId = generateDonationReference();

  // 1. Persist initial pending donation in database
  const donation = await prisma.donation.create({
    data: {
      referenceId,
      amount: amountInPaise,
      currency: "INR",
      frequency: "one-time",
      status: DonationStatus.PENDING,
      causeId: cause.id,
      causeTitle: cause.title,
      donorName: input.donor.fullName.trim(),
      donorEmail: input.donor.email.trim().toLowerCase(),
      donorPhone: input.donor.phone.trim(),
      panNumber: input.donor.panNumber?.trim().toUpperCase() || null,
      addressLine1: input.donor.addressLine1?.trim() || null,
      addressLine2: input.donor.addressLine2?.trim() || null,
      city: input.donor.city?.trim() || null,
      state: input.donor.state?.trim() || null,
      pincode: input.donor.pincode?.trim() || null,
      country: input.donor.country?.trim() || "India",
      message: input.donor.message?.trim() || null,
      isAnonymous: input.donor.isAnonymous,
      consentUpdates: input.donor.consentUpdates,
    },
  });

  try {
    // 2. Create order using official Razorpay SDK
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: referenceId,
      notes: {
        donationReference: referenceId,
        causeId: cause.id,
        causeTitle: cause.title,
      },
    });

    // 3. Associate Razorpay order ID with donation record
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        razorpayOrderId: order.id,
        status: DonationStatus.ORDER_CREATED,
      },
    });

    return {
      success: true,
      donationReference: referenceId,
      orderId: order.id,
      amount: amountInPaise,
      amountInRupees: input.amount,
      currency: "INR",
      keyId: getPublicRazorpayKeyId(),
      donor: {
        name: input.donor.fullName.trim(),
        email: input.donor.email.trim(),
        contact: input.donor.phone.trim(),
      },
      notes: {
        donationReference: referenceId,
        causeId: cause.id,
        causeTitle: cause.title,
      },
    };
  } catch (err) {
    // If Razorpay order creation fails, mark attempt as FAILED
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: DonationStatus.FAILED,
        failedAt: new Date(),
      },
    });

    console.error("Failed to create Razorpay order for donation:", {
      referenceId,
      error: err instanceof Error ? err.message : String(err),
    });

    throw new Error(
      "Unable to initiate payment with the gateway. Please verify connection and try again."
    );
  }
}

/**
 * Server-side payment verification:
 * 1. Checks internal donation record
 * 2. Verifies HMAC-SHA256 signature in constant time
 * 3. Fetches live payment from Razorpay API to verify status, currency, and amount
 * 4. Ensures idempotent persistence
 */
export async function verifyDonationPayment(
  input: VerifyDonationPaymentInput
): Promise<VerifyDonationPaymentResult> {
  const donation = await prisma.donation.findUnique({
    where: { referenceId: input.donationReference },
  });

  if (!donation) {
    throw new Error("Donation record not found for the provided reference.");
  }

  // Verify that the order ID matches the donation
  if (donation.razorpayOrderId !== input.razorpayOrderId) {
    throw new Error("Mismatched order identifier for this donation.");
  }

  // Idempotency: if already confirmed as PAID with the same payment ID, return existing success
  if (
    donation.status === DonationStatus.PAID &&
    donation.razorpayPaymentId === input.razorpayPaymentId
  ) {
    return {
      success: true,
      status: "PAID",
      referenceId: donation.referenceId,
      paymentId: donation.razorpayPaymentId,
      orderId: donation.razorpayOrderId || input.razorpayOrderId,
      amountInRupees: donation.amount / 100,
      currency: donation.currency,
      causeTitle: donation.causeTitle,
      donorName: donation.isAnonymous ? "Anonymous Donor" : donation.donorName,
      isAnonymous: donation.isAnonymous,
      capturedAt: (donation.capturedAt || donation.updatedAt).toISOString(),
      isDuplicate: true,
    };
  }

  // 1. Signature Verification
  const isValidSignature = verifyPaymentSignature({
    orderId: input.razorpayOrderId,
    paymentId: input.razorpayPaymentId,
    signature: input.razorpaySignature,
  });

  if (!isValidSignature) {
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: DonationStatus.FAILED,
        failedAt: new Date(),
      },
    });
    throw new Error(
      "Payment verification failed: Invalid cryptographic payment signature."
    );
  }

  // 2. Live payment status verification via Razorpay API
  const razorpay = getRazorpayClient();
  let paymentDetails;

  try {
    paymentDetails = await razorpay.payments.fetch(input.razorpayPaymentId);
  } catch (err) {
    console.error("Razorpay payment fetch error:", err);
    throw new Error(
      "Failed to verify payment status with payment gateway. Please contact support."
    );
  }

  // Confirm payment ownership & attributes
  if (paymentDetails.order_id !== donation.razorpayOrderId) {
    throw new Error(
      "Payment does not correspond to the expected Razorpay order."
    );
  }

  if (paymentDetails.currency !== donation.currency) {
    throw new Error("Payment currency mismatch detected.");
  }

  if (Number(paymentDetails.amount) !== donation.amount) {
    throw new Error("Payment amount mismatch detected.");
  }

  // Check captured status
  let finalStatus = paymentDetails.status;
  if (finalStatus === "authorized") {
    // Attempt automatic capture if payment was authorized but not auto-captured
    try {
      const capturedPayment = await razorpay.payments.capture(
        input.razorpayPaymentId,
        donation.amount,
        donation.currency
      );
      finalStatus = capturedPayment.status;
    } catch (captureErr) {
      console.error("Failed to capture authorized payment:", captureErr);
    }
  }

  if (finalStatus === "failed") {
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: DonationStatus.FAILED,
        failedAt: new Date(),
        razorpayPaymentId: input.razorpayPaymentId,
        razorpaySignature: input.razorpaySignature,
      },
    });
    throw new Error(
      "Payment was marked as failed or was declined by the bank. Please try again."
    );
  }

  if (finalStatus !== "captured") {
    // Payment is authorized or created but not yet captured (pending status)
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        razorpayPaymentId: input.razorpayPaymentId,
        razorpaySignature: input.razorpaySignature,
      },
    });

    return {
      success: true,
      status: "PENDING",
      isPending: true,
      referenceId: donation.referenceId,
      paymentId: input.razorpayPaymentId,
      orderId: donation.razorpayOrderId || input.razorpayOrderId,
      amountInRupees: donation.amount / 100,
      currency: donation.currency,
      causeTitle: donation.causeTitle,
      donorName: donation.isAnonymous ? "Anonymous Donor" : donation.donorName,
      isAnonymous: donation.isAnonymous,
      capturedAt: null,
    };
  }

  // 3. Database transaction for status change & unique constraints
  const updatedDonation = await prisma.$transaction(async (tx) => {
    // Double check that another record hasn't attached this payment ID
    const existingWithPayment = await tx.donation.findFirst({
      where: {
        razorpayPaymentId: input.razorpayPaymentId,
        id: { not: donation.id },
      },
    });

    if (existingWithPayment) {
      throw new Error(
        "Payment ID has already been applied to another transaction."
      );
    }

    const capturedDate = new Date();
    return tx.donation.update({
      where: { id: donation.id },
      data: {
        status: DonationStatus.PAID,
        razorpayPaymentId: input.razorpayPaymentId,
        razorpaySignature: input.razorpaySignature,
        paymentMethod: paymentDetails.method || "online",
        capturedAt: capturedDate,
      },
    });
  });

  return {
    success: true,
    status: "PAID",
    referenceId: updatedDonation.referenceId,
    paymentId: updatedDonation.razorpayPaymentId || input.razorpayPaymentId,
    orderId: updatedDonation.razorpayOrderId || input.razorpayOrderId,
    amountInRupees: updatedDonation.amount / 100,
    currency: updatedDonation.currency,
    causeTitle: updatedDonation.causeTitle,
    donorName: updatedDonation.isAnonymous
      ? "Anonymous Donor"
      : updatedDonation.donorName,
    isAnonymous: updatedDonation.isAnonymous,
    capturedAt: (updatedDonation.capturedAt || new Date()).toISOString(),
  };
}

/**
 * Retrieve safe donation status for public results screen
 */
export async function getDonationStatus(
  referenceId: string
): Promise<SafeDonationStatus | null> {
  const donation = await prisma.donation.findUnique({
    where: { referenceId },
    select: {
      referenceId: true,
      status: true,
      amount: true,
      currency: true,
      causeId: true,
      causeTitle: true,
      donorName: true,
      isAnonymous: true,
      razorpayPaymentId: true,
      capturedAt: true,
      createdAt: true,
    },
  });

  if (!donation) return null;

  return {
    referenceId: donation.referenceId,
    status: donation.status,
    amountInRupees: donation.amount / 100,
    currency: donation.currency,
    causeId: donation.causeId,
    causeTitle: donation.causeTitle,
    donorName: donation.isAnonymous ? "Anonymous Donor" : donation.donorName,
    isAnonymous: donation.isAnonymous,
    paymentId: donation.razorpayPaymentId || undefined,
    capturedAt: donation.capturedAt?.toISOString(),
    createdAt: donation.createdAt.toISOString(),
  };
}

/**
 * Process incoming Razorpay webhook event safely and idempotently
 */
export async function processWebhookEvent(
  rawBody: string,
  signature: string
): Promise<{ processed: boolean; message: string }> {
  const isValid = verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    throw new Error("Invalid Razorpay webhook signature.");
  }

  const event = JSON.parse(rawBody);
  const eventName = event.event;

  if (eventName === "payment.captured" || eventName === "order.paid") {
    const payment = event.payload?.payment?.entity;
    if (!payment) {
      return { processed: false, message: "No payment entity found in event." };
    }

    const orderId = payment.order_id;
    const paymentId = payment.id;
    const donationReference = payment.notes?.donationReference;

    // Locate donation by orderId or referenceId
    const donation = await prisma.donation.findFirst({
      where: {
        OR: [
          { razorpayOrderId: orderId },
          ...(donationReference ? [{ referenceId: donationReference }] : []),
        ],
      },
    });

    if (!donation) {
      return {
        processed: false,
        message: `No matching donation found for order ${orderId}`,
      };
    }

    // If already marked PAID, return idempotently
    if (donation.status === DonationStatus.PAID) {
      return { processed: true, message: "Donation already marked as paid." };
    }

    // Verify amount in paise matches
    if (Number(payment.amount) !== donation.amount) {
      console.warn(
        `Webhook amount mismatch for donation ${donation.referenceId}: expected ${donation.amount}, received ${payment.amount}`
      );
      return { processed: false, message: "Payment amount mismatch." };
    }

    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: DonationStatus.PAID,
        razorpayPaymentId: paymentId,
        paymentMethod: payment.method || "online",
        capturedAt: new Date(payment.created_at * 1000 || Date.now()),
      },
    });

    return {
      processed: true,
      message: "Donation successfully confirmed paid.",
    };
  }

  if (eventName === "payment.failed") {
    const payment = event.payload?.payment?.entity;
    if (!payment || !payment.order_id) {
      return {
        processed: false,
        message: "No payment entity in failed event.",
      };
    }

    const donation = await prisma.donation.findFirst({
      where: { razorpayOrderId: payment.order_id },
    });

    if (donation && donation.status !== DonationStatus.PAID) {
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          status: DonationStatus.FAILED,
          failedAt: new Date(),
        },
      });
      return { processed: true, message: "Donation marked as failed." };
    }
  }

  return { processed: true, message: `Ignored unhandled event ${eventName}` };
}

/**
 * Admin: List donations with server-side pagination, search, status and date filtering
 */
export async function listAdminDonations(query: AdminDonationsQueryInput) {
  const { page, limit, search, status, startDate, endDate } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.DonationWhereInput = {};

  if (status && status !== "ALL") {
    where.status = status as DonationStatus;
  }

  if (search) {
    where.OR = [
      { referenceId: { contains: search, mode: "insensitive" } },
      { donorName: { contains: search, mode: "insensitive" } },
      { donorEmail: { contains: search, mode: "insensitive" } },
      { donorPhone: { contains: search, mode: "insensitive" } },
      { razorpayPaymentId: { contains: search, mode: "insensitive" } },
      { razorpayOrderId: { contains: search, mode: "insensitive" } },
    ];
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      // Include the end of the day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const [donations, total] = await Promise.all([
    prisma.donation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.donation.count({ where }),
  ]);

  // Compute aggregate metrics (total received amount is ONLY calculated from PAID donations)
  const [
    paidMetrics,
    confirmedCount,
    pendingCount,
    failedCount,
    totalAttempts,
  ] = await Promise.all([
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { status: DonationStatus.PAID },
    }),
    prisma.donation.count({ where: { status: DonationStatus.PAID } }),
    prisma.donation.count({
      where: {
        status: { in: [DonationStatus.PENDING, DonationStatus.ORDER_CREATED] },
      },
    }),
    prisma.donation.count({
      where: {
        status: { in: [DonationStatus.FAILED, DonationStatus.EXPIRED] },
      },
    }),
    prisma.donation.count(),
  ]);

  const totalPaidAmountRupees = (paidMetrics._sum.amount || 0) / 100;

  return {
    data: donations.map((d) => ({
      id: d.id,
      referenceId: d.referenceId,
      amountInRupees: d.amount / 100,
      currency: d.currency,
      frequency: d.frequency,
      status: d.status,
      causeId: d.causeId,
      causeTitle: d.causeTitle,
      donorName: d.donorName,
      donorEmail: d.donorEmail,
      donorPhone: d.donorPhone,
      panNumber: d.panNumber,
      isAnonymous: d.isAnonymous,
      consentUpdates: d.consentUpdates,
      address: [d.addressLine1, d.city, d.state, d.pincode]
        .filter(Boolean)
        .join(", "),
      message: d.message,
      razorpayOrderId: d.razorpayOrderId,
      razorpayPaymentId: d.razorpayPaymentId,
      paymentMethod: d.paymentMethod,
      capturedAt: d.capturedAt ? d.capturedAt.toISOString() : null,
      createdAt: d.createdAt.toISOString(),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    metrics: {
      totalReceivedAmount: totalPaidAmountRupees,
      confirmedCount,
      pendingCount,
      failedCount,
      totalAttempts,
    },
  };
}

/**
 * Admin: Get complete single donation record by ID or Reference
 */
export async function getAdminDonationById(idOrReference: string) {
  return prisma.donation.findFirst({
    where: {
      OR: [{ id: idOrReference }, { referenceId: idOrReference }],
    },
  });
}
