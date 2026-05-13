"use client";

import { memo } from "react";
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

function BottomNavComponent({ current, onChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto w-[min(720px,94vw)] border border-white/30 bg-black/95 p-2">
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
                  "flex w-full flex-col items-center gap-1 rounded-none border px-2 py-2 text-[10px] uppercase tracking-[0.14em] transition",
                  active
                    ? "border-white bg-white text-black"
                    : "border-white/10 text-white/75 hover:bg-white/10",
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

export const BottomNav = memo(BottomNavComponent);
