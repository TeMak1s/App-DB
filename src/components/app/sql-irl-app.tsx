"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Database, LogOut, Sparkles } from "lucide-react";
import { simulateDatabaseSync } from "@/lib/mock-api";
import { playLoginSfx, playToggleSfx, playXpSfx } from "@/lib/audio/sfx";
import {
  authenticateOrMock,
  fetchBootstrapFromSupabase,
  isCurrentUserAdmin,
  logXpGain,
  recalculateWeeklyLeaderboard,
  requestPasswordReset,
  resetWeeklyLeaderboard,
  signOutCurrentUser,
  signInOrMock,
} from "@/lib/supabase/repository";
import { futureIntegrations } from "@/lib/integrations/roadmap";
import { profileMock } from "@/lib/mocks";
import { BottomNav } from "@/components/app/bottom-nav";
import { HeroHeader } from "@/components/app/hero-header";
import { SkillsRadar } from "@/components/app/skills-radar";
import { QuestsCard } from "@/components/app/quests-card";
import { BadgesGrid } from "@/components/app/badges-grid";
import { LeaderboardCard } from "@/components/app/leaderboard-card";
import { ProfilePanel } from "@/components/app/profile-panel";
import { SocialPanel } from "@/components/app/social-panel";
import { ParticleField } from "@/components/app/particle-field";
import { SplashScreen } from "@/components/app/splash-screen";
import { LoginScreen } from "@/components/app/login-screen";
import { OnboardingScreen } from "@/components/app/onboarding-screen";
import { AdminPanel } from "@/components/app/admin-panel";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import type {
  Badge,
  Guild,
  LeaderboardEntry,
  Mission,
  PlayerProfile,
  SkillMetric,
  TabKey,
} from "@/types/domain";

type AppPhase = "splash" | "login" | "onboarding" | "syncing" | "app";

interface BootstrapState {
  profile: PlayerProfile;
  skillRadar: SkillMetric[];
  missions: Mission[];
  badges: Badge[];
  leaderboard: LeaderboardEntry[];
  guilds: Guild[];
}

const emptyState: BootstrapState = {
  profile: profileMock,
  skillRadar: [],
  missions: [],
  badges: [],
  leaderboard: [],
  guilds: [],
};

const SOUND_PREF_KEY = "sql-irl:sound-enabled";

