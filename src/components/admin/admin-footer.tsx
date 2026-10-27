import * as React from "react";

export function AdminFooter() {
  const year = 2026;

  return (
    <footer className="border-t border-[#EADDED]/80 bg-white/80 px-4 py-3 text-[11px] text-[#75647B] sm:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-1 sm:flex-row">
        <p>© {year} Samartha Trust — Internal management console</p>
        <p className="text-[#75647B]/80">Secured admin session · PostgreSQL · Prisma</p>
      </div>
    </footer>
  );
}
