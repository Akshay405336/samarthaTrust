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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <Container className="flex h-16 sm:h-[68px] items-center justify-between">
        {/* Official Logo & Motto */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="relative h-12 w-12 shrink-0 transition-transform group-hover:scale-102">
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
            <span className="text-lg font-bold tracking-tight text-[#492A22] sm:text-xl leading-tight group-hover:text-[#F52232] transition-colors">
              Samartha Trust
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-[#F52232] leading-none mt-0.5">
              We Believe In Abilities
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-2.5 lg:px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "text-brand-gradient font-semibold"
                    : "text-[#492A22] font-medium hover:text-brand-gradient"
                )}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2.5 right-2.5 lg:left-3 lg:right-3 h-0.5 bg-brand-gradient rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            className="hidden sm:inline-flex group/btn shadow-xs hover:shadow-md hover:brightness-105 active:scale-[0.98] transition-all duration-200 motion-reduce:transition-none motion-reduce:transform-none"
          >
            <Link href="/donate" className="gap-2">
              <span>Donations</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transform-none" />
            </Link>
          </Button>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-[#492A22] hover:bg-[#FFF5E6] md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-[#F52232]" />
            ) : (
              <Menu className="h-6 w-6 text-[#492A22]" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="bg-white md:hidden animate-in slide-in-from-top-2 duration-200 shadow-md">
          <Container className="py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block py-2 text-base transition-colors",
                    isActive
                      ? "text-brand-gradient font-semibold pl-3 border-l-2 border-[#F52232]"
                      : "text-[#492A22] font-medium hover:text-brand-gradient pl-3"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3">
              <Button
                asChild
                className="w-full group/btn shadow-xs hover:shadow-md hover:brightness-105 active:scale-[0.98] transition-all duration-200 motion-reduce:transition-none motion-reduce:transform-none"
              >
                <Link
                  href="/donate"
                  onClick={() => setMobileMenuOpen(false)}
                  className="gap-2 justify-center"
                >
                  <span>Donations</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transform-none" />
                </Link>
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
