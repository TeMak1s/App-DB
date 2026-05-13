"use client";

import { memo } from "react";
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

function SkillsRadarComponent({ metrics }: SkillsRadarProps) {
  return (
    <GlassCard className="holographic overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-cyan-200">Skill Matrix</h2>
        <span className="rounded-lg border border-cyan-300/35 bg-cyan-300/10 px-2 py-1 text-xs text-cyan-100">Rank Scan</span>
      </div>

      <div className="grid items-center gap-4 lg:grid-cols-[1.35fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={metrics} outerRadius="78%">
              <PolarGrid stroke="rgba(200,170,110,0.24)" />
              <PolarAngleAxis dataKey="label" tick={{ fill: "#f0d7a2", fontSize: 12 }} />
              <Radar
                name="Power"
                dataKey="value"
                stroke="#f0d7a2"
                fill="url(#skillsGradientLol)"
                fillOpacity={0.7}
              />
              <defs>
                <linearGradient id="skillsGradientLol" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1f4d7f" />
                  <stop offset="50%" stopColor="#2c5f93" />
                  <stop offset="100%" stopColor="#c8aa6e" />
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="space-y-2">
          {metrics.map((skill) => (
            <div key={skill.label} className="rounded-xl border border-cyan-300/25 bg-black/25 p-2.5">
              <div className="mb-1 flex items-center justify-between text-xs text-cyan-100">
                <span>{skill.label}</span>
                <span>{skill.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${skill.value}%`,
                    background: "linear-gradient(90deg,#1f4d7f,#2c5f93,#c8aa6e)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

export const SkillsRadar = memo(SkillsRadarComponent);
