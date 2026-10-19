import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Accessibility,
  HeartPulse,
  GraduationCap,
  Users,
} from "lucide-react";
import { Container } from "@/components/shared/container";

const programs = [
  {
    title: "Advocacy & Awareness",
    description:
      "Promoting inclusive communities by spreading awareness about disability rights.",
    image: "/images/programs/advocacy.png",
    category: "INCLUSION & EQUALITY",
    icon: Accessibility,
    accent: "#FF4938",
    iconBg: "bg-[#FFF0ED]",
  },
  {
    title: "Vocational Skills",
    description:
      "Helping children develop skills for independence and employment.",
    image: "/images/programs/vocational.png",
    category: "SKILLS & INDEPENDENCE",
    icon: GraduationCap,
    accent: "#FF8A18",
    iconBg: "bg-[#FFF3E5]",
  },
  {
    title: "Rehabilitation",
    description:
      "Providing therapy and healthcare for children with special needs.",
    image: "/images/programs/rehabilitation.png",
    category: "CARE & WELLBEING",
    icon: HeartPulse,
    accent: "#E94743",
    iconBg: "bg-[#FFF0ED]",
  },
  {
    title: "School Readiness",
    description:
      "Preparing children for education through structured learning.",
    image: "/images/programs/school-readiness.png",
    category: "LEARNING & GROWTH",
    icon: GraduationCap,
    accent: "#E99A00",
    iconBg: "bg-[#FFF6D9]",
  },
];

export function ProgramsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-14 lg:py-16">
      <Container>
        {/* Section heading */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F4510B]">
              <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-[#FF303F] to-[#FFC928]" />
              What We Do
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#4B2B23] sm:text-4xl lg:text-5xl">
              Our{" "}
              <span className="bg-gradient-to-r from-[#FF303F] via-[#FF7A18] to-[#FFC928] bg-clip-text text-transparent">
                Programs
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#80685F] sm:text-base">
              Supporting children through care, education, inclusion, and
              opportunities for independent living.
            </p>
          </div>

          <div className="hidden items-center gap-2 pb-1 text-sm font-semibold text-[#80685F] md:flex">
            <Users className="h-5 w-5 text-[#FF7A18]" />
            <span>Every child deserves an opportunity</span>
          </div>
        </div>

        {/* Program cards */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {programs.map((program) => {
            const Icon = program.icon;

            return (
              <article
                key={program.title}
                className="group relative overflow-hidden rounded-[22px] border border-[#F0E5DD] bg-white shadow-[0_8px_28px_rgba(75,43,35,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(75,43,35,0.10)]"
              >
                {/* Program image */}
                <div className="relative h-[210px] overflow-hidden bg-[#F4EDE7] sm:h-[190px] xl:h-[185px]">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5" />

                  {/* Icon badge */}
                  <div
                    className={`absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center rounded-xl ${program.iconBg} shadow-sm`}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: program.accent }}
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Category */}
                  <span className="absolute right-3 top-3 rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-[9px] font-bold tracking-[0.12em] text-white backdrop-blur-sm">
                    {program.category}
                  </span>
                </div>

                {/* Card content */}
                <div className="p-5 sm:p-5">
                  <div
                    className="mb-3 h-1 w-9 rounded-full transition-all duration-300 group-hover:w-14"
                    style={{ backgroundColor: program.accent }}
                  />

                  <h3 className="text-lg font-bold leading-snug text-[#4B2B23] transition-colors group-hover:text-[#E94743]">
                    {program.title}
                  </h3>

                  <p className="mt-2 min-h-[72px] text-sm leading-6 text-[#80685F]">
                    {program.description}
                  </p>

                  <div className="mt-4 border-t border-[#F2EAE4] pt-3">
                    <Link
                      href="/contact"
                      aria-label={`Enquire about ${program.title}`}
                      className="inline-flex items-center gap-2 text-sm font-bold transition-colors"
                      style={{ color: program.accent }}
                    >
                      Learn more
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
