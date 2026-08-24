"use client";

import { useState, useEffect } from "react";
import { vibeScore } from "@/lib/match";
import type { VibeAnswers } from "@/lib/types";
import { AvatarSVG } from "./Avatar";

const AXES: { key: keyof VibeAnswers; label: string }[] = [
  { key: "pace", label: "Pace" },
  { key: "comms", label: "Comms" },
  { key: "risk", label: "Risk" },
  { key: "energy", label: "Energy" },
];

const MOCK_POOL = [
  { name: "Neo", role: "Full Stack Engineer", vibe: { pace: 5, comms: 3, risk: 4, energy: 5 } },
  { name: "Trinity", role: "Product Designer", vibe: { pace: 4, comms: 4, risk: 4, energy: 4 } },
  { name: "Morpheus", role: "Growth Lead", vibe: { pace: 2, comms: 5, risk: 2, energy: 3 } },
  { name: "Smith", role: "Sales", vibe: { pace: 5, comms: 2, risk: 5, energy: 5 } },
];

export function SynergyProof() {
  const [you, setYou] = useState<VibeAnswers>({ pace: 4, comms: 3, risk: 4, energy: 4 });
  const [bestMatch, setBestMatch] = useState(MOCK_POOL[0]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let max = 0;
    let best = MOCK_POOL[0];
    MOCK_POOL.forEach(p => {
      const s = vibeScore(you, p.vibe);
      if (s > max) { max = s; best = p; }
    });
    setBestMatch(best);
    setScore(max);
  }, [you]);

  return (
    <div className="hero-panel" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '480px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
      
      {/* Mesh Background */}
      <div className="mesh-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }} />

      {/* Connect Widget */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <AvatarSVG name="You" size={64} className=" animate-float" />
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>YOU</span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 16px' }}>
          <span className="text-" style={{ fontSize: '28px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'var(--accent-emerald)', zIndex: 10, marginBottom: '8px' }}>
            {score}%
          </span>
          <svg style={{ position: 'absolute', top: '50%', width: '100%', height: '32px', transform: 'translateY(-50%)', zIndex: 0 }} preserveAspectRatio="none">
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="var(--accent-emerald)" strokeWidth="2" className="animate-connect-line" />
          </svg>
          <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', zIndex: 10, background: 'white', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--stroke)' }}>
            Synergy
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <AvatarSVG name={bestMatch.name} size={64} className=" animate-float" />
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>{bestMatch.name}</span>
        </div>
      </div>

      {/* Best Match Info */}
      <div className="glass-emerald animate-slide-up" key={bestMatch.name} style={{ padding: '12px', borderRadius: '12px', textAlign: 'center', zIndex: 10 }}>
        <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
          Top Match Found
        </span>
        <span style={{ fontSize: '14px', color: 'var(--text-bright)' }}>{bestMatch.role}</span>
      </div>

      {/* Vibe Widget Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10 }}>
        <h4 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', margin: 0 }}>
          Your Calibration
        </h4>
        {AXES.map((axis) => (
          <div key={axis.key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ width: '64px', fontSize: '12px', color: 'var(--text-bright)', fontFamily: 'var(--font-mono)' }}>{axis.label}</span>
            <input
              type="range"
              min={1}
              max={5}
              value={you[axis.key]}
              onChange={(e) => setYou(prev => ({ ...prev, [axis.key]: Number(e.target.value) }))}
              style={{ flex: 1, height: '4px', background: 'var(--surface-inset)', borderRadius: '2px', appearance: 'none', cursor: 'pointer', outline: 'none' }}
            />
            <span style={{ width: '16px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', textAlign: 'right' }}>
              {you[axis.key]}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
