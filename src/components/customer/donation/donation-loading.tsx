import * as React from "react";

import { Container } from "@/components/shared/container";

export function DonationLoading() {
  return (
    <div className="relative min-h-screen animate-pulse">
      <Container>
        <div className="customer-page-top space-y-8 pb-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <div className="h-8 w-40 rounded-full bg-[#FCE7F3]/70" />
              <div className="h-12 w-full max-w-lg rounded-xl bg-[#FCE7F3]/60" />
              <div className="h-20 w-full max-w-2xl rounded-xl bg-[#FAF5FF]" />
            </div>
            <div className="lg:col-span-5">
              <div className="mx-auto h-56 w-full max-w-md rounded-2xl bg-[#FCE7F3]/50 sm:h-64" />
            </div>
          </div>

          <div className="h-20 w-full rounded-2xl bg-[#FCE7F3]/60" />

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="min-w-0 space-y-6 rounded-2xl border border-[#EADDED] bg-white/80 p-6 sm:p-8 lg:col-span-8">
              <div className="h-6 w-1/3 rounded bg-[#FCE7F3]/60" />
              <div className="h-12 w-full rounded-xl bg-[#FAF5FF]" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 rounded-xl bg-[#FAF5FF]" />
                <div className="h-24 rounded-xl bg-[#FAF5FF]" />
                <div className="h-24 rounded-xl bg-[#FAF5FF]" />
                <div className="h-24 rounded-xl bg-[#FAF5FF]" />
              </div>
              <div className="h-14 w-full rounded-xl bg-[#FCE7F3]/60" />
            </div>

            <div className="min-w-0 space-y-4 rounded-2xl border border-[#EADDED] bg-white/80 p-6 lg:col-span-4">
              <div className="h-5 w-1/2 rounded bg-[#FCE7F3]/60" />
              <div className="h-8 rounded bg-[#FAF5FF]" />
              <div className="h-8 rounded bg-[#FAF5FF]" />
              <div className="h-12 rounded-xl bg-[#FCE7F3]/60" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
