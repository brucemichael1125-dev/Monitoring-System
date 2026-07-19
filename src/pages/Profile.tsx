import { useState } from "react";
import { useAppData } from "../data/AppDataContext";
import { formatRWF } from "../data/mockData";
import type { User } from "../data/mockData";
import { supabase } from "../lib/supabase";

interface Props { user: User; onUpdateUser: (u: User) => void; }

const ROLE_CONFIG: Record<string, { color: string; bg: string; border: string; gradient: string; desc: string }> = {
  admin:   { color: "#b45309", bg: "#fef3c7", border: "#fde68a", gradient: "linear-gradient(135deg, #92400e, #b45309)", desc: "Full system access — manage users, view all data, generate reports." },
  manager: { color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe", gradient: "linear-gradient(135deg, #1e40af, #3b82f6)", desc: "Can add/edit expenses and revenue, set budgets, view reports." },
  staff:   { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", gradient: "linear-gradient(135deg, #14532d, #16a34a)", desc: "Can record expenses and revenue. Cannot manage users or budgets." },
};

export default function Profile({ user, onUpdateUser }: Props) {
  const { updateUser, expenses, revenues } = useAppData();
  const [form, setForm]       = useState({ full_name: user.full_name, email: user.email, phone: user.phone });
  const [saved, setSaved]     = useState(false);
  const [pwForm, setPwForm]   = useState({ newPw: "", confirm: "" });
  const [pwMsg,  setPwMsg]    = useState("");
  const [pwOk,   setPwOk]     = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(""); setPwOk(false);
    if (pwForm.newPw.length < 8) { setPwMsg("Password must be at least 8 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg("Passwords do not match."); return; }
    const { error } = await supabase.auth.updateUser({ password: pwForm.newPw });
    if (error) { setPwMsg(error.message); }
    else { setPwOk(true); setPwMsg("Password updated successfully."); setPwForm({ newPw: "", confirm: "" }); }
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const updated: User = { ...user, full_name: form.full_name, email: form.email, phone: form.phone };
    updateUser(updated);
    onUpdateUser(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const myExpenses = expenses.filter((e) =>
    e.created_by_id ? e.created_by_id === user.auth_id : e.created_by === user.full_name
  );
  const myRevenues = revenues.filter((r) =>
    r.created_by_id ? r.created_by_id === user.auth_id : r.created_by === user.full_name
  );
  const initials   = user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const rc         = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.staff;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 820 }}>

      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>My Profile</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Manage your account settings and preferences</p>
      </div>

      {/* Profile header card */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        {/* Green banner */}
        <div style={{ height: 80, background: "linear-gradient(135deg, #09261A 0%, #0e3a1d 50%, #1e6b3a 100%)" }} />
        <div style={{ padding: "0 28px 24px", marginTop: -40 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 16 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: rc.gradient,
              color: "#fff", fontSize: 26, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "4px solid #fff",
              boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            }}>
              {initials}
            </div>
            <div style={{ paddingBottom: 4 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", letterSpacing: "-0.01em" }}>{user.full_name}</div>
              <div style={{ fontSize: 13, color: "#64748b", fontFamily: "var(--font-mono)", marginTop: 2 }}>@{user.username}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, paddingBottom: 4 }}>
              <span style={{
                padding: "5px 14px", borderRadius: 20,
                background: rc.bg, color: rc.color,
                fontSize: 12.5, fontWeight: 700, textTransform: "capitalize",
                border: `1px solid ${rc.border}`,
              }}>{user.role}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Since {user.created_at}</span>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gap: 12 }} className="rg-4">
            <StatBox value={String(myExpenses.length)} label="Expenses Recorded" color="#ef4444" bg="#fef2f2" />
            <StatBox value={String(myRevenues.length)} label="Revenues Recorded" color="#2d8a4e" bg="#f0faf3" />
            <StatBox value={formatRWF(myExpenses.reduce((s, e) => s + e.amount, 0))} label="Total Expenses Value" color="#ef4444" bg="#fef2f2" mono />
            <StatBox value={formatRWF(myRevenues.reduce((s, r) => s + r.amount, 0))} label="Total Revenue Value" color="#2d8a4e" bg="#f0faf3" mono />
          </div>
        </div>
      </div>

      {/* Role info */}
      <div style={{
        background: rc.bg, border: `1px solid ${rc.border}`,
        borderLeft: `4px solid ${rc.color}`,
        borderRadius: 10, padding: "13px 18px",
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={rc.color} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: rc.color, marginBottom: 3 }}>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
          <div style={{ fontSize: 12.5, color: rc.color, opacity: 0.85 }}>{rc.desc}</div>
        </div>
      </div>

      {/* Edit forms */}
      <div style={{ display: "grid", gap: 18 }} className="rg-2">

        {/* Edit profile */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "#1e293b", margin: "0 0 18px" }}>Edit Profile</h3>
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
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
              <div style={{ padding: "9px 13px", background: "#f0faf3", border: "1px solid #b3e6c4", borderRadius: 8, fontSize: 12.5, color: "#15803d", fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Profile saved successfully.
              </div>
            )}
            <button type="submit" style={{ ...primaryBtn, marginTop: 4, justifyContent: "center" }}>Save Changes</button>
          </form>
        </div>

        {/* Change password */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "#1e293b", margin: "0 0 18px" }}>Change Password</h3>
          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <Field label="New Password">
              <input
                type="password"
                value={pwForm.newPw}
                onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                style={inputStyle}
              />
            </Field>
            <Field label="Confirm New Password">
              <input
                type="password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                placeholder="Repeat new password"
                autoComplete="new-password"
                style={inputStyle}
              />
            </Field>
            {pwMsg && (
              <div style={{
                padding: "9px 13px", borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 7,
                background: pwOk ? "#f0faf3" : "#fef2f2",
                border: `1px solid ${pwOk ? "#b3e6c4" : "#fecaca"}`,
                color: pwOk ? "#15803d" : "#b91c1c",
              }}>
                {pwOk
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                }
                {pwMsg}
              </div>
            )}
            <button type="submit" style={{ ...primaryBtn, marginTop: 4, justifyContent: "center" }}>Update Password</button>
          </form>
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "#1e293b", margin: "0 0 18px" }}>My Recent Activity</h3>
        <div style={{ display: "grid", gap: 20 }} className="rg-2">
          <ActivityList
            title="Expenses I Recorded"
            items={myExpenses.slice(0, 5).map((e) => ({ label: e.description, amount: formatRWF(e.amount), amountColor: "#ef4444" }))}
            emptyMsg="No expenses recorded yet."
          />
          <ActivityList
            title="Revenue I Recorded"
            items={myRevenues.slice(0, 5).map((r) => ({ label: r.source, amount: formatRWF(r.amount), amountColor: "#2d8a4e" }))}
            emptyMsg="No revenue records yet."
          />
        </div>
      </div>
    </div>
  );
}

