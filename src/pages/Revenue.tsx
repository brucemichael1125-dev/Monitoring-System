import { useState } from "react";
import { REVENUES, formatRWF } from "../data/mockData";
import type { Revenue } from "../data/mockData";

export default function RevenuePage() {
  const [revenues, setRevenues] = useState<Revenue[]>(REVENUES);
  const [search, setSearch]     = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState<Revenue | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm]         = useState({ source: "", amount: "", description: "", revenue_date: "" });

  const filtered = revenues
    .filter((r) => !search || r.source.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.revenue_date.localeCompare(a.revenue_date));

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
      setRevenues((prev) => prev.map((r) => r.revenue_id === editing.revenue_id ? { ...r, ...form, amount: Number(form.amount) } : r));
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

  // Source breakdown for summary cards
  const sources = revenues.reduce<Record<string, number>>((acc, r) => {
    const key = r.source.split(" — ")[0].trim();
    acc[key] = (acc[key] ?? 0) + r.amount;
    return acc;
  }, {});
  const topSources = Object.entries(sources).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div className="page-hdr">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>Revenue</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Track all income and revenue streams</p>
        </div>
        <button onClick={openAdd} style={primaryBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Revenue
        </button>
      </div>

      {/* Source summary cards */}
      <div style={{ display: "grid", gap: 12 }} className="rg-4">
        {topSources.map(([src, amt]) => (
          <div key={src} style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", border: "1px solid #e2e8f0", borderTop: "3px solid #2d8a4e" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {src.toUpperCase()}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#2d8a4e", fontFamily: "var(--font-mono)" }}>{formatRWF(amt)}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1px solid #e2e8f0", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder="Search source or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 34 }}
          />
        </div>
        <span style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0 }}>
          {filtered.length} records ·{" "}
          <strong style={{ color: "#2d8a4e", fontFamily: "var(--font-mono)" }}>{formatRWF(total)}</strong> total
        </span>
        {search && (
          <button onClick={() => setSearch("")} style={{ padding: "8px 12px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, color: "#64748b", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div className="tbl-scroll">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["#", "Date", "Source", "Description", "Amount (RWF)", "Recorded By", "Actions"].map((h) => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((rev, i) => (
              <tr
                key={rev.revenue_id}
                style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "12px 16px", color: "#cbd5e1", fontFamily: "var(--font-mono)", fontSize: 11 }}>{i + 1}</td>
                <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{rev.revenue_date}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    padding: "3px 9px", borderRadius: 20,
                    background: "#f0faf3", fontSize: 11, fontWeight: 600, color: "#15803d",
                    border: "1px solid #b3e6c4", whiteSpace: "nowrap",
                  }}>
                    {rev.source.split(" — ")[0].trim()}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "#1e293b", maxWidth: 260 }}>{rev.description}</td>
                <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#2d8a4e", whiteSpace: "nowrap" }}>+{formatRWF(rev.amount)}</td>
                <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 12 }}>{rev.created_by}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <IconBtn color="#3b82f6" onClick={() => openEdit(rev)} title="Edit">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </IconBtn>
                    <IconBtn color="#ef4444" onClick={() => setDeleteId(rev.revenue_id)} title="Delete">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </IconBtn>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "48px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#475569" }}>No revenue records found</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Try adjusting your search</div>
                </td>
              </tr>
            )}
          </tbody>
          {filtered.length > 0 && (
            <tfoot>
              <tr style={{ background: "#f0faf3", borderTop: "2px solid #b3e6c4" }}>
                <td colSpan={4} style={{ padding: "11px 16px", fontWeight: 700, fontSize: 11.5, color: "#2d8a4e", letterSpacing: "0.06em" }}>
                  TOTAL REVENUE ({filtered.length} records)
                </td>
                <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "#2d8a4e", fontSize: 13 }}>{formatRWF(total)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
        </div>
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
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 1,500,000" style={inputStyle} />
          </FormField>
          <FormField label="Date">
            <input type="date" value={form.revenue_date} onChange={(e) => setForm({ ...form, revenue_date: e.target.value })} style={inputStyle} />
          </FormField>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <button onClick={() => setShowModal(false)} style={ghostBtn}>Cancel</button>
            <button onClick={handleSave} style={{ ...primaryBtn, padding: "9px 20px", boxShadow: "none" }}>Save Revenue</button>
          </div>
        </Modal>
      )}

      {deleteId !== null && (
        <Modal title="Delete Revenue" onClose={() => setDeleteId(null)}>
          <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>This revenue record will be permanently deleted.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setDeleteId(null)} style={ghostBtn}>Cancel</button>
            <button onClick={() => handleDelete(deleteId)} style={{ ...primaryBtn, padding: "9px 20px", background: "#ef4444", boxShadow: "none" }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "min(440px, calc(100vw - 32px))", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", width: 28, height: 28, borderRadius: 7, cursor: "pointer", color: "#64748b", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>{label.toUpperCase()}</label>
      {children}
    </div>
  );
}

function IconBtn({ color, onClick, title, children }: { color: string; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick} title={title}
      style={{ width: 30, height: 30, background: color + "14", border: `1px solid ${color}22`, borderRadius: 7, cursor: "pointer", color, display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "background 0.12s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = color + "28")}
      onMouseLeave={(e) => (e.currentTarget.style.background = color + "14")}
    >{children}</button>
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
