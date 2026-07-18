import { useState } from "react";
import { USERS } from "../data/mockData";
import type { User, Role } from "../data/mockData";

const ROLE_COLORS: Record<Role, { bg: string; text: string }> = {
  admin:   { bg: "#fef3c7", text: "#b45309" },
  manager: { bg: "#eff6ff", text: "#1d4ed8" },
  staff:   { bg: "#f0fdf4", text: "#15803d" },
};

export default function Users() {
  const [users, setUsers] = useState<User[]>(USERS);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ full_name: "", username: "", email: "", phone: "", role: "staff" as Role });

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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>User Management</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Admin-only · Manage system users and roles</p>
        </div>
        <button onClick={openAdd} style={btnStyle("#2d8a4e")}>+ Add User</button>
      </div>

      {/* Role summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {(["admin", "manager", "staff"] as Role[]).map((role) => {
          const count = users.filter((u) => u.role === role).length;
          const c = ROLE_COLORS[role];
          return (
            <div key={role} style={{ background: c.bg, border: `1px solid ${c.text}30`, borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: c.text, letterSpacing: "0.06em", textTransform: "uppercase" }}>{role}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: c.text, fontFamily: "var(--font-mono)", marginTop: 4 }}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* User cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {users.map((u) => {
          const c = ROLE_COLORS[u.role];
          const initials = u.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2);
          return (
            <div key={u.user_id} style={{
              background: "#fff", borderRadius: 12, padding: 20,
              border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 14,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "#0e3a1d", color: "#4ead6b",
                  fontSize: 15, fontWeight: 800, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
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
                  fontSize: 11, fontWeight: 700, textTransform: "capitalize", flexShrink: 0,
                }}>
                  {u.role}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 12, color: "#64748b" }}>📧 {u.email}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>📞 {u.phone}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "var(--font-mono)" }}>Joined: {u.created_at}</div>
              </div>

              <div style={{ display: "flex", gap: 8, paddingTop: 4, borderTop: "1px solid #f1f5f9" }}>
                <button onClick={() => openEdit(u)} style={{ ...btnStyle("#3b82f6"), flex: 1, padding: "7px" }}>Edit</button>
                <button onClick={() => setDeleteId(u.user_id)} style={{ ...btnStyle("#ef4444"), flex: 1, padding: "7px" }}>Remove</button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title={editing ? "Edit User" : "Add User"} onClose={() => setShowModal(false)}>
          <FormField label="Full Name">
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="e.g. Amina Mukamana" style={inputStyle} />
          </FormField>
          <FormField label="Username">
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="e.g. amina" style={inputStyle} />
          </FormField>
          <FormField label="Email">
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="amina@greenharvest.rw" style={inputStyle} />
          </FormField>
          <FormField label="Phone">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+250 788 000 000" style={inputStyle} />
          </FormField>
          <FormField label="Role">
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} style={inputStyle}>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
          </FormField>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={btnStyle("#94a3b8")}>Cancel</button>
            <button onClick={handleSave} style={btnStyle("#2d8a4e")}>Save User</button>
          </div>
        </Modal>
      )}

      {deleteId !== null && (
        <Modal title="Remove User" onClose={() => setDeleteId(null)}>
          <p style={{ color: "#475569", fontSize: 14 }}>Remove <strong>{users.find((u) => u.user_id === deleteId)?.full_name}</strong> from the system?</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setDeleteId(null)} style={btnStyle("#94a3b8")}>Cancel</button>
            <button onClick={() => { setUsers((p) => p.filter((u) => u.user_id !== deleteId)); setDeleteId(null); }} style={btnStyle("#ef4444")}>Remove</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#94a3b8" }}>×</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
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
  return { padding: "9px 18px", background: bg, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer" };
}
