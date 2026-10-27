import Image from "next/image";
import { HeroAnimatedContent } from "@/components/customer/hero-animated-content";

export function HeroSection() {
  return (
    <section className="relative isolate m-0 min-h-[620px] w-full overflow-hidden bg-[#17121b] p-0 sm:min-h-[660px] lg:min-h-[min(740px,100svh)]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/Golden-Hour.png"
          alt="Schoolchildren in a rural landscape at golden hour"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="hero-ken-burns object-cover object-[58%_42%] sm:object-[60%_40%] lg:object-[62%_38%]"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/50 via-[38%] to-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[75%] bg-gradient-to-r from-black/25 via-black/10 to-transparent"
      />

      <div className="customer-page-top relative z-10 mx-auto flex min-h-[620px] w-full max-w-[1720px] items-center px-5 pb-8 sm:min-h-[660px] sm:px-8 sm:pb-9 lg:min-h-[min(740px,100svh)] lg:px-14 lg:pb-8 xl:px-20">
        <HeroAnimatedContent />
      </div>
    </section>
  );
}
