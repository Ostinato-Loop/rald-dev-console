// RALD Dev Console — Developer API client
// Connects to /developer/* routes on rald-auth-core
// LILCKY STUDIO LIMITED

const AUTH_URL =
  (import.meta.env.VITE_RALD_AUTH_URL as string | undefined) ??
  "https://auth.rald.cloud";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function req<T>(
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

// ── Types ─────────────────────────────────────────────────────────────────────

export type KeyType = "MASTER" | "PRODUCT" | "WORKSPACE" | "SERVICE";
export type AppStatus = "development" | "closed_beta" | "production" | "suspended";
export type OrgType = "personal" | "organization" | "enterprise" | "government" | "university" | "ngo";
export type TrustLevel = 1 | 2 | 3 | 4 | 5;

export interface DeveloperProfile {
  dev_id: string;
  developer_name: string;
  organization?: string;
  website?: string;
  country?: string;
  region?: string;
  verification_status: "unverified" | "pending" | "verified";
  trust_level: TrustLevel;
  api_usage_tier: string;
  created_at: string;
}

export interface ApiKey {
  id: string;
  type: KeyType;
  name: string;
  prefix: string;
  display_key?: string; // only returned on creation
  product?: string;
  workspace_id?: string;
  scopes: string[];
  created_at: string;
  last_used_at?: string;
  revoked_at?: string;
  status: "active" | "revoked" | "suspended";
}

export interface RegisteredApp {
  id: string;
  name: string;
  description?: string;
  website?: string;
  country?: string;
  callback_urls: string[];
  environment: "development" | "test" | "production";
  status: AppStatus;
  created_at: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
  last_triggered_at?: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  resource: string;
  resource_id?: string;
  ip?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface UsageStats {
  total_calls: number;
  calls_today: number;
  calls_this_month: number;
  rate_limit: number;
  rate_limit_remaining: number;
  top_endpoints: Array<{ endpoint: string; count: number }>;
}

export interface DeveloperStats {
  total_keys: number;
  active_keys: number;
  total_apps: number;
  active_apps: number;
  total_webhooks: number;
  usage: UsageStats;
}

// ── Developer Profile ─────────────────────────────────────────────────────────

export const getDeveloperProfile = (token: string) =>
  req<DeveloperProfile>("GET", "/developer/profile", undefined, token);

export const onboardDeveloper = (
  token: string,
  data: { developer_name: string; organization?: string; website?: string; country?: string },
) => req<DeveloperProfile>("POST", "/developer/onboard", data, token);

export const getDeveloperStats = (token: string) =>
  req<DeveloperStats>("GET", "/developer/stats", undefined, token);

// ── API Keys ──────────────────────────────────────────────────────────────────

export const listKeys = (token: string) =>
  req<{ keys: ApiKey[] }>("GET", "/developer/keys", undefined, token);

export const createKey = (
  token: string,
  data: { type: KeyType; name: string; product?: string; workspace_id?: string; scopes?: string[] },
) => req<{ key: ApiKey & { display_key: string } }>("POST", "/developer/keys", data, token);

export const rotateKey = (token: string, id: string) =>
  req<{ key: ApiKey & { display_key: string } }>("POST", `/developer/keys/${id}/rotate`, undefined, token);

export const revokeKey = (token: string, id: string) =>
  req<{ ok: boolean }>("POST", `/developer/keys/${id}/revoke`, undefined, token);

export const suspendKey = (token: string, id: string) =>
  req<{ ok: boolean }>("POST", `/developer/keys/${id}/suspend`, undefined, token);

// ── Applications ──────────────────────────────────────────────────────────────

export const listApps = (token: string) =>
  req<{ apps: RegisteredApp[] }>("GET", "/developer/apps", undefined, token);

export const createApp = (
  token: string,
  data: {
    name: string;
    description?: string;
    website?: string;
    country?: string;
    callback_urls: string[];
    environment: "development" | "test" | "production";
  },
) => req<{ app: RegisteredApp }>("POST", "/developer/apps", data, token);

export const updateApp = (
  token: string,
  id: string,
  data: Partial<Omit<RegisteredApp, "id" | "created_at">>,
) => req<{ app: RegisteredApp }>("PATCH", `/developer/apps/${id}`, data, token);

// ── Webhooks ──────────────────────────────────────────────────────────────────

export const listWebhooks = (token: string) =>
  req<{ webhooks: Webhook[] }>("GET", "/developer/webhooks", undefined, token);

export const createWebhook = (
  token: string,
  data: { url: string; events: string[]; secret?: string },
) => req<{ webhook: Webhook }>("POST", "/developer/webhooks", data, token);

export const deleteWebhook = (token: string, id: string) =>
  req<{ ok: boolean }>("DELETE", `/developer/webhooks/${id}`, undefined, token);

// ── Audit Logs ────────────────────────────────────────────────────────────────

export const getAuditLogs = (token: string, page = 1, limit = 50) =>
  req<{ logs: AuditEntry[]; total: number; page: number }>(
    "GET",
    `/developer/audit?page=${page}&limit=${limit}`,
    undefined,
    token,
  );

// ── Usage ─────────────────────────────────────────────────────────────────────

export const getUsage = (token: string) =>
  req<UsageStats>("GET", "/developer/usage", undefined, token);

// ── Webhook event types ───────────────────────────────────────────────────────
export const WEBHOOK_EVENTS = [
  "user.created",
  "user.verified",
  "username.changed",
  "session.created",
  "trust_level.changed",
  "business.created",
  "room.created",
  "api_key.created",
  "api_key.rotated",
  "api_key.revoked",
  "app.created",
  "app.status_changed",
] as const;

export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number];