export function SqlIrlApp() {
  const [phase, setPhase] = useState<AppPhase>("splash");
  const [tab, setTab] = useState<TabKey>("Home");
  const [loading, setLoading] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [connectionSource, setConnectionSource] = useState<"supabase" | "mock">("mock");
  const [playerId, setPlayerId] = useState<string>(profileMock.id);
  const [authLocked, setAuthLocked] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginInfo, setLoginInfo] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminBusy, setAdminBusy] = useState<boolean>(false);
  const [adminStatus, setAdminStatus] = useState<string | null>(null);
  const [state, setState] = useState<BootstrapState>(emptyState);
  const [xpFlash, setXpFlash] = useState<number>(0);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(SOUND_PREF_KEY) : null;
    if (saved === "1") {
      setSoundEnabled(true);
    }

    const splashTimer = setTimeout(() => {
      setPhase("login");
    }, 1900);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(SOUND_PREF_KEY, soundEnabled ? "1" : "0");
  }, [soundEnabled]);

  useEffect(() => {
    if (phase !== "app") {
      return;
    }

    let active = true;
    setLoading(true);

    if (authLocked && connectionSource === "mock") {
      fetchBootstrapFromSupabase(playerId)
        .then((data) => {
          if (!active) {
            return;
          }

          setState({
            profile: data.profile,
            skillRadar: data.skillRadar,
            missions: data.missions,
            badges: data.badges,
            leaderboard: data.leaderboard,
            guilds: data.guilds,
          });
          setIsAdmin(false);
          setLoading(false);
        })
        .catch(() => {
          if (!active) {
            return;
          }
          setLoading(false);
        });

      return () => {
        active = false;
      };
    }

    signInOrMock()
      .then(async ({ userId, source }) => {
        if (!active) {
          return;
        }

        setPlayerId(userId);
        const data = await fetchBootstrapFromSupabase(userId);
        const admin = source === "supabase" ? await isCurrentUserAdmin() : false;
        if (!active) {
          return;
        }

        setConnectionSource(data.source ?? source);
        setIsAdmin(admin);
        setState({
          profile: data.profile,
          skillRadar: data.skillRadar,
          missions: data.missions,
          badges: data.badges,
          leaderboard: data.leaderboard,
          guilds: data.guilds,
        });
        setLoading(false);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setConnectionSource("mock");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLocked, connectionSource, phase, playerId]);

  const handleFinishOnboarding = async () => {
    setPhase("syncing");
    await simulateDatabaseSync();
    setPhase("app");
  };

  const handleGainXp = () => {
    const gain = 150;
    let leveledUp = false;
    setState((prev) => {
      const nextXp = prev.profile.xp + gain;
      const reached = nextXp >= prev.profile.xpToNext;
      leveledUp = reached;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          level: reached ? prev.profile.level + 1 : prev.profile.level,
          xp: reached ? nextXp - prev.profile.xpToNext : nextXp,
          xpToNext: reached ? prev.profile.xpToNext + 400 : prev.profile.xpToNext,
        },
      };
    });

    void logXpGain(playerId, gain);
    if (soundEnabled) {
      playXpSfx(leveledUp);
    }

    setXpFlash(gain);
    setTimeout(() => setXpFlash(0), 1200);
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
    if (!soundEnabled) {
      playToggleSfx();
    }
  };

  const handleLogin = async (payload: { email: string; password: string; mode: "signin" | "signup" | "guest" }) => {
    setAuthLoading(true);
    setLoginError(null);
    setLoginInfo(null);

    try {
      const result = await authenticateOrMock(payload);
      setPlayerId(result.userId);
      setConnectionSource(result.source);
      setAuthLocked(payload.mode === "guest");
      setIsAdmin(false);

      if (soundEnabled) {
        playLoginSfx();
      }
      setPhase("onboarding");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      setLoginError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    const data = await fetchBootstrapFromSupabase(playerId);
    const admin = connectionSource === "supabase" ? await isCurrentUserAdmin() : false;
    setConnectionSource(data.source);
    setIsAdmin(admin);
    setState({
      profile: data.profile,
      skillRadar: data.skillRadar,
      missions: data.missions,
      badges: data.badges,
      leaderboard: data.leaderboard,
      guilds: data.guilds,
    });
    setLoading(false);
  };

  const handleResetWeekly = async () => {
    setAdminBusy(true);
    setAdminStatus(null);
    try {
      await resetWeeklyLeaderboard();
      await refreshData();
      setAdminStatus("Weekly season reset completed.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reset weekly season.";
      setAdminStatus(message);
    } finally {
      setAdminBusy(false);
    }
  };

  const handleRecalculateWeekly = async () => {
    setAdminBusy(true);
    setAdminStatus(null);
    try {
      await recalculateWeeklyLeaderboard();
      await refreshData();
      setAdminStatus("Weekly ranking positions recalculated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to recalculate weekly ranking.";
      setAdminStatus(message);
    } finally {
      setAdminBusy(false);
    }
  };

  const handleRequestPasswordReset = async (email: string) => {
    setLoginError(null);
    setLoginInfo(null);
    try {
      await requestPasswordReset(email);
      setLoginInfo("Password reset email sent. Check your inbox.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send reset email.";
      setLoginError(message);
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    try {
      if (connectionSource === "supabase" && !authLocked) {
        await signOutCurrentUser();
      }
    } catch {
      // Ignore sign out failures and still return to login flow.
    } finally {
      setState(emptyState);
      setPlayerId(profileMock.id);
      setConnectionSource("mock");
      setAuthLocked(false);
      setIsAdmin(false);
      setAdminStatus(null);
      setLoginInfo(null);
      setLoginError(null);
      setTab("Home");
      setPhase("login");
      setAuthLoading(false);
    }
  };

  const content = useMemo(() => {
    if (loading) {
      return <LoadingSkeleton />;
    }

    if (tab === "Home") {
      return (
        <div className="space-y-4">
          <HeroHeader profile={state.profile} onGainXp={handleGainXp} />
          <SkillsRadar metrics={state.skillRadar} />
          <QuestsCard missions={state.missions} />
          <BadgesGrid badges={state.badges} />
        </div>
      );
    }

    if (tab === "Skills") {
      return (
        <div className="space-y-4">
          <SkillsRadar metrics={state.skillRadar} />
          <ProfilePanel profile={state.profile} skills={state.skillRadar} badges={state.badges} />
        </div>
      );
    }

    if (tab === "Rankings") {
      return <LeaderboardCard entries={state.leaderboard} />;
    }

    if (tab === "Guilds") {
      return <SocialPanel guilds={state.guilds} />;
    }

    return <ProfilePanel profile={state.profile} skills={state.skillRadar} badges={state.badges} />;
  }, [loading, state, tab]);

  if (phase === "splash") {
    return (
      <>
        <ParticleField />
        <SplashScreen />
      </>
    );
  }

  if (phase === "login") {
    return (
      <>
        <ParticleField />
        <LoginScreen
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          loading={authLoading}
          errorMessage={loginError}
          infoMessage={loginInfo}
          onRequestPasswordReset={handleRequestPasswordReset}
          onLogin={handleLogin}
        />
      </>
    );
  }

  if (phase === "onboarding") {
    return (
      <>
        <ParticleField />
        <OnboardingScreen onFinish={handleFinishOnboarding} />
      </>
    );
  }

  if (phase === "syncing") {
    return (
      <section className="flex min-h-screen items-center justify-center p-6">
        <div className="glass-panel neon-border w-full max-w-md rounded-3xl p-7 text-center">
          <Database className="mx-auto text-cyan-300" size={28} />
          <h2 className="mt-3 font-mono text-2xl text-white">Synchronizing Database...</h2>
          <p className="mt-2 text-sm text-cyan-100/80">Loading live schema, missions, and rank telemetry.</p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <main className="hud-grid cyber-scroll relative mx-auto min-h-screen w-full max-w-3xl pb-24">
      <ParticleField />

      <div className="px-4 pb-8 pt-6 md:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-300">A Legends Hub for Database Masters</p>
            <h2 className="font-mono text-2xl text-white text-neon">Summoner Archive: DB Rank</h2>
          </div>
          <div className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
            <Sparkles size={14} className="mb-1" />
            {connectionSource === "supabase" ? "LIVE SUPABASE" : "MOCK MODE"}
          </div>
        </div>

        <div className="mb-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/35 bg-cyan-500/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-cyan-100"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        <AnimatePresence>
          {xpFlash > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3 inline-flex rounded-full border border-fuchsia-300/50 bg-fuchsia-500/20 px-3 py-1 text-xs text-fuchsia-100"
            >
              +{xpFlash} XP Rank Boost
            </motion.div>
          ) : null}
        </AnimatePresence>

        {content}

        <section className="glass-panel mt-4 rounded-2xl p-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">Future Integrations</h3>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {futureIntegrations.map((integration) => (
              <div key={integration.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-sm text-white">{integration.name}</p>
                <p className="text-xs text-cyan-100/70">{integration.description}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-fuchsia-200">{integration.status}</p>
              </div>
            ))}
          </div>
        </section>

        {isAdmin ? (
          <AdminPanel
            busy={adminBusy}
            statusMessage={adminStatus}
            onResetWeekly={handleResetWeekly}
            onRecalculateWeekly={handleRecalculateWeekly}
          />
        ) : null}
      </div>

      <BottomNav current={tab} onChange={setTab} />
    </main>
  );
}
