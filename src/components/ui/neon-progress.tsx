"use client";

import { motion } from "framer-motion";

interface NeonProgressProps {
  value: number;
}

export function NeonProgress({ value }: NeonProgressProps) {
  return (
    <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="h-full rounded-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(20,216,255,1) 0%, rgba(127,77,255,1) 55%, rgba(255,79,240,1) 100%)",
          boxShadow: "0 0 18px rgba(20,216,255,0.7)",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}
