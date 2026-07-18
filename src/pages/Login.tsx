import { useState } from "react";
import { useAppData } from "../data/AppDataContext";
import type { User } from "../data/mockData";

interface Props { onLogin: (user: User) => void; }

export default function Login({ onLogin }: Props) {
  const { users } = useAppData();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = users.find((u) => u.username === username.trim().toLowerCase());
      if (user && password === "password123") {
        onLogin(user);
      } else {
        setError("Invalid username or password. Try a demo account below.");
      }
      setLoading(false);
    }, 700);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #071d0e 0%, #09261A 40%, #0e3a1d 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "var(--font-sans)",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background decorations */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,138,78,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", left: "-8%",  width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(78,173,107,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,58,29,0.4) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Card */}
      <div style={{
        background: "#fff",
        borderRadius: 20,
        width: "100%",
        maxWidth: 440,
        boxShadow: "0 40px 100px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Card top accent bar */}
        <div style={{ height: 5, background: "linear-gradient(90deg, #1e6b3a, #2d8a4e, #4ead6b, #2d8a4e, #1e6b3a)" }} />

        <div style={{ padding: "40px 40px 36px" }}>

          {/* Logo + system name */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: "linear-gradient(135deg, #1e6b3a 0%, #2d8a4e 50%, #4ead6b 100%)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, marginBottom: 16,
              boxShadow: "0 8px 28px rgba(45,138,78,0.45)",
            }}>🌿</div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#0e3a1d", letterSpacing: "0.06em", lineHeight: 1.5 }}>
              AGRI-BUSINESS OPERATIONAL COST
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#0e3a1d", letterSpacing: "0.06em", lineHeight: 1.5 }}>
              AND BUDGET MONITORING SYSTEM
            </div>
            <div style={{
              display: "inline-block", marginTop: 8,
              padding: "3px 12px", borderRadius: 20,
              background: "#f0faf3", border: "1px solid #b3e6c4",
              fontSize: 10, color: "#2d8a4e", fontWeight: 700,
              letterSpacing: "0.1em", fontFamily: "var(--font-mono)",
            }}>
              RWANDA · {new Date().getFullYear()}
            </div>
          </div>

          {/* Form header */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 13.5, color: "#94a3b8", margin: 0 }}>
              Sign in to access your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Username */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.07em", display: "block", marginBottom: 7 }}>
                USERNAME
              </label>
              <div style={{ position: "relative" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                  style={{ ...inputCss, paddingLeft: 38 }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.07em", display: "block", marginBottom: 7 }}>
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  style={{ ...inputCss, paddingLeft: 38, paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "#94a3b8", padding: 2, display: "flex", alignItems: "center",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                  title={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: "10px 14px", borderRadius: 9,
                background: "#fef2f2", border: "1px solid #fecaca",
                fontSize: 12.5, color: "#b91c1c",
                display: "flex", alignItems: "flex-start", gap: 9,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                background: loading ? "#94a3b8" : "linear-gradient(135deg, #1e6b3a 0%, #2d8a4e 60%, #3a9e5f 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-sans)",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.02em",
                boxShadow: loading ? "none" : "0 4px 18px rgba(45,138,78,0.4)",
                transition: "opacity 0.15s, transform 0.1s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 4,
              }}
              onMouseEnter={(e) => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.opacity = "0.92"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; } }}
              onMouseLeave={(e) => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; } }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
            <span style={{ fontSize: 11, color: "#cbd5e1" }}>
              © {new Date().getFullYear()} Agri-Business Cost &amp; Budget Monitoring System · Rwanda
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const inputCss: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid #e2e8f0",
  borderRadius: 9,
  fontSize: 13.5,
  fontFamily: "var(--font-sans)",
  color: "#1e293b",
  background: "#f8fafc",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
  boxSizing: "border-box",
};
