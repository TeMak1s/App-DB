export interface IntegrationProvider {
  id:
    | "github"
    | "leetcode"
    | "hackerrank"
    | "postgresql"
    | "uptime"
    | "multiplayer";
  name: string;
  status: "planned" | "in_progress" | "ready";
  description: string;
}

export const futureIntegrations: IntegrationProvider[] = [
  {
    id: "github",
    name: "GitHub",
    status: "planned",
    description: "Track commits, PR quality, and SQL schema contributions.",
  },
  {
    id: "leetcode",
    name: "LeetCode",
    status: "planned",
    description: "Import solved database challenges and map them to XP.",
  },
  {
    id: "hackerrank",
    name: "HackerRank",
    status: "planned",
    description: "Sync SQL certificates and challenge scores.",
  },
  {
    id: "postgresql",
    name: "PostgreSQL Analyzer",
    status: "in_progress",
    description: "Inspect query plans, locks, and performance metrics.",
  },
  {
    id: "uptime",
    name: "Uptime Telemetry",
    status: "planned",
    description: "Reward reliability and alert response activity.",
  },
  {
    id: "multiplayer",
    name: "Multiplayer Arena",
    status: "planned",
    description: "Real-time guild co-op missions and ranked seasons.",
  },
];
