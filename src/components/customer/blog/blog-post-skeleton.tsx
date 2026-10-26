import { Container } from "@/components/shared/container";

export function BlogPostSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-[#EADDED] py-3">
        <Container>
          <div className="h-4 w-56 animate-pulse rounded bg-[#FCE7F3]/60" />
        </Container>
      </div>

      <Container className="max-w-4xl py-10 sm:py-14">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-36 rounded-full bg-[#FCE7F3]/60" />
          <div className="h-10 w-full max-w-3xl rounded-lg bg-[#FCE7F3]/60" />
          <div className="h-10 w-3/4 rounded-lg bg-[#FCE7F3]/60" />

          <div className="flex gap-5 border-y border-[#EADDED] py-5">
            <div className="h-10 w-28 rounded-lg bg-[#FAF5FF]" />
            <div className="h-10 w-32 rounded-lg bg-[#FAF5FF]" />
            <div className="h-10 w-24 rounded-lg bg-[#FAF5FF]" />
          </div>

          <div className="aspect-[16/9] rounded-2xl bg-[#FAF5FF]" />

          <div className="space-y-3 pt-5">
            <div className="h-4 rounded bg-[#FAF5FF]" />
            <div className="h-4 rounded bg-[#FAF5FF]" />
            <div className="h-4 w-4/5 rounded bg-[#FAF5FF]" />
          </div>
        </div>
      </Container>
    </main>
  );
}
