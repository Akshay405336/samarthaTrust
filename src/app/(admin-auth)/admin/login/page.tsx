"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { getSafeRedirectUrl } from "@/lib/auth/redirect";
import { onClientLogout } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const initialFormData: LoginInput = {
  email: "",
  password: "",
};

const TRUST_PILLS = [
  { label: "Encrypted session", gradient: "from-[#6366F1] to-[#4F46E5]" },
  { label: "Staff only", gradient: "from-[#E90078] to-[#9200A8]" },
  { label: "Audit logged", gradient: "from-[#F59E0B] to-[#EA580C]" },
] as const;

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = React.useState<LoginInput>(initialFormData);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

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

      resetForm();

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

  const active = mounted;

  return (
    <div className="relative w-full">
      <div className="relative isolate min-w-0 overflow-hidden rounded-2xl border border-[#C4B5FD]/40 shadow-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#EDE9FE] via-[#FCE7F3] to-[#DBEAFE]"
        />
        <div
          aria-hidden="true"
          className="about-page-grid pointer-events-none absolute inset-0 opacity-45"
        />
        <div
          aria-hidden="true"
          className="help-orb pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#E90078]/25 blur-3xl"
          style={{ "--help-orb-duration": "17s" } as React.CSSProperties}
        />
        <div
          aria-hidden="true"
          className="help-orb pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#6366F1]/20 blur-3xl"
          style={
            {
              "--help-orb-duration": "20s",
              "--help-orb-delay": "400ms",
            } as React.CSSProperties
          }
        />
        <div
          aria-hidden="true"
          className="help-orb pointer-events-none absolute bottom-1/3 right-1/4 h-48 w-48 rounded-full bg-[#9200A8]/15 blur-3xl"
          style={
            {
              "--help-orb-duration": "22s",
              "--help-orb-delay": "800ms",
            } as React.CSSProperties
          }
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#6366F1] via-[#9200A8] to-[#E90078]"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-2">
        {/* Left — brand & copy */}
        <div className="relative flex flex-col justify-center border-b border-white/40 p-6 text-left sm:p-8 lg:border-b-0 lg:border-r lg:border-white/40 lg:p-10">
          <div
            className={cn(
              "motion-scale-in mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/60 bg-white/90 p-2 shadow-md backdrop-blur-sm sm:h-20 sm:w-20",
              active && "motion-active"
            )}
          >
            <Image
              src="/logo.png"
              alt="Samartha Trust Logo"
              width={64}
              height={64}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <div
            className={cn(
              "motion-fade-up mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#C4B5FD]/60 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6D28D9] shadow-xs",
              active && "motion-active"
            )}
            style={{ animationDelay: "80ms" }}
          >
            <ShieldCheck className="h-3 w-3" />
            Staff Portal
            <Sparkles className="h-3 w-3 text-[#E90078]" />
          </div>

          <h1 className="text-[clamp(1.65rem,3.5vw,2.25rem)] font-extrabold leading-[1.12] tracking-tight text-[#35123F]">
            <span
              className={cn(
                "help-heading-drop block",
                active && "help-heading-drop-active"
              )}
              style={{ animationDelay: "120ms" }}
            >
              Secure
            </span>
            <span
              className={cn(
                "help-heading-drop mt-0.5 block",
                active && "help-heading-drop-active"
              )}
              style={{ animationDelay: "200ms" }}
            >
              <span className="works-highlight bg-gradient-to-r from-[#6366F1] via-[#9200A8] to-[#E90078] bg-clip-text text-transparent">
                Admin Access
              </span>
            </span>
          </h1>

          <p
            className={cn(
              "motion-blur-in mt-3 max-w-md text-sm leading-relaxed text-[#75647B]",
              active && "motion-active"
            )}
            style={{ animationDelay: "280ms" }}
          >
            Sign in to manage content, donations, programs, and community updates
            for Samartha Trust. Authorized team members only.
          </p>

          <div
            className={cn(
              "motion-clip-up mt-6 flex flex-wrap gap-2",
              active && "motion-active"
            )}
            style={{ animationDelay: "360ms" }}
          >
            {TRUST_PILLS.map((pill, index) => (
              <span
                key={pill.label}
                className={cn(
                  "help-color-tile inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm",
                  pill.gradient
                )}
                style={
                  { "--help-tile-delay": `${index * 90}ms` } as React.CSSProperties
                }
              >
                {pill.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right — sign-in form */}
        <div className="relative flex flex-col justify-center bg-white/88 p-6 backdrop-blur-md sm:p-8 lg:p-10">
          <div
            className={cn(
              "motion-fade-up mb-5 rounded-2xl border border-[#FBCFE8]/70 bg-gradient-to-r from-[#FAF5FF] to-[#FDF2F8] p-4 shadow-sm lg:mb-6",
              active && "motion-active"
            )}
            style={{ animationDelay: "320ms" }}
          >
            <h2 className="text-lg font-bold text-[#35123F] sm:text-xl">Sign in</h2>
            <p className="mt-1 text-xs text-[#75647B] sm:text-sm">
              Use your admin email and password to continue.
            </p>
          </div>

          {generalError && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/95 p-3 text-xs text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <p className="font-medium leading-relaxed">{generalError}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4"
            noValidate
            autoComplete="off"
          >
            <div
              className={cn("motion-slide-left", active && "motion-active")}
              style={{ animationDelay: "400ms" }}
            >
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-[#35123F]"
              >
                Email Address
              </Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#9200A8]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@samarthatrust.org"
                  className="border-[#FBCFE8]/60 bg-white/90 pl-9 text-[#35123F] shadow-xs placeholder:text-[#75647B]/60 focus-visible:ring-[#9200A8]"
                  aria-invalid={!!errors.email}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#DC2626]">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div
              className={cn("motion-slide-right", active && "motion-active")}
              style={{ animationDelay: "480ms" }}
            >
              <Label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-[#35123F]"
              >
                Password
              </Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#9200A8]" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="border-[#FBCFE8]/60 bg-white/90 pl-9 pr-10 text-[#35123F] shadow-xs placeholder:text-[#75647B]/60 focus-visible:ring-[#9200A8]"
                  aria-invalid={!!errors.password}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 cursor-pointer rounded p-0.5 text-[#75647B] transition-colors hover:text-[#9200A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9200A8]"
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
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#DC2626]">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <div
              className={cn("motion-fade-up pt-1", active && "motion-active")}
              style={{ animationDelay: "560ms" }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="help-btn-gradient w-full cursor-pointer border-0 bg-gradient-to-r from-[#7100A8] via-[#9200A8] to-[#E90078] font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>
                    {loading ? "Signing in..." : "Enter Admin Dashboard"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </div>
          </form>

          <div className="mt-5 border-t border-[#EADDED] pt-4 sm:mt-6">
            <Link
              href="/"
              className="text-xs font-medium text-[#75647B] transition-colors hover:text-[#9200A8]"
            >
              Return to public customer website
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function AdminLoginContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  return <AdminLoginForm key={from} />;
}

function AdminLoginFallback() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-[#C4B5FD]/40 shadow-xl">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#EDE9FE] via-[#FCE7F3] to-[#DBEAFE]"
      />
      <div className="relative grid grid-cols-1 lg:grid-cols-2">
        <div className="animate-pulse space-y-4 border-b border-white/40 p-8 lg:border-b-0 lg:border-r lg:border-white/40">
          <div className="h-16 w-16 rounded-2xl bg-white/70" />
          <div className="h-5 w-32 rounded-full bg-white/60" />
          <div className="h-8 w-3/4 rounded-lg bg-white/50" />
        </div>
        <div className="animate-pulse space-y-4 bg-white/88 p-8 backdrop-blur-md">
          <div className="h-6 w-24 rounded bg-[#FCE7F3]/70" />
          <div className="h-10 w-full rounded-xl bg-white" />
          <div className="h-10 w-full rounded-xl bg-white" />
          <div className="h-11 w-full rounded-xl bg-[#EDE9FE]/80" />
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<AdminLoginFallback />}>
      <AdminLoginContent />
    </React.Suspense>
  );
}
