"use client";

import { motion } from "framer-motion";

export function SplashScreen() {
  return (
    <section className="relative flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="glass-panel neon-border relative w-full max-w-md rounded-none border-white/40 p-8 text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white">DETERMINATION</p>
        <h1 className="mt-3 font-mono text-4xl text-white">SQL IRL</h1>
        <p className="mt-2 text-sm text-white/80">Your save file is loading...</p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-white via-rose-500 to-white"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
