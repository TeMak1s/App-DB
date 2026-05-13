import {
  badgesMock,
  guildsMock,
  leaderboardMock,
  missionsMock,
  profileMock,
  skillRadarMock,
  xpLogsMock,
} from "@/lib/mocks";
import { delay } from "@/lib/utils";

export async function fetchBootstrapData() {
  await delay(1200);
  return {
    profile: profileMock,
    skillRadar: skillRadarMock,
    missions: missionsMock,
    badges: badgesMock,
    leaderboard: leaderboardMock,
    guilds: guildsMock,
    xpLogs: xpLogsMock,
  };
}

export async function simulateDatabaseSync() {
  await delay(2400);
  return { synced: true, at: new Date().toISOString() };
}
