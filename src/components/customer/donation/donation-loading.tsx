import * as React from "react";

export function DonationLoading() {
  return (
    <div className="min-h-screen bg-[#FFFCF5] py-12 animate-pulse">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Progress bar skeleton */}
        <div className="h-20 bg-stone-200/70 rounded-2xl w-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main wizard box skeleton */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 space-y-6">
            <div className="h-6 bg-stone-200/70 rounded w-1/3" />
            <div className="h-12 bg-stone-200/50 rounded-xl w-full" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-stone-200/40 rounded-xl" />
              <div className="h-24 bg-stone-200/40 rounded-xl" />
              <div className="h-24 bg-stone-200/40 rounded-xl" />
              <div className="h-24 bg-stone-200/40 rounded-xl" />
            </div>
            <div className="h-14 bg-stone-200/60 rounded-xl w-full" />
          </div>

          {/* Sidebar summary skeleton */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-stone-200 space-y-4">
            <div className="h-5 bg-stone-200/70 rounded w-1/2" />
            <div className="h-8 bg-stone-200/50 rounded" />
            <div className="h-8 bg-stone-200/50 rounded" />
            <div className="h-12 bg-stone-200/70 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
