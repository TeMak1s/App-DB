-- SQL IRL / DB Rank Supabase schema (PostgreSQL)

create extension if not exists pgcrypto;

create table if not exists public.ranks (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  min_level int not null,
  color text not null,
  badge_code text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  nickname text not null unique,
  avatar_url text,
  rank_id uuid references public.ranks(id),
  level int not null default 1,
  xp int not null default 0,
  xp_to_next int not null default 1000,
  streak_days int not null default 0,
  hours_studied numeric(10,2) not null default 0,
  profile_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  performance int not null default 0,
  security int not null default 0,
  modeling int not null default 0,
  scalability int not null default 0,
  backup int not null default 0,
  infrastructure int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  rarity text not null,
  icon text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id),
  unlocked_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  reward_xp int not null,
  reward_coins int not null,
  reward_badge_id uuid references public.badges(id),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  mission_id uuid not null references public.missions(id),
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.guilds (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  region text,
  focus text,
  created_at timestamptz not null default now()
);

create table if not exists public.guild_members (
  id uuid primary key default gen_random_uuid(),
  guild_id uuid not null references public.guilds(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  unique (guild_id, user_id)
);

create table if not exists public.leaderboards (
  id uuid primary key default gen_random_uuid(),
  season text not null,
  period text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  points int not null default 0,
  position int,
  created_at timestamptz not null default now()
);

create table if not exists public.xp_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  source text not null,
  value int not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Future-ready integration tables
create table if not exists public.external_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  provider text not null,
  external_user_id text not null,
  access_token text,
  refresh_token text,
  linked_at timestamptz not null default now(),
  unique (provider, external_user_id)
);

create table if not exists public.telemetry_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  source text not null,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.app_admins (
  user_id uuid primary key,
  granted_at timestamptz not null default now()
);

create index if not exists idx_users_rank_id on public.users(rank_id);
create index if not exists idx_skills_user_id on public.skills(user_id);
create unique index if not exists idx_skills_unique_user on public.skills(user_id);
create index if not exists idx_quests_user_id on public.quests(user_id);
create index if not exists idx_leaderboards_period on public.leaderboards(period);
create index if not exists idx_xp_logs_user_id on public.xp_logs(user_id);

create or replace function public.increment_user_xp(p_user_id uuid, p_gain int)
returns void
language plpgsql
security definer
as $$
begin
  update public.users
  set xp = xp + greatest(p_gain, 0),
      updated_at = now()
  where id = p_user_id;
end;
$$;

create or replace function public.admin_reset_weekly_leaderboard()
returns void
language plpgsql
security definer
as $$
begin
  if not exists (select 1 from public.app_admins where user_id = auth.uid()) then
    raise exception 'not authorized';
  end if;

  update public.leaderboards
  set points = 0,
      position = null
  where period = 'weekly';
end;
$$;

create or replace function public.admin_recalculate_weekly_positions()
returns void
language plpgsql
security definer
as $$
begin
  if not exists (select 1 from public.app_admins where user_id = auth.uid()) then
    raise exception 'not authorized';
  end if;

  with ranked as (
    select id, row_number() over (order by points desc, created_at asc) as new_position
    from public.leaderboards
    where period = 'weekly'
  )
  update public.leaderboards l
  set position = r.new_position
  from ranked r
  where l.id = r.id;
end;
$$;

create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.app_admins
    where user_id = auth.uid()
  );
$$;

alter table public.users enable row level security;
alter table public.skills enable row level security;
alter table public.user_badges enable row level security;
alter table public.quests enable row level security;
alter table public.guild_members enable row level security;
alter table public.xp_logs enable row level security;
alter table public.external_accounts enable row level security;
alter table public.telemetry_events enable row level security;
alter table public.leaderboards enable row level security;
alter table public.missions enable row level security;
alter table public.badges enable row level security;
alter table public.ranks enable row level security;
alter table public.guilds enable row level security;
alter table public.app_admins enable row level security;

drop policy if exists users_self_select on public.users;
create policy users_self_select on public.users
for select using (auth.uid() = id);

drop policy if exists users_self_update on public.users;
create policy users_self_update on public.users
for update using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists users_self_insert on public.users;
create policy users_self_insert on public.users
for insert with check (auth.uid() = id);

drop policy if exists skills_self_select on public.skills;
create policy skills_self_select on public.skills
for select using (auth.uid() = user_id);

drop policy if exists skills_self_insert on public.skills;
create policy skills_self_insert on public.skills
for insert with check (auth.uid() = user_id);

drop policy if exists skills_self_update on public.skills;
create policy skills_self_update on public.skills
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists user_badges_self_select on public.user_badges;
create policy user_badges_self_select on public.user_badges
for select using (auth.uid() = user_id);

drop policy if exists xp_logs_self_select on public.xp_logs;
create policy xp_logs_self_select on public.xp_logs
for select using (auth.uid() = user_id);

drop policy if exists xp_logs_self_insert on public.xp_logs;
create policy xp_logs_self_insert on public.xp_logs
for insert with check (auth.uid() = user_id);

drop policy if exists quests_self_select on public.quests;
create policy quests_self_select on public.quests
for select using (auth.uid() = user_id);

drop policy if exists quests_self_insert on public.quests;
create policy quests_self_insert on public.quests
for insert with check (auth.uid() = user_id);

drop policy if exists quests_self_update on public.quests;
create policy quests_self_update on public.quests
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists guild_members_self_select on public.guild_members;
create policy guild_members_self_select on public.guild_members
for select using (auth.uid() = user_id);

drop policy if exists external_accounts_self_select on public.external_accounts;
create policy external_accounts_self_select on public.external_accounts
for select using (auth.uid() = user_id);

drop policy if exists external_accounts_self_insert on public.external_accounts;
create policy external_accounts_self_insert on public.external_accounts
for insert with check (auth.uid() = user_id);

drop policy if exists telemetry_self_select on public.telemetry_events;
create policy telemetry_self_select on public.telemetry_events
for select using (auth.uid() = user_id);

drop policy if exists telemetry_self_insert on public.telemetry_events;
create policy telemetry_self_insert on public.telemetry_events
for insert with check (auth.uid() = user_id);

drop policy if exists leaderboards_public_select on public.leaderboards;
create policy leaderboards_public_select on public.leaderboards
for select using (true);

drop policy if exists leaderboards_admin_write on public.leaderboards;
create policy leaderboards_admin_write on public.leaderboards
for all using (exists (select 1 from public.app_admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.app_admins a where a.user_id = auth.uid()));

drop policy if exists missions_public_select on public.missions;
create policy missions_public_select on public.missions
for select using (true);

drop policy if exists badges_public_select on public.badges;
create policy badges_public_select on public.badges
for select using (true);

drop policy if exists ranks_public_select on public.ranks;
create policy ranks_public_select on public.ranks
for select using (true);

drop policy if exists guilds_public_select on public.guilds;
create policy guilds_public_select on public.guilds
for select using (true);

drop policy if exists app_admins_self_select on public.app_admins;
create policy app_admins_self_select on public.app_admins
for select using (auth.uid() = user_id);
