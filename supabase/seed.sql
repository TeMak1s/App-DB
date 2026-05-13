-- SQL IRL / DB Rank seed data

insert into public.ranks (name, min_level, color, badge_code)
values
  ('Bronze', 1, '#cd7f32', 'B-I'),
  ('Silver', 6, '#c0d6ff', 'S-II'),
  ('Gold', 11, '#f6d365', 'G-III'),
  ('Platinum', 16, '#85f0ff', 'P-IV'),
  ('Diamond', 21, '#8ae0ff', 'D-V'),
  ('Master', 26, '#a78bfa', 'M-VI'),
  ('Grandmaster', 31, '#f472b6', 'GM-VII'),
  ('Architect', 36, '#22d3ee', 'AR-VIII'),
  ('Oracle', 41, '#f9a8d4', 'OR-IX')
on conflict (name) do update
set min_level = excluded.min_level,
    color = excluded.color,
    badge_code = excluded.badge_code;

insert into public.badges (name, rarity, icon)
values
  ('Query Master', 'Epic', 'query-master'),
  ('Index Hunter', 'Rare', 'index-hunter'),
  ('Database Guardian', 'Legendary', 'database-guardian'),
  ('Backup Hero', 'Epic', 'backup-hero'),
  ('Cloud Architect', 'Legendary', 'cloud-architect'),
  ('SQL Wizard', 'Epic', 'sql-wizard'),
  ('Performance God', 'Legendary', 'performance-god')
on conflict (name) do update
set rarity = excluded.rarity,
    icon = excluded.icon;

insert into public.guilds (name, region, focus)
values
  ('ACID Knights', 'LATAM', 'PostgreSQL and tuning'),
  ('Shard Hunters', 'Global', 'Scalability and distributed systems'),
  ('Backup Syndicate', 'EU', 'Recovery and resilience')
on conflict (name) do update
set region = excluded.region,
    focus = excluded.focus;

with master_rank as (
  select id from public.ranks where name = 'Master' limit 1
),
inserted_user as (
  insert into public.users (id, nickname, avatar_url, rank_id, level, xp, xp_to_next, streak_days, hours_studied, profile_public)
  select
    '11111111-1111-1111-1111-111111111111'::uuid,
    'ByteShogun',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    master_rank.id,
    27,
    3120,
    4200,
    18,
    143,
    true
  from master_rank
  on conflict (id) do update
  set nickname = excluded.nickname,
      avatar_url = excluded.avatar_url,
      rank_id = excluded.rank_id,
      level = excluded.level,
      xp = excluded.xp,
      xp_to_next = excluded.xp_to_next,
      streak_days = excluded.streak_days,
      hours_studied = excluded.hours_studied,
      updated_at = now()
  returning id
)
insert into public.skills (user_id, performance, security, modeling, scalability, backup, infrastructure)
select id, 84, 78, 88, 73, 69, 76 from inserted_user
on conflict (user_id) do update
set performance = excluded.performance,
    security = excluded.security,
    modeling = excluded.modeling,
    scalability = excluded.scalability,
    backup = excluded.backup,
    infrastructure = excluded.infrastructure,
    updated_at = now();

insert into public.missions (title, reward_xp, reward_coins, active)
values
  ('Optimize one query', 120, 30, true),
  ('Normalize one table', 90, 20, true),
  ('Resolve deadlock', 150, 35, true),
  ('Create one index', 70, 15, true),
  ('Protect against SQL injection', 180, 45, true)
on conflict do nothing;

insert into public.leaderboards (season, period, user_id, points, position)
values
  ('S1', 'weekly', '11111111-1111-1111-1111-111111111111'::uuid, 1240, 2)
on conflict do nothing;

insert into public.app_admins (user_id)
values ('11111111-1111-1111-1111-111111111111'::uuid)
on conflict (user_id) do nothing;
