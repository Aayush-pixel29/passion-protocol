"use client";

import { useState, useMemo, type FC, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AdaptiveSliderProps {
  label?: string;
  unit?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  labels?: Record<number, string>;
  onChange?: (value: number) => void;
  className?: string;
  compact?: boolean;
}

interface ColorSettings {
  text: string;
  gradient: string;
  thumbBorder: string;
}

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 5;
const DEFAULT_STEP = 1;
const DEFAULT_VALUE = 4;

const getColorSettings = (
  value: number,
  min: number,
  max: number
): ColorSettings => {
  const percentage = (value - min) / (max - min || 1);

  if (percentage < 0.4) {
    return {
      text: "#06b6d4",
      gradient: "linear-gradient(90deg, #06b6d4, #3b82f6)",
      thumbBorder: "#06b6d4",
    };
  } else if (percentage < 0.75) {
    return {
      text: "#8b5cf6",
      gradient: "linear-gradient(90deg, #8b5cf6, #ec4899)",
      thumbBorder: "#8b5cf6",
    };
  } else {
    return {
      text: "#ff3d6e",
      gradient: "linear-gradient(90deg, #ff3d6e, #f97316)",
      thumbBorder: "#ff3d6e",
    };
  }
};

export const AdaptiveSlider: FC<AdaptiveSliderProps> = ({
  label = "Work Pace",
  unit = "/ 5",
  value,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  step = DEFAULT_STEP,
  defaultValue = DEFAULT_VALUE,
  labels,
  onChange,
  className,
  compact = false,
}) => {
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const currentVal = value ?? internalValue;

  const colorSettings = useMemo(
    () => getColorSettings(currentVal, min, max),
    [currentVal, min, max]
  );

  const percentage = ((currentVal - min) / (max - min || 1)) * 100;

  const numDots = max - min + 1 <= 10 ? max - min + 1 : 6;
  const dots = useMemo(
    () =>
      Array.from({ length: numDots }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "var(--stroke-strong)",
            opacity: 0.6,
            zIndex: 10,
          }}
        />
      )),
    [numDots]
  );

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setInternalValue(val);
    onChange?.(val);
  };

  const descriptor = labels?.[currentVal] || "";

  return (
    <div
      className={cn(
        "relative flex flex-col justify-center rounded-2xl border border-[var(--stroke)] bg-[var(--surface)] p-5 shadow-sm transition-all select-none",
        compact ? "p-4" : "p-6",
        className
      )}
      style={{
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
          {label}
        </span>
        {descriptor && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              color: colorSettings.text,
              backgroundColor: "var(--surface-inset)",
              border: "1px solid var(--stroke-subtle)",
            }}
          >
            {descriptor}
          </span>
        )}
      </div>

      <div className="mb-4 flex items-baseline gap-2">
        <AnimatedText
          value={currentVal.toString()}
          className="text-4xl font-extrabold tracking-tight"
          style={{ color: "var(--text-bright)" }}
        />
        <motion.span
          layout
          className="text-sm font-semibold text-[var(--muted)]"
        >
          {unit}
        </motion.span>
      </div>

      {/* Slider Track with Dynamic Fill and Dots */}
      <div
        className="group relative flex h-11 w-full items-center overflow-hidden rounded-full transition-colors"
        style={{ backgroundColor: "var(--surface-inset)", border: "1px solid var(--stroke)" }}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 transition-colors">
          {dots}
        </div>

        <motion.div
          className="pointer-events-none absolute top-0 left-0 h-full rounded-full"
          animate={{
            width: `calc((${percentage} / 100) * (100% - 44px) + 44px)`,
            background: colorSettings.gradient,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        <input
          title={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentVal}
          onChange={handleSliderChange}
          className="absolute inset-0 z-30 h-11 w-full cursor-pointer opacity-0"
        />

        <motion.div
          className="pointer-events-none absolute top-0 z-20 flex size-11 items-center justify-center rounded-full"
          animate={{
            left: `calc((${percentage} / 100) * (100% - 44px))`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div
            className="size-8 rounded-full bg-white shadow-md flex items-center justify-center border"
            style={{ borderColor: colorSettings.thumbBorder }}
          >
            <div
              className="size-2.5 rounded-full"
              style={{ backgroundColor: colorSettings.thumbBorder }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const AnimatedText = ({
  value,
  className,
  style,
}: {
  value: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={cn("flex tracking-tight will-change-transform", className)}
      style={style}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {value.split("").map((char, index) => {
          const displayChar = char === " " ? "\u00A0" : char;

          return (
            <motion.span
              key={char + index}
              initial={{ opacity: 0, y: -8, scale: 0.9 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 250,
                  damping: 22,
                },
              }}
              exit={{ opacity: 0, y: 8, scale: 0.9, transition: { duration: 0.15 } }}
            >
              {displayChar}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
