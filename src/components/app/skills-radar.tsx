"use client";

import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { SkillMetric } from "@/types/domain";
import { GlassCard } from "@/components/ui/glass-card";

interface SkillsRadarProps {
  metrics: SkillMetric[];
}

export function SkillsRadar({ metrics }: SkillsRadarProps) {
  return (
    <GlassCard className="holographic">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-cyan-200">Skill Matrix</h2>
        <span className="rounded-lg bg-cyan-300/10 px-2 py-1 text-xs text-cyan-100">Radar Sync</span>
      </div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={metrics} outerRadius="75%">
            <PolarGrid stroke="rgba(147,197,253,0.25)" />
            <PolarAngleAxis dataKey="label" tick={{ fill: "#c7e8ff", fontSize: 12 }} />
            <Radar
              name="Power"
              dataKey="value"
              stroke="#14d8ff"
              fill="url(#skillsGradient)"
              fillOpacity={0.72}
            />
            <defs>
              <linearGradient id="skillsGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#14d8ff" />
                <stop offset="55%" stopColor="#7f4dff" />
                <stop offset="100%" stopColor="#ff4ff0" />
              </linearGradient>
            </defs>
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