function StatBox({ value, label, color, bg, mono }: { value: string; label: string; color: string; bg: string; mono?: boolean }) {
  return (
    <div style={{ background: bg, borderRadius: 10, padding: "12px 14px", border: "1px solid", borderColor: color + "30" }}>
      <div style={{ fontSize: mono ? 14 : 22, fontWeight: 800, color, fontFamily: mono ? "var(--font-mono)" : "inherit", lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function ActivityList({ title, items, emptyMsg }: { title: string; items: { label: string; amount: string; amountColor: string }[]; emptyMsg: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", marginBottom: 10 }}>{title.toUpperCase()}</div>
      {items.length === 0 ? (
        <div style={{ color: "#94a3b8", fontSize: 13 }}>{emptyMsg}</div>
      ) : (
        items.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 12 }}>
            <span style={{ color: "#475569", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 12 }}>{item.label}</span>
            <span style={{ color: item.amountColor, fontFamily: "var(--font-mono)", fontWeight: 700, flexShrink: 0 }}>{item.amount}</span>
          </div>
        ))
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>{label.toUpperCase()}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
  fontSize: 13, fontFamily: "var(--font-sans)", color: "#1e293b",
  background: "#f8fafc", outline: "none", width: "100%", boxSizing: "border-box",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 20px", background: "#2d8a4e", color: "#fff", border: "none",
  borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer",
  display: "flex", alignItems: "center", gap: 7, boxShadow: "0 2px 8px rgba(45,138,78,0.28)",
};

