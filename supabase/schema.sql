-- ============================================================
-- ViceVault v2 — Supabase Schema
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table profiles (
  id              uuid references auth.users on delete cascade primary key,
  username        text unique not null,
  display_name    text,
  age_range       text check (age_range in ('16-18', '19-22', '23-25', '25+')),
  why_here        text,
  avatar_color    text default '#e8462a',
  total_xp        int default 0,
  streak_count    int default 0,
  streak_last     date,
  ghost_days_used int default 0,
  ghost_day_reset date,
  created_at      timestamp with time zone default now()
);

-- Public read for profiles (username, display_name, xp only)
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- ============================================================
-- VILLAIN STATES
-- ============================================================
create table villain_states (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references profiles on delete cascade not null,
  villain_id   text not null,
  hp           int default 80 check (hp >= 0 and hp <= 100),
  hero_power   int default 20 check (hero_power >= 0 and hero_power <= 100),
  is_active    bool default true,
  is_defeated  bool default false,
  activated_at timestamp with time zone default now(),
  defeated_at  timestamp with time zone,
  unique(user_id, villain_id)
);

alter table villain_states enable row level security;

create policy "Users manage own villain states"
  on villain_states for all using (auth.uid() = user_id);

-- ============================================================
-- CHECKINS
-- ============================================================
create table checkins (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references profiles on delete cascade not null,
  villain_id    text not null,
  result        text not null check (result in ('win', 'slip')),
  xp_earned     int not null,
  checked_in_at timestamp with time zone default now(),
  date          date default current_date,
  unique(user_id, villain_id, date)
);

alter table checkins enable row level security;

create policy "Users manage own checkins"
  on checkins for all using (auth.uid() = user_id);

-- ============================================================
-- SUGGESTIONS
-- ============================================================
create table suggestions (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references profiles on delete cascade not null,
  villain_id   text not null,
  trigger_type text not null,
  suggested_at timestamp with time zone default now(),
  accepted     bool default false,
  dismissed    bool default false
);

alter table suggestions enable row level security;

create policy "Users manage own suggestions"
  on suggestions for all using (auth.uid() = user_id);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
create table achievements (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references profiles on delete cascade not null,
  achievement text not null,
  unlocked_at timestamp with time zone default now(),
  unique(user_id, achievement)
);

alter table achievements enable row level security;

create policy "Users manage own achievements"
  on achievements for all using (auth.uid() = user_id);

-- ============================================================
-- FUNCTION: auto-create profile on signup
-- ============================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
