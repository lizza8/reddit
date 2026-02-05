export type Phase = "voting" | "locked" | "reveal";

export function getPhase(now: Date): Phase {
  const hour = now.getUTCHours();
  if (hour >= 20) return "reveal";
  if (hour >= 17) return "locked";
  return "voting";
}
