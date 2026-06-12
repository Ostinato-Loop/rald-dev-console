// RALD Dev Console — Dashboard
// LILCKY STUDIO LIMITED

import { useEffect, useState } from "react";
import {
  Key, AppWindow, Webhook, Activity, TrendingUp, Shield,
  ArrowRight, Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getState } from "@/lib/store";
import { getDeveloperProfile, getDeveloperStats, type DeveloperProfile, type DeveloperStats } from "@/lib/api";

const TRUST_LABELS: Record<number, string> = {
  1: "Personal Developer",
  2: "Verified Developer",
  3: "Verified Organization",
  4: "Strategic Partner",
  5: "RALD Certified Partner",
};

const TRUST_COLORS: Record<number, string> = {
  1: "#6B8FA8",
  2: "#0066FF",
  3: "#A855F7",
  4: "#FFD400",
  5: "#00FF88",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { token, user } = getState();
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [stats, setStats] = useState<DeveloperStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [notOnboarded, setNotOnboarded] = useState(false);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      getDeveloperProfile(token).catch(() => null),
      getDeveloperStats(token).catch(() => null),
    ]).then(([p, s]) => {
      if (!p) { setNotOnboarded(true); }
      else setProfile(p);
      setStats(s);
      setLoading(false);
    });
  }, [token]);

  if (loading) return (
    <div style={{ padding: 40, display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 13 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--border-2)", borderTopColor: "var(--primary)", animation: "spin 0.8s linear infinite" }} />
      Loading dashboard...
    </div>
  );

  if (notOnboarded) return (
    <div style={{ padding: 40 }}>
      <div style={{
        maxWidth: 520, margin: "0 auto", background: "var(--surface-2)",
        border: "1px solid var(--primary-border)", borderRadius: 16, padding: 40, textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Set up your developer profile</h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.6 }}>
          Complete your developer onboarding to get your Master API Key and access to the full RALD developer ecosystem.
        </p>
        <button onClick={() => navigate("/onboard")} style={{
          padding: "12px 28px", background: "var(--primary)", color: "var(--surface)",
          border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}>
          Start Onboarding
        </button>
      </div>
    </div>
  );

  const trustLevel = profile?.trust_level ?? 1;
  const trustColor = TRUST_COLORS[trustLevel] ?? "#6B8FA8";

  return (
    <div style={{ padding: "32px 32px 64px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
              Welcome back, @{user?.username ?? "developer"}
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              RALD Developer Console — Closed Beta
            </p>
          </div>
          {profile && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 20,
              background: `${trustColor}18`, border: `1px solid ${trustColor}40`,
            }}>
              <Shield size={13} style={{ color: trustColor }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: trustColor }}>
                Level {trustLevel} · {TRUST_LABELS[trustLevel]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Developer ID card */}
      {profile && (
        <div style={{
          background: "linear-gradient(135deg, #0D1826 0%, #111E2E 100%)",
          border: "1px solid var(--border-2)", borderRadius: 16,
          padding: 24, marginBottom: 28, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: "var(--ecosystem-gradient)",
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                Developer ID
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.04em" }}>
                {profile.dev_id}
              </div>
            </div>
            <div style={{ width: 1, height: 36, background: "var(--border)", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                Usage Tier
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{profile.api_usage_tier}</div>
            </div>
            <div style={{ width: 1, height: 36, background: "var(--border)", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                Verification
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: profile.verification_status === "verified" ? "var(--primary)" : "var(--amber)" }}>
                {profile.verification_status === "verified" ? "✓ Verified" : profile.verification_status === "pending" ? "⏳ Pending" : "Unverified"}
              </div>
            </div>
            {profile.organization && (
              <>
                <div style={{ width: 1, height: 36, background: "var(--border)", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                    Organization
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{profile.organization}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { icon: Key, label: "Active Keys", value: stats?.active_keys ?? 0, total: stats?.total_keys ?? 0, color: "var(--primary)", path: "/keys" },
          { icon: AppWindow, label: "Applications", value: stats?.active_apps ?? 0, total: stats?.total_apps ?? 0, color: "var(--blue)", path: "/apps" },
          { icon: Webhook, label: "Webhooks", value: stats?.total_webhooks ?? 0, total: stats?.total_webhooks ?? 0, color: "var(--purple)", path: "/webhooks" },
          { icon: Activity, label: "API Calls Today", value: stats?.usage.calls_today ?? 0, total: stats?.usage.total_calls ?? 0, color: "var(--amber)", path: "/audit" },
        ].map(({ icon: Icon, label, value, color, path }) => (
          <div key={label} onClick={() => navigate(path)} style={{
            background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: 12, padding: 20, cursor: "pointer",
            transition: "border-color 0.15s",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={18} style={{ color }} />
              </div>
              <ArrowRight size={14} style={{ color: "var(--text-dim)" }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{value.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Rate limit bar */}
      {stats?.usage && (
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 12, padding: 20, marginBottom: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={16} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Rate Limit Usage</span>
            </div>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {stats.usage.rate_limit_remaining.toLocaleString()} / {stats.usage.rate_limit.toLocaleString()} remaining
            </span>
          </div>
          <div style={{ height: 6, background: "var(--surface-4)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 3,
              background: "var(--primary)",
              width: `${Math.max(0, 100 - (stats.usage.rate_limit_remaining / stats.usage.rate_limit) * 100)}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: "var(--text-muted)" }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { icon: Key, label: "Create API Key", desc: "Generate a new key", color: "var(--primary)", path: "/keys" },
            { icon: AppWindow, label: "Register App", desc: "Add to your registry", color: "var(--blue)", path: "/apps" },
            { icon: Webhook, label: "Add Webhook", desc: "Subscribe to events", color: "var(--purple)", path: "/webhooks" },
          ].map(({ icon: Icon, label, desc, color, path }) => (
            <button key={label} onClick={() => navigate(path)} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "14px 16px", cursor: "pointer",
              textAlign: "left", transition: "border-color 0.15s",
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, background: `${color}15`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{label}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{desc}</div>
              </div>
              <Plus size={14} style={{ color: "var(--text-dim)", marginLeft: "auto" }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
