-- Bill Tracker & Reminder — initial schema (PRD §7)
-- Run this once in the Supabase SQL Editor (or via `supabase db push`
-- once the project is linked to the CLI).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  default_currency text not null default 'AED',
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  color text not null,
  icon text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  title text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'AED',
  due_date date not null,
  recurrence text not null default 'none'
    check (recurrence in ('none', 'weekly', 'monthly', 'yearly')),
  status text not null default 'upcoming'
    check (status in ('upcoming', 'due_soon', 'overdue', 'paid')),
  reminder_offset_days int not null default 3,
  notes text,
  paid_at timestamptz,
  parent_bill_id uuid references bills(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bills_user_due_date_idx on bills (user_id, due_date);
create index if not exists bills_user_status_idx on bills (user_id, status);
create index if not exists categories_user_idx on categories (user_id);

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bills_set_updated_at on bills;
create trigger bills_set_updated_at
  before update on bills
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- New user provisioning: create a profile row and seed default categories
-- ---------------------------------------------------------------------------

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
    (new.id, 'Electricity',     '#c9a227', '⚡', true),
    (new.id, 'Water',           '#3e7cb1', '💧', true),
    (new.id, 'Internet',        '#7b6ca6', '📶', true),
    (new.id, 'Rent',            '#a9714f', '🏠', true),
    (new.id, 'Groceries',       '#6b8e4e', '🛒', true),
    (new.id, 'Subscriptions',   '#b06b8f', '🔁', true),
    (new.id, 'Transportation',  '#3e8e82', '🚗', true),
    (new.id, 'Insurance',       '#5c7290', '🛡️', true),
    (new.id, 'Other',           '#8a8578', '🧾', true);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();

-- Backfill: provision any users who signed up before this migration ran.
insert into profiles (id, display_name)
select u.id, u.raw_user_meta_data ->> 'display_name'
from auth.users u
left join profiles p on p.id = u.id
where p.id is null;

insert into categories (user_id, name, color, icon, is_default)
select p.id, d.name, d.color, d.icon, true
from profiles p
cross join (values
  ('Electricity',    '#c9a227', '⚡'),
  ('Water',          '#3e7cb1', '💧'),
  ('Internet',       '#7b6ca6', '📶'),
  ('Rent',           '#a9714f', '🏠'),
  ('Groceries',      '#6b8e4e', '🛒'),
  ('Subscriptions',  '#b06b8f', '🔁'),
  ('Transportation', '#3e8e82', '🚗'),
  ('Insurance',      '#5c7290', '🛡️'),
  ('Other',          '#8a8578', '🧾')
) as d(name, color, icon)
where not exists (
  select 1 from categories c where c.user_id = p.id and c.is_default
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table profiles enable row level security;
alter table categories enable row level security;
alter table bills enable row level security;
alter table push_subscriptions enable row level security;

drop policy if exists "own profile" on profiles;
create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own categories" on categories;
create policy "own categories" on categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own bills" on bills;
create policy "own bills" on bills
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own push subscriptions" on push_subscriptions;
create policy "own push subscriptions" on push_subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
