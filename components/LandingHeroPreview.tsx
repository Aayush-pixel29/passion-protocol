"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface LandingHeroPreviewProps {
  ctaHref?: string;
  ctaLabel?: string;
}

interface SampleCandidate {
  codename: string;
  role: string;
  category: string;
  targetRole: string;
  score: number;
  avatarInitials: string;
  avatarImg: string;
  project: string;
  vibe: { pace: number; comms: number; risk: number; energy: number };
}

const SAMPLES: SampleCandidate[] = [
  {
    codename: "RIYA_DESIGNS 🎨",
    role: "Designer",
    category: "Creative & Design",
    targetRole: "Coder 💻",
    score: 94,
    avatarInitials: "R",
    avatarImg: "/images/avatar-maya-designer.png",
    project: "Autonomous Agent Protocol · $15,000 Milestone Budget",
    vibe: { pace: 5, comms: 4, risk: 5, energy: 4 },
  },
  {
    codename: "ALEX_AI 💻",
    role: "Systems Coder",
    category: "Software & IT",
    targetRole: "Product Designer 🎨",
    score: 96,
    avatarInitials: "A",
    avatarImg: "/images/avatar-alex-coder.png",
    project: "Decentralized Compute Mesh · $20,000 Milestone Budget",
    vibe: { pace: 5, comms: 5, risk: 4, energy: 5 },
  },
  {
    codename: "DAVID_MAKER ⚙️",
    role: "Robotics Lead",
    category: "Engineering & Hardware",
    targetRole: "Growth Co-Founder 📈",
    score: 91,
    avatarInitials: "D",
    avatarImg: "/images/avatar-david-hardware.png",
    project: "Autonomous Drone Fleet · $35,000 Seed Allocation",
    vibe: { pace: 4, comms: 3, risk: 5, energy: 4 },
  },
];

export function LandingHeroPreview({
  ctaHref = "/login",
  ctaLabel = "Find Your Partner",
}: LandingHeroPreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const candidate = SAMPLES[activeIndex];

  const handleToggle = (idx: number) => {
    setIsPulsing(true);
    setActiveIndex(idx);
    setTimeout(() => setIsPulsing(false), 300);
  };

  return (
    <aside className="hero-panel glass-panel">
      <div className="hero-panel-header">
        <p className="hero-panel-label">Sample match</p>
        <span className="realtime-match-pill">
          ● Real-time Match
        </span>
      </div>

      <div
        className="hero-sample"
        style={{
          transition: "transform 0.25s ease, border-color 0.25s ease",
          transform: isPulsing ? "scale(0.98)" : "scale(1)",
        }}
      >
        <div className="hero-sample-identity">
          <div className="hero-avatar-wrap">
            <Image
              src={candidate.avatarImg}
              alt={candidate.codename}
              width={46}
              height={46}
              priority
              className="hero-sample-avatar"
            />
          </div>
          <div className="hero-sample-info">
            <strong>{candidate.codename}</strong>
            <span className="hero-sample-target">
              {candidate.role} looking for a {candidate.targetRole}
            </span>
          </div>
        </div>
        <div className="score-badge">{candidate.score}%</div>
      </div>

      <div className="hero-vibe-bars">
        <div className="vibe-bar-row">
          <span className="vibe-bar-label">Pace</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(candidate.vibe.pace / 5) * 100}%` }}
            />
          </div>
          <span className="vibe-bar-val">{candidate.vibe.pace}/5</span>
        </div>
        <div className="vibe-bar-row">
          <span className="vibe-bar-label">Comms</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(candidate.vibe.comms / 5) * 100}%` }}
            />
          </div>
          <span className="vibe-bar-val">{candidate.vibe.comms}/5</span>
        </div>
        <div className="vibe-bar-row">
          <span className="vibe-bar-label">Risk</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(candidate.vibe.risk / 5) * 100}%` }}
            />
          </div>
          <span className="vibe-bar-val">{candidate.vibe.risk}/5</span>
        </div>
        <div className="vibe-bar-row">
          <span className="vibe-bar-label">Energy</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(candidate.vibe.energy / 5) * 100}%` }}
            />
          </div>
          <span className="vibe-bar-val">{candidate.vibe.energy}/5</span>
        </div>
      </div>

      <div className="hero-project-box">
        <div className="project-badge">Active MVP Project</div>
        <div className="project-title">{candidate.project}</div>
      </div>

      <div className="hero-switcher">
        {SAMPLES.map((s, idx) => (
          <button
            key={s.codename}
            type="button"
            className={`switcher-pill ${idx === activeIndex ? "active" : ""}`}
            onClick={() => handleToggle(idx)}
          >
            {s.codename.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="hero-synergy-orbit-node">
        <Image
          src="/images/hero-synergy-orbit.png"
          alt="Synergy Orbit Node"
          width={80}
          height={80}
          priority
          className="synergy-orbit-img"
        />
      </div>

      <ul className="hero-list">
        <li>⚡ Vibe sliders instead of CV dumps</li>
        <li>🔒 Private contact reveal on mutual connect</li>
        <li>📱 Seamless on mobile &amp; desktop</li>
      </ul>

      <div style={{ marginTop: 16 }}>
        <Link
          href={ctaHref}
          className="outline-btn sm"
          style={{ width: "100%", justifyContent: "center", display: "flex", fontWeight: 700 }}
        >
          {ctaLabel} →
        </Link>
      </div>
    </aside>
  );
}
