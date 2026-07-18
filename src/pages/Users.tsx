import { useState } from "react";
import { USERS } from "../data/mockData";
import type { User, Role } from "../data/mockData";

const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string; gradient: string }> = {
  admin:   { bg: "#fef3c7", text: "#b45309", border: "#fde68a", gradient: "linear-gradient(135deg, #92400e, #b45309)" },
  manager: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe", gradient: "linear-gradient(135deg, #1e40af, #3b82f6)" },
  staff:   { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", gradient: "linear-gradient(135deg, #14532d, #16a34a)" },
};

export default function Users() {
  const [users, setUsers]       = useState<User[]>(USERS);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm]         = useState({ full_name: "", username: "", email: "", phone: "", role: "staff" as Role });

  function openAdd() {
    setEditing(null);
    setForm({ full_name: "", username: "", email: "", phone: "", role: "staff" });
    setShowModal(true);
  }

  function openEdit(u: User) {
    setEditing(u);
    setForm({ full_name: u.full_name, username: u.username, email: u.email, phone: u.phone, role: u.role });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.full_name || !form.username) return;
    if (editing) {
      setUsers((prev) => prev.map((u) => u.user_id === editing.user_id ? { ...u, ...form } : u));
    } else {
      const newId = Math.max(...users.map((u) => u.user_id)) + 1;
      setUsers((prev) => [...prev, { user_id: newId, ...form, created_at: new Date().toISOString().slice(0, 10) }]);
    }
    setShowModal(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div className="page-hdr">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>User Management</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Admin-only · Manage system users and access roles</p>
        </div>
        <button onClick={openAdd} style={primaryBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add User
        </button>
      </div>

      {/* Role summary */}
      <div style={{ display: "grid", gap: 12 }} className="rg-3">
        {(["admin", "manager", "staff"] as Role[]).map((role) => {
          const count = users.filter((u) => u.role === role).length;
          const c = ROLE_COLORS[role];
          return (
            <div key={role} style={{ background: c.bg, border: `1px solid ${c.border}`, borderTop: `3px solid ${c.text}`, borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: c.text, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>{role}s</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: c.text, fontFamily: "var(--font-mono)" }}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* User cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {users.map((u) => {
          const c = ROLE_COLORS[u.role];
          const initials = u.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div
              key={u.user_id}
              style={{
                background: "#fff", borderRadius: 14, padding: 20,
                border: "1px solid #e2e8f0",
                display: "flex", flexDirection: "column", gap: 14,
                transition: "box-shadow 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLDivElement).style.borderColor = "#d1d5db"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%",
                  background: c.gradient,
                  color: "#fff", fontSize: 15, fontWeight: 800, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 2px 10px rgba(0,0,0,0.18)`,
                }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.full_name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "var(--font-mono)" }}>@{u.username}</div>
                </div>
                <span style={{
                  padding: "3px 10px", borderRadius: 20,
                  background: c.bg, color: c.text,
                  fontSize: 11, fontWeight: 700, textTransform: "capitalize",
                  border: `1px solid ${c.border}`, flexShrink: 0,
                }}>
                  {u.role}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <InfoRow icon={<MailIcon />} text={u.email} />
                <InfoRow icon={<PhoneIcon />} text={u.phone} />
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "var(--font-mono)", marginTop: 1 }}>
                  Joined {u.created_at}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, paddingTop: 4, borderTop: "1px solid #f1f5f9" }}>
                <button
                  onClick={() => openEdit(u)}
                  style={{ flex: 1, padding: "7px 12px", background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: 8, fontSize: 12.5, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "background 0.12s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#dbeafe")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#eff6ff")}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(u.user_id)}
                  style={{ flex: 1, padding: "7px 12px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 8, fontSize: 12.5, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "background 0.12s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editing ? "Edit User" : "Add New User"} onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gap: 14 }} className="rg-2">
            <FormField label="Full Name" colSpan>
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="e.g. Amina Mukamana" style={inputStyle} />
            </FormField>
            <FormField label="Username" colSpan>
              <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="e.g. amina" style={inputStyle} />
            </FormField>
          </div>
          <FormField label="Email">
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="amina@greenharvest.rw" style={inputStyle} />
          </FormField>
          <div style={{ display: "grid", gap: 14 }} className="rg-2">
            <FormField label="Phone" colSpan>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+250 788 000 000" style={inputStyle} />
            </FormField>
            <FormField label="Role" colSpan>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} style={inputStyle}>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
            </FormField>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <button onClick={() => setShowModal(false)} style={ghostBtn}>Cancel</button>
            <button onClick={handleSave} style={{ ...primaryBtn, padding: "9px 20px", boxShadow: "none" }}>Save User</button>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <Modal title="Remove User" onClose={() => setDeleteId(null)}>
          <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
            Remove <strong style={{ color: "#1e293b" }}>{users.find((u) => u.user_id === deleteId)?.full_name}</strong> from the system? This action cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setDeleteId(null)} style={ghostBtn}>Cancel</button>
            <button onClick={() => { setUsers((p) => p.filter((u) => u.user_id !== deleteId)); setDeleteId(null); }} style={{ ...primaryBtn, padding: "9px 20px", background: "#ef4444", boxShadow: "none" }}>
              Remove User
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#64748b" }}>
      <span style={{ color: "#94a3b8", display: "flex", alignItems: "center" }}>{icon}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
}

function MailIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
}

function PhoneIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.08-1.08a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "min(480px, calc(100vw - 32px))", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", width: 28, height: 28, borderRadius: 7, cursor: "pointer", color: "#64748b", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children, colSpan }: { label: string; children: React.ReactNode; colSpan?: boolean }) {
  void colSpan;
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
  padding: "9px 18px", background: "#2d8a4e", color: "#fff", border: "none",
  borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 7,
  boxShadow: "0 2px 8px rgba(45,138,78,0.3)",
};

const ghostBtn: React.CSSProperties = {
  padding: "9px 18px", background: "#f1f5f9", color: "#475569",
  border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontWeight: 600,
  fontFamily: "var(--font-sans)", cursor: "pointer",
};
