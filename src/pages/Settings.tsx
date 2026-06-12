// RALD Dev Console — Settings
// LILCKY STUDIO LIMITED


import { Shield, Globe, Bell, User } from "lucide-react";
import { getState } from "@/lib/store";

export default function SettingsPage() {
  const { user } = getState();


  const TRUST_INFO = [
    { level: 1, label: "Personal Developer", desc: "Default level. Access to basic APIs." },
    { level: 2, label: "Verified Developer", desc: "Identity verified. Higher rate limits." },
    { level: 3, label: "Verified Organization", desc: "Organization account verified." },
    { level: 4, label: "Strategic Partner", desc: "Advanced API access and production approval." },
    { level: 5, label: "RALD Certified Partner", desc: "Full ecosystem access. Highest rate limits." },
  ];

  return (
    <div style={{ padding: "32px 32px 64px", maxWidth: 800 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Settings</h1>
      <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 32 }}>Account and developer preferences.</p>

      {/* Developer identity */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <User size={15} style={{ color: "var(--primary)" }} />
          <h2 style={{ fontSize: 14, fontWeight: 700 }}>Developer Identity</h2>
        </div>
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 12, padding: 20,
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Username", value: `@${user?.username ?? "—"}` },
              { label: "Email", value: user?.email ?? "—" },
              { label: "RALD Internal ID", value: user?.rald_internal_id ?? "—" },
              { label: "Trust Level", value: user?.trust_level ?? "—" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust levels */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Shield size={15} style={{ color: "var(--primary)" }} />
          <h2 style={{ fontSize: 14, fontWeight: 700 }}>API Trust Levels</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TRUST_INFO.map(({ level, label, desc }) => (
            <div key={level} style={{
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: level <= 2 ? "var(--surface-4)" : level === 3 ? "rgba(168,85,247,0.15)" : level === 4 ? "rgba(255,212,0,0.12)" : "var(--primary-dim)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, flexShrink: 0,
                color: level <= 2 ? "var(--text-muted)" : level === 3 ? "var(--purple)" : level === 4 ? "var(--amber)" : "var(--primary)",
              }}>{level}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Country restrictions */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Globe size={15} style={{ color: "var(--primary)" }} />
          <h2 style={{ fontSize: 14, fontWeight: 700 }}>Country Restrictions</h2>
        </div>
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 12, padding: 20,
        }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.6 }}>
            Developer API access follows the RALD country activation framework. If your country is not yet activated,
            API access will be blocked until activation.
          </p>
          <div style={{
            background: "var(--amber-dim)", border: "1px solid rgba(255,212,0,0.25)",
            borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "var(--amber)",
          }}>
            ⚡ Active expansion: Nigeria (NG), Ghana (GH), Kenya (KE), South Africa (ZA), and more.
            Join the waitlist for your country at <a href="https://rald.cloud" style={{ color: "var(--amber)", textDecoration: "underline" }}>rald.cloud</a>.
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Bell size={15} style={{ color: "var(--primary)" }} />
          <h2 style={{ fontSize: 14, fontWeight: 700 }}>Notifications</h2>
        </div>
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 12, padding: 20,
        }}>
          {["Key created or rotated", "App status changed", "Webhook delivery failure", "Trust level change"].map((item) => (
            <div key={item} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 0", borderBottom: "1px solid var(--border)",
            }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{item}</span>
              <div style={{
                width: 36, height: 20, borderRadius: 10, background: "var(--primary)",
                position: "relative", cursor: "pointer",
              }}>
                <div style={{
                  position: "absolute", top: 2, right: 2, width: 16, height: 16,
                  borderRadius: "50%", background: "var(--surface)",
                }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
