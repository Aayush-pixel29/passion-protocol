"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { vibeScore } from "@/lib/match";
import {
  INDUSTRY_CATEGORIES,
  CATEGORY_ICONS,
  formatRoleWithIcon,
  type IndustryCategory,
  type VibeAnswers,
} from "@/lib/types";

interface SimulatorCandidate {
  id: string;
  codename: string;
  professional_title: string;
  category: IndustryCategory;
  looking_for_category: IndustryCategory;
  avatarImg: string;
  vibe: VibeAnswers;
  projectTitle: string;
  budgetRange: string;
  bio: string;
}

const ROLE_IMAGE_MAP: Record<IndustryCategory, string> = {
  "Software & IT": "/images/role-software-coder.png",
  "Creative & Design": "/images/role-creative-designer.png",
  "Engineering & Hardware": "/images/role-hardware-maker.png",
  "Business & Sales": "/images/role-business-growth.png",
  "Marketing & Content": "/images/role-marketing-writer.png",
  Other: "/images/role-general-builder.png",
};

const MOCK_CANDIDATES: SimulatorCandidate[] = [
  {
    id: "sim-1",
    codename: "MAYA_UX",
    professional_title: "Lead Product Designer",
    category: "Creative & Design",
    looking_for_category: "Software & IT",
    avatarImg: "/images/avatar-maya-designer.png",
    vibe: { pace: 4, comms: 4, risk: 4, energy: 3 },
    projectTitle: "Prompt-to-React Design System & Plugin",
    budgetRange: "$5,000 Milestone",
    bio: "Ex-Figma plugin creator building AI-first generative design tools.",
  },
  {
    id: "sim-2",
    codename: "ALEX_AI",
    professional_title: "AI Systems Architect",
    category: "Software & IT",
    looking_for_category: "Creative & Design",
    avatarImg: "/images/avatar-alex-coder.png",
    vibe: { pace: 5, comms: 4, risk: 5, energy: 4 },
    projectTitle: "Autonomous Agent Protocol",
    budgetRange: "$15,000 Milestone",
    bio: "Distributed systems and zero-knowledge compute mesh engineer.",
  },
  {
    id: "sim-3",
    codename: "DAVID_ROBOT",
    professional_title: "Robotics & IoT Lead",
    category: "Engineering & Hardware",
    looking_for_category: "Business & Sales",
    avatarImg: "/images/avatar-david-hardware.png",
    vibe: { pace: 4, comms: 3, risk: 5, energy: 4 },
    projectTitle: "Drone Telemetry & Spatial Controller",
    budgetRange: "$35,000 Seed Allocation",
    bio: "Prototyping spatial haptic feedback and real-time flight controllers.",
  },
  {
    id: "sim-4",
    codename: "ELENA_SCALE",
    professional_title: "GTM & Growth Hacker",
    category: "Business & Sales",
    looking_for_category: "Engineering & Hardware",
    avatarImg: "/images/avatar-elena-growth.png",
    vibe: { pace: 5, comms: 5, risk: 4, energy: 5 },
    projectTitle: "Enterprise DevRel Pipeline Engine",
    budgetRange: "$4,000 + 15% Equity",
    bio: "Scaled two B2B developer platforms from zero to $3M ARR.",
  },
  {
    id: "sim-5",
    codename: "CARLOS_DOCS",
    professional_title: "Technical Storyteller",
    category: "Marketing & Content",
    looking_for_category: "Software & IT",
    avatarImg: "/images/avatar-carlos-writer.png",
    vibe: { pace: 3, comms: 4, risk: 3, energy: 4 },
    projectTitle: "Interactive Developer Documentation",
    budgetRange: "$3,500 Milestone",
    bio: "Author of viral technical newsletters and interactive dev guides.",
  },
  {
    id: "sim-6",
    codename: "PRIYA_CHAIN",
    professional_title: "Fintech & DeFi Lead",
    category: "Software & IT",
    looking_for_category: "Marketing & Content",
    avatarImg: "/images/avatar-priya-fintech.png",
    vibe: { pace: 5, comms: 3, risk: 5, energy: 3 },
    projectTitle: "Cross-Chain Escrow Protocol",
    budgetRange: "$12,000 Milestone",
    bio: "Next-gen smart contract settlement layer with micropayment streaming.",
  },
];

