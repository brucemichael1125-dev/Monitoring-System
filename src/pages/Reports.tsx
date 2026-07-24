import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, Cell,
} from "recharts";
import { useAppData } from "../data/AppDataContext";
import { formatRWF } from "../data/mockData";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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

  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1); // 1–12
  const [viewYear,  setViewYear]  = useState(now.getFullYear());

  const isCurrentMonth = viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear();

  function prevMonth() {
    if (viewMonth === 1) { setViewMonth(12); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (isCurrentMonth) return;
    if (viewMonth === 12) { setViewMonth(1); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  // ── Data filtered to selected month ──────────────────────────────────
  const monthExpenses = useMemo(() =>
    expenses.filter((e) => {
      const [ey, em] = e.expense_date.split("-").map(Number);
      return em === viewMonth && ey === viewYear;
    }), [expenses, viewMonth, viewYear]);

  const monthRevenues = useMemo(() =>
    revenues.filter((r) => {
      const [ry, rm] = r.revenue_date.split("-").map(Number);
      return rm === viewMonth && ry === viewYear;
    }), [revenues, viewMonth, viewYear]);

  const monthBudgets = useMemo(() =>
    budgets.filter((b) => b.month === viewMonth && b.year === viewYear),
    [budgets, viewMonth, viewYear]);

  const totalRev = useMemo(() => monthRevenues.reduce((s, r) => s + r.amount, 0), [monthRevenues]);
  const totalExp = useMemo(() => monthExpenses.reduce((s, e) => s + e.amount, 0), [monthExpenses]);
  const totalBud = useMemo(() => monthBudgets.reduce((s, b) => s + b.budget_amount, 0), [monthBudgets]);
  const profit   = totalRev - totalExp;
  const margin   = totalRev > 0 ? ((profit / totalRev) * 100).toFixed(1) : "0";
  const hasData  = monthExpenses.length > 0 || monthRevenues.length > 0;

  // ── 6-month trend ending at selected month ───────────────────────────
  const trendData = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => {
      const d  = new Date(viewYear, viewMonth - 1 - (5 - i), 1);
      const m  = d.getMonth() + 1;
      const y  = d.getFullYear();
      const rev = revenues.filter((r) => {
        const [ry, rm] = r.revenue_date.split("-").map(Number);
        return rm === m && ry === y;
      }).reduce((s, r) => s + r.amount, 0);
      const exp = expenses.filter((e) => {
        const [ey, em] = e.expense_date.split("-").map(Number);
        return em === m && ey === y;
      }).reduce((s, e) => s + e.amount, 0);
      return { month: MONTH_SHORT[m - 1], revenue: rev, expenses: exp, profit: rev - exp, isCurrent: m === viewMonth && y === viewYear };
    }), [revenues, expenses, viewMonth, viewYear]);

  // ── Category breakdown for selected month ────────────────────────────
  const catBreakdown = useMemo(() =>
    categories.map((cat) => {
      const catExp = monthExpenses.filter((e) => e.category_id === cat.category_id);
      const catBud = monthBudgets.filter((b) => b.category_id === cat.category_id);
      return {
        name:     cat.category_name.split(" ").slice(0, 2).join(" "),
        fullName: cat.category_name,
        color:    cat.color,
        count:    catExp.length,
        actual:   catExp.reduce((s, e) => s + e.amount, 0),
        budgeted: catBud.reduce((s, b) => s + b.budget_amount, 0),
      };
    }).filter((c) => c.actual > 0 || c.budgeted > 0),
    [categories, monthExpenses, monthBudgets]);

  const kpis = [
    { label: "Revenue",    value: formatRWF(totalRev), sub: `${monthRevenues.length} transaction${monthRevenues.length !== 1 ? "s" : ""}`, bg: "#f0faf3", color: "#2d8a4e", border: "#b3e6c4" },
    { label: "Expenses",   value: formatRWF(totalExp), sub: `${monthExpenses.length} record${monthExpenses.length !== 1 ? "s" : ""}`,      bg: "#fef2f2", color: "#ef4444", border: "#fecaca" },
    { label: "Net Profit", value: formatRWF(profit),   sub: profit > 0 ? "Profitable" : profit < 0 ? "Operating loss" : "Break even",
      bg: profit >= 0 ? "#fffbeb" : "#fef2f2", color: profit >= 0 ? "#d97706" : "#ef4444", border: profit >= 0 ? "#fde68a" : "#fecaca" },
    { label: "Budget",     value: totalBud > 0 ? formatRWF(totalBud) : "—",
      sub: totalBud > 0 ? (totalExp > totalBud ? `Over by ${formatRWF(totalExp - totalBud)}` : `Under by ${formatRWF(totalBud - totalExp)}`) : "No budget set",
      bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" },
    { label: "Profit Margin", value: `${margin}%`, sub: "Of total revenue", bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" },
  ];

  const monthLabel = `${MONTH_NAMES[viewMonth - 1]} ${viewYear}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Header */}
      <div className="page-hdr">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>Reports</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Monthly financial report · {monthLabel}</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {/* Month navigator */}
          <div style={{ display: "flex", alignItems: "center", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <button
              onClick={prevMonth}
              style={{ padding: "8px 14px", border: "none", background: "none", cursor: "pointer", color: "#475569", fontSize: 15, display: "flex", alignItems: "center", transition: "background 0.12s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              title="Previous month"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div style={{ padding: "8px 4px", minWidth: 150, textAlign: "center", borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e293b" }}>{MONTH_NAMES[viewMonth - 1]}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "var(--font-mono)" }}>{viewYear}{isCurrentMonth && <span style={{ marginLeft: 5, padding: "1px 6px", background: "#f0faf3", color: "#15803d", borderRadius: 8, fontSize: 10, fontWeight: 700 }}>NOW</span>}</div>
            </div>
            <button
              onClick={nextMonth}
              disabled={isCurrentMonth}
              style={{ padding: "8px 14px", border: "none", background: "none", cursor: isCurrentMonth ? "default" : "pointer", color: isCurrentMonth ? "#cbd5e1" : "#475569", fontSize: 15, display: "flex", alignItems: "center", transition: "background 0.12s" }}
              onMouseEnter={(e) => { if (!isCurrentMonth) e.currentTarget.style.background = "#f1f5f9"; }}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              title={isCurrentMonth ? "Already at current month" : "Next month"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* Jump to current month */}
          {!isCurrentMonth && (
            <button
              onClick={() => { setViewMonth(now.getMonth() + 1); setViewYear(now.getFullYear()); }}
              style={{ padding: "9px 14px", background: "#f0faf3", color: "#15803d", border: "1px solid #b3e6c4", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}
            >
              Today
            </button>
          )}

          {/* Print */}
          <button
            onClick={() => window.print()}
            style={{ padding: "9px 16px", background: "#fff", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: 7, transition: "background 0.12s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print
          </button>
        </div>
      </div>

      {/* No data notice */}
      {!hasData && (
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "28px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#92400e", marginBottom: 6 }}>No data for {monthLabel}</div>
          <div style={{ fontSize: 13, color: "#b45309" }}>No expenses or revenues were recorded this month. Use the arrows to browse other months.</div>
        </div>
      )}

      {/* KPI row */}
      <div style={{ display: "grid", gap: 12 }} className="rg-5">
        {kpis.map((k) => (
          <div key={k.label} style={{ background: k.bg, border: `1px solid ${k.border}`, borderTop: `3px solid ${k.color}`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em", marginBottom: 8 }}>{k.label.toUpperCase()}</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: k.color, fontFamily: "var(--font-mono)", letterSpacing: "-0.02em", marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* 6-month trend charts */}
      <div style={{ display: "grid", gap: 16 }} className="rg-2">

        {/* Revenue vs Expenses trend */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>Revenue vs Expenses — 6-Month Trend</div>
          <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 16 }}>
            Ending {monthLabel} · <span style={{ color: "#2d8a4e", fontWeight: 600 }}>highlighted = selected month</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={trendData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
              <Tooltip content={<ChartTip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]}>
                {trendData.map((d, i) => <Cell key={i} fill={d.isCurrent ? "#2d8a4e" : "#a7f3d0"} />)}
              </Bar>
              <Bar dataKey="expenses" name="Expenses" radius={[4, 4, 0, 0]}>
                {trendData.map((d, i) => <Cell key={i} fill={d.isCurrent ? "#ef4444" : "#fecaca"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit trend */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>Profit / Loss Trend</div>
          <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 16 }}>6 months ending {monthLabel}</div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={trendData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="profit" name="Profit/Loss" stroke="#d97706" strokeWidth={2.5}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  return <circle key={cx} cx={cx} cy={cy} r={payload.isCurrent ? 6 : 4} fill={payload.isCurrent ? "#d97706" : "#fde68a"} stroke={payload.isCurrent ? "#fff" : "none"} strokeWidth={2} />;
                }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
          {/* Profit summary for selected month */}
          <div style={{ marginTop: 14, padding: "11px 14px", background: profit >= 0 ? "#f0faf3" : "#fef2f2", borderRadius: 9, border: `1px solid ${profit >= 0 ? "#b3e6c4" : "#fecaca"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>{monthLabel} result</span>
            <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "var(--font-mono)", color: profit >= 0 ? "#2d8a4e" : "#ef4444" }}>
              {profit > 0 ? "+" : ""}{formatRWF(profit)}
            </span>
          </div>
        </div>
      </div>

      {/* Expense breakdown by category */}
      {catBreakdown.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ padding: "15px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Expense Breakdown by Category</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{monthLabel}</div>
          </div>
          <div className="tbl-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  {["Category", "Records", "Spent (RWF)", "Budgeted (RWF)", "% of Total", "Bar"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {catBreakdown.map((cat) => {
                  const pct      = totalExp > 0 ? (cat.actual / totalExp) * 100 : 0;
                  const overBud  = cat.budgeted > 0 && cat.actual > cat.budgeted;
                  return (
                    <tr
                      key={cat.name}
                      style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                          <span style={{ fontWeight: 600, color: "#1e293b" }}>{cat.fullName}</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", color: "#64748b" }}>{cat.count}</td>
                      <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", fontWeight: 700, color: overBud ? "#ef4444" : "#1e293b" }}>
                        {cat.actual > 0 ? formatRWF(cat.actual) : "—"}
                        {overBud && <span style={{ marginLeft: 6, fontSize: 10, background: "#fef2f2", color: "#ef4444", padding: "1px 6px", borderRadius: 8, fontFamily: "var(--font-sans)", fontWeight: 700 }}>OVER</span>}
                      </td>
                      <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", color: "#3b82f6" }}>{cat.budgeted > 0 ? formatRWF(cat.budgeted) : "—"}</td>
                      <td style={{ padding: "11px 16px", fontFamily: "var(--font-mono)", color: "#64748b", fontWeight: 600 }}>{pct.toFixed(1)}%</td>
                      <td style={{ padding: "11px 16px", minWidth: 160 }}>
                        <div style={{ height: 7, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: overBud ? "#ef4444" : cat.color, borderRadius: 4 }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {totalExp > 0 && (
                <tfoot>
                  <tr style={{ background: "linear-gradient(135deg, #09261A, #0e3a1d)" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 800, color: "#fff", fontSize: 12, letterSpacing: "0.05em" }}>TOTAL</td>
                    <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", color: "#94a3b8" }}>{monthExpenses.length}</td>
                    <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "#fca5a5" }}>{formatRWF(totalExp)}</td>
                    <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "#93c5fd" }}>{totalBud > 0 ? formatRWF(totalBud) : "—"}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* Budget vs Actual chart */}
      {catBreakdown.some((c) => c.budgeted > 0) && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>Budget vs Actual Spending</div>
          <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 16 }}>{monthLabel} · red bars = over budget</div>
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
      )}

      {/* Recent transactions for selected month */}
      {hasData && (
        <div style={{ display: "grid", gap: 16 }} className="rg-2">
          <TxTable
            title={`Revenue — ${monthLabel}`}
            accent="#2d8a4e"
            items={monthRevenues.sort((a, b) => b.revenue_date.localeCompare(a.revenue_date)).map((r) => ({ date: r.revenue_date, label: r.source, amount: r.amount, type: "revenue" as const }))}
            emptyMsg="No revenue recorded this month"
          />
          <TxTable
            title={`Expenses — ${monthLabel}`}
            accent="#ef4444"
            items={monthExpenses.sort((a, b) => b.expense_date.localeCompare(a.expense_date)).map((e) => ({ date: e.expense_date, label: e.description, amount: e.amount, type: "expense" as const }))}
            emptyMsg="No expenses recorded this month"
          />
        </div>
      )}
    </div>
  );
}

function TxTable({ title, accent, items, emptyMsg }: {
  title: string;
  accent: string;
  items: { date: string; label: string; amount: number; type: "revenue" | "expense" }[];
  emptyMsg: string;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{ padding: "13px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1e293b" }}>{title}</span>
        <span style={{ fontSize: 11.5, color: accent, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
          {items.length} record{items.length !== 1 ? "s" : ""}
        </span>
      </div>
      {items.length === 0 ? (
        <div style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>{emptyMsg}</div>
      ) : (
        <div style={{ maxHeight: 260, overflowY: "auto" }}>
          {items.map((item, i) => (
            <div
              key={`${item.date}-${i}`}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: "1px solid #f8fafc", transition: "background 0.1s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "var(--font-mono)", marginTop: 2 }}>{item.date}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)", color: accent, marginLeft: 12, flexShrink: 0 }}>
                {item.type === "revenue" ? "+" : "−"}{formatRWF(item.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
