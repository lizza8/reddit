import type { DailyData, IslandConfig, PowerupConfig, WaveConfig } from "./messages";

export function getDailySeed(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const COLORS = ["#7CFF6B", "#FFB74D", "#7EDBFF", "#FF6BCB", "#FFE66D"];

export function createDailyData(date: string): DailyData {
  const seed = hashSeed(date);
  const rng = mulberry32(seed);
  const islands: IslandConfig[] = Array.from({ length: 20 }).map((_, i) => ({
    x: (rng() - 0.5) * 140,
    y: rng() * 18 + 2,
    z: (rng() - 0.5) * 140,
    radius: rng() * 8 + 6,
    height: rng() * 6 + 2,
    color: COLORS[i % COLORS.length],
  }));

  const powerups: PowerupConfig[] = Array.from({ length: 50 }).map((_, i) => ({
    id: `p-${i}`,
    x: (rng() - 0.5) * 140,
    y: rng() * 20 + 4,
    z: (rng() - 0.5) * 140,
    type: rng() > 0.66 ? "shield" : rng() > 0.33 ? "multi" : "speed",
  }));

  const waves: WaveConfig[] = Array.from({ length: 10 }).map((_, i) => ({
    id: `wave-${i + 1}`,
    enemies: [
      {
        type: rng() > 0.7 ? "eagle" : rng() > 0.4 ? "owl" : "sparrow",
        count: Math.floor(rng() * 6 + 6 + i * 2),
        speed: 6 + i * 0.4,
        health: rng() > 0.6 ? 3 + i * 0.5 : 2 + i * 0.35,
      },
      {
        type: rng() > 0.5 ? "crow" : "hummingbird",
        count: Math.floor(rng() * 4 + 2 + i),
        speed: 7 + i * 0.5,
        health: 1 + i * 0.2,
      },
    ],
    hazard: rng() > 0.7 ? "lightning" : rng() > 0.5 ? "wind" : undefined,
  }));

  const modifiers = [
    rng() > 0.6 ? "Chaos Storm" : "Calm Skies",
    rng() > 0.5 ? "Feather Frenzy" : "Precision Shots",
  ];

  return {
    date,
    seed,
    arenaRadius: 85,
    islands,
    powerups,
    waves,
    modifiers,
  };
}
