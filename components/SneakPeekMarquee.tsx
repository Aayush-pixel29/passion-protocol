"use client";

import React from "react";
import { CATEGORY_ICONS, INTENT_ICONS } from "@/lib/types";

type SneakProfile = {
  codename: string;
  professional_title: string;
  industry_category: string;
  intent_filter: string | null;
};

export function SneakPeekMarquee({ profiles }: { profiles: SneakProfile[] }) {
  if (!profiles || profiles.length === 0) return null;

  // Double the profiles for seamless infinite scroll
  const doubled = [...profiles, ...profiles];

  return (
    <section className="sneak-peek-section" style={{ margin: "56px 0 40px", width: "100%", overflow: "hidden" }}>
      <div
        className="sneak-peek-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <span
          className="status-dot"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)",
            display: "inline-block",
          }}
        />
        <span
          className="sneak-peek-label"
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--dim, #6b7280)",
          }}
        >
          Builders already on the platform
        </span>
      </div>

      <div
        className="marquee-track"
        aria-label="Active builder profiles"
        style={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <div
          className="marquee-scroll"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            gap: 16,
            width: "max-content",
          }}
        >
          {doubled.map((p, i) => {
            const icon = CATEGORY_ICONS[p.industry_category] || "🧑‍💻";
            const intentIcon = p.intent_filter ? INTENT_ICONS[p.intent_filter] || "" : "";
            // Mask the codename to show mystery
            const masked = p.codename.length > 3 ? p.codename.slice(0, 3) + "••••" : p.codename;
            return (
              <div
                key={`${p.codename}-${i}`}
                className="marquee-card glass-card"
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  background: "var(--surface, #ffffff)",
                  border: "1px solid var(--stroke, #e5e3db)",
                  padding: "10px 18px",
                  borderRadius: 999,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  className="marquee-avatar"
                  style={{
                    fontSize: 18,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "var(--bg-2, #f4f3ef)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span>{icon}</span>
                </div>
                <div
                  className="marquee-info"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  <span
                    className="marquee-name"
                    style={{
                      fontSize: 13,
                      fontWeight: 750,
                      color: "var(--text-bright, #111827)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {masked}
                  </span>
                  <span
                    className="marquee-title"
                    style={{
                      fontSize: 12,
                      color: "var(--muted, #4b5563)",
                    }}
                  >
                    {p.professional_title}
                  </span>
                </div>
                {p.intent_filter && (
                  <span
                    className="marquee-intent"
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: "rgba(255, 61, 110, 0.08)",
                      color: "var(--accent, #ff3d6e)",
                      padding: "3px 10px",
                      borderRadius: 999,
                      border: "1px solid rgba(255, 61, 110, 0.2)",
                    }}
                  >
                    {intentIcon} {p.intent_filter}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
