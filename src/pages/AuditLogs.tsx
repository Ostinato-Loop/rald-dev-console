// RALD Dev Console — Audit Logs
// LILCKY STUDIO LIMITED

import { useEffect, useState } from "react";
import { ScrollText, RefreshCw } from "lucide-react";
import { getState } from "@/lib/store";
import { getAuditLogs, type AuditEntry } from "@/lib/api";

const ACTION_COLORS: Record<string, string> = {
  "key.created": "var(--primary)",
  "key.rotated": "var(--amber)",
  "key.revoked": "var(--red)",
  "app.created": "var(--blue)",
  "webhook.created": "var(--purple)",
  "webhook.deleted": "var(--red)",
  "login": "var(--primary)",
  "logout": "var(--text-muted)",
};

export default function AuditLogs() {
  const { token } = getState();
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const load = (p: number) => {
    if (!token) return;
    setLoading(true);
    getAuditLogs(token, p).then((r) => {
      setLogs(r.logs);
      setTotal(r.total);
      setPage(p);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(1); }, [token]);

  return (
    <div style={{ padding: "32px 32px 64px", maxWidth: 1000 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Audit Logs</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>All API calls, key events, and permission changes.</p>
        </div>
        <button onClick={() => load(page)} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "9px 16px",
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 10, color: "var(--text-muted)", fontSize: 13, cursor: "pointer",
        }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading audit logs...</div>
      ) : logs.length === 0 ? (
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12,
          padding: 48, textAlign: "center",
        }}>
          <ScrollText size={32} style={{ color: "var(--text-dim)", marginBottom: 16 }} />
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>No audit entries yet.</p>
        </div>
      ) : (
        <>
          <div style={{
            background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: 12, overflow: "hidden",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Timestamp", "Action", "Resource", "IP"].map((h) => (
                    <th key={h} style={{
                      padding: "10px 16px", textAlign: "left",
                      fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const color = ACTION_COLORS[log.action] ?? "var(--text-muted)";
                  return (
                    <tr key={log.id} style={{
                      borderBottom: i < logs.length - 1 ? "1px solid var(--border)" : "none",
                    }}>
                      <td style={{ padding: "10px 16px", fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 16px" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                          fontFamily: "var(--font-mono)", background: `${color}15`, color,
                        }}>{log.action}</span>
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--text-muted)" }}>
                        {log.resource}{log.resource_id ? ` · ${log.resource_id.slice(0, 8)}...` : ""}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                        {log.ip ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{total} total entries</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => load(page - 1)} disabled={page <= 1} style={{
                padding: "7px 14px", background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 7, color: "var(--text-muted)", fontSize: 12, cursor: page <= 1 ? "not-allowed" : "pointer",
                opacity: page <= 1 ? 0.4 : 1,
              }}>← Prev</button>
              <span style={{ padding: "7px 12px", fontSize: 12, color: "var(--text-muted)" }}>Page {page}</span>
              <button onClick={() => load(page + 1)} disabled={page * 50 >= total} style={{
                padding: "7px 14px", background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 7, color: "var(--text-muted)", fontSize: 12, cursor: page * 50 >= total ? "not-allowed" : "pointer",
                opacity: page * 50 >= total ? 0.4 : 1,
              }}>Next →</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
