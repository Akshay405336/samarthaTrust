import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";

export function AboutHeroSection() {
  return (
    <section className="overflow-hidden bg-white py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left content */}
          <div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#4B2B23] sm:text-4xl lg:text-5xl">
              We Believe Every Life Deserves{" "}
              <span className="bg-gradient-to-r from-[#FF303F] via-[#FF7A18] to-[#FFC928] bg-clip-text text-transparent">
                Hope &amp; Opportunity.
              </span>
            </h1>

            {/* About description */}
            <div className="mt-5 max-w-xl space-y-4 text-base leading-7 text-[#80685F] sm:text-lg sm:leading-8">
              <p>
                <span className="font-bold text-[#4B2B23]">
                  Samartha Trust{" "}
                </span>
                is a non-profit organization dedicated to supporting orphaned
                and specially-abled children by providing safe residential care,
                education, healthcare, and holistic development.
              </p>

              <p>
                Founded in 2019 in Bengaluru, the trust works to create a
                nurturing and inclusive environment where children can grow with
                dignity, confidence, and opportunity. Through structured care
                programs, community support, and education initiatives, Samartha
                Trust aims to empower vulnerable children and help them build
                independent and meaningful futures.
              </p>

              <p>
                Today, the organization supports{" "}
                <span className="font-bold text-[#4B2B23]">
                  72 children across three residential care centers
                </span>
                , ensuring they receive the care, stability, and opportunities
                every child deserves.
              </p>
            </div>
          </div>

          {/* Right image composition */}
          <div className="relative mx-auto w-full max-w-[590px] pb-8 pt-3 sm:pb-10">
            {/* Decorative dots */}
            <div className="absolute -left-1 top-7 z-0 grid grid-cols-4 gap-3">
              {Array.from({ length: 16 }).map((_, index) => (
                <span
                  key={index}
                  className="h-2 w-2 rounded-full bg-[#FF9F00]/70"
                />
              ))}
            </div>

            {/* Upper image */}
            <div className="relative z-10 ml-auto mr-1 h-[190px] w-[45%] overflow-hidden rounded-[36px] border-4 border-white bg-[#F5F0EB] shadow-sm sm:h-[255px]">
              <Image
                src="/images/about/Tender-Mother-Child.png"
                alt="Mother caring for her child"
                fill
                sizes="(max-width: 640px) 45vw, 260px"
                className="object-cover"
              />
            </div>

            {/* Main image */}
            <div className="relative z-0 -mt-[85px] mr-[13%] h-[300px] overflow-hidden rounded-bl-[38%] rounded-tl-xl rounded-br-xl bg-[#F5F0EB] sm:-mt-[125px] sm:h-[420px]">
              <Image
                src="/images/about/Joyful-Inclusive.png"
                alt="Children in the community"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 550px"
                className="object-cover"
              />
            </div>

            {/* Decorative circle */}
            <div className="absolute left-[7%] top-[32%] z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#FF512F] bg-white/90">
              <span className="h-3 w-3 rounded-full bg-[#FF512F]/30" />
            </div>

            {/* Decorative heart outline */}
            <svg
              aria-hidden="true"
              viewBox="0 0 120 110"
              fill="none"
              className="absolute -bottom-1 left-[7%] z-20 h-24 w-28 -rotate-12 text-[#FF9F00] sm:h-32 sm:w-36"
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
