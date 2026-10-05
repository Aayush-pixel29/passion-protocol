"use client";

import React from "react";
import Link from "next/link";

type ShimmerButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function ShimmerButton({ href, children, className = "", style = {} }: ShimmerButtonProps) {
  return (
    <Link
      href={href}
      className={`shimmer-button ${className}`}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 28px",
        borderRadius: "var(--radius-md)",
        fontWeight: 700,
        fontSize: "15px",
        letterSpacing: "-0.01em",
        color: "#ffffff",
        background: "linear-gradient(135deg, #ff3d6e 0%, #d92455 100%)",
        boxShadow: "0 4px 20px rgba(255, 61, 110, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15) inset",
        overflow: "hidden",
        textDecoration: "none",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        ...style,
      }}
    >
      {/* Moving Shimmer Beam */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "200%",
          height: "100%",
          background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.28) 50%, transparent 100%)",
          animation: "shimmer 2.8s infinite",
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: "8px" }}>
        {children}
      </span>
    </Link>
  );
}
