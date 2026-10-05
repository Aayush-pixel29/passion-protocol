'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { updateVibeAnswers } from '@/lib/actions';
import type { VibeAnswers } from '@/lib/types';

interface LiveVibeEqualizerProps {
  initialVibe: VibeAnswers;
}

const DIMS: Array<{
  key: keyof VibeAnswers;
  label: string;
  leftDesc: string;
  rightDesc: string;
  icon: string;
}> = [
  {
    key: 'pace',
    label: 'Pace & Velocity',
    leftDesc: '1 (Deep & Methodical)',
    rightDesc: '5 (Hyper-Sprint)',
    icon: '⚡',
  },
  {
    key: 'comms',
    label: 'Communication Style',
    leftDesc: '1 (Async Quiet)',
    rightDesc: '5 (Always-On Sync)',
    icon: '💬',
  },
  {
    key: 'risk',
    label: 'Risk & Ambition',
    leftDesc: '1 (Steady Side Project)',
    rightDesc: '5 (All-In VC Scale)',
    icon: '🚀',
  },
  {
    key: 'energy',
    label: 'Team Energy',
    leftDesc: '1 (Calm Specialist)',
    rightDesc: '5 (High-Octane Hype)',
    icon: '🔥',
  },
];

export function LiveVibeEqualizer({ initialVibe }: LiveVibeEqualizerProps) {
  const [vibe, setVibe] = useState<VibeAnswers>(initialVibe);
  const [isPending, startTransition] = useTransition();
  const [savedNotice, setSavedNotice] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const handleSliderChange = (key: keyof VibeAnswers, value: number) => {
    setVibe((prev) => ({ ...prev, [key]: value }));
    setHasChanged(true);
    setSavedNotice(false);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.set('pace', String(vibe.pace));
    formData.set('comms', String(vibe.comms));
    formData.set('risk', String(vibe.risk));
    formData.set('energy', String(vibe.energy));

    startTransition(async () => {
      await updateVibeAnswers(formData);
      setHasChanged(false);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3500);
    });
  };

  return (
    <div
      style={{
        background: 'var(--surface, #ffffff)',
        border: '1px solid var(--stroke, #e5e3db)',
        borderRadius: 'var(--radius-xl, 16px)',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🎛️</span>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--text-bright, #111827)' }}>
              Live Vibe Equalizer
            </h3>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted, #4b5563)' }}>
            Calibrate your 4D working style in real-time. Matches update across the Discover Deck automatically.
          </p>
        </div>

        {hasChanged && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="primary-btn"
            style={{
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 14px rgba(255, 61, 110, 0.3)',
            }}
          >
            {isPending ? 'Recalibrating...' : 'Save & Recalibrate →'}
          </button>
        )}
      </div>

      {/* Sliders Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {DIMS.map((dim) => {
          const val = vibe[dim.key];
          return (
            <div
              key={dim.key}
              style={{
                padding: '12px 16px',
                background: 'var(--surface-inset, #f4f3ee)',
                border: '1px solid var(--stroke-subtle, #eeece5)',
                borderRadius: 'var(--radius-md, 10px)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{dim.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-bright, #111827)' }}>
                    {dim.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 13,
                      fontWeight: 800,
                      color: 'var(--accent, #ff3d6e)',
                      background: 'rgba(255, 61, 110, 0.08)',
                      padding: '2px 8px',
                      borderRadius: 6,
                      border: '1px solid rgba(255, 61, 110, 0.25)',
                    }}
                  >
                    {val} / 5
                  </span>
                </div>
              </div>

              {/* Slider Input */}
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={val}
                onChange={(e) => handleSliderChange(dim.key, Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent, #ff3d6e)',
                  cursor: 'pointer',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--dim, #6b7280)' }}>
                <span>{dim.leftDesc}</span>
                <span>{dim.rightDesc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {savedNotice && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={{
              marginTop: 14,
              padding: '10px 14px',
              background: 'var(--success-bg, #ecfdf5)',
              border: '1px solid var(--success-border, #a7f3d0)',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--success, #059669)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>✓</span>
            <span>Vibe calibrated successfully! Your compatibility scores across all candidates are updated.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
