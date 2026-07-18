import { useState } from "react";
import { BUDGETS, CATEGORIES, EXPENSES, MONTHS, formatRWF, getCategoryName, getCategoryColor } from "../data/mockData";
import type { Budget } from "../data/mockData";

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>(BUDGETS);
  const [filterMonth, setFilterMonth] = useState(1);
  const [filterYear, setFilterYear] = useState(2025);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ category_id: 1, budget_amount: "", month: 1, year: 2025 });

  const filtered = budgets.filter((b) => b.month === filterMonth && b.year === filterYear);

  // Calculate actual spend for comparison
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
  const variance = totalBudget - totalActual;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>Budgets</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Plan and compare budget vs actual spending</p>
        </div>
        <button onClick={openAdd} style={btnStyle("#2d8a4e")}>+ Set Budget</button>
      </div>

      {/* Month/Year filter */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "14px 20px", border: "1px solid #e2e8f0", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>FILTER BY:</label>
        <select value={filterMonth} onChange={(e) => setFilterMonth(Number(e.target.value))} style={{ ...inputStyle, maxWidth: 140 }}>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={filterYear} onChange={(e) => setFilterYear(Number(e.target.value))} style={{ ...inputStyle, maxWidth: 100 }}>
          {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <span style={{ fontSize: 13, color: "#94a3b8" }}>{filtered.length} budget lines for {MONTHS[filterMonth - 1]} {filterYear}</span>
      </div>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <SumCard label="TOTAL BUDGETED" value={formatRWF(totalBudget)} color="#3b82f6" />
        <SumCard label="TOTAL ACTUAL" value={formatRWF(totalActual)} color="#ef4444" />
        <SumCard label={variance >= 0 ? "UNDER BUDGET" : "OVER BUDGET"} value={formatRWF(Math.abs(variance))} color={variance >= 0 ? "#2d8a4e" : "#ef4444"} />
      </div>

      {/* Budget vs Actual rows */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Category", "Budgeted (RWF)", "Actual (RWF)", "Variance", "Usage", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const actual = getActual(b.category_id, b.month, b.year);
              const vari = b.budget_amount - actual;
              const pct = Math.min(100, b.budget_amount > 0 ? Math.round((actual / b.budget_amount) * 100) : 0);
              const over = actual > b.budget_amount;
              return (
                <tr key={b.budget_id} style={{ borderBottom: "1px solid #f1f5f9" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: getCategoryColor(b.category_id), flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>{getCategoryName(b.category_id)}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", color: "#3b82f6" }}>{formatRWF(b.budget_amount)}</td>
                  <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", color: over ? "#ef4444" : "#1e293b" }}>{formatRWF(actual)}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
                      color: vari >= 0 ? "#2d8a4e" : "#ef4444",
                    }}>
                      {vari >= 0 ? "+" : ""}{formatRWF(vari)}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", minWidth: 140 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: over ? "#ef4444" : "#2d8a4e", borderRadius: 3, transition: "width 0.3s" }} />
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: over ? "#ef4444" : "#64748b", flexShrink: 0 }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(b)} style={iconBtn("#3b82f6")}>✎</button>
                      <button onClick={() => setDeleteId(b.budget_id)} style={iconBtn("#ef4444")}>✕</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                No budgets set for {MONTHS[filterMonth - 1]} {filterYear}. Click "+ Set Budget" to add one.
              </td></tr>
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
            <input type="number" value={form.budget_amount} onChange={(e) => setForm({ ...form, budget_amount: e.target.value })} placeholder="e.g. 500000" style={inputStyle} />
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
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={btnStyle("#94a3b8")}>Cancel</button>
            <button onClick={handleSave} style={btnStyle("#2d8a4e")}>Save Budget</button>
          </div>
        </Modal>
      )}

      {deleteId !== null && (
        <Modal title="Confirm Delete" onClose={() => setDeleteId(null)}>
          <p style={{ color: "#475569", fontSize: 14 }}>Remove this budget line?</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setDeleteId(null)} style={btnStyle("#94a3b8")}>Cancel</button>
            <button onClick={() => { setBudgets((p) => p.filter((b) => b.budget_id !== deleteId)); setDeleteId(null); }} style={btnStyle("#ef4444")}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SumCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "14px 18px", border: "1px solid #e2e8f0" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "var(--font-mono)", marginTop: 6 }}>{value}</div>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
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
