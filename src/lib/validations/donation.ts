import { z } from "zod";
import {
  MIN_AMOUNT,
  MAX_AMOUNT,
  DEFAULT_DONATION_CAUSE_ID,
} from "@/components/customer/donation/donation-constants";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

export const createDonationOrderSchema = z.object({
  amount: z
    .number({
      error: "Donation amount is required",
    })
    .int("Amount must be a whole number of rupees")
    .min(
      MIN_AMOUNT,
      `Minimum donation amount is ₹${MIN_AMOUNT.toLocaleString("en-IN")}`
    )
    .max(
      MAX_AMOUNT,
      `Maximum donation amount is ₹${MAX_AMOUNT.toLocaleString("en-IN")}`
    ),
  frequency: z.literal("one-time", {
    error: "Only one-time donations are supported",
  }),
  causeId: z.literal(DEFAULT_DONATION_CAUSE_ID).default(DEFAULT_DONATION_CAUSE_ID),
  donor: z.object({
    fullName: z
      .string({
        error: "Donor full name is required",
      })
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(120, "Full name cannot exceed 120 characters"),
    email: z
      .string({
        error: "Donor email is required",
      })
      .trim()
      .email("Please provide a valid email address"),
    phone: z
      .string({
        error: "Donor phone number is required",
      })
      .trim()
      .min(10, "Phone number must be at least 10 digits")
      .max(16, "Phone number cannot exceed 16 digits"),
    panNumber: z
      .string()
      .trim()
      .toUpperCase()
      .optional()
      .refine(
        (val) => !val || PAN_REGEX.test(val),
        "Invalid PAN format (e.g. ABCDE1234F)"
      ),
    addressLine1: z.string().trim().max(200).optional(),
    addressLine2: z.string().trim().max(200).optional(),
    city: z.string().trim().max(100).optional(),
    state: z.string().trim().max(100).optional(),
    pincode: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => !val || PINCODE_REGEX.test(val),
        "Pincode must be a 6-digit postal code"
      ),
    country: z.string().trim().max(100).default("India"),
    message: z.string().trim().max(1000).optional(),
    isAnonymous: z.boolean().default(false),
    consentUpdates: z.boolean().default(true),
  }),
});

export type CreateDonationOrderInput = z.infer<
  typeof createDonationOrderSchema
>;

export const verifyDonationPaymentSchema = z.object({
  donationReference: z
    .string({
      error: "Donation reference ID is required",
    })
    .trim()
    .min(5, "Invalid donation reference ID"),
  razorpayOrderId: z
    .string({
      error: "Razorpay order ID is required",
    })
    .trim()
    .min(5, "Invalid Razorpay order ID"),
  razorpayPaymentId: z
    .string({
      error: "Razorpay payment ID is required",
    })
    .trim()
    .min(5, "Invalid Razorpay payment ID"),
  razorpaySignature: z
    .string({
      error: "Razorpay signature is required",
    })
    .trim()
    .min(10, "Invalid Razorpay signature"),
});

export type VerifyDonationPaymentInput = z.infer<
  typeof verifyDonationPaymentSchema
>;

export const adminDonationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z
    .enum(["ALL", "PENDING", "ORDER_CREATED", "PAID", "FAILED", "EXPIRED"])
    .default("ALL"),
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
});

export type AdminDonationsQueryInput = z.infer<
  typeof adminDonationsQuerySchema
>;
