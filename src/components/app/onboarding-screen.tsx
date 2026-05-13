"use client";

import { motion } from "framer-motion";

interface OnboardingScreenProps {
  onFinish: () => void;
}

const steps = [
  "Your database has entered the battle.",
  "Choose ACT, complete quests, and earn LV.",
  "Find the right path from fragility to mastery.",
];

export function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center p-6">
      <div className="glass-panel neon-border rounded-none border-white/40 p-6 md:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-white">INTRO</p>
        <h2 className="mt-2 font-mono text-3xl text-white">WELCOME</h2>

        <div className="mt-5 space-y-3">
          {steps.map((step, idx) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.35 }}
              className="rounded-none border border-white/20 bg-black p-3 text-sm text-white"
            >
              {step}
            </motion.div>
          ))}
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="mt-6 w-full rounded-none border border-white/40 bg-white px-4 py-3 font-mono text-sm uppercase tracking-[0.16em] text-black"
        >
          START
        </button>
      </div>
    </section>
  );
}
