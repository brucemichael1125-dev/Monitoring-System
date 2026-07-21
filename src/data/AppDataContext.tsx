import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { User, Expense, Revenue, Budget, Category } from "./mockData";

interface AppData {
  users:      User[];
  expenses:   Expense[];
  revenues:   Revenue[];
  budgets:    Budget[];
  categories: Category[];
  loading:    boolean;

  refreshUsers(): Promise<void>;
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

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used inside <AppDataProvider>");
  return ctx;
}

interface Props { children: ReactNode; authId?: string; }

export function AppDataProvider({ children, authId }: Props) {
  const [users,      setUsers]      = useState<User[]>([]);
  const [expenses,   setExpenses]   = useState<Expense[]>([]);
  const [revenues,   setRevenues]   = useState<Revenue[]>([]);
  const [budgets,    setBudgets]    = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    if (!authId) {
      setUsers([]); setExpenses([]); setRevenues([]); setBudgets([]);
      return;
    }
    setLoading(true);
    Promise.all([
      supabase.from("profiles").select("*").order("user_id"),
      supabase.from("expenses").select("*").order("expense_date", { ascending: false }),
      supabase.from("revenues").select("*").order("revenue_date", { ascending: false }),
      supabase.from("budgets").select("*"),
      supabase.from("categories").select("*").order("category_id"),
    ]).then(([u, e, r, b, c]) => {
      if (u.data) setUsers(u.data as User[]);
      if (e.data) setExpenses(e.data as Expense[]);
      if (r.data) setRevenues(r.data as Revenue[]);
      if (b.data) setBudgets(b.data as Budget[]);
      if (c.data && c.data.length > 0) setCategories(c.data as Category[]);
    }).finally(() => setLoading(false));
  }, [authId]);

  // ── Users (profiles table) ───────────────────────────────────────────────
  const refreshUsers = useCallback(async () => {
    const { data } = await supabase.from("profiles").select("*").order("user_id");
    if (data) setUsers(data as User[]);
  }, []);

  const addUser = useCallback((data: Omit<User, "user_id" | "created_at">) => {
    supabase.from("profiles").insert({
      auth_id:   data.auth_id ?? "",
      full_name: data.full_name,
      username:  data.username,
      role:      data.role,
      email:     data.email,
      phone:     data.phone,
    }).select().single().then(({ data: row }) => {
      if (row) setUsers((prev) => [...prev, row as User]);
    });
  }, []);

  const updateUser = useCallback((u: User) => {
    setUsers((prev) => prev.map((x) => x.user_id === u.user_id ? u : x));
    supabase.from("profiles").update({
      full_name: u.full_name,
      email:     u.email,
      phone:     u.phone,
      role:      u.role,
    }).eq("user_id", u.user_id).then(({ error }) => {
      if (error) {
        console.error("updateUser failed:", error.message);
        supabase.from("profiles").select("*").order("user_id")
          .then(({ data }) => { if (data) setUsers(data as User[]); });
      }
    });
  }, []);

  const deleteUser = useCallback((id: number) => {
    setUsers((prev) => prev.filter((x) => x.user_id !== id));
    supabase.from("profiles").delete().eq("user_id", id).then(({ error }) => {
      if (error) {
        console.error("deleteUser failed:", error.message);
        supabase.from("profiles").select("*").order("user_id")
          .then(({ data }) => { if (data) setUsers(data as User[]); });
      }
    });
  }, []);

  // ── Expenses ─────────────────────────────────────────────────────────────
  const addExpense = useCallback((data: Omit<Expense, "expense_id">) => {
    if (!authId) { console.error("addExpense: no authId — user not authenticated"); return; }
    const tempId = -(Date.now()); // negative to avoid collision with real serial IDs
    setExpenses((prev) => [{ ...data, expense_id: tempId, created_by_id: authId }, ...prev]);
    supabase.from("expenses").insert({
      category_id:   data.category_id,
      amount:        data.amount,
      description:   data.description,
      expense_date:  data.expense_date,
      created_by:    data.created_by,
      created_by_id: authId,
    }).select().single().then(({ data: row, error }) => {
      if (error || !row) {
        console.error("addExpense failed:", error?.message);
        setExpenses((prev) => prev.filter((e) => e.expense_id !== tempId));
      } else {
        setExpenses((prev) => prev.map((e) => e.expense_id === tempId ? row as Expense : e));
      }
    });
  }, [authId]);

  const updateExpense = useCallback((e: Expense) => {
    setExpenses((prev) => prev.map((x) => x.expense_id === e.expense_id ? e : x));
    supabase.from("expenses").update({
      category_id:  e.category_id,
      amount:       e.amount,
      description:  e.description,
      expense_date: e.expense_date,
    }).eq("expense_id", e.expense_id).then(({ error }) => {
      if (error) {
        console.error("updateExpense failed:", error.message);
        supabase.from("expenses").select("*").order("expense_date", { ascending: false })
          .then(({ data }) => { if (data) setExpenses(data as Expense[]); });
      }
    });
  }, []);

  const deleteExpense = useCallback((id: number) => {
    setExpenses((prev) => prev.filter((e) => e.expense_id !== id));
    supabase.from("expenses").delete().eq("expense_id", id).then(({ error }) => {
      if (error) {
        console.error("deleteExpense failed:", error.message);
        supabase.from("expenses").select("*").order("expense_date", { ascending: false })
          .then(({ data }) => { if (data) setExpenses(data as Expense[]); });
      }
    });
  }, []);

  // ── Revenues ─────────────────────────────────────────────────────────────
  const addRevenue = useCallback((data: Omit<Revenue, "revenue_id">) => {
    if (!authId) { console.error("addRevenue: no authId — user not authenticated"); return; }
    const tempId = -(Date.now());
    setRevenues((prev) => [{ ...data, revenue_id: tempId, created_by_id: authId }, ...prev]);
    supabase.from("revenues").insert({
      source:        data.source,
      amount:        data.amount,
      description:   data.description,
      revenue_date:  data.revenue_date,
      created_by:    data.created_by,
      created_by_id: authId,
    }).select().single().then(({ data: row, error }) => {
      if (error || !row) {
        console.error("addRevenue failed:", error?.message);
        setRevenues((prev) => prev.filter((r) => r.revenue_id !== tempId));
      } else {
        setRevenues((prev) => prev.map((r) => r.revenue_id === tempId ? row as Revenue : r));
      }
    });
  }, [authId]);

  const updateRevenue = useCallback((r: Revenue) => {
    setRevenues((prev) => prev.map((x) => x.revenue_id === r.revenue_id ? r : x));
    supabase.from("revenues").update({
      source:       r.source,
      amount:       r.amount,
      description:  r.description,
      revenue_date: r.revenue_date,
    }).eq("revenue_id", r.revenue_id).then(({ error }) => {
      if (error) {
        console.error("updateRevenue failed:", error.message);
        supabase.from("revenues").select("*").order("revenue_date", { ascending: false })
          .then(({ data }) => { if (data) setRevenues(data as Revenue[]); });
      }
    });
  }, []);

  const deleteRevenue = useCallback((id: number) => {
    setRevenues((prev) => prev.filter((r) => r.revenue_id !== id));
    supabase.from("revenues").delete().eq("revenue_id", id).then(({ error }) => {
      if (error) {
        console.error("deleteRevenue failed:", error.message);
        supabase.from("revenues").select("*").order("revenue_date", { ascending: false })
          .then(({ data }) => { if (data) setRevenues(data as Revenue[]); });
      }
    });
  }, []);

  // ── Budgets ──────────────────────────────────────────────────────────────
  const addBudget = useCallback((data: Omit<Budget, "budget_id">) => {
    const tempId = Date.now();
    setBudgets((prev) => [...prev, { ...data, budget_id: tempId }]);
    supabase.from("budgets").insert({
      category_id:   data.category_id,
      budget_amount: data.budget_amount,
      month:         data.month,
      year:          data.year,
    }).select().single().then(({ data: row, error }) => {
      if (error || !row) {
        console.error("addBudget failed:", error?.message);
        setBudgets((prev) => prev.filter((b) => b.budget_id !== tempId));
      } else {
        setBudgets((prev) => prev.map((b) => b.budget_id === tempId ? row as Budget : b));
      }
    });
  }, []);

  const updateBudget = useCallback((b: Budget) => {
    setBudgets((prev) => prev.map((x) => x.budget_id === b.budget_id ? b : x));
    supabase.from("budgets").update({
      category_id:   b.category_id,
      budget_amount: b.budget_amount,
      month:         b.month,
      year:          b.year,
    }).eq("budget_id", b.budget_id).then(({ error }) => {
      if (error) {
        console.error("updateBudget failed:", error.message);
        supabase.from("budgets").select("*")
          .then(({ data }) => { if (data) setBudgets(data as Budget[]); });
      }
    });
  }, []);

  const deleteBudget = useCallback((id: number) => {
    setBudgets((prev) => prev.filter((b) => b.budget_id !== id));
    supabase.from("budgets").delete().eq("budget_id", id).then(({ error }) => {
      if (error) {
        console.error("deleteBudget failed:", error.message);
        supabase.from("budgets").select("*")
          .then(({ data }) => { if (data) setBudgets(data as Budget[]); });
      }
    });
  }, []);

  const value = useMemo<AppData>(() => ({
    users, expenses, revenues, budgets, categories, loading,
    refreshUsers, addUser, updateUser, deleteUser,
    addExpense, updateExpense, deleteExpense,
    addRevenue, updateRevenue, deleteRevenue,
    addBudget, updateBudget, deleteBudget,
  }), [users, expenses, revenues, budgets, categories, loading,
    refreshUsers, addUser, updateUser, deleteUser,
    addExpense, updateExpense, deleteExpense,
    addRevenue, updateRevenue, deleteRevenue,
    addBudget, updateBudget, deleteBudget,
  ]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}
