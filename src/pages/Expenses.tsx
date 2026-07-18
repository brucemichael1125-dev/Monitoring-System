import { useState } from "react";
import { EXPENSES, CATEGORIES, formatRWF, getCategoryName, getCategoryColor } from "../data/mockData";
import type { Expense } from "../data/mockData";

type SortKey = "expense_date" | "amount" | "category_id";

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>(EXPENSES);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("expense_date");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({ category_id: 1, amount: "", description: "", expense_date: "" });

  const filtered = expenses
    .filter((e) =>
      (!filterCat || e.category_id === filterCat) &&
      (!search || e.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortKey === "amount") return b.amount - a.amount;
      if (sortKey === "expense_date") return b.expense_date.localeCompare(a.expense_date);
      return a.category_id - b.category_id;
    });

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  function openAdd() {
    setEditing(null);
    setForm({ category_id: 1, amount: "", description: "", expense_date: new Date().toISOString().slice(0, 10) });
    setShowModal(true);
  }

  function openEdit(exp: Expense) {
    setEditing(exp);
    setForm({ category_id: exp.category_id, amount: String(exp.amount), description: exp.description, expense_date: exp.expense_date });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.description || !form.amount || !form.expense_date) return;
    if (editing) {
      setExpenses((prev) => prev.map((e) => e.expense_id === editing.expense_id
        ? { ...e, ...form, amount: Number(form.amount) } : e));
    } else {
      const newId = Math.max(...expenses.map((e) => e.expense_id)) + 1;
      setExpenses((prev) => [...prev, { expense_id: newId, ...form, amount: Number(form.amount), created_by: "Admin" }]);
    }
    setShowModal(false);
  }

  function handleDelete(id: number) {
    setExpenses((prev) => prev.filter((e) => e.expense_id !== id));
    setDeleteId(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>Expenses</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Manage and track operational costs</p>
        </div>
        <button onClick={openAdd} style={btnStyle("#2d8a4e")}>+ Add Expense</button>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <SummaryCard label="Total Expenses" value={formatRWF(expenses.reduce((s, e) => s + e.amount, 0))} color="#ef4444" />
        <SummaryCard label="Filtered Total" value={formatRWF(total)} color="#f59e0b" />
        <SummaryCard label="Records Shown" value={`${filtered.length} / ${expenses.length}`} color="#3b82f6" />
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #e2e8f0", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          placeholder="Search description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />
        <select value={filterCat} onChange={(e) => setFilterCat(Number(e.target.value))} style={{ ...inputStyle, maxWidth: 220 }}>
          <option value={0}>All Categories</option>
          {CATEGORIES.map((c) => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
        </select>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} style={{ ...inputStyle, maxWidth: 160 }}>
          <option value="expense_date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
          <option value="category_id">Sort: Category</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["#", "Date", "Category", "Description", "Amount", "Recorded By", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((exp, i) => (
              <tr key={exp.expense_id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "12px 16px", color: "#94a3b8", fontFamily: "var(--font-mono)", fontSize: 11 }}>{i + 1}</td>
                <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "#475569" }}>{exp.expense_date}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "3px 8px", borderRadius: 20,
                    background: getCategoryColor(exp.category_id) + "18",
                    fontSize: 11, fontWeight: 600, color: getCategoryColor(exp.category_id),
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: getCategoryColor(exp.category_id), display: "inline-block" }} />
                    {getCategoryName(exp.category_id).split(" ")[0]}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "#1e293b", maxWidth: 280 }}>{exp.description}</td>
                <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#ef4444", whiteSpace: "nowrap" }}>{formatRWF(exp.amount)}</td>
                <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 12 }}>{exp.created_by}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => openEdit(exp)} style={iconBtn("#3b82f6")}>✎</button>
                    <button onClick={() => setDeleteId(exp.expense_id)} style={iconBtn("#ef4444")}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No expenses found.</td></tr>
            )}
          </tbody>
          <tfoot>
            <tr style={{ background: "#f0faf3", borderTop: "2px solid #b3e6c4" }}>
              <td colSpan={4} style={{ padding: "12px 16px", fontWeight: 700, fontSize: 12, color: "#2d8a4e" }}>FILTERED TOTAL</td>
              <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "#2d8a4e" }}>{formatRWF(total)}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editing ? "Edit Expense" : "Add Expense"} onClose={() => setShowModal(false)}>
          <FormField label="Category">
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })} style={inputStyle}>
              {CATEGORIES.map((c) => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
            </select>
          </FormField>
          <FormField label="Description">
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the expense…" style={inputStyle} />
          </FormField>
          <FormField label="Amount (RWF)">
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 250000" style={inputStyle} />
          </FormField>
          <FormField label="Date">
            <input type="date" value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} style={inputStyle} />
          </FormField>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={btnStyle("#94a3b8")}>Cancel</button>
            <button onClick={handleSave} style={btnStyle("#2d8a4e")}>Save</button>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <Modal title="Confirm Delete" onClose={() => setDeleteId(null)}>
          <p style={{ color: "#475569", fontSize: 14 }}>Are you sure you want to delete this expense? This action cannot be undone.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setDeleteId(null)} style={btnStyle("#94a3b8")}>Cancel</button>
            <button onClick={() => handleDelete(deleteId)} style={btnStyle("#ef4444")}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
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
  return {
    padding: "9px 18px", background: bg, color: "#fff", border: "none",
    borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer",
  };
}

function iconBtn(color: string): React.CSSProperties {
  return {
    width: 28, height: 28, background: color + "18", border: "none",
    borderRadius: 6, cursor: "pointer", color, fontSize: 13, fontWeight: 700,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
  };
}
