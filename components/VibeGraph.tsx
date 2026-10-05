"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";

interface VibeGraphProps {
  vibe: {
    pace: number;
    comms: number;
    risk: number;
    energy: number;
  };
  variant?: "wave" | "radar" | "sparkline";
  height?: number;
  interactive?: boolean;
}

export function VibeGraph({
  vibe,
  variant = "wave",
  height = 90,
}: VibeGraphProps) {
  const points = useMemo(() => {
    return [
      { label: "PACE", val: Math.max(1, Math.min(5, vibe.pace || 3)), desc: vibe.pace >= 4 ? "Sprint" : "Craft" },
      { label: "COMMS", val: Math.max(1, Math.min(5, vibe.comms || 3)), desc: vibe.comms >= 3 ? "Sync" : "Async" },
      { label: "RISK", val: Math.max(1, Math.min(5, vibe.risk || 3)), desc: vibe.risk >= 4 ? "Moonshot" : "Safe" },
      { label: "ENERGY", val: Math.max(1, Math.min(5, vibe.energy || 3)), desc: vibe.energy >= 4 ? "High-Vibe" : "Quiet" },
    ];
  }, [vibe]);

  // Mini Sparkline for Card Headers
  if (variant === "sparkline") {
    // 4 points mapped to viewBox 0 0 80 24
    const coords = points.map((p, i) => {
      const x = 6 + i * 22;
      const y = 20 - ((p.val - 1) / 4) * 16;
      return { x, y };
    });

    const dPath = `M ${coords[0].x} ${coords[0].y} ` +
      `C ${(coords[0].x + coords[1].x)/2} ${coords[0].y}, ${(coords[0].x + coords[1].x)/2} ${coords[1].y}, ${coords[1].x} ${coords[1].y} ` +
      `C ${(coords[1].x + coords[2].x)/2} ${coords[1].y}, ${(coords[1].x + coords[2].x)/2} ${coords[2].y}, ${coords[2].x} ${coords[2].y} ` +
      `C ${(coords[2].x + coords[3].x)/2} ${coords[2].y}, ${(coords[2].x + coords[3].x)/2} ${coords[3].y}, ${coords[3].x} ${coords[3].y}`;

    return (
      <div style={{ width: "70px", height: "22px", position: "relative" }}>
        <svg viewBox="0 0 80 24" fill="none" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <path
            d={dPath}
            stroke="url(#sparkline-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {coords.map((c, idx) => (
            <circle
              key={idx}
              cx={c.x}
              cy={c.y}
              r="2.5"
              fill="#ffffff"
              stroke="#ff3d6e"
              strokeWidth="1.5"
            />
          ))}
          <defs>
            <linearGradient id="sparkline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#ff3d6e" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Radar Diamond Polar Visualizer
  if (variant === "radar") {
    const size = 130;
    const center = size / 2;
    const maxRadius = center - 18;

    // Top: Pace (0 deg), Right: Comms (90 deg), Bottom: Risk (180 deg), Left: Energy (270 deg)
    const getPos = (val: number, angleDeg: number) => {
      const r = (val / 5) * maxRadius;
      const rad = ((angleDeg - 90) * Math.PI) / 180;
      return {
        x: center + r * Math.cos(rad),
        y: center + r * Math.sin(rad),
      };
    };

    const p0 = getPos(points[0].val, 0);   // Pace (Top)
    const p1 = getPos(points[1].val, 90);  // Comms (Right)
    const p2 = getPos(points[2].val, 180); // Risk (Bottom)
    const p3 = getPos(points[3].val, 270); // Energy (Left)

    const polygonPoints = `${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Axis Rings */}
          {[1, 2, 3, 4, 5].map((lvl) => {
            const r = (lvl / 5) * maxRadius;
            return (
              <circle
                key={lvl}
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="var(--stroke)"
                strokeDasharray={lvl < 5 ? "2 3" : "none"}
                strokeWidth="1"
                opacity={0.6}
              />
            );
          })}

          {/* Diagonal Crosshairs */}
          <line x1={center} y1={center - maxRadius} x2={center} y2={center + maxRadius} stroke="var(--stroke)" strokeWidth="1" />
          <line x1={center - maxRadius} y1={center} x2={center + maxRadius} y2={center} stroke="var(--stroke)" strokeWidth="1" />

          {/* Filled Polygon Matrix */}
          <polygon
            points={polygonPoints}
            fill="url(#radar-gradient)"
            stroke="#ff3d6e"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Interactive Vertex Dots */}
          {[p0, p1, p2, p3].map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="#ffffff"
              stroke="#ff3d6e"
              strokeWidth="2"
            />
          ))}

          <defs>
            <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff3d6e" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
            </radialGradient>
          </defs>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", width: "100%", marginTop: "4px" }}>
          {points.map((p) => (
            <div
              key={p.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "var(--surface-inset)",
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "11px",
              }}
            >
              <span style={{ color: "var(--muted)", fontWeight: 600 }}>{p.label}</span>
              <strong style={{ color: "var(--text-bright)", fontFamily: "var(--font-mono)" }}>
                {p.val}/5
              </strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: Glowing Wave Spline Rhythm Curve
  const svgWidth = 280;
  const svgHeight = height;
  const paddingX = 24;
  const usableWidth = svgWidth - paddingX * 2;
  const stepX = usableWidth / 3;

  const nodeCoords = points.map((p, i) => {
    const x = paddingX + i * stepX;
    // val 1 -> bottom (svgHeight - 16), val 5 -> top (16)
    const y = svgHeight - 16 - ((p.val - 1) / 4) * (svgHeight - 32);
    return { x, y, ...p };
  });

  // Construct smooth bezier spline
  const linePath =
    `M ${nodeCoords[0].x} ${nodeCoords[0].y} ` +
    `C ${(nodeCoords[0].x + nodeCoords[1].x)/2} ${nodeCoords[0].y}, ${(nodeCoords[0].x + nodeCoords[1].x)/2} ${nodeCoords[1].y}, ${nodeCoords[1].x} ${nodeCoords[1].y} ` +
    `C ${(nodeCoords[1].x + nodeCoords[2].x)/2} ${nodeCoords[1].y}, ${(nodeCoords[1].x + nodeCoords[2].x)/2} ${nodeCoords[2].y}, ${nodeCoords[2].x} ${nodeCoords[2].y} ` +
    `C ${(nodeCoords[2].x + nodeCoords[3].x)/2} ${nodeCoords[2].y}, ${(nodeCoords[2].x + nodeCoords[3].x)/2} ${nodeCoords[3].y}, ${nodeCoords[3].x} ${nodeCoords[3].y}`;

  const areaPath = `${linePath} L ${nodeCoords[3].x} ${svgHeight - 8} L ${nodeCoords[0].x} ${svgHeight - 8} Z`;

  return (
    <div
      style={{
        background: "var(--surface-inset)",
        border: "1px solid var(--stroke)",
        borderRadius: "14px",
        padding: "12px 14px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", color: "var(--accent)", textTransform: "uppercase" }}>
          4D RHYTHM MATRIX
        </span>
        <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--dim)", fontFamily: "var(--font-mono)" }}>
          FREQUENCY GRAPH
        </span>
      </div>

      <div style={{ width: "100%", height: `${svgHeight}px`, position: "relative" }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          {/* Horizontal Level Guides */}
          {[1, 3, 5].map((lvl) => {
            const y = svgHeight - 16 - ((lvl - 1) / 4) * (svgHeight - 32);
            return (
              <line
                key={lvl}
                x1={paddingX - 4}
                y1={y}
                x2={svgWidth - paddingX + 4}
                y2={y}
                stroke="var(--stroke)"
                strokeDasharray="2 3"
                strokeWidth="1"
                opacity={0.5}
              />
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#wave-area-gradient)" />

          {/* Glowing Line Spline */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#wave-stroke-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Glowing Node Vertices */}
          {nodeCoords.map((c, idx) => (
            <g key={idx}>
              <circle
                cx={c.x}
                cy={c.y}
                r="4.5"
                fill="#ffffff"
                stroke={c.val >= 4 ? "#ff3d6e" : "#06b6d4"}
                strokeWidth="2"
                style={{
                  filter: `drop-shadow(0 0 4px ${c.val >= 4 ? "rgba(255,61,110,0.5)" : "rgba(6,182,212,0.5)"})`,
                }}
              />
            </g>
          ))}

          <defs>
            <linearGradient id="wave-stroke-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="40%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#ff3d6e" />
            </linearGradient>
            <linearGradient id="wave-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff3d6e" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Metric Labels Underneath */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px", marginTop: "4px", textAlign: "center" }}>
        {nodeCoords.map((p) => (
          <div key={p.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "9px", fontWeight: 800, color: "var(--dim)", fontFamily: "var(--font-mono)" }}>
              {p.label}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-bright)", fontFamily: "var(--font-mono)" }}>
              {p.val}<span style={{ fontSize: "9px", color: "var(--dim)", fontWeight: 500 }}>/5</span>
            </span>
            <span style={{ fontSize: "9px", color: "var(--accent)", fontWeight: 600 }}>
              {p.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VibeGraph;
