// RALD Dev Console — Webhooks
// LILCKY STUDIO LIMITED

import { useEffect, useState } from "react";
import { Webhook, Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { getState } from "@/lib/store";
import { listWebhooks, createWebhook, deleteWebhook, WEBHOOK_EVENTS, type Webhook as WebhookType } from "@/lib/api";

export default function Webhooks() {
  const { token } = getState();
  const [webhooks, setWebhooks] = useState<WebhookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ url: "", events: [] as string[], secret: "" });

  useEffect(() => {
    if (!token) return;
    listWebhooks(token).then((r) => { setWebhooks(r.webhooks); setLoading(false); }).catch(() => setLoading(false));
  }, [token]);

  const toggleEvent = (ev: string) => {
    setForm((f) => ({
      ...f,
      events: f.events.includes(ev) ? f.events.filter((e) => e !== ev) : [...f.events, ev],
    }));
  };

  const handleCreate = async () => {
    if (!token || !form.url.trim() || form.events.length === 0) return;
    setCreating(true);
    try {
      const r = await createWebhook(token, { url: form.url.trim(), events: form.events, secret: form.secret || undefined });
      setWebhooks((prev) => [r.webhook, ...prev]);
      setShowCreate(false);
      setForm({ url: "", events: [], secret: "" });
      toast.success("Webhook created");
    } catch (e: unknown) { toast.error((e as Error).message ?? "Failed to create webhook"); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Delete this webhook?")) return;
    try {
      await deleteWebhook(token, id);
      setWebhooks((prev) => prev.filter((w) => w.id !== id));
      toast.success("Webhook deleted");
    } catch (e: unknown) { toast.error((e as Error).message ?? "Failed to delete webhook"); }
  };

  return (
    <div style={{ padding: "32px 32px 64px", maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Webhooks</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Subscribe to RALD ecosystem events.</p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
          background: "var(--primary)", color: "var(--surface)", border: "none",
          borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>
          <Plus size={15} /> Add Webhook
        </button>
      </div>

      {showCreate && (
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 12, padding: 24, marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>New Webhook</h3>
          <div style={{ display: "grid", gap: 16, maxWidth: 520 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Endpoint URL *</label>
              <input
                placeholder="https://yourapp.com/webhooks/rald"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                style={{
                  width: "100%", padding: "10px 12px", background: "var(--surface-3)",
                  border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13,
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 10 }}>Events *</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {WEBHOOK_EVENTS.map((ev) => {
                  const selected = form.events.includes(ev);
                  return (
                    <button key={ev} onClick={() => toggleEvent(ev)} style={{
                      padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                      background: selected ? "var(--primary-dim)" : "var(--surface-3)",
                      border: selected ? "1px solid var(--primary-border)" : "1px solid var(--border)",
                      color: selected ? "var(--primary)" : "var(--text-muted)",
                      cursor: "pointer", fontFamily: "var(--font-mono)",
                    }}>{ev}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Signing Secret (optional)</label>
              <input
                placeholder="Used to verify webhook signatures"
                value={form.secret}
                onChange={(e) => setForm({ ...form, secret: e.target.value })}
                style={{
                  width: "100%", padding: "10px 12px", background: "var(--surface-3)",
                  border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleCreate} disabled={creating || !form.url.trim() || form.events.length === 0} style={{
                padding: "10px 20px", background: "var(--primary)", color: "var(--surface)",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700,
                cursor: creating ? "wait" : "pointer",
                opacity: (!form.url.trim() || form.events.length === 0) ? 0.5 : 1,
              }}>{creating ? "Creating..." : "Create Webhook"}</button>
              <button onClick={() => setShowCreate(false)} style={{
                padding: "10px 16px", background: "transparent",
                border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-muted)", fontSize: 13, cursor: "pointer",
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading webhooks...</div>
      ) : webhooks.length === 0 ? (
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12,
          padding: 48, textAlign: "center",
        }}>
          <Webhook size={32} style={{ color: "var(--text-dim)", marginBottom: 16 }} />
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>No webhooks configured.</p>
          <button onClick={() => setShowCreate(true)} style={{
            padding: "10px 20px", background: "var(--primary-dim)", border: "1px solid var(--primary-border)",
            borderRadius: 8, color: "var(--primary)", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Add your first webhook</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {webhooks.map((wh) => (
            <div key={wh.id} style={{
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: 12, padding: 18,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    {wh.active
                      ? <CheckCircle2 size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                      : <XCircle size={14} style={{ color: "var(--red)", flexShrink: 0 }} />}
                    <code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)" }}>{wh.url}</code>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {wh.events.map((ev) => (
                      <span key={ev} style={{
                        padding: "2px 8px", borderRadius: 4, fontSize: 10,
                        background: "var(--surface-3)", color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                      }}>{ev}</span>
                    ))}
                  </div>
                  {wh.last_triggered_at && (
                    <p style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 6 }}>
                      Last triggered: {new Date(wh.last_triggered_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <button onClick={() => handleDelete(wh.id)} style={{
                  padding: "6px 10px", background: "var(--red-dim)", border: "1px solid rgba(255,46,46,0.2)",
                  borderRadius: 6, color: "var(--red)", cursor: "pointer", flexShrink: 0,
                }}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
