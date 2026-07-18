-- =====================================================================
-- GreenHarvest Agri-Business Cost & Budget Monitoring System
-- Supabase Seed — Run this AFTER schema.sql
--
-- Creates 5 user accounts + all categories + 12 months of sample data
--
-- Login credentials:
-- ┌───────────────────────────────────────────┬──────────────────┬─────────┐
-- │ Email                                     │ Password         │ Role    │
-- ├───────────────────────────────────────────┼──────────────────┼─────────┤
-- │ jp.nkurunziza@greenharvest.rw             │ Admin@2025!      │ admin   │
-- │ c.uwimana@greenharvest.rw                 │ Manager@2025!    │ manager │
-- │ f.bizimana@greenharvest.rw                │ Manager@2025!    │ manager │
-- │ t.habimana@greenharvest.rw                │ Staff@2025!      │ staff   │
-- │ s.mukamana@greenharvest.rw                │ Staff@2025!      │ staff   │
-- └───────────────────────────────────────────┴──────────────────┴─────────┘
-- =====================================================================

DO $$
DECLARE
  -- Auth user UUIDs
  id_admin    uuid;
  id_claudine uuid;
  id_theo     uuid;
  id_solange  uuid;
  id_fidele   uuid;

  -- Category IDs (resolved after insert)
  cat_seeds       int;
  cat_fert        int;
  cat_labor       int;
  cat_equip       int;
  cat_transport   int;
  cat_irrigation  int;
  cat_storage     int;
  cat_admin_cat   int;
