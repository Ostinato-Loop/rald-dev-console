// RALD Dev Console — SSO Callback page
// Handles token from identity.rald.cloud redirect
// LILCKY STUDIO LIMITED

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { setState } from "@/lib/store";
import { getSession } from "@/lib/auth";

export default function Callback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get("token") ?? params.get("access_token");
    if (!token) {
      setError("No token received. Please try signing in again.");
      return;
    }

    getSession(token).then((sess) => {
      if (sess?.valid && sess.user) {
        setState({ token, user: sess.user });
        navigate("/dashboard", { replace: true });
      } else {
        setError("Session validation failed. Please sign in again.");
      }
    }).catch(() => {
      setError("Could not connect to RALD Auth. Please try again.");
    });
  }, [params, navigate]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--surface)", padding: 24,
    }}>
      <div style={{ textAlign: "center" }}>
        <Logo size={40} />
        {error ? (
          <>
            <p style={{ color: "var(--red)", marginTop: 20, fontSize: 14 }}>{error}</p>
            <button onClick={() => navigate("/login", { replace: true })} style={{
              marginTop: 16, padding: "10px 24px", background: "var(--surface-3)",
              border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)",
              fontSize: 13, cursor: "pointer",
            }}>
              Back to Sign In
            </button>
          </>
        ) : (
          <>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", margin: "20px auto 0",
              border: "2px solid var(--border-2)", borderTopColor: "var(--primary)",
              animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ color: "var(--text-muted)", marginTop: 16, fontSize: 13 }}>
              Verifying identity...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
