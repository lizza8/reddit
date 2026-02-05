import React from "react";
import type { Enemy } from "./types";

const TYPE_COLORS: Record<Enemy["type"], string> = {
  sparrow: "#FF6B6B",
  owl: "#B39DDB",
  eagle: "#FFD166",
  crow: "#90A4AE",
  hummingbird: "#7CFF6B",
};

export function EnemyBird({ enemy }: { enemy: Enemy }): JSX.Element {
  return (
    <group ref={enemy.ref} position={enemy.spawn.toArray()}>
      <mesh>
        <sphereGeometry args={[1.1, 14, 14]} />
        <meshStandardMaterial color={TYPE_COLORS[enemy.type]} emissive="#1B233F" />
      </mesh>
      <mesh position={[0, 0, 1.1]}>
        <coneGeometry args={[0.35, 0.7, 8]} />
        <meshStandardMaterial color="#FFB74D" />
      </mesh>
      <mesh position={[0.9, 0, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[1.2, 0.15, 0.6]} />
        <meshStandardMaterial color="#F5F1FF" />
      </mesh>
      <mesh position={[-0.9, 0, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[1.2, 0.15, 0.6]} />
        <meshStandardMaterial color="#F5F1FF" />
      </mesh>
    </group>
  );
}
