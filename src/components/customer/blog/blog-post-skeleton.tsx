import { Container } from "@/components/shared/container";

export function BlogPostSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-[#EFE5DC] py-3">
        <Container>
          <div className="h-4 w-56 animate-pulse rounded bg-[#F4E9DF]" />
        </Container>
      </div>

      <Container className="max-w-4xl py-10 sm:py-14">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-36 rounded-full bg-[#F4E9DF]" />
          <div className="h-10 w-full max-w-3xl rounded-lg bg-[#F4E9DF]" />
          <div className="h-10 w-3/4 rounded-lg bg-[#F4E9DF]" />

          <div className="flex gap-5 border-y border-[#EFE5DC] py-5">
            <div className="h-10 w-28 rounded-lg bg-[#F7EFE7]" />
            <div className="h-10 w-32 rounded-lg bg-[#F7EFE7]" />
            <div className="h-10 w-24 rounded-lg bg-[#F7EFE7]" />
          </div>

          <div className="aspect-[16/9] rounded-2xl bg-[#F7EFE7]" />

          <div className="space-y-3 pt-5">
            <div className="h-4 rounded bg-[#F7EFE7]" />
            <div className="h-4 rounded bg-[#F7EFE7]" />
            <div className="h-4 w-4/5 rounded bg-[#F7EFE7]" />
          </div>
        </div>
      </Container>
    </main>
  );
}
