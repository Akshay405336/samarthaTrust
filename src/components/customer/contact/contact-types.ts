import type { LucideIcon } from "lucide-react";
import type {
  InquiryType,
  FAQItem,
  BranchLocation,
} from "./contact-constants";

export type { InquiryType, FAQItem, BranchLocation };

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  subject: string;
  message: string;
}

export interface ContactInfoCardProps {
  title: string;
  value: string;
  secondaryValue?: string;
  href?: string;
  icon: LucideIcon;
  actionText?: string;
  external?: boolean;
}

export interface ContactBranchCardProps {
  branch: BranchLocation;
}
