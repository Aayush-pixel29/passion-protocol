"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./TrialTaskShowcase.module.css";

const STAGES = [
  {
    key: "sent",
    label: "Sent",
    title: "Alex sent Maya a trial task",
    detail: "Small, scoped, time-boxed. No commitment yet.",
    progress: 0.15,
  },
  {
    key: "accepted",
    label: "Accepted",
    title: "Maya accepted · 48h timer started",
    detail: "Both sides agreed on scope and the definition of done.",
    progress: 0.4,
  },
  {
    key: "submitted",
    label: "Submitted",
    title: "Maya submitted the deliverable",
    detail: "Figma file + 3 onboarding screens, 6h before deadline.",
    progress: 0.7,
  },
  {
    key: "reviewed",
    label: "Reviewed",
    title: "Two-way review complete",
    detail: "Both rated pace, communication and quality.",
    progress: 0.9,
  },
  {
    key: "team",
    label: "Team up",
    title: "It's a fit — workspace unlocked",
    detail: "Shared workspace, chat and milestone contract are now open.",
    progress: 1,
  },
] as const;

const REVIEW = [
  { label: "Pace", a: 5, b: 4 },
  { label: "Communication", a: 5, b: 5 },
  { label: "Quality", a: 4, b: 5 },
];

export function TrialTaskShowcase() {
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 2600);
    return () => clearInterval(t);
  }, [paused]);

  const current = STAGES[stage];

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Window chrome */}
      <div className={styles.chrome}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.chromeTitle}>Trial task · #TT-0142</span>
      </div>

      {/* People */}
      <div className={styles.people}>
        <div className={styles.person}>
          <Image src="/images/avatar-alex-coder.png" alt="Alex, backend engineer" width={40} height={40} className={styles.avatar} />
          <div>
            <div className={styles.name}>Alex</div>
            <div className={styles.role}>💻 Backend engineer</div>
          </div>
        </div>
        <div className={styles.link} aria-hidden="true">
          <motion.span
            className={styles.linkPulse}
            animate={{ x: ["0%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className={`${styles.person} ${styles.personRight}`}>
          <div style={{ textAlign: "right" }}>
            <div className={styles.name}>Maya</div>
            <div className={styles.role}>🎨 Product designer</div>
          </div>
          <Image src="/images/avatar-maya-designer.png" alt="Maya, product designer" width={40} height={40} className={styles.avatar} />
        </div>
      </div>

      {/* Task brief */}
      <div className={styles.brief}>
        <div className={styles.briefRow}>
          <span className={styles.briefLabel}>Task</span>
          <span className={styles.briefValue}>Design the onboarding flow for a CLI deploy tool</span>
        </div>
        <div className={styles.briefMeta}>
          <span>⏱ 48h timebox</span>
          <span>📎 3 screens + Figma</span>
          <span>🤝 Unpaid trial</span>
        </div>
      </div>

      {/* Status */}
      <div className={styles.statusWrap}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={styles.status}
          >
            <span className={`${styles.statusBadge} ${current.key === "team" ? styles.statusBadgeDone : ""}`}>
              {current.label}
            </span>
            <div>
              <div className={styles.statusTitle}>{current.title}</div>
              <div className={styles.statusDetail}>{current.detail}</div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className={styles.track}>
          <motion.div
            className={styles.trackFill}
            animate={{ width: `${current.progress * 100}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Review panel appears from "reviewed" onwards */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={styles.review}
            >
              {REVIEW.map((r) => (
                <div key={r.label} className={styles.reviewRow}>
                  <span>{r.label}</span>
                  <span className={styles.stars} aria-label={`Alex ${r.a} of 5, Maya ${r.b} of 5`}>
                    {"★".repeat(r.a)}
                    <span className={styles.starsDim}>{"★".repeat(5 - r.a)}</span>
                    <span className={styles.reviewSep}>·</span>
                    {"★".repeat(r.b)}
                    <span className={styles.starsDim}>{"★".repeat(5 - r.b)}</span>
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stepper */}
      <div className={styles.stepper} role="tablist" aria-label="Trial task stages">
        {STAGES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={i === stage}
            suppressHydrationWarning
            onClick={() => {
              setStage(i);
              setPaused(true);
            }}
            className={`${styles.step} ${i <= stage ? styles.stepOn : ""}`}
          >
            <span className={styles.stepDot}>{i < stage ? "✓" : i + 1}</span>
            <span className={styles.stepLabel}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
