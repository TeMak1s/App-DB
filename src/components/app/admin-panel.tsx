"use client";

import { RotateCcw, ShieldAlert } from "lucide-react";

interface AdminPanelProps {
  busy?: boolean;
  statusMessage?: string | null;
  onResetWeekly: () => void;
  onRecalculateWeekly: () => void;
}

export function AdminPanel({
  busy = false,
  statusMessage,
  onResetWeekly,
  onRecalculateWeekly,
}: AdminPanelProps) {
  return (
    <section className="glass-panel mt-4 rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <ShieldAlert size={16} className="text-amber-300" />
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-amber-200">Admin Ops</h3>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <button
          type="button"
          onClick={onResetWeekly}
          disabled={busy}
          className="rounded-xl border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-amber-100"
        >
          {busy ? "Processing..." : "Reset Weekly Season"}
        </button>

        <button
          type="button"
          onClick={onRecalculateWeekly}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-cyan-100"
        >
          <RotateCcw size={12} /> Recalculate Positions
        </button>
      </div>

      {statusMessage ? <p className="mt-2 text-xs text-cyan-100/80">{statusMessage}</p> : null}
    </section>
  );
}
