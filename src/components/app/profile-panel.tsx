import { Flame, Timer, Wrench } from "lucide-react";
import type { Badge, PlayerProfile, SkillMetric } from "@/types/domain";
import { RankBadge } from "@/components/ui/rank-badge";
import { GlassCard } from "@/components/ui/glass-card";

interface ProfilePanelProps {
  profile: PlayerProfile;
  skills: SkillMetric[];
  badges: Badge[];
}

export function ProfilePanel({ profile, skills, badges }: ProfilePanelProps) {
  const unlocked = badges.filter((badge) => badge.unlocked).length;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <GlassCard>
        <h2 className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-cyan-200">Profile Core</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-cyan-100/80">Rank</span>
            <RankBadge rank={profile.rank} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-cyan-100/80">Unlocked Badges</span>
            <span>{unlocked}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-cyan-100/80">
              <Flame size={14} /> Streak
            </span>
            <span>{profile.streakDays} days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-cyan-100/80">
              <Timer size={14} /> Study Hours
            </span>
            <span>{profile.hoursStudied}h</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-cyan-200">Tech Mastery</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {profile.technologies.map((tech) => (
            <span key={tech} className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
              {tech}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          {skills.map((skill) => (
            <div key={skill.label} className="rounded-lg bg-white/5 px-3 py-2 text-xs">
              <div className="mb-1 flex justify-between text-cyan-100/80">
                <span className="inline-flex items-center gap-1">
                  <Wrench size={12} /> {skill.label}
                </span>
                <span>{skill.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${skill.value}%`,
                    background: "linear-gradient(90deg,#14d8ff,#7f4dff,#ff4ff0)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
