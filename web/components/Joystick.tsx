import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../stores/gameStore";

type StickState = {
  x: number;
  y: number;
  active: boolean;
};

const STICK_RADIUS = 46;
const DEADZONE = 6;

export function Joystick(): JSX.Element {
  const setJoystick = useGameStore((state) => state.setJoystick);
  const setFiring = useGameStore((state) => state.setFiring);
  const setFlapping = useGameStore((state) => state.setFlapping);
  const setPaused = useGameStore((state) => state.setPaused);
  const isPaused = useGameStore((state) => state.isPaused);
  const isDead = useGameStore((state) => state.isDead);

  const baseRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const [stick, setStick] = useState<StickState>({ x: 0, y: 0, active: false });

  const knobStyle = useMemo(
    () => ({
      transform: `translate(${stick.x}px, ${stick.y}px)`,
      opacity: stick.active ? 1 : 0.6,
    }),
    [stick]
  );

  useEffect(() => {
    return () => {
      setJoystick({ x: 0, y: 0, active: false });
      setFiring(false);
      setFlapping(false);
    };
  }, [setFiring, setFlapping, setJoystick]);

  useEffect(() => {
    if (!isDead) {
      return;
    }
    setJoystick({ x: 0, y: 0, active: false });
    setFiring(false);
    setFlapping(false);
  }, [isDead, setFiring, setFlapping, setJoystick]);

  const updateStick = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) {
      return;
    }
    const rect = base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.hypot(dx, dy);
    const limited = Math.min(distance, STICK_RADIUS);
    const angle = Math.atan2(dy, dx);
    const x = Math.cos(angle) * limited;
    const y = Math.sin(angle) * limited;
    const active = distance > DEADZONE;
    setStick({ x, y, active });
    setJoystick({
      x: active ? x / STICK_RADIUS : 0,
      y: active ? -y / STICK_RADIUS : 0,
      active,
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateStick(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }
    updateStick(event.clientX, event.clientY);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }
    pointerIdRef.current = null;
    setStick({ x: 0, y: 0, active: false });
    setJoystick({ x: 0, y: 0, active: false });
  };

  const handleFireDown = () => setFiring(true);
  const handleFireUp = () => setFiring(false);
  const handleFlapDown = () => setFlapping(true);
  const handleFlapUp = () => setFlapping(false);

  if (isDead) {
    return null;
  }

  return (
    <div style={styles.root}>
      <div
        ref={baseRef}
        style={styles.joystickBase}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div style={styles.joystickRing} />
        <div style={{ ...styles.joystickKnob, ...knobStyle }} />
        <div style={styles.joystickLabel}>Move</div>
      </div>

      <div style={styles.actions}>
        <motion.button
          type="button"
          style={styles.actionButton}
          onPointerDown={handleFlapDown}
          onPointerUp={handleFlapUp}
          onPointerLeave={handleFlapUp}
          onPointerCancel={handleFlapUp}
          whileTap={{ scale: 0.96 }}
        >
          Flap
        </motion.button>
        <motion.button
          type="button"
          style={{ ...styles.actionButton, ...styles.fireButton }}
          onPointerDown={handleFireDown}
          onPointerUp={handleFireUp}
          onPointerLeave={handleFireUp}
          onPointerCancel={handleFireUp}
          whileTap={{ scale: 0.96 }}
        >
          Fire
        </motion.button>
      </div>

      <button
        type="button"
        style={styles.pauseButton}
        onClick={() => setPaused(!isPaused)}
      >
        {isPaused ? "Resume" : "Pause"}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 6,
  },
  joystickBase: {
    position: "absolute",
    left: 18,
    bottom: 22,
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: "rgba(10,14,28,0.45)",
    border: "1px solid rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    touchAction: "none",
    pointerEvents: "auto",
  },
  joystickRing: {
    position: "absolute",
    inset: 14,
    borderRadius: "50%",
    border: "1px dashed rgba(255,255,255,0.25)",
  },
  joystickKnob: {
    width: 46,
    height: 46,
    borderRadius: "50%",
    background: "linear-gradient(160deg, #7EDBFF, #6C63FF)",
    boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
    transition: "opacity 0.2s ease",
  },
  joystickLabel: {
    position: "absolute",
    bottom: 10,
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  actions: {
    position: "absolute",
    right: 18,
    bottom: 30,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    pointerEvents: "auto",
  },
  actionButton: {
    width: 84,
    height: 84,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(14,18,34,0.75)",
    color: "white",
    fontSize: 12,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontWeight: 700,
    boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
    touchAction: "none",
  },
  fireButton: {
    background: "linear-gradient(140deg, #FF6BCB, #FFB74D)",
    color: "#1B1029",
  },
  pauseButton: {
    position: "absolute",
    top: 18,
    right: 18,
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(10,14,28,0.6)",
    color: "white",
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    pointerEvents: "auto",
  },
};
