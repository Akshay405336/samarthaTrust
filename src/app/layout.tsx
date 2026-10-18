import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://samarthatrust.org"
  ),
  title: {
    default: "Samartha Trust | We Believe In Abilities",
    template: "%s | Samartha Trust",
  },
  description:
    "Samartha Trust is a registered public charitable trust dedicated to empowering individuals with disabilities and underserved communities through education, healthcare, and sustainable livelihood programs.",
  keywords: [
    "Samartha Trust",
    "We Believe In Abilities",
    "NGO",
    "Charity",
    "Education",
    "Healthcare",
    "Disability Empowerment",
    "Community Development",
    "India",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased bg-white`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-foreground antialiased selection:bg-[#FFF5E6] selection:text-[#F52232]">
        {children}
      </body>
    </html>
  );
}
