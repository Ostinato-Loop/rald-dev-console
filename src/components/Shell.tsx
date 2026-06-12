// RALD Dev Console — Shell (sidebar + layout)
// LILCKY STUDIO LIMITED

import { type ReactNode, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Key, AppWindow, Webhook, ScrollText,
  Building2, Settings, LogOut, Menu, X, ChevronRight,
  Shield, Zap,
} from "lucide-react";
import { Logo } from "./Logo";
import { clearAuth, getState } from "@/lib/store";
import { logout } from "@/lib/auth";

const NAV = [
  { to: "/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
  { to: "/keys",          icon: Key,             label: "API Keys" },
  { to: "/apps",          icon: AppWindow,       label: "Applications" },
  { to: "/webhooks",      icon: Webhook,         label: "Webhooks" },
  { to: "/audit",         icon: ScrollText,      label: "Audit Logs" },
  { to: "/organizations", icon: Building2,       label: "Organizations" },
  { to: "/settings",      icon: Settings,        label: "Settings" },
];

interface ShellProps { children: ReactNode }

export function Shell({ children }: ShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const user = getState().user;

  useEffect(() => { setMobileOpen(false); }, []);

  const handleLogout = async () => {
    const token = getState().token;
    if (token) await logout(token);
    clearAuth();
    navigate("/login", { replace: true });
  };

  const Sidebar = () => (
    <nav style={{
      width: 240, minHeight: "100vh", background: "var(--surface-2)",
      borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, zIndex: 100,
    }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Logo size={28} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.02em", color: "var(--text)" }}>
              RALD Dev Console
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Closed Beta
            </div>
          </div>
        </div>
      </div>

      {/* Developer identity badge */}
      {user && (
        <div style={{
          margin: "12px 12px 0", padding: "10px 12px",
          background: "var(--surface-3)", borderRadius: 8,
          border: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "var(--primary-dim)", border: "1px solid var(--primary-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "var(--primary)", flexShrink: 0,
            }}>
              {(user.username ?? user.name ?? user.email ?? "D")[0].toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                @{user.username ?? "developer"}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                Closed Beta Access
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <div style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={{ display: "block", marginBottom: 2 }}>
            {({ isActive }) => (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8,
                background: isActive ? "var(--primary-dim)" : "transparent",
                color: isActive ? "var(--primary)" : "var(--text-muted)",
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                transition: "all 0.15s",
                cursor: "pointer",
              }}>
                <Icon size={16} />
                {label}
                {isActive && <ChevronRight size={12} style={{ marginLeft: "auto" }} />}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", marginBottom: 4 }}>
          <Shield size={13} style={{ color: "var(--primary)" }} />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Invite-only · Closed Beta
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", marginBottom: 8 }}>
          <Zap size={13} style={{ color: "var(--amber)" }} />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            v1.0.0 · auth.rald.cloud
          </span>
        </div>
        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: 10, width: "100%",
          padding: "9px 12px", borderRadius: 8, border: "none",
          background: "transparent", color: "var(--text-muted)", fontSize: 13,
          cursor: "pointer", transition: "all 0.15s",
        }}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </nav>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop sidebar */}
      <div style={{ width: 240, flexShrink: 0 }} className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* Mobile top bar */}
      <div style={{
        display: "none", position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: "var(--surface-2)", borderBottom: "1px solid var(--border)",
        padding: "12px 16px", alignItems: "center", gap: 12,
      }} className="mobile-topbar">
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: "var(--text)", background: "none", border: "none" }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Logo size={22} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>RALD Dev Console</span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <main style={{ flex: 1, minHeight: "100vh", background: "var(--surface)", overflow: "auto" }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-topbar { display: flex !important; }
          main { padding-top: 56px; }
        }
      `}</style>
    </div>
  );
}
