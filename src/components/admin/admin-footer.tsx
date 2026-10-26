import * as React from "react";

export function AdminFooter() {
  const year = 2026;

  return (
    <footer className="border-t border-[#EADDED] bg-white px-6 py-4 text-xs text-[#75647B]">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p>© {year} Samartha Trust — Internal Management Console.</p>
        <div className="flex items-center gap-4">
          <span>API: v0.1.0</span>
          <span>Next.js 16 (App Router)</span>
        </div>
      </div>
    </footer>
  );
}
