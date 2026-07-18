// Mock data for the Agribusiness Cost & Revenue Monitoring System
// Case Study: GreenHarvest Agribusiness Ltd, Rwanda

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
  user_id: number;
  full_name: string;
  username: string;
  role: Role;
  email: string;
  phone: string;
  created_at: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  color: string;
}

export interface Expense {
  expense_id: number;
  category_id: number;
  amount: number;
  description: string;
  expense_date: string;
  created_by: string;
}

export interface Revenue {
  revenue_id: number;
  source: string;
  amount: number;
  description: string;
  revenue_date: string;
  created_by: string;
}

export interface Budget {
  budget_id: number;
  category_id: number;
  budget_amount: number;
  month: number;
  year: number;
}

// ── Users ────────────────────────────────────────────────────────────────────
export const USERS: User[] = [
  {
    user_id: 1,
    full_name: "Jean-Pierre Nkurunziza",
    username: "admin",
    role: "admin",
    email: "jp.nkurunziza@greenharvest.rw",
    phone: "+250 788 100 001",
    created_at: "2024-01-10",
  },
  {
    user_id: 2,
    full_name: "Claudine Uwimana",
    username: "claudine",
    role: "manager",
    email: "c.uwimana@greenharvest.rw",
    phone: "+250 788 200 002",
    created_at: "2024-01-15",
  },
  {
    user_id: 3,
    full_name: "Théodore Habimana",
    username: "theo",
    role: "staff",
    email: "t.habimana@greenharvest.rw",
    phone: "+250 788 300 003",
    created_at: "2024-02-01",
  },
  {
    user_id: 4,
    full_name: "Solange Mukamana",
    username: "solange",
    role: "staff",
    email: "s.mukamana@greenharvest.rw",
    phone: "+250 788 400 004",
    created_at: "2024-02-20",
  },
  {
    user_id: 5,
    full_name: "Fidèle Bizimana",
    username: "fidele",
    role: "manager",
    email: "f.bizimana@greenharvest.rw",
    phone: "+250 788 500 005",
    created_at: "2024-03-05",
  },
];

// ── Categories ────────────────────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  { category_id: 1, category_name: "Seeds & Planting Material", color: "#2d8a4e" },
  { category_id: 2, category_name: "Fertilizers & Chemicals", color: "#f59e0b" },
  { category_id: 3, category_name: "Labor & Wages", color: "#3b82f6" },
  { category_id: 4, category_name: "Equipment & Machinery", color: "#8b5cf6" },
  { category_id: 5, category_name: "Transport & Logistics", color: "#ef4444" },
  { category_id: 6, category_name: "Irrigation & Water", color: "#06b6d4" },
  { category_id: 7, category_name: "Storage & Packaging", color: "#f97316" },
  { category_id: 8, category_name: "Administrative", color: "#6b7280" },
];

