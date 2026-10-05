"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame,
  MapPin,
  Tag,
  DollarSign,
  Link as LinkIcon,
  Zap,
} from "lucide-react";
import { RxArrowTopRight } from "react-icons/rx";
import { AvatarSVG } from "@/components/Avatar";
import { VibeGraph } from "@/components/VibeGraph";

export interface ExpandableProfileCardProps {
  imageSrc?: string;
  avatarComponent?: React.ReactNode;
  badge?: string;
  title: string;
  subtitle: string;
  description?: string;
  score?: number;
  location?: string;
  websiteUrl?: string;
  githubUrl?: string;
  languages?: string[];
  categories?: string[];
  contractComfort?: string;
  vibe?: {
    pace: number;
    comms: number;
    risk: number;
    energy: number;
  };
  projectTitle?: string;
  projectDesc?: string;
  content?: React.ReactNode;
  footerAction?: React.ReactNode;
  onConnect?: () => void;
  connectStatus?: string;
  isPending?: boolean;
}

export function ExpandableProfileCard({
  imageSrc,
  avatarComponent,
  badge = "⚡ VERIFIED OPERATOR",
  title = "OPERATOR_01",
  subtitle = "Software & IT · Seeking Creative & Design",
  description = "Building next-generation distributed systems and high-throughput microservices.",
  score = 95,
  location = "Remote / Global",
  websiteUrl,
  githubUrl,
  languages = ["English"],
  categories = ["Software & IT"],
  contractComfort = "Both (Equity + Paid)",
  vibe = { pace: 4, comms: 3, risk: 4, energy: 4 },
  projectTitle,
  projectDesc,
  content,
  footerAction,
  onConnect,
  connectStatus = "none",
  isPending = false,
}: ExpandableProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const layoutId = `expandable-operator-card-${title.replace(/\s+/g, "-")}`;
  const isHighSynergy = score >= 90;

  return (
    <>
      {/* Outer Card */}
      <motion.div
        layout
        onClick={() => setIsOpen(true)}
        style={{
          width: "100%",
          borderRadius: "20px",
          background: "var(--surface)",
          border: `1px solid ${connectStatus === "accepted" ? "var(--success)" : isHighSynergy ? "var(--accent-border)" : "var(--stroke)"}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          padding: "20px",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        whileHover={{
          y: -4,
          boxShadow: "0 14px 36px rgba(0,0,0,0.08), 0 0 24px rgba(255,61,110,0.12)",
        }}
      >
        {/* Header Row: Avatar + Name + Sparkline Curve + Synergy Score Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
            {avatarComponent ? (
              <div
                style={{
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `2px solid ${isHighSynergy ? "var(--accent)" : "var(--stroke)"}`,
                  background: "var(--surface-inset)",
                  flexShrink: 0,
                }}
              >
                {avatarComponent}
              </div>
            ) : imageSrc ? (
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid var(--accent)",
                  flexShrink: 0,
                }}
              >
                <img src={imageSrc} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : null}

            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900, color: "var(--text-bright)", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {title}
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--accent-3)", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {subtitle}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            {/* Sparkline Curve */}
            <VibeGraph vibe={vibe} variant="sparkline" />

            {/* Synergy Heat Score Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                borderRadius: "9999px",
                background: isHighSynergy ? "var(--accent)" : "var(--surface-inset)",
                color: isHighSynergy ? "#ffffff" : "var(--text-bright)",
                fontSize: "11px",
                fontWeight: 800,
                fontFamily: "var(--font-mono)",
                border: `1px solid ${isHighSynergy ? "transparent" : "var(--stroke)"}`,
                boxShadow: isHighSynergy ? "0 2px 10px rgba(255, 61, 110, 0.4)" : "none",
              }}
            >
              <Flame size={12} fill={isHighSynergy ? "#fff" : "#ff3d6e"} color={isHighSynergy ? "#fff" : "#ff3d6e"} />
              <span>{score}%</span>
              <RxArrowTopRight size={13} strokeWidth={0.5} />
            </div>
          </div>
        </div>

        {/* Bio / Superpower Quote */}
        {description && (
          <div
            style={{
              padding: "10px 14px",
              background: "var(--surface-inset)",
              borderRadius: "10px",
              borderLeft: "3px solid var(--accent)",
              fontSize: "13px",
              color: "var(--text)",
              fontStyle: "italic",
              lineHeight: 1.45,
            }}
          >
            &ldquo;{description}&rdquo;
          </div>
        )}

        {/* 4D Working Rhythm Wave Graph */}
        <VibeGraph vibe={vibe} variant="wave" height={70} />

        {/* Languages & Category Badges */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          {categories.map((cat) => (
            <span
              key={cat}
              style={{
                padding: "2px 8px",
                borderRadius: "9999px",
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.25)",
                color: "var(--accent-2)",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {cat}
            </span>
          ))}
          {languages.map((lang) => (
            <span
              key={lang}
              style={{
                padding: "2px 8px",
                borderRadius: "9999px",
                background: "var(--surface-inset)",
                border: "1px solid var(--stroke)",
                color: "var(--muted)",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {lang}
            </span>
          ))}
        </div>

        {/* Inspect Credentials Prompt */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--accent)",
            paddingTop: "4px",
            borderTop: "1px solid var(--stroke-subtle)",
          }}
        >
          <span>🔍 Tap to expand full passport &amp; specs</span>
          <span>&rarr;</span>
        </div>

        {/* Footer Action (if provided directly on card) */}
        {footerAction && (
          <div onClick={(e) => e.stopPropagation()} style={{ marginTop: "auto" }}>
            {footerAction}
          </div>
        )}
      </motion.div>

      {/* Expanded Split Editorial Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(14px)",
              }}
            />

            {/* Split Screen Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0 }}
              style={{
                position: "relative",
                maxWidth: "760px",
                width: "100%",
                maxHeight: "88vh",
                background: "var(--surface)",
                border: "1px solid var(--stroke-strong)",
                borderRadius: "24px",
                boxShadow: "0 25px 60px -15px rgba(0,0,0,0.5)",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  zIndex: 30,
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 800,
                  backdropFilter: "blur(4px)",
                }}
              >
                ✕
              </button>

              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", height: "100%", overflowY: "auto" }}>
                {/* Left Side: Avatar / Photo Showcase with Holographic Glow */}
                <div
                  style={{
                    flex: "1 1 280px",
                    background: "linear-gradient(135deg, #12131c 0%, #1e1b2e 100%)",
                    padding: "32px 24px",
                    color: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                      <Zap size={16} color="#ff8fab" />
                      <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", color: "#ff8fab", textTransform: "uppercase" }}>
                        {badge || "PASSION OPERATOR PASSPORT"}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center", margin: "16px 0 24px" }}>
                      {imageSrc ? (
                        <div
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "3px solid #ff3d6e",
                            boxShadow: "0 0 24px rgba(255,61,110,0.5)",
                          }}
                        >
                          <img src={imageSrc} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div
                          style={{
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "3px solid #06b6d4",
                            boxShadow: "0 0 24px rgba(6,182,212,0.5)",
                          }}
                        >
                          {avatarComponent || <AvatarSVG name={title} size={110} />}
                        </div>
                      )}

                      <div>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 900, margin: 0, color: "#ffffff" }}>
                          {title}
                        </h2>
                        <span style={{ fontSize: "12px", color: "#67e8f9", fontWeight: 700, display: "block", marginTop: "4px" }}>
                          {subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Polar Radar Visualizer in Left Column */}
                    <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "14px", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <span style={{ fontSize: "10px", fontWeight: 800, color: "#ff8fab", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", textAlign: "center", marginBottom: "8px" }}>
                        4D POLAR RADAR
                      </span>
                      <VibeGraph vibe={vibe} variant="radar" />
                    </div>
                  </div>
                </div>

                {/* Right Side: Detailed Operator Specs & Data Rows */}
                <div style={{ flex: "1 1 380px", padding: "32px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        OPERATOR SPECIFICATIONS
                      </span>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          background: "var(--accent)",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: 800,
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        <Flame size={12} fill="#fff" />
                        <span>{score}% Synergy Score</span>
                      </div>
                    </div>

                    {description && (
                      <p style={{ fontSize: "14px", color: "var(--text-bright)", lineHeight: 1.5, background: "var(--surface-inset)", padding: "12px 16px", borderRadius: "12px", borderLeft: "3px solid var(--accent)", fontStyle: "italic", margin: "0 0 16px" }}>
                        &ldquo;{description}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Active Venture Pitch */}
                  {projectTitle && (
                    <div style={{ padding: "14px 16px", background: "var(--surface-inset)", border: "1px solid var(--stroke)", borderRadius: "14px" }}>
                      <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 800, color: "var(--text-bright)" }}>
                        🚀 Active Venture: {projectTitle}
                      </h4>
                      <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
                        {projectDesc || "Currently seeking a complementary co-founder to build and launch."}
                      </p>
                    </div>
                  )}

                  {/* Structured Data Rows */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <DataRow icon={<MapPin size={16} />} label="Location & Timezone">
                      <strong style={{ fontSize: "13px", color: "var(--text-bright)" }}>{location}</strong>
                    </DataRow>

                    <DataRow icon={<Tag size={16} />} label="Spoken Languages">
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                        {languages.map((l) => (
                          <span key={l} style={{ padding: "2px 8px", background: "var(--surface-inset)", border: "1px solid var(--stroke)", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>
                            {l}
                          </span>
                        ))}
                      </div>
                    </DataRow>

                    <DataRow icon={<DollarSign size={16} />} label="Collaboration Tier">
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--success)" }}>
                        {contractComfort}
                      </span>
                    </DataRow>

                    {websiteUrl && (
                      <DataRow icon={<LinkIcon size={16} />} label="Website / Portfolio">
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)" }}>
                          {websiteUrl}
                        </span>
                      </DataRow>
                    )}

                    {githubUrl && (
                      <DataRow icon={<LinkIcon size={16} />} label="Developer GitHub / Profile">
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)" }}>
                          {githubUrl}
                        </span>
                      </DataRow>
                    )}
                  </div>

                  {content && <div>{content}</div>}

                  {/* Direct Connect / Dismiss Action */}
                  <div style={{ marginTop: "auto", display: "flex", gap: "12px", paddingTop: "16px", borderTop: "1px solid var(--stroke)" }}>
                    <button
                      type="button"
                      className="outline-btn"
                      style={{ flex: 1, padding: "12px" }}
                      onClick={() => setIsOpen(false)}
                    >
                      Close View
                    </button>
                    {onConnect && connectStatus === "none" && (
                      <button
                        type="button"
                        className="primary-btn"
                        style={{ flex: 1.5, padding: "12px", fontSize: "14px" }}
                        disabled={isPending}
                        onClick={() => {
                          onConnect();
                          setIsOpen(false);
                        }}
                      >
                        {isPending ? "Transmitting Signal…" : `⚡ Connect with ${title}`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

const DataRow = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "4px 0" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--dim)" }}>
      {icon}
      <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--muted)" }}>{label}</span>
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", textAlign: "right" }}>{children}</div>
  </div>
);

export default ExpandableProfileCard;
