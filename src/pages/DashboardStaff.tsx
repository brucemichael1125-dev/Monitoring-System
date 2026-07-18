import { useState } from "react";
import { EXPENSES, REVENUES, CATEGORIES, formatRWF } from "../data/mockData";
import type { User } from "../data/mockData";

interface Props { user: User; onNavigate: (page: string) => void; }

export default function DashboardStaff({ user, onNavigate }: Props) {
  // Staff sees ONLY their own records
  const myExpenses = EXPENSES.filter((e) => e.created_by === user.full_name);
  const myRevenues = REVENUES.filter((r) => r.created_by === user.full_name);

  // This month (simulated as the latest month with data)
  const latestMonth = 6; // June 2025
  const thisMonthExpenses = myExpenses.filter((e) => new Date(e.expense_date).getMonth() + 1 === latestMonth);
  const thisMonthRevenues = myRevenues.filter((r) => new Date(r.revenue_date).getMonth() + 1 === latestMonth);

  const myTotalExpenses = myExpenses.reduce((s, e) => s + e.amount, 0);
  const myTotalRevenues = myRevenues.reduce((s, r) => s + r.amount, 0);

  // Quick-add form state
  const [quickTab, setQuickTab] = useState<"expense" | "revenue">("expense");
  const [quickForm, setQuickForm] = useState({ category_id: 1, source: "", amount: "", description: "", date: new Date().toISOString().slice(0, 10) });
  const [submitted, setSubmitted] = useState(false);

  function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    setQuickForm({ category_id: 1, source: "", amount: "", description: "", date: new Date().toISOString().slice(0, 10) });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#15803d" }} />
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "#15803d", fontWeight: 700, letterSpacing: "0.1em" }}>STAFF PORTAL</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>
          My Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
          Welcome, {user.full_name} · {new Date().toLocaleDateString("en-RW", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Staff can only see their own summary */}
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 18px", display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 16 }}>ℹ️</span>
        <span style={{ fontSize: 13, color: "#92400e" }}>
          You can see only records you submitted. Contact your manager for full financial reports.
        </span>
      </div>

      {/* My stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: "My Expenses (All)",   value: formatRWF(myTotalExpenses),           sub: `${myExpenses.length} records`,   color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
          { label: "My Revenue (All)",    value: formatRWF(myTotalRevenues),            sub: `${myRevenues.length} records`,   color: "#2d8a4e", bg: "#f0faf3", border: "#b3e6c4" },
          { label: "This Month Expenses", value: formatRWF(thisMonthExpenses.reduce((s, e) => s + e.amount, 0)), sub: `${thisMonthExpenses.length} records`, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
          { label: "This Month Revenue",  value: formatRWF(thisMonthRevenues.reduce((s, r) => s + r.amount, 0)), sub: `${thisMonthRevenues.length} records`, color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
        ].map((card) => (
          <div key={card.label} style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: 12, padding: "18px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", marginBottom: 8 }}>{card.label.toUpperCase()}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: card.color, fontFamily: "var(--font-mono)", marginBottom: 4 }}>{card.value}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Main area: Quick-add form + my records */}
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 20 }}>

        {/* Quick Add Card */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ background: "#0e3a1d", padding: "18px 22px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Quick Add Record</div>
            <div style={{ fontSize: 12, color: "#4ead6b", marginTop: 2 }}>Log your daily field data</div>
          </div>

          {/* Tab toggle */}
          <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0" }}>
            {(["expense", "revenue"] as const).map((tab) => (
              <button key={tab} onClick={() => setQuickTab(tab)} style={{
                flex: 1, padding: "11px", border: "none", background: quickTab === tab ? "#f0faf3" : "#fff",
                color: quickTab === tab ? "#0e3a1d" : "#94a3b8",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "var(--font-sans)",
                borderBottom: quickTab === tab ? "2px solid #2d8a4e" : "2px solid transparent",
                textTransform: "capitalize",
              }}>
                {tab === "expense" ? "📉 Expense" : "📈 Revenue"}
              </button>
            ))}
          </div>

          <form onSubmit={handleQuickAdd} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {quickTab === "expense" ? (
              <div>
                <label style={labelStyle}>CATEGORY</label>
                <select value={quickForm.category_id} onChange={(e) => setQuickForm({ ...quickForm, category_id: Number(e.target.value) })} style={inputStyle}>
                  {CATEGORIES.map((c) => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label style={labelStyle}>REVENUE SOURCE</label>
                <input value={quickForm.source} onChange={(e) => setQuickForm({ ...quickForm, source: e.target.value })} placeholder="e.g. Maize Sales — Kigali" style={inputStyle} />
              </div>
            )}
            <div>
              <label style={labelStyle}>DESCRIPTION</label>
              <input value={quickForm.description} onChange={(e) => setQuickForm({ ...quickForm, description: e.target.value })} placeholder="Brief description…" style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>AMOUNT (RWF)</label>
              <input type="number" value={quickForm.amount} onChange={(e) => setQuickForm({ ...quickForm, amount: e.target.value })} placeholder="e.g. 150000" style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>DATE</label>
              <input type="date" value={quickForm.date} onChange={(e) => setQuickForm({ ...quickForm, date: e.target.value })} style={inputStyle} />
            </div>

            {submitted && (
              <div style={{ padding: "8px 12px", background: "#f0faf3", border: "1px solid #b3e6c4", borderRadius: 8, fontSize: 13, color: "#2d8a4e", fontWeight: 600 }}>
                ✓ Record submitted successfully!
              </div>
            )}

            <button type="submit" style={{ padding: "12px", background: quickTab === "expense" ? "#ef4444" : "#2d8a4e", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: "var(--font-sans)", cursor: "pointer" }}>
              Submit {quickTab === "expense" ? "Expense" : "Revenue"}
            </button>
          </form>
        </div>

        {/* My records */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* My recent expenses */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", flex: 1 }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>My Expense Records</span>
              <button onClick={() => onNavigate("expenses")} style={{ fontSize: 11, color: "#2d8a4e", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                View all →
              </button>
            </div>
            {myExpenses.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>You have not submitted any expenses yet.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    {["Date", "Description", "Amount"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myExpenses.slice(0, 6).map((e) => (
                    <tr key={e.expense_id} style={{ borderBottom: "1px solid #f1f5f9" }}
                      onMouseEnter={(ev) => (ev.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", color: "#64748b" }}>{e.expense_date}</td>
                      <td style={{ padding: "10px 16px", color: "#1e293b", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.description}</td>
                      <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#ef4444" }}>{formatRWF(e.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* My recent revenues */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", flex: 1 }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>My Revenue Records</span>
              <button onClick={() => onNavigate("revenue")} style={{ fontSize: 11, color: "#2d8a4e", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                View all →
              </button>
            </div>
            {myRevenues.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>You have not submitted any revenue records yet.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    {["Date", "Source", "Amount"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myRevenues.slice(0, 6).map((r) => (
                    <tr key={r.revenue_id} style={{ borderBottom: "1px solid #f1f5f9" }}
                      onMouseEnter={(ev) => (ev.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", color: "#64748b" }}>{r.revenue_date}</td>
                      <td style={{ padding: "10px 16px", color: "#1e293b", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.source}</td>
                      <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#2d8a4e" }}>{formatRWF(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "#475569",
  letterSpacing: "0.06em", display: "block", marginBottom: 5,
};

const inputStyle: React.CSSProperties = {
  padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
  fontSize: 13, fontFamily: "var(--font-sans)", color: "#1e293b",
  background: "#f8fafc", outline: "none", width: "100%", boxSizing: "border-box",
};
