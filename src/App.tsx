import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import type { User } from "./data/mockData";
import { AppDataProvider } from "./data/AppDataContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

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
  const [user,        setUser]        = useState<User | null>(null);
  const [authId,      setAuthId]      = useState<string | undefined>(undefined);
  const [page,        setPage]        = useState("dashboard");
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError,  setLoginError]  = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) loadProfile(session.user.id);
      else setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) loadProfile(session.user.id);
      else { setUser(null); setAuthId(undefined); setAuthLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(uid: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_id", uid)
      .single();

    if (data) {
      setUser(data as User);
      setAuthId(uid);
      setLoginError("");
    } else {
      await supabase.auth.signOut();
      if (error?.code === "PGRST116") {
        setLoginError("Account has no profile. Contact your administrator.");
      } else {
        setLoginError(`Profile error (${error?.code ?? "unknown"}): ${error?.message ?? "Could not load your account."}`);
      }
    }
    setAuthLoading(false);
  }

  useEffect(() => {
    if (user && page === "register" && user.role !== "admin") {
      setPage("dashboard");
    }
  }, [page, user]);

  async function handleLogin(email: string, password: string): Promise<string | null> {
    setLoginError("");
    // Clear any stale session before attempting a fresh login
    await supabase.auth.signOut();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setAuthId(undefined);
    setPage("dashboard");
  }

  // Full-screen loading while restoring session
  if (authLoading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "#f8fafc",
        color: "#64748b", fontSize: 14, fontFamily: "var(--font-sans)", gap: 10,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="2.5"
          strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
          <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
        </svg>
        Loading…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Unauthenticated: show Login
  if (!user) {
    return <Login onLogin={handleLogin} serverError={loginError} />;
  }

  function navigate(target: string) {
    const allowed = PAGE_ACCESS[user!.role] ?? [];
    if (allowed.includes(target)) setPage(target);
  }

  function renderDashboard() {
    switch (user!.role) {
      case "admin":   return <DashboardAdmin   user={user!} onNavigate={navigate} />;
      case "manager": return <DashboardManager user={user!} onNavigate={navigate} />;
      case "staff":   return <DashboardStaff   user={user!} onNavigate={navigate} />;
      default: {
        const _exhaustive: never = user!.role;
        return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Unknown role: {String(_exhaustive)}</div>;
      }
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
      case "users":     return <Users onNavigate={navigate} />;
      case "profile":   return <Profile user={user!} onUpdateUser={(u) => setUser(u)} />;
      default:          return renderDashboard();
    }
  }

  // Authenticated: wrap everything in AppDataProvider
  return (
    <AppDataProvider authId={authId}>
      {page === "register" && user.role === "admin"
        ? <Register onBack={() => setPage("dashboard")} />
        : (
          <Layout
            currentPage={page}
            onNavigate={navigate}
            onLogout={handleLogout}
            user={user}
          >
            <ErrorBoundary key={page}>
              {renderPage()}
            </ErrorBoundary>
          </Layout>
        )
      }
    </AppDataProvider>
  );
}
