import type { Context } from "@devvit/public-api";
import { createDailyData, getDailySeed } from "./daily";
import type { DailyData, LeaderboardEntry } from "./messages";

const DAILY_KEY = (seed: string) => `birdblitz:daily:${seed}`;
const LEADERBOARD_KEY = (seed: string) => `birdblitz:leaderboard:${seed}`;
const PAINT_KEY = (seed: string, userId: string) => `birdblitz:paint:${seed}:${userId}`;
const POST_KEY = (seed: string) => `birdblitz:post:${seed}`;

export async function getOrCreateDailyData(context: Context): Promise<DailyData> {
  const seed = getDailySeed();
  const key = DAILY_KEY(seed);
  const existing = await context.kvStore.get<DailyData>(key);
  if (existing?.date === seed) {
    return existing;
  }

  const daily = createDailyData(seed);
  await context.kvStore.put(key, daily);
  await context.kvStore.put(LEADERBOARD_KEY(seed), []);
  return daily;
}

export async function forceDailyData(context: Context, seed: string): Promise<DailyData> {
  const daily = createDailyData(seed);
  await context.kvStore.put(DAILY_KEY(seed), daily);
  await context.kvStore.put(LEADERBOARD_KEY(seed), []);
  return daily;
}

export async function getLeaderboard(
  context: Context,
  seed: string
): Promise<LeaderboardEntry[]> {
  return (await context.kvStore.get<LeaderboardEntry[]>(LEADERBOARD_KEY(seed))) ?? [];
}

export async function submitScore(
  context: Context,
  seed: string,
  entry: LeaderboardEntry
): Promise<LeaderboardEntry[]> {
  const leaderboard = await getLeaderboard(context, seed);
  const updated = [...leaderboard, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  await context.kvStore.put(LEADERBOARD_KEY(seed), updated);
  return updated;
}

export async function storePaint(
  context: Context,
  seed: string,
  userId: string,
  paint: string
): Promise<void> {
  await context.kvStore.put(PAINT_KEY(seed, userId), paint);
}

export async function getPaint(
  context: Context,
  seed: string,
  userId: string
): Promise<string | undefined> {
  return await context.kvStore.get<string>(PAINT_KEY(seed, userId));
}

export async function getDailyPostId(
  context: Context,
  seed: string
): Promise<string | undefined> {
  return await context.kvStore.get<string>(POST_KEY(seed));
}

export async function setDailyPostId(
  context: Context,
  seed: string,
  postId: string
): Promise<void> {
  await context.kvStore.put(POST_KEY(seed), postId);
}