BEGIN

  -- ==================================================================
  -- SECTION 1 — AUTH USERS
  -- Creates Supabase Auth records + matching profile rows
  -- ==================================================================

  -- ── Admin: Jean-Pierre Nkurunziza ─────────────────────────────────
  id_admin := gen_random_uuid();
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', id_admin,
    'authenticated', 'authenticated',
    'jp.nkurunziza@greenharvest.rw',
    crypt('Admin@2025!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    false, '', '', '', ''
  );
  INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
  VALUES ('jp.nkurunziza@greenharvest.rw', id_admin,
    jsonb_build_object('sub', id_admin::text, 'email', 'jp.nkurunziza@greenharvest.rw'),
    'email', now(), now(), now());
  INSERT INTO profiles (auth_id, full_name, username, role, email, phone, created_at)
  VALUES (id_admin::text, 'Jean-Pierre Nkurunziza', 'admin', 'admin',
    'jp.nkurunziza@greenharvest.rw', '+250 788 100 001', '2024-01-10');

  -- ── Manager: Claudine Uwimana ─────────────────────────────────────
  id_claudine := gen_random_uuid();
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', id_claudine,
    'authenticated', 'authenticated',
    'c.uwimana@greenharvest.rw',
    crypt('Manager@2025!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    false, '', '', '', ''
  );
  INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
  VALUES ('c.uwimana@greenharvest.rw', id_claudine,
    jsonb_build_object('sub', id_claudine::text, 'email', 'c.uwimana@greenharvest.rw'),
    'email', now(), now(), now());
  INSERT INTO profiles (auth_id, full_name, username, role, email, phone, created_at)
  VALUES (id_claudine::text, 'Claudine Uwimana', 'claudine', 'manager',
    'c.uwimana@greenharvest.rw', '+250 788 200 002', '2024-01-15');

  -- ── Manager: Fidèle Bizimana ──────────────────────────────────────
  id_fidele := gen_random_uuid();
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', id_fidele,
    'authenticated', 'authenticated',
    'f.bizimana@greenharvest.rw',
    crypt('Manager@2025!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    false, '', '', '', ''
  );
  INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
  VALUES ('f.bizimana@greenharvest.rw', id_fidele,
    jsonb_build_object('sub', id_fidele::text, 'email', 'f.bizimana@greenharvest.rw'),
    'email', now(), now(), now());
  INSERT INTO profiles (auth_id, full_name, username, role, email, phone, created_at)
  VALUES (id_fidele::text, 'Fidèle Bizimana', 'fidele', 'manager',
    'f.bizimana@greenharvest.rw', '+250 788 500 005', '2024-03-05');

  -- ── Staff: Théodore Habimana ──────────────────────────────────────
  id_theo := gen_random_uuid();
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', id_theo,
    'authenticated', 'authenticated',
    't.habimana@greenharvest.rw',
    crypt('Staff@2025!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    false, '', '', '', ''
  );
  INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
  VALUES ('t.habimana@greenharvest.rw', id_theo,
    jsonb_build_object('sub', id_theo::text, 'email', 't.habimana@greenharvest.rw'),
    'email', now(), now(), now());
  INSERT INTO profiles (auth_id, full_name, username, role, email, phone, created_at)
  VALUES (id_theo::text, 'Théodore Habimana', 'theo', 'staff',
    't.habimana@greenharvest.rw', '+250 788 300 003', '2024-02-01');

  -- ── Staff: Solange Mukamana ───────────────────────────────────────
  id_solange := gen_random_uuid();
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', id_solange,
    'authenticated', 'authenticated',
    's.mukamana@greenharvest.rw',
    crypt('Staff@2025!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    false, '', '', '', ''
  );
  INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
  VALUES ('s.mukamana@greenharvest.rw', id_solange,
    jsonb_build_object('sub', id_solange::text, 'email', 's.mukamana@greenharvest.rw'),
    'email', now(), now(), now());
  INSERT INTO profiles (auth_id, full_name, username, role, email, phone, created_at)
  VALUES (id_solange::text, 'Solange Mukamana', 'solange', 'staff',
    's.mukamana@greenharvest.rw', '+250 788 400 004', '2024-02-20');


  -- ==================================================================
  -- SECTION 2 — CATEGORIES
  -- 8 standard agri-business expense categories
  -- ==================================================================
  INSERT INTO categories (category_name, color, sort_order) VALUES
    ('Seeds & Planting Material', '#2d8a4e', 1),
    ('Fertilizers & Chemicals',   '#f59e0b', 2),
    ('Labor & Wages',             '#3b82f6', 3),
    ('Equipment & Machinery',     '#8b5cf6', 4),
    ('Transport & Logistics',     '#ef4444', 5),
    ('Irrigation & Water',        '#06b6d4', 6),
    ('Storage & Packaging',       '#f97316', 7),
    ('Administrative',            '#6b7280', 8)
  ON CONFLICT (category_name) DO NOTHING;

  SELECT category_id INTO cat_seeds       FROM categories WHERE category_name = 'Seeds & Planting Material';
  SELECT category_id INTO cat_fert        FROM categories WHERE category_name = 'Fertilizers & Chemicals';
  SELECT category_id INTO cat_labor       FROM categories WHERE category_name = 'Labor & Wages';
  SELECT category_id INTO cat_equip       FROM categories WHERE category_name = 'Equipment & Machinery';
  SELECT category_id INTO cat_transport   FROM categories WHERE category_name = 'Transport & Logistics';
  SELECT category_id INTO cat_irrigation  FROM categories WHERE category_name = 'Irrigation & Water';
  SELECT category_id INTO cat_storage     FROM categories WHERE category_name = 'Storage & Packaging';
  SELECT category_id INTO cat_admin_cat   FROM categories WHERE category_name = 'Administrative';


  -- ==================================================================
  -- SECTION 3 — EXPENSES  (12 months: Jul 2024 – Jun 2025)
  -- ==================================================================

  -- July 2024
  INSERT INTO expenses (category_id, amount, description, expense_date, created_by, created_by_id) VALUES
    (cat_seeds,       380000, 'Maize seeds — 40 kg bags × 20',              '2024-07-03', 'Théodore Habimana',      id_theo::text),
    (cat_labor,       720000, 'Land preparation team — 36 workers, 10 days','2024-07-08', 'Claudine Uwimana',       id_claudine::text),
    (cat_fert,        290000, 'Urea fertilizer — 15 bags × 50 kg',          '2024-07-14', 'Théodore Habimana',      id_theo::text),
    (cat_irrigation,   85000, 'Water pump fuel — July',                     '2024-07-20', 'Fidèle Bizimana',        id_fidele::text);

  -- August 2024
  INSERT INTO expenses (category_id, amount, description, expense_date, created_by, created_by_id) VALUES
    (cat_labor,       680000, 'Planting labor — 34 workers, 10 days',       '2024-08-05', 'Claudine Uwimana',       id_claudine::text),
    (cat_transport,   160000, 'Truck rental — input delivery to farm',      '2024-08-12', 'Fidèle Bizimana',        id_fidele::text),
    (cat_fert,        245000, 'DAP fertilizer — top dressing',              '2024-08-19', 'Théodore Habimana',      id_theo::text),
    (cat_admin_cat,   175000, 'Staff allowances — August',                  '2024-08-28', 'Solange Mukamana',       id_solange::text);

  -- September 2024
  INSERT INTO expenses (category_id, amount, description, expense_date, created_by, created_by_id) VALUES
    (cat_fert,        360000, 'Pesticide spray — fall armyworm control',    '2024-09-04', 'Théodore Habimana',      id_theo::text),
    (cat_labor,       840000, 'Weeding team — 42 workers, 10 days',         '2024-09-10', 'Claudine Uwimana',       id_claudine::text),
    (cat_irrigation,  110000, 'Drip line repair and maintenance',           '2024-09-17', 'Théodore Habimana',      id_theo::text),
    (cat_storage,     130000, 'Polypropylene sacks — 400 units',            '2024-09-24', 'Solange Mukamana',       id_solange::text);

  -- October 2024
  INSERT INTO expenses (category_id, amount, description, expense_date, created_by, created_by_id) VALUES
    (cat_labor,       920000, 'Harvest team — 46 workers, 10 days',         '2024-10-02', 'Claudine Uwimana',       id_claudine::text),
    (cat_transport,   195000, 'Post-harvest delivery — Kigali market',      '2024-10-09', 'Fidèle Bizimana',        id_fidele::text),
    (cat_equip,       540000, 'Combine harvester rental — 2 days',          '2024-10-15', 'Jean-Pierre Nkurunziza', id_admin::text),
    (cat_storage,     165000, 'Cold storage rental — October',              '2024-10-22', 'Solange Mukamana',       id_solange::text);

  -- November 2024
  INSERT INTO expenses (category_id, amount, description, expense_date, created_by, created_by_id) VALUES
    (cat_seeds,       310000, 'Potato seed — Kinigi variety, 200 kg',       '2024-11-04', 'Théodore Habimana',      id_theo::text),
    (cat_labor,       750000, 'Second season planting — 38 workers',        '2024-11-11', 'Claudine Uwimana',       id_claudine::text),
    (cat_fert,        280000, 'CAN fertilizer — 14 bags',                   '2024-11-18', 'Théodore Habimana',      id_theo::text),
    (cat_admin_cat,   210000, 'Office supplies & stationery Q4',            '2024-11-25', 'Solange Mukamana',       id_solange::text);

  -- December 2024
  INSERT INTO expenses (category_id, amount, description, expense_date, created_by, created_by_id) VALUES
    (cat_equip,      1350000, 'Tractor annual service & spare parts',       '2024-12-03', 'Jean-Pierre Nkurunziza', id_admin::text),
    (cat_irrigation,   95000, 'Irrigation system Q4 maintenance',           '2024-12-10', 'Fidèle Bizimana',        id_fidele::text),
    (cat_transport,   230000, 'Year-end delivery — Musanze wholesale',      '2024-12-17', 'Fidèle Bizimana',        id_fidele::text),
    (cat_admin_cat,   320000, 'Year-end staff bonuses & allowances',        '2024-12-28', 'Claudine Uwimana',       id_claudine::text);

  -- January 2025
  INSERT INTO expenses (category_id, amount, description, expense_date, created_by, created_by_id) VALUES
    (cat_seeds,       450000, 'Maize seeds — 50 kg bags × 30',              '2025-01-05', 'Théodore Habimana',      id_theo::text),
    (cat_labor,       820000, 'Seasonal field workers — 41 workers, 10 days','2025-01-12','Claudine Uwimana',       id_claudine::text),
    (cat_fert,        310000, 'NPK fertilizer — 20 bags of 50 kg',          '2025-01-18', 'Théodore Habimana',      id_theo::text),
    (cat_irrigation,   95000, 'Drip irrigation maintenance Q1',             '2025-01-25', 'Fidèle Bizimana',        id_fidele::text);

  -- February 2025
  INSERT INTO expenses (category_id, amount, description, expense_date, created_by, created_by_id) VALUES
    (cat_transport,   180000, 'Truck hire — Kigali market delivery',        '2025-02-03', 'Claudine Uwimana',       id_claudine::text),
    (cat_seeds,       280000, 'Bean seeds — Climber variety',               '2025-02-08', 'Théodore Habimana',      id_theo::text),
    (cat_labor,       750000, 'Harvesting team — 50 workers, 3 weeks',      '2025-02-14', 'Claudine Uwimana',       id_claudine::text),
    (cat_equip,      1200000, 'Tractor servicing & spare parts',            '2025-02-20', 'Jean-Pierre Nkurunziza', id_admin::text),
    (cat_storage,     145000, 'Jute sacks — 500 units',                     '2025-02-26', 'Solange Mukamana',       id_solange::text);

  -- March 2025
  INSERT INTO expenses (category_id, amount, description, expense_date, created_by, created_by_id) VALUES
    (cat_admin_cat,   200000, 'Office supplies & stationery Q1',            '2025-03-02', 'Solange Mukamana',       id_solange::text),
    (cat_fert,        390000, 'Pesticides — fungicide & insecticide',       '2025-03-10', 'Théodore Habimana',      id_theo::text),
    (cat_transport,   220000, 'Transport to Musanze wholesale market',      '2025-03-15', 'Fidèle Bizimana',        id_fidele::text);

  -- April 2025
  INSERT INTO expenses (category_id, amount, description, expense_date, created_by, created_by_id) VALUES
    (cat_labor,       680000, 'Planting team wages — April',                '2025-04-02', 'Claudine Uwimana',       id_claudine::text),
    (cat_irrigation,  115000, 'Water pumping costs — dry season',           '2025-04-10', 'Théodore Habimana',      id_theo::text),
    (cat_seeds,       320000, 'Sorghum seeds — 400 kg',                     '2025-04-18', 'Théodore Habimana',      id_theo::text);

  -- May 2025
  INSERT INTO expenses (category_id, amount, description, expense_date, created_by, created_by_id) VALUES
    (cat_storage,     190000, 'Cold storage rental — 2 months',             '2025-05-01', 'Solange Mukamana',       id_solange::text),
    (cat_equip,       450000, 'Water pump replacement',                     '2025-05-12', 'Jean-Pierre Nkurunziza', id_admin::text),
    (cat_fert,        275000, 'Lime application — soil pH correction',      '2025-05-20', 'Théodore Habimana',      id_theo::text);

  -- June 2025
  INSERT INTO expenses (category_id, amount, description, expense_date, created_by, created_by_id) VALUES
    (cat_labor,       900000, 'Weeding & maintenance labor — May/Jun',      '2025-06-05', 'Claudine Uwimana',       id_claudine::text),
    (cat_transport,   260000, 'Fuel expenses — delivery trucks',            '2025-06-14', 'Fidèle Bizimana',        id_fidele::text),
    (cat_admin_cat,   185000, 'Internet & utilities — June',                '2025-06-28', 'Solange Mukamana',       id_solange::text);


  -- ==================================================================
  -- SECTION 4 — REVENUES  (12 months: Jul 2024 – Jun 2025)
  -- ==================================================================

  -- July 2024
  INSERT INTO revenues (source, amount, description, revenue_date, created_by, created_by_id) VALUES
    ('Maize Sales — Kigali Market',    1500000, '750 kg at RWF 2,000/kg',           '2024-07-18', 'Claudine Uwimana',       id_claudine::text),
    ('Government Subsidy — Season A',   400000, 'MINAGRI seasonal input support',   '2024-07-25', 'Jean-Pierre Nkurunziza', id_admin::text);

  -- August 2024
  INSERT INTO revenues (source, amount, description, revenue_date, created_by, created_by_id) VALUES
    ('Bean Sales — Musanze',            820000, '328 kg premium climbing beans',    '2024-08-07', 'Théodore Habimana',      id_theo::text),
    ('Vegetable Sales',                 450000, 'Tomatoes & pepper — local market', '2024-08-20', 'Solange Mukamana',       id_solange::text);

  -- September 2024
  INSERT INTO revenues (source, amount, description, revenue_date, created_by, created_by_id) VALUES
    ('Maize Sales — Export',           2100000, '1,050 kg to Uganda buyer',         '2024-09-12', 'Claudine Uwimana',       id_claudine::text),
    ('Sorghum Sales',                   980000, '490 kg — Bralirwa brewery',         '2024-09-22', 'Fidèle Bizimana',        id_fidele::text);

  -- October 2024
  INSERT INTO revenues (source, amount, description, revenue_date, created_by, created_by_id) VALUES
    ('Maize Sales — Rwamagana',        1420000, '710 kg to cooperative',            '2024-10-05', 'Claudine Uwimana',       id_claudine::text),
    ('Potato Sales',                    880000, '440 kg Irish potato',              '2024-10-14', 'Théodore Habimana',      id_theo::text),
    ('Crop Insurance Payout',           250000, 'Q3 drought partial compensation',  '2024-10-28', 'Jean-Pierre Nkurunziza', id_admin::text);

  -- November 2024
  INSERT INTO revenues (source, amount, description, revenue_date, created_by, created_by_id) VALUES
    ('Bean Sales — NGO Procurement',   1100000, 'WFP local food procurement',       '2024-11-06', 'Jean-Pierre Nkurunziza', id_admin::text),
    ('Vegetable Sales',                 510000, 'Cabbage & carrot — weekly market', '2024-11-19', 'Solange Mukamana',       id_solange::text);

  -- December 2024
  INSERT INTO revenues (source, amount, description, revenue_date, created_by, created_by_id) VALUES
    ('Sorghum Sales — Export',         1280000, '640 kg to Kenya buyer',            '2024-12-04', 'Fidèle Bizimana',        id_fidele::text),
    ('Consulting / Training Income',    300000, 'Farmer group training — Dec',      '2024-12-15', 'Jean-Pierre Nkurunziza', id_admin::text),
    ('Maize Sales — Kigali Market',    1650000, '825 kg maize grain',               '2024-12-29', 'Claudine Uwimana',       id_claudine::text);

  -- January 2025
  INSERT INTO revenues (source, amount, description, revenue_date, created_by, created_by_id) VALUES
    ('Maize Sales — Kigali Market',    1800000, '900 kg at RWF 2,000/kg',           '2025-01-22', 'Claudine Uwimana',       id_claudine::text),
    ('Government Subsidy — Q1',         500000, 'MINAGRI Q1 crop support grant',    '2025-01-30', 'Jean-Pierre Nkurunziza', id_admin::text);

  -- February 2025
  INSERT INTO revenues (source, amount, description, revenue_date, created_by, created_by_id) VALUES
    ('Bean Sales — Musanze',            950000, '380 kg premium beans',             '2025-02-05', 'Théodore Habimana',      id_theo::text),
    ('Maize Sales — Export',           2400000, '1,200 kg to Uganda buyer',         '2025-02-28', 'Claudine Uwimana',       id_claudine::text);

  -- March 2025
  INSERT INTO revenues (source, amount, description, revenue_date, created_by, created_by_id) VALUES
    ('Vegetable Sales',                 680000, 'Tomatoes & onions — local market', '2025-03-08', 'Solange Mukamana',       id_solange::text),
    ('Sorghum Sales',                  1100000, '550 kg — Bralirwa brewery',         '2025-03-18', 'Fidèle Bizimana',        id_fidele::text),
    ('Bean Sales — Kigali',             760000, '304 kg climbing beans',            '2025-03-25', 'Claudine Uwimana',       id_claudine::text);

  -- April 2025
  INSERT INTO revenues (source, amount, description, revenue_date, created_by, created_by_id) VALUES
    ('Crop Insurance Payout',           300000, 'Partial drought compensation',     '2025-04-05', 'Jean-Pierre Nkurunziza', id_admin::text),
    ('Maize Sales — Rwamagana',        1550000, '775 kg to cooperative buyers',     '2025-04-20', 'Claudine Uwimana',       id_claudine::text),
    ('Potato Sales',                    920000, '460 kg Irish potato',              '2025-04-28', 'Théodore Habimana',      id_theo::text);

  -- May 2025
  INSERT INTO revenues (source, amount, description, revenue_date, created_by, created_by_id) VALUES
    ('Vegetable Sales',                 540000, 'Cabbage & carrot — weekly market', '2025-05-06', 'Solange Mukamana',       id_solange::text),
    ('Sorghum Sales — Export',         1350000, '675 kg to Kenya buyer',            '2025-05-16', 'Fidèle Bizimana',        id_fidele::text),
    ('Maize Sales — Kigali Market',    1700000, '850 kg maize grain',               '2025-05-24', 'Claudine Uwimana',       id_claudine::text);

  -- June 2025
  INSERT INTO revenues (source, amount, description, revenue_date, created_by, created_by_id) VALUES
    ('Bean Sales — NGO Procurement',   1200000, 'WFP local food procurement',       '2025-06-02', 'Jean-Pierre Nkurunziza', id_admin::text),
    ('Consulting / Training Income',    250000, 'Farmer training facilitation',     '2025-06-12', 'Jean-Pierre Nkurunziza', id_admin::text),
    ('Maize Sales — Kigali Market',    1480000, '740 kg at RWF 2,000/kg',           '2025-06-27', 'Claudine Uwimana',       id_claudine::text);


  -- ==================================================================
  -- SECTION 5 — BUDGETS  (12 months: Jul 2024 – Jun 2025)
  -- ==================================================================

  -- July 2024
  INSERT INTO budgets (category_id, budget_amount, month, year) VALUES
    (cat_seeds,        400000,  7, 2024),
    (cat_labor,        750000,  7, 2024),
    (cat_fert,         300000,  7, 2024),
    (cat_irrigation,    90000,  7, 2024),
    (cat_transport,    170000,  7, 2024)
  ON CONFLICT (category_id, month, year) DO NOTHING;

  -- August 2024
  INSERT INTO budgets (category_id, budget_amount, month, year) VALUES
    (cat_labor,        700000,  8, 2024),
    (cat_transport,    170000,  8, 2024),
    (cat_fert,         260000,  8, 2024),
    (cat_admin_cat,    180000,  8, 2024)
  ON CONFLICT (category_id, month, year) DO NOTHING;

  -- September 2024
  INSERT INTO budgets (category_id, budget_amount, month, year) VALUES
    (cat_fert,         380000,  9, 2024),
    (cat_labor,        880000,  9, 2024),
    (cat_irrigation,   120000,  9, 2024),
    (cat_storage,      140000,  9, 2024)
  ON CONFLICT (category_id, month, year) DO NOTHING;

  -- October 2024
  INSERT INTO budgets (category_id, budget_amount, month, year) VALUES
    (cat_labor,        900000, 10, 2024),
    (cat_transport,    200000, 10, 2024),
    (cat_equip,        600000, 10, 2024),
    (cat_storage,      180000, 10, 2024)
  ON CONFLICT (category_id, month, year) DO NOTHING;

  -- November 2024
  INSERT INTO budgets (category_id, budget_amount, month, year) VALUES
    (cat_seeds,        330000, 11, 2024),
    (cat_labor,        780000, 11, 2024),
    (cat_fert,         300000, 11, 2024),
    (cat_admin_cat,    220000, 11, 2024)
  ON CONFLICT (category_id, month, year) DO NOTHING;

  -- December 2024
  INSERT INTO budgets (category_id, budget_amount, month, year) VALUES
    (cat_equip,       1400000, 12, 2024),
    (cat_irrigation,   100000, 12, 2024),
    (cat_transport,    250000, 12, 2024),
    (cat_admin_cat,    300000, 12, 2024)
  ON CONFLICT (category_id, month, year) DO NOTHING;

  -- January 2025
  INSERT INTO budgets (category_id, budget_amount, month, year) VALUES
    (cat_seeds,        500000,  1, 2025),
    (cat_labor,        850000,  1, 2025),
    (cat_fert,         330000,  1, 2025),
    (cat_irrigation,   100000,  1, 2025),
    (cat_transport,    190000,  1, 2025),
    (cat_admin_cat,    200000,  1, 2025)
  ON CONFLICT (category_id, month, year) DO NOTHING;

  -- February 2025
  INSERT INTO budgets (category_id, budget_amount, month, year) VALUES
    (cat_transport,    200000,  2, 2025),
    (cat_seeds,        300000,  2, 2025),
    (cat_labor,        800000,  2, 2025),
    (cat_equip,       1300000,  2, 2025),
    (cat_storage,      160000,  2, 2025)
  ON CONFLICT (category_id, month, year) DO NOTHING;

  -- March 2025
  INSERT INTO budgets (category_id, budget_amount, month, year) VALUES
    (cat_admin_cat,    210000,  3, 2025),
    (cat_fert,         410000,  3, 2025),
    (cat_transport,    240000,  3, 2025)
  ON CONFLICT (category_id, month, year) DO NOTHING;

  -- April 2025
  INSERT INTO budgets (category_id, budget_amount, month, year) VALUES
    (cat_labor,        720000,  4, 2025),
    (cat_irrigation,   120000,  4, 2025),
    (cat_seeds,        350000,  4, 2025)
  ON CONFLICT (category_id, month, year) DO NOTHING;

  -- May 2025
  INSERT INTO budgets (category_id, budget_amount, month, year) VALUES
    (cat_storage,      200000,  5, 2025),
    (cat_equip,        500000,  5, 2025),
    (cat_fert,         290000,  5, 2025)
  ON CONFLICT (category_id, month, year) DO NOTHING;

  -- June 2025
  INSERT INTO budgets (category_id, budget_amount, month, year) VALUES
    (cat_labor,        950000,  6, 2025),
    (cat_transport,    280000,  6, 2025),
    (cat_admin_cat,    200000,  6, 2025)
  ON CONFLICT (category_id, month, year) DO NOTHING;

END;
$$;
