import type { Vector3 } from "three";
import type React from "react";

export type Enemy = {
  id: string;
  type: "sparrow" | "owl" | "eagle" | "crow" | "hummingbird";
  speed: number;
  health: number;
  ref: React.RefObject<THREE.Group>;
  velocity: Vector3;
  spawn: Vector3;
  lastShot: number;
};
