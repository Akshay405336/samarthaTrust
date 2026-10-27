import { MIN_AMOUNT, MAX_AMOUNT } from "./donation-constants";
import type { DonorDetails, DonationFrequency } from "./donation-types";

/**
 * Format a numeric amount as Indian Rupees (₹) with standard Indian grouping (e.g., ₹1,00,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount < 0) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number according to the Indian numbering system without currency symbol
 */
export function formatNumberINR(amount: number): string {
  if (isNaN(amount) || amount < 0) return "0";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Validate Step 1 (one-time amount only; cause is fixed to general support)
 */
export function validateStep1(
  amount: number,
  frequency: DonationFrequency = "one-time"
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (frequency !== "one-time") {
    errors.frequency = "Only one-time contributions are supported.";
  }

  if (isNaN(amount) || amount < MIN_AMOUNT) {
    errors.amount = `Minimum contribution amount is ${formatINR(MIN_AMOUNT)}.`;
  } else if (amount > MAX_AMOUNT) {
    errors.amount = `Maximum contribution amount is ${formatINR(MAX_AMOUNT)}. For larger gifts, please reach out directly.`;
  }

  return errors;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const PHONE_DIGITS_REGEX = /^\+?[0-9\s\-()]{10,15}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

/**
 * Validate Step 2 (Donor Information)
 */
export function validateStep2(donor: DonorDetails): Record<string, string> {
  const errors: Record<string, string> = {};

  const trimmedName = donor.fullName.trim();
  if (!trimmedName) {
    errors.fullName = "Full name is required.";
  } else if (trimmedName.length < 2) {
    errors.fullName = "Please enter your full name (minimum 2 characters).";
  }

  const trimmedEmail = donor.email.trim();
  if (!trimmedEmail) {
    errors.email = "Email address is required for receipt delivery.";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email =
      "Please provide a valid email address (e.g. name@example.com).";
  }

  const trimmedPhone = donor.phone.trim();
  const digitsOnly = trimmedPhone.replace(/\D/g, "");
  if (!trimmedPhone) {
    errors.phone = "Phone number is required for transaction updates.";
  } else if (!PHONE_DIGITS_REGEX.test(trimmedPhone) || digitsOnly.length < 10) {
    errors.phone = "Please enter a valid 10-digit mobile or telephone number.";
  }

  const trimmedPan = donor.panNumber.trim().toUpperCase();
  if (trimmedPan.length > 0 && !PAN_REGEX.test(trimmedPan)) {
    errors.panNumber =
      "Please enter a valid 10-character Indian PAN (e.g. ABCDE1234F).";
  }

  const trimmedPincode = donor.pincode.trim();
  if (trimmedPincode.length > 0 && !PINCODE_REGEX.test(trimmedPincode)) {
    errors.pincode = "Please enter a valid 6-digit postal code.";
  }

  return errors;
}

/**
 * Validate Step 3 (Review confirmation)
 */
export function validateStep3(donor: DonorDetails): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!donor.agreedToTerms) {
    errors.agreedToTerms =
      "Please confirm that you agree to proceed with this donation.";
  }

  return errors;
}
