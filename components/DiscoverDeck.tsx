"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { sendConnect, respondToConnect } from "@/lib/actions";
import { formatRoleWithIcon, type Profile, type VibeAnswers, type ConnectState } from "@/lib/types";

export type DiscoverCard = {
  profile: Profile;
  vibe: VibeAnswers;
  project: import("@/lib/types").Project | null;
  score: number;
  connectStatus: ConnectState;
  contactUrl?: string | null;
};

const DIMS: Array<{ key: keyof VibeAnswers; label: string }> = [
  { key: "pace", label: "Pace" },
  { key: "comms", label: "Comms" },
  { key: "risk", label: "Risk" },
  { key: "energy", label: "Energy" },
];

function getAvatarImage(codename: string, category: string | null): string {
  const upper = (codename || "").toUpperCase();
  if (upper.includes("ALEX") || upper.includes("DEV") || upper.includes("ARJUN")) {
    return "/images/avatar-alex-coder.png";
  }
  if (upper.includes("RIYA") || upper.includes("MAYA") || upper.includes("DESIGN")) {
    return "/images/avatar-maya-designer.png";
  }
  if (upper.includes("NEO") || upper.includes("DAVID") || upper.includes("MAKER")) {
    return "/images/avatar-david-hardware.png";
  }
  if (upper.includes("KAI") || upper.includes("CARLOS") || upper.includes("SCRIPT")) {
    return "/images/avatar-carlos-writer.png";
  }
  if (upper.includes("LUNA") || upper.includes("PRIYA") || upper.includes("CODE")) {
    return "/images/avatar-priya-fintech.png";
  }
  if (upper.includes("GROWTH") || upper.includes("ELENA")) {
    return "/images/avatar-elena-growth.png";
  }

  switch (category) {
    case "Software & IT":
      return "/images/avatar-alex-coder.png";
    case "Creative & Design":
      return "/images/avatar-maya-designer.png";
    case "Engineering & Hardware":
      return "/images/avatar-david-hardware.png";
    case "Business & Sales":
      return "/images/avatar-elena-growth.png";
    case "Marketing & Content":
      return "/images/avatar-carlos-writer.png";
    default:
      return "/images/avatar-priya-fintech.png";
  }
}

function getAvatarGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 45) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 80%, 60%), hsl(${hue2}, 90%, 48%))`;
}

export function DiscoverDeck({ cards }: { cards: DiscoverCard[] }) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [local, setLocal] = useState(cards);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const visible = local.filter((c) => !hidden.has(c.profile.id));

  if (visible.length === 0) {
    return (
      <div className="empty" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
        <div style={{ position: "relative", width: 280, height: 160, marginBottom: 8 }}>
          <Image
            src="/images/empty-discover-deck.png"
            alt="Deep space observatory scanning for operators"
            width={280}
            height={160}
            style={{ objectFit: "contain", width: "100%", height: "auto" }}
            priority
          />
        </div>
        <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-bright)", margin: 0 }}>
          No operators with that role yet
        </p>
        <p style={{ maxWidth: 480, margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
          You&apos;re one of the first here — invite a collaborator or check back soon!
        </p>
        <Link 
          href="/profile" 
          className="outline-btn"
          style={{ marginTop: 8, padding: "10px 20px", fontSize: "14px" }}
        >
          Adjust Vibe Preferences →
        </Link>
      </div>
    );
  }

  function skip(id: string) {
    setError("");
    setHidden((prev) => new Set(prev).add(id));
  }

  function connect(id: string) {
    setError("");
    setBusyId(id);
    startTransition(async () => {
      const result = await sendConnect(id);
      setBusyId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      const status = result.status ?? "outgoing_pending";
      setLocal((rows) =>
        rows.map((row) => (row.profile.id === id ? { ...row, connectStatus: status } : row))
      );
    });
  }

  function respond(id: string, decision: "accepted" | "declined") {
    setError("");
    setBusyId(id);
    startTransition(async () => {
      const result = await respondToConnect(id, decision);
      setBusyId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      const status = result.status ?? decision;
      setLocal((rows) =>
        rows.map((row) => (row.profile.id === id ? { ...row, connectStatus: status } : row))
      );
    });
  }

  return (
    <div>
      {error ? <p className="error">{error}</p> : null}
      <div className="match-grid">
        {visible.map((card) => {
          const accepted = card.connectStatus === "accepted";
          const outgoing = card.connectStatus === "outgoing_pending";
          const incoming = card.connectStatus === "incoming_pending";
          const declined = card.connectStatus === "declined";
          const pending = busyId === card.profile.id;

          const avatarSrc = getAvatarImage(card.profile.codename, card.profile.industry_category);
          const initial = card.profile.codename ? card.profile.codename[0].toUpperCase() : "O";
          const avatarBg = getAvatarGradient(card.profile.id || card.profile.codename);
          const isHighSynergy = card.score >= 90;

          return (
            <article 
              key={card.profile.id} 
              className={accepted ? "match-card success" : "match-card"}
            >
              <div className="match-card-top">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div 
                    className="avatar-badge ring-glow md" 
                    style={{ 
                      position: "relative", 
                      overflow: "hidden",
                      background: avatarBg,
                      width: 44,
                      height: 44,
                      boxShadow: isHighSynergy ? "0 0 0 2px var(--surface-solid), var(--glow-cyan)" : undefined
                    }}
                  >
                    <Image
                      src={avatarSrc}
                      alt={`${card.profile.codename} avatar`}
                      width={44}
                      height={44}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                    <span className="avatar-initial" style={{ position: "absolute", zIndex: -1 }}>{initial}</span>
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "1.15rem" }}>{card.profile.codename}</h3>
                    <p className="card-skill" style={{ margin: 0, fontSize: "13px" }}>
                      {formatRoleWithIcon(card.profile.industry_category, card.profile.professional_title)} · needs {formatRoleWithIcon(card.profile.looking_for_category, card.profile.looking_for_title)}
                    </p>
                  </div>
                </div>
                <div 
                  className={isHighSynergy ? "score-badge pulse" : "score-badge"}
                  title={`${card.score}% Vibe Synergy`}
                >
                  {card.score}%
                </div>
              </div>
              
              {card.project ? (
                <div 
                  className="glass-inset" 
                  style={{ 
                    marginTop: 14, 
                    padding: "12px 14px",
                    background: "var(--surface-inset)",
                    border: "1px solid var(--stroke-subtle)",
                    borderRadius: "var(--radius-sm)"
                  }}
                >
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", color: "var(--text-bright)" }}>
                    {card.project.title}
                  </h4>
                  <p className="sub" style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.5 }}>
                    {card.project.description}
                  </p>
                  {card.project.budget_range ? (
                    <div style={{ marginTop: 8 }}>
                      <span 
                        className="role-tag" 
                        style={{ 
                          fontSize: "11px", 
                          padding: "2px 8px", 
                          color: "var(--accent-3)", 
                          borderColor: "var(--stroke-cyan)",
                          background: "rgba(6, 182, 212, 0.10)"
                        }}
                      >
                        Budget: {card.project.budget_range}
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : card.profile.bio ? (
                <p 
                  className="sub" 
                  style={{ 
                    marginTop: 12, 
                    fontSize: "0.88rem", 
                    lineHeight: 1.5,
                    fontStyle: "italic",
                    color: "#cbd5e1"
                  }}
                >
                  &ldquo;{card.profile.bio}&rdquo;
                </p>
              ) : null}
              
              <div 
                className="dims" 
                style={{ 
                  marginTop: 16,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px 14px"
                }}
              >
                {DIMS.map((d) => {
                  const val = card.vibe[d.key];
                  const percentage = Math.round((val / 5) * 100);
                  return (
                    <div key={d.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>
                        <span>{d.label}</span>
                        <span style={{ color: "var(--text)" }}>{val}/5</span>
                      </div>
                      <div 
                        className="bar-track" 
                        style={{ 
                          height: 5, 
                          background: "rgba(255, 255, 255, 0.08)",
                          borderRadius: 999,
                          overflow: "hidden"
                        }}
                      >
                        <div 
                          className="bar-fill" 
                          style={{ 
                            width: `${percentage}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 50%, var(--accent-3) 100%)",
                            borderRadius: 999
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {accepted ? (
                <div 
                  className="left" 
                  style={{ 
                    marginTop: "auto", 
                    paddingTop: 14, 
                    borderTop: "1px solid rgba(16, 185, 129, 0.3)" 
                  }}
                >
                  <p 
                    className="status-line" 
                    style={{ 
                      color: "#10b981", 
                      fontWeight: 700, 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 6,
                      margin: 0
                    }}
                  >
                    <span 
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#10b981",
                        boxShadow: "0 0 8px rgba(16, 185, 129, 0.8)",
                        display: "inline-block"
                      }}
                    />
                    Partnership active
                  </p>
                  {card.contactUrl ? (
                    <div 
                      style={{ 
                        marginTop: 8, 
                        padding: "8px 12px", 
                        background: "rgba(16, 185, 129, 0.08)", 
                        border: "1px solid rgba(16, 185, 129, 0.25)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.88rem"
                      }}
                    >
                      <span style={{ color: "var(--muted)", marginRight: 6 }}>Direct Contact:</span>
                      <a
                        href={card.contactUrl.startsWith("http") ? card.contactUrl : `https://${card.contactUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          color: "var(--accent-3)", 
                          fontWeight: 700, 
                          textDecoration: "underline",
                          wordBreak: "break-all"
                        }}
                      >
                        {card.contactUrl} ↗
                      </a>
                    </div>
                  ) : (
                    <p className="sub" style={{ marginTop: 4, fontSize: "0.85rem" }}>
                      No direct contact link provided yet.
                    </p>
                  )}
                </div>
              ) : outgoing ? (
                <div 
                  className="status-line left" 
                  style={{ 
                    marginTop: "auto", 
                    fontWeight: 700, 
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    paddingTop: 12
                  }}
                >
                  <span>✓</span>
                  <span>Request sent</span>
                </div>
              ) : incoming ? (
                <div className="btn-row left" style={{ marginTop: "auto", paddingTop: 12 }}>
                  <button
                    className="pill-btn skip"
                    type="button"
                    onClick={() => respond(card.profile.id, "declined")}
                    disabled={pending}
                  >
                    Decline
                  </button>
                  <button
                    className="pill-btn accept"
                    type="button"
                    onClick={() => respond(card.profile.id, "accepted")}
                    disabled={pending}
                  >
                    {pending ? "Accepting…" : "Accept"}
                  </button>
                </div>
              ) : declined ? (
                <p 
                  className="status-line left sub" 
                  style={{ marginTop: "auto", paddingTop: 12 }}
                >
                  Request declined
                </p>
              ) : (
                <div className="btn-row left" style={{ marginTop: "auto", paddingTop: 12 }}>
                  <button 
                    className="pill-btn skip" 
                    type="button" 
                    onClick={() => skip(card.profile.id)}
                  >
                    Skip
                  </button>
                  <button
                    className="pill-btn accept"
                    type="button"
                    onClick={() => connect(card.profile.id)}
                    disabled={pending}
                  >
                    {pending ? "Sending…" : "Connect"}
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

