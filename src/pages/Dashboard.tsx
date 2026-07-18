import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts";
import { useAppData } from "../data/AppDataContext";
import { formatRWF, getMonthlyData, getCategoryExpenses } from "../data/mockData";
import type { User } from "../data/mockData";

interface Props { user: User; }

function StatCard({ label, value, sub, accent, icon }: {
  label: string; value: string; sub?: string; accent: string; icon: string;
}) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "20px 22px",
      border: "1px solid #e2e8f0",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: "0.05em" }}>
          {label}
        </span>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: accent + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#1e293b", letterSpacing: "-0.02em", fontFamily: "var(--font-mono)" }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "#94a3b8" }}>{sub}</div>
      )}
      <div style={{ height: 3, background: "#f1f5f9", borderRadius: 2 }}>
        <div style={{ height: "100%", background: accent, borderRadius: 2, width: "60%" }} />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0e3a1d", color: "#fff", borderRadius: 8,
      padding: "10px 14px", fontSize: 12, lineHeight: 1.8,
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: {formatRWF(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard({ user }: Props) {
  const { expenses, revenues, budgets, categories } = useAppData();
  const dataYear = expenses.length > 0 ? new Date(expenses[0].expense_date).getFullYear() : new Date().getFullYear();
  const totalRevenue = revenues.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpenses;
  const activeBudgets = budgets.length;

  const monthly = getMonthlyData(revenues, expenses);
  const catExpenses = getCategoryExpenses(expenses, categories).slice(0, 5);

  const recentExpenses = [...expenses].sort((a, b) => b.expense_date.localeCompare(a.expense_date)).slice(0, 5);
  const recentRevenues = [...revenues].sort((a, b) => b.revenue_date.localeCompare(a.revenue_date)).slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>
          Good morning, {user.full_name.split(" ")[0]} · {new Date().toLocaleDateString("en-RW", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="TOTAL REVENUE"   value={formatRWF(totalRevenue)}  sub={`${revenues.length} transactions`}  accent="#2d8a4e" icon="📈" />
        <StatCard label="TOTAL EXPENSES"  value={formatRWF(totalExpenses)} sub={`${expenses.length} transactions`}  accent="#ef4444" icon="📉" />
        <StatCard label="NET PROFIT"      value={formatRWF(profit)}        sub={profit > 0 ? "Profitable period" : "Loss period"}  accent={profit > 0 ? "#f59e0b" : "#ef4444"} icon="💰" />
        <StatCard label="ACTIVE BUDGETS"  value={String(activeBudgets)}   sub={`${categories.length} categories`}  accent="#3b82f6" icon="📊" />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>

        {/* Revenue vs Expenses Area chart */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Revenue vs Expenses</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Jan – Jun {dataYear} (in RWF)</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d8a4e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2d8a4e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke="#2d8a4e" strokeWidth={2} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expenses by category pie */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Expenses by Category</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Top 5 categories</div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={catExpenses} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={36}>
                {catExpenses.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatRWF(v as number)} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {catExpenses.map((c) => (
              <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "#64748b" }}>{c.name}</span>
                </div>
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "#1e293b" }}>
                  {(c.amount / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profit bar chart */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Monthly Profit / Loss</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>Positive = profit · Negative = loss</div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="profit" name="Profit/Loss" radius={[4, 4, 0, 0]}>
              {monthly.map((entry, i) => (
                <Cell key={i} fill={entry.profit >= 0 ? "#2d8a4e" : "#ef4444"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent transactions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Recent expenses */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>Recent Expenses</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentExpenses.map((exp) => (
              <div key={exp.expense_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.description}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{exp.expense_date}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", fontFamily: "var(--font-mono)", flexShrink: 0, marginLeft: 12 }}>
                  -{(exp.amount / 1000).toFixed(0)}K
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent revenue */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 22, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>Recent Revenue</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentRevenues.map((rev) => (
              <div key={rev.revenue_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rev.source}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{rev.revenue_date}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#2d8a4e", fontFamily: "var(--font-mono)", flexShrink: 0, marginLeft: 12 }}>
                  +{(rev.amount / 1000).toFixed(0)}K
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
