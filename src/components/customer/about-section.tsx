import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Target, Eye, ChevronsRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { getAssetUrl } from "@/lib/utils/asset-version";

export function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      className="relative w-full overflow-hidden border-b border-[#EADCCB]/60 bg-white py-8 sm:py-10 lg:py-8"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[48%_52%] lg:gap-0">
          {/* Left: Large rounded image */}
          <div className="relative w-full min-w-0 lg:pr-8">
            <div className="relative aspect-square w-full overflow-hidden rounded-full">
              <Image
                src={getAssetUrl("/images/about/about-heart.png")}
                alt="Community members joining hands around a heart to support one another"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 48vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Right: About content */}
          <div className="flex min-w-0 flex-col justify-center gap-5 py-2 lg:pl-7 xl:gap-6">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <Heart
                className="h-3.5 w-3.5 shrink-0 fill-[#F4510B] text-[#F4510B]"
                aria-hidden="true"
              />
              <span className="text-[11px] font-semibold tracking-[0.12em] text-[#78685D] sm:text-xs sm:tracking-[0.15em]">
                About Us
              </span>
            </div>

            {/* Heading */}
            <h2
              id="about-heading"
              className="text-[clamp(2rem,3vw,3rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-[#492A22]"
            >
              We Believe This Life’s About Give For Poor People.
            </h2>

            {/* Description */}
            <p className="max-w-[580px] text-[15px] leading-7 text-[#78685D] sm:text-base lg:text-[17px]">
              Dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
              sit. The aspernaturaut odit aut fugit, sed quia consequuntur.
              Nonprofits around the world apply and join us to access more
              funding.
            </p>

            {/* Mission and Vision */}
            <div className="grid grid-cols-1 gap-5 pt-1 sm:grid-cols-2 sm:gap-4 xl:gap-6">
              {/* Mission */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#F5F0DF] text-[#26312D] sm:h-[76px] sm:w-[76px]">
                  <Target
                    className="h-11 w-11"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-snug text-[#492A22] sm:text-xl">
                    Our Mission
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#78685D] sm:text-base">
                    The World Apply And Join us to Access Funding.
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#F5F0DF] text-[#26312D] sm:h-[76px] sm:w-[76px]">
                  <Eye
                    className="h-11 w-11"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-snug text-[#492A22] sm:text-xl">
                    Our Vision
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#78685D] sm:text-base">
                    The World Apply And Join us to Access Funding.
                  </p>
                </div>
              </div>
            </div>

            {/* Explore More */}
            <div className="pt-1">
              <Link
                href="/about"
                className="group inline-flex h-[54px] items-center gap-2.5 rounded-full bg-[#F4510B] pl-2 pr-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#DE4504] hover:shadow-lg hover:shadow-[#F4510B]/20 active:scale-[0.98] sm:text-base"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#F4510B] transition-transform duration-300 group-hover:scale-105">
                  <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>Explore More</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
