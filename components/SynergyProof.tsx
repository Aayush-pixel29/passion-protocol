"use client";

import { useState, useEffect } from "react";
import { vibeScore } from "@/lib/match";
import type { VibeAnswers } from "@/lib/types";
import { AvatarSVG } from "./Avatar";
import { AdaptiveSlider } from "./ui/AdaptiveSlider";

const AXES: { key: keyof VibeAnswers; label: string; desc: string; icon: string }[] = [
  { key: "pace", label: "Pace", desc: "Sprint vs Methodical", icon: "⚡" },
  { key: "comms", label: "Comms", desc: "Async vs Real-time", icon: "💬" },
  { key: "risk", label: "Risk", desc: "Moonshot vs Calculated", icon: "🎲" },
  { key: "energy", label: "Energy", desc: "Intense vs Steady", icon: "🔋" },
];

const MOCK_POOL = [
  { name: "Alex", role: "Full Stack Engineer", category: "Software & IT", icon: "💻", vibe: { pace: 5, comms: 3, risk: 4, energy: 5 } },
  { name: "Maya", role: "Product Designer", category: "Creative & Design", icon: "🎨", vibe: { pace: 4, comms: 4, risk: 4, energy: 4 } },
  { name: "Elena", role: "Growth Lead", category: "Business & Operations", icon: "💼", vibe: { pace: 2, comms: 5, risk: 2, energy: 3 } },
  { name: "Carlos", role: "Technical Writer", category: "Writing & Content", icon: "✍️", vibe: { pace: 5, comms: 2, risk: 5, energy: 5 } },
];

const PACE_LABELS: Record<number, string> = {
  1: "Deliberate",
  2: "Steady",
  3: "Moderate",
  4: "Fast",
  5: "Hyper-Sprint",
};

export function SynergyProof() {
  const [you, setYou] = useState<VibeAnswers>({ pace: 4, comms: 3, risk: 4, energy: 4 });
  const [bestMatch, setBestMatch] = useState(MOCK_POOL[0]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let max = 0;
    let best = MOCK_POOL[0];
    MOCK_POOL.forEach((p) => {
      const s = vibeScore(you, p.vibe);
      if (s > max) {
        max = s;
        best = p;
      }
    });
    setBestMatch(best);
    setScore(max);
  }, [you]);

  const getTier = (s: number) => {
    if (s >= 90) return { label: "Exceptional Alignment", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" };
    if (s >= 75) return { label: "High Synergy", color: "var(--accent)", bg: "var(--accent-subtle)" };
    if (s >= 60) return { label: "Moderate Synergy", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" };
    return { label: "Divergent Workstyle", color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)" };
  };

  const tier = getTier(score);

  return (
    <div
      style={{
        position: "relative",
        background: "var(--surface)",
        border: "1px solid var(--stroke)",
        borderRadius: "var(--radius-xl)",
        padding: "28px",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--stroke)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
      {/* Top Header & Mathematical Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--accent)",
              boxShadow: "0 0 10px var(--accent)",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-bright)",
            }}
          >
            Live Match Engine
          </span>
        </div>
        <span
          style={{
            fontSize: "11px",
            color: "var(--muted)",
            fontFamily: "var(--font-mono)",
            background: "var(--surface-inset)",
            padding: "3px 8px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--stroke-subtle)",
          }}
        >
          vibeScore(A, B)
        </span>
      </div>

      {/* Holographic Vengence-style Pair Visualizer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 14px",
          background: "linear-gradient(180deg, var(--surface-inset) 0%, transparent 100%)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--stroke-subtle)",
        }}
      >
        {/* User Card */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{ position: "relative" }}>
            <AvatarSVG name="You" size={52} />
            <span
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                fontSize: "11px",
                background: "var(--surface)",
                borderRadius: "50%",
                padding: "2px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              ⚡
            </span>
          </div>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-bright)" }}>You</span>
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>Calibrating</span>
        </div>

        {/* Center Circular Score Visual */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              position: "relative",
              width: "70px",
              height: "70px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="70" height="70" viewBox="0 0 74 74" style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx="37"
                cy="37"
                r="31"
                fill="none"
                stroke="var(--stroke-subtle)"
                strokeWidth="5"
              />
              <circle
                cx="37"
                cy="37"
                r="31"
                fill="none"
                stroke="url(#scoreGradProof)"
                strokeWidth="5"
                strokeDasharray="194.7"
                strokeDashoffset={194.7 - (194.7 * score) / 100}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.4s ease" }}
              />
              <defs>
                <linearGradient id="scoreGradProof" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff3d6e" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <span
              style={{
                position: "absolute",
                fontSize: "20px",
                fontFamily: "var(--font-mono)",
                fontWeight: 800,
                color: "var(--text-bright)",
                letterSpacing: "-0.03em",
              }}
            >
              {score}%
            </span>
          </div>

          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: tier.color,
              background: tier.bg,
              padding: "2px 8px",
              borderRadius: "9999px",
            }}
          >
            {tier.label}
          </span>
        </div>

        {/* Candidate Card */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{ position: "relative" }}>
            <AvatarSVG name={bestMatch.name} size={52} />
            <span
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                fontSize: "11px",
                background: "var(--surface)",
                borderRadius: "50%",
                padding: "2px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {bestMatch.icon}
            </span>
          </div>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-bright)" }}>{bestMatch.name}</span>
          <span
            style={{
              fontSize: "11px",
              color: "var(--muted)",
              maxWidth: "80px",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {bestMatch.category}
          </span>
        </div>
      </div>

      {/* Recommended Role Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "var(--accent-subtle)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--accent-border)",
        }}
      >
        <span style={{ fontSize: "12px", color: "var(--text)", fontWeight: 500 }}>
          Top Reciprocal Match:
        </span>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)" }}>
          {bestMatch.icon} {bestMatch.role}
        </span>
      </div>

      {/* ADAPTIVE SLIDER FOR PACE (Using user's provided motion physics & dot track) */}
      <div>
        <AdaptiveSlider
          label="Pace Calibration"
          unit="/ 5"
          value={you.pace}
          min={1}
          max={5}
          step={1}
          defaultValue={4}
          labels={PACE_LABELS}
          onChange={(newPace) => setYou((prev) => ({ ...prev, pace: newPace }))}
        />
      </div>

      {/* Remaining 3 Dimensions (Comms, Risk, Energy) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--muted)",
            }}
          >
            Other Dimensions
          </span>
          <span style={{ fontSize: "11px", color: "var(--dim)" }}>Scale 1 to 5</span>
        </div>

        {AXES.filter((a) => a.key !== "pace").map((axis) => (
          <div key={axis.key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-bright)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{axis.icon}</span> {axis.label}
                <span style={{ fontSize: "10px", color: "var(--dim)", fontWeight: 400 }}>
                  ({axis.desc})
                </span>
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: "var(--accent)",
                  background: "var(--surface-inset)",
                  padding: "1px 6px",
                  borderRadius: "var(--radius-xs)",
                  border: "1px solid var(--stroke-subtle)",
                }}
              >
                {you[axis.key]} / 5
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={5}
              value={you[axis.key]}
              onChange={(e) => setYou((prev) => ({ ...prev, [axis.key]: Number(e.target.value) }))}
              style={{
                width: "100%",
                height: "5px",
                borderRadius: "4px",
                accentColor: "var(--accent)",
                cursor: "pointer",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
