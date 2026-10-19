export const CONTACT_OFFICE = {
  name: "Samartha Trust Registered Office",
  addressLine1: "No. 9, 6th Cross, B.K. Nagar",
  addressLine2: "Yeshwanthpur",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560022",
  fullAddress: "No. 9, 6th Cross, B.K. Nagar, Yeshwanthpur, Bengaluru, Karnataka 560022",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=No.+9,+6th+Cross,+B.K.+Nagar,+Yeshwanthpur,+Bengaluru,+Karnataka+560022",
  embedMapUrl:
    "https://maps.google.com/maps?q=No.+9,+6th+Cross,+B.K.+Nagar,+Yeshwanthpur,+Bengaluru,+Karnataka+560022&t=&z=15&ie=UTF8&iwloc=&output=embed",
};

export const CONTACT_EMAIL = "info@samarthatrust.org";

export const CONTACT_PHONE = {
  raw: "9740919104",
  display: "+91 97409 19104",
  tel: "+919740919104",
};

export interface BranchLocation {
  id: string;
  name: string;
  category: string;
  badge: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappMessage: string;
  whatsappUrl: string;
  googleMapsUrl: string;
}

export const BRANCH_LOCATIONS: BranchLocation[] = [
  {
    id: "boys-hostel",
    name: "Samartha Trust Dr. Raju's Boys Hostel",
    category: "Residential Care & Education",
    badge: "Boys Hostel",
    address:
      "#13/14, 80ft Road, Nagarbhavi Main Road, Chandra Layout, Bangalore - 560072",
    city: "Bangalore",
    pincode: "560072",
    phone: "9740919104",
    phoneDisplay: "+91 97409 19104",
    phoneTel: "+919740919104",
    whatsappMessage:
      "Hello Samartha Trust, I would like to enquire about the Boys Hostel.",
    whatsappUrl: `https://wa.me/919740919104?text=${encodeURIComponent(
      "Hello Samartha Trust, I would like to enquire about the Boys Hostel."
    )}`,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      "Samartha Trust Dr. Raju's Boys Hostel, #13/14, 80ft Road, Nagarbhavi Main Road, Chandra Layout, Bangalore - 560072"
    )}`,
  },
  {
    id: "tamil-kannada-school",
    name: "Samartha Trust Govt Tamil Kannada School",
    category: "Inclusive School & Learning",
    badge: "School Campus",
    address: "Anjanappa Gardens, Cottonpete, Bengaluru - 560053",
    city: "Bengaluru",
    pincode: "560053",
    phone: "9740919104",
    phoneDisplay: "+91 97409 19104",
    phoneTel: "+919740919104",
    whatsappMessage:
      "Hello Samartha Trust, I would like to enquire about the Govt Tamil Kannada School.",
    whatsappUrl: `https://wa.me/919740919104?text=${encodeURIComponent(
      "Hello Samartha Trust, I would like to enquire about the Govt Tamil Kannada School."
    )}`,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      "Samartha Trust Govt Tamil Kannada School, Anjanappa Gardens, Cottonpete, Bengaluru - 560053"
    )}`,
  },
  {
    id: "girls-home",
    name: "Samartha Trust Girl's Home",
    category: "Shelter, Protection & Growth",
    badge: "Girl's Home",
    address: "Govt Model School, Adugodi, Bengaluru - 560030",
    city: "Bengaluru",
    pincode: "560030",
    phone: "9740919104",
    phoneDisplay: "+91 97409 19104",
    phoneTel: "+919740919104",
    whatsappMessage:
      "Hello Samartha Trust, I would like to enquire about the Girl's Home.",
    whatsappUrl: `https://wa.me/919740919104?text=${encodeURIComponent(
      "Hello Samartha Trust, I would like to enquire about the Girl's Home."
    )}`,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      "Samartha Trust Girl's Home, Govt Model School, Adugodi, Bengaluru - 560030"
    )}`,
  },
];

export const INQUIRY_TYPES = [
  "General Inquiry",
  "Volunteering",
  "Donations & Receipts",
  "CSR & Institutional Partnerships",
  "Programs & Beneficiary Support",
  "Other",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export interface FAQItem {
  question: string;
  answer: string;
}

export const CONTACT_FAQS: FAQItem[] = [
  {
    question: "How can I contact Samartha Trust?",
    answer:
      "You can reach out to us by phone at +91 97409 19104, write directly to info@samarthatrust.org, or submit an inquiry using our online contact form. You may also visit our registered headquarters located in Yeshwanthpur, Bengaluru.",
  },
  {
    question: "How can I volunteer?",
    answer:
      "We enthusiastically welcome volunteers from all backgrounds—including students, doctors, therapists, teachers, and professionals. To get involved in our education sessions, disability welfare initiatives, or community health camps, simply choose 'Volunteering' as your inquiry type in the form and tell us about your skills and availability.",
  },
  {
    question: "How can I enquire about donations?",
    answer:
      "You can make direct, secure contributions anytime through our online donation portal at /donate. If you have inquiries about bank account NEFT/RTGS transfers, corporate CSR contributions, or 80G tax exemption receipts, please reach out via our contact form or email info@samarthatrust.org.",
  },
  {
    question: "How can an organization discuss a partnership?",
    answer:
      "Samartha Trust works closely with corporate CSR committees, healthcare institutions, and civic bodies to scale grassroots impact. To explore an institutional collaboration, choose 'CSR & Institutional Partnerships' in our contact form or email us with details of your organization and goals.",
  },
  {
    question: "What should I include in my message?",
    answer:
      "To help us connect you with the appropriate coordinator promptly, please include your full name, email address, mobile number, the nature of your inquiry (such as volunteering, CSR, donations, or community programs), and a brief outline of how we can assist or collaborate.",
  },
];
