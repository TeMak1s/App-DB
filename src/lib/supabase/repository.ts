import { badgesMock, guildsMock, leaderboardMock, missionsMock, profileMock, skillRadarMock } from "@/lib/mocks";
import { supabase } from "@/lib/supabase/client";
import type { Badge, Guild, LeaderboardEntry, Mission, PlayerProfile, SkillMetric } from "@/types/domain";

export type AuthMode = "signin" | "signup" | "guest";

export interface BootstrapPayload {
  profile: PlayerProfile;
  skillRadar: SkillMetric[];
  missions: Mission[];
  badges: Badge[];
  leaderboard: LeaderboardEntry[];
  guilds: Guild[];
  source: "supabase" | "mock";
}

function nicknameFromEmail(email: string | null | undefined) {
  if (!email) {
    return "DBRookie";
  }

  const [local] = email.split("@");
  return local?.slice(0, 20) || "DBRookie";
}

async function ensureUserProfile(userId: string, email?: string) {
  if (!supabase) {
    return;
  }

  const baseNickname = nicknameFromEmail(email);
  const nickname = `${baseNickname}_${userId.slice(0, 6)}`;

  const { data: rankData } = await supabase
    .from("ranks")
    .select("id")
    .eq("name", "Bronze")
    .maybeSingle();

  await supabase.from("users").upsert(
    {
      id: userId,
      nickname,
      rank_id: rankData?.id ?? null,
      level: 1,
      xp: 0,
      xp_to_next: 1000,
      streak_days: 0,
      hours_studied: 0,
      profile_public: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  await supabase.from("skills").upsert(
    {
      user_id: userId,
      performance: 10,
      security: 10,
      modeling: 10,
      scalability: 10,
      backup: 10,
      infrastructure: 10,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

export async function signInOrMock() {
  if (!supabase) {
    return { userId: profileMock.id, source: "mock" as const };
  }

  try {
    const existing = await supabase.auth.getUser();
    if (existing.data.user) {
      await ensureUserProfile(existing.data.user.id, existing.data.user.email);
      return { userId: existing.data.user.id, source: "supabase" as const };
    }

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error || !data.user) {
      return { userId: profileMock.id, source: "mock" as const };
    }

    await ensureUserProfile(data.user.id, data.user.email);

    return { userId: data.user.id, source: "supabase" as const };
  } catch {
    return { userId: profileMock.id, source: "mock" as const };
  }
}

export async function authenticateOrMock(input: {
  mode: AuthMode;
  email: string;
  password: string;
}) {
  if (!supabase || input.mode === "guest") {
    return { userId: profileMock.id, source: "mock" as const };
  }

  if (!input.email || !input.password) {
    throw new Error("Email and password are required.");
  }

  if (input.mode === "signup") {
    const signup = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
    });

    if (signup.error) {
      throw signup.error;
    }

    const userId = signup.data.user?.id;
    if (!userId) {
      throw new Error("Unable to create account. Check email confirmation settings.");
    }

    await ensureUserProfile(userId, signup.data.user?.email ?? input.email);
    return { userId, source: "supabase" as const };
  }

  const signin = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
  if (signin.error || !signin.data.user) {
    throw signin.error ?? new Error("Sign in failed.");
  }

  await ensureUserProfile(signin.data.user.id, signin.data.user.email ?? input.email);
  return { userId: signin.data.user.id, source: "supabase" as const };
}

export async function requestPasswordReset(email: string) {
  if (!supabase) {
    throw new Error("Supabase not configured.");
  }

  const cleanEmail = email.trim();
  if (!cleanEmail) {
    throw new Error("Email is required.");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const redirectTo = baseUrl ? `${baseUrl.replace(/\/$/, "")}/` : undefined;

  const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
    redirectTo,
  });

  if (error) {
    throw error;
  }
}

export async function signOutCurrentUser() {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function isCurrentUserAdmin() {
  if (!supabase) {
    return false;
  }

  try {
    const { data, error } = await supabase.rpc("is_current_user_admin");
    if (error) {
      return false;
    }

    if (typeof data === "boolean") {
      return data;
    }

    if (Array.isArray(data) && typeof data[0] === "boolean") {
      return data[0];
    }

    return false;
  } catch {
    return false;
  }
}

export async function fetchBootstrapFromSupabase(userId: string): Promise<BootstrapPayload> {
  if (!supabase) {
    return {
      profile: profileMock,
      skillRadar: skillRadarMock,
      missions: missionsMock,
      badges: badgesMock,
      leaderboard: leaderboardMock,
      guilds: guildsMock,
      source: "mock",
    };
  }

  try {
    const [userRes, skillsRes, missionsRes, badgesRes, guildsRes, leaderboardRes] = await Promise.all([
      supabase.from("users").select("nickname, avatar_url, level, xp, xp_to_next, streak_days, hours_studied").eq("id", userId).maybeSingle(),
      supabase.from("skills").select("performance, security, modeling, scalability, backup, infrastructure").eq("user_id", userId).maybeSingle(),
      supabase.from("missions").select("id, title, reward_xp, reward_coins").eq("active", true),
      supabase
        .from("user_badges")
        .select("badge:badges(id, name, rarity)")
        .eq("user_id", userId),
      supabase.from("guilds").select("id, name, region, focus").limit(6),
      supabase
        .from("leaderboards")
        .select("id, points, position, user:users(nickname, level)")
        .eq("period", "weekly")
        .order("position", { ascending: true })
        .limit(10),
    ]);

    if (userRes.error) {
      throw userRes.error;
    }

    const user = userRes.data;
    if (!user) {
      throw new Error("User not found in public.users");
    }

    const profile: PlayerProfile = {
      id: userId,
      nickname: user.nickname,
      avatarUrl: user.avatar_url ?? profileMock.avatarUrl,
      level: user.level ?? profileMock.level,
      xp: user.xp ?? profileMock.xp,
      xpToNext: user.xp_to_next ?? profileMock.xpToNext,
      rank: profileMock.rank,
      streakDays: user.streak_days ?? profileMock.streakDays,
      hoursStudied: Number(user.hours_studied ?? profileMock.hoursStudied),
      technologies: profileMock.technologies,
    };

    const skillRow = skillsRes.data;
    const skillRadar: SkillMetric[] = skillRow
      ? [
          { label: "Performance", value: skillRow.performance },
          { label: "Security", value: skillRow.security },
          { label: "Modeling", value: skillRow.modeling },
          { label: "Scalability", value: skillRow.scalability },
          { label: "Backup", value: skillRow.backup },
          { label: "Infrastructure", value: skillRow.infrastructure },
        ]
      : skillRadarMock;

    const missions: Mission[] =
      missionsRes.data?.map((mission) => ({
        id: mission.id,
        title: mission.title,
        rewardXp: mission.reward_xp,
        rewardCoins: mission.reward_coins,
        completed: false,
      })) ?? missionsMock;

    const parsedBadges =
      badgesRes.data?.map((entry) => {
        const raw = entry.badge as
          | { id?: string; name?: string; rarity?: "Epic" | "Legendary" | "Rare" }
          | Array<{ id?: string; name?: string; rarity?: "Epic" | "Legendary" | "Rare" }>
          | null;

        const badge = Array.isArray(raw) ? raw[0] : raw;
        if (!badge?.id || !badge?.name || !badge?.rarity) {
          return null;
        }

        return {
          id: badge.id,
          name: badge.name,
          rarity: badge.rarity,
          unlocked: true,
        } satisfies Badge;
      }) ?? [];

    const filteredBadges = parsedBadges.filter(Boolean) as Badge[];
    const badges: Badge[] = filteredBadges.length > 0 ? filteredBadges : badgesMock;

    const guilds: Guild[] =
      guildsRes.data?.map((guild) => ({
        id: guild.id,
        name: guild.name,
        members: 0,
        region: guild.region ?? "Global",
        focus: guild.focus ?? "Database mastery",
      })) ?? guildsMock;

    const leaderboard: LeaderboardEntry[] =
      leaderboardRes.data?.map((row, idx) => ({
        id: row.id,
        nickname: (row.user as { nickname?: string } | null)?.nickname ?? `Player ${idx + 1}`,
        rank: profileMock.rank,
        level: (row.user as { level?: number } | null)?.level ?? profileMock.level,
        weeklyXp: row.points,
      })) ?? leaderboardMock;

    return { profile, skillRadar, missions, badges, guilds, leaderboard, source: "supabase" };
  } catch {
    return {
      profile: profileMock,
      skillRadar: skillRadarMock,
      missions: missionsMock,
      badges: badgesMock,
      leaderboard: leaderboardMock,
      guilds: guildsMock,
      source: "mock",
    };
  }
}

export async function logXpGain(userId: string, value: number) {
  if (!supabase) {
    return;
  }

  await supabase.from("xp_logs").insert({
    user_id: userId,
    source: "sql_exercise",
    value,
    metadata: { trigger: "manual_claim" },
  });

  await supabase.rpc("increment_user_xp", {
    p_user_id: userId,
    p_gain: value,
  });
}

export async function resetWeeklyLeaderboard() {
  if (!supabase) {
    return { ok: false, source: "mock" as const };
  }

  const { error } = await supabase.rpc("admin_reset_weekly_leaderboard");
  if (error) {
    throw error;
  }

  return { ok: true, source: "supabase" as const };
}

export async function recalculateWeeklyLeaderboard() {
  if (!supabase) {
    return { ok: false, source: "mock" as const };
  }

  const { error } = await supabase.rpc("admin_recalculate_weekly_positions");
  if (error) {
    throw error;
  }

  return { ok: true, source: "supabase" as const };
}
