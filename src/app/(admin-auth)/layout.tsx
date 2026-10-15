import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AdminAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFCF5] text-[#492A22]">
      {/* Top minimal bar */}
      <header className="flex h-16 items-center justify-between border-b border-[#EADCCB] px-6 sm:px-12 bg-white/90 backdrop-blur">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-lg bg-white p-1 shrink-0 border border-[#EADCCB] shadow-2xs">
            <Image
              src="/logo.png"
              alt="Samartha Trust Logo"
              width={36}
              height={36}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#492A22] text-base tracking-tight leading-none">
              Samartha Trust
            </span>
            <span className="text-[11px] font-semibold text-[#F52232] leading-none mt-0.5">
              Admin Portal
            </span>
          </div>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-[#78685D] hover:text-[#F52232] transition-colors font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to public site</span>
        </Link>
      </header>

      {/* Main centered card */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#FFD21C]/20 via-[#FF8A00]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        {children}
      </main>

      {/* Bottom minimal note */}
      <footer className="py-4 text-center text-xs text-[#78685D] border-t border-[#EADCCB] bg-white">
        © 2026 Samartha Trust • Restricted Management Access
      </footer>
    </div>
  );
}
