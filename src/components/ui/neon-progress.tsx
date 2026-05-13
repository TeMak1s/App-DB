"use client";

import { motion } from "framer-motion";

interface NeonProgressProps {
  value: number;
}

export function NeonProgress({ value }: NeonProgressProps) {
  return (
    <div className="relative h-4 w-full overflow-hidden rounded-none border border-white/30 bg-black">
      <motion.div
        className="h-full"
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,59,48,1) 100%)",
          boxShadow: "none",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
    </div>
  );
}
