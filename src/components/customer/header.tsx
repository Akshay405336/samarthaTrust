"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/our-trustees", label: "Our Trustees" },
  { href: "/our-works", label: "Our Works" },
  { href: "/blog", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export function CustomerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-white/10 bg-black/35 text-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] backdrop-blur-[3px]">
      <Container className="flex h-[64px] items-center justify-between gap-3 sm:h-[70px] lg:h-[78px]">
        {/* Logo and motto */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 sm:gap-2.5"
          aria-label="Samartha Trust home"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="relative h-9 w-9 shrink-0 transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10 lg:h-11 lg:w-11">
            <Image
              src="/logo.png"
              alt="Samartha Trust Logo"
              width={48}
              height={48}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="whitespace-nowrap text-sm font-bold leading-tight tracking-tight text-white transition-colors group-hover:text-pink-200 sm:text-base lg:text-lg">
              Samartha Trust
            </span>
            <span className="mt-0.5 whitespace-nowrap text-[8px] font-semibold leading-none tracking-wide text-pink-200 sm:text-[10px]">
              We Believe In Abilities
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-0.5 lg:flex xl:gap-2"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative whitespace-nowrap px-2 py-2 text-sm transition-colors duration-200 xl:px-3 xl:text-[15px]",
                  isActive
                    ? "font-semibold text-white"
                    : "font-medium text-white/90 hover:text-white",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-[#9200A8] to-[#E90078] transition-transform duration-200 xl:left-3 xl:right-3",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop donation action */}
        <div className="hidden shrink-0 lg:block">
          <Button
            asChild
            className="group/donate h-10 rounded-full border border-white/15 bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] px-4 text-white shadow-md transition-all duration-200 hover:brightness-110 active:scale-[0.98] xl:h-11 xl:px-6"
          >
            <Link href="/donate" className="flex items-center gap-2">
              <span>Donations</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/donate:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Mobile and tablet actions */}
        <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
          <Button
            asChild
            size="sm"
            className="h-9 bg-gradient-to-r from-[#9200A8] to-[#E90078] px-3 text-white hover:brightness-110 sm:px-4"
          >
            <Link href="/donate" className="flex items-center gap-1.5">
              Donations
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-black/10 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 lg:hidden"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="customer-mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile and tablet menu */}
      {mobileMenuOpen && (
        <div
          id="customer-mobile-navigation"
          className="border-t border-white/10 bg-black/85 backdrop-blur-md lg:hidden"
        >
          <Container className="space-y-1 py-3">
            <nav aria-label="Mobile navigation" className="space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href ||
                      pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center rounded-lg border-l-2 px-4 py-2.5 text-sm transition-colors duration-200",
                      isActive
                        ? "border-pink-400 bg-white/[0.08] font-semibold text-white"
                        : "border-transparent text-white/85 hover:bg-white/[0.06] hover:text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
