// RALD Dev Console — Login page
// LILCKY STUDIO LIMITED

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { getState } from "@/lib/store";
import { getLoginUrl } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const { token, user } = getState();
    if (token && user) { navigate("/dashboard", { replace: true }); return; }
  }, [navigate]);

  const handleLogin = () => { window.location.href = getLoginUrl(); };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--surface)", padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 420, animation: "fade-in 0.3s ease" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Logo size={52} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
            RALD Dev Console
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
            The developer identity layer for Africa.<br />
            One RALD identity. One ecosystem.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 16, padding: 32,
        }}>
          <div style={{
            background: "var(--primary-dim)", border: "1px solid var(--primary-border)",
            borderRadius: 10, padding: "14px 16px", marginBottom: 28,
            display: "flex", alignItems: "flex-start", gap: 12,
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)", marginBottom: 3 }}>
                Invite-Only — Closed Beta
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                Access requires an approved RALD developer account. Sign in with your existing RALD identity.
              </div>
            </div>
          </div>

          <button onClick={handleLogin} style={{
            width: "100%", padding: "14px 24px",
            background: "var(--primary)", color: "var(--surface)",
            border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
            cursor: "pointer", transition: "opacity 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="rgba(0,0,0,0.15)" />
              <path d="M8 8h7a5 5 0 0 1 0 10H8V8Z" fill="white" fillOpacity="0.95" />
              <path d="M15 18l5 6h-4l-5-6" fill="white" fillOpacity="0.7" />
            </svg>
            Continue with RALD Identity
          </button>

          <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-dim)", marginTop: 20, lineHeight: 1.5 }}>
            By continuing, you agree to the{" "}
            <a href="https://rald.cloud/terms" style={{ color: "var(--text-muted)" }}>Terms of Service</a>
            {" "}and{" "}
            <a href="https://rald.cloud/privacy" style={{ color: "var(--text-muted)" }}>Privacy Policy</a>.
          </p>
        </div>

        {/* Features */}
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { icon: "🔑", label: "Master API Keys" },
            { icon: "📦", label: "App Registry" },
            { icon: "🪝", label: "Webhooks" },
            { icon: "📋", label: "Audit Logs" },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-dim)", marginTop: 28 }}>
          LILCKY STUDIO LIMITED · RALD v1.0.0
        </p>
      </div>
    </div>
  );
}
