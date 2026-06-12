// RALD Dev Console — Organizations
// LILCKY STUDIO LIMITED

import { Building2, Plus } from "lucide-react";

const ORG_TYPES = ["Personal", "Organization", "Enterprise", "Government", "University", "NGO"];

export default function Organizations() {
  return (
    <div style={{ padding: "32px 32px 64px", maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Organizations</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Manage your organizations and team API access.</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
          background: "var(--primary-dim)", border: "1px solid var(--primary-border)",
          borderRadius: 10, color: "var(--primary)", fontSize: 13, fontWeight: 700, cursor: "pointer",
          opacity: 0.7,
        }}>
          <Plus size={15} /> Create Organization
          <span style={{ fontSize: 10, background: "var(--amber-dim)", border: "1px solid rgba(255,212,0,0.3)", color: "var(--amber)", padding: "2px 6px", borderRadius: 4, marginLeft: 4 }}>
            Soon
          </span>
        </button>
      </div>

      {/* Org types preview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 28 }}>
        {ORG_TYPES.map((type) => (
          <div key={type} style={{
            background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: 12, padding: "16px 18px",
          }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>
              {type === "Personal" ? "👤" : type === "Organization" ? "🏢" : type === "Enterprise" ? "🏛" : type === "Government" ? "🏛" : type === "University" ? "🎓" : "🌍"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{type}</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Isolated API assets</div>
          </div>
        ))}
      </div>

      <div style={{
        background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12,
        padding: 48, textAlign: "center",
      }}>
        <Building2 size={32} style={{ color: "var(--text-dim)", marginBottom: 16 }} />
        <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Organizations coming soon</p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 400, margin: "0 auto" }}>
          Organization accounts let teams share API assets, manage permissions, and isolate environments.
          Available after closed beta.
        </p>
      </div>
    </div>
  );
}
