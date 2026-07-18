import { useState } from "react";
import { EXPENSES, REVENUES, formatRWF } from "../data/mockData";
import type { User } from "../data/mockData";

interface Props { user: User; }

export default function Profile({ user }: Props) {
  const [form, setForm] = useState({ full_name: user.full_name, email: user.email, phone: user.phone });
  const [saved, setSaved] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.current !== "password123") { setPwMsg("Current password is incorrect."); return; }
    if (pwForm.newPw.length < 6) { setPwMsg("New password must be at least 6 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg("Passwords do not match."); return; }
    setPwMsg("✓ Password updated successfully.");
    setPwForm({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setPwMsg(""), 3000);
  }

  const myExpenses = EXPENSES.filter((e) => e.created_by === user.full_name);
  const myRevenues = REVENUES.filter((r) => r.created_by === user.full_name);
  const initials = user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  const ROLE_DESC: Record<string, string> = {
    admin:   "Full system access — manage users, view all data, generate reports.",
    manager: "Can add/edit expenses and revenue, set budgets, view reports.",
    staff:   "Can record expenses and revenue. Cannot manage users or budgets.",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 800 }}>

      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>My Profile</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Manage your account settings</p>
      </div>

      {/* Profile header card */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #e2e8f0", display: "flex", gap: 24, alignItems: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "linear-gradient(135deg, #0e3a1d, #2d8a4e)",
          color: "#4ead6b", fontSize: 28, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", letterSpacing: "-0.01em" }}>{user.full_name}</div>
          <div style={{ fontSize: 13, color: "#64748b", margin: "4px 0 8px", fontFamily: "var(--font-mono)" }}>@{user.username}</div>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{
              padding: "4px 12px", borderRadius: 20,
              background: "#d8f3e1", color: "#155229",
              fontSize: 12, fontWeight: 700, textTransform: "capitalize",
            }}>{user.role}</span>
            <span style={{ fontSize: 12, color: "#94a3b8", alignSelf: "center" }}>Member since {user.created_at}</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "center" }}>
          <div style={{ background: "#fef2f2", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#ef4444", fontFamily: "var(--font-mono)" }}>{myExpenses.length}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Expenses Recorded</div>
          </div>
          <div style={{ background: "#f0faf3", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#2d8a4e", fontFamily: "var(--font-mono)" }}>{myRevenues.length}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Revenues Recorded</div>
          </div>
        </div>
      </div>

      {/* Role permissions */}
      <div style={{ background: "#fffbeb", borderRadius: 12, padding: "16px 20px", border: "1px solid #fde68a", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 18 }}>ℹ️</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
          <div style={{ fontSize: 13, color: "#78350f" }}>{ROLE_DESC[user.role]}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Edit profile */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e293b", margin: "0 0 18px" }}>Edit Profile</h3>
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Full Name">
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Phone">
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Username (read-only)">
              <input value={user.username} disabled style={{ ...inputStyle, background: "#f1f5f9", color: "#94a3b8" }} />
            </Field>
            {saved && (
              <div style={{ padding: "8px 12px", background: "#f0faf3", border: "1px solid #b3e6c4", borderRadius: 8, fontSize: 13, color: "#2d8a4e", fontWeight: 600 }}>
                ✓ Profile saved successfully.
              </div>
            )}
            <button type="submit" style={{ ...btnStyle("#2d8a4e"), marginTop: 4 }}>Save Changes</button>
          </form>
        </div>

        {/* Change password */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e293b", margin: "0 0 18px" }}>Change Password</h3>
          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Current Password">
              <input type="password" value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} placeholder="••••••••" style={inputStyle} />
            </Field>
            <Field label="New Password">
              <input type="password" value={pwForm.newPw} onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })} placeholder="Min. 6 characters" style={inputStyle} />
            </Field>
            <Field label="Confirm New Password">
              <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} placeholder="Repeat new password" style={inputStyle} />
            </Field>
            {pwMsg && (
              <div style={{
                padding: "8px 12px",
                background: pwMsg.startsWith("✓") ? "#f0faf3" : "#fef2f2",
                border: `1px solid ${pwMsg.startsWith("✓") ? "#b3e6c4" : "#fecaca"}`,
                borderRadius: 8, fontSize: 13,
                color: pwMsg.startsWith("✓") ? "#2d8a4e" : "#b91c1c", fontWeight: 600,
              }}>
                {pwMsg}
              </div>
            )}
            <button type="submit" style={{ ...btnStyle("#475569"), marginTop: 4 }}>Update Password</button>
          </form>
        </div>
      </div>

      {/* My activity */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e293b", margin: "0 0 16px" }}>My Recent Activity</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: "0.05em", marginBottom: 10 }}>EXPENSES I RECORDED</div>
            {myExpenses.length === 0 ? <div style={{ color: "#94a3b8", fontSize: 13 }}>None yet.</div> : myExpenses.slice(0, 4).map((e) => (
              <div key={e.expense_id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 12 }}>
                <span style={{ color: "#475569", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.description}</span>
                <span style={{ color: "#ef4444", fontFamily: "var(--font-mono)", fontWeight: 700, marginLeft: 12 }}>{formatRWF(e.amount)}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: "0.05em", marginBottom: 10 }}>REVENUE I RECORDED</div>
            {myRevenues.length === 0 ? <div style={{ color: "#94a3b8", fontSize: 13 }}>None yet.</div> : myRevenues.slice(0, 4).map((r) => (
              <div key={r.revenue_id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 12 }}>
                <span style={{ color: "#475569", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.source}</span>
                <span style={{ color: "#2d8a4e", fontFamily: "var(--font-mono)", fontWeight: 700, marginLeft: 12 }}>{formatRWF(r.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>{label.toUpperCase()}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
  fontSize: 13, fontFamily: "var(--font-sans)", color: "#1e293b",
  background: "#f8fafc", outline: "none", width: "100%", boxSizing: "border-box",
};

function btnStyle(bg: string): React.CSSProperties {
  return { padding: "10px 20px", background: bg, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer" };
}
