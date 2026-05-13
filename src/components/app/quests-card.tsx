import { Coins, ShieldCheck, Swords, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import type { Mission } from "@/types/domain";

interface QuestsCardProps {
  missions: Mission[];
}

export function QuestsCard({ missions }: QuestsCardProps) {
  return (
    <GlassCard className="float-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-cyan-200">Daily Quests</h2>
        <Swords size={16} className="text-fuchsia-300" />
      </div>

      <div className="space-y-2">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="rounded-xl border border-white/10 bg-black/20 p-3 transition hover:border-cyan-300/40"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-white">{mission.title}</p>
              {mission.completed ? (
                <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-xs text-emerald-200">Done</span>
              ) : (
                <span className="rounded-full bg-cyan-400/20 px-2 py-1 text-xs text-cyan-100">Active</span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-cyan-100/80">
              <span className="inline-flex items-center gap-1 rounded-lg bg-cyan-400/10 px-2 py-1">
                <Trophy size={12} /> +{mission.rewardXp} XP
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-300/10 px-2 py-1">
                <Coins size={12} /> +{mission.rewardCoins}
              </span>
              {mission.rewardBadge ? (
                <span className="inline-flex items-center gap-1 rounded-lg bg-fuchsia-300/10 px-2 py-1">
                  <ShieldCheck size={12} /> {mission.rewardBadge}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
