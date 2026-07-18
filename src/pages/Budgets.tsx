import { useState } from "react";
import { BUDGETS, CATEGORIES, EXPENSES, MONTHS, formatRWF, getCategoryName, getCategoryColor } from "../data/mockData";
import type { Budget } from "../data/mockData";

export default function Budgets() {
  const [budgets, setBudgets]     = useState<Budget[]>(BUDGETS);
  const [filterMonth, setFilterMonth] = useState(1);
  const [filterYear, setFilterYear]   = useState(2025);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<Budget | null>(null);
  const [deleteId, setDeleteId]   = useState<number | null>(null);
  const [form, setForm]           = useState({ category_id: 1, budget_amount: "", month: 1, year: 2025 });

  const filtered = budgets.filter((b) => b.month === filterMonth && b.year === filterYear);

  function getActual(category_id: number, month: number, year: number): number {
    return EXPENSES
      .filter((e) => {
        const d = new Date(e.expense_date);
        return e.category_id === category_id && d.getMonth() + 1 === month && d.getFullYear() === year;
      })
      .reduce((s, e) => s + e.amount, 0);
  }

  function openAdd() {
    setEditing(null);
    setForm({ category_id: 1, budget_amount: "", month: filterMonth, year: filterYear });
    setShowModal(true);
  }

  function openEdit(b: Budget) {
    setEditing(b);
    setForm({ category_id: b.category_id, budget_amount: String(b.budget_amount), month: b.month, year: b.year });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.budget_amount) return;
    if (editing) {
      setBudgets((prev) => prev.map((b) => b.budget_id === editing.budget_id
        ? { ...b, ...form, budget_amount: Number(form.budget_amount) } : b));
    } else {
      const newId = Math.max(...budgets.map((b) => b.budget_id)) + 1;
      setBudgets((prev) => [...prev, { budget_id: newId, ...form, budget_amount: Number(form.budget_amount) }]);
    }
    setShowModal(false);
  }

  const totalBudget = filtered.reduce((s, b) => s + b.budget_amount, 0);
  const totalActual = filtered.reduce((s, b) => s + getActual(b.category_id, b.month, b.year), 0);
  const variance    = totalBudget - totalActual;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>Budgets</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Plan and compare budget vs actual spending</p>
        </div>
        <button onClick={openAdd} style={primaryBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Set Budget
        </button>
      </div>

      {/* Month/Year filter */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "13px 18px", border: "1px solid #e2e8f0", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.05em" }}>FILTER BY</span>
        <select value={filterMonth} onChange={(e) => setFilterMonth(Number(e.target.value))} style={{ ...inputStyle, maxWidth: 140 }}>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={filterYear} onChange={(e) => setFilterYear(Number(e.target.value))} style={{ ...inputStyle, maxWidth: 100 }}>
          {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <span style={{ fontSize: 12.5, color: "#94a3b8" }}>
          {filtered.length} budget {filtered.length === 1 ? "line" : "lines"} for{" "}
          <strong style={{ color: "#334155" }}>{MONTHS[filterMonth - 1]} {filterYear}</strong>
        </span>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <SumCard label="Total Budgeted" value={formatRWF(totalBudget)} color="#3b82f6" bg="#eff6ff" border="#bfdbfe" />
        <SumCard label="Total Actual"   value={formatRWF(totalActual)} color="#ef4444" bg="#fef2f2" border="#fecaca" />
        <SumCard
          label={variance >= 0 ? "Under Budget" : "Over Budget"}
          value={formatRWF(Math.abs(variance))}
          color={variance >= 0 ? "#2d8a4e" : "#ef4444"}
          bg={variance >= 0 ? "#f0faf3" : "#fef2f2"}
          border={variance >= 0 ? "#b3e6c4" : "#fecaca"}
        />
      </div>

      {/* Budget vs Actual table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Category", "Budgeted (RWF)", "Actual (RWF)", "Variance", "Usage", "Actions"].map((h) => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const actual = getActual(b.category_id, b.month, b.year);
              const vari   = b.budget_amount - actual;
              const pct    = Math.min(100, b.budget_amount > 0 ? Math.round((actual / b.budget_amount) * 100) : 0);
              const over   = actual > b.budget_amount;
              const catColor = getCategoryColor(b.category_id);
              return (
                <tr
                  key={b.budget_id}
                  style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: catColor, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>{getCategoryName(b.category_id)}</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", fontFamily: "var(--font-mono)", color: "#3b82f6", fontWeight: 600 }}>{formatRWF(b.budget_amount)}</td>
                  <td style={{ padding: "13px 16px", fontFamily: "var(--font-mono)", color: over ? "#ef4444" : "#1e293b", fontWeight: over ? 700 : 400 }}>{formatRWF(actual)}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 12.5, fontWeight: 700,
                      color: vari >= 0 ? "#2d8a4e" : "#ef4444",
                    }}>
                      {vari >= 0 ? "+" : ""}{formatRWF(vari)}
                    </span>
                  </td>
                  <td style={{ padding: "13px 16px", minWidth: 160 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 7, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: over
                            ? "linear-gradient(90deg, #dc2626, #ef4444)"
                            : pct > 80
                              ? "linear-gradient(90deg, #d97706, #f59e0b)"
                              : "linear-gradient(90deg, #2d8a4e, #4ead6b)",
                          borderRadius: 4,
                          transition: "width 0.4s ease",
                        }} />
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: over ? "#ef4444" : "#64748b", flexShrink: 0, fontWeight: 600 }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <IconBtn color="#3b82f6" onClick={() => openEdit(b)} title="Edit">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </IconBtn>
                      <IconBtn color="#ef4444" onClick={() => setDeleteId(b.budget_id)} title="Delete">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#475569" }}>No budgets set</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Click "+ Set Budget" to create one for {MONTHS[filterMonth - 1]} {filterYear}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editing ? "Edit Budget" : "Set Budget"} onClose={() => setShowModal(false)}>
          <FormField label="Category">
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })} style={inputStyle}>
              {CATEGORIES.map((c) => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
            </select>
          </FormField>
          <FormField label="Budget Amount (RWF)">
            <input type="number" value={form.budget_amount} onChange={(e) => setForm({ ...form, budget_amount: e.target.value })} placeholder="e.g. 500,000" style={inputStyle} />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Month">
              <select value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })} style={inputStyle}>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </FormField>
            <FormField label="Year">
              <select value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} style={inputStyle}>
                {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </FormField>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <button onClick={() => setShowModal(false)} style={ghostBtn}>Cancel</button>
            <button onClick={handleSave} style={{ ...primaryBtn, padding: "9px 20px", boxShadow: "none" }}>Save Budget</button>
          </div>
        </Modal>
      )}

      {deleteId !== null && (
        <Modal title="Delete Budget Line" onClose={() => setDeleteId(null)}>
          <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Remove this budget line? This cannot be undone.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setDeleteId(null)} style={ghostBtn}>Cancel</button>
            <button onClick={() => { setBudgets((p) => p.filter((b) => b.budget_id !== deleteId)); setDeleteId(null); }} style={{ ...primaryBtn, padding: "9px 20px", background: "#ef4444", boxShadow: "none" }}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SumCard({ label, value, color, bg, border }: { label: string; value: string; color: string; bg: string; border: string }) {
  return (
    <div style={{ background: bg, borderRadius: 10, padding: "14px 18px", border: `1px solid ${border}`, borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 6 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "var(--font-mono)" }}>{value}</div>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 460, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", border: "1px solid #e2e8f0" }}>
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
