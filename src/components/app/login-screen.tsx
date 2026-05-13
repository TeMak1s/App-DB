"use client";

import { useState } from "react";
import { Volume2, VolumeX, LogIn } from "lucide-react";

interface LoginScreenProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  loading?: boolean;
  errorMessage?: string | null;
  infoMessage?: string | null;
  onLogin: (payload: { email: string; password: string; mode: "signin" | "signup" | "guest" }) => void;
  onRequestPasswordReset: (email: string) => void;
}

export function LoginScreen({
  soundEnabled,
  onToggleSound,
  onLogin,
  loading = false,
  errorMessage,
  infoMessage,
  onRequestPasswordReset,
}: LoginScreenProps) {
  const [email, setEmail] = useState<string>("pilot@sqlirl.dev");
  const [password, setPassword] = useState<string>("sqlirl123");
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const submitAuth = () => {
    onLogin({ email: email.trim(), password, mode });
  };

  return (
    <section className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center p-6">
      <div className="glass-panel neon-border rounded-none border-white/40 p-6 md:p-8 shadow-[0_0_0_2px_rgba(255,255,255,0.08)]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-mono text-lg text-white uppercase tracking-[0.12em]">SAVE FILE</h2>
          <button
            type="button"
            onClick={onToggleSound}
            className="rounded-none border border-white/30 bg-black px-2 py-2 text-white"
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-none border px-3 py-2 text-xs uppercase tracking-[0.16em] transition ${
                mode === "signin"
                  ? "border-white/70 bg-white/10 text-white"
                  : "border-white/20 bg-black/40 text-white/70"
              }`}
            >
              FIGHT
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-none border px-3 py-2 text-xs uppercase tracking-[0.16em] transition ${
                mode === "signup"
                  ? "border-white/70 bg-white/10 text-white"
                  : "border-white/20 bg-black/40 text-white/70"
              }`}
            >
              ACT
            </button>
          </div>

          <input
            className="w-full rounded-none border border-white/20 bg-black px-3 py-3 text-sm text-white outline-none focus:border-white/70"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="w-full rounded-none border border-white/20 bg-black px-3 py-3 text-sm text-white outline-none focus:border-white/70"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {errorMessage ? <p className="text-xs text-rose-300 uppercase tracking-[0.08em]">{errorMessage}</p> : null}
          {infoMessage ? <p className="text-xs text-emerald-300 uppercase tracking-[0.08em]">{infoMessage}</p> : null}

          <button
            type="button"
            onClick={submitAuth}
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-none border border-white/40 bg-white px-4 py-3 font-mono text-sm uppercase tracking-[0.18em] text-black transition hover:bg-white/90"
          >
            <LogIn size={16} /> {loading ? "..." : mode === "signin" ? "FIGHT" : "ACT"}
          </button>

          <button
            type="button"
            onClick={() => onLogin({ email: "", password: "", mode: "guest" })}
            disabled={loading}
            className="w-full rounded-none border border-white/20 bg-black px-4 py-2 text-xs uppercase tracking-[0.16em] text-white/90"
          >
            Continue as Guest
          </button>

          <button
            type="button"
            onClick={() => onRequestPasswordReset(email)}
            disabled={loading}
            className="w-full text-center text-xs uppercase tracking-[0.16em] text-white/80 hover:text-white"
          >
            Forgot Password
          </button>
        </div>
      </div>
    </section>
  );
}
