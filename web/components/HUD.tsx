import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../stores/gameStore";

export function HUD(): JSX.Element {
  const score = useGameStore((state) => state.score);
  const kills = useGameStore((state) => state.kills);
  const wave = useGameStore((state) => state.wave);
  const lives = useGameStore((state) => state.lives);
  const arenaRadius = useGameStore((state) => state.arenaRadius);
  const powerups = useGameStore((state) => state.powerups);

  const danger = arenaRadius < 40;
  const hudColor = useMemo(() => (danger ? "#FF6B6B" : "#7EDBFF"), [danger]);

  return (
    <div style={styles.root}>
      <div style={styles.topRow}>
        <div style={{ ...styles.card, borderColor: hudColor }}>
          <div style={styles.label}>Score</div>
          <motion.div key={score} style={styles.value} initial={{ scale: 1 }} animate={{ scale: [1, 1.2, 1] }}>
            {score}
          </motion.div>
        </div>
        <div style={styles.card}>
          <div style={styles.label}>Wave</div>
          <div style={styles.value}>{wave}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.label}>Lives</div>
          <div style={styles.value}>{lives}</div>
        </div>
      </div>

      <div style={styles.bottomRow}>
        <div style={styles.tag}>Kills {kills}</div>
        <div style={styles.tag}>Storm {Math.round(arenaRadius)}m</div>
        {powerups.shield > 0 ? <div style={styles.tag}>Shield</div> : null}
        {powerups.multi > 0 ? <div style={styles.tag}>Multi</div> : null}
        {powerups.speed > 0 ? <div style={styles.tag}>Speed</div> : null}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "absolute",
    inset: "16px 16px auto 16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    zIndex: 4,
    pointerEvents: "none",
  },
  topRow: {
    display: "flex",
    gap: 10,
  },
  bottomRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  card: {
    minWidth: 88,
    padding: "8px 12px",
    borderRadius: 12,
    background: "rgba(10,14,28,0.6)",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  label: {
    fontSize: 10,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)",
  },
  value: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 4,
  },
  tag: {
    padding: "6px 10px",
    borderRadius: 10,
    background: "rgba(12,18,35,0.7)",
    border: "1px solid rgba(255,255,255,0.15)",
    fontSize: 11,
  },
};
