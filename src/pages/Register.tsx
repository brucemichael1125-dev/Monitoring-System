import { useState } from "react";
import type { Role } from "../data/mockData";

interface Props {
  onBack: () => void;
}

interface FormState {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  role: Role;
  password: string;
  confirm: string;
}

const INITIAL_FORM: FormState = {
  full_name: "",
  username: "",
  email: "",
  phone: "",
  role: "staff",
  password: "",
  confirm: "",
};

const ROLE_INFO: Record<Role, { label: string; description: string; color: string; bg: string; permissions: string[] }> = {
  admin: {
    label: "Admin",
    description: "Full system access. Can manage users, view all data, and administer settings.",
    color: "#b45309",
    bg: "#fef3c7",
    permissions: ["Manage users", "View all records", "Generate reports", "System settings"],
  },
  manager: {
    label: "Manager",
    description: "Financial oversight role. Reviews expenses, revenues, manages budgets and reports.",
    color: "#1d4ed8",
    bg: "#eff6ff",
    permissions: ["View all financial records", "Manage budgets", "Generate reports", "No user management"],
  },
  staff: {
    label: "Staff",
    description: "Operational data entry role. Records daily expenses and revenues.",
    color: "#15803d",
    bg: "#f0fdf4",
    permissions: ["Add expenses", "Add revenues", "View own records", "No budget/report access"],
  },
};

