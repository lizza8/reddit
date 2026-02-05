import React, { useMemo } from "react";
import type { IslandConfig } from "../../src/messages";

export function Arena({ islands, radius }: { islands: IslandConfig[]; radius: number }): JSX.Element {
  const arenaColor = useMemo(() => (radius < 40 ? "#FF6B6B" : "#3B82F6"), [radius]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial color="#0B1227" />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={arenaColor} transparent opacity={0.08} />
      </mesh>
      {islands.map((island, index) => (
        <group key={`island-${index}`} position={[island.x, island.y, island.z]}>
          <mesh>
            <sphereGeometry args={[island.radius, 18, 18]} />
            <meshStandardMaterial color={island.color} />
          </mesh>
          <mesh position={[0, -island.height / 2, 0]}>
            <cylinderGeometry args={[island.radius * 0.6, island.radius * 0.9, island.height, 12]} />
            <meshStandardMaterial color="#1B2A48" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
