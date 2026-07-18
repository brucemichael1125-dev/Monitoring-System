-- =====================================================================
-- GreenHarvest — RESET SCRIPT
-- WARNING: Deletes ALL data. Run only in development / testing.
-- After this, re-run schema.sql then seed.sql to start fresh.
-- =====================================================================

-- Remove data tables (cascades to FK dependants)
drop table if exists budgets   cascade;
drop table if exists expenses  cascade;
drop table if exists revenues  cascade;
drop table if exists categories cascade;
drop table if exists profiles  cascade;

-- Remove helper function
drop function if exists get_my_role();

-- Remove all seeded auth users
-- (replace emails with your actual list if you added extra accounts)
delete from auth.users where email in (
  'jp.nkurunziza@greenharvest.rw',
  'c.uwimana@greenharvest.rw',
  'f.bizimana@greenharvest.rw',
  't.habimana@greenharvest.rw',
  's.mukamana@greenharvest.rw'
);
