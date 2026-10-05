"use client";

import React, { useRef, useState } from "react";

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  style?: React.CSSProperties;
};

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 61, 110, 0.12)",
  style = {},
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--stroke)",
        boxShadow: "var(--shadow-sm)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
        ...style,
      }}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          opacity,
          transition: "opacity 0.25s ease",
          background: `radial-gradient(550px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
          zIndex: 1,
        }}
      />
      {/* Card Content Layer */}
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}
