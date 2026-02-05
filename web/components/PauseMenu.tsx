import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../stores/gameStore";

export function PauseMenu(): JSX.Element {
  const setPaused = useGameStore((state) => state.setPaused);
  const daily = useGameStore((state) => state.daily);
  const resetRun = useGameStore((state) => state.resetRun);
  const score = useGameStore((state) => state.score);
  const wave = useGameStore((state) => state.wave);

  return (
    <div style={styles.overlay}>
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={styles.title}>Paused</div>
        <div style={styles.subtitle}>Score {score} | Wave {wave}</div>
        <div style={styles.actions}>
          <button type="button" style={styles.primary} onClick={() => setPaused(false)}>
            Resume
          </button>
          <button
            type="button"
            style={styles.secondary}
            onClick={() => {
              if (daily) {
                resetRun(daily);
              }
              setPaused(false);
            }}
          >
            Restart
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(5,8,20,0.55)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  card: {
    width: "min(320px, 85vw)",
    padding: "20px 18px",
    borderRadius: 18,
    background: "rgba(12,18,40,0.9)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  actions: {
    marginTop: 16,
    display: "flex",
    gap: 10,
    justifyContent: "center",
  },
  primary: {
    padding: "10px 16px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(120deg, #7EDBFF, #6C63FF)",
    color: "#0B1026",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  secondary: {
    padding: "10px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(10,14,28,0.6)",
    color: "white",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
};
