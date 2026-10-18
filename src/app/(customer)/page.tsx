import * as React from "react";

import { HeroSection } from "@/components/customer/hero-section";
import { AboutSection } from "@/components/customer/about-section";
import { ImpactSection } from "@/components/customer/ImpactSection";
import { HowYouCanHelpSection } from "@/components/customer/HowYouCanHelpSection";
import { LifeTransformedSection } from "@/components/customer/life-transformed-section";
import { TransparencySection } from "@/components/customer/transparency-section";
import { HomeBlogSection } from "@/components/customer/home-blog-section";

export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full flex-col bg-white">
      {/* Hero Banner */}
      <HeroSection />

      {/* About Us */}
      {/* <AboutSection /> */}

      {/* Impact */}
      <ImpactSection />

      {/* Ways to Help */}
      <HowYouCanHelpSection />

      {/* Community Stories */}
      <LifeTransformedSection />

      {/* Transparency and Governance */}
      <TransparencySection />

      {/* Latest Blogs: fetched by the existing blog component */}
      <React.Suspense fallback={<div className="min-h-48 w-full bg-white" />}>
        <HomeBlogSection />
      </React.Suspense>
    </main>
  );
}
