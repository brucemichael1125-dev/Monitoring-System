import { useState } from "react";
import { EXPENSES, REVENUES, CATEGORIES, formatRWF } from "../data/mockData";
import type { User } from "../data/mockData";

interface Props { user: User; onNavigate: (page: string) => void; }

export default function DashboardStaff({ user, onNavigate }: Props) {
  const myExpenses = EXPENSES.filter((e) => e.created_by === user.full_name);
  const myRevenues = REVENUES.filter((r) => r.created_by === user.full_name);

  const latestMonth = 6;
  const thisMonthExp = myExpenses.filter((e) => new Date(e.expense_date).getMonth() + 1 === latestMonth);
  const thisMonthRev = myRevenues.filter((r) => new Date(r.revenue_date).getMonth() + 1 === latestMonth);

  const myTotalExpenses = myExpenses.reduce((s, e) => s + e.amount, 0);
  const myTotalRevenues = myRevenues.reduce((s, r) => s + r.amount, 0);

  const [quickTab, setQuickTab]   = useState<"expense" | "revenue">("expense");
  const [quickForm, setQuickForm] = useState({ category_id: 1, source: "", amount: "", description: "", date: new Date().toISOString().slice(0, 10) });
  const [submitted, setSubmitted] = useState(false);

  function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2800);
    setQuickForm({ category_id: 1, source: "", amount: "", description: "", date: new Date().toISOString().slice(0, 10) });
  }

  const statCards = [
    { label: "My Expenses (All)",   value: formatRWF(myTotalExpenses),                                   sub: `${myExpenses.length} records`,    accent: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
    { label: "My Revenue (All)",    value: formatRWF(myTotalRevenues),                                   sub: `${myRevenues.length} records`,    accent: "#2d8a4e", bg: "#f0faf3", border: "#b3e6c4" },
    { label: "This Month Expenses", value: formatRWF(thisMonthExp.reduce((s, e) => s + e.amount, 0)),    sub: `${thisMonthExp.length} records`,  accent: "#d97706", bg: "#fffbeb", border: "#fde68a" },
    { label: "This Month Revenue",  value: formatRWF(thisMonthRev.reduce((s, r) => s + r.amount, 0)),    sub: `${thisMonthRev.length} records`,  accent: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", color: "#15803d", fontWeight: 700, letterSpacing: "0.12em" }}>STAFF PORTAL</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>My Dashboard</h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
          Welcome, <strong style={{ color: "#334155" }}>{user.full_name}</strong> ·{" "}
          {new Date().toLocaleDateString("en-RW", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Info banner */}
      <div style={{
        background: "#fffbeb", border: "1px solid #fde68a",
        borderLeft: "4px solid #f59e0b",
        borderRadius: 10, padding: "11px 16px",
        display: "flex", gap: 10, alignItems: "center",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span style={{ fontSize: 12.5, color: "#92400e" }}>
          You can see only records you submitted. Contact your manager for full financial reports.
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gap: 12 }} className="rg-4">
        {statCards.map((card) => (
          <div key={card.label} style={{
            background: card.bg, border: `1px solid ${card.border}`,
            borderTop: `3px solid ${card.accent}`,
            borderRadius: 12, padding: "16px 18px",
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", marginBottom: 8 }}>{card.label.toUpperCase()}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: card.accent, fontFamily: "var(--font-mono)", marginBottom: 4 }}>{card.value}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Main area */}
      <div style={{ display: "grid", gap: 18 }} className="rg-form">

        {/* Quick Add */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg, #09261A 0%, #0e3a1d 100%)",
            padding: "18px 22px",
          }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Quick Add Record</div>
            <div style={{ fontSize: 12, color: "#4ead6b", marginTop: 3 }}>Log your daily field data</div>
          </div>

          {/* Tab toggle */}
          <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0" }}>
            {(["expense", "revenue"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setQuickTab(tab)}
                style={{
                  flex: 1, padding: "11px", border: "none",
                  background: quickTab === tab ? (tab === "expense" ? "#fef2f2" : "#f0faf3") : "#fff",
                  color: quickTab === tab ? (tab === "expense" ? "#b91c1c" : "#15803d") : "#94a3b8",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  borderBottom: quickTab === tab ? `2px solid ${tab === "expense" ? "#ef4444" : "#2d8a4e"}` : "2px solid transparent",
                  transition: "all 0.14s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                {tab === "expense"
                  ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>Expense</>
                  : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>Revenue</>
                }
              </button>
            ))}
          </div>

          <form onSubmit={handleQuickAdd} style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 13 }}>
            {quickTab === "expense" ? (
              <FormField label="Category">
                <select value={quickForm.category_id} onChange={(e) => setQuickForm({ ...quickForm, category_id: Number(e.target.value) })} style={inputStyle}>
                  {CATEGORIES.map((c) => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                </select>
              </FormField>
            ) : (
              <FormField label="Revenue Source">
                <input value={quickForm.source} onChange={(e) => setQuickForm({ ...quickForm, source: e.target.value })} placeholder="e.g. Maize Sales — Kigali" style={inputStyle} />
              </FormField>
            )}
            <FormField label="Description">
              <input value={quickForm.description} onChange={(e) => setQuickForm({ ...quickForm, description: e.target.value })} placeholder="Brief description…" style={inputStyle} required />
            </FormField>
            <FormField label="Amount (RWF)">
              <input type="number" value={quickForm.amount} onChange={(e) => setQuickForm({ ...quickForm, amount: e.target.value })} placeholder="e.g. 150,000" style={inputStyle} required />
            </FormField>
            <FormField label="Date">
              <input type="date" value={quickForm.date} onChange={(e) => setQuickForm({ ...quickForm, date: e.target.value })} style={inputStyle} />
            </FormField>

            {submitted && (
              <div style={{ padding: "9px 13px", background: "#f0faf3", border: "1px solid #b3e6c4", borderRadius: 8, fontSize: 12.5, color: "#15803d", fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Record submitted successfully!
              </div>
            )}

            <button
              type="submit"
              style={{
                padding: "11px",
                background: quickTab === "expense"
                  ? "linear-gradient(135deg, #b91c1c, #ef4444)"
                  : "linear-gradient(135deg, #1e6b3a, #2d8a4e)",
                color: "#fff", border: "none", borderRadius: 8,
                fontSize: 13.5, fontWeight: 700, fontFamily: "var(--font-sans)", cursor: "pointer",
                boxShadow: quickTab === "expense" ? "0 2px 10px rgba(239,68,68,0.3)" : "0 2px 10px rgba(45,138,78,0.3)",
                transition: "opacity 0.13s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Submit {quickTab === "expense" ? "Expense" : "Revenue"} →
            </button>
          </form>
        </div>

        {/* My records */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* My expenses */}
          <RecordTable
            title="My Expense Records"
            emptyMsg="You have not submitted any expenses yet."
            onViewAll={() => onNavigate("expenses")}
            headers={["Date", "Description", "Amount"]}
            rows={myExpenses.slice(0, 5).map((e) => [e.expense_date, e.description, formatRWF(e.amount)])}
            amountColor="#ef4444"
          />

          {/* My revenues */}
          <RecordTable
            title="My Revenue Records"
            emptyMsg="You have not submitted any revenue records yet."
            onViewAll={() => onNavigate("revenue")}
            headers={["Date", "Source", "Amount"]}
            rows={myRevenues.slice(0, 5).map((r) => [r.revenue_date, r.source, formatRWF(r.amount)])}
            amountColor="#2d8a4e"
          />
        </div>
      </div>
    </div>
  );
}

function RecordTable({ title, emptyMsg, onViewAll, headers, rows, amountColor }: {
  title: string; emptyMsg: string; onViewAll: () => void;
  headers: string[]; rows: string[][]; amountColor: string;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", flex: 1 }}>
      <div style={{ padding: "13px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1e293b" }}>{title}</span>
        <button onClick={onViewAll} style={{ fontSize: 11.5, color: amountColor, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
          View all →
        </button>
      </div>
      {rows.length === 0 ? (
        <div style={{ padding: "28px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>{emptyMsg}</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {headers.map((h) => (
                <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      padding: "10px 16px",
                      fontFamily: j === 0 || j === 2 ? "var(--font-mono)" : "inherit",
                      color: j === 2 ? amountColor : j === 0 ? "#64748b" : "#1e293b",
                      fontWeight: j === 2 ? 700 : 400,
                      maxWidth: j === 1 ? 200 : undefined,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.07em", display: "block", marginBottom: 5 }}>{label.toUpperCase()}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
  fontSize: 13, fontFamily: "var(--font-sans)", color: "#1e293b",
  background: "#f8fafc", outline: "none", width: "100%", boxSizing: "border-box",
};
