import { useState, useEffect } from "react";
import type { User } from "./data/mockData";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";

// Role-specific dashboards
import DashboardAdmin   from "./pages/DashboardAdmin";
import DashboardManager from "./pages/DashboardManager";
import DashboardStaff   from "./pages/DashboardStaff";

// Shared pages
import Expenses from "./pages/Expenses";
import RevenuePage from "./pages/Revenue";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Profile from "./pages/Profile";

// Page access rules per role
const PAGE_ACCESS: Record<string, string[]> = {
  admin:   ["dashboard", "users", "register", "expenses", "revenue", "budgets", "reports", "profile"],
  manager: ["dashboard", "expenses", "revenue", "budgets", "reports", "profile"],
  staff:   ["dashboard", "expenses", "revenue", "profile"],
};

export default function App() {
  const [user, setUser]   = useState<User | null>(null);
  const [page, setPage]   = useState("dashboard");

  useEffect(() => {
    if (user && page === "register" && user.role !== "admin") {
      setPage("dashboard");
    }
  }, [page, user]);

  // Show register page full-screen (no sidebar layout)
  if (!user) {
    return <Login onLogin={(u) => { setUser(u); setPage("dashboard"); }} />;
  }

  // Register page is full-screen, outside the Layout shell
  if (page === "register") {
    if (user.role !== "admin") return null;  // useEffect redirects to dashboard
    return <Register onBack={() => setPage("dashboard")} />;
  }

  function navigate(target: string) {
    const allowed = PAGE_ACCESS[user!.role] ?? [];
    if (allowed.includes(target)) {
      setPage(target);
    }
    // silently ignore pages the role can't access
  }

  function renderDashboard() {
    switch (user!.role) {
      case "admin":   return <DashboardAdmin   user={user!} onNavigate={navigate} />;
      case "manager": return <DashboardManager user={user!} onNavigate={navigate} />;
      case "staff":   return <DashboardStaff   user={user!} onNavigate={navigate} />;
    }
  }

  function renderPage() {
    const allowed = PAGE_ACCESS[user!.role] ?? [];
    if (!allowed.includes(page)) {
      return (
        <div style={{ padding: "60px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", margin: "0 0 8px" }}>Access Denied</h2>
          <p style={{ color: "#64748b", fontSize: 14 }}>Your role (<strong>{user!.role}</strong>) does not have permission to view this page.</p>
          <button onClick={() => setPage("dashboard")} style={{ marginTop: 20, padding: "10px 22px", background: "#2d8a4e", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
            Back to Dashboard
          </button>
        </div>
      );
    }

    switch (page) {
      case "dashboard": return renderDashboard();
      case "expenses":  return <Expenses user={user!} />;
      case "revenue":   return <RevenuePage user={user!} />;
      case "budgets":   return <Budgets />;
      case "reports":   return <Reports />;
      case "users":     return <Users />;
      case "profile":   return <Profile user={user!} onUpdateUser={(u) => setUser(u)} />;
      default:          return renderDashboard();
    }
  }

  return (
    <Layout
      currentPage={page}
      onNavigate={navigate}
      onLogout={() => { setUser(null); setPage("dashboard"); }}
      user={user}
    >
      {renderPage()}
    </Layout>
  );
}
