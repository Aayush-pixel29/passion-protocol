"use client";

import { CATEGORY_ICONS, INTENT_ICONS } from "@/lib/types";

type SneakProfile = {
  codename: string;
  professional_title: string;
  industry_category: string;
  intent_filter: string | null;
};

export function SneakPeekMarquee({ profiles }: { profiles: SneakProfile[] }) {
  if (profiles.length === 0) return null;

  // Double the profiles for seamless infinite scroll
  const doubled = [...profiles, ...profiles];

  return (
    <section className="sneak-peek-section">
      <div className="sneak-peek-header">
        <span className="status-dot" />
        <span className="sneak-peek-label">Builders already on the platform</span>
      </div>
      <div className="marquee-track" aria-label="Active builder profiles">
        <div className="marquee-scroll">
          {doubled.map((p, i) => {
            const icon = CATEGORY_ICONS[p.industry_category] || "🧑‍💻";
            const intentIcon = p.intent_filter ? INTENT_ICONS[p.intent_filter] || "" : "";
            // Mask the codename to show mystery
            const masked = p.codename.slice(0, 3) + "••••";
            return (
              <div key={`${p.codename}-${i}`} className="marquee-card glass-card">
                <div className="marquee-avatar">
                  <span>{icon}</span>
                </div>
                <div className="marquee-info">
                  <span className="marquee-name">{masked}</span>
                  <span className="marquee-title">{p.professional_title}</span>
                </div>
                {p.intent_filter && (
                  <span className="marquee-intent">{intentIcon} {p.intent_filter}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
