// RALD Dev Console — Application Registry
// LILCKY STUDIO LIMITED

import { useEffect, useState } from "react";
import { AppWindow, Plus, Globe } from "lucide-react";
import { toast } from "sonner";
import { getState } from "@/lib/store";
import { listApps, createApp, type RegisteredApp } from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  development: "var(--text-muted)",
  closed_beta: "var(--amber)",
  production: "var(--primary)",
  suspended: "var(--red)",
};

export default function Applications() {
  const { token } = getState();
  const [apps, setApps] = useState<RegisteredApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", website: "", country: "",
    callback_url: "", environment: "development" as "development" | "test" | "production",
  });

  const load = () => {
    if (!token) return;
    listApps(token).then((r) => { setApps(r.apps); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, [token]);

  const handleCreate = async () => {
    if (!token || !form.name.trim()) return;
    setCreating(true);
    try {
      const r = await createApp(token, {
        name: form.name.trim(), description: form.description || undefined,
        website: form.website || undefined, country: form.country || undefined,
        callback_urls: form.callback_url ? [form.callback_url] : [],
        environment: form.environment,
      });
      setApps((prev) => [r.app, ...prev]);
      setShowCreate(false);
      setForm({ name: "", description: "", website: "", country: "", callback_url: "", environment: "development" });
      toast.success("Application registered");
    } catch (e: unknown) { toast.error((e as Error).message ?? "Failed to create app"); }
    finally { setCreating(false); }
  };

  return (
    <div style={{ padding: "32px 32px 64px", maxWidth: 1000 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Applications</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Register your apps to use RALD APIs and SSO.</p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
          background: "var(--primary)", color: "var(--surface)", border: "none",
          borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>
          <Plus size={15} /> Register App
        </button>
      </div>

      {showCreate && (
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 12, padding: 24, marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Register Application</h3>
          <div style={{ display: "grid", gap: 14, maxWidth: 520 }}>
            {[
              { key: "name", label: "App Name *", placeholder: "My RALD App" },
              { key: "description", label: "Description", placeholder: "What does this app do?" },
              { key: "website", label: "Website URL", placeholder: "https://myapp.com" },
              { key: "callback_url", label: "OAuth Callback URL", placeholder: "https://myapp.com/auth/callback" },
              { key: "country", label: "Country", placeholder: "NG" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>{label}</label>
                <input
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  style={{
                    width: "100%", padding: "10px 12px", background: "var(--surface-3)",
                    border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13,
                  }}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Environment</label>
              <select
                value={form.environment}
                onChange={(e) => setForm({ ...form, environment: e.target.value as typeof form.environment })}
                style={{
                  width: "100%", padding: "10px 12px", background: "var(--surface-3)",
                  border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13,
                }}
              >
                <option value="development">Development</option>
                <option value="test">Test</option>
                <option value="production">Production</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleCreate} disabled={creating || !form.name.trim()} style={{
                padding: "10px 20px", background: "var(--primary)", color: "var(--surface)",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700,
                cursor: creating ? "wait" : "pointer", opacity: !form.name.trim() ? 0.5 : 1,
              }}>
                {creating ? "Registering..." : "Register"}
              </button>
              <button onClick={() => setShowCreate(false)} style={{
                padding: "10px 16px", background: "transparent",
                border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-muted)", fontSize: 13, cursor: "pointer",
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading applications...</div>
      ) : apps.length === 0 ? (
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12,
          padding: 48, textAlign: "center",
        }}>
          <AppWindow size={32} style={{ color: "var(--text-dim)", marginBottom: 16 }} />
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>No applications registered yet.</p>
          <button onClick={() => setShowCreate(true)} style={{
            padding: "10px 20px", background: "var(--primary-dim)", border: "1px solid var(--primary-border)",
            borderRadius: 8, color: "var(--primary)", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Register your first app</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {apps.map((app) => {
            const statusColor = STATUS_COLORS[app.status] ?? "var(--text-muted)";
            return (
              <div key={app.id} style={{
                background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 12, padding: 20,
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{app.name}</span>
                      <span style={{
                        padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                        letterSpacing: "0.06em", textTransform: "uppercase",
                        background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30`,
                      }}>{app.status}</span>
                      <span style={{
                        padding: "2px 8px", borderRadius: 4, fontSize: 10,
                        background: "var(--surface-3)", color: "var(--text-dim)",
                      }}>{app.environment}</span>
                    </div>
                    {app.description && (
                      <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{app.description}</p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>
                        {app.id}
                      </code>
                      {app.website && (
                        <a href={app.website} target="_blank" rel="noopener noreferrer" style={{
                          display: "flex", alignItems: "center", gap: 4,
                          fontSize: 12, color: "var(--blue)",
                        }}>
                          <Globe size={11} /> {app.website}
                        </a>
                      )}
                    </div>
                    {app.callback_urls.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <span style={{ fontSize: 11, color: "var(--text-dim)", marginRight: 6 }}>Callbacks:</span>
                        {app.callback_urls.map((url) => (
                          <code key={url} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginRight: 8 }}>{url}</code>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", flexShrink: 0 }}>
                    {new Date(app.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