const PRESETS = [
  {
    label: "⚡ Hackathon Sprint",
    vibe: { pace: 5, comms: 5, risk: 5, energy: 4 },
  },
  {
    label: "🔬 Deep-Tech R&D",
    vibe: { pace: 2, comms: 2, risk: 4, energy: 2 },
  },
  {
    label: "🚀 Product Studio",
    vibe: { pace: 4, comms: 4, risk: 3, energy: 4 },
  },
  {
    label: "🌐 Async Indie",
    vibe: { pace: 3, comms: 1, risk: 3, energy: 1 },
  },
];

function getSynergyTier(score: number): { label: string; badgeClass: string } {
  if (score >= 90) return { label: "Exceptional Resonance", badgeClass: "tier-exceptional" };
  if (score >= 75) return { label: "High Complementarity", badgeClass: "tier-high" };
  if (score >= 50) return { label: "Moderate Synergy", badgeClass: "tier-moderate" };
  return { label: "Divergent Working Styles", badgeClass: "tier-divergent" };
}

export function LandingSimulator({ isAuthed = false }: { isAuthed?: boolean }) {
  const [myCategory, setMyCategory] = useState<IndustryCategory>("Software & IT");
  const [targetCategory, setTargetCategory] = useState<IndustryCategory>("Creative & Design");
  const [vibe, setVibe] = useState<VibeAnswers>({
    pace: 4,
    comms: 4,
    risk: 4,
    energy: 4,
  });

  const rankedCandidates = useMemo(() => {
    return MOCK_CANDIDATES
      .map((candidate) => {
        const score = vibeScore(vibe, candidate.vibe);
        const isTargetCategory = candidate.category === targetCategory;
        return {
          ...candidate,
          score,
          tier: getSynergyTier(score),
          isTargetCategory,
        };
      })
      .sort((a, b) => {
        if (a.isTargetCategory && !b.isTargetCategory) return -1;
        if (!a.isTargetCategory && b.isTargetCategory) return 1;
        return b.score - a.score;
      });
  }, [vibe, targetCategory]);

  const handleSliderChange = (dimension: keyof VibeAnswers, val: number) => {
    setVibe((prev) => ({
      ...prev,
      [dimension]: Math.max(1, Math.min(5, Math.round(val))),
    }));
  };

  const topMatch = rankedCandidates[0];
  const topScore = topMatch ? topMatch.score : 94;

  const ctaHref = isAuthed
    ? "/discover"
    : `/onboarding?role=${encodeURIComponent(myCategory)}&seeking=${encodeURIComponent(targetCategory)}&pace=${vibe.pace}&comms=${vibe.comms}&risk=${vibe.risk}&energy=${vibe.energy}`;

  return (
    <div className="simulator-card glass-panel">
      <div className="simulator-grid">
        {/* LEFT: CONTROLS & SLIDERS */}
        <div className="simulator-controls">
          <div className="control-group">
            <label className="control-label">01. Your Discipline</label>
            <div className="category-chips-grid">
              {INDUSTRY_CATEGORIES.map((cat) => (
                <button
                  key={`my-${cat}`}
                  type="button"
                  className={`role-chip ${myCategory === cat ? "active" : ""}`}
                  onClick={() => setMyCategory(cat)}
                >
                  <Image
                    src={ROLE_IMAGE_MAP[cat]}
                    alt={cat}
                    width={20}
                    height={20}
                    className="role-chip-img"
                  />
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">02. Looking For Partner Discipline</label>
            <div className="category-chips-grid">
              {INDUSTRY_CATEGORIES.map((cat) => (
                <button
                  key={`target-${cat}`}
                  type="button"
                  className={`role-chip ${targetCategory === cat ? "active" : ""}`}
                  onClick={() => setTargetCategory(cat)}
                >
                  <Image
                    src={ROLE_IMAGE_MAP[cat]}
                    alt={cat}
                    width={20}
                    height={20}
                    className="role-chip-img"
                  />
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group sliders-group">
            <div className="control-header-row">
              <label className="control-label">03. Calibrate 4D Vibe Fingerprint</label>
              <span className="control-sub">Range: 1 to 5</span>
            </div>

            <div className="slider-row">
              <div className="slider-header">
                <span>⚡ Pace: {vibe.pace === 1 ? "Slow Craft" : vibe.pace === 5 ? "Ship Fast" : `Level ${vibe.pace}`}</span>
                <span className="slider-num">{vibe.pace}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={vibe.pace}
                onChange={(e) => handleSliderChange("pace", Number(e.target.value))}
                className="vibe-range"
                aria-label="Pace calibration slider"
              />
            </div>

            <div className="slider-row">
              <div className="slider-header">
                <span>💬 Comms: {vibe.comms === 1 ? "Async Quiet" : vibe.comms === 5 ? "High Bandwidth" : `Level ${vibe.comms}`}</span>
                <span className="slider-num">{vibe.comms}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={vibe.comms}
                onChange={(e) => handleSliderChange("comms", Number(e.target.value))}
                className="vibe-range"
                aria-label="Communication calibration slider"
              />
            </div>

            <div className="slider-row">
              <div className="slider-header">
                <span>🎲 Risk: {vibe.risk === 1 ? "Safe Bets" : vibe.risk === 5 ? "Moonshots" : `Level ${vibe.risk}`}</span>
                <span className="slider-num">{vibe.risk}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={vibe.risk}
                onChange={(e) => handleSliderChange("risk", Number(e.target.value))}
                className="vibe-range"
                aria-label="Risk tolerance calibration slider"
              />
            </div>

            <div className="slider-row">
              <div className="slider-header">
                <span>🔥 Energy: {vibe.energy === 1 ? "Deep Solo" : vibe.energy === 5 ? "Social Jam" : `Level ${vibe.energy}`}</span>
                <span className="slider-num">{vibe.energy}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={vibe.energy}
                onChange={(e) => handleSliderChange("energy", Number(e.target.value))}
                className="vibe-range"
                aria-label="Energy calibration slider"
              />
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">Quick Vibe Archetypes</label>
            <div className="presets-row">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="pill-btn skip preset-pill"
                  onClick={() => setVibe(p.vibe)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: LIVE RANKED CANDIDATE RESULTS */}
        <div className="simulator-results">
          <div className="results-header">
            <div>
              <h3>Live Calculated Matches</h3>
              <p className="results-sub">Ranked in real time via 4D Manhattan distance</p>
            </div>
            <span className="results-badge">⚡ Real-time Vibe Rank</span>
          </div>

          <div className="simulator-cards-list">
            {rankedCandidates.slice(0, 3).map((candidate) => (
              <div key={candidate.id} className="sim-candidate-card glass-panel">
                <div className="sim-candidate-main">
                  <Image
                    src={candidate.avatarImg}
                    alt={candidate.codename}
                    width={52}
                    height={52}
                    className="sim-avatar"
                  />
                  <div className="sim-candidate-details">
                    <div className="sim-name-row">
                      <span className="sim-codename">
                        {candidate.codename} {CATEGORY_ICONS[candidate.category]}
                      </span>
                      <span className="role-tag sm">
                        {formatRoleWithIcon(candidate.category, candidate.professional_title)}
                      </span>
                    </div>
                    <div className="sim-project">💡 {candidate.projectTitle}</div>
                    <div className="sim-budget">{candidate.budgetRange}</div>
                  </div>
                </div>

                <div className="sim-score-col">
                  <div className="score-badge">{candidate.score}%</div>
                  <span className={`tier-badge ${candidate.tier.badgeClass}`}>
                    {candidate.tier.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="simulator-cta-box">
            <Link href={ctaHref} className="primary-btn inline" style={{ width: "100%", justifyContent: "center" }}>
              Start Matching with This Vibe Calibration ({topScore}%) →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
