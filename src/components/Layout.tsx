import { useState } from "react";
import type { User } from "../data/mockData";

// SVG icon system
function NavIcon({ page }: { page: string }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    users:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    register:  <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></>,
    expenses:  <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></>,
    revenue:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    budgets:   <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    reports:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    profile:   <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {icons[page] ?? icons.dashboard}
    </svg>
  );
}

const ADMIN_NAV = [
  { page: "dashboard", label: "Dashboard",     section: "main" },
  { page: "users",     label: "User Mgmt",     section: "main" },
  { page: "register",  label: "Register User", section: "main" },
  { page: "expenses",  label: "Expenses",      section: "finance" },
  { page: "revenue",   label: "Revenue",       section: "finance" },
  { page: "budgets",   label: "Budgets",       section: "finance" },
  { page: "reports",   label: "Reports",       section: "finance" },
  { page: "profile",   label: "My Profile",    section: "account" },
];

const MANAGER_NAV = [
  { page: "dashboard", label: "Dashboard",  section: "main" },
  { page: "expenses",  label: "Expenses",   section: "finance" },
  { page: "revenue",   label: "Revenue",    section: "finance" },
  { page: "budgets",   label: "Budgets",    section: "finance" },
  { page: "reports",   label: "Reports",    section: "finance" },
  { page: "profile",   label: "My Profile", section: "account" },
];

