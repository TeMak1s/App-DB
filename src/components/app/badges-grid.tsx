import { memo } from "react";
import { Award } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import type { Badge } from "@/types/domain";

interface BadgesGridProps {
  badges: Badge[];
}

const rarityTone: Record<Badge["rarity"], string> = {
  Rare: "text-cyan-200 border-cyan-300/30 bg-cyan-400/10",
  Epic: "text-violet-200 border-violet-300/30 bg-violet-400/10",
  Legendary: "text-amber-200 border-amber-300/30 bg-amber-300/10",
};

function BadgesGridComponent({ badges }: BadgesGridProps) {
  return (
    <GlassCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-cyan-200">Badges</h2>
        <Award className="text-amber-300" size={16} />
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-xl border p-2 text-xs ${rarityTone[badge.rarity]} ${
              badge.unlocked ? "opacity-100" : "opacity-45"
            }`}
          >
            <p className="font-semibold">{badge.name}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.13em]">{badge.rarity}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export const BadgesGrid = memo(BadgesGridComponent);
