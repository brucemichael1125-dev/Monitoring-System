import { useState } from "react";
import { useAppData } from "../data/AppDataContext";
import { formatRWF } from "../data/mockData";
import type { Expense, User } from "../data/mockData";

type SortKey = "expense_date" | "amount" | "category_id";

interface Props { user: User; }

export default function Expenses({ user }: Props) {
  const { expenses, addExpense, updateExpense, deleteExpense, categories } = useAppData();
  const catName  = (id: number) => categories.find((c) => c.category_id === id)?.category_name ?? "Unknown";
  const catColor = (id: number) => categories.find((c) => c.category_id === id)?.color ?? "#94a3b8";
  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState(0);
  const [sortKey, setSortKey]     = useState<SortKey>("expense_date");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<Expense | null>(null);
  const [deleteId, setDeleteId]   = useState<number | null>(null);
  const [form, setForm]           = useState({ category_id: 1, amount: "", description: "", expense_date: "" });
  const [formError, setFormError] = useState("");

  const filtered = expenses
    .filter((e) =>
      (!filterCat || e.category_id === filterCat) &&
      (!search || e.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortKey === "amount")       return b.amount - a.amount;
      if (sortKey === "expense_date") return b.expense_date.localeCompare(a.expense_date);
      return a.category_id - b.category_id;
    });

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  function openAdd() {
    setEditing(null);
    setFormError("");
    setForm({ category_id: 1, amount: "", description: "", expense_date: new Date().toISOString().slice(0, 10) });
    setShowModal(true);
  }

  function openEdit(exp: Expense) {
    setEditing(exp);
    setFormError("");
    setForm({ category_id: exp.category_id, amount: String(exp.amount), description: exp.description, expense_date: exp.expense_date });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.description.trim()) { setFormError("Description is required."); return; }
    if (!form.amount || Number(form.amount) <= 0) { setFormError("Enter a valid amount."); return; }
    if (!form.expense_date) { setFormError("Date is required."); return; }
    setFormError("");
    if (editing) {
      updateExpense({ ...editing, ...form, amount: Number(form.amount) });
    } else {
      addExpense({ ...form, amount: Number(form.amount), created_by: user.full_name });
    }
    setShowModal(false);
  }

  function handleDelete(id: number) {
    deleteExpense(id);
    setDeleteId(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div className="page-hdr">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>Expenses</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Manage and track operational costs</p>
        </div>
        <button onClick={openAdd} style={primaryBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Expense
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gap: 12 }} className="rg-3">
        <SumCard label="Total Expenses" value={formatRWF(expenses.reduce((s, e) => s + e.amount, 0))} color="#ef4444" bg="#fef2f2" border="#fecaca" />
        <SumCard label="Filtered Total"  value={formatRWF(total)}                                      color="#d97706" bg="#fffbeb" border="#fde68a" />
        <SumCard label="Records Shown"   value={`${filtered.length} / ${expenses.length}`}             color="#3b82f6" bg="#eff6ff" border="#bfdbfe" />
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1px solid #e2e8f0", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder="Search descriptions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 34 }}
          />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(Number(e.target.value))} style={{ ...inputStyle, maxWidth: 210 }}>
          <option value={0}>All Categories</option>
          {categories.map((c) => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
        </select>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} style={{ ...inputStyle, maxWidth: 160 }}>
          <option value="expense_date">Sort: Date ↓</option>
          <option value="amount">Sort: Amount ↓</option>
          <option value="category_id">Sort: Category</option>
        </select>
        {(search || filterCat !== 0) && (
          <button
            onClick={() => { setSearch(""); setFilterCat(0); }}
            style={{ padding: "8px 12px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, color: "#64748b", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 600 }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div className="tbl-scroll">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["#", "Date", "Category", "Description", "Amount (RWF)", "Recorded By", "Actions"].map((h) => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((exp, i) => {
              const color = catColor(exp.category_id);
              return (
                <tr
                  key={exp.expense_id}
                  style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 16px", color: "#cbd5e1", fontFamily: "var(--font-mono)", fontSize: 11 }}>{i + 1}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{exp.expense_date}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "3px 9px", borderRadius: 20,
                      background: color + "14", fontSize: 11, fontWeight: 600, color: color,
                      border: `1px solid ${color}28`,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />
                      {catName(exp.category_id).split(" ")[0]}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#1e293b", maxWidth: 280 }}>{exp.description}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#ef4444", whiteSpace: "nowrap" }}>{formatRWF(exp.amount)}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 12 }}>{exp.created_by}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <IconBtn color="#3b82f6" onClick={() => openEdit(exp)} title="Edit">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </IconBtn>
                      <IconBtn color="#ef4444" onClick={() => setDeleteId(exp.expense_id)} title="Delete">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "48px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#475569" }}>No expenses found</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Try adjusting your search or filters</div>
                </td>
              </tr>
            )}
          </tbody>
          {filtered.length > 0 && (
            <tfoot>
              <tr style={{ background: "#f0faf3", borderTop: "2px solid #b3e6c4" }}>
                <td colSpan={4} style={{ padding: "11px 16px", fontWeight: 700, fontSize: 11.5, color: "#2d8a4e", letterSpacing: "0.06em" }}>
                  FILTERED TOTAL ({filtered.length} records)
                </td>
                <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "#2d8a4e", fontSize: 13 }}>{formatRWF(total)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editing ? "Edit Expense" : "Add Expense"} onClose={() => setShowModal(false)}>
          <FormField label="Category">
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })} style={inputStyle}>
              {categories.map((c) => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
            </select>
          </FormField>
          <FormField label="Description">
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the expense…" style={inputStyle} />
          </FormField>
          <FormField label="Amount (RWF)">
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 250,000" style={inputStyle} />
          </FormField>
          <FormField label="Date">
            <input type="date" value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} style={inputStyle} />
          </FormField>
          {formError && (
            <div style={{ padding: "8px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 7, fontSize: 12.5, color: "#b91c1c" }}>
              {formError}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <button onClick={() => setShowModal(false)} style={ghostBtn}>Cancel</button>
            <button onClick={handleSave} style={{ ...primaryBtn, padding: "9px 20px", boxShadow: "none" }}>Save Expense</button>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <Modal title="Delete Expense" onClose={() => setDeleteId(null)}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 4 }}>Are you sure?</div>
              <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>This expense will be permanently deleted and cannot be recovered.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <button onClick={() => setDeleteId(null)} style={ghostBtn}>Cancel</button>
            <button onClick={() => handleDelete(deleteId)} style={{ ...primaryBtn, padding: "9px 20px", background: "#ef4444", boxShadow: "none" }}>Delete</button>
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
      onClick={onClick}
      title={title}
      style={{ width: 30, height: 30, background: color + "14", border: `1px solid ${color}22`, borderRadius: 7, cursor: "pointer", color, display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "background 0.12s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = color + "28")}
      onMouseLeave={(e) => (e.currentTarget.style.background = color + "14")}
    >
      {children}
    </button>
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