const STAFF_NAV = [
  { page: "dashboard", label: "Dashboard",   section: "main" },
  { page: "expenses",  label: "My Expenses", section: "data" },
  { page: "revenue",   label: "My Revenue",  section: "data" },
  { page: "profile",   label: "My Profile",  section: "account" },
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
  const sections = Array.from(new Set(navItems.map((n) => n.section))) as SectionKey[];
  const initials = user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const today = new Date().toLocaleDateString("en-RW", { weekday: "short", month: "short", day: "numeric" });
  const currentLabel = navItems.find((n) => n.page === currentPage)?.label ?? currentPage;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f1f5f9", overflow: "hidden" }}>

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside style={{
        width: sidebarOpen ? 238 : 64,
        minWidth: sidebarOpen ? 238 : 64,
        background: "linear-gradient(180deg, #09261A 0%, #0e3a1d 60%, #0c3018 100%)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.24s cubic-bezier(0.4,0,0.2,1), min-width 0.24s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        zIndex: 10,
        flexShrink: 0,
        boxShadow: "3px 0 16px rgba(0,0,0,0.22)",
      }}>

        {/* Logo */}
        <div style={{
          padding: sidebarOpen ? "18px 16px 14px" : "18px 14px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: 11,
          minHeight: 64,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #2d8a4e 0%, #4ead6b 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0,
            boxShadow: "0 2px 10px rgba(45,138,78,0.45)",
          }}>🌿</div>
          {sidebarOpen && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 13.5, whiteSpace: "nowrap", letterSpacing: "-0.01em", lineHeight: 1.2 }}>GreenHarvest</div>
              <div style={{ color: "#4ead6b", fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.14em", whiteSpace: "nowrap", marginTop: 2, opacity: 0.85 }}>AGRIBUSINESS LTD</div>
            </div>
          )}
        </div>

        {/* User card */}
        {sidebarOpen && (
          <div style={{ padding: "10px 10px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              padding: "9px 11px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, #1e6b3a 0%, #2d8a4e 100%)",
                  color: "#a3e6ba", fontSize: 11.5, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1.5px solid rgba(78,173,107,0.3)",
                }}>
                  {initials}
                </div>
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 9, height: 9, borderRadius: "50%",
                  background: badge.dot, border: "2px solid #0e3a1d",
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.full_name}
                </div>
                <div style={{ fontSize: 9.5, fontFamily: "var(--font-mono)", letterSpacing: "0.09em", textTransform: "uppercase", color: badge.dot, marginTop: 1.5 }}>
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: "6px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 0 }}>
          {sections.map((section) => {
            const items = navItems.filter((n) => n.section === section);
            return (
              <div key={section} style={{ marginBottom: 4 }}>
                {sidebarOpen && (
                  <div style={{
                    fontSize: 9, fontWeight: 700,
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "0.16em",
                    padding: "12px 12px 4px",
                    fontFamily: "var(--font-mono)",
                  }}>
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
                        gap: 10,
                        padding: sidebarOpen ? "8.5px 10px 8.5px 12px" : "8.5px 0",
                        justifyContent: sidebarOpen ? "flex-start" : "center",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer",
                        background: active ? "rgba(78,173,107,0.14)" : "transparent",
                        color: active ? "#fff" : "rgba(255,255,255,0.48)",
                        fontSize: 13,
                        fontWeight: active ? 600 : 400,
                        fontFamily: "var(--font-sans)",
                        textAlign: "left",
                        transition: "all 0.14s ease",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        marginBottom: 1,
                        boxShadow: active ? "inset 3px 0 0 #4ead6b" : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
                          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.82)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.48)";
                        }
                      }}
                    >
                      <span style={{ color: active ? "#4ead6b" : "inherit", display: "flex", alignItems: "center" }}>
                        <NavIcon page={item.page} />
                      </span>
                      {sidebarOpen && (
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "8px 8px 14px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            onClick={onLogout}
            title={!sidebarOpen ? "Sign Out" : undefined}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              gap: 10,
              padding: sidebarOpen ? "8.5px 10px 8.5px 12px" : "8.5px 0",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              borderRadius: 8, border: "none",
              cursor: "pointer", background: "transparent",
              color: "rgba(255,255,255,0.32)", fontSize: 13,
              fontFamily: "var(--font-sans)", textAlign: "left",
              whiteSpace: "nowrap", overflow: "hidden",
              transition: "all 0.14s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.12)";
              (e.currentTarget as HTMLButtonElement).style.color = "#fca5a5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.32)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          height: 56,
          background: "#fff",
          borderBottom: "1px solid #e8edf2",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px 0 18px",
          flexShrink: 0,
          gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#64748b", padding: "6px 7px", borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.13s, color 0.13s",
              }}
              onMouseEnter={(e) => { (e.currentTarget.style.background = "#f1f5f9"); (e.currentTarget.style.color = "#334155"); }}
              onMouseLeave={(e) => { (e.currentTarget.style.background = "none"); (e.currentTarget.style.color = "#64748b"); }}
              title="Toggle sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />

            {/* Breadcrumb */}
            <nav style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>GreenHarvest</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              <span style={{ fontSize: 12.5, fontWeight: 650, color: "#334155" }}>{currentLabel}</span>
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Date */}
            <span style={{ fontSize: 11.5, color: "#94a3b8", fontFamily: "var(--font-mono)", letterSpacing: "0.02em" }}>{today}</span>

            <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />

            {/* Notification bell */}
            <button
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#64748b", padding: "6px", borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.13s, color 0.13s",
              }}
              onMouseEnter={(e) => { (e.currentTarget.style.background = "#f1f5f9"); (e.currentTarget.style.color = "#334155"); }}
              onMouseLeave={(e) => { (e.currentTarget.style.background = "none"); (e.currentTarget.style.color = "#64748b"); }}
              title="Notifications"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>

            <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />

            {/* Role badge */}
            <span style={{
              padding: "3px 10px", borderRadius: 20,
              background: badge.bg, color: badge.text,
              fontSize: 11, fontWeight: 700,
              textTransform: "capitalize", letterSpacing: "0.02em",
            }}>
              {user.role}
            </span>

            {/* Avatar + name */}
            <button
              onClick={() => onNavigate("profile")}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                cursor: "pointer", background: "none", border: "none",
                padding: "4px 8px 4px 6px", borderRadius: 8,
                transition: "background 0.13s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1e293b", lineHeight: 1.2 }}>{user.full_name}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "var(--font-mono)" }}>@{user.username}</div>
              </div>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg, #0e3a1d 0%, #1e6b3a 100%)",
                color: "#4ead6b", fontSize: 12, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #e2e8f0",
                letterSpacing: "0.02em",
              }}>
                {initials}
              </div>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: "auto", padding: "24px 26px" }} className="page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}
