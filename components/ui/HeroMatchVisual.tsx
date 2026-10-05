"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CoFounderPair {
  id: string;
  tag: string;
  synergy: number;
  mission: string;
  partnerA: {
    name: string;
    handle: string;
    role: string;
    discipline: string;
    avatar: string;
    roleColor: string;
    skills: string[];
    pace: string;
    comms: string;
    risk: string;
    energy: string;
    seeking: string;
  };
  partnerB: {
    name: string;
    handle: string;
    role: string;
    discipline: string;
    avatar: string;
    roleColor: string;
    skills: string[];
    pace: string;
    comms: string;
    risk: string;
    energy: string;
    seeking: string;
  };
  dimensions: {
    label: string;
    score: number;
    matchText: string;
  }[];
}

const PAIRS: CoFounderPair[] = [
  {
    id: "ai-designer",
    tag: "💻 AI Hacker + 🎨 Product Designer",
    synergy: 98,
    mission: "Building autonomous agent workflow studio",
    partnerA: {
      name: "Alex C.",
      handle: "ALEX_AI",
      role: "AI & Distributed Systems",
      discipline: "Engineering",
      avatar: "/images/avatar-alex-coder.png",
      roleColor: "#06b6d4",
      skills: ["Rust", "PyTorch", "vLLM", "Distributed Systems"],
      pace: "Sprint (5/5)",
      comms: "Async-first (Docs/Loom)",
      risk: "High Moonshot (Venture)",
      energy: "Midnight Deep-Work",
      seeking: "Founding Product Designer",
    },
    partnerB: {
      name: "Maya L.",
      handle: "MAYA_UX",
      role: "Founding Product Designer",
      discipline: "Design",
      avatar: "/images/avatar-maya-designer.png",
      roleColor: "#8b5cf6",
      skills: ["Design Systems", "Figma", "Next.js", "User Research"],
      pace: "Sprint (5/5)",
      comms: "Async-first (Figma/Linear)",
      risk: "High Moonshot (Venture)",
      energy: "Flow-State Sprints",
      seeking: "Technical Systems Co-Founder",
    },
    dimensions: [
      { label: "Pace & Rhythm", score: 100, matchText: "Both calibrated for high-velocity 2-week ship cycles" },
      { label: "Async Comms", score: 96, matchText: "Linear + Loom preference over synchronous meetings" },
      { label: "Risk Appetite", score: 100, matchText: "Mutual venture ambition with full-time focus" },
      { label: "Deep-Work Energy", score: 94, matchText: "Overlapping evening creative sprints" },
    ],
  },
  {
    id: "fullstack-growth",
    tag: "🛠️ Full-Stack + 🚀 Growth Lead",
    synergy: 95,
    mission: "Building open-source developer infrastructure",
    partnerA: {
      name: "Carlos M.",
      handle: "CARLOS_DEV",
      role: "Full-Stack & Open Source",
      discipline: "Engineering",
      avatar: "/images/avatar-carlos-writer.png",
      roleColor: "#3b82f6",
      skills: ["TypeScript", "Go", "Postgres", "Docker"],
      pace: "Steady Sprint (4/5)",
      comms: "Hybrid (Discord + Slack)",
      risk: "Bootstrapped to Pre-Seed",
      energy: "Morning Maker",
      seeking: "GTM & Growth Partner",
    },
    partnerB: {
      name: "Elena R.",
      handle: "ELENA_GTM",
      role: "GTM & Developer Relations",
      discipline: "Growth",
      avatar: "/images/avatar-elena-growth.png",
      roleColor: "#ec4899",
      skills: ["Developer Marketing", "DevRel", "SEO", "Enterprise Sales"],
      pace: "Steady Sprint (4/5)",
      comms: "Hybrid (Discord + Slack)",
      risk: "Bootstrapped to Pre-Seed",
      energy: "Daytime Connector",
      seeking: "Full-Stack Technical Builder",
    },
    dimensions: [
      { label: "Pace & Rhythm", score: 95, matchText: "Both value predictable shipping rhythms over burnout sprints" },
      { label: "Async Comms", score: 98, matchText: "Transparent open-source public discourse & daily standups" },
      { label: "Risk Appetite", score: 92, matchText: "Bootstrapped revenue traction before dilution" },
      { label: "Deep-Work Energy", score: 95, matchText: "Complementary timezone handover" },
    ],
  },
  {
    id: "hardware-fintech",
    tag: "⚡ Hardware Maker + 💼 Fintech Operator",
    synergy: 92,
    mission: "Building autonomous micro-payment IoT nodes",
    partnerA: {
      name: "David K.",
      handle: "DAVID_IOT",
      role: "Hardware & Embedded Systems",
      discipline: "Hardware",
      avatar: "/images/avatar-david-hardware.png",
      roleColor: "#f59e0b",
      skills: ["ESP32", "PCB Design", "C++", "Firmware"],
      pace: "Milestone Focused (4/5)",
      comms: "Weekly Structured Reviews",
      risk: "Deep-Tech R&D",
      energy: "Lab Deep-Work",
      seeking: "Fintech & Regulatory Lead",
    },
    partnerB: {
      name: "Priya S.",
      handle: "PRIYA_FIN",
      role: "Fintech & Regulatory Ops",
      discipline: "Operations",
      avatar: "/images/avatar-priya-fintech.png",
      roleColor: "#10b981",
      skills: ["Banking Rails", "Licensing", "Series A Ops", "Compliance"],
      pace: "Milestone Focused (4/5)",
      comms: "Weekly Structured Reviews",
      risk: "Deep-Tech R&D",
      energy: "Structured Execution",
      seeking: "Deep-Tech Hardware Founder",
    },
    dimensions: [
      { label: "Pace & Rhythm", score: 92, matchText: "Hardware prototyping aligned with banking integration cycles" },
      { label: "Async Comms", score: 94, matchText: "Documented milestone gates with formal deliverables" },
      { label: "Risk Appetite", score: 90, matchText: "Patient capital runway with high barrier-to-entry IP" },
      { label: "Deep-Work Energy", score: 93, matchText: "Dedicated execution with clear ownership boundaries" },
    ],
  },
];

