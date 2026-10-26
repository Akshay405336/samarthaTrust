import * as React from "react";
import Image from "next/image";
import { Heart, ShieldCheck, Award } from "lucide-react";

export function DonationHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF5FF] via-white to-[#FAF5FF] pt-10 pb-8 sm:pt-14 sm:pb-12 border-b border-[#EADDED]">
      {/* Decorative ambient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#E90078]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#7100A8]/10 blur-3xl"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FCE7F3]/60 border border-[#EADDED] text-[#9200A8] text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-[#9200A8]" />
              <span>We Believe in Abilities</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#35123F] tracking-tight leading-[1.15]">
              Your Kindness Can{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078]">
                Change a Life
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#75647B] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Every contribution directly empowers children with special needs,
              funds educational materials, and provides essential healthcare for
              underprivileged families across Bengaluru and surrounding
              communities.
            </p>

            {/* Quick highlights */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-[#35123F]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Direct Community Impact</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#FCE7F3] flex items-center justify-center text-[#9200A8]">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <span>Official Receipt Provided</span>
              </div>
            </div>
          </div>

          {/* Visual card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md rounded-2xl overflow-hidden border border-[#EADDED] shadow-lg bg-white p-2">
              <div className="relative h-56 sm:h-64 w-full rounded-xl overflow-hidden bg-[#FAF5FF]">
                <Image
                  src="/images/about/Joyful-Inclusive.png"
                  alt="Children smiling at Samartha Trust activity center"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, 420px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#FCE7F3]">
                    Together for Children
                  </p>
                  <p className="text-sm font-bold leading-tight">
                    Fostering an inclusive tomorrow where every child thrives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
