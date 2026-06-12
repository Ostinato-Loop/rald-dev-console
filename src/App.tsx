// RALD Dev Console — App.tsx
// Routes: /login, /callback, /onboard, /dashboard, /keys, /apps, /webhooks, /audit, /organizations, /settings
// LILCKY STUDIO LIMITED

import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Shell } from "@/components/Shell";
import { getState, setState } from "@/lib/store";
import { getSession } from "@/lib/auth";
import Login from "@/pages/Login";
import Callback from "@/pages/Callback";
import Onboard from "@/pages/Onboard";
import Dashboard from "@/pages/Dashboard";
import APIKeys from "@/pages/APIKeys";
import Applications from "@/pages/Applications";
import Webhooks from "@/pages/Webhooks";
import AuditLogs from "@/pages/AuditLogs";
import Organizations from "@/pages/Organizations";
import SettingsPage from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { token, user } = getState();
    if (token && user) { setReady(true); return; }
    getSession(token ?? undefined).then((sess) => {
      if (sess?.valid && sess.user) {
        setState({ user: sess.user, token: token ?? undefined });
        setReady(true);
      } else {
        navigate("/login", { replace: true });
      }
    });
  }, [navigate]);

  if (!ready) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--surface)",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          border: "2px solid var(--border-2)", borderTopColor: "var(--primary)",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }
  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, user } = getState();
  if (!token || !user) return <Navigate to="/login" replace />;
  return <AuthLoader><Shell>{children}</Shell></AuthLoader>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/callback" element={<Callback />} />

        <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/keys"          element={<ProtectedRoute><APIKeys /></ProtectedRoute>} />
        <Route path="/apps"          element={<ProtectedRoute><Applications /></ProtectedRoute>} />
        <Route path="/webhooks"      element={<ProtectedRoute><Webhooks /></ProtectedRoute>} />
        <Route path="/audit"         element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
        <Route path="/organizations" element={<ProtectedRoute><Organizations /></ProtectedRoute>} />
        <Route path="/settings"      element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/onboard"       element={<ProtectedRoute><Onboard /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
