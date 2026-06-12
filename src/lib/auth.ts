// RALD Dev Console — SSO auth client
// LILCKY STUDIO LIMITED

const AUTH_URL =
  (import.meta.env.VITE_RALD_AUTH_URL as string | undefined) ??
  "https://auth.rald.cloud";

// Sprint 3: canonical identity host is profiles.rald.cloud (ONE RALD)
const IDENTITY_URL =
  (import.meta.env.VITE_RALD_IDENTITY_URL as string | undefined) ??
  "https://profiles.rald.cloud";

const APP_ID = "rald-dev-console";

export function getLoginUrl(): string {
  const redirectTo = encodeURIComponent(window.location.origin + "/callback");
  return `${IDENTITY_URL}?app_id=${APP_ID}&redirect_to=${redirectTo}`;
}

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${AUTH_URL}${path}`, {
    method,
    credentials: "include",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as { error?: string }).error ?? "Request failed";
    throw new ApiError(res.status, msg);
  }
  return data as T;
}

export interface SessionResult {
  valid: boolean;
  user: {
    id: string;
    username?: string;
    email?: string;
    name?: string;
    role?: string;
    rald_internal_id?: string;
    trust_level?: string;
  };
}

export const getSession = (token?: string) =>
  apiFetch<SessionResult>("GET", "/session", undefined, token).catch(() => null);

export const logout = (token: string): Promise<void> =>
  apiFetch<{ ok: boolean }>("POST", "/logout", undefined, token)
    .then(() => undefined)
    .catch(() => undefined);

// ── Sprint 3: ONE RALD canonical-redirect helpers ────────────────────

export type IdentityAction =
  | "profile" | "username" | "security" | "sessions" | "devices"
  | "verification" | "recovery" | "developer" | "privacy" | "country"
  | "workspace" | "delete";

const ACTION_PATHS: Record<IdentityAction, string> = {
  profile:      "/account",
  username:     "/account",
  country:      "/account",
  verification: "/account",
  workspace:    "/account",
  security:     "/security",
  sessions:     "/security",
  devices:      "/security",
  privacy:      "/privacy",
  delete:       "/privacy",
  recovery:     "/login",
  developer:    "/developer",
};

/**
 * Resolve the canonical URL for an identity action by calling
 * GET /identity/canonical-redirect on rald-auth-core.
 * Falls back to constructing directly from ACTION_PATHS.
 */
export async function getIdentityPortalUrl(
  action: IdentityAction,
  returnTo?: string,
): Promise<string> {
  const params = new URLSearchParams({ action, app_id: APP_ID });
  if (returnTo) params.set("return_to", returnTo);
  try {
    const res = await fetch(`${AUTH_URL}/identity/canonical-redirect?${params}`);
    if (!res.ok) throw new Error("non-ok");
    const data = await res.json() as { canonical: string };
    return data.canonical;
  } catch {
    const path = ACTION_PATHS[action] ?? "/account";
    const url  = new URL(`${IDENTITY_URL}${path}`);
    url.searchParams.set("app_id", APP_ID);
    if (returnTo) url.searchParams.set("return_to", returnTo);
    return url.toString();
  }
}

/**
 * Navigate the user to profiles.rald.cloud for the given identity action.
 * Uses an optimistic direct URL — no network round-trip so the redirect is instant.
 */
export function redirectToIdentity(action: IdentityAction, returnTo?: string): void {
  const rt   = returnTo ?? window.location.href;
  const path = ACTION_PATHS[action] ?? "/account";
  const params = new URLSearchParams({ app_id: APP_ID, return_to: rt });
  window.location.href = `${IDENTITY_URL}${path}?${params}`;
}
