// Type definitions and pure utility functions for the Agri-Business Monitoring System.
// All data is fetched from Supabase — no static mock arrays live here.

export type Role = "admin" | "manager" | "staff";
export type Page =
  | "login"
  | "dashboard"
  | "expenses"
  | "revenue"
  | "budgets"
  | "reports"
  | "users"
  | "profile";

export interface User {
  user_id:    number;
  auth_id?:   string;
  full_name:  string;
  username:   string;
  role:       Role;
  email:      string;
  phone:      string;
  created_at: string;
}

export interface Category {
  category_id:   number;
  category_name: string;
  color:         string;
}

export interface Expense {
  expense_id:    number;
  category_id:   number;
  amount:        number;
  description:   string;
  expense_date:  string;
  created_by:    string;
  created_by_id?: string;
}

export interface Revenue {
  revenue_id:    number;
  source:        string;
  amount:        number;
  description:   string;
  revenue_date:  string;
  created_by:    string;
  created_by_id?: string;
}

export interface Budget {
  budget_id:     number;
  category_id:   number;
  budget_amount: number;
  month:         number;
  year:          number;
}

// ── Pure utilities ────────────────────────────────────────────────────────────

export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function formatRWF(amount: number): string {
  return "RWF " + amount.toLocaleString("en-RW");
}

export function getMonthlyData(
  revenues: Revenue[],
  expenses: Expense[],
  lookbackMonths = 6,
) {
  const allDates = [...revenues.map((r) => r.revenue_date), ...expenses.map((e) => e.expense_date)];
  const latest = allDates.length > 0
    ? allDates.reduce((a, b) => (a > b ? a : b))
    : new Date().toISOString().slice(0, 10);
  const [refYear, refMonth] = latest.split("-").map(Number);

  return Array.from({ length: lookbackMonths }, (_, i) => {
    const offset = lookbackMonths - 1 - i;
    let m = refMonth - offset;
    let y = refYear;
    while (m <= 0) { m += 12; y -= 1; }

    const rev = revenues
      .filter((r) => { const [ry, rm] = r.revenue_date.split("-").map(Number); return rm === m && ry === y; })
      .reduce((s, r) => s + r.amount, 0);
    const exp = expenses
      .filter((e) => { const [ey, em] = e.expense_date.split("-").map(Number); return em === m && ey === y; })
      .reduce((s, e) => s + e.amount, 0);

    return { month: MONTHS[m - 1], revenue: rev, expenses: exp, profit: rev - exp };
  });
}

export function getCategoryExpenses(
  expenses: Expense[],
  categories: Category[],
) {
  return categories.map((cat) => ({
    name: cat.category_name.split(" ")[0] + (cat.category_name.split(" ")[1] ? " " + cat.category_name.split(" ")[1] : ""),
    fullName: cat.category_name,
    amount: expenses.filter((e) => e.category_id === cat.category_id).reduce((s, e) => s + e.amount, 0),
    color: cat.color,
  })).filter((c) => c.amount > 0);
}
