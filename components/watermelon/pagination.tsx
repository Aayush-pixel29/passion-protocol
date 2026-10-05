"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi2";

export interface PaginationProps {
  totalPages?: number;
  value?: number;
  defaultValue?: number;
  stepLabels?: string[];
  onChange?: (page: number) => void;
  className?: string;
}

export function WatermelonPagination({
  totalPages = 4,
  value,
  defaultValue = 1,
  stepLabels = ["Identity & Photo", "4D Vibe Rhythm", "Pitch & Links", "Operator Passport"],
  onChange,
}: PaginationProps) {
  const isControlled = value !== undefined;
  const [internalPage, setInternalPage] = React.useState(defaultValue);
  const [direction, setDirection] = React.useState(0);

  const currentPage = isControlled ? value! : internalPage;
  const currentLabel = stepLabels[currentPage - 1] || "";

  const paginate = (dir: number) => {
    const next = Math.min(totalPages, Math.max(1, currentPage + dir));
    if (next === currentPage) return;
    setDirection(dir);
    if (!isControlled) {
      setInternalPage(next);
    }
    onChange?.(next);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          background: "var(--surface)",
          border: "1px solid var(--stroke)",
          borderRadius: "9999px",
          padding: "6px 16px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => paginate(-1)}
          disabled={currentPage === 1}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1px solid var(--stroke)",
            background: currentPage === 1 ? "var(--surface-inset)" : "var(--surface)",
            color: currentPage === 1 ? "var(--dim)" : "var(--text-bright)",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            opacity: currentPage === 1 ? 0.4 : 1,
            transition: "all 0.15s ease",
          }}
          aria-label="Previous Step"
        >
          <HiOutlineArrowLeft style={{ width: "16px", height: "16px" }} />
        </button>

        {/* Step Numbers & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", userSelect: "none" }}>
          <div
            style={{
              position: "relative",
              height: "24px",
              minWidth: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.span
                key={currentPage}
                initial={{ y: direction > 0 ? 14 : -14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? -14 : 14, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  fontSize: "15px",
                  fontWeight: 800,
                  fontFamily: "var(--font-mono)",
                  color: "var(--accent)",
                  display: "block",
                }}
              >
                {currentPage}
              </motion.span>
            </AnimatePresence>
          </div>

          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
              color: "var(--dim)",
            }}
          >
            / {totalPages}
          </span>

          {currentLabel && (
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--text-bright)",
                borderLeft: "1px solid var(--stroke)",
                paddingLeft: "10px",
                marginLeft: "4px",
                whiteSpace: "nowrap",
              }}
            >
              {currentLabel}
            </span>
          )}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => paginate(1)}
          disabled={currentPage === totalPages}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1px solid var(--stroke)",
            background: currentPage === totalPages ? "var(--surface-inset)" : "var(--accent)",
            color: currentPage === totalPages ? "var(--dim)" : "#ffffff",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            opacity: currentPage === totalPages ? 0.4 : 1,
            boxShadow: currentPage < totalPages ? "0 0 10px var(--accent-subtle)" : "none",
            transition: "all 0.15s ease",
          }}
          aria-label="Next Step"
        >
          <HiOutlineArrowRight style={{ width: "16px", height: "16px" }} />
        </button>
      </div>
    </div>
  );
}

export default WatermelonPagination;
