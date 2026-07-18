import { useState } from "react";
import { REVENUES, formatRWF } from "../data/mockData";
import type { Revenue } from "../data/mockData";

export default function RevenuePage() {
  const [revenues, setRevenues] = useState<Revenue[]>(REVENUES);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Revenue | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ source: "", amount: "", description: "", revenue_date: "" });

  const filtered = revenues.filter((r) =>
    !search || r.source.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => b.revenue_date.localeCompare(a.revenue_date));

  const total = filtered.reduce((s, r) => s + r.amount, 0);

  function openAdd() {
    setEditing(null);
    setForm({ source: "", amount: "", description: "", revenue_date: new Date().toISOString().slice(0, 10) });
    setShowModal(true);
  }

  function openEdit(rev: Revenue) {
    setEditing(rev);
    setForm({ source: rev.source, amount: String(rev.amount), description: rev.description, revenue_date: rev.revenue_date });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.source || !form.amount || !form.revenue_date) return;
    if (editing) {
      setRevenues((prev) => prev.map((r) => r.revenue_id === editing.revenue_id
        ? { ...r, ...form, amount: Number(form.amount) } : r));
    } else {
      const newId = Math.max(...revenues.map((r) => r.revenue_id)) + 1;
      setRevenues((prev) => [...prev, { revenue_id: newId, ...form, amount: Number(form.amount), created_by: "Admin" }]);
    }
    setShowModal(false);
  }

  function handleDelete(id: number) {
    setRevenues((prev) => prev.filter((r) => r.revenue_id !== id));
    setDeleteId(null);
  }

  // Source breakdown
  const sources = revenues.reduce<Record<string, number>>((acc, r) => {
    const key = r.source.split(" — ")[0].trim();
    acc[key] = (acc[key] ?? 0) + r.amount;
    return acc;
  }, {});
  const topSources = Object.entries(sources).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>Revenue</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Track all income and revenue streams</p>
        </div>
        <button onClick={openAdd} style={btnStyle("#2d8a4e")}>+ Add Revenue</button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {topSources.map(([src, amt]) => (
          <div key={src} style={{ background: "#fff", borderRadius: 10, padding: "14px 18px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{src.toUpperCase()}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#2d8a4e", fontFamily: "var(--font-mono)" }}>{formatRWF(amt)}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "14px 20px", border: "1px solid #e2e8f0", display: "flex", gap: 12, alignItems: "center" }}>
        <input placeholder="Search source or description…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 320 }} />
        <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: "auto" }}>
          {filtered.length} records · Total: <strong style={{ color: "#2d8a4e", fontFamily: "var(--font-mono)" }}>{formatRWF(total)}</strong>
        </span>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["#", "Date", "Source", "Description", "Amount", "Recorded By", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((rev, i) => (
              <tr key={rev.revenue_id} style={{ borderBottom: "1px solid #f1f5f9" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "12px 16px", color: "#94a3b8", fontFamily: "var(--font-mono)", fontSize: 11 }}>{i + 1}</td>
                <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "#475569" }}>{rev.revenue_date}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    padding: "3px 8px", borderRadius: 20,
                    background: "#d8f3e1", fontSize: 11, fontWeight: 600, color: "#155229",
                    whiteSpace: "nowrap",
                  }}>
                    {rev.source.split(" — ")[0].trim()}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "#1e293b", maxWidth: 260 }}>{rev.description}</td>
                <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#2d8a4e", whiteSpace: "nowrap" }}>{formatRWF(rev.amount)}</td>
                <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 12 }}>{rev.created_by}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => openEdit(rev)} style={iconBtn("#3b82f6")}>✎</button>
                    <button onClick={() => setDeleteId(rev.revenue_id)} style={iconBtn("#ef4444")}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No revenue records found.</td></tr>
            )}
          </tbody>
          <tfoot>
            <tr style={{ background: "#f0faf3", borderTop: "2px solid #b3e6c4" }}>
              <td colSpan={4} style={{ padding: "12px 16px", fontWeight: 700, fontSize: 12, color: "#2d8a4e" }}>TOTAL REVENUE</td>
              <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "#2d8a4e" }}>{formatRWF(total)}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      {showModal && (
        <Modal title={editing ? "Edit Revenue" : "Add Revenue"} onClose={() => setShowModal(false)}>
          <FormField label="Source">
            <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="e.g. Maize Sales — Kigali" style={inputStyle} />
          </FormField>
          <FormField label="Description">
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description…" style={inputStyle} />
          </FormField>
          <FormField label="Amount (RWF)">
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 1500000" style={inputStyle} />
          </FormField>
          <FormField label="Date">
            <input type="date" value={form.revenue_date} onChange={(e) => setForm({ ...form, revenue_date: e.target.value })} style={inputStyle} />
          </FormField>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={btnStyle("#94a3b8")}>Cancel</button>
            <button onClick={handleSave} style={btnStyle("#2d8a4e")}>Save</button>
          </div>
        </Modal>
      )}

      {deleteId !== null && (
        <Modal title="Confirm Delete" onClose={() => setDeleteId(null)}>
          <p style={{ color: "#475569", fontSize: 14 }}>Delete this revenue record? This cannot be undone.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setDeleteId(null)} style={btnStyle("#94a3b8")}>Cancel</button>
            <button onClick={() => handleDelete(deleteId)} style={btnStyle("#ef4444")}>Delete</button>
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

function iconBtn(color: string): React.CSSProperties {
  return { width: 28, height: 28, background: color + "18", border: "none", borderRadius: 6, cursor: "pointer", color, fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" };
}
