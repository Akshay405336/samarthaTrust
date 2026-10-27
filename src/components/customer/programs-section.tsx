"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Heart,
  Send,
  Sprout,
  Users,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CARD_STAGGER_MS = 120;
const CARD_BASE_DELAY_MS = 200;

const PROGRAM_LINK = "/contact";

type BackgroundProgramCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
  icon: React.ReactNode;
  minHeightClass?: string;
  className?: string;
  style?: React.CSSProperties;
};

function BackgroundProgramCard({
  title,
  description,
  imageSrc,
  imageAlt,
  imagePosition = "object-center",
  icon,
  minHeightClass = "min-h-[300px]",
  className,
  style,
}: BackgroundProgramCardProps) {
  return (
    <article
      className={cn(
        "group relative min-w-0 overflow-hidden rounded-[22px] border border-[#EADDED] shadow-[0_8px_24px_rgba(53,18,63,0.08)] transition-transform duration-300 hover:-translate-y-0.5",
        minHeightClass,
        className
      )}
      style={style}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
        className={cn(
          "object-cover transition-transform duration-700 group-hover:scale-[1.05]",
          imagePosition
        )}
      />

      {/* Bottom-only scrim: top of image stays clear */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-black/95 via-black/72 via-50% to-transparent"
      />

      <Link
        href={PROGRAM_LINK}
        aria-label={`Learn more about ${title}`}
        className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-black/55 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
      >
        <ArrowUpRight className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]" />
      </Link>

      <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-4 sm:p-5">
        <div className="mb-3 shrink-0">{icon}</div>
        <h3 className="text-lg font-bold leading-snug text-white sm:text-xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-white/88">{description}</p>
      </div>
    </article>
  );
}

