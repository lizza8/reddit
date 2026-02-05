import { Devvit } from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import type { ServerMessage, WebMessage } from "./messages";
import { getDailySeed } from "./daily";
import {
  forceDailyData,
  getLeaderboard,
  getOrCreateDailyData,
  getDailyPostId,
  getPaint,
  setDailyPostId,
  storePaint,
  submitScore,
} from "./storage";

Devvit.configure({
  kvStore: true,
  redditAPI: true,
});

async function ensureDailyPost(seed: string, context: Context): Promise<string | undefined> {
  const existing = await getDailyPostId(context, seed);
  if (existing) {
    return existing;
  }

  const subredditName =
    context.subredditName ?? (await context.reddit.getCurrentSubreddit()).name;
  if (!subredditName) {
    return undefined;
  }

  const post = await context.reddit.submitPost({
    subredditName,
    title: `BirdBlitz Royale – ${seed}`,
    runAs: "APP",
    postData: { seed, type: "BIRDBATTLE" },
    preview: (
      <vstack height="100%" width="100%" alignment="middle center">
        <text size="large">Launching BirdBlitz Royale...</text>
        <text size="small">Tap to open the skies.</text>
      </vstack>
    ),
    textFallback: {
      text: "BirdBlitz Royale is loading. Open this post in the Reddit app to play.",
    },
  });

  await setDailyPostId(context, seed, post.id);
  return post.id;
}

Devvit.addSchedulerJob({
  name: "dailyBlitz",
  onRun: async (_, context) => {
    const seed = getDailySeed();
    await forceDailyData(context, seed);
    await ensureDailyPost(seed, context);
  },
});

Devvit.addTrigger({
  event: "AppInstall",
  onEvent: async (_, context) => {
    const seed = getDailySeed();
    await forceDailyData(context, seed);
    await ensureDailyPost(seed, context);
  },
});

Devvit.addMenuItem({
  label: "Play BirdBlitz Royale",
  location: "subreddit",
  onPress: async (_, context) => {
    const seed = getDailySeed();
    const postId = await ensureDailyPost(seed, context);
    if (!postId) {
      context.ui.showToast("Unable to create game post.");
      return;
    }
    const post = await context.reddit.getPostById(postId);
    context.ui.navigateTo(post);
  },
});

Devvit.addCustomPostType({
  name: "BIRDBATTLE",
  description: "BirdBlitz Royale – 3D bird battle royale",
  height: "tall",
  render: (context) => {
    const send = (payload: ServerMessage) => {
      context.ui.webView.postMessage(payload);
    };

    const handleMessage = async (message: WebMessage) => {
      if (message.type === "init") {
        const daily = await getOrCreateDailyData(context);
        const leaderboard = await getLeaderboard(context, daily.date);
        const paint = context.userId ? await getPaint(context, daily.date, context.userId) : undefined;
        send({ type: "init", data: { daily, leaderboard, paint } });
        return;
      }

      if (message.type === "leaderboard") {
        const seed = getDailySeed();
        const leaderboard = await getLeaderboard(context, seed);
        send({ type: "leaderboard", data: { leaderboard } });
        return;
      }

      if (message.type === "paint") {
        if (context.userId) {
          const seed = getDailySeed();
          await storePaint(context, seed, context.userId, message.paint);
        }
        return;
      }

      if (message.type === "submitScore") {
        const seed = getDailySeed();
        const userId = context.userId ?? "anon";
        const paint = context.userId ? await getPaint(context, seed, context.userId) : undefined;
        const leaderboard = await submitScore(context, seed, {
          userId,
          score: message.score,
          kills: message.kills,
          durationMs: message.durationMs,
          paint,
          createdAt: new Date().toISOString(),
        });
        send({ type: "submitScore", data: { accepted: true, leaderboard } });
      }
    };

    return <webview url="index.html" onMessage={handleMessage} />;
  },
});

export default Devvit;
