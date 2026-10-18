
import type { Metadata } from "next";
import { AboutBanner } from "@/components/customer/about-us/about-banner";
import { AboutHeroSection } from "@/components/customer/about-us/about-hero-section";
import { TeamSection } from "@/components/customer/team-section";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Samartha Trust, our mission, and our commitment to inclusive education, healthcare, and community support.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutBanner />
      
      <AboutHeroSection />

      <TeamSection
        badge="Our People"
        title="Our Leadership &"
        highlight="Trustees"
        description="The dedicated stewards, trustees, and leaders guiding our mission of transparent social impact and community empowerment."
        showCategoryTabs={true}
      />
    </main>
  );
}
