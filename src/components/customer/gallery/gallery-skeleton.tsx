import { Container } from "@/components/shared/container";

export function GallerySkeleton() {
  return (
    <section className="bg-white py-10 sm:py-14 lg:py-16">
      <Container>
        {/* Categories skeleton */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-9 w-28 animate-pulse rounded-full bg-[#FAF5FF] border border-[#EADDED]"
            />
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-2xl border border-[#EADDED] bg-white animate-pulse"
            >
              {/* Image thumbnail skeleton */}
              <div className="aspect-[4/3] w-full bg-[#FAF5FF]" />

              {/* Card content skeleton */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-24 rounded-full bg-[#FCE7F3]/60" />
                  <div className="h-4 w-16 rounded bg-[#FAF5FF]" />
                </div>
                <div className="h-6 w-3/4 rounded-md bg-[#FAF5FF]" />
                <div className="h-4 w-full rounded bg-[#FAF5FF]" />
                <div className="h-4 w-2/3 rounded bg-[#FAF5FF]" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
