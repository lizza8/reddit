import React, { forwardRef, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color } from "three";
import { useGameStore } from "../stores/gameStore";

export const BirdPlayer = forwardRef<THREE.Group, { paint: string }>(function BirdPlayer(
  { paint },
  ref
) {
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const isFlapping = useGameStore((state) => state.isFlapping);
  const shield = useGameStore((state) => state.powerups.shield);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const flap = Math.sin(time * (isFlapping ? 10 : 4)) * (isFlapping ? 0.7 : 0.25);
    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = 0.4 + flap;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = -0.4 - flap;
    }
    if (auraRef.current) {
      auraRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
      const auraColor = new Color().setHSL((time * 0.15) % 1, 0.7, 0.6);
      const auraMaterial = auraRef.current.material as THREE.MeshStandardMaterial;
      auraMaterial.color.copy(auraColor);
      auraMaterial.emissive.copy(auraColor);
    }
    if (bodyMaterialRef.current) {
      const base = new Color(paint);
      const tint = new Color().setHSL((time * 0.08) % 1, 0.5, 0.6);
      bodyMaterialRef.current.color.copy(base.lerp(tint, 0.25));
    }
  });

  return (
    <group ref={ref} position={[0, 6, 0]}>
      <mesh>
        <sphereGeometry args={[1.2, 18, 18]} />
        <meshStandardMaterial ref={bodyMaterialRef} color={paint} emissive="#3A7BFF" emissiveIntensity={0.4} />
      </mesh>
      <mesh ref={rightWingRef} position={[1.2, 0, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[1.6, 0.2, 0.8]} />
        <meshStandardMaterial color="#F7F0FF" />
      </mesh>
      <mesh ref={leftWingRef} position={[-1.2, 0, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[1.6, 0.2, 0.8]} />
        <meshStandardMaterial color="#F7F0FF" />
      </mesh>
      <mesh position={[0, 0, 1.2]}>
        <coneGeometry args={[0.4, 0.9, 10]} />
        <meshStandardMaterial color="#FFB74D" />
      </mesh>
      <mesh ref={auraRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshStandardMaterial color="#5ED2FF" transparent opacity={0.12} emissive="#5ED2FF" />
      </mesh>
      {shield > 0 ? (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2.6, 20, 20]} />
          <meshStandardMaterial color="#7EDBFF" transparent opacity={0.18} emissive="#7EDBFF" />
        </mesh>
      ) : null}
    </group>
  );
});
