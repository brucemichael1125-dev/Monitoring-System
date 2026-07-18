import { useState } from "react";
import type { User } from "../data/mockData";

// Navigation items per role
const ADMIN_NAV = [
  { page: "dashboard", label: "Dashboard",    icon: "⊞", section: "main" },
  { page: "users",     label: "User Mgmt",    icon: "◉", section: "main" },
  { page: "register",  label: "Register User", icon: "+", section: "main" },
  { page: "expenses",  label: "Expenses",     icon: "↓", section: "finance" },
  { page: "revenue",   label: "Revenue",      icon: "↑", section: "finance" },
  { page: "budgets",   label: "Budgets",      icon: "◎", section: "finance" },
  { page: "reports",   label: "Reports",      icon: "≡", section: "finance" },
  { page: "profile",   label: "My Profile",   icon: "○", section: "account" },
];

const MANAGER_NAV = [
  { page: "dashboard", label: "Dashboard",    icon: "⊞", section: "main" },
  { page: "expenses",  label: "Expenses",     icon: "↓", section: "finance" },
  { page: "revenue",   label: "Revenue",      icon: "↑", section: "finance" },
  { page: "budgets",   label: "Budgets",      icon: "◎", section: "finance" },
  { page: "reports",   label: "Reports",      icon: "≡", section: "finance" },
  { page: "profile",   label: "My Profile",   icon: "○", section: "account" },
];

const STAFF_NAV = [
  { page: "dashboard", label: "Dashboard",    icon: "⊞", section: "main" },
  { page: "expenses",  label: "My Expenses",  icon: "↓", section: "data" },
  { page: "revenue",   label: "My Revenue",   icon: "↑", section: "data" },
  { page: "profile",   label: "My Profile",   icon: "○", section: "account" },
];

function getNav(role: string) {
  if (role === "admin")   return ADMIN_NAV;
  if (role === "manager") return MANAGER_NAV;
  return STAFF_NAV;
}

const ROLE_BADGE: Record<string, { bg: string; text: string; dot: string }> = {
  admin:   { bg: "#fef3c7", text: "#b45309", dot: "#f59e0b" },
  manager: { bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
  staff:   { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e" },
};

type SectionKey = "main" | "finance" | "data" | "account";
const SECTION_LABELS: Record<SectionKey, string> = {
  main:    "MAIN",
  finance: "FINANCE",
  data:    "MY DATA",
  account: "ACCOUNT",
};

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  user: User;
  children: React.ReactNode;
}

export default function Layout({ currentPage, onNavigate, onLogout, user, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navItems = getNav(user.role);
  const badge = ROLE_BADGE[user.role] ?? ROLE_BADGE.staff;

  // Group nav items by section
  const sections = Array.from(new Set(navItems.map((n) => n.section))) as SectionKey[];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f1f5f9", overflow: "hidden" }}>

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside style={{
        width: sidebarOpen ? 234 : 60,
        minWidth: sidebarOpen ? 234 : 60,
        background: "#0e3a1d",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease, min-width 0.2s ease",
        overflow: "hidden",
        zIndex: 10,
        flexShrink: 0,
      }}>

        {/* Logo */}
        <div style={{ padding: "18px 14px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#2d8a4e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🌿</div>
          {sidebarOpen && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" }}>GreenHarvest</div>
              <div style={{ color: "#4ead6b", fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>AGRIBUSINESS LTD</div>
            </div>
          )}
        </div>

        {/* Role badge in sidebar */}
        {sidebarOpen && (
          <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: badge.dot, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.full_name}
                </div>
                <div style={{
                  fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.06em",
                  textTransform: "uppercase", color: badge.dot,
                }}>
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav sections */}
        <nav style={{ flex: 1, padding: "8px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 0 }}>
          {sections.map((section) => {
            const items = navItems.filter((n) => n.section === section);
            return (
              <div key={section} style={{ marginBottom: 4 }}>
                {sidebarOpen && (
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", padding: "10px 12px 4px", fontFamily: "var(--font-mono)" }}>
                    {SECTION_LABELS[section]}
                  </div>
                )}
                {items.map((item) => {
                  const active = currentPage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => onNavigate(item.page)}
                      title={!sidebarOpen ? item.label : undefined}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        padding: "8px 10px",
                        borderRadius: 7,
                        border: "none",
                        cursor: "pointer",
                        background: active ? "#2d8a4e" : "transparent",
                        color: active ? "#fff" : "rgba(255,255,255,0.55)",
                        fontSize: 13,
                        fontWeight: active ? 600 : 400,
                        fontFamily: "var(--font-sans)",
                        textAlign: "left",
                        transition: "background 0.12s, color 0.12s",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        marginBottom: 1,
                      }}
                      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; }}
                      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                    >
                      <span style={{ fontSize: 13, flexShrink: 0, width: 18, textAlign: "center", lineHeight: 1 }}>{item.icon}</span>
                      {sidebarOpen && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
                      {active && sidebarOpen && (
                        <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#4ead6b", flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "10px 8px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            onClick={onLogout}
            title={!sidebarOpen ? "Logout" : undefined}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 9,
              padding: "8px 10px", borderRadius: 7, border: "none",
              cursor: "pointer", background: "transparent",
              color: "rgba(255,255,255,0.4)", fontSize: 13,
              fontFamily: "var(--font-sans)", textAlign: "left",
              whiteSpace: "nowrap", overflow: "hidden", transition: "background 0.12s, color 0.12s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.12)"; (e.currentTarget as HTMLButtonElement).style.color = "#fca5a5"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)"; }}
          >
            <span style={{ fontSize: 13, flexShrink: 0, width: 18, textAlign: "center" }}>⏻</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          height: 54,
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 22px",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#64748b", padding: "4px 6px", borderRadius: 6 }} title="Toggle sidebar">
              ☰
            </button>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#cbd5e1" }}>GreenHarvest</span>
              <span style={{ fontSize: 12, color: "#cbd5e1" }}>/</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "capitalize" }}>
                {navItems.find((n) => n.page === currentPage)?.label ?? currentPage}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Role badge */}
            <span style={{
              padding: "3px 10px", borderRadius: 20,
              background: badge.bg, color: badge.text,
              fontSize: 11, fontWeight: 700, textTransform: "capitalize",
            }}>
              {user.role}
            </span>
            {/* Avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }} onClick={() => onNavigate("profile")}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", lineHeight: 1.2 }}>{user.full_name}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "var(--font-mono)" }}>@{user.username}</div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0e3a1d", color: "#4ead6b", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: "auto", padding: "22px 24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
