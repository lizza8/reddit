import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { GameCanvas } from "./components/GameCanvas";
import { HUD } from "./components/HUD";
import { Joystick } from "./components/Joystick";
import { PauseMenu } from "./components/PauseMenu";
import { DeathScreen } from "./components/DeathScreen";
import { useDailyData } from "./hooks/useDailyData";
import { useGameStore } from "./stores/gameStore";

export default function App(): JSX.Element {
    const { loading, error } = useDailyData();
    const isDead = useGameStore((state) => state.isDead);
    const isPaused = useGameStore((state) => state.isPaused);
    const daily = useGameStore((state) => state.daily);
    const resetRun = useGameStore((state) => state.resetRun);

    useEffect(() => {
        if (daily) {
            resetRun(daily);
        }
    }, [daily, resetRun]);

    return (
        <div style={styles.shell}>
            <GameCanvas />
            <HUD />
            <Joystick />

            {loading ? <div style={styles.loading}>Spawning birds...</div> : null}
            {error ? <div style={styles.error}>{error}</div> : null}

            <motion.div style={styles.banner} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={styles.title}>BirdBlitz Royale</div>
                <div style={styles.subtitle}>
                    {daily?.date ?? "Daily Arena"} | {daily?.modifiers?.[0] ?? "Vibrant Skies"}
                </div>
            </motion.div>

            {isPaused ? <PauseMenu /> : null}
            {isDead ? <DeathScreen /> : null}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    shell: {
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "radial-gradient(circle at 20% 20%, #3B2D74 0%, #0B1026 55%, #05070F 100%)",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "white",
    },
    banner: {
        position: "absolute",
        top: 18,
        left: 18,
        padding: "10px 14px",
        borderRadius: 14,
        background: "rgba(6, 10, 28, 0.6)",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(6px)",
        zIndex: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
    },
    subtitle: {
        fontSize: 11,
        color: "rgba(255,255,255,0.65)",
        marginTop: 4,
    },
    loading: {
        position: "absolute",
        inset: "auto 16px 24px 16px",
        padding: "10px 14px",
        borderRadius: 12,
        background: "rgba(12,18,40,0.8)",
        fontSize: 12,
        zIndex: 6,
    },
    error: {
        position: "absolute",
        inset: "auto 16px 70px 16px",
        padding: "10px 14px",
        borderRadius: 12,
        background: "rgba(255, 90, 90, 0.2)",
        border: "1px solid rgba(255, 90, 90, 0.6)",
        fontSize: 12,
        zIndex: 6,
    },
};
