"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, Info } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState<LoginInput>({
    email: "admin@samarthatrust.org",
    password: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    setErrors({});
    // In this foundation phase, navigate to the admin dashboard prototype
    setTimeout(() => {
      setLoading(false);
      router.push("/admin");
    }, 400);
  };

  return (
    <div className="w-full max-w-md">
      <Card className="border-[#EADCCB] bg-white text-[#492A22] shadow-xl">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF5E6] p-2 border border-[#EADCCB] shadow-2xs">
            <Image
              src="/logo.png"
              alt="Samartha Trust Logo"
              width={48}
              height={48}
              className="h-full w-full object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#492A22] tracking-tight">
            Admin Sign In
          </CardTitle>
          <CardDescription className="text-[#78685D] text-xs">
            Samartha Trust Content & Operational Management Portal
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Foundation note banner */}
          <div className="rounded-lg border border-[#EADCCB] bg-[#FFF5E6] p-3 text-xs text-[#492A22] flex items-start gap-2.5">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-[#FF8A00]" />
            <p className="text-[#78685D] leading-relaxed">
              <strong className="text-[#492A22]">Foundation Stage:</strong>{" "}
              Server-side authentication and database password verification will
              be connected in subsequent steps.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <Label
                htmlFor="email"
                className="text-[#492A22] text-xs font-semibold uppercase tracking-wider"
              >
                Email Address
              </Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#78685D]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@samarthatrust.org"
                  className="pl-9 bg-white border-[#EADCCB] text-[#492A22] placeholder:text-[#78685D]/60 focus-visible:ring-[#F52232]"
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-[#F52232] flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-[#492A22] text-xs font-semibold uppercase tracking-wider"
                >
                  Password
                </Label>
                <span className="text-[11px] text-[#F52232] font-medium">
                  Super Admin Seeded
                </span>
              </div>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#78685D]" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-9 bg-white border-[#EADCCB] text-[#492A22] placeholder:text-[#78685D]/60 focus-visible:ring-[#F52232]"
                  aria-invalid={!!errors.password}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-[#F52232] flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <span className="flex items-center justify-center gap-2">
                <span>
                  {loading ? "Signing in..." : "Enter Admin Dashboard"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-[#78685D] hover:text-[#F52232] transition-colors font-medium"
            >
              Return to public customer website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
