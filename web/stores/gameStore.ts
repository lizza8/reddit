import { create } from "zustand";
import type { DailyData, GhostFrame, LeaderboardEntry } from "../../src/messages";

export type JoystickState = {
  x: number;
  y: number;
  active: boolean;
};

export type GameStore = {
  daily: DailyData | null;
  leaderboard: LeaderboardEntry[];
  score: number;
  kills: number;
  wave: number;
  lives: number;
  startedAt: number;
  arenaRadius: number;
  isDead: boolean;
  isPaused: boolean;
  joystick: JoystickState;
  isFiring: boolean;
  isFlapping: boolean;
  replay: GhostFrame[];
  captureCanvas: HTMLCanvasElement | null;
  paint: string;
  powerups: { shield: number; multi: number; speed: number };
  setDaily: (daily: DailyData) => void;
  setLeaderboard: (leaderboard: LeaderboardEntry[]) => void;
  setJoystick: (joystick: JoystickState) => void;
  setFiring: (isFiring: boolean) => void;
  setFlapping: (isFlapping: boolean) => void;
  setArenaRadius: (radius: number) => void;
  setPaused: (paused: boolean) => void;
  setCaptureCanvas: (canvas: HTMLCanvasElement | null) => void;
  setPaint: (paint: string) => void;
  addScore: (value: number) => void;
  addKill: () => void;
  setWave: (wave: number) => void;
  damage: (amount: number) => void;
  heal: (amount: number) => void;
  markDead: () => void;
  resetRun: (daily: DailyData) => void;
  pushReplay: (frame: GhostFrame) => void;
  clearReplay: () => void;
  grantPowerup: (type: "shield" | "multi" | "speed", seconds: number) => void;
  tickPowerups: (delta: number) => void;
};

const DEFAULT_PAINT = "#7EDBFF";

export const useGameStore = create<GameStore>((set, get) => ({
  daily: null,
  leaderboard: [],
  score: 0,
  kills: 0,
  wave: 1,
  lives: 3,
  startedAt: Date.now(),
  arenaRadius: 85,
  isDead: false,
  isPaused: false,
  joystick: { x: 0, y: 0, active: false },
  isFiring: false,
  isFlapping: false,
  replay: [],
  captureCanvas: null,
  paint: DEFAULT_PAINT,
  powerups: { shield: 0, multi: 0, speed: 0 },
  setDaily: (daily) => set({ daily, arenaRadius: daily.arenaRadius }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setJoystick: (joystick) => set({ joystick }),
  setFiring: (isFiring) => set({ isFiring }),
  setFlapping: (isFlapping) => set({ isFlapping }),
  setArenaRadius: (arenaRadius) => set({ arenaRadius }),
  setPaused: (isPaused) => set({ isPaused }),
  setCaptureCanvas: (captureCanvas) => set({ captureCanvas }),
  setPaint: (paint) => set({ paint }),
  addScore: (value) => set((state) => ({ score: state.score + value })),
  addKill: () => set((state) => ({ kills: state.kills + 1 })),
  setWave: (wave) => set({ wave }),
  damage: (amount) =>
    set((state) => ({ lives: Math.max(0, state.lives - amount) })),
  heal: (amount) =>
    set((state) => ({ lives: Math.min(5, state.lives + amount) })),
  markDead: () => set({ isDead: true }),
  resetRun: (daily) =>
    set({
      daily,
      score: 0,
      kills: 0,
      wave: 1,
      lives: 3,
      startedAt: Date.now(),
      arenaRadius: daily.arenaRadius,
      isDead: false,
      isPaused: false,
      replay: [],
      powerups: { shield: 0, multi: 0, speed: 0 },
    }),
  pushReplay: (frame) =>
    set((state) => {
      const next = [...state.replay, frame].slice(-360);
      return { replay: next };
    }),
  clearReplay: () => set({ replay: [] }),
  grantPowerup: (type, seconds) =>
    set((state) => ({ powerups: { ...state.powerups, [type]: seconds } })),
  tickPowerups: (delta) => {
    const powerups = get().powerups;
    const next = {
      shield: Math.max(0, powerups.shield - delta),
      multi: Math.max(0, powerups.multi - delta),
      speed: Math.max(0, powerups.speed - delta),
    };
    set({ powerups: next });
  },
}));
