export type RankName =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Master"
  | "Grandmaster"
  | "Architect"
  | "Oracle";

export type TabKey = "Home" | "Skills" | "Rankings" | "Guilds" | "Profile";

export interface SkillMetric {
  label: string;
  value: number;
}

export interface PlayerProfile {
  id: string;
  nickname: string;
  avatarUrl: string;
  level: number;
  xp: number;
  xpToNext: number;
  rank: RankName;
  streakDays: number;
  hoursStudied: number;
  technologies: string[];
}

export interface Mission {
  id: string;
  title: string;
  rewardXp: number;
  rewardCoins: number;
  rewardBadge?: string;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  rarity: "Epic" | "Legendary" | "Rare";
  unlocked: boolean;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  rank: RankName;
  level: number;
  weeklyXp: number;
}

export interface Guild {
  id: string;
  name: string;
  members: number;
  region: string;
  focus: string;
}

export interface XpLog {
  id: string;
  source:
    | "create_table"
    | "optimize_query"
    | "create_index"
    | "resolve_challenge"
    | "uptime"
    | "backup"
    | "security"
    | "sql_exercise";
  value: number;
  createdAt: string;
}
