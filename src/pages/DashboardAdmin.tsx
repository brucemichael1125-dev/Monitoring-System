import { useState } from "react";
import { USERS, EXPENSES, REVENUES, CATEGORIES, BUDGETS, formatRWF } from "../data/mockData";
import type { User, Role } from "../data/mockData";

interface Props { user: User; onNavigate: (page: string) => void; }

const ROLE_META: Record<Role, { color: string; bg: string; dot: string }> = {
  admin:   { color: "#b45309", bg: "#fef3c7", dot: "#f59e0b" },
  manager: { color: "#1d4ed8", bg: "#eff6ff", dot: "#3b82f6" },
  staff:   { color: "#15803d", bg: "#f0fdf4", dot: "#22c55e" },
};

const activityFeed = [
  ...EXPENSES.map((e) => ({ type: "expense" as const, date: e.expense_date, label: e.description, amount: e.amount, by: e.created_by })),
  ...REVENUES.map((r) => ({ type: "revenue" as const, date: r.revenue_date, label: r.source, amount: r.amount, by: r.created_by })),
].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);

export default function DashboardAdmin({ user, onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "activity">("overview");

  const totalRevenue  = REVENUES.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = EXPENSES.reduce((s, e) => s + e.amount, 0);
  const netProfit     = totalRevenue - totalExpenses;
  const adminCount    = USERS.filter((u) => u.role === "admin").length;
  const managerCount  = USERS.filter((u) => u.role === "manager").length;
  const staffCount    = USERS.filter((u) => u.role === "staff").length;

  const kpiStrip = [
    { label: "Total Users",  value: USERS.length,      color: "#0e3a1d", bg: "#f0faf3", border: "#b3e6c4", icon: "👥" },
    { label: "Admins",       value: adminCount,         color: "#b45309", bg: "#fef3c7", border: "#fde68a", icon: "🔑" },
    { label: "Managers",     value: managerCount,       color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe", icon: "📊" },
    { label: "Staff",        value: staffCount,         color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", icon: "👤" },
    { label: "Categories",   value: CATEGORIES.length,  color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: "🏷️" },
    { label: "Budget Lines", value: BUDGETS.length,     color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd", icon: "📋" },
  ];

  const tabs = [
    { key: "overview" as const, label: "System Overview" },
    { key: "users"    as const, label: "User Directory" },
    { key: "activity" as const, label: "Activity Feed" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2d8a4e" }} />
            <span style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", color: "#2d8a4e", fontWeight: 700, letterSpacing: "0.12em" }}>ADMIN PANEL</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>System Overview</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
            Welcome back, <strong style={{ color: "#334155" }}>{user.full_name.split(" ")[0]}</strong> ·{" "}
            {new Date().toLocaleDateString("en-RW", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <ActionBtn label="Manage Users" onClick={() => onNavigate("users")} variant="secondary" />
          <ActionBtn label="+ Register User" onClick={() => onNavigate("register")} variant="primary" />
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
        {kpiStrip.map((k) => (
          <div key={k.label} style={{
            background: k.bg,
            border: `1px solid ${k.border}`,
            borderTop: `3px solid ${k.color}`,
            borderRadius: 10,
            padding: "14px 14px",
          }}>
            <div style={{ fontSize: 16, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: k.color, fontFamily: "var(--font-mono)", lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: "#64748b", marginTop: 5, letterSpacing: "0.04em" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Financial overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <FinCard label="Total Revenue"  value={formatRWF(totalRevenue)}  sub={`${REVENUES.length} transactions`}  color="#2d8a4e" bg="#f0faf3" border="#b3e6c4" icon={<TrendUpIcon />} />
        <FinCard label="Total Expenses" value={formatRWF(totalExpenses)} sub={`${EXPENSES.length} cost records`}  color="#ef4444" bg="#fef2f2" border="#fecaca" icon={<TrendDownIcon />} />
        <FinCard label="Net Profit"     value={formatRWF(netProfit)}     sub={netProfit > 0 ? "Business profitable" : "Operating at loss"} color={netProfit > 0 ? "#d97706" : "#ef4444"} bg={netProfit > 0 ? "#fffbeb" : "#fef2f2"} border={netProfit > 0 ? "#fde68a" : "#fecaca"} icon={<CoinIcon />} />
      </div>

      {/* Tabs */}
      <div>
        <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e8edf2", marginBottom: 18 }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "9px 20px", border: "none", background: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                fontFamily: "var(--font-sans)",
                color: activeTab === tab.key ? "#0e3a1d" : "#94a3b8",
                borderBottom: activeTab === tab.key ? "2px solid #2d8a4e" : "2px solid transparent",
                marginBottom: -2, transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: System Overview */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            {/* Expense Categories */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "15px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Expense Categories</span>
                <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "var(--font-mono)" }}>{CATEGORIES.length} active</span>
              </div>
              <div style={{ padding: "4px 0" }}>
                {CATEGORIES.map((cat) => {
                  const spend = EXPENSES.filter((e) => e.category_id === cat.category_id).reduce((s, e) => s + e.amount, 0);
                  const count = EXPENSES.filter((e) => e.category_id === cat.category_id).length;
                  const pct   = totalExpenses > 0 ? (spend / totalExpenses) * 100 : 0;
                  return (
                    <div
                      key={cat.category_id}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 20px", transition: "background 0.1s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 12.5, color: "#1e293b" }}>{cat.category_name}</span>
                      <div style={{ width: 60, height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: cat.color, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 10.5, color: "#94a3b8", fontFamily: "var(--font-mono)", width: 20, textAlign: "right" }}>{count}</span>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: spend > 0 ? "#ef4444" : "#cbd5e1", fontFamily: "var(--font-mono)", width: 104, textAlign: "right" }}>
                        {spend > 0 ? formatRWF(spend) : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* System Health */}
              <div style={{ background: "linear-gradient(135deg, #09261A 0%, #0e3a1d 100%)", borderRadius: 12, padding: 22, color: "#fff" }}>
                <div style={{ fontSize: 11, color: "#4ead6b", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 16 }}>SYSTEM HEALTH</div>
                {[
                  { label: "Expenses recorded", value: EXPENSES.length, max: 50 },
                  { label: "Revenues recorded",  value: REVENUES.length, max: 50 },
                  { label: "Budgets set",         value: BUDGETS.length,  max: 40 },
                  { label: "Active users",        value: USERS.length,    max: 20 },
                ].map((stat) => (
                  <div key={stat.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{stat.label}</span>
                      <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "#4ead6b" }}>{stat.value}</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${Math.min(100, (stat.value / stat.max) * 100)}%`, background: "linear-gradient(90deg, #2d8a4e, #4ead6b)", borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Quick Actions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[
                    { label: "Register new user",  page: "register", color: "#2d8a4e" },
                    { label: "View all expenses",  page: "expenses", color: "#3b82f6" },
                    { label: "Generate reports",   page: "reports",  color: "#7c3aed" },
                    { label: "Manage budgets",     page: "budgets",  color: "#f59e0b" },
                  ].map((a) => (
                    <button
                      key={a.label}
                      onClick={() => onNavigate(a.page)}
                      style={{
                        padding: "9px 14px", background: a.color + "0d",
                        border: `1px solid ${a.color}28`, borderRadius: 8,
                        color: a.color, fontSize: 12.5, fontWeight: 600,
                        fontFamily: "var(--font-sans)", cursor: "pointer",
                        textAlign: "left", transition: "background 0.13s",
                        display: "flex", alignItems: "center", gap: 8,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = a.color + "18")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = a.color + "0d")}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: User Directory */}
        {activeTab === "users" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    {["#", "Full Name", "Username", "Email", "Phone", "Role", "Joined"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {USERS.map((u, i) => {
                    const m = ROLE_META[u.role];
                    const ini = u.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <tr
                        key={u.user_id}
                        style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "12px 16px", color: "#cbd5e1", fontFamily: "var(--font-mono)", fontSize: 11 }}>{i + 1}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: "50%",
                              background: "linear-gradient(135deg, #0e3a1d, #1e6b3a)",
                              color: "#4ead6b", fontSize: 11, fontWeight: 800,
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>{ini}</div>
                            <span style={{ fontWeight: 600, color: "#1e293b" }}>{u.full_name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "#64748b" }}>@{u.username}</td>
                        <td style={{ padding: "12px 16px", color: "#475569", fontSize: 12 }}>{u.email}</td>
                        <td style={{ padding: "12px 16px", color: "#475569", fontSize: 12 }}>{u.phone}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            padding: "3px 10px", borderRadius: 20,
                            background: m.bg, color: m.color,
                            fontSize: 11, fontWeight: 700, textTransform: "capitalize",
                            border: `1px solid ${m.dot}30`,
                          }}>{u.role}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8" }}>{u.created_at}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ textAlign: "right" }}>
              <ActionBtn label="Full User Management →" onClick={() => onNavigate("users")} variant="primary" />
            </div>
          </div>
        )}

        {/* Tab: Activity Feed */}
        {activeTab === "activity" && (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "15px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Recent System Activity</span>
              <span style={{
                padding: "2px 8px", borderRadius: 12,
                background: "#f1f5f9", color: "#64748b",
                fontSize: 11, fontWeight: 600,
              }}>All users · Latest 12</span>
            </div>
            <div>
              {activityFeed.map((act, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 14, padding: "12px 20px", alignItems: "center", borderBottom: "1px solid #f8fafc", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: act.type === "revenue" ? "#f0faf3" : "#fef2f2",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {act.type === "revenue"
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{act.label}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>by {act.by}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, fontFamily: "var(--font-mono)", color: act.type === "revenue" ? "#2d8a4e" : "#ef4444" }}>
                      {act.type === "revenue" ? "+" : "−"}{formatRWF(act.amount)}
                    </div>
                    <div style={{ fontSize: 10.5, color: "#94a3b8", fontFamily: "var(--font-mono)", marginTop: 2 }}>{act.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FinCard({ label, value, sub, color, bg, border, icon }: {
  label: string; value: string; sub: string; color: string; bg: string; border: string; icon: React.ReactNode;
}) {
  return (
    <div style={{ background: bg, borderRadius: 12, padding: "20px 22px", border: `1px solid ${border}`, borderTop: `3px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em" }}>{label.toUpperCase()}</div>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "var(--font-mono)", letterSpacing: "-0.02em", marginBottom: 3 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{sub}</div>
    </div>
  );
}

function ActionBtn({ label, onClick, variant }: { label: string; onClick: () => void; variant: "primary" | "secondary" }) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 18px",
        background: isPrimary ? "#2d8a4e" : "#1e293b",
        color: "#fff", border: "none", borderRadius: 8,
        fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer",
        transition: "opacity 0.13s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {label}
    </button>
  );
}

function TrendUpIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
}
function TrendDownIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>;
}
function CoinIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
}
