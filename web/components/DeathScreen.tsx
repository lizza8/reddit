import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../stores/gameStore";
import { sendWebMessage } from "../utils/devvit";

const PRESET_COLORS = ["#7EDBFF", "#FF6BCB", "#FFE66D", "#7CFF6B", "#FFB74D"];

export function DeathScreen(): JSX.Element {
  const daily = useGameStore((state) => state.daily);
  const score = useGameStore((state) => state.score);
  const kills = useGameStore((state) => state.kills);
  const startedAt = useGameStore((state) => state.startedAt);
  const leaderboard = useGameStore((state) => state.leaderboard);
  const resetRun = useGameStore((state) => state.resetRun);
  const captureCanvas = useGameStore((state) => state.captureCanvas);
  const paint = useGameStore((state) => state.paint);
  const setPaint = useGameStore((state) => state.setPaint);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const durationMs = Date.now() - startedAt;
  const timeLabel = useMemo(() => formatDuration(durationMs), [durationMs]);

  const handleShare = async () => {
    if (!captureCanvas) {
      setShareStatus("No canvas yet");
      return;
    }
    setShareStatus(null);
    const blob = await new Promise<Blob | null>((resolve) =>
      captureCanvas.toBlob((value) => resolve(value), "image/png")
    );
    if (!blob) {
      setShareStatus("Share failed");
      return;
    }

    if (navigator.share) {
      try {
        const file = new File([blob], "birdblitz.png", { type: "image/png" });
        await navigator.share({
          files: [file],
          title: "BirdBlitz Royale",
          text: `Score ${score} • ${kills} frags`,
        });
        setShareStatus("Shared!");
        return;
      } catch {
        // Fall through to download.
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "birdblitz.png";
    link.click();
    URL.revokeObjectURL(url);
    setShareStatus("Saved PNG");
  };

  const applyPaint = (value: string) => {
    setPaint(value);
    sendWebMessage({ type: "paint", paint: value });
  };

  return (
    <div style={styles.overlay}>
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={styles.title}>Blitz Complete</div>
        <div style={styles.subtitle}>{daily?.date ?? "Daily Arena"} • {timeLabel}</div>

        <div style={styles.scoreRow}>
          <div style={styles.scoreItem}>
            <div style={styles.label}>Score</div>
            <div style={styles.value}>{score}</div>
          </div>
          <div style={styles.scoreItem}>
            <div style={styles.label}>Frags</div>
            <div style={styles.value}>{kills}</div>
          </div>
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            style={styles.primary}
            onClick={() => {
              if (daily) {
                resetRun(daily);
              }
            }}
          >
            Play Again
          </button>
          <button type="button" style={styles.secondary} onClick={handleShare}>
            Share
          </button>
        </div>
        {shareStatus ? <div style={styles.shareStatus}>{shareStatus}</div> : null}

        <div style={styles.sectionTitle}>Leaderboard</div>
        <div style={styles.leaderboard}>
          {leaderboard.length === 0 ? (
            <div style={styles.leaderEmpty}>No scores yet. Be the first!</div>
          ) : (
            leaderboard.map((entry, index) => (
              <div key={`${entry.userId}-${entry.score}-${index}`} style={styles.leaderRow}>
                <span style={styles.leaderRank}>#{index + 1}</span>
                <span style={styles.leaderScore}>{entry.score}</span>
                <span style={styles.leaderMeta}>{entry.kills} frags</span>
              </div>
            ))
          )}
        </div>

        <div style={styles.sectionTitle}>Paint Your Bird</div>
        <div style={styles.paintRow}>
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              style={{
                ...styles.paintSwatch,
                background: color,
                borderColor: paint === color ? "white" : "transparent",
              }}
              onClick={() => applyPaint(color)}
            />
          ))}
          <input
            type="color"
            value={paint}
            onChange={(event) => applyPaint(event.target.value)}
            style={styles.colorInput}
            aria-label="Custom color"
          />
        </div>
      </motion.div>
    </div>
  );
}

function formatDuration(durationMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(6, 10, 28, 0.7)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 12,
  },
  card: {
    width: "min(360px, 92vw)",
    padding: "18px 18px 20px",
    borderRadius: 18,
    background: "rgba(12,18,40,0.95)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  scoreRow: {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  scoreItem: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(8,12,24,0.6)",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  label: {
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)",
  },
  value: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: 700,
  },
  actions: {
    marginTop: 14,
    display: "flex",
    gap: 10,
  },
  primary: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(130deg, #7EDBFF, #6C63FF)",
    color: "#0B1026",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  secondary: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(8,12,24,0.6)",
    color: "white",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  shareStatus: {
    marginTop: 8,
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)",
  },
  leaderboard: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    maxHeight: 140,
    overflow: "auto",
  },
  leaderRow: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: 8,
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 10,
    background: "rgba(10,14,28,0.6)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  leaderRank: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
  },
  leaderScore: {
    fontWeight: 700,
  },
  leaderMeta: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
  },
  leaderEmpty: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    padding: "6px 2px",
  },
  paintRow: {
    marginTop: 10,
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  paintSwatch: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "2px solid transparent",
  },
  colorInput: {
    width: 34,
    height: 34,
    border: "none",
    padding: 0,
    background: "transparent",
  },
};
