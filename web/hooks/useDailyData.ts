import { useEffect, useState } from "react";
import { extractServerMessage, sendWebMessage } from "../utils/devvit";
import { useGameStore } from "../stores/gameStore";

export function useDailyData(): { loading: boolean; error: string | null } {
  const setDaily = useGameStore((state) => state.setDaily);
  const setLeaderboard = useGameStore((state) => state.setLeaderboard);
  const setPaint = useGameStore((state) => state.setPaint);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = extractServerMessage(event);
      if (!message) {
        return;
      }
      if (message.type === "init") {
        setDaily(message.data.daily);
        setLeaderboard(message.data.leaderboard);
        if (message.data.paint) {
          setPaint(message.data.paint);
        }
        setLoading(false);
        setError(null);
        return;
      }
      if (message.type === "leaderboard") {
        setLeaderboard(message.data.leaderboard);
        return;
      }
      if (message.type === "submitScore") {
        setLeaderboard(message.data.leaderboard);
        return;
      }
      if (message.type === "error") {
        setError(message.error);
        setLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    sendWebMessage({ type: "init" });

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setDaily, setLeaderboard, setPaint]);

  return { loading, error };
}
