-- =====================================================================
-- GreenHarvest Agri-Business Cost & Budget Monitoring System
-- Supabase Schema — Run this FIRST in the SQL Editor
-- =====================================================================

-- ── Enable required extensions ────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ── profiles ──────────────────────────────────────────────────────────
-- Linked to auth.users via auth_id (Supabase Auth UUID stored as text)
create table if not exists profiles (
  user_id    serial       primary key,
  auth_id    text         unique not null,
  full_name  text         not null check (length(trim(full_name)) >= 2),
  username   text         unique not null check (username ~ '^[a-zA-Z0-9_-]{3,}$'),
  role       text         not null default 'staff'
               check (role in ('admin', 'manager', 'staff')),
  email      text         not null,
  phone      text         not null default '',
  created_at date         not null default current_date
);

create index if not exists idx_profiles_auth_id on profiles(auth_id);
create index if not exists idx_profiles_role    on profiles(role);

-- ── categories ────────────────────────────────────────────────────────
create table if not exists categories (
  category_id   serial  primary key,
  category_name text    unique not null,
  color         text    not null default '#94a3b8'
                          check (color ~ '^#[0-9A-Fa-f]{6}$'),
  sort_order    int     not null default 0
);

-- ── expenses ──────────────────────────────────────────────────────────
create table if not exists expenses (
  expense_id    serial          primary key,
  category_id   int             not null references categories(category_id) on delete restrict,
  amount        numeric(15, 2)  not null check (amount > 0),
  description   text            not null check (length(trim(description)) >= 2),
  expense_date  date            not null,
  created_by    text            not null,       -- display name (denormalised for speed)
  created_by_id text,                           -- auth.users.id for RLS
  created_at    timestamptz     not null default now()
);

create index if not exists idx_expenses_date        on expenses(expense_date desc);
create index if not exists idx_expenses_category    on expenses(category_id);
create index if not exists idx_expenses_created_by  on expenses(created_by_id);

-- ── revenues ──────────────────────────────────────────────────────────
create table if not exists revenues (
  revenue_id    serial          primary key,
  source        text            not null check (length(trim(source)) >= 2),
  amount        numeric(15, 2)  not null check (amount > 0),
  description   text            not null,
  revenue_date  date            not null,
  created_by    text            not null,
  created_by_id text,
  created_at    timestamptz     not null default now()
);

create index if not exists idx_revenues_date       on revenues(revenue_date desc);
create index if not exists idx_revenues_created_by on revenues(created_by_id);

-- ── budgets ───────────────────────────────────────────────────────────
create table if not exists budgets (
  budget_id     serial          primary key,
  category_id   int             not null references categories(category_id) on delete restrict,
  budget_amount numeric(15, 2)  not null check (budget_amount >= 0),
  month         smallint        not null check (month between 1 and 12),
  year          smallint        not null check (year between 2020 and 2100),
  unique (category_id, month, year)
);

create index if not exists idx_budgets_period   on budgets(year, month);
create index if not exists idx_budgets_category on budgets(category_id);

-- ── RLS role helper ───────────────────────────────────────────────────
create or replace function get_my_role()
returns text language sql security definer stable as $$
  select role from profiles where auth_id = auth.uid()::text
$$;

-- ── Enable Row Level Security ─────────────────────────────────────────
alter table profiles   enable row level security;
alter table categories enable row level security;
alter table expenses   enable row level security;
alter table revenues   enable row level security;
alter table budgets    enable row level security;

-- ── profiles policies ─────────────────────────────────────────────────
drop policy if exists "profiles_select"     on profiles;
drop policy if exists "profiles_insert"     on profiles;
drop policy if exists "profiles_update_own" on profiles;
drop policy if exists "profiles_admin_all"  on profiles;

-- Any logged-in user can read all profiles (needed for Users page)
create policy "profiles_select"
  on profiles for select
  using (auth.role() = 'authenticated');

-- Any logged-in user (or admin via Register) can insert a profile
create policy "profiles_insert"
  on profiles for insert
  with check (auth.role() = 'authenticated');

-- Users can update their own profile row
create policy "profiles_update_own"
  on profiles for update
  using (auth_id = auth.uid()::text);

-- Admin can do everything (covers update/delete of other users' profiles)
create policy "profiles_admin_all"
  on profiles for all
  using (get_my_role() = 'admin');

-- ── categories policies ───────────────────────────────────────────────
drop policy if exists "cat_select" on categories;
drop policy if exists "cat_admin"  on categories;

create policy "cat_select"
  on categories for select
  using (auth.role() = 'authenticated');

create policy "cat_admin"
  on categories for all
  using (get_my_role() = 'admin');

-- ── expenses policies ─────────────────────────────────────────────────
drop policy if exists "exp_select" on expenses;
drop policy if exists "exp_insert" on expenses;
drop policy if exists "exp_update" on expenses;
drop policy if exists "exp_delete" on expenses;

-- Staff see only their own; managers and admins see everything
create policy "exp_select"
  on expenses for select
  using (
    get_my_role() in ('admin', 'manager')
    or created_by_id = auth.uid()::text
  );

-- Any authenticated user can add an expense
create policy "exp_insert"
  on expenses for insert
  with check (auth.role() = 'authenticated');

-- Owner, manager, or admin can edit
create policy "exp_update"
  on expenses for update
  using (
    created_by_id = auth.uid()::text
    or get_my_role() in ('admin', 'manager')
  );

-- Owner, manager, or admin can delete
create policy "exp_delete"
  on expenses for delete
  using (
    created_by_id = auth.uid()::text
    or get_my_role() in ('admin', 'manager')
  );

-- ── revenues policies ─────────────────────────────────────────────────
drop policy if exists "rev_select" on revenues;
drop policy if exists "rev_insert" on revenues;
drop policy if exists "rev_update" on revenues;
drop policy if exists "rev_delete" on revenues;

create policy "rev_select"
  on revenues for select
  using (
    get_my_role() in ('admin', 'manager')
    or created_by_id = auth.uid()::text
  );

create policy "rev_insert"
  on revenues for insert
  with check (auth.role() = 'authenticated');

create policy "rev_update"
  on revenues for update
  using (
    created_by_id = auth.uid()::text
    or get_my_role() in ('admin', 'manager')
  );

create policy "rev_delete"
  on revenues for delete
  using (
    created_by_id = auth.uid()::text
    or get_my_role() in ('admin', 'manager')
  );

-- ── budgets policies ──────────────────────────────────────────────────
drop policy if exists "bud_select" on budgets;
drop policy if exists "bud_write"  on budgets;

-- All authenticated users can read budgets (staff need to see them)
create policy "bud_select"
  on budgets for select
  using (auth.role() = 'authenticated');

-- Only managers and admins can create/update/delete budgets
create policy "bud_write"
  on budgets for all
  using (get_my_role() in ('admin', 'manager'));