// ── Expenses ──────────────────────────────────────────────────────────────────
export const EXPENSES: Expense[] = [
  { expense_id: 1,  category_id: 1, amount: 450000, description: "Maize seeds — 50 kg bags × 30", expense_date: "2025-01-05", created_by: "Théodore Habimana" },
  { expense_id: 2,  category_id: 3, amount: 820000, description: "Seasonal field workers — 41 workers, 10 days", expense_date: "2025-01-12", created_by: "Claudine Uwimana" },
  { expense_id: 3,  category_id: 2, amount: 310000, description: "NPK fertilizer — 20 bags of 50 kg", expense_date: "2025-01-18", created_by: "Théodore Habimana" },
  { expense_id: 4,  category_id: 6, amount: 95000,  description: "Drip irrigation maintenance Q1", expense_date: "2025-01-25", created_by: "Fidèle Bizimana" },
  { expense_id: 5,  category_id: 5, amount: 180000, description: "Truck hire — Kigali market delivery", expense_date: "2025-02-03", created_by: "Claudine Uwimana" },
  { expense_id: 6,  category_id: 1, amount: 280000, description: "Bean seeds — Climber variety", expense_date: "2025-02-08", created_by: "Théodore Habimana" },
  { expense_id: 7,  category_id: 3, amount: 750000, description: "Harvesting team — 50 workers, 3 weeks", expense_date: "2025-02-14", created_by: "Claudine Uwimana" },
  { expense_id: 8,  category_id: 4, amount: 1200000, description: "Tractor servicing & spare parts", expense_date: "2025-02-20", created_by: "Jean-Pierre Nkurunziza" },
  { expense_id: 9,  category_id: 7, amount: 145000, description: "Jute sacks — 500 units", expense_date: "2025-02-26", created_by: "Solange Mukamana" },
  { expense_id: 10, category_id: 8, amount: 200000, description: "Office supplies & stationery Q1", expense_date: "2025-03-02", created_by: "Solange Mukamana" },
  { expense_id: 11, category_id: 2, amount: 390000, description: "Pesticides — fungicide & insecticide", expense_date: "2025-03-10", created_by: "Théodore Habimana" },
  { expense_id: 12, category_id: 5, amount: 220000, description: "Transport to Musanze wholesale market", expense_date: "2025-03-15", created_by: "Fidèle Bizimana" },
  { expense_id: 13, category_id: 3, amount: 680000, description: "Planting team wages — April", expense_date: "2025-04-02", created_by: "Claudine Uwimana" },
  { expense_id: 14, category_id: 6, amount: 115000, description: "Water pumping costs — dry season", expense_date: "2025-04-10", created_by: "Théodore Habimana" },
  { expense_id: 15, category_id: 1, amount: 320000, description: "Sorghum seeds — 400 kg", expense_date: "2025-04-18", created_by: "Théodore Habimana" },
  { expense_id: 16, category_id: 7, amount: 190000, description: "Cold storage rental — 2 months", expense_date: "2025-05-01", created_by: "Solange Mukamana" },
  { expense_id: 17, category_id: 4, amount: 450000, description: "Water pump replacement", expense_date: "2025-05-12", created_by: "Jean-Pierre Nkurunziza" },
  { expense_id: 18, category_id: 2, amount: 275000, description: "Lime application — soil pH correction", expense_date: "2025-05-20", created_by: "Théodore Habimana" },
  { expense_id: 19, category_id: 3, amount: 900000, description: "Weeding & maintenance labor — May/Jun", expense_date: "2025-06-05", created_by: "Claudine Uwimana" },
  { expense_id: 20, category_id: 5, amount: 260000, description: "Fuel expenses — delivery trucks", expense_date: "2025-06-14", created_by: "Fidèle Bizimana" },
];

// ── Revenue ───────────────────────────────────────────────────────────────────
export const REVENUES: Revenue[] = [
  { revenue_id: 1,  source: "Maize Sales — Kigali Market",    amount: 1800000, description: "900 kg at RWF 2,000/kg",           revenue_date: "2025-01-22", created_by: "Claudine Uwimana" },
  { revenue_id: 2,  source: "Bean Sales — Musanze",           amount: 950000,  description: "380 kg premium beans",             revenue_date: "2025-02-05", created_by: "Théodore Habimana" },
  { revenue_id: 3,  source: "Government Subsidy",             amount: 500000,  description: "Q1 crop support grant",            revenue_date: "2025-02-15", created_by: "Jean-Pierre Nkurunziza" },
  { revenue_id: 4,  source: "Maize Sales — Export",           amount: 2400000, description: "1,200 kg to Uganda buyer",         revenue_date: "2025-02-28", created_by: "Claudine Uwimana" },
  { revenue_id: 5,  source: "Vegetable Sales",                amount: 680000,  description: "Tomatoes & onions — local market", revenue_date: "2025-03-08", created_by: "Solange Mukamana" },
  { revenue_id: 6,  source: "Sorghum Sales",                  amount: 1100000, description: "550 kg — Bralirwa brewery",         revenue_date: "2025-03-18", created_by: "Fidèle Bizimana" },
  { revenue_id: 7,  source: "Bean Sales — Kigali",            amount: 760000,  description: "304 kg climbing beans",            revenue_date: "2025-03-25", created_by: "Claudine Uwimana" },
  { revenue_id: 8,  source: "Crop Insurance Payout",          amount: 300000,  description: "Partial drought compensation",     revenue_date: "2025-04-05", created_by: "Jean-Pierre Nkurunziza" },
  { revenue_id: 9,  source: "Maize Sales — Rwamagana",        amount: 1550000, description: "775 kg to cooperative buyers",     revenue_date: "2025-04-20", created_by: "Claudine Uwimana" },
  { revenue_id: 10, source: "Potato Sales",                   amount: 920000,  description: "460 kg Irish potato",              revenue_date: "2025-04-28", created_by: "Théodore Habimana" },
  { revenue_id: 11, source: "Vegetable Sales",                amount: 540000,  description: "Cabbage & carrot — weekly market", revenue_date: "2025-05-06", created_by: "Solange Mukamana" },
  { revenue_id: 12, source: "Sorghum Sales — Export",         amount: 1350000, description: "675 kg to Kenya buyer",            revenue_date: "2025-05-16", created_by: "Fidèle Bizimana" },
  { revenue_id: 13, source: "Maize Sales — Kigali Market",    amount: 1700000, description: "850 kg maize grain",               revenue_date: "2025-05-24", created_by: "Claudine Uwimana" },
  { revenue_id: 14, source: "Bean Sales — NGO Procurement",   amount: 1200000, description: "WFP local food procurement",       revenue_date: "2025-06-02", created_by: "Jean-Pierre Nkurunziza" },
  { revenue_id: 15, source: "Consulting / Training Income",   amount: 250000,  description: "Farmer training facilitation",    revenue_date: "2025-06-12", created_by: "Jean-Pierre Nkurunziza" },
];

