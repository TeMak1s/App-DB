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
      <div className="glass-panel neon-border rounded-3xl p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-mono text-2xl text-white">Access Node</h2>
          <button
            type="button"
            onClick={onToggleSound}
            className="rounded-xl border border-cyan-300/40 bg-cyan-400/10 p-2 text-cyan-100"
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
              className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-[0.16em] transition ${
                mode === "signin"
                  ? "border-cyan-300/60 bg-cyan-400/20 text-cyan-100"
                  : "border-white/10 bg-black/30 text-cyan-100/70"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-[0.16em] transition ${
                mode === "signup"
                  ? "border-fuchsia-300/60 bg-fuchsia-400/20 text-fuchsia-100"
                  : "border-white/10 bg-black/30 text-cyan-100/70"
              }`}
            >
              Sign Up
            </button>
          </div>

          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-cyan-100 outline-none focus:border-cyan-300/60"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-cyan-100 outline-none focus:border-cyan-300/60"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {errorMessage ? <p className="text-xs text-rose-300">{errorMessage}</p> : null}
          {infoMessage ? <p className="text-xs text-emerald-300">{infoMessage}</p> : null}

          <button
            type="button"
            onClick={submitAuth}
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-4 py-3 font-mono text-sm uppercase tracking-[0.18em] text-white shadow-[0_0_20px_rgba(20,216,255,0.5)] transition hover:brightness-110"
          >
            <LogIn size={16} /> {loading ? "Connecting..." : mode === "signin" ? "Enter Arena" : "Create Account"}
          </button>

          <button
            type="button"
            onClick={() => onLogin({ email: "", password: "", mode: "guest" })}
            disabled={loading}
            className="w-full rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cyan-100"
          >
            Continue as Guest
          </button>

          <button
            type="button"
            onClick={() => onRequestPasswordReset(email)}
            disabled={loading}
            className="w-full text-center text-xs uppercase tracking-[0.16em] text-cyan-200/85 hover:text-cyan-100"
          >
            Forgot Password
          </button>
        </div>
      </div>
    </section>
  );
}
