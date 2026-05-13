import { rankStyles } from "@/lib/rank-system";
import type { RankName } from "@/types/domain";

interface RankBadgeProps {
  rank: RankName;
}

export function RankBadge({ rank }: RankBadgeProps) {
  const style = rankStyles[rank];
  return (
    <div
      className="inline-flex items-center gap-2 rounded-none border border-white/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]"
      style={{
        color: style.color,
        borderColor: "rgba(255,255,255,0.35)",
        boxShadow: "none",
      }}
    >
      <span>{style.badge}</span>
      <span>{rank}</span>
    </div>
  );
}