// ── Budgets ───────────────────────────────────────────────────────────────────
export const BUDGETS: Budget[] = [
  { budget_id: 1,  category_id: 1, budget_amount: 800000,  month: 1, year: 2025 },
  { budget_id: 2,  category_id: 2, budget_amount: 400000,  month: 1, year: 2025 },
  { budget_id: 3,  category_id: 3, budget_amount: 900000,  month: 1, year: 2025 },
  { budget_id: 4,  category_id: 4, budget_amount: 500000,  month: 1, year: 2025 },
  { budget_id: 5,  category_id: 5, budget_amount: 200000,  month: 1, year: 2025 },
  { budget_id: 6,  category_id: 6, budget_amount: 120000,  month: 1, year: 2025 },
  { budget_id: 7,  category_id: 7, budget_amount: 180000,  month: 1, year: 2025 },
  { budget_id: 8,  category_id: 8, budget_amount: 250000,  month: 1, year: 2025 },
  { budget_id: 9,  category_id: 1, budget_amount: 350000,  month: 2, year: 2025 },
  { budget_id: 10, category_id: 2, budget_amount: 350000,  month: 2, year: 2025 },
  { budget_id: 11, category_id: 3, budget_amount: 800000,  month: 2, year: 2025 },
  { budget_id: 12, category_id: 4, budget_amount: 1500000, month: 2, year: 2025 },
  { budget_id: 13, category_id: 5, budget_amount: 200000,  month: 2, year: 2025 },
  { budget_id: 14, category_id: 6, budget_amount: 100000,  month: 2, year: 2025 },
  { budget_id: 15, category_id: 7, budget_amount: 160000,  month: 2, year: 2025 },
  { budget_id: 16, category_id: 3, budget_amount: 700000,  month: 3, year: 2025 },
  { budget_id: 17, category_id: 5, budget_amount: 250000,  month: 3, year: 2025 },
  { budget_id: 18, category_id: 2, budget_amount: 420000,  month: 3, year: 2025 },
];

// ── Monthly summary helper ────────────────────────────────────────────────────
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getMonthlyData() {
  const months = [1, 2, 3, 4, 5, 6];
  return months.map((m) => {
    const revenue = REVENUES.filter((r) => new Date(r.revenue_date).getMonth() + 1 === m).reduce((s, r) => s + r.amount, 0);
    const expenses = EXPENSES.filter((e) => new Date(e.expense_date).getMonth() + 1 === m).reduce((s, e) => s + e.amount, 0);
    return { month: MONTHS[m - 1], revenue, expenses, profit: revenue - expenses };
  });
}

export function getCategoryExpenses() {
  return CATEGORIES.map((cat) => ({
    name: cat.category_name.split(" ")[0] + (cat.category_name.split(" ")[1] ? " " + cat.category_name.split(" ")[1] : ""),
    fullName: cat.category_name,
    amount: EXPENSES.filter((e) => e.category_id === cat.category_id).reduce((s, e) => s + e.amount, 0),
    color: cat.color,
  })).filter((c) => c.amount > 0);
}

export function formatRWF(amount: number): string {
  return "RWF " + amount.toLocaleString("en-RW");
}

export function getCategoryName(id: number): string {
  return CATEGORIES.find((c) => c.category_id === id)?.category_name ?? "Unknown";
}

export function getCategoryColor(id: number): string {
  return CATEGORIES.find((c) => c.category_id === id)?.color ?? "#94a3b8";
}
