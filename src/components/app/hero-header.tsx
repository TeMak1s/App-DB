import Image from "next/image";
import { memo } from "react";
import { Sparkles, Zap } from "lucide-react";
import { RankBadge } from "@/components/ui/rank-badge";
import { NeonProgress } from "@/components/ui/neon-progress";
import { xpProgress } from "@/lib/rank-system";
import type { PlayerProfile } from "@/types/domain";

interface HeroHeaderProps {
  profile: PlayerProfile;
  onGainXp: () => void;
}

function HeroHeaderComponent({ profile, onGainXp }: HeroHeaderProps) {
  const progress = xpProgress(profile.xp, profile.xpToNext);

  return (
    <section className="glass-panel neon-border scanline relative overflow-hidden rounded-3xl p-4 md:p-6">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-cyan-300/50">
              <Image src={profile.avatarUrl} alt={profile.nickname} fill sizes="56px" className="object-cover" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300/80">SQL IRL Operative</p>
              <h1 className="font-mono text-xl text-white md:text-2xl">{profile.nickname}</h1>
              <div className="mt-1">
                <RankBadge rank={profile.rank} />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onGainXp}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/45 bg-cyan-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200 transition hover:bg-cyan-400/20 hover:border-cyan-300/60"
          >
            <Zap size={16} />
            Claim XP
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.15em] text-cyan-100/80">
              <span>XP {profile.xp}</span>
              <span>{profile.xpToNext} to next level</span>
            </div>
            <NeonProgress value={progress} />
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
            <Sparkles className="text-fuchsia-300" size={16} />
            <span className="font-mono text-cyan-100">Level {profile.level}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export const HeroHeader = memo(HeroHeaderComponent);
