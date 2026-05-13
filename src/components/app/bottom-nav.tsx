"use client";

import { Home, Shield, Trophy, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TabKey } from "@/types/domain";

interface BottomNavProps {
  current: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
  { key: "Home", icon: Home, label: "Home" },
  { key: "Skills", icon: Shield, label: "Skills" },
  { key: "Rankings", icon: Trophy, label: "Rankings" },
  { key: "Guilds", icon: Users, label: "Guilds" },
  { key: "Profile", icon: User, label: "Profile" },
];

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto w-[min(680px,94vw)] rounded-2xl border border-cyan-300/25 bg-slate-950/75 p-2 backdrop-blur-xl">
      <ul className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = current === tab.key;
          return (
            <li key={tab.key}>
              <button
                type="button"
                onClick={() => onChange(tab.key)}
                className={cn(
                  "flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] uppercase tracking-[0.14em] transition",
                  active
                    ? "bg-cyan-400/20 text-cyan-100 shadow-[0_0_16px_rgba(20,216,255,0.45)]"
                    : "text-cyan-100/70 hover:bg-white/5",
                )}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
