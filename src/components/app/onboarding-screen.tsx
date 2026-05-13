"use client";

import { motion } from "framer-motion";

interface OnboardingScreenProps {
  onFinish: () => void;
}

const steps = [
  "Your database evolves like an RPG character.",
  "Complete quests and optimize real SQL skills.",
  "Compete globally and rise from Bronze to Oracle.",
];

export function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center p-6">
      <div className="glass-panel neon-border rounded-3xl p-6 md:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">Onboarding</p>
        <h2 className="mt-2 font-mono text-3xl text-white">Welcome, Data Hunter</h2>

        <div className="mt-5 space-y-3">
          {steps.map((step, idx) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.35 }}
              className="rounded-xl border border-cyan-300/20 bg-cyan-400/5 p-3 text-sm text-cyan-100"
            >
              {step}
            </motion.div>
          ))}
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-3 font-mono text-sm uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(127,77,255,0.5)]"
        >
          Sync Database Profile
        </button>
      </div>
    </section>
  );
}
