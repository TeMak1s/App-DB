import { rankStyles } from "@/lib/rank-system";
import type { RankName } from "@/types/domain";

interface RankBadgeProps {
  rank: RankName;
}

export function RankBadge({ rank }: RankBadgeProps) {
  const style = rankStyles[rank];
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
      style={{
        color: style.color,
        borderColor: style.color,
        boxShadow: `0 0 20px ${style.glow}`,
      }}
    >
      <span>{style.badge}</span>
      <span>{rank}</span>
    </div>
  );
}
