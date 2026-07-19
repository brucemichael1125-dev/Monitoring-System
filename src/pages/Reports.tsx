import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, Cell,
} from "recharts";
import { useAppData } from "../data/AppDataContext";
import { MONTHS, formatRWF } from "../data/mockData";

function ChartTip({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", color: "#fff", borderRadius: 10, padding: "10px 14px", fontSize: 12, lineHeight: 1.8, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: "#e2e8f0" }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span>{p.name}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{formatRWF(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function Reports() {
  const { expenses, revenues, budgets, categories } = useAppData();
  const dataYear      = expenses.length > 0
    ? Math.max(...expenses.map((e) => Number(e.expense_date.split("-")[0])))
    : new Date().getFullYear();
  const totalRevenue  = revenues.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const profit        = totalRevenue - totalExpenses;
  const margin        = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : "0";

  const monthlySummary = [1, 2, 3, 4, 5, 6].map((m) => {
    const revenue  = revenues.filter((r) => { const [, rm] = r.revenue_date.split("-").map(Number); return rm === m; }).reduce((s, r) => s + r.amount, 0);
    const expTotal = expenses.filter((e) => { const [, em] = e.expense_date.split("-").map(Number); return em === m; }).reduce((s, e) => s + e.amount, 0);
    const budget   = budgets.filter((b) => b.month === m && b.year === dataYear).reduce((s, b) => s + b.budget_amount, 0);
    return { month: MONTHS[m - 1], revenue, expenses: expTotal, profit: revenue - expTotal, budget };
  });

  const catBreakdown = categories.map((cat) => ({
    name:     cat.category_name.split(" ").slice(0, 2).join(" "),
    budgeted: budgets.filter((b) => b.category_id === cat.category_id).reduce((s, b) => s + b.budget_amount, 0),
    actual:   expenses.filter((e) => e.category_id === cat.category_id).reduce((s, e) => s + e.amount, 0),
    color:    cat.color,
  })).filter((c) => c.actual > 0 || c.budgeted > 0);

  const expByCat = categories.map((cat) => ({
    id:    cat.category_id,
    name:  cat.category_name,
    color: cat.color,
    total: expenses.filter((e) => e.category_id === cat.category_id).reduce((s, e) => s + e.amount, 0),
    count: expenses.filter((e) => e.category_id === cat.category_id).length,
  })).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  const kpis = [
    { label: "Total Revenue",  value: formatRWF(totalRevenue),  sub: `${revenues.length} transactions`,  bg: "#f0faf3", color: "#2d8a4e", border: "#b3e6c4" },
    { label: "Total Expenses", value: formatRWF(totalExpenses), sub: `${expenses.length} transactions`,  bg: "#fef2f2", color: "#ef4444", border: "#fecaca" },
    { label: "Net Profit",     value: formatRWF(profit),        sub: profit > 0 ? "Profitable" : "Loss", bg: profit > 0 ? "#fffbeb" : "#fef2f2", color: profit > 0 ? "#d97706" : "#ef4444", border: profit > 0 ? "#fde68a" : "#fecaca" },
    { label: "Profit Margin",  value: `${margin}%`,             sub: "Based on total revenue",            bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Header */}
      <div className="page-hdr">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>Reports</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Financial summary · Jan–Jun {dataYear}</p>
        </div>
        <button
          onClick={() => window.print()}
          style={{
            padding: "9px 18px", background: "#fff", color: "#475569",
            border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font-sans)",
            display: "flex", alignItems: "center", gap: 7,
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print / Export
        </button>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gap: 14 }} className="rg-4">
        {kpis.map((k) => (
          <div key={k.label} style={{ background: k.bg, border: `1px solid ${k.border}`, borderTop: `3px solid ${k.color}`, borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em", marginBottom: 8 }}>{k.label.toUpperCase()}</div>
            <div style={{ fontSize: 21, fontWeight: 800, color: k.color, fontFamily: "var(--font-mono)", letterSpacing: "-0.02em", marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Monthly summary table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "15px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Monthly Summary — {dataYear}</span>
          <span style={{ padding: "2px 8px", borderRadius: 12, background: "#f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 600 }}>Jan–Jun</span>
        </div>
        <div className="tbl-scroll">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Month", "Revenue (RWF)", "Expenses (RWF)", "Profit/Loss", "Budget (RWF)", "Variance"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlySummary.map((row) => {
              const variance = row.budget - row.expenses;
              return (
                <tr
                  key={row.month}
                  style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "11px 16px", fontWeight: 700, color: "#0e3a1d" }}>{row.month}</td>
                  <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", color: "#2d8a4e", fontWeight: 600 }}>{row.revenue > 0 ? formatRWF(row.revenue) : "—"}</td>
                  <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", color: "#ef4444" }}>{row.expenses > 0 ? formatRWF(row.expenses) : "—"}</td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: row.profit >= 0 ? "#2d8a4e" : "#ef4444" }}>
                      {row.profit !== 0 ? (row.profit > 0 ? "+" : "") + formatRWF(row.profit) : "—"}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", color: "#3b82f6" }}>{row.budget > 0 ? formatRWF(row.budget) : "—"}</td>
                  <td style={{ padding: "11px 16px" }}>
                    {row.budget > 0 ? (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, fontWeight: 700, color: variance >= 0 ? "#2d8a4e" : "#ef4444" }}>
                        {variance > 0 ? "+" : ""}{formatRWF(variance)}
                      </span>
                    ) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: "linear-gradient(135deg, #09261A, #0e3a1d)" }}>
              <td style={{ padding: "12px 16px", fontWeight: 800, color: "#fff", fontSize: 12, letterSpacing: "0.05em" }}>TOTAL</td>
              <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "#4ead6b" }}>{formatRWF(totalRevenue)}</td>
              <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "#fca5a5" }}>{formatRWF(totalExpenses)}</td>
              <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 800, color: profit >= 0 ? "#4ead6b" : "#fca5a5" }}>
                {profit > 0 ? "+" : ""}{formatRWF(profit)}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gap: 16 }} className="rg-2">

        {/* Revenue vs Expenses */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>Monthly Revenue vs Expenses</div>
          <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 16 }}>Jan – Jun {dataYear}</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlySummary} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
              <Tooltip content={<ChartTip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue" name="Revenue" fill="#2d8a4e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit trend */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>Profit Trend</div>
          <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 16 }}>Monthly net profit / loss</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlySummary} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="profit" name="Profit/Loss" stroke="#d97706" strokeWidth={2.5} dot={{ r: 4, fill: "#d97706", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense breakdown by category */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "15px 20px", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Expense Breakdown by Category</div>
        </div>
        <div className="tbl-scroll">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Category", "Records", "Total Amount (RWF)", "% of Total", "Visual"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expByCat.map((cat) => {
              const pct = totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0;
              return (
                <tr
                  key={cat.id}
                  style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>{cat.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", color: "#64748b" }}>{cat.count}</td>
                  <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#ef4444" }}>{formatRWF(cat.total)}</td>
                  <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", color: "#64748b", fontWeight: 600 }}>{pct.toFixed(1)}%</td>
                  <td style={{ padding: "11px 16px", minWidth: 180 }}>
                    <div style={{ height: 7, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: cat.color, borderRadius: 4 }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {/* Budget vs Actual chart */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>Budget vs Actual — by Category</div>
        <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 16 }}>All budgeted categories · {dataYear}</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={catBreakdown} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
            <Tooltip content={<ChartTip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="budgeted" name="Budgeted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]}>
              {catBreakdown.map((entry, i) => (
                <Cell key={i} fill={entry.actual > entry.budgeted && entry.budgeted > 0 ? "#ef4444" : "#2d8a4e"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
