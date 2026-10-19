import { Eye, HeartHandshake, Sparkles, Target } from "lucide-react";
import { Container } from "@/components/shared/container";

const items = [
  {
    label: "OUR VISION",
    title: "A world where every child belongs.",
    description:
      "To build an inclusive and compassionate society where every child, regardless of ability or background, has equal opportunities to grow, learn, and live with dignity.",
    icon: Eye,
    accent: "#FF6B35",
    soft: "bg-[#FFF0E8]",
  },
  {
    label: "OUR MISSION",
    title: "Care that creates possibilities.",
    description:
      "To provide safe residential care, quality education, healthcare, and rehabilitation support, empowering children to become confident, independent individuals.",
    icon: HeartHandshake,
    accent: "#E94743",
    soft: "bg-[#FFF0ED]",
  },
];

export function VisionMissionSection() {
  return (
    <section className="relative overflow-hidden bg-[#FCF9F6] py-8 sm:py-10 lg:py-12">
      <Container>
        {/* Section heading */}
        <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-9">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F5D9CA] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A75A3D]">
            <Sparkles className="h-3.5 w-3.5 text-[#FF8A26]" />
            What Guides Us
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-[#4B2B23] sm:text-3xl lg:text-4xl">
            Our Vision{" "}
            <span className="bg-gradient-to-r from-[#FF303F] via-[#FF7A18] to-[#FFC928] bg-clip-text text-transparent">
              &amp; Mission
            </span>
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#80685F]">
            Guided by dignity, inclusion, and a brighter future for every child.
          </p>
        </div>

        {/* Vision and mission cards */}
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="group relative overflow-hidden rounded-2xl border border-[#F0E6DF] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
              >
                {/* Left accent */}
                <div
                  className="absolute bottom-5 left-0 top-5 w-1 rounded-r-full"
                  style={{ backgroundColor: item.accent }}
                />

                {/* Label left, icon top-right */}
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="text-[10px] font-extrabold tracking-[0.18em]"
                    style={{ color: item.accent }}
                  >
                    {item.label}
                  </span>

                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.soft}`}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: item.accent }}
                      strokeWidth={1.8}
                    />
                  </span>
                </div>

                {/* Card content */}
                <div className="mt-4">
                  <h3 className="text-xl font-bold leading-snug text-[#4B2B23] sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#80685F] sm:text-base sm:leading-7">
                    {item.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className="h-1 w-6 rounded-full transition-all duration-300 group-hover:w-10"
                    style={{ backgroundColor: item.accent }}
                  />
                  <span className="text-[11px] font-semibold text-[#9A8277]">
                    Samartha Trust
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Closing accent */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="h-px w-7 bg-[#F1D9C9]" />
          <Target className="h-4 w-4 text-[#FF7A18]" />
          <span className="text-xs font-medium text-[#80685F]">
            One purpose. A brighter future.
          </span>
          <span className="h-px w-7 bg-[#F1D9C9]" />
        </div>
      </Container>
    </section>
  );
}
