
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";

export function AboutBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-[#151817] text-white">
      {/* Background image */}
      <Image
        src="/images/about/about-banner-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/75 to-[#10251f]/75" />

      <Container className="relative z-10">
        <div className="grid min-h-[400px] items-center gap-8 py-10 sm:min-h-[440px] sm:py-12 lg:min-h-[480px] lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 lg:py-12">
          {/* Left: heart-framed image */}
          <div className="relative mx-auto flex w-full max-w-[320px] items-center justify-center sm:max-w-[350px] lg:mx-0">
            <div className="relative aspect-square w-full">
              {/* Orange heart frame */}
              <svg
                viewBox="0 0 500 470"
                className="absolute inset-0 z-10 h-full w-full overflow-visible"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M250 425 C210 390 38 275 38 157 C38 77 132 35 198 91 C225 113 244 139 250 147 C256 139 275 113 302 91 C368 35 462 77 462 157 C462 275 290 390 250 425Z"
                  stroke="#FFA313"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M250 425 C210 390 38 275 38 157 C38 77 132 35 198 91 C225 113 244 139 250 147 C256 139 275 113 302 91 C368 35 462 77 462 157 C462 275 290 390 250 425Z"
                  stroke="#FF6B26"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="3 10"
                />
              </svg>

              {/* Photo clipped into the heart */}
              <svg
                viewBox="0 0 500 470"
                className="absolute inset-[5%] z-0 h-[90%] w-[90%]"
                aria-hidden="true"
              >
                <defs>
                  <clipPath id="about-banner-heart">
                    <path d="M250 425 C210 390 38 275 38 157 C38 77 132 35 198 91 C225 113 244 139 250 147 C256 139 275 113 302 91 C368 35 462 77 462 157 C462 275 290 390 250 425Z" />
                  </clipPath>
                </defs>

                <image
                  href="/images/about/hand.jpg"
                  width="500"
                  height="470"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#about-banner-heart)"
                />
              </svg>

              {/* Soft shadow */}
              <div className="absolute -bottom-1 left-1/2 h-8 w-2/3 -translate-x-1/2 rounded-full bg-black/40 blur-2xl" />
            </div>
          </div>

          {/* Right: banner content */}
          <div className="mx-auto max-w-[620px] lg:mx-0">
            <h1 className="text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:text-[56px]">
              Every People
              <br className="hidden sm:block" /> This Get Some{" "}
              <span className="text-[#FF512F]">Food.</span>
            </h1>

            <p className="mt-5 max-w-[560px] text-sm leading-6 text-white/85 sm:text-base sm:leading-7 lg:text-lg">
              Every child deserves care, dignity, and an opportunity to grow.
              Samartha Trust works to support vulnerable children through
              education, healthcare, and compassionate care.
            </p>

            {/* Gradient CTA */}
            <div className="mt-6 sm:mt-7">
              <Link
                href="/contact"
                className="group inline-flex min-h-11 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#FF303F] to-[#FF9F00] px-7 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-[#E92735] hover:to-[#F58A00] hover:shadow-lg sm:text-base"
              >
                Support Our Mission
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