function BrighterUnderline() {
  return (
    <svg
      className="absolute -bottom-1.5 left-0 h-2 w-full overflow-visible sm:-bottom-2"
      viewBox="0 0 140 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 9C40 2.5 100 2.5 138 8"
        stroke="url(#samartha-programs-underline)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="samartha-programs-underline"
          x1="0"
          y1="0"
          x2="140"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7100A8" />
          <stop offset=".48" stopColor="#9200A8" />
          <stop offset="1" stopColor="#E90078" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ProgramsSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [isInView, setIsInView] = React.useState(false);
  const [entranceActive, setEntranceActive] = React.useState(false);

  React.useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible =
          entry.isIntersecting && entry.intersectionRatio >= 0.15;
        setIsInView(visible);
      },
      { threshold: [0, 0.15, 0.35, 0.6] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!isInView) {
      setEntranceActive(false);
      return;
    }
    setEntranceActive(true);
  }, [isInView]);

  const reveal = (delay: number) =>
    cn("impact-reveal", entranceActive && "impact-reveal-active");

  return (
    <section
      ref={sectionRef}
      aria-labelledby="programs-heading"
      className="relative isolate overflow-hidden bg-white py-10 sm:py-12 lg:py-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FFFCFF] to-[#FAF5FF]" />
        <div className="absolute -left-24 top-[6%] h-72 w-72 rounded-full bg-[#E9D5FF]/40 blur-3xl" />
        <div className="absolute right-[-4%] top-[14%] h-64 w-64 rounded-full bg-[#FBCFE8]/35 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[22%] h-64 w-64 rounded-full bg-[#FCE7F3]/50 blur-3xl" />
      </div>

      <Container className="relative z-10">
        {/* Heading */}
        <div className="relative mx-auto max-w-3xl text-center">
          <Heart
            aria-hidden="true"
            className="pointer-events-none absolute -left-2 top-6 hidden h-9 w-9 rotate-[-12deg] text-[#E90078]/20 sm:left-[-8%] sm:block lg:left-[-12%]"
            strokeWidth={1.5}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-1 top-4 hidden sm:block lg:right-[-10%]"
          >
            <Send className="h-8 w-8 rotate-[12deg] text-[#9200A8]/25" strokeWidth={1.5} />
            <span className="mt-1 block border-t border-dashed border-[#9200A8]/20 w-16 rotate-[8deg] origin-left" />
          </div>

          <p
            className={cn(reveal(0))}
            style={{ animationDelay: "0ms" }}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9200A8] sm:text-xs">
              Our Programs
            </span>
          </p>

          <h2
            id="programs-heading"
            className={cn(
              reveal(60),
              "mt-3 text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.03em] text-[#35123F]"
            )}
            style={{ animationDelay: "60ms" }}
          >
            Programs That Create{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
                Brighter
              </span>
              <BrighterUnderline />
            </span>{" "}
            Futures
          </h2>

          <p
            className={cn(
              reveal(120),
              "mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[#75647B] sm:text-base"
            )}
            style={{ animationDelay: "120ms" }}
          >
            Our programs focus on education, child welfare, inclusion and
            community development, creating opportunities for every child to
            grow with dignity and confidence.
          </p>
        </div>

        {/* Asymmetric 4-card grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:items-stretch lg:gap-5 xl:gap-6">
          {/* Card 1 — Education Support (tall left) */}
          <article
            className={cn(
              reveal(CARD_BASE_DELAY_MS),
              "group relative min-h-[420px] overflow-hidden rounded-[22px] shadow-[0_14px_40px_rgba(113,0,168,0.14)] transition-transform duration-300 hover:-translate-y-0.5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:min-h-[520px]"
            )}
            style={{ animationDelay: `${CARD_BASE_DELAY_MS}ms` }}
          >
            <Image
              src="/images/Golden-Hour.png"
              alt="Schoolchildren smiling in a rural setting"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[58%_42%] transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-black/95 via-black/72 via-50% to-transparent"
            />

            <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-6 sm:p-7 lg:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
                <BookOpen className="h-5 w-5 text-[#7100A8]" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-white sm:text-[1.65rem]">
                Education Support
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/90 sm:text-[15px]">
                Empowering children through quality education, learning
                resources and holistic development opportunities.
              </p>
              <Button
                asChild
                className="mt-5 h-11 w-fit rounded-full bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] px-6 text-sm font-semibold text-white shadow-lg hover:brightness-110"
              >
                <Link href={PROGRAM_LINK} className="inline-flex items-center gap-2">
                  Explore Program
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute bottom-6 right-6 h-10 w-24 opacity-40"
                viewBox="0 0 96 40"
                fill="none"
              >
                <path
                  d="M4 32C28 8 52 28 92 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 6"
                />
              </svg>
            </div>
          </article>

          {/* Card 2 — Child Welfare (wide top-right) */}
          <BackgroundProgramCard
            title="Child Welfare"
            description="Providing safe residential care, healthcare and emotional support for children in need."
            imageSrc="/images/about/Tender-Mother-Child.png"
            imageAlt="Child learning in a supportive environment"
            imagePosition="object-cover object-[72%_center]"
            minHeightClass="min-h-[260px] sm:min-h-[280px]"
            className={cn(
              reveal(CARD_BASE_DELAY_MS + CARD_STAGGER_MS),
              "lg:col-start-2 lg:row-start-1"
            )}
            style={{
              animationDelay: `${CARD_BASE_DELAY_MS + CARD_STAGGER_MS}ms`,
            }}
            icon={
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md ring-1 ring-white/50">
                <Heart
                  className="h-5 w-5 text-[#E90078]"
                  fill="#E90078"
                  aria-hidden="true"
                />
              </div>
            }
          />

          {/* Cards 3 & 4 — bottom-right */}
          <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:col-start-2 lg:row-start-2">
            <BackgroundProgramCard
              title="Inclusive Communities"
              description="Promoting inclusion and awareness so every child can participate, learn, and belong."
              imageSrc="/images/programs/advocacy.png"
              imageAlt="Children learning together in an inclusive setting"
              imagePosition="object-cover object-[center_30%]"
              minHeightClass="min-h-[320px] lg:min-h-[300px]"
              className={reveal(CARD_BASE_DELAY_MS + CARD_STAGGER_MS * 2)}
              style={{
                animationDelay: `${CARD_BASE_DELAY_MS + CARD_STAGGER_MS * 2}ms`,
              }}
              icon={
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md ring-1 ring-white/50">
                  <Users className="h-5 w-5 text-[#059669]" aria-hidden="true" />
                </div>
              }
            />

            <BackgroundProgramCard
              title="Community Development"
              description="Building skills, livelihoods, and local partnerships for sustainable community growth."
              imageSrc="/images/programs/vocational.png"
              imageAlt="Community skills and development activities"
              imagePosition="object-cover object-[center_35%]"
              minHeightClass="min-h-[320px] lg:min-h-[300px]"
              className={reveal(CARD_BASE_DELAY_MS + CARD_STAGGER_MS * 3)}
              style={{
                animationDelay: `${CARD_BASE_DELAY_MS + CARD_STAGGER_MS * 3}ms`,
              }}
              icon={
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md ring-1 ring-white/50">
                  <Sprout className="h-5 w-5 text-[#9200A8]" aria-hidden="true" />
                </div>
              }
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
