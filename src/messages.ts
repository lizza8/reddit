export type IslandConfig = {
  x: number;
  y: number;
  z: number;
  radius: number;
  height: number;
  color: string;
};

export type PowerupConfig = {
  id: string;
  x: number;
  y: number;
  z: number;
  type: "shield" | "multi" | "speed";
};

export type WaveConfig = {
  id: string;
  enemies: Array<{
    type: "sparrow" | "owl" | "eagle" | "crow" | "hummingbird";
    count: number;
    speed: number;
    health: number;
  }>;
  hazard?: "lightning" | "wind";
};

export type DailyData = {
  date: string;
  seed: number;
  arenaRadius: number;
  islands: IslandConfig[];
  powerups: PowerupConfig[];
  waves: WaveConfig[];
  modifiers: string[];
};

export type LeaderboardEntry = {
  userId: string;
  score: number;
  kills: number;
  durationMs: number;
  paint?: string;
  createdAt: string;
};

export type GhostFrame = {
  t: number;
  x: number;
  y: number;
  z: number;
  r: number;
};

export type WebInitMessage = {
  type: "init";
};

export type WebSubmitScoreMessage = {
  type: "submitScore";
  score: number;
  kills: number;
  durationMs: number;
  replay?: GhostFrame[];
};

export type WebLeaderboardMessage = {
  type: "leaderboard";
};

export type WebPaintMessage = {
  type: "paint";
  paint: string;
};

export type WebMessage =
  | WebInitMessage
  | WebSubmitScoreMessage
  | WebLeaderboardMessage
  | WebPaintMessage;

export type InitResponse = {
  type: "init";
  data: {
    daily: DailyData;
    leaderboard: LeaderboardEntry[];
    paint?: string;
  };
};

export type LeaderboardResponse = {
  type: "leaderboard";
  data: {
    leaderboard: LeaderboardEntry[];
  };
};

export type SubmitScoreResponse = {
  type: "submitScore";
  data: {
    accepted: boolean;
    leaderboard: LeaderboardEntry[];
  };
};

export type ErrorResponse = {
  type: "error";
  error: string;
};

export type ServerMessage =
  | InitResponse
  | LeaderboardResponse
  | SubmitScoreResponse
  | ErrorResponse;
