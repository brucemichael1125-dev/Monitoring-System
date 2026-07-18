import { useState } from "react";
import { USERS } from "../data/mockData";
import type { User } from "../data/mockData";

interface Props {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find((u) => u.username === username.trim().toLowerCase());
      if (user && password === "password123") {
        onLogin(user);
      } else {
        setError("Invalid username or password.");
      }
      setLoading(false);
    }, 600);
  }

  const demos = [
    { username: "admin",    role: "Admin",   name: "Jean-Pierre", color: "#b45309", bg: "#fef3c7" },
    { username: "claudine", role: "Manager", name: "Claudine",    color: "#1d4ed8", bg: "#eff6ff" },
    { username: "theo",     role: "Staff",   name: "Théodore",    color: "#15803d", bg: "#f0fdf4" },
  ];

  const features = [
    "Track operational expenses by category",
    "Monitor revenue from multiple streams",
    "Budget vs actual variance analysis",
    "Role-based access control",
    "Automated financial reports",
  ];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "var(--font-sans)",
      background: "#071d0e",
    }}>
      {/* Left panel — branding */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 64px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative background circles */}
        <div style={{
          position: "absolute", top: -120, right: -120,
          width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,138,78,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: -80,
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(78,173,107,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 52 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, #2d8a4e 0%, #4ead6b 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, boxShadow: "0 4px 16px rgba(45,138,78,0.4)",
          }}>🌿</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.01em" }}>GreenHarvest</div>
            <div style={{ fontSize: 10.5, color: "#4ead6b", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", marginTop: 2 }}>AGRIBUSINESS LTD · RWANDA</div>
          </div>
        </div>

        <h1 style={{
          fontSize: 40, fontWeight: 800, lineHeight: 1.12,
          letterSpacing: "-0.03em", margin: "0 0 20px",
        }}>
          Cost & Revenue<br />
          <span style={{ color: "#4ead6b" }}>Monitoring</span><br />
          System
        </h1>

        <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.58)", lineHeight: 1.7, maxWidth: 380, margin: "0 0 36px" }}>
          Track operational expenses, monitor revenue streams, manage budgets and generate actionable reports — all in one place.
        </p>

        {/* Feature list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 44 }}>
          {features.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                background: "rgba(78,173,107,0.2)",
                border: "1px solid rgba(78,173,107,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ead6b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 28 }}>
          {[
            { value: "20+", label: "Expenses Tracked" },
            { value: "15+", label: "Revenue Records" },
            { value: "8",   label: "Categories" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#4ead6b", fontFamily: "var(--font-mono)", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 52, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🇷🇼</span>
          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)" }}>BIT Final-Year Project · University of Rwanda · 2025</span>
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={{
        width: 448,
        flexShrink: 0,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "56px 48px",
        boxShadow: "-12px 0 60px rgba(0,0,0,0.25)",
      }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0e3a1d", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <InputField label="Username" placeholder="e.g. admin">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              required
              style={inputCss}
            />
          </InputField>

          <InputField label="Password" placeholder="">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              style={inputCss}
            />
          </InputField>

          {error && (
            <div style={{
              padding: "10px 14px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              fontSize: 13,
              color: "#b91c1c",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              background: loading ? "#94a3b8" : "linear-gradient(135deg, #1e6b3a 0%, #2d8a4e 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.15s, transform 0.1s",
              marginTop: 4,
              letterSpacing: "0.01em",
              boxShadow: loading ? "none" : "0 2px 12px rgba(45,138,78,0.35)",
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = "0.92"; }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={{
          marginTop: 28,
          padding: "16px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", marginBottom: 10 }}>DEMO ACCOUNTS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {demos.map((d) => (
              <button
                key={d.username}
                onClick={() => { setUsername(d.username); setPassword("password123"); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 10px",
                  background: "transparent",
                  border: "1px solid transparent",
                  borderRadius: 7,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.12s, border-color 0.12s",
                }}
                onMouseEnter={(e) => { (e.currentTarget.style.background = d.bg); (e.currentTarget.style.borderColor = d.color + "30"); }}
                onMouseLeave={(e) => { (e.currentTarget.style.background = "transparent"); (e.currentTarget.style.borderColor = "transparent"); }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: d.bg, color: d.color,
                  fontSize: 10.5, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {d.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", fontFamily: "var(--font-mono)" }}>{d.username}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{d.name}</div>
                </div>
                <span style={{
                  padding: "2px 8px", borderRadius: 12,
                  background: d.bg, color: d.color,
                  fontSize: 10, fontWeight: 700,
                }}>
                  {d.role}
                </span>
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8, borderTop: "1px solid #f1f5f9", paddingTop: 8 }}>
            Password for all accounts: <span style={{ fontFamily: "var(--font-mono)", color: "#475569", fontWeight: 600 }}>password123</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, children }: { label: string; placeholder?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11.5, fontWeight: 700, color: "#475569", letterSpacing: "0.06em", display: "block", marginBottom: 7 }}>
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

const inputCss: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid #e2e8f0",
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "var(--font-sans)",
  color: "#1e293b",
  background: "#f8fafc",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box",
};
