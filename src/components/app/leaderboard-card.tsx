import { Crown } from "lucide-react";
import { RankBadge } from "@/components/ui/rank-badge";
import { GlassCard } from "@/components/ui/glass-card";
import type { LeaderboardEntry } from "@/types/domain";

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardCard({ entries }: LeaderboardCardProps) {
  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-cyan-200">Weekly Global Ranking</h2>
        <Crown className="text-amber-300" size={16} />
      </div>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-3"
          >
            <div className="flex items-center gap-3">
              <span className="w-5 text-center text-sm font-bold text-cyan-200">{index + 1}</span>
              <div>
                <p className="text-sm text-white">{entry.nickname}</p>
                <p className="text-xs text-cyan-100/70">Lvl {entry.level}</p>
              </div>
            </div>
            <div className="text-right">
              <RankBadge rank={entry.rank} />
              <p className="mt-1 text-xs text-cyan-200">+{entry.weeklyXp} XP</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
