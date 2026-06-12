// RALD Dev Console — API Keys management
// LILCKY STUDIO LIMITED

import { useEffect, useState } from "react";
import { Key, Plus, Copy, RotateCcw, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getState } from "@/lib/store";
import { listKeys, createKey, rotateKey, revokeKey, type ApiKey, type KeyType } from "@/lib/api";

const KEY_COLORS: Record<KeyType, string> = {
  MASTER: "var(--primary)",
  PRODUCT: "var(--blue)",
  WORKSPACE: "var(--purple)",
  SERVICE: "var(--amber)",
};

const KEY_DESCRIPTIONS: Record<KeyType, string> = {
  MASTER: "Ecosystem root. Can create product keys. Generated once.",
  PRODUCT: "Scoped to a RALD product (Loop, Messenger, PayRald, etc.).",
  WORKSPACE: "Business-specific. Scoped to an organization.",
  SERVICE: "Machine-to-machine. For servers, background jobs, AI agents.",
};

export default function APIKeys() {
  const { token } = getState();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ type: "PRODUCT" as KeyType, name: "", product: "" });
  

  const load = () => {
    if (!token) return;
    listKeys(token).then((r) => { setKeys(r.keys); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(load, [token]);

  const handleCreate = async () => {
    if (!token || !form.name.trim()) return;
    setCreating(true);
    try {
      const r = await createKey(token, { type: form.type, name: form.name.trim(), product: form.product || undefined });
      setNewKey(r.key.display_key ?? null);
      setKeys((prev) => [r.key, ...prev]);
      setShowCreate(false);
      setForm({ type: "PRODUCT", name: "", product: "" });
      toast.success("API key created");
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Failed to create key");
    } finally { setCreating(false); }
  };

  const handleRotate = async (id: string) => {
    if (!token) return;
    try {
      const r = await rotateKey(token, id);
      setNewKey(r.key.display_key ?? null);
      setKeys((prev) => prev.map((k) => (k.id === id ? r.key : k)));
      toast.success("Key rotated");
    } catch (e: unknown) { toast.error((e as Error).message ?? "Failed to rotate key"); }
  };

  const handleRevoke = async (id: string) => {
    if (!token || !confirm("Revoke this key? This cannot be undone.")) return;
    try {
      await revokeKey(token, id);
      setKeys((prev) => prev.map((k) => k.id === id ? { ...k, status: "revoked" as const } : k));
      toast.success("Key revoked");
    } catch (e: unknown) { toast.error((e as Error).message ?? "Failed to revoke key"); }
  };

  const copyKey = (val: string) => { navigator.clipboard.writeText(val); toast.success("Copied to clipboard"); };

  return (
    <div style={{ padding: "32px 32px 64px", maxWidth: 1000 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>API Keys</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Manage your MASTER, PRODUCT, WORKSPACE, and SERVICE keys.</p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
          background: "var(--primary)", color: "var(--surface)", border: "none",
          borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>
          <Plus size={15} /> Create Key
        </button>
      </div>

      {/* New key revealed banner */}
      {newKey && (
        <div style={{
          background: "var(--primary-dim)", border: "1px solid var(--primary-border)",
          borderRadius: 12, padding: 20, marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={15} style={{ color: "var(--primary)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>
              Copy your key now — it will not be shown again
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <code style={{
              fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text)",
              background: "var(--surface-3)", borderRadius: 8, padding: "10px 14px",
              flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{newKey}</code>
            <button onClick={() => copyKey(newKey)} style={{
              padding: "10px 14px", background: "var(--primary)", color: "var(--surface)",
              border: "none", borderRadius: 8, cursor: "pointer", flexShrink: 0,
            }}>
              <Copy size={14} />
            </button>
            <button onClick={() => setNewKey(null)} style={{
              padding: "10px 14px", background: "var(--surface-3)", color: "var(--text-muted)",
              border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", flexShrink: 0, fontSize: 12,
            }}>Done</button>
          </div>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 12, padding: 24, marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>New API Key</h3>
          <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Key Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as KeyType })}
                style={{
                  width: "100%", padding: "10px 12px", background: "var(--surface-3)",
                  border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13,
                }}
              >
                {(["MASTER", "PRODUCT", "WORKSPACE", "SERVICE"] as KeyType[]).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{KEY_DESCRIPTIONS[form.type]}</p>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Key Name</label>
              <input
                placeholder="e.g. Loop Production Key"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: "100%", padding: "10px 12px", background: "var(--surface-3)",
                  border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13,
                }}
              />
            </div>
            {form.type === "PRODUCT" && (
              <div>
                <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Product</label>
                <select
                  value={form.product}
                  onChange={(e) => setForm({ ...form, product: e.target.value })}
                  style={{
                    width: "100%", padding: "10px 12px", background: "var(--surface-3)",
                    border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13,
                  }}
                >
                  <option value="">Select product...</option>
                  {["Loop", "Messenger", "RALD Mail", "PayRald", "GitRald", "Raldtics", "RALD AI", "Business", "Memories"].map((p) => (
                    <option key={p} value={p.toLowerCase()}>{p} API Key</option>
                  ))}
                </select>
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleCreate} disabled={creating || !form.name.trim()} style={{
                padding: "10px 20px", background: "var(--primary)", color: "var(--surface)",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700,
                cursor: creating ? "wait" : "pointer", opacity: !form.name.trim() ? 0.5 : 1,
              }}>
                {creating ? "Creating..." : "Create Key"}
              </button>
              <button onClick={() => setShowCreate(false)} style={{
                padding: "10px 16px", background: "transparent",
                border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-muted)", fontSize: 13, cursor: "pointer",
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Keys list */}
      {loading ? (
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading keys...</div>
      ) : keys.length === 0 ? (
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12,
          padding: 48, textAlign: "center",
        }}>
          <Key size={32} style={{ color: "var(--text-dim)", marginBottom: 16 }} />
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>No API keys yet.</p>
          <button onClick={() => setShowCreate(true)} style={{
            padding: "10px 20px", background: "var(--primary-dim)", border: "1px solid var(--primary-border)",
            borderRadius: 8, color: "var(--primary)", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Create your first key</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {keys.map((key) => {
            const color = KEY_COLORS[key.type] ?? "var(--text-muted)";
            
            return (
              <div key={key.id} style={{
                background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 12, padding: 18, opacity: key.status !== "active" ? 0.6 : 1,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{
                    padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.08em", background: `${color}15`, color, border: `1px solid ${color}30`,
                  }}>{key.type}</div>
                  <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{key.name}</span>
                  {key.status !== "active" && (
                    <span style={{ fontSize: 11, color: "var(--red)", fontWeight: 600 }}>
                      {key.status.toUpperCase()}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                  <code style={{
                    fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)",
                    background: "var(--surface-3)", borderRadius: 6, padding: "6px 10px",
                  }}>
                    {key.prefix}••••••••
                  </code>
                  {key.product && (
                    <span style={{ fontSize: 11, color: "var(--text-dim)" }}>→ {key.product}</span>
                  )}
                  <span style={{ fontSize: 11, color: "var(--text-dim)", marginLeft: "auto" }}>
                    Created {new Date(key.created_at).toLocaleDateString()}
                    {key.last_used_at && ` · Last used ${new Date(key.last_used_at).toLocaleDateString()}`}
                  </span>
                  {key.status === "active" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => copyKey(key.prefix + "••••")} style={{
                        padding: "6px 10px", background: "var(--surface-3)", border: "1px solid var(--border)",
                        borderRadius: 6, color: "var(--text-muted)", cursor: "pointer",
                      }}><Copy size={12} /></button>
                      <button onClick={() => handleRotate(key.id)} style={{
                        padding: "6px 10px", background: "var(--surface-3)", border: "1px solid var(--border)",
                        borderRadius: 6, color: "var(--text-muted)", cursor: "pointer",
                      }}><RotateCcw size={12} /></button>
                      <button onClick={() => handleRevoke(key.id)} style={{
                        padding: "6px 10px", background: "var(--red-dim)", border: "1px solid rgba(255,46,46,0.2)",
                        borderRadius: 6, color: "var(--red)", cursor: "pointer",
                      }}><Trash2 size={12} /></button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
