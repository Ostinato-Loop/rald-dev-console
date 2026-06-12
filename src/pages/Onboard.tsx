// RALD Dev Console — Developer Onboarding
// LILCKY STUDIO LIMITED

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { getState } from "@/lib/store";
import { onboardDeveloper } from "@/lib/api";

const COUNTRIES = ["Nigeria", "Ghana", "Kenya", "South Africa", "Egypt", "Ethiopia", "United States", "United Kingdom", "Other"];

export default function Onboard() {
  const navigate = useNavigate();
  const { token } = getState();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    developer_name: "", organization: "", website: "", country: "",
  });

  const handleSubmit = async () => {
    if (!token || !form.developer_name.trim()) return;
    setSubmitting(true);
    try {
      await onboardDeveloper(token, {
        developer_name: form.developer_name.trim(),
        organization: form.organization || undefined,
        website: form.website || undefined,
        country: form.country || undefined,
      });
      toast.success("Developer profile created! Welcome to the RALD ecosystem.");
      navigate("/dashboard", { replace: true });
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Onboarding failed. Please try again.");
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--surface)", padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 480, animation: "fade-in 0.3s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo size={40} />
          <h1 style={{ fontSize: 22, fontWeight: 700, marginTop: 16, marginBottom: 6 }}>Set up your developer profile</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Complete your profile to get your Master API Key and start building.
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: s <= step ? "var(--primary)" : "var(--border-2)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 16, padding: 28,
        }}>
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Personal Info</h2>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                    Developer Name *
                  </label>
                  <input
                    placeholder="Your full name or display name"
                    value={form.developer_name}
                    onChange={(e) => setForm({ ...form, developer_name: e.target.value })}
                    style={{
                      width: "100%", padding: "11px 13px", background: "var(--surface-3)",
                      border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                    Organization (optional)
                  </label>
                  <input
                    placeholder="Company or team name"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    style={{
                      width: "100%", padding: "11px 13px", background: "var(--surface-3)",
                      border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13,
                    }}
                  />
                </div>
                <button onClick={() => setStep(2)} disabled={!form.developer_name.trim()} style={{
                  padding: "12px 24px", background: "var(--primary)", color: "var(--surface)",
                  border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700,
                  cursor: !form.developer_name.trim() ? "not-allowed" : "pointer",
                  opacity: !form.developer_name.trim() ? 0.5 : 1,
                }}>Continue →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Developer Details</h2>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Website (optional)</label>
                  <input
                    placeholder="https://yoursite.com"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    style={{
                      width: "100%", padding: "11px 13px", background: "var(--surface-3)",
                      border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Country</label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    style={{
                      width: "100%", padding: "11px 13px", background: "var(--surface-3)",
                      border: "1px solid var(--border)", borderRadius: 9, color: "var(--text)", fontSize: 13,
                    }}
                  >
                    <option value="">Select your country...</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{
                  background: "var(--primary-dim)", border: "1px solid var(--primary-border)",
                  borderRadius: 10, padding: "14px 16px", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6,
                }}>
                  🎉 You'll receive your <strong style={{ color: "var(--primary)" }}>RALD Master API Key</strong> (format: <code style={{ fontFamily: "var(--font-mono)" }}>rk_live_xxx</code>) immediately after completing setup.
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep(1)} style={{
                    padding: "12px 18px", background: "transparent",
                    border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-muted)", fontSize: 13, cursor: "pointer",
                  }}>← Back</button>
                  <button onClick={handleSubmit} disabled={submitting} style={{
                    flex: 1, padding: "12px 24px", background: "var(--primary)", color: "var(--surface)",
                    border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: submitting ? "wait" : "pointer",
                  }}>{submitting ? "Setting up..." : "Complete Setup"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