export function HeroMatchVisual() {
  const [activePairId, setActivePairId] = useState<string>("ai-designer");
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);

  const activePair = PAIRS.find((p) => p.id === activePairId) || PAIRS[0];

  const handleSimulate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
    }, 700);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "960px",
        margin: "32px auto 8px",
        padding: "0 12px",
      }}
    >
      {/* Visual Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "85%",
          height: "220px",
          background: "radial-gradient(circle, rgba(255, 61, 110, 0.16) 0%, rgba(139, 92, 246, 0.1) 45%, transparent 75%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main Glassmorphic Showcase Container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--stroke-subtle)",
          background: "var(--surface)",
          boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--stroke-subtle)",
          overflow: "hidden",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Top Archetype Selector Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            padding: "14px 20px",
            borderBottom: "1px solid var(--stroke-subtle)",
            background: "var(--surface-inset)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--accent)",
                background: "var(--accent-subtle)",
                padding: "3px 8px",
                borderRadius: "4px",
              }}
            >
              MOTIVE SHOWCASE
            </span>
            <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>
              Live 4D Working Dynamic Compatibility Engine
            </span>
          </div>

          {/* Archetype Toggle Tabs */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {PAIRS.map((pair) => {
              const isActive = pair.id === activePairId;
              return (
                <button
                  key={pair.id}
                  onClick={() => setActivePairId(pair.id)}
                  type="button"
                  suppressHydrationWarning
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    border: "1px solid",
                    borderColor: isActive ? "var(--accent)" : "var(--stroke-subtle)",
                    background: isActive ? "var(--accent-subtle)" : "var(--surface)",
                    color: isActive ? "var(--accent)" : "var(--text)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>{pair.tag}</span>
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "1px 5px",
                      borderRadius: "9999px",
                      background: isActive ? "var(--accent)" : "var(--stroke)",
                      color: isActive ? "#ffffff" : "var(--dim)",
                    }}
                  >
                    {pair.synergy}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pairing Display Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePair.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ padding: "24px 20px" }}
          >
            {/* Mission banner */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "13px",
                color: "var(--muted)",
              }}
            >
              <span style={{ color: "var(--text-bright)", fontWeight: 600 }}>Target Venture: </span>
              &ldquo;{activePair.mission}&rdquo; &mdash; complementary disciplines with calibrated work pace
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                gap: "20px",
              }}
              className="hero-match-grid"
            >
              {/* BUILDER CARD A */}
              <div
                style={{
                  background: "var(--surface-inset)",
                  border: "1px solid var(--stroke)",
                  borderRadius: "var(--radius-lg)",
                  padding: "18px 20px",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      position: "relative",
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: `2px solid ${activePair.partnerA.roleColor}`,
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={activePair.partnerA.avatar}
                      alt={activePair.partnerA.name}
                      width={48}
                      height={48}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-bright)" }}>
                        {activePair.partnerA.handle}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: `${activePair.partnerA.roleColor}18`,
                          color: activePair.partnerA.roleColor,
                        }}
                      >
                        {activePair.partnerA.discipline}
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                      {activePair.partnerA.role}
                    </span>
                  </div>
                </div>

                {/* Skills tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {activePair.partnerA.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        fontSize: "11px",
                        background: "var(--surface)",
                        border: "1px solid var(--stroke-subtle)",
                        padding: "2px 7px",
                        borderRadius: "4px",
                        color: "var(--text)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* 4D Stats */}
                <div
                  style={{
                    background: "var(--surface)",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--stroke-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "11px",
                    color: "var(--muted)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>⚡ Pace: {activePair.partnerA.pace}</span>
                    <span>💬 {activePair.partnerA.comms}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>🎲 {activePair.partnerA.risk}</span>
                    <span>🌙 {activePair.partnerA.energy}</span>
                  </div>
                </div>
              </div>

              {/* CENTER COMPATIBILITY CORE */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  padding: "0 10px",
                  position: "relative",
                }}
              >
                {/* Glowing Synergy Score Orb */}
                <motion.div
                  animate={isCalibrating ? { scale: [1, 1.15, 1], rotate: [0, 180, 360] } : {}}
                  transition={{ duration: 0.6 }}
                  style={{
                    position: "relative",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff3d6e, #8b5cf6)",
                    padding: "2.5px",
                    boxShadow: "0 0 30px rgba(255, 61, 110, 0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: "var(--surface)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        fontFamily: "var(--font-mono)",
                        color: "var(--accent)",
                        lineHeight: 1,
                      }}
                    >
                      {activePair.synergy}%
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#10b981",
                        marginTop: "2px",
                      }}
                    >
                      Synergy
                    </span>
                  </div>
                </motion.div>

                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={handleSimulate}
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "var(--accent)",
                    background: "var(--accent-subtle)",
                    border: "1px solid var(--accent-border)",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>⚡</span> Recalculate
                </button>
              </div>

              {/* BUILDER CARD B */}
              <div
                style={{
                  background: "var(--surface-inset)",
                  border: "1px solid var(--stroke)",
                  borderRadius: "var(--radius-lg)",
                  padding: "18px 20px",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      position: "relative",
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: `2px solid ${activePair.partnerB.roleColor}`,
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={activePair.partnerB.avatar}
                      alt={activePair.partnerB.name}
                      width={48}
                      height={48}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-bright)" }}>
                        {activePair.partnerB.handle}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: `${activePair.partnerB.roleColor}18`,
                          color: activePair.partnerB.roleColor,
                        }}
                      >
                        {activePair.partnerB.discipline}
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                      {activePair.partnerB.role}
                    </span>
                  </div>
                </div>

                {/* Skills tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {activePair.partnerB.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        fontSize: "11px",
                        background: "var(--surface)",
                        border: "1px solid var(--stroke-subtle)",
                        padding: "2px 7px",
                        borderRadius: "4px",
                        color: "var(--text)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* 4D Stats */}
                <div
                  style={{
                    background: "var(--surface)",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--stroke-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "11px",
                    color: "var(--muted)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>⚡ Pace: {activePair.partnerB.pace}</span>
                    <span>💬 {activePair.partnerB.comms}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>🎲 {activePair.partnerB.risk}</span>
                    <span>🌙 {activePair.partnerB.energy}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Axis Alignment Meter Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "10px",
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid var(--stroke-subtle)",
              }}
            >
              {activePair.dimensions.map((dim) => (
                <div
                  key={dim.label}
                  style={{
                    background: "var(--surface-inset)",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--stroke-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-bright)" }}>
                      {dim.label}
                    </span>
                    <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--accent)" }}>
                      {dim.score}%
                    </span>
                  </div>

                  {/* Meter Track */}
                  <div
                    style={{
                      height: "4px",
                      width: "100%",
                      background: "var(--stroke)",
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dim.score}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        background: "linear-gradient(90deg, #ff3d6e, #8b5cf6)",
                        borderRadius: "9999px",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--muted)", lineHeight: 1.3 }}>
                    {dim.matchText}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Trust & Verification Guarantee */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "14px",
            padding: "12px 20px",
            background: "var(--surface-inset)",
            borderTop: "1px solid var(--stroke-subtle)",
            fontSize: "12px",
            color: "var(--muted)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span>🔒</span> Private Encrypted Handles
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span>🤝</span> 100% Reciprocal Opt-In
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span>📑</span> In-App Milestone Contracts
          </span>
        </div>
      </div>
    </div>
  );
}
