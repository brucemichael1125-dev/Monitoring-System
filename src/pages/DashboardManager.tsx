import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import { EXPENSES, REVENUES, BUDGETS, CATEGORIES, formatRWF, getMonthlyData } from "../data/mockData";
import type { User } from "../data/mockData";

interface Props { user: User; onNavigate: (page: string) => void; }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", color: "#fff", borderRadius: 8, padding: "10px 14px", fontSize: 12, lineHeight: 1.8 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {formatRWF(p.value)}</div>
      ))}
    </div>
  );
};

export default function DashboardManager({ user, onNavigate }: Props) {
  const totalRevenue  = REVENUES.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = EXPENSES.reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpenses;
  const margin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : "0";

  const monthly = getMonthlyData();

  // Budget overview: budgeted vs actual per category (Jan–Jun combined)
  const budgetComparison = CATEGORIES.map((cat) => {
    const budgeted = BUDGETS.filter((b) => b.category_id === cat.category_id).reduce((s, b) => s + b.budget_amount, 0);
    const actual   = EXPENSES.filter((e) => e.category_id === cat.category_id).reduce((s, e) => s + e.amount, 0);
    return { name: cat.category_name.split(" ")[0], budgeted, actual, over: actual > budgeted && budgeted > 0 };
  }).filter((c) => c.budgeted > 0 || c.actual > 0);

  // Over-budget categories
  const overBudget = budgetComparison.filter((c) => c.over);

  // P&L summary
  const profitByMonth = monthly.map((m) => ({ ...m, color: m.profit >= 0 ? "#2d8a4e" : "#ef4444" }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} />
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "#3b82f6", fontWeight: 700, letterSpacing: "0.1em" }}>MANAGER PANEL</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>
            Financial Overview
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
            {user.full_name} · {new Date().toLocaleDateString("en-RW", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onNavigate("reports")}  style={actionBtn("#1e293b")}>View Reports</button>
          <button onClick={() => onNavigate("budgets")}  style={actionBtn("#3b82f6")}>Manage Budgets</button>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <KpiCard label="Total Revenue"  value={formatRWF(totalRevenue)}  sub={`${REVENUES.length} transactions`}         accent="#2d8a4e" bg="#f0faf3" border="#b3e6c4" icon="📈" />
        <KpiCard label="Total Expenses" value={formatRWF(totalExpenses)} sub={`${EXPENSES.length} cost records`}         accent="#ef4444" bg="#fef2f2" border="#fecaca" icon="📉" />
        <KpiCard label="Net Profit"     value={formatRWF(profit)}        sub={profit > 0 ? "Profitable" : "Operating loss"} accent={profit > 0 ? "#f59e0b" : "#ef4444"} bg={profit > 0 ? "#fffbeb" : "#fef2f2"} border={profit > 0 ? "#fde68a" : "#fecaca"} icon="💰" />
        <KpiCard label="Profit Margin"  value={`${margin}%`}             sub="Based on total revenue"                    accent="#7c3aed" bg="#f5f3ff" border="#ddd6fe" icon="📊" />
      </div>

      {/* Alert: over-budget categories */}
      {overBudget.length > 0 && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "14px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#b91c1c", marginBottom: 4 }}>
              {overBudget.length} categor{overBudget.length === 1 ? "y" : "ies"} over budget
            </div>
            <div style={{ fontSize: 13, color: "#ef4444" }}>
              {overBudget.map((c) => c.name).join(", ")} — review spending or revise budget allocations.
            </div>
          </div>
          <button onClick={() => onNavigate("budgets")} style={{ marginLeft: "auto", padding: "7px 14px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
            Review Budgets
          </button>
        </div>
      )}

      {/* Revenue vs Expenses chart */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Monthly Revenue vs Expenses</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Jan – Jun 2025 · GreenHarvest Agribusiness Ltd</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="mgrRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2d8a4e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2d8a4e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mgrExpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => (v / 1000000).toFixed(1) + "M"} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke="#2d8a4e" strokeWidth={2} fill="url(#mgrRevGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#mgrExpGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* P&L by month */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Monthly P&L</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Profit / Loss per month</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {profitByMonth.map((m) => (
              <div key={m.month} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "#64748b", width: 28, flexShrink: 0 }}>{m.month}</span>
                <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3 }}>
                  {m.profit !== 0 && (
                    <div style={{
                      height: "100%",
                      width: `${Math.min(100, Math.abs(m.profit) / 800000 * 100)}%`,
                      background: m.color, borderRadius: 3,
                    }} />
                  )}
                </div>
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: m.color, width: 80, textAlign: "right", flexShrink: 0 }}>
                  {m.profit > 0 ? "+" : ""}{(m.profit / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: "12px 14px", background: profit > 0 ? "#f0faf3" : "#fef2f2", borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>6-Month Total</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: profit > 0 ? "#2d8a4e" : "#ef4444", fontFamily: "var(--font-mono)" }}>
              {profit > 0 ? "+" : ""}{formatRWF(profit)}
            </div>
          </div>
        </div>
      </div>

      {/* Budget vs Actual bar chart */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Budget vs Actual Spending</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Cumulative Jan–Jun 2025 by category</div>
          </div>
          <button onClick={() => onNavigate("budgets")} style={{ fontSize: 12, padding: "6px 12px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer", color: "#475569", fontFamily: "var(--font-sans)" }}>
            Full Budget View →
          </button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={budgetComparison} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => (v / 1000000).toFixed(1) + "M"} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="budgeted" name="Budgeted" fill="#3b82f6"  radius={[3, 3, 0, 0]} />
            <Bar dataKey="actual"   name="Actual"   radius={[3, 3, 0, 0]}>
              {budgetComparison.map((entry, i) => (
                <Cell key={i} fill={entry.over ? "#ef4444" : "#2d8a4e"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent expenses + revenue side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <RecentTable
          title="Recent Expenses"
          items={[...EXPENSES].sort((a, b) => b.expense_date.localeCompare(a.expense_date)).slice(0, 6).map((e) => ({ label: e.description, sub: e.expense_date, amount: e.amount, type: "expense" as const }))}
          onViewAll={() => onNavigate("expenses")}
        />
        <RecentTable
          title="Recent Revenue"
          items={[...REVENUES].sort((a, b) => b.revenue_date.localeCompare(a.revenue_date)).slice(0, 6).map((r) => ({ label: r.source, sub: r.revenue_date, amount: r.amount, type: "revenue" as const }))}
          onViewAll={() => onNavigate("revenue")}
        />
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, accent, bg, border, icon }: { label: string; value: string; sub: string; accent: string; bg: string; border: string; icon: string }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em" }}>{label.toUpperCase()}</span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: accent, fontFamily: "var(--font-mono)", letterSpacing: "-0.02em", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>{sub}</div>
    </div>
  );
}

function RecentTable({ title, items, onViewAll }: {
  title: string;
  items: { label: string; sub: string; amount: number; type: "expense" | "revenue" }[];
  onViewAll: () => void;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{title}</span>
        <button onClick={onViewAll} style={{ fontSize: 11, color: "#2d8a4e", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
          View all →
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: "1px solid #f8fafc" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "var(--font-mono)" }}>{item.sub}</div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono)", color: item.type === "revenue" ? "#2d8a4e" : "#ef4444", marginLeft: 12, flexShrink: 0 }}>
            {item.type === "revenue" ? "+" : "-"}{formatRWF(item.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}

function actionBtn(bg: string): React.CSSProperties {
  return { padding: "9px 18px", background: bg, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer" };
}
