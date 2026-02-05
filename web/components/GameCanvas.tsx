import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Color, Vector3 } from "three";
import { Arena } from "./Arena";
import { BirdPlayer } from "./BirdPlayer";
import { EnemyBird } from "./EnemyBird";
import type { Enemy } from "./types";
import { useGameStore } from "../stores/gameStore";
import { sendWebMessage } from "../utils/devvit";
import type { DailyData, PowerupConfig } from "../../src/messages";

const UP = new Vector3(0, 1, 0);

type Bullet = {
  id: string;
  ref: React.RefObject<THREE.Mesh>;
  velocity: Vector3;
  life: number;
};

type EnemyBullet = {
  id: string;
  ref: React.RefObject<THREE.Mesh>;
  velocity: Vector3;
  life: number;
};

type Powerup = PowerupConfig & { active: boolean };

export function GameCanvas(): JSX.Element {
  return (
    <Canvas
      camera={{ position: [0, 10, 22], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene />
    </Canvas>
  );
}

function Scene(): JSX.Element {
  const daily = useGameStore((state) => state.daily);
  const joystick = useGameStore((state) => state.joystick);
  const isFiring = useGameStore((state) => state.isFiring);
  const isFlapping = useGameStore((state) => state.isFlapping);
  const score = useGameStore((state) => state.score);
  const kills = useGameStore((state) => state.kills);
  const lives = useGameStore((state) => state.lives);
  const wave = useGameStore((state) => state.wave);
  const arenaRadius = useGameStore((state) => state.arenaRadius);
  const isDead = useGameStore((state) => state.isDead);
  const isPaused = useGameStore((state) => state.isPaused);
  const powerups = useGameStore((state) => state.powerups);
  const paint = useGameStore((state) => state.paint);
  const addScore = useGameStore((state) => state.addScore);
  const addKill = useGameStore((state) => state.addKill);
  const setWave = useGameStore((state) => state.setWave);
  const damage = useGameStore((state) => state.damage);
  const setArenaRadius = useGameStore((state) => state.setArenaRadius);
  const markDead = useGameStore((state) => state.markDead);
  const pushReplay = useGameStore((state) => state.pushReplay);
  const tickPowerups = useGameStore((state) => state.tickPowerups);
  const setCaptureCanvas = useGameStore((state) => state.setCaptureCanvas);

  const playerRef = useRef<THREE.Group>(null);
  const velocityRef = useRef(new Vector3());
  const lastDirRef = useRef(new Vector3(0, 0, -1));
  const bulletsRef = useRef<Bullet[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const enemyBulletsRef = useRef<EnemyBullet[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<EnemyBullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const powerupsRef = useRef<Powerup[]>([]);
  const [powerupItems, setPowerupItems] = useState<Powerup[]>([]);
  const waveIndexRef = useRef(0);
  const lastShotRef = useRef(0);
  const lastDamageRef = useRef(0);
  const lastHitRef = useRef(0);
  const submittedRef = useRef(false);

  const { gl, camera } = useThree();

  useEffect(() => {
    setCaptureCanvas(gl.domElement as HTMLCanvasElement);
  }, [gl, setCaptureCanvas]);

  useEffect(() => {
    if (!daily) {
      return;
    }
    spawnWave(daily, 0, setEnemies, enemiesRef);
    setWave(1);
    waveIndexRef.current = 0;
    const items = daily.powerups.map((powerup) => ({ ...powerup, active: true }));
    powerupsRef.current = items;
    setPowerupItems(items);
    bulletsRef.current = [];
    setBullets([]);
    enemyBulletsRef.current = [];
    setEnemyBullets([]);
    submittedRef.current = false;
  }, [daily, setWave]);

  const sceneColor = useMemo(() => new Color("#05060E"), []);

  useFrame((state, delta) => {
    if (!daily || !playerRef.current || isDead || isPaused) {
      return;
    }

    const now = state.clock.elapsedTime;
    const player = playerRef.current;
    const velocity = velocityRef.current;
    const speedBoost = powerups.speed > 0 ? 1.4 : 1.0;
    const baseSpeed = 12 * speedBoost;
    const input = new Vector3(joystick.x, 0, joystick.y);

    if (input.lengthSq() > 0.01) {
      lastDirRef.current.copy(input).normalize();
    }

    const targetVelocity = input.multiplyScalar(baseSpeed);
    velocity.lerp(targetVelocity, 0.12);

    if (isFlapping) {
      velocity.y = Math.min(velocity.y + 18 * delta, 6);
    }

    velocity.y -= 9.8 * delta;
    player.position.addScaledVector(velocity, delta);
    player.position.y = Math.max(2, Math.min(30, player.position.y));

    const targetYaw = Math.atan2(lastDirRef.current.x, lastDirRef.current.z);
    player.rotation.y = player.rotation.y + (targetYaw - player.rotation.y) * 0.12;

    const arenaShrink = Math.max(26, daily.arenaRadius - now * 0.28);
    setArenaRadius(arenaShrink);

    const distanceFromCenter = Math.hypot(player.position.x, player.position.z);
    if (distanceFromCenter > arenaShrink && now - lastDamageRef.current > 0.8) {
      if (powerups.shield <= 0) {
        damage(1);
      }
      lastDamageRef.current = now;
    }

    if (isFiring && now - lastShotRef.current > 0.18) {
      const direction = lastDirRef.current.clone().normalize();
      const bullet: Bullet = {
        id: `b-${now}-${Math.random()}`,
        ref: React.createRef<THREE.Mesh>(),
        velocity: direction.multiplyScalar(32),
        life: 2.2,
      };
      bulletsRef.current = [...bulletsRef.current, bullet];
      setBullets(bulletsRef.current);
      lastShotRef.current = now;
    }

    bulletsRef.current.forEach((bullet) => {
      if (!bullet.ref.current) {
        return;
      }
      bullet.ref.current.position.addScaledVector(bullet.velocity, delta);
      bullet.life -= delta;
    });

    bulletsRef.current = bulletsRef.current.filter((bullet) => bullet.life > 0);
    if (bullets.length !== bulletsRef.current.length) {
      setBullets(bulletsRef.current);
    }

    enemiesRef.current.forEach((enemy) => {
      if (!enemy.ref.current) {
        return;
      }
      const toPlayer = player.position.clone().sub(enemy.ref.current.position);
      const distance = toPlayer.length();
      const seek = toPlayer.normalize().multiplyScalar(enemy.speed);
      enemy.velocity.lerp(seek, 0.05);
      enemy.ref.current.position.addScaledVector(enemy.velocity, delta);

      if (now - enemy.lastShot > 1.6 && distance < 60) {
        enemy.lastShot = now;
        const shot: EnemyBullet = {
          id: `e-${enemy.id}-${now}`,
          ref: React.createRef<THREE.Mesh>(),
          velocity: toPlayer.normalize().multiplyScalar(18),
          life: 3.2,
        };
        enemyBulletsRef.current = [...enemyBulletsRef.current, shot];
        setEnemyBullets(enemyBulletsRef.current);
      }
    });

    enemyBulletsRef.current.forEach((bullet) => {
      if (!bullet.ref.current) {
        return;
      }
      bullet.ref.current.position.addScaledVector(bullet.velocity, delta);
      bullet.life -= delta;
      const hitDistance = bullet.ref.current.position.distanceTo(player.position);
      if (hitDistance < 1.6 && now - lastHitRef.current > 0.35) {
        if (powerups.shield <= 0) {
          damage(1);
        }
        bullet.life = 0;
        lastHitRef.current = now;
      }
    });

    enemyBulletsRef.current = enemyBulletsRef.current.filter((bullet) => bullet.life > 0);
    if (enemyBullets.length !== enemyBulletsRef.current.length) {
      setEnemyBullets(enemyBulletsRef.current);
    }

    bulletsRef.current.forEach((bullet) => {
      const bulletMesh = bullet.ref.current;
      if (!bulletMesh) {
        return;
      }
      enemiesRef.current.forEach((enemy) => {
        const enemyMesh = enemy.ref.current;
        if (!enemyMesh) {
          return;
        }
        const dist = bulletMesh.position.distanceTo(enemyMesh.position);
        if (dist < 2) {
          enemy.health -= powerups.multi > 0 ? 2 : 1;
          bullet.life = 0;
          if (enemy.health <= 0) {
            addScore(120);
            addKill();
            enemyMesh.position.set(9999, 9999, 9999);
          }
        }
      });
    });

    const aliveEnemies = enemiesRef.current.filter((enemy) => enemy.health > 0);
    if (aliveEnemies.length !== enemiesRef.current.length) {
      enemiesRef.current = aliveEnemies;
      setEnemies(aliveEnemies);
    }

    if (aliveEnemies.length === 0 && daily.waves.length > 0) {
      const nextWave = waveIndexRef.current + 1;
      if (nextWave < daily.waves.length) {
        waveIndexRef.current = nextWave;
        setWave(nextWave + 1);
        spawnWave(daily, nextWave, setEnemies, enemiesRef);
        addScore(200);
      }
    }

    powerupsRef.current.forEach((powerup) => {
      if (!powerup.active) {
        return;
      }
      const dist = player.position.distanceTo(new Vector3(powerup.x, powerup.y, powerup.z));
      if (dist < 3) {
        powerup.active = false;
        if (powerup.type === "shield") {
          useGameStore.getState().grantPowerup("shield", 6);
        }
        if (powerup.type === "multi") {
          useGameStore.getState().grantPowerup("multi", 6);
        }
        if (powerup.type === "speed") {
          useGameStore.getState().grantPowerup("speed", 6);
        }
        setPowerupItems([...powerupsRef.current]);
        addScore(80);
      }
    });

    tickPowerups(delta);

    pushReplay({
      t: Math.round(now * 1000),
      x: player.position.x,
      y: player.position.y,
      z: player.position.z,
      r: player.rotation.y,
    });

    if (lives <= 0 && !submittedRef.current) {
      submittedRef.current = true;
      markDead();
      sendWebMessage({
        type: "submitScore",
        score,
        kills,
        durationMs: Math.round(now * 1000),
        replay: useGameStore.getState().replay,
      });
    }

    camera.position.lerp(
      new Vector3(player.position.x, player.position.y + 8, player.position.z + 18),
      0.08
    );
    camera.lookAt(player.position.clone().add(UP));
  });

  return (
    <>
      <color attach="background" args={[sceneColor]} />
      <fog attach="fog" args={["#060814", 30, 160]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.1} color="#FFF7D6" />
      <Arena islands={daily?.islands ?? []} radius={arenaRadius} />
      <BirdPlayer ref={playerRef} paint={paint} />
      {enemies.map((enemy) => (
        <EnemyBird key={enemy.id} enemy={enemy} />
      ))}
      {bullets.map((bullet) => (
        <mesh key={bullet.id} ref={bullet.ref} position={[0, 0, 0]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshStandardMaterial color="#FFE66D" emissive="#FFB400" />
        </mesh>
      ))}
      {enemyBullets.map((bullet) => (
        <mesh key={bullet.id} ref={bullet.ref} position={[0, 0, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#FF6B6B" emissive="#FF375F" />
        </mesh>
      ))}
      {powerupItems
        .filter((powerup) => powerup.active)
        .map((powerup) => (
          <mesh key={powerup.id} position={[powerup.x, powerup.y, powerup.z]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial
              color={powerup.type === "shield" ? "#7EDBFF" : powerup.type === "multi" ? "#FF6BCB" : "#7CFF6B"}
              emissive={powerup.type === "shield" ? "#3B9DFF" : powerup.type === "multi" ? "#FF4FA0" : "#55FF7A"}
              emissiveIntensity={1.4}
            />
          </mesh>
        ))}
    </>
  );
}

function spawnWave(
  daily: DailyData,
  waveIndex: number,
  setEnemies: React.Dispatch<React.SetStateAction<Enemy[]>>,
  enemiesRef: React.MutableRefObject<Enemy[]>
): void {
  const wave = daily.waves[waveIndex];
  if (!wave) {
    return;
  }
  const next: Enemy[] = [];
  const spawnRadius = daily.arenaRadius - 6;
  wave.enemies.forEach((group, index) => {
    for (let i = 0; i < group.count; i += 1) {
      const angle = (i / group.count) * Math.PI * 2 + index;
      const spawn = new Vector3(
        Math.cos(angle) * spawnRadius,
        6 + (i % 4) * 1.4,
        Math.sin(angle) * spawnRadius
      );
      next.push({
        id: `${wave.id}-${group.type}-${i}`,
        type: group.type,
        speed: group.speed,
        health: group.health,
        ref: React.createRef<THREE.Group>(),
        velocity: new Vector3(Math.cos(angle), 0, Math.sin(angle)),
        spawn,
        lastShot: 0,
      });
    }
  });
  enemiesRef.current = next;
  setEnemies(next);
}
