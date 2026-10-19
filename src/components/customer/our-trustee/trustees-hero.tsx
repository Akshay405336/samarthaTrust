
import { Container } from "@/components/shared/container";
import { getAssetUrl } from "@/lib/utils/asset-version";
import Image from "next/image";

export function TrusteesHero() {
  return (
    <section className="relative isolate m-0 w-full overflow-hidden bg-white py-8 sm:py-10 lg:py-12">
      {/* Soft warm glow, matching the homepage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-[32%] bg-gradient-to-l from-[#FFF3D8] via-[#FFF9EE]/60 to-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-0 -z-10 h-72 w-72 rounded-full bg-[#FFD21C]/15 blur-3xl"
      />

      <Container>
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          {/* Left content */}
          <div className="relative z-10 flex min-w-0 flex-col gap-5 sm:gap-6">
            {/* Eyebrow */}
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#78685D] sm:text-xs sm:tracking-[0.15em]">
              Leadership <span className="px-1">·</span> Trust
              <span className="px-1">·</span> Community
              <span className="px-1">·</span> A Brighter Tomorrow
            </p>

            {/* Main heading */}
            <h1 className="text-[clamp(2.5rem,4vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#492A22]">
              <span className="block">Meet the People</span>

              <span className="mt-1 block">
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#F52232] via-[#FF8A00] to-[#FFD21C] bg-clip-text text-transparent">
                    Behind
                  </span>

                  {/* Curved gradient underline */}
                  <svg
                    className="absolute -bottom-2 left-0 h-2.5 w-full overflow-visible"
                    viewBox="0 0 140 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient
                        id="trustees-hero-underline"
                        x1="0"
                        y1="0"
                        x2="140"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#F52232" />
                        <stop offset=".52" stopColor="#FF8A00" />
                        <stop offset="1" stopColor="#FFD21C" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M2 9C40 2.5 100 2.5 138 8"
                      stroke="url(#trustees-hero-underline)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                Our Trustees
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-[580px] text-[15px] leading-7 text-[#78685D] sm:text-base lg:text-[17px]">
              Meet the dedicated leaders guiding Samartha Trust with
              compassion, integrity, and a shared commitment to a brighter
              future for every child and community.
            </p>
          </div>

          {/* Right decorative image */}
          <div className="relative mx-auto w-full max-w-[400px] lg:ml-auto">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px]">
              <Image
                src={getAssetUrl("/images/a")}
                alt="Children and community members supported by Samartha Trust"
                fill
                priority
                unoptimized
                sizes="(max-width: 1023px) 100vw, 400px"
                className="object-cover object-center"
              />

              {/* Soft fade at the image edges */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#FF8A00]/15 via-transparent to-white/10"
              />
            </div>

            {/* Decorative accent */}
            <div
              aria-hidden="true"
              className="absolute -bottom-3 -left-3 -z-10 h-20 w-20 rounded-bl-[28px] rounded-tr-[28px] bg-gradient-to-br from-[#F52232] to-[#FFD21C] opacity-80"
            />
            <div
              aria-hidden="true"
              className="absolute -right-3 -top-3 -z-10 h-16 w-16 rounded-full bg-[#FFD21C]/30 blur-xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
