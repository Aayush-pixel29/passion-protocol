"use client";

import { useEffect, useState } from "react";

type WordMorphProps = {
  words: string[];
  intervalMs?: number;
};

export function WordMorph({ words, intervalMs = 2600 }: WordMorphProps) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setAnimating(false);
      }, 300);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [words.length, intervalMs]);

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        background: "linear-gradient(135deg, #ff3d6e 0%, #8b5cf6 50%, #06b6d4 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "#ff3d6e", // Fallback color
        fontWeight: 800,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: animating ? 0.3 : 1,
        transform: animating ? "translateY(6px) scale(0.98)" : "translateY(0) scale(1)",
        filter: animating ? "blur(2px)" : "blur(0)",
      }}
    >
      {words[index]}
    </span>
  );
}
