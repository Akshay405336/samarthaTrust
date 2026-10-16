"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth/client";

// Heartbeat interval: 10 minutes (well before the 15-minute access token expiry)
const HEARTBEAT_INTERVAL_MS = 10 * 60 * 1000;

export function AdminSessionMonitor() {
  const router = useRouter();

  React.useEffect(() => {
    const checkAndRenewSession = async () => {
      try {
        const res = await authFetch("/api/admin/auth/me");
        if (res.status === 401) {
          router.replace("/admin/login");
        }
      } catch {
        // Network errors will be retried on next interval or action
      }
    };

    // Set recurring renewal heartbeat
    const timer = setInterval(checkAndRenewSession, HEARTBEAT_INTERVAL_MS);

    // Also check on window focus when tab becomes active again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAndRenewSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  return null;
}
