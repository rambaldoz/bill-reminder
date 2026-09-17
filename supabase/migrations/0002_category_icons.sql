-- Bill Tracker & Reminder — switch default category icons from emoji to
-- Tabler icon slugs (rendered client-side via @tabler/icons-react).
-- Run this once in the Supabase SQL Editor, after 0001_init.sql.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');

  insert into categories (user_id, name, color, icon, is_default)
  values
    (new.id, 'Electricity',     '#c9a227', 'bolt', true),
    (new.id, 'Water',           '#3e7cb1', 'droplet', true),
    (new.id, 'Internet',        '#7b6ca6', 'wifi', true),
    (new.id, 'Rent',            '#a9714f', 'home', true),
    (new.id, 'Groceries',       '#6b8e4e', 'shopping-cart', true),
    (new.id, 'Subscriptions',   '#b06b8f', 'repeat', true),
    (new.id, 'Transportation',  '#3e8e82', 'car', true),
    (new.id, 'Insurance',       '#5c7290', 'shield-check', true),
    (new.id, 'Other',           '#8a8578', 'receipt-2', true);

  return new;
end;
$$;

-- Backfill: update already-seeded default categories to the new icon slugs.
update categories set icon = 'bolt'           where is_default and name = 'Electricity';
update categories set icon = 'droplet'        where is_default and name = 'Water';
update categories set icon = 'wifi'           where is_default and name = 'Internet';
update categories set icon = 'home'           where is_default and name = 'Rent';
update categories set icon = 'shopping-cart'  where is_default and name = 'Groceries';
update categories set icon = 'repeat'         where is_default and name = 'Subscriptions';
update categories set icon = 'car'            where is_default and name = 'Transportation';
update categories set icon = 'shield-check'   where is_default and name = 'Insurance';
update categories set icon = 'receipt-2'      where is_default and name = 'Other';