export default function Register({ onBack }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState<{ name: string; username: string; role: Role } | null>(null);

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.full_name.trim())         e.full_name = "Full name is required.";
    if (!form.username.trim())          e.username  = "Username is required.";
    else if (form.username.includes(" ")) e.username  = "Username cannot contain spaces.";
    if (!form.email.includes("@"))      e.email     = "Enter a valid email address.";
    if (!form.phone.trim())             e.phone     = "Phone number is required.";
    if (form.password.length < 6)       e.password  = "Password must be at least 6 characters.";
    if (form.password !== form.confirm) e.confirm   = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setRegistered({ name: form.full_name, username: form.username, role: form.role });
      setSuccess(true);
      setLoading(false);
    }, 800);
  }

  function registerAnother() {
    setForm(INITIAL_FORM);
    setErrors({});
    setSuccess(false);
    setRegistered(null);
  }

  const roleInfo = ROLE_INFO[form.role];

  // Success screen
  if (success && registered) {
    const r = ROLE_INFO[registered.role];
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #071d0e 0%, #0e3a1d 60%, #155229 100%)",
        fontFamily: "var(--font-sans)", padding: 24,
      }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 48, maxWidth: 500, width: "100%", textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f0faf3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 20px" }}>✓</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0e3a1d", margin: "0 0 8px" }}>User Registered!</h2>
          <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px", lineHeight: 1.6 }}>
            <strong>{registered.name}</strong> has been successfully registered with the <strong>{registered.role}</strong> role.
          </p>

          <div style={{ background: r.bg, border: `1px solid ${r.color}30`, borderRadius: 12, padding: 18, marginBottom: 28, textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: r.color, letterSpacing: "0.06em", marginBottom: 8 }}>{r.label.toUpperCase()} PERMISSIONS</div>
            {r.permissions.map((p) => (
              <div key={p} style={{ fontSize: 13, color: "#475569", display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ color: r.color, fontWeight: 700 }}>✓</span> {p}
              </div>
            ))}
          </div>

          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 16px", marginBottom: 24, textAlign: "left" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 6 }}>LOGIN CREDENTIALS</div>
            <div style={{ fontSize: 13, color: "#1e293b" }}>Username: <strong style={{ fontFamily: "var(--font-mono)" }}>{registered.username}</strong></div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Password: set during registration</div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={onBack} style={{ flex: 1, ...btn("#f1f5f9", "#475569") }}>← Back to System</button>
            <button onClick={registerAnother} style={{ flex: 1, ...btn("#2d8a4e", "#fff") }}>Register Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "linear-gradient(135deg, #071d0e 0%, #0e3a1d 60%, #155229 100%)",
      fontFamily: "var(--font-sans)",
    }}>

      {/* Left — branding + role preview */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 56px", color: "#fff" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", borderRadius: 8, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-sans)", marginBottom: 48, alignSelf: "flex-start" }}>
          ← Back to Dashboard
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#2d8a4e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🌿</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.01em", lineHeight: 1.4 }}>AGRI-BUSINESS OPERATIONAL COST</div>
            <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.01em", lineHeight: 1.4 }}>AND BUDGET MONITORING SYSTEM</div>
          </div>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 12px", lineHeight: 1.1 }}>
          Register<br />New User
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 340, marginBottom: 36 }}>
          Create a new system account and assign the appropriate role based on the user's responsibilities.
        </p>

        {/* Role preview card */}
        <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#4ead6b", letterSpacing: "0.1em", marginBottom: 12 }}>SELECTED ROLE PREVIEW</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ padding: "4px 12px", borderRadius: 20, background: roleInfo.bg, color: roleInfo.color, fontSize: 12, fontWeight: 700 }}>{roleInfo.label}</span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: "0 0 14px" }}>{roleInfo.description}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {roleInfo.permissions.map((p) => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                <span style={{ color: p.startsWith("No") ? "#ef4444" : "#4ead6b", fontWeight: 700 }}>
                  {p.startsWith("No") ? "✕" : "✓"}
                </span>
                {p}
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 40 }}>
          Admin access required · Agri-Business Monitoring System · Rwanda 2025
        </p>
      </div>

      {/* Right — registration form */}
      <div style={{ width: 500, flexShrink: 0, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 44px", overflowY: "auto" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Create Account</h2>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 28px" }}>All fields are required</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Full name + username */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Full Name" error={errors.full_name}>
              <input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="e.g. Amina Uwase"
                style={fieldStyle(!!errors.full_name)}
              />
            </Field>
            <Field label="Username" error={errors.username}>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, "") })}
                placeholder="e.g. amina"
                style={fieldStyle(!!errors.username)}
              />
            </Field>
          </div>

          {/* Email */}
          <Field label="Email Address" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="amina@greenharvest.rw"
              style={fieldStyle(!!errors.email)}
            />
          </Field>

          {/* Phone */}
          <Field label="Phone Number" error={errors.phone}>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+250 788 000 000"
              style={fieldStyle(!!errors.phone)}
            />
          </Field>

          {/* Role selector */}
          <div>
            <label style={labelSt}>ROLE</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {(["admin", "manager", "staff"] as Role[]).map((role) => {
                const r = ROLE_INFO[role];
                const selected = form.role === role;
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setForm({ ...form, role })}
                    style={{
                      padding: "12px 10px",
                      border: `2px solid ${selected ? r.color : "#e2e8f0"}`,
                      borderRadius: 10,
                      background: selected ? r.bg : "#f8fafc",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: selected ? r.color : "#94a3b8", textTransform: "capitalize" }}>{role}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Password */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Password" error={errors.password}>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                style={fieldStyle(!!errors.password)}
              />
            </Field>
            <Field label="Confirm Password" error={errors.confirm}>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Repeat password"
                style={fieldStyle(!!errors.confirm)}
              />
            </Field>
          </div>

          {/* Password strength indicator */}
          {form.password.length > 0 && (
            <div>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4].map((level) => {
                  const strength = form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? 4 : 3;
                  return (
                    <div key={level} style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: level <= strength ? (strength === 1 ? "#ef4444" : strength === 2 ? "#f59e0b" : strength === 3 ? "#3b82f6" : "#2d8a4e") : "#e2e8f0",
                      transition: "background 0.2s",
                    }} />
                  );
                })}
              </div>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                {form.password.length < 6 ? "Too short" : form.password.length < 10 ? "Weak" : /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? "Strong" : "Moderate"}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "13px",
              background: loading ? "#94a3b8" : "#2d8a4e",
              color: "#fff", border: "none", borderRadius: 8,
              fontSize: 14, fontWeight: 700, fontFamily: "var(--font-sans)",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 4, transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#1e6b3a"; }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#2d8a4e"; }}
          >
            {loading ? "Registering…" : "Register User"}
          </button>
        </form>

        <p style={{ marginTop: 28, fontSize: 11, color: "#cbd5e1", textAlign: "center" }}>
          Admin action · User will be able to login immediately after registration
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelSt}>{label.toUpperCase()}</label>
      {children}
      {error && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{error}</div>}
    </div>
  );
}

const labelSt: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "#475569",
  letterSpacing: "0.06em", display: "block", marginBottom: 6,
};

function fieldStyle(hasError: boolean): React.CSSProperties {
  return {
    padding: "10px 13px",
    border: `1.5px solid ${hasError ? "#ef4444" : "#e2e8f0"}`,
    borderRadius: 8, fontSize: 13, fontFamily: "var(--font-sans)",
    color: "#1e293b", background: "#f8fafc", outline: "none",
    width: "100%", boxSizing: "border-box", transition: "border-color 0.15s",
  };
}

function btn(bg: string, color: string): React.CSSProperties {
  return { padding: "11px 18px", background: bg, color, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer" };
}
