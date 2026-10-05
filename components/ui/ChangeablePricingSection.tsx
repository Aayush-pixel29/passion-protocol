'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export interface FeatureItem {
  text: string;
  hasInfo?: boolean;
  infoTooltip?: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: string;
  priceYearly: string;
  badge?: string;
  featuresLabel: string;
  features: FeatureItem[];
  ctaText?: string;
  highlight?: boolean;
}

export interface ChangeablePricingSectionProps {
  plans?: Plan[];
  defaultPlanId?: string;
  defaultCycle?: 'monthly' | 'yearly';
  onContinue?: (planId: string, cycle: 'monthly' | 'yearly') => void;
  className?: string;
  title?: string;
  subtitle?: string;
  kicker?: string;
}

export const defaultPassionPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Scout',
    description: 'For solo builders exploring the ecosystem and looking for their ideal co-founder.',
    priceMonthly: '$0',
    priceYearly: '$0',
    featuresLabel: 'CORE MATCHING FEATURES:',
    features: [
      { text: '4D Synergy & Working Style Calibration', hasInfo: false },
      { text: 'Reciprocal Discover Deck access', hasInfo: false },
      { text: '1-on-1 Direct Messaging & Pitch Sharing', hasInfo: false },
      { text: 'Builder Passport & Verified Profile Card', hasInfo: false },
      { text: 'Standard 20% platform fee on escrow payouts', hasInfo: true, infoTooltip: 'Platform fee is only deducted upon successful micro-contract payout.' },
    ],
    ctaText: 'Get Started Free',
  },
  {
    id: 'pro',
    name: 'Pro Builder Pod',
    description: 'For active co-founder pairs and hackathon sprint teams shipping production software.',
    priceMonthly: '$9.99',
    priceYearly: '$7.99',
    badge: 'POPULAR',
    featuresLabel: 'EVERYTHING IN STARTER, PLUS:',
    features: [
      { text: 'Automated AI Pod Verifier (PR, RLS & build audits)', hasInfo: true, infoTooltip: 'Automated 4-point diagnostic engine that tests GitHub commits, acceptance criteria, and Supabase RLS before releasing milestone funds.' },
      { text: 'Live Webhook Integrations (GitHub, VS Code, Supabase, Figma)', hasInfo: true, infoTooltip: 'Real-time synchronization across your team development tools and live presence status.' },
      { text: 'Unlimited Smart Micro-Contracts & Escrow Milestones', hasInfo: false },
      { text: 'Priority Discover Deck placement & Verified Founder badge', hasInfo: false },
      { text: 'Reduced 10% platform fee on contract payouts', hasInfo: true, infoTooltip: 'Save 50% on platform settlement fees for all team deliverables and bounties.' },
      { text: 'Real-time Milestone Treasury & 50/50 Revenue Split', hasInfo: false },
    ],
    ctaText: 'Start 14-Day Free Trial',
  },
  {
    id: 'syndicate',
    name: 'Syndicate & Studio',
    description: 'For incubators, startup studios, and serial builders running multiple concurrent pods.',
    priceMonthly: '$39.99',
    priceYearly: '$31.99',
    badge: 'SCALE',
    featuresLabel: 'EVERYTHING IN PRO, PLUS:',
    features: [
      { text: 'Multi-Pod Command Center (Unlimited team workspaces)', hasInfo: false },
      { text: 'Batch Cohort Matching Algorithm for Accelerators', hasInfo: true, infoTooltip: 'Pairwise compatibility matrix mapping across hundreds of cohort candidates in one click.' },
      { text: 'Custom Legal Micro-Contract Vesting & Equity Schedules', hasInfo: true, infoTooltip: 'Legally vetted templates exportable as binding PDF agreements with digital signatures.' },
      { text: '0% Platform Settlement Fee on all team escrow payouts', hasInfo: false },
      { text: 'Multi-Sig Escrow Treasury & Stripe Connect direct payouts', hasInfo: false },
      { text: 'Dedicated Partner Success Manager & SLA guarantees', hasInfo: false },
    ],
    ctaText: 'Upgrade to Syndicate',
  },
];

