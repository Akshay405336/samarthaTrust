import { Container } from "@/components/shared/container";

export function GallerySkeleton() {
  return (
    <section className="relative bg-gradient-to-br from-[#EDE9FE]/30 to-[#FCE7F3]/40 py-10 sm:py-14 lg:py-16">
      <div
        aria-hidden="true"
        className="works-grid-bg pointer-events-none absolute inset-0 opacity-50"
      />
      <Container className="relative">
        <div className="mb-8 h-20 animate-pulse rounded-2xl bg-white/60" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-[#EADDED] bg-gradient-to-br from-[#EDE9FE]/40 to-[#FCE7F3]/30 p-[2px] animate-pulse"
            >
              <div className="aspect-[4/3] w-full rounded-[10px] bg-[#FAF5FF]" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
