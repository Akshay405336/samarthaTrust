/**
 * Client-side authenticated fetch wrapper with automatic session renewal,
 * concurrency deduplication, and safe redirection upon session expiration.
 */

let refreshPromise: Promise<boolean> | null = null;
const logoutListeners = new Set<() => void>();

/**
 * Resets client-side refresh state and triggers registered logout listeners
 * to clear any form or in-memory credentials immediately upon logout.
 */
export function resetClientAuthState(): void {
  refreshPromise = null;
  logoutListeners.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error("Error executing logout listener:", err);
    }
  });
}

/**
 * Registers a listener that fires whenever client-side auth state is reset (e.g., on logout).
 * Returns an unregister function.
 */
export function onClientLogout(listener: () => void): () => void {
  logoutListeners.add(listener);
  return () => {
    logoutListeners.delete(listener);
  };
}

async function executeRefresh(): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/auth/refresh", {
      method: "POST",
      credentials: "same-origin",
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    refreshPromise = null;
  }
}

/**
 * Ensures only one concurrent refresh request runs across parallel fetch operations.
 */
function getSharedRefreshPromise(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = executeRefresh();
  }
  return refreshPromise;
}

/**
 * Authenticated fetch helper for admin client components.
 * Automatically attempts session renewal if a 401 is received.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const requestInit: RequestInit = {
    ...init,
    credentials: init?.credentials || "same-origin",
  };

  const response = await fetch(input, requestInit);

  // If unauthorized, attempt token refresh and retry original request once
  if (response.status === 401) {
    const inputUrl = typeof input === "string" ? input : input.toString();

    // Do not attempt refresh on auth endpoints themselves to avoid infinite loops
    if (
      inputUrl.includes("/api/admin/auth/login") ||
      inputUrl.includes("/api/admin/auth/refresh") ||
      inputUrl.includes("/api/admin/auth/logout")
    ) {
      return response;
    }

    const refreshSuccess = await getSharedRefreshPromise();
    if (refreshSuccess) {
      // Retry the original request
      return fetch(input, requestInit);
    } else {
      // Refresh failed or session expired (7 days passed / revoked)
      if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/admin") &&
        window.location.pathname !== "/admin/login"
      ) {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = `/admin/login?from=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`;
      }
    }
  }

  return response;
}
