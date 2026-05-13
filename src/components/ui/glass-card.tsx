import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <article
      className={cn(
        "glass-panel animated-border relative rounded-2xl p-4 md:p-5",
        className,
      )}
    >
      {children}
    </article>
  );
}
