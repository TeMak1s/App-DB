import type { RankName } from "@/types/domain";

export const rankStyles: Record<
  RankName,
  {
    color: string;
    glow: string;
    badge: string;
  }
> = {
  Bronze: { color: "#cd7f32", glow: "rgba(205,127,50,0.45)", badge: "B-I" },
  Silver: { color: "#c0d6ff", glow: "rgba(192,214,255,0.45)", badge: "S-II" },
  Gold: { color: "#f6d365", glow: "rgba(246,211,101,0.45)", badge: "G-III" },
  Platinum: { color: "#85f0ff", glow: "rgba(133,240,255,0.45)", badge: "P-IV" },
  Diamond: { color: "#8ae0ff", glow: "rgba(138,224,255,0.5)", badge: "D-V" },
  Master: { color: "#a78bfa", glow: "rgba(167,139,250,0.5)", badge: "M-VI" },
  Grandmaster: { color: "#f472b6", glow: "rgba(244,114,182,0.5)", badge: "GM-VII" },
  Architect: { color: "#22d3ee", glow: "rgba(34,211,238,0.55)", badge: "AR-VIII" },
  Oracle: { color: "#f9a8d4", glow: "rgba(249,168,212,0.6)", badge: "OR-IX" },
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
