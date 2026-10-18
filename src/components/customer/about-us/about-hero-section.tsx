
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  HandCoins,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/shared/container";

export function AboutHeroSection() {
  return (
    <section className="overflow-hidden bg-white py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-7 w-1.5 rounded-full bg-[#FF572D]" />
              <span className="font-serif text-xl italic text-[#FF572D] sm:text-2xl">
                About Samartha Trust
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-[#153B32] sm:text-4xl lg:text-5xl">
              We Believe Every Life Deserves{" "}
              <span className="text-[#F4510B]">Hope & Opportunity.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#6C6C6C] sm:text-lg sm:leading-8">
              Samartha Trust works to create a more inclusive world by
              supporting children, individuals with disabilities, and
              underserved communities through education, healthcare, and
              opportunities for a better future.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Promoting accessible education, healthcare, and inclusive community support.",
                "Creating opportunities for dignity, independence, and sustainable livelihoods.",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#FF9800]" />
                  <p className="text-sm leading-7 text-[#686868] sm:text-base">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-6">
              <Link href="/programs" className="group inline-flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFA313] text-white transition-transform group-hover:scale-105">
                  <HandCoins className="h-6 w-6" />
                </span>
                <span className="text-lg font-bold text-[#153B32]">
                  Treatment Help
                </span>
              </Link>

              <Link href="/donate" className="group inline-flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF512F] text-white transition-transform group-hover:scale-105">
                  <HeartHandshake className="h-6 w-6" />
                </span>
                <span className="text-lg font-bold text-[#153B32]">
                  Start Donating
                </span>
              </Link>
            </div>

            <Link
              href="/contact"
              className="group mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-gradient-to-r from-[#FF8A26] to-[#F4510B] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-lg"
            >
              Connect With Us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-[590px] pb-8 pt-3 sm:pb-10">
            <div className="absolute -left-1 top-7 z-0 grid grid-cols-4 gap-3">
              {Array.from({ length: 16 }).map((_, index) => (
                <span
                  key={index}
                  className="h-2 w-2 rounded-full bg-[#45436E]/70"
                />
              ))}
            </div>

            <div className="relative z-10 ml-auto mr-1 h-[190px] w-[45%] overflow-hidden rounded-[36px] border-4 border-white bg-[#F0F0F0] shadow-sm sm:h-[255px]">
              <Image
                src="/images/about-mother-child.jpg"
                alt="Mother caring for her child"
                fill
                sizes="(max-width: 640px) 45vw, 260px"
                className="object-cover grayscale"
              />
            </div>

            <div className="relative z-0 -mt-[85px] mr-[13%] h-[300px] overflow-hidden rounded-bl-[38%] rounded-tl-xl rounded-br-xl bg-[#F0F0F0] sm:-mt-[125px] sm:h-[420px]">
              <Image
                src="/images/about-children.jpg"
                alt="Children in the community"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 550px"
                className="object-cover grayscale"
              />
            </div>

            <div className="absolute left-[7%] top-[32%] z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#FF512F] bg-white/90">
              <span className="h-3 w-3 rounded-full bg-[#FF512F]/30" />
            </div>

            <svg
              aria-hidden="true"
              viewBox="0 0 120 110"
              fill="none"
              className="absolute -bottom-1 left-[7%] z-20 h-24 w-28 -rotate-12 text-[#FFA313] sm:h-32 sm:w-36"
            >
              <path
                d="M60 100 C48 84 8 60 8 34 C8 10 37 3 59 29 C81 3 112 10 112 34 C112 60 72 84 60 100Z"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <Sparkles className="absolute bottom-16 right-1 h-6 w-6 text-[#FF512F]" />
          </div>
        </div>
      </Container>
    </section>
  );
}
