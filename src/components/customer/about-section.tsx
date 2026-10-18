import * as React from "react";
import Image from "next/image";
import { Heart, Target, Eye } from "lucide-react";
import { Container } from "@/components/shared/container";
import { getAssetUrl } from "@/lib/utils/asset-version";

export function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      className="relative w-full overflow-hidden border-b border-[#EADCCB]/60 bg-white py-6 sm:py-8 lg:py-6"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[48%_52%] lg:gap-0">
          {/* Left: Circular image */}
          <div className="relative flex w-full min-w-0 justify-center lg:pr-8">
            <div className="relative aspect-square w-[80%] max-w-[420px] overflow-hidden rounded-full">
              <Image
                src={getAssetUrl("/images/about/hand.jpg")}
                alt="Community members joining hands around a heart to support one another"
                fill
                priority
                sizes="(max-width: 1023px) 80vw, 35vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Right: About content */}
          <div className="flex min-w-0 flex-col justify-center gap-4 py-1 lg:pl-7 xl:gap-5">
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
              At Samartha Trust, our mission is to provide a safe, nurturing,
              and supportive environment for children in need, including
              orphaned and specially-abled children. We strive to ensure access
              to quality education, proper healthcare, and emotional well-being.
            </p>

            {/* Mission and Vision */}
            <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2 sm:gap-4 xl:gap-5">
              {/* Mission */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full bg-[#F5F0DF] text-[#26312D] sm:h-[72px] sm:w-[72px]">
                  <Target
                    className="h-10 w-10"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-snug text-[#492A22] sm:text-lg">
                    Our Mission
                  </h3>
                  <p className="mt-1 text-[15px] leading-6 text-[#78685D] sm:text-base">
                    The World Apply And Join us to Access Funding.
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full bg-[#F5F0DF] text-[#26312D] sm:h-[72px] sm:w-[72px]">
                  <Eye
                    className="h-10 w-10"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-snug text-[#492A22] sm:text-lg">
                    Our Vision
                  </h3>
                  <p className="mt-1 text-[15px] leading-6 text-[#78685D] sm:text-base">
                    The World Apply And Join us to Access Funding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
