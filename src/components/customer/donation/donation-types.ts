export type DonationFrequency = "one-time";

export interface DonationCause {
  id: string;
  title: string;
  shortDescription: string;
  iconName: string;
  badge?: string;
  isDefault?: boolean;
}

export interface DonorDetails {
  fullName: string;
  email: string;
  phone: string;
  panNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  message: string;
  isAnonymous: boolean;
  consentUpdates: boolean;
  agreedToTerms: boolean;
}

export type DonationStep = 1 | 2 | 3 | 4;

export interface DonationState {
  step: DonationStep;
  frequency: DonationFrequency;
  causeId: string;
  amount: number;
  customAmountInput: string;
  isCustomAmount: boolean;
  donor: DonorDetails;
  validationErrors: Record<string, string>;
  isSubmitting: boolean;
}

export interface RazorpayOrderResponse {
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

export interface RazorpayPaymentSuccessPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayPaymentSuccessPayload) => void;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
}

export interface PaymentHandoffPayload {
  preparedAt: string;
  referenceId: string;
  amount: number;
  formattedAmount: string;
  currency: string;
  frequency: DonationFrequency;
  causeId: string;
  causeTitle: string;
  donor: {
    fullName: string;
    email: string;
    phone: string;
    panNumber?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    };
    isAnonymous: boolean;
    consentUpdates: boolean;
    message?: string;
  };
}

export interface PaymentHandoffResult {
  success: boolean;
  sessionReference: string;
  handoffTimestamp: string;
  message: string;
}
