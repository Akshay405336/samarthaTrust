"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { getSafeRedirectUrl } from "@/lib/auth/redirect";
import { onClientLogout } from "@/lib/auth/client";
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

const initialFormData: LoginInput = {
  email: "",
  password: "",
};

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = React.useState<LoginInput>(initialFormData);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const resetForm = React.useCallback(() => {
    setFormData({ email: "", password: "" });
    setShowPassword(false);
    setErrors({});
    setGeneralError(null);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    const unsubscribe = onClientLogout(() => {
      resetForm();
    });

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        resetForm();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      unsubscribe();
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [resetForm]);

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
    if (generalError) {
      setGeneralError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setGeneralError(null);

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setGeneralError(data?.error || "Invalid email or password.");
        return;
      }

      // Immediately clear credentials from state before redirecting
      resetForm();

      // Safe redirect after successful authentication confirmed by server
      const fromParam = searchParams.get("from");
      const safeDestination = getSafeRedirectUrl(fromParam, "/admin");

      router.push(safeDestination);
      router.refresh();
    } catch {
      setGeneralError(
        "Network connection error. Please verify your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="border-[#EADDED] bg-white text-[#35123F] shadow-xl">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCE7F3]/60 p-2 border border-[#EADDED] shadow-2xs">
            <Image
              src="/logo.png"
              alt="Samartha Trust Logo"
              width={48}
              height={48}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#35123F] tracking-tight">
            Admin Sign In
          </CardTitle>
          <CardDescription className="text-[#75647B] text-xs">
            Samartha Trust Content & Operational Management Portal
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* General error message banner */}
          {generalError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
              <p className="font-medium leading-relaxed">{generalError}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
            autoComplete="off"
          >
            <div>
              <Label
                htmlFor="email"
                className="text-[#35123F] text-xs font-semibold uppercase tracking-wider"
              >
                Email Address
              </Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#75647B]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@samarthatrust.org"
                  className="pl-9 bg-white border-[#EADDED] text-[#35123F] placeholder:text-[#75647B]/60 focus-visible:ring-[#9200A8]"
                  aria-invalid={!!errors.email}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-[#DC2626] flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-[#35123F] text-xs font-semibold uppercase tracking-wider"
                >
                  Password
                </Label>
              </div>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#75647B]" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-9 pr-10 bg-white border-[#EADDED] text-[#35123F] placeholder:text-[#75647B]/60 focus-visible:ring-[#9200A8]"
                  aria-invalid={!!errors.password}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 p-0.5 text-[#75647B] hover:text-[#9200A8] transition-colors cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-[#DC2626] flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer"
            >
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
              className="text-xs text-[#75647B] hover:text-[#9200A8] transition-colors font-medium"
            >
              Return to public customer website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminLoginContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  return <AdminLoginForm key={from} />;
}

export default function AdminLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="w-full max-w-md h-96 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#9200A8] border-t-transparent" />
        </div>
      }
    >
      <AdminLoginContent />
    </React.Suspense>
  );
}
