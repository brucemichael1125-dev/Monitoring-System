import React, { createContext, useContext, useState } from "react";
import {
  USERS as SEED_USERS,
  EXPENSES as SEED_EXPENSES,
  REVENUES as SEED_REVENUES,
  BUDGETS as SEED_BUDGETS,
  CATEGORIES,
} from "./mockData";
import type { User, Expense, Revenue, Budget, Category } from "./mockData";

interface AppData {
  users:      User[];
  expenses:   Expense[];
  revenues:   Revenue[];
  budgets:    Budget[];
  categories: Category[];

  addUser(u: Omit<User, "user_id" | "created_at">): void;
  updateUser(u: User): void;
  deleteUser(id: number): void;

  addExpense(e: Omit<Expense, "expense_id">): void;
  updateExpense(e: Expense): void;
  deleteExpense(id: number): void;

  addRevenue(r: Omit<Revenue, "revenue_id">): void;
  updateRevenue(r: Revenue): void;
  deleteRevenue(id: number): void;

  addBudget(b: Omit<Budget, "budget_id">): void;
  updateBudget(b: Budget): void;
  deleteBudget(id: number): void;
}

const AppDataContext = createContext<AppData | null>(null);

function nextId<T extends Record<string, unknown>>(arr: T[], key: keyof T): number {
  if (arr.length === 0) return 1;
  return Math.max(...arr.map((x) => x[key] as number)) + 1;
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [users,    setUsers]    = useState<User[]>(SEED_USERS);
  const [expenses, setExpenses] = useState<Expense[]>(SEED_EXPENSES);
  const [revenues, setRevenues] = useState<Revenue[]>(SEED_REVENUES);
  const [budgets,  setBudgets]  = useState<Budget[]>(SEED_BUDGETS);

  const value: AppData = {
    users, expenses, revenues, budgets, categories: CATEGORIES,

    addUser: (d) => setUsers((p) => [
      ...p,
      { ...d, user_id: nextId(p, "user_id"), created_at: new Date().toISOString().slice(0, 10) },
    ]),
    updateUser: (u) => setUsers((p) => p.map((x) => x.user_id === u.user_id ? u : x)),
    deleteUser: (id) => setUsers((p) => p.filter((x) => x.user_id !== id)),

    addExpense: (d) => setExpenses((p) => [
      ...p,
      { ...d, expense_id: nextId(p, "expense_id") },
    ]),
    updateExpense: (e) => setExpenses((p) => p.map((x) => x.expense_id === e.expense_id ? e : x)),
    deleteExpense: (id) => setExpenses((p) => p.filter((x) => x.expense_id !== id)),

    addRevenue: (d) => setRevenues((p) => [
      ...p,
      { ...d, revenue_id: nextId(p, "revenue_id") },
    ]),
    updateRevenue: (r) => setRevenues((p) => p.map((x) => x.revenue_id === r.revenue_id ? r : x)),
    deleteRevenue: (id) => setRevenues((p) => p.filter((x) => x.revenue_id !== id)),

    addBudget: (d) => setBudgets((p) => [
      ...p,
      { ...d, budget_id: nextId(p, "budget_id") },
    ]),
    updateBudget: (b) => setBudgets((p) => p.map((x) => x.budget_id === b.budget_id ? b : x)),
    deleteBudget: (id) => setBudgets((p) => p.filter((x) => x.budget_id !== id)),
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used inside <AppDataProvider>");
  return ctx;
}
