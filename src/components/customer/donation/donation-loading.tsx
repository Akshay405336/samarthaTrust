import * as React from "react";

export function DonationLoading() {
  return (
    <div className="min-h-screen bg-[#FAF5FF] py-12 animate-pulse">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Progress bar skeleton */}
        <div className="h-20 bg-[#FCE7F3]/60 rounded-2xl w-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main wizard box skeleton */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-[#EADDED] space-y-6">
            <div className="h-6 bg-[#FCE7F3]/60 rounded w-1/3" />
            <div className="h-12 bg-[#FAF5FF] rounded-xl w-full" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-[#FAF5FF] rounded-xl" />
              <div className="h-24 bg-[#FAF5FF] rounded-xl" />
              <div className="h-24 bg-[#FAF5FF] rounded-xl" />
              <div className="h-24 bg-[#FAF5FF] rounded-xl" />
            </div>
            <div className="h-14 bg-[#FCE7F3]/60 rounded-xl w-full" />
          </div>

          {/* Sidebar summary skeleton */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#EADDED] space-y-4">
            <div className="h-5 bg-[#FCE7F3]/60 rounded w-1/2" />
            <div className="h-8 bg-[#FAF5FF] rounded" />
            <div className="h-8 bg-[#FAF5FF] rounded" />
            <div className="h-12 bg-[#FCE7F3]/60 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
