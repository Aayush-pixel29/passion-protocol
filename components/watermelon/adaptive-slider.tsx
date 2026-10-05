"use client";

import { useState, useMemo, type FC, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

interface AdaptiveSliderProps {
  label: string;
  subtitle?: string;
  leftLabel?: string;
  rightLabel?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
}

const getColorSettings = (value: number, min: number, max: number) => {
  const percentage = (value - min) / (max - min);

  if (percentage <= 0.3) {
    return {
      text: "#059669",
      gradient: "linear-gradient(90deg, #10b981, #059669)",
      thumbBorder: "#059669",
      bgSubtle: "rgba(16, 185, 129, 0.12)",
    };
  } else if (percentage <= 0.7) {
    return {
      text: "#0284c7",
      gradient: "linear-gradient(90deg, #38bdf8, #0284c7)",
      thumbBorder: "#0284c7",
      bgSubtle: "rgba(2, 132, 199, 0.12)",
    };
  } else {
    return {
      text: "#ff3d6e",
      gradient: "linear-gradient(90deg, #ff3d6e, #e11d48)",
      thumbBorder: "#ff3d6e",
      bgSubtle: "rgba(255, 61, 110, 0.12)",
    };
  }
};

export const AdaptiveVibeSlider: FC<AdaptiveSliderProps> = ({
  label,
  subtitle,
  leftLabel,
  rightLabel,
  value,
  min = 1,
  max = 5,
  step = 1,
  defaultValue = 3,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const currentVal = value ?? internalValue;

  const colorSettings = useMemo(
    () => getColorSettings(currentVal, min, max),
    [currentVal, min, max]
  );

  const percentage = Math.max(0, Math.min(100, ((currentVal - min) / (max - min)) * 100));

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setInternalValue(val);
    onChange?.(val);
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--stroke)",
        borderRadius: "var(--radius-lg)",
        padding: "18px 20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        position: "relative",
      }}
    >
      {/* Header Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "14px",
        }}
      >
        <div>
          <h4
            style={{
              fontSize: "15px",
              fontWeight: 800,
              color: "var(--text-bright)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {label}
          </h4>
          {subtitle && (
            <p style={{ fontSize: "12px", color: "var(--muted)", margin: "2px 0 0" }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Value counter badge */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "2px",
            background: colorSettings.bgSubtle,
            border: `1px solid ${colorSettings.thumbBorder}40`,
            padding: "3px 10px",
            borderRadius: "9999px",
          }}
        >
          <div style={{ position: "relative", height: "18px", overflow: "hidden", minWidth: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={currentVal}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                style={{
                  fontSize: "14px",
                  fontWeight: 900,
                  fontFamily: "var(--font-mono)",
                  color: colorSettings.text,
                }}
              >
                {currentVal}
              </motion.span>
            </AnimatePresence>
          </div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--dim)", fontFamily: "var(--font-mono)" }}>
            / {max}
          </span>
        </div>
      </div>

      {/* Adaptive Slider Track */}
      <div
        style={{
          position: "relative",
          height: "36px",
          width: "100%",
          borderRadius: "9999px",
          background: "var(--surface-inset)",
          border: "1px solid var(--stroke)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Step Dots */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 18px",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {Array.from({ length: max - min + 1 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: i <= currentVal - min ? "rgba(255,255,255,0.9)" : "var(--stroke-strong)",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>

        {/* Dynamic Gradient Bar */}
        <motion.div
          animate={{
            width: `calc((${percentage} / 100) * (100% - 36px) + 36px)`,
            background: colorSettings.gradient,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            borderRadius: "9999px",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Native Range Input */}
        <input
          title={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentVal}
          onChange={handleSliderChange}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
            zIndex: 10,
            margin: 0,
          }}
        />

        {/* Floating Thumb */}
        <motion.div
          animate={{
            left: `calc((${percentage} / 100) * (100% - 32px))`,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          style={{
            position: "absolute",
            top: "2px",
            height: "30px",
            width: "30px",
            borderRadius: "50%",
            background: "#ffffff",
            border: `2px solid ${colorSettings.thumbBorder}`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 800,
            fontFamily: "var(--font-mono)",
            color: colorSettings.thumbBorder,
            pointerEvents: "none",
            zIndex: 4,
          }}
        >
          {currentVal}
        </motion.div>
      </div>

      {/* Left and Right Label Boundaries */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "var(--muted)",
          fontWeight: 600,
          marginTop: "8px",
          padding: "0 4px",
        }}
      >
        <span>{leftLabel}</span>
        <span style={{ color: "var(--text-bright)" }}>{rightLabel}</span>
      </div>
    </div>
  );
};
