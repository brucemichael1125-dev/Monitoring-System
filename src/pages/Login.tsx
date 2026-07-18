import { useState } from "react";
import { USERS } from "../data/mockData";
import type { User } from "../data/mockData";

interface Props {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Demo: any user from the mock list can log in with password "password123"
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const user = USERS.find((u) => u.username === username.trim().toLowerCase());
      if (user && password === "password123") {
        onLogin(user);
      } else {
        setError("Invalid username or password. Try: admin / password123");
      }
      setLoading(false);
    }, 600);
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "linear-gradient(135deg, #071d0e 0%, #0e3a1d 50%, #155229 100%)",
      fontFamily: "var(--font-sans)",
    }}>

      {/* Left panel — branding */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 64px",
        color: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "#2d8a4e",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24,
          }}>🌿</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.01em" }}>GreenHarvest</div>
            <div style={{ fontSize: 11, color: "#4ead6b", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>AGRIBUSINESS LTD</div>
          </div>
        </div>

        <h1 style={{
          fontSize: 42, fontWeight: 800, lineHeight: 1.1,
          letterSpacing: "-0.03em", margin: "0 0 20px",
        }}>
          Cost & Revenue<br />
          <span style={{ color: "#4ead6b" }}>Monitoring</span><br />
          System
        </h1>

        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 360 }}>
          Track operational expenses, monitor revenue streams, manage budgets, and generate actionable reports — all in one place.
        </p>

        <div style={{ marginTop: 48, display: "flex", gap: 32 }}>
          {[
            { label: "Expenses Tracked", value: "20+" },
            { label: "Revenue Sources", value: "15+" },
            { label: "Categories", value: "8" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#4ead6b", fontFamily: "var(--font-mono)" }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Rwanda flag strip */}
        <div style={{ marginTop: 60, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🇷🇼</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Selected Agribusiness Enterprise, Rwanda</span>
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={{
        width: 440,
        flexShrink: 0,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 48px",
      }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          Sign in
        </h2>
        <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 36px" }}>
          Enter your credentials to access the system
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              required
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1.5px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "var(--font-sans)",
                color: "#1e293b",
                background: "#f8fafc",
                outline: "none",
                transition: "border-color 0.15s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2d8a4e")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1.5px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "var(--font-sans)",
                color: "#1e293b",
                background: "#f8fafc",
                outline: "none",
                transition: "border-color 0.15s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2d8a4e")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          {error && (
            <div style={{
              padding: "10px 14px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              fontSize: 13,
              color: "#b91c1c",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              background: loading ? "#94a3b8" : "#2d8a4e",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.15s",
              marginTop: 4,
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#1e6b3a"; }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#2d8a4e"; }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div style={{
          marginTop: 28,
          padding: "14px 16px",
          background: "#f0faf3",
          border: "1px solid #b3e6c4",
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#2d8a4e", letterSpacing: "0.06em", marginBottom: 8 }}>DEMO CREDENTIALS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { username: "admin",   role: "Admin",   name: "Jean-Pierre" },
              { username: "claudine", role: "Manager", name: "Claudine" },
              { username: "theo",    role: "Staff",   name: "Théodore" },
            ].map((u) => (
              <button
                key={u.username}
                onClick={() => { setUsername(u.username); setPassword("password123"); }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "5px 8px",
                  background: "transparent",
                  border: "1px solid transparent",
                  borderRadius: 6,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#d8f3e1")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "#155229" }}>{u.username}</span>
                <span style={{ fontSize: 11, color: "#4ead6b" }}>{u.role}</span>
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>Password: <span style={{ fontFamily: "var(--font-mono)" }}>password123</span></div>
        </div>

        <p style={{ marginTop: 32, fontSize: 11, color: "#cbd5e1", textAlign: "center" }}>
          BIT Final-Year Project · University of Rwanda · 2025
        </p>
      </div>
    </div>
  );
}
