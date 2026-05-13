import { Users, Radar } from "lucide-react";
import type { Guild } from "@/types/domain";
import { GlassCard } from "@/components/ui/glass-card";

interface SocialPanelProps {
  guilds: Guild[];
}

export function SocialPanel({ guilds }: SocialPanelProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-cyan-200">Guilds / Clans</h2>
          <Users size={16} className="text-cyan-200" />
        </div>
        <div className="space-y-2">
          {guilds.map((guild) => (
            <div key={guild.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white">{guild.name}</p>
                <span className="text-xs text-cyan-100/70">{guild.members} members</span>
              </div>
              <p className="mt-1 text-xs text-cyan-100/75">{guild.region}</p>
              <p className="mt-1 text-xs text-fuchsia-100/80">{guild.focus}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-cyan-200">Skill Compare</h2>
          <Radar size={16} className="text-fuchsia-300" />
        </div>
        <div className="space-y-2 text-sm text-cyan-100/85">
          <p className="rounded-xl bg-white/5 p-3">Public profile visibility: Enabled</p>
          <p className="rounded-xl bg-white/5 p-3">Weekly rank trend: +4 positions</p>
          <p className="rounded-xl bg-white/5 p-3">Top strength vs global: Data Modeling (+12%)</p>
          <p className="rounded-xl bg-white/5 p-3">Needs focus: Backup and resilience (+19% to elite tier)</p>
        </div>
      </GlassCard>
    </div>
  );
}
