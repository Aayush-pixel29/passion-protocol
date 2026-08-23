"use client";

import { useMemo, useState } from "react";
import { vibeScore } from "@/lib/match";
import type { VibeAnswers } from "@/lib/types";
import styles from "./SynergyProof.module.css";

type Axis = { key: keyof VibeAnswers; label: string; icon: string };

const AXES: Axis[] = [
  { key: "pace", label: "Pace", icon: "⚡" },
  { key: "comms", label: "Comms", icon: "💬" },
  { key: "risk", label: "Risk", icon: "🎲" },
  { key: "energy", label: "Energy", icon: "🔥" },
];

function tier(score: number): string {
  if (score >= 90) return "Exceptional match";
  if (score >= 75) return "Strong match";
  if (score >= 55) return "Workable match";
  return "Low compatibility";
}

export function SynergyProof() {
  const [you, setYou] = useState<VibeAnswers>({ pace: 4, comms: 3, risk: 4, energy: 3 });
  const [them, setThem] = useState<VibeAnswers>({ pace: 4, comms: 4, risk: 3, energy: 4 });

  const deltas = useMemo(
    () => AXES.map((a) => ({ ...a, delta: Math.abs(you[a.key] - them[a.key]) })),
    [you, them]
  );
  const totalDistance = deltas.reduce((sum, d) => sum + d.delta, 0);
  const score = vibeScore(you, them);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.eyebrow}>Try the actual formula</span>
        <div className={styles.scoreWrap}>
          <span className={styles.scoreValue}>{score}%</span>
          <span className={styles.scoreTier}>{tier(score)}</span>
        </div>
      </div>

      <div className={styles.axes}>
        {deltas.map((axis) => (
          <div key={axis.key} className={styles.axisRow}>
            <div className={styles.axisLabel}>
              <span aria-hidden="true">{axis.icon}</span>
              <span>{axis.label}</span>
            </div>
            <div className={styles.sliderCol}>
              <input
                type="range"
                min={1}
                max={5}
                value={you[axis.key]}
                onChange={(e) =>
                  setYou((prev) => ({ ...prev, [axis.key]: Number(e.target.value) }))
                }
                className={`${styles.slider} ${styles.sliderYou}`}
                aria-label={`Your ${axis.label}, 1 to 5`}
              />
              <span className={styles.sliderTag}>You: {you[axis.key]}</span>
            </div>
            <div className={styles.sliderCol}>
              <input
                type="range"
                min={1}
                max={5}
                value={them[axis.key]}
                onChange={(e) =>
                  setThem((prev) => ({ ...prev, [axis.key]: Number(e.target.value) }))
                }
                className={`${styles.slider} ${styles.sliderThem}`}
                aria-label={`Their ${axis.label}, 1 to 5`}
              />
              <span className={styles.sliderTag}>Them: {them[axis.key]}</span>
            </div>
            <span className={styles.delta}>Δ{axis.delta}</span>
          </div>
        ))}
      </div>

      <div className={styles.formula}>
        <span>
          Score = 100 − (Σ|Δ| ÷ 16) × 100 = 100 − ({totalDistance} ÷ 16) × 100 ={" "}
          <strong>{score}</strong>
        </span>
      </div>
    </div>
  );
}
