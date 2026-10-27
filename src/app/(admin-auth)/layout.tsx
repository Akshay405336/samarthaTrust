import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function AdminAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-white text-[#35123F]">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#EADDED] bg-white px-4 sm:h-16 sm:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 rounded-lg border border-[#EADDED] bg-white p-1 shadow-xs">
            <Image
              src="/logo.png"
              alt="Samartha Trust Logo"
              width={36}
              height={36}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-none tracking-tight text-[#35123F]">
              Samartha Trust
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold leading-none text-[#9200A8]">
              <ShieldCheck className="h-3 w-3" />
              Admin Portal
            </span>
          </div>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium text-[#75647B] transition-colors hover:text-[#9200A8]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to public site</span>
        </Link>
      </header>

      <main className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto overscroll-contain bg-white px-4 py-5 sm:px-8 sm:py-8">
        <div className="my-auto flex w-full max-w-5xl flex-col py-2">{children}</div>
      </main>

      <footer className="shrink-0 border-t border-[#EADDED] bg-white py-3 text-center text-[11px] text-[#75647B] sm:py-4 sm:text-xs">
        © 2026 Samartha Trust • Restricted Management Access
      </footer>
    </div>
  );
}