export default function ChangeablePricingSection({
  plans = defaultPassionPlans,
  defaultPlanId = 'pro',
  defaultCycle = 'monthly',
  onContinue,
  className = '',
  title = 'Predictable, Founder-Friendly Economics',
  subtitle = 'Find your dream partner for free. Upgrade when your pod is ready for automated AI verification, live tool integrations, and legally binding revenue splits.',
  kicker = 'Transparent Pricing',
}: ChangeablePricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(defaultCycle);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlanId);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = (planId: string) => {
    setIsSubmitting(true);
    if (onContinue) {
      onContinue(planId, billingCycle);
    }
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessNotice(`Selected ${selectedPlan.name} (${billingCycle}). Redirecting to checkout / pod onboarding...`);
      setTimeout(() => setSuccessNotice(null), 4000);
    }, 500);
  };

  return (
    <section className={`changeable-pricing-section ${className}`} style={{ width: '100%', position: 'relative' }}>
      {/* Header & Title */}
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px' }}>
        {kicker && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent, #ff3d6e)',
              background: 'rgba(255, 61, 110, 0.08)',
              border: '1px solid rgba(255, 61, 110, 0.2)',
              padding: '5px 14px',
              borderRadius: 999,
              marginBottom: 16,
            }}
          >
            <span>⚡</span>
            <span>{kicker}</span>
          </span>
        )}
        <h1
          style={{
            fontSize: 'clamp(2.1rem, 4vw, 2.85rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-bright, #111827)',
            marginBottom: 14,
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 16, color: 'var(--muted, #4b5563)', lineHeight: 1.6, maxWidth: 620, margin: '0 auto' }}>
          {subtitle}
        </p>
      </div>

      {/* Cycle Toggle Pill */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 44 }}>
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--bg-2, #f4f3ef)',
            border: '1px solid var(--stroke, #e5e3db)',
            borderRadius: 999,
            padding: 4,
            boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))',
          }}
        >
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '8px 22px',
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 999,
              border: 'none',
              background: 'transparent',
              color: billingCycle === 'monthly' ? '#ffffff' : 'var(--text, #1f2937)',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
          >
            Monthly
            {billingCycle === 'monthly' && (
              <motion.div
                layoutId="pricing-cycle-pill"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--accent, #ff3d6e)',
                  borderRadius: 999,
                  zIndex: -1,
                  boxShadow: '0 2px 10px rgba(255, 61, 110, 0.35)',
                }}
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '8px 22px',
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 999,
              border: 'none',
              background: 'transparent',
              color: billingCycle === 'yearly' ? '#ffffff' : 'var(--text, #1f2937)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'color 0.2s ease',
            }}
          >
            <span>Yearly</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                background: billingCycle === 'yearly' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(5, 150, 105, 0.12)',
                color: billingCycle === 'yearly' ? '#ffffff' : '#059669',
                border: billingCycle === 'yearly' ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(5, 150, 105, 0.25)',
                padding: '2px 8px',
                borderRadius: 999,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Save 20%
            </span>
            {billingCycle === 'yearly' && (
              <motion.div
                layoutId="pricing-cycle-pill"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--accent, #ff3d6e)',
                  borderRadius: 999,
                  zIndex: -1,
                  boxShadow: '0 2px 10px rgba(255, 61, 110, 0.35)',
                }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          alignItems: 'stretch',
          position: 'relative',
        }}
      >
        {plans.map((plan) => {
          const isSelected = plan.id === selectedPlanId;
          const displayPrice = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
          const isPopular = plan.badge === 'POPULAR' || plan.id === 'pro' || plan.id === 'business';

          return (
            <div
              key={plan.id}
              onClick={() => handleSelectPlan(plan.id)}
              style={{
                position: 'relative',
                background: 'var(--surface, #ffffff)',
                border: isSelected
                  ? '2px solid var(--accent, #ff3d6e)'
                  : '1px solid var(--stroke, #e5e3db)',
                borderRadius: 'var(--radius-xl, 16px)',
                padding: '36px 30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: isSelected
                  ? '0 16px 36px -10px rgba(255, 61, 110, 0.2), 0 0 0 1px rgba(255, 61, 110, 0.3)'
                  : 'var(--shadow, 0 1px 3px rgba(0,0,0,0.08))',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: isSelected ? 2 : 1,
              }}
            >
              {/* Top Badge */}
              {plan.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    right: 24,
                    background: isPopular
                      ? 'linear-gradient(135deg, #ff3d6e 0%, #8b5cf6 100%)'
                      : 'var(--accent, #ff3d6e)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '4px 14px',
                    borderRadius: 999,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    boxShadow: '0 4px 14px rgba(255, 61, 110, 0.4)',
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div>
                {/* Header Info */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-bright, #111827)', margin: 0 }}>
                    {plan.name}
                  </h3>
                  {isSelected && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--accent, #ff3d6e)',
                        background: 'rgba(255, 61, 110, 0.08)',
                        padding: '3px 8px',
                        borderRadius: 6,
                        border: '1px solid rgba(255, 61, 110, 0.25)',
                      }}
                    >
                      SELECTED
                    </span>
                  )}
                </div>

                <p style={{ fontSize: 14, color: 'var(--muted, #4b5563)', marginBottom: 24, minHeight: 42, lineHeight: 1.45 }}>
                  {plan.description}
                </p>

                {/* Price Display */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${plan.id}-${billingCycle}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        fontSize: 42,
                        fontWeight: 900,
                        color: 'var(--text-bright, #111827)',
                        letterSpacing: '-0.03em',
                      }}
                    >
                      {displayPrice}
                    </motion.span>
                  </AnimatePresence>
                  <span style={{ fontSize: 14, color: 'var(--dim, #6b7280)', fontWeight: 500 }}>
                    {displayPrice === '$0' ? '/ forever' : `/ month ${billingCycle === 'yearly' ? '(billed annually)' : ''}`}
                  </span>
                </div>

                {/* Features Label */}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    color: isSelected ? 'var(--accent, #ff3d6e)' : 'var(--dim, #6b7280)',
                    margin: '24px 0 16px',
                    borderTop: '1px solid var(--stroke-subtle, #eeece5)',
                    paddingTop: 18,
                  }}
                >
                  {plan.featuresLabel}
                </div>

                {/* Features List */}
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 13,
                    fontSize: 14,
                  }}
                >
                  {plan.features.map((feat, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        color: 'var(--text, #1f2937)',
                        lineHeight: 1.45,
                      }}
                    >
                      <span
                        style={{
                          color: isSelected ? 'var(--accent, #ff3d6e)' : '#059669',
                          fontWeight: 800,
                          fontSize: 16,
                          flexShrink: 0,
                          marginTop: -1,
                        }}
                      >
                        ✓
                      </span>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 500 }}>{feat.text}</span>
                        {feat.hasInfo && (
                          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltip(activeTooltip === `${plan.id}-${idx}` ? null : `${plan.id}-${idx}`);
                              }}
                              onMouseEnter={() => setActiveTooltip(`${plan.id}-${idx}`)}
                              onMouseLeave={() => setActiveTooltip(null)}
                              style={{
                                width: 17,
                                height: 17,
                                borderRadius: '50%',
                                background: 'var(--bg-3, #eeebe3)',
                                color: 'var(--muted, #4b5563)',
                                border: '1px solid var(--stroke, #e5e3db)',
                                fontSize: 10,
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                              }}
                              aria-label="Feature details"
                            >
                              i
                            </button>

                            {/* Tooltip Popup */}
                            <AnimatePresence>
                              {activeTooltip === `${plan.id}-${idx}` && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.92, y: 6 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.92, y: 6 }}
                                  transition={{ duration: 0.15 }}
                                  style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    marginBottom: 8,
                                    width: 230,
                                    background: '#111827',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
                                    borderRadius: 8,
                                    padding: '10px 12px',
                                    fontSize: 12,
                                    color: '#f9fafb',
                                    lineHeight: 1.45,
                                    zIndex: 50,
                                    pointerEvents: 'none',
                                  }}
                                >
                                  {feat.infoTooltip || 'Feature included.'}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleContinue(plan.id);
                }}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  borderRadius: 'var(--radius-md, 10px)',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isSelected ? 'none' : '1px solid var(--stroke-strong, #d2cfc4)',
                  background: isSelected
                    ? 'linear-gradient(135deg, var(--accent, #ff3d6e) 0%, #e02858 100%)'
                    : 'var(--surface-inset, #f4f3ee)',
                  color: isSelected ? '#ffffff' : 'var(--text-bright, #111827)',
                  boxShadow: isSelected ? '0 4px 16px rgba(255, 61, 110, 0.35)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span>{plan.ctaText || (isSelected ? `Continue with ${plan.name}` : `Select ${plan.name}`)}</span>
                <span style={{ fontSize: 16 }}>→</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Toast Notice */}
      <AnimatePresence>
        {successNotice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#111827',
              border: '1px solid rgba(255, 61, 110, 0.4)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
              borderRadius: 12,
              padding: '14px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              zIndex: 100,
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span style={{ color: '#4ade80', fontSize: 18 }}>✓</span>
            <span>{successNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Micro-Contract Escrow & Challenge Incentive Card */}
      <div
        style={{
          marginTop: 48,
          background: 'var(--surface, #ffffff)',
          border: '1px solid var(--stroke, #e5e3db)',
          borderRadius: 'var(--radius-xl, 16px)',
          padding: '32px 36px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))',
        }}
      >
        <div style={{ maxWidth: 580 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>🤝</span>
            <h4 style={{ fontSize: 19, fontWeight: 800, color: 'var(--text-bright, #111827)', margin: 0 }}>
              Need Custom Escrow &amp; Co-Founder Revenue Splits?
            </h4>
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted, #4b5563)', margin: 0, lineHeight: 1.55 }}>
            Every micro-contract on Passion Protocol includes automated AI code verification, milestone escrow protection, and legal IP copyright retention. Zero upfront risk.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link
            href="/workspace/demo"
            className="primary-btn"
            style={{
              padding: '11px 22px',
              fontSize: 14,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>Test Live Pod Workspace</span>
            <span>→</span>
          </Link>
          <Link
            href="/discover"
            className="outline-btn"
            style={{
              padding: '11px 22px',
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            Discover Partners Free
          </Link>
        </div>
      </div>
    </section>
  );
}
