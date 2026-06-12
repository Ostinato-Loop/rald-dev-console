// RALD Dev Console — SSO auth client
// LILCKY STUDIO LIMITED

const AUTH_URL =
  (import.meta.env.VITE_RALD_AUTH_URL as string | undefined) ??
  "https://auth.rald.cloud";

const IDENTITY_URL =
  (import.meta.env.VITE_RALD_IDENTITY_URL as string | undefined) ??
  "https://identity.rald.cloud";

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
