import type { RankName } from "@/types/domain";

export const rankStyles: Record<
  RankName,
  {
    color: string;
    glow: string;
    badge: string;
  }
> = {
  Bronze: { color: "#f8f8f8", glow: "rgba(255,255,255,0.12)", badge: "B-I" },
  Silver: { color: "#e6e6e6", glow: "rgba(255,255,255,0.12)", badge: "S-II" },
  Gold: { color: "#fff1a8", glow: "rgba(243,214,92,0.2)", badge: "G-III" },
  Platinum: { color: "#ffffff", glow: "rgba(255,255,255,0.12)", badge: "P-IV" },
  Diamond: { color: "#ffb3b3", glow: "rgba(255,59,48,0.2)", badge: "D-V" },
  Master: { color: "#ffffff", glow: "rgba(255,255,255,0.12)", badge: "M-VI" },
  Grandmaster: { color: "#ff8a8a", glow: "rgba(255,59,48,0.18)", badge: "GM-VII" },
  Architect: { color: "#fff1a8", glow: "rgba(243,214,92,0.2)", badge: "AR-VIII" },
  Oracle: { color: "#ffffff", glow: "rgba(255,255,255,0.12)", badge: "OR-IX" },
};

export const rankOrder: RankName[] = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Master",
  "Grandmaster",
  "Architect",
  "Oracle",
];

export function xpProgress(xp: number, xpToNext: number) {
  if (xpToNext <= 0) {
    return 100;
  }
  return Math.min(100, Math.round((xp / xpToNext) * 100));
}
