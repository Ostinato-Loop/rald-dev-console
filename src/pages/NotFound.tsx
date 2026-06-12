// RALD Dev Console — 404
// LILCKY STUDIO LIMITED

import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--surface)", padding: 24, textAlign: "center",
    }}>
      <div>
        <Logo size={40} />
        <h1 style={{ fontSize: 48, fontWeight: 800, marginTop: 20, marginBottom: 8, color: "var(--text-dim)" }}>404</h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 28 }}>Page not found.</p>
        <button onClick={() => navigate("/dashboard")} style={{
          padding: "11px 24px", background: "var(--primary)", color: "var(--surface)",
          border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}>← Dashboard</button>
      </div>
    </div>
  );
}
