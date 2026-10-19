import { Container } from "@/components/shared/container";

export function BlogListSkeleton() {
  return (
    <section className="bg-white py-8 sm:py-12 lg:py-14">
      <Container>
        <div className="mb-8 animate-pulse overflow-hidden rounded-2xl border border-[#EFE4DA] sm:rounded-3xl">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="aspect-[16/9] bg-[#F7EFE7] lg:aspect-auto" />
            <div className="space-y-5 p-5 sm:p-8">
              <div className="h-5 w-36 rounded-full bg-[#F0E5D9]" />
              <div className="h-8 w-4/5 rounded-lg bg-[#F0E5D9]" />
              <div className="h-4 w-full rounded bg-[#F7EFE7]" />
              <div className="h-4 w-3/4 rounded bg-[#F7EFE7]" />
              <div className="h-10 w-36 rounded-xl bg-[#F0E5D9]" />
            </div>
          </div>
        </div>

        <div className="mb-7 flex animate-pulse flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="h-10 rounded-xl bg-[#F7EFE7] sm:w-2/3" />
          <div className="h-10 rounded-xl bg-[#F7EFE7] sm:w-64" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-2xl border border-[#EFE4DA]"
            >
              <div className="aspect-[16/9] bg-[#F7EFE7]" />
              <div className="space-y-4 p-5">
                <div className="h-4 w-28 rounded bg-[#F0E5D9]" />
                <div className="h-6 w-full rounded bg-[#F0E5D9]" />
                <div className="h-4 w-full rounded bg-[#F7EFE7]" />
                <div className="h-4 w-2/3 rounded bg-[#F7EFE7]" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
