import type { DonationCause } from "./donation-types";

/** All public donations use general support (no per-cause picker on the site). */
export const DEFAULT_DONATION_CAUSE_ID = "general" as const;

export const DONATION_CAUSES: DonationCause[] = [
  {
    id: DEFAULT_DONATION_CAUSE_ID,
    title: "General Support & Urgent Needs",
    shortDescription:
      "Funds are directed to areas with the highest urgency across our active community initiatives.",
    iconName: "Users",
    isDefault: true,
  },
];

export function getDonationCauseTitle(
  causeId: string = DEFAULT_DONATION_CAUSE_ID
): string {
  return (
    DONATION_CAUSES.find((c) => c.id === causeId)?.title ??
    DONATION_CAUSES[0].title
  );
}

export const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000] as const;

export const DEFAULT_AMOUNT = 2000;
export const MIN_AMOUNT = 100;
export const MAX_AMOUNT = 1000000;

export interface WizardStepInfo {
  step: number;
  label: string;
  shortTitle: string;
  description: string;
}

export const WIZARD_STEPS: WizardStepInfo[] = [
  {
    step: 1,
    label: "Step 1",
    shortTitle: "Donation",
    description: "Choose Amount",
  },
  {
    step: 2,
    label: "Step 2",
    shortTitle: "Details",
    description: "Contact Info",
  },
  {
    step: 3,
    label: "Step 3",
    shortTitle: "Review",
    description: "Verify & Confirm",
  },
  {
    step: 4,
    label: "Step 4",
    shortTitle: "Payment",
    description: "Handoff Status",
  },
];

export interface TrustPillar {
  title: string;
  description: string;
  iconName: "ShieldCheck" | "HeartHandshake" | "CheckCircle2";
}

export const TRUST_PILLARS: TrustPillar[] = [
  {
    title: "Complete Transparency",
    description:
      "Every contribution directly serves community programs. Clear receipts and transparent reporting ensure integrity.",
    iconName: "ShieldCheck",
  },
  {
    title: "Direct Community Impact",
    description:
      "We believe in abilities. Your kindness empowers children and individuals with special needs to thrive with dignity.",
    iconName: "HeartHandshake",
  },
  {
    title: "Registered Public Trust",
    description:
      "Samartha Trust is an officially registered Public Charitable Trust based in Bengaluru, Karnataka, India.",
    iconName: "CheckCircle2",
  },
];

export interface DonationFAQItem {
  question: string;
  answer: string;
}

export const DONATION_FAQS: DonationFAQItem[] = [
  {
    question: "How will my donation be utilized?",
    answer:
      "Your donation supports Samartha Trust programs where community needs are most pressing—assistive devices, school tuition, nutritious meals, therapy sessions, and other urgent welfare initiatives across Bengaluru and surrounding areas.",
  },
  {
    question: "Will I receive a receipt for my donation?",
    answer:
      "Yes. An official acknowledgement receipt is generated with your donation details and sent directly to your registered email address upon completion.",
  },
  {
    question: "What payment methods will be supported?",
    answer:
      "Once our payment gateway handoff goes live with our certified processor, you will be able to contribute using UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking across major Indian banks, and all standard RuPay, Visa, and MasterCard Debit & Credit Cards.",
  },
  {
    question: "Can I make multiple donations?",
    answer:
      "Yes! All donations made through our portal are direct one-time contributions. You can contribute whenever you wish to support an ongoing initiative or urgent need. Each gift is individually processed and acknowledged.",
  },
  {
    question: "Can I donate anonymously?",
    answer:
      "Yes, you can check the 'Make this donation anonymously' box during step 2. Your contribution will be accounted for in our financial records, but your name will never be published publicly or in donor recognition reports.",
  },
  {
    question:
      "How can I contact Samartha Trust regarding donations or offline transfers?",
    answer:
      "Our team is happy to assist you. You can email us at info@samarthatrust.org or reach us by phone at +91 (0) 80 2345 6789. We welcome conversations regarding bank NEFT/RTGS transfers, corporate partnerships, or visiting our center in Bengaluru.",
  },
];
