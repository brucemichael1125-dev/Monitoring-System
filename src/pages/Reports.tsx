import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line,
} from "recharts";
import { EXPENSES, REVENUES, BUDGETS, CATEGORIES, MONTHS, formatRWF } from "../data/mockData";

export default function Reports() {
  const totalRevenue = REVENUES.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = EXPENSES.reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpenses;

  // Monthly summary
  const monthlySummary = [1, 2, 3, 4, 5, 6].map((m) => {
    const revenue = REVENUES.filter((r) => new Date(r.revenue_date).getMonth() + 1 === m).reduce((s, r) => s + r.amount, 0);
    const expenses = EXPENSES.filter((e) => new Date(e.expense_date).getMonth() + 1 === m).reduce((s, e) => s + e.amount, 0);
    const budget = BUDGETS.filter((b) => b.month === m && b.year === 2025).reduce((s, b) => s + b.budget_amount, 0);
    return { month: MONTHS[m - 1], revenue, expenses, profit: revenue - expenses, budget };
  });

  // Category breakdown
  const catBreakdown = CATEGORIES.map((cat) => ({
    name: cat.category_name.split(" ").slice(0, 2).join(" "),
    budgeted: BUDGETS.filter((b) => b.category_id === cat.category_id).reduce((s, b) => s + b.budget_amount, 0),
    actual: EXPENSES.filter((e) => e.category_id === cat.category_id).reduce((s, e) => s + e.amount, 0),
    color: cat.color,
  })).filter((c) => c.actual > 0 || c.budgeted > 0);

  // Expense by category totals for the table
  const expByCat = CATEGORIES.map((cat) => ({
    id: cat.category_id,
    name: cat.category_name,
    color: cat.color,
    total: EXPENSES.filter((e) => e.category_id === cat.category_id).reduce((s, e) => s + e.amount, 0),
    count: EXPENSES.filter((e) => e.category_id === cat.category_id).length,
  })).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  function printReport() {
    window.print();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>Reports</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Financial summary · GreenHarvest Agribusiness Ltd · Jan–Jun 2025</p>
        </div>
        <button onClick={printReport} style={{ padding: "9px 18px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          🖨 Print / Export
        </button>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[
          { label: "Total Revenue",  value: formatRWF(totalRevenue),  sub: `${REVENUES.length} transactions`,  bg: "#f0faf3", color: "#2d8a4e", border: "#b3e6c4" },
          { label: "Total Expenses", value: formatRWF(totalExpenses), sub: `${EXPENSES.length} transactions`,  bg: "#fef2f2", color: "#ef4444", border: "#fecaca" },
          { label: "Net Profit",     value: formatRWF(profit),        sub: profit > 0 ? "Profitable" : "Loss", bg: profit > 0 ? "#fffbeb" : "#fef2f2", color: profit > 0 ? "#f59e0b" : "#ef4444", border: profit > 0 ? "#fde68a" : "#fecaca" },
          { label: "Profit Margin",  value: totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) + "%" : "N/A", sub: "Revenue basis", bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: kpi.bg, border: `1px solid ${kpi.border}`, borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em" }}>{kpi.label.toUpperCase()}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: kpi.color, fontFamily: "var(--font-mono)", margin: "8px 0 4px", letterSpacing: "-0.02em" }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Monthly summary table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Monthly Summary — 2025</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Month", "Revenue (RWF)", "Expenses (RWF)", "Profit/Loss (RWF)", "Budget (RWF)", "Budget Variance"].map((h) => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlySummary.map((row) => {
              const variance = row.budget - row.expenses;
              return (
                <tr key={row.month} style={{ borderBottom: "1px solid #f1f5f9" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "11px 16px", fontWeight: 700, color: "#0e3a1d" }}>{row.month}</td>
                  <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", color: "#2d8a4e" }}>{row.revenue > 0 ? formatRWF(row.revenue) : "—"}</td>
                  <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", color: "#ef4444" }}>{row.expenses > 0 ? formatRWF(row.expenses) : "—"}</td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: row.profit >= 0 ? "#2d8a4e" : "#ef4444" }}>
                      {row.profit !== 0 ? (row.profit > 0 ? "+" : "") + formatRWF(row.profit) : "—"}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", color: "#3b82f6" }}>{row.budget > 0 ? formatRWF(row.budget) : "—"}</td>
                  <td style={{ padding: "11px 16px" }}>
                    {row.budget > 0 ? (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: variance >= 0 ? "#2d8a4e" : "#ef4444" }}>
                        {variance > 0 ? "+" : ""}{formatRWF(variance)}
                      </span>
                    ) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: "#0e3a1d" }}>
              <td style={{ padding: "13px 16px", fontWeight: 800, color: "#fff", fontSize: 12 }}>TOTAL</td>
              <td style={{ padding: "13px 16px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "#4ead6b" }}>{formatRWF(totalRevenue)}</td>
              <td style={{ padding: "13px 16px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "#fca5a5" }}>{formatRWF(totalExpenses)}</td>
              <td style={{ padding: "13px 16px", fontFamily: "var(--font-mono)", fontWeight: 800, color: profit >= 0 ? "#4ead6b" : "#fca5a5" }}>
                {profit > 0 ? "+" : ""}{formatRWF(profit)}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Revenue vs Expenses bar chart */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>Monthly Revenue vs Expenses</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>Jan – Jun 2025</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlySummary} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
              <Tooltip formatter={(v) => formatRWF(v as number)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue" name="Revenue" fill="#2d8a4e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit trend line */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>Profit Trend</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>Monthly net profit/loss</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlySummary} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
              <Tooltip formatter={(v) => formatRWF(v as number)} />
              <Line type="monotone" dataKey="profit" name="Profit/Loss" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: "#f59e0b" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense breakdown by category */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Expense Breakdown by Category</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Category", "No. of Records", "Total Amount (RWF)", "% of Total", "Bar"].map((h) => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expByCat.map((cat) => {
              const pct = totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0;
              return (
                <tr key={cat.id} style={{ borderBottom: "1px solid #f1f5f9" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: cat.color }} />
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>{cat.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", color: "#64748b" }}>{cat.count}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#ef4444" }}>{formatRWF(cat.total)}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", color: "#64748b" }}>{pct.toFixed(1)}%</td>
                  <td style={{ padding: "12px 16px", minWidth: 160 }}>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: cat.color, borderRadius: 3 }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Budget vs Actual comparison */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>Budget vs Actual — by Category</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>All budgeted categories (2025)</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={catBreakdown} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
            <Tooltip formatter={(v) => formatRWF(v as number)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="budgeted" name="Budgeted" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="actual"   name="Actual"   fill="#ef4444" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
