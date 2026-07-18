import { useState } from "react";
import { USERS, EXPENSES, REVENUES, CATEGORIES, BUDGETS, formatRWF } from "../data/mockData";
import type { User, Role } from "../data/mockData";

interface Props { user: User; onNavigate: (page: string) => void; }

const ROLE_META: Record<Role, { color: string; bg: string; label: string }> = {
  admin:   { color: "#b45309", bg: "#fef3c7", label: "Admin" },
  manager: { color: "#1d4ed8", bg: "#eff6ff", label: "Manager" },
  staff:   { color: "#15803d", bg: "#f0fdf4", label: "Staff" },
};

// Recent activity feed (merged expenses + revenues sorted by date)
const activityFeed = [
  ...EXPENSES.map((e) => ({ type: "expense" as const, date: e.expense_date, label: e.description, amount: e.amount, by: e.created_by })),
  ...REVENUES.map((r) => ({ type: "revenue" as const, date: r.revenue_date, label: r.source, amount: r.amount, by: r.created_by })),
].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);

export default function DashboardAdmin({ user, onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "activity">("overview");

  const totalRevenue  = REVENUES.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = EXPENSES.reduce((s, e) => s + e.amount, 0);
  const adminCount    = USERS.filter((u) => u.role === "admin").length;
  const managerCount  = USERS.filter((u) => u.role === "manager").length;
  const staffCount    = USERS.filter((u) => u.role === "staff").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2d8a4e" }} />
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "#2d8a4e", fontWeight: 700, letterSpacing: "0.1em" }}>ADMIN PANEL</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0e3a1d", margin: 0, letterSpacing: "-0.02em" }}>
            System Overview
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
            Welcome back, {user.full_name.split(" ")[0]} · {new Date().toLocaleDateString("en-RW", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onNavigate("users")} style={actionBtn("#0e3a1d")}>Manage Users</button>
          <button onClick={() => onNavigate("register")} style={actionBtn("#2d8a4e")}>+ Register User</button>
        </div>
      </div>

      {/* Top KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
        {[
          { label: "Total Users",     value: String(USERS.length),     color: "#0e3a1d", bg: "#f0faf3", border: "#b3e6c4" },
          { label: "Admins",          value: String(adminCount),        color: "#b45309", bg: "#fef3c7", border: "#fde68a" },
          { label: "Managers",        value: String(managerCount),      color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
          { label: "Staff",           value: String(staffCount),        color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
          { label: "Categories",      value: String(CATEGORIES.length), color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
          { label: "Budget Lines",    value: String(BUDGETS.length),    color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
        ].map((k) => (
          <div key={k.label} style={{ background: k.bg, border: `1px solid ${k.border}`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 6 }}>{k.label.toUpperCase()}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.color, fontFamily: "var(--font-mono)" }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Financial overview cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <FinCard label="Total Revenue"  value={formatRWF(totalRevenue)}          sub={`${REVENUES.length} transactions`}  color="#2d8a4e" icon="📈" />
        <FinCard label="Total Expenses" value={formatRWF(totalExpenses)}         sub={`${EXPENSES.length} transactions`}  color="#ef4444" icon="📉" />
        <FinCard label="Net Profit"     value={formatRWF(totalRevenue - totalExpenses)} sub={totalRevenue > totalExpenses ? "Business profitable" : "Operating at loss"} color={totalRevenue > totalExpenses ? "#f59e0b" : "#ef4444"} icon="💰" />
      </div>

      {/* Tabs */}
      <div>
        <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e2e8f0", marginBottom: 20 }}>
          {[
            { key: "overview" as const, label: "System Overview" },
            { key: "users"    as const, label: "User Directory" },
            { key: "activity" as const, label: "Activity Feed" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "10px 20px", border: "none", background: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                fontFamily: "var(--font-sans)",
                color: activeTab === tab.key ? "#0e3a1d" : "#94a3b8",
                borderBottom: activeTab === tab.key ? "2px solid #0e3a1d" : "2px solid transparent",
                marginBottom: -2, transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: System Overview ── */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Expense Categories */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Expense Categories</span>
                <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "var(--font-mono)" }}>{CATEGORIES.length} active</span>
              </div>
              <div style={{ padding: "8px 0" }}>
                {CATEGORIES.map((cat) => {
                  const spend = EXPENSES.filter((e) => e.category_id === cat.category_id).reduce((s, e) => s + e.amount, 0);
                  const count = EXPENSES.filter((e) => e.category_id === cat.category_id).length;
                  return (
                    <div key={cat.category_id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 13, color: "#1e293b" }}>{cat.category_name}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "var(--font-mono)" }}>{count} records</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: spend > 0 ? "#ef4444" : "#cbd5e1", fontFamily: "var(--font-mono)" }}>
                        {spend > 0 ? formatRWF(spend) : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick stats panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#0e3a1d", borderRadius: 12, padding: 22, color: "#fff" }}>
                <div style={{ fontSize: 12, color: "#4ead6b", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 12 }}>SYSTEM HEALTH</div>
                {[
                  { label: "Expenses recorded", value: EXPENSES.length, max: 50 },
                  { label: "Revenues recorded",  value: REVENUES.length, max: 50 },
                  { label: "Budgets set",         value: BUDGETS.length,  max: 40 },
                  { label: "Active users",        value: USERS.length,    max: 20 },
                ].map((stat) => (
                  <div key={stat.label} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{stat.label}</span>
                      <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "#4ead6b" }}>{stat.value}</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${Math.min(100, (stat.value / stat.max) * 100)}%`, background: "#4ead6b", borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>Quick Actions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Register new user",    page: "register",  color: "#2d8a4e" },
                    { label: "View all expenses",    page: "expenses",  color: "#3b82f6" },
                    { label: "Generate reports",     page: "reports",   color: "#7c3aed" },
                    { label: "Manage budgets",       page: "budgets",   color: "#f59e0b" },
                  ].map((a) => (
                    <button key={a.label} onClick={() => onNavigate(a.page)} style={{
                      padding: "10px 14px", background: a.color + "10",
                      border: `1px solid ${a.color}30`, borderRadius: 8,
                      color: a.color, fontSize: 13, fontWeight: 600,
                      fontFamily: "var(--font-sans)", cursor: "pointer",
                      textAlign: "left", transition: "background 0.15s",
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = a.color + "20")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = a.color + "10")}>
                      → {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: User Directory ── */}
        {activeTab === "users" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    {["#", "Full Name", "Username", "Email", "Phone", "Role", "Joined"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {USERS.map((u, i) => {
                    const m = ROLE_META[u.role];
                    return (
                      <tr key={u.user_id} style={{ borderBottom: "1px solid #f1f5f9" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                        <td style={{ padding: "12px 16px", color: "#94a3b8", fontFamily: "var(--font-mono)", fontSize: 11 }}>{i + 1}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#0e3a1d", color: "#4ead6b", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {u.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <span style={{ fontWeight: 600, color: "#1e293b" }}>{u.full_name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "#64748b" }}>@{u.username}</td>
                        <td style={{ padding: "12px 16px", color: "#475569", fontSize: 12 }}>{u.email}</td>
                        <td style={{ padding: "12px 16px", color: "#475569", fontSize: 12 }}>{u.phone}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 20, background: m.bg, color: m.color, fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: 11, color: "#94a3b8" }}>{u.created_at}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ textAlign: "right" }}>
              <button onClick={() => onNavigate("users")} style={{ ...actionBtn("#2d8a4e"), fontSize: 12 }}>
                Full User Management →
              </button>
            </div>
          </div>
        )}

        {/* ── Tab: Activity Feed ── */}
        {activeTab === "activity" && (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Recent System Activity</span>
              <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>All users · Latest 12 records</span>
            </div>
            <div style={{ padding: "8px 0" }}>
              {activityFeed.map((act, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "12px 20px", alignItems: "center", borderBottom: "1px solid #f8fafc" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: act.type === "revenue" ? "#f0faf3" : "#fef2f2",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14,
                  }}>
                    {act.type === "revenue" ? "📈" : "📉"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{act.label}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>by {act.by}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono)", color: act.type === "revenue" ? "#2d8a4e" : "#ef4444" }}>
                      {act.type === "revenue" ? "+" : "-"}{formatRWF(act.amount)}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "var(--font-mono)" }}>{act.date}</div>
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

function FinCard({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 22px", border: "1px solid #e2e8f0", display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>{label.toUpperCase()}</div>
        <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "var(--font-mono)", margin: "4px 0 2px", letterSpacing: "-0.02em" }}>{value}</div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>{sub}</div>
      </div>
    </div>
  );
}

function actionBtn(bg: string): React.CSSProperties {
  return { padding: "9px 18px", background: bg, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer" };
}
