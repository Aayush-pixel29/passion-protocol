"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gradient reading-progress bar pinned to the top of the viewport. */
export function ScrollProgressLine() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 35, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 60,
        pointerEvents: "none",
        transformOrigin: "0% 50%",
        scaleX,
        background: "linear-gradient(90deg, #ff3d6e 0%, #8b5cf6 55%, #06b6d4 100%)",
      }}
    />
  );
}
