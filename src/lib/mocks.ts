import type {
  Badge,
  Guild,
  LeaderboardEntry,
  Mission,
  PlayerProfile,
  SkillMetric,
  XpLog,
} from "@/types/domain";

export const profileMock: PlayerProfile = {
  id: "user-01",
  nickname: "ByteShogun",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  level: 27,
  xp: 3120,
  xpToNext: 4200,
  rank: "Master",
  streakDays: 18,
  hoursStudied: 143,
  technologies: ["PostgreSQL", "Oracle", "MySQL", "MongoDB", "Redis"],
};

export const skillRadarMock: SkillMetric[] = [
  { label: "Performance", value: 84 },
  { label: "Security", value: 78 },
  { label: "Modeling", value: 88 },
  { label: "Scalability", value: 73 },
  { label: "Backup", value: 69 },
  { label: "Infrastructure", value: 76 },
];

export const missionsMock: Mission[] = [
  { id: "m1", title: "Optimize one query", rewardXp: 120, rewardCoins: 30, rewardBadge: "Query Master", completed: false },
  { id: "m2", title: "Normalize one table", rewardXp: 90, rewardCoins: 20, completed: true },
  { id: "m3", title: "Resolve deadlock", rewardXp: 150, rewardCoins: 35, rewardBadge: "Database Guardian", completed: false },
  { id: "m4", title: "Create one index", rewardXp: 70, rewardCoins: 15, rewardBadge: "Index Hunter", completed: false },
  { id: "m5", title: "Protect against SQL injection", rewardXp: 180, rewardCoins: 45, rewardBadge: "SQL Wizard", completed: false },
];

export const badgesMock: Badge[] = [
  { id: "b1", name: "Query Master", rarity: "Epic", unlocked: true },
  { id: "b2", name: "Index Hunter", rarity: "Rare", unlocked: true },
  { id: "b3", name: "Database Guardian", rarity: "Legendary", unlocked: false },
  { id: "b4", name: "Backup Hero", rarity: "Epic", unlocked: true },
  { id: "b5", name: "Cloud Architect", rarity: "Legendary", unlocked: false },
  { id: "b6", name: "SQL Wizard", rarity: "Epic", unlocked: true },
  { id: "b7", name: "Performance God", rarity: "Legendary", unlocked: false },
];

export const leaderboardMock: LeaderboardEntry[] = [
  { id: "l1", nickname: "IndexNova", rank: "Architect", level: 39, weeklyXp: 1580 },
  { id: "l2", nickname: "ByteShogun", rank: "Master", level: 27, weeklyXp: 1240 },
  { id: "l3", nickname: "NoSQLDrift", rank: "Grandmaster", level: 33, weeklyXp: 1190 },
  { id: "l4", nickname: "SchemaWolf", rank: "Diamond", level: 24, weeklyXp: 940 },
  { id: "l5", nickname: "DeltaMerge", rank: "Platinum", level: 21, weeklyXp: 770 },
];

export const guildsMock: Guild[] = [
  { id: "g1", name: "ACID Knights", members: 34, region: "LATAM", focus: "PostgreSQL and tuning" },
  { id: "g2", name: "Shard Hunters", members: 21, region: "Global", focus: "Scalability and distributed systems" },
  { id: "g3", name: "Backup Syndicate", members: 15, region: "EU", focus: "Recovery and resilience" },
];

export const xpLogsMock: XpLog[] = [
  { id: "x1", source: "create_table", value: 40, createdAt: "2026-05-13T08:00:00Z" },
  { id: "x2", source: "create_index", value: 70, createdAt: "2026-05-13T08:32:00Z" },
  { id: "x3", source: "optimize_query", value: 120, createdAt: "2026-05-13T10:45:00Z" },
  { id: "x4", source: "security", value: 180, createdAt: "2026-05-13T11:15:00Z" },
  { id: "x5", source: "sql_exercise", value: 50, createdAt: "2026-05-13T13:03:00Z" },
];
