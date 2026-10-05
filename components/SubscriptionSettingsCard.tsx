'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

interface SubscriptionSettingsCardProps {
  currentTier?: 'starter' | 'pro' | 'syndicate';
}

export function SubscriptionSettingsCard({ currentTier = 'starter' }: SubscriptionSettingsCardProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const isPro = currentTier === 'pro';
  const isSyndicate = currentTier === 'syndicate';

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--text-bright, #111827)' }}>
                Subscription &amp; Founder Perks
              </h3>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: isPro || isSyndicate ? 'linear-gradient(135deg, #ff3d6e, #8b5cf6)' : 'var(--bg-2, #f4f3ef)',
                  color: isPro || isSyndicate ? '#ffffff' : 'var(--dim, #6b7280)',
                  border: isPro || isSyndicate ? 'none' : '1px solid var(--stroke, #e5e3db)',
                  padding: '3px 10px',
                  borderRadius: 999,
                  boxShadow: isPro || isSyndicate ? '0 2px 10px rgba(255, 61, 110, 0.3)' : 'none',
                }}
              >
                {isSyndicate ? '👑 SYNDICATE' : isPro ? '⚡ PRO BUILDER' : 'FREE SCOUT'}
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--muted, #4b5563)' }}>
              {isPro
                ? 'Active Pro Plan · 10% platform settlement rate & automated AI verification active.'
                : 'Free Tier · 20% platform fee on milestone payouts. Upgrade for priority matching and 50% lower fees.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {!isPro && !isSyndicate ? (
            <Link
              href="/pricing"
              className="primary-btn"
              style={{
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 999,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(255, 61, 110, 0.35)',
              }}
            >
              <span>Upgrade to Pro ($7.99/mo)</span>
              <span>→</span>
            </Link>
          ) : (
            <Link
              href="/pricing"
              className="outline-btn"
              style={{
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 999,
                textDecoration: 'none',
              }}
            >
              Manage Billing
            </Link>
          )}
        </div>
      </div>

      {/* Perks Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginTop: 18,
          paddingTop: 18,
          borderTop: '1px solid var(--stroke-subtle, #eeece5)',
        }}
      >
        <div style={{ padding: '10px 14px', background: 'var(--surface-inset, #f4f3ee)', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--dim, #6b7280)', fontWeight: 600 }}>Platform Settlement Fee</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-bright, #111827)', marginTop: 2 }}>
            {isSyndicate ? '0% Fee' : isPro ? '10% Fee (50% Off)' : '20% Standard'}
          </div>
        </div>

        <div style={{ padding: '10px 14px', background: 'var(--surface-inset, #f4f3ee)', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--dim, #6b7280)', fontWeight: 600 }}>AI Pod Verifier Audits</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-bright, #111827)', marginTop: 2 }}>
            {isPro || isSyndicate ? 'Unlimited Audits' : '3 Free / Month'}
          </div>
        </div>

        <div style={{ padding: '10px 14px', background: 'var(--surface-inset, #f4f3ee)', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--dim, #6b7280)', fontWeight: 600 }}>Discover Deck Ranking</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-bright, #111827)', marginTop: 2 }}>
            {isPro || isSyndicate ? '⭐ Priority Placement' : 'Standard'}
          </div>
        </div>
      </div>
    </div>
  );
}
