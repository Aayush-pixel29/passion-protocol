"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { sendConnect, respondToConnect } from "@/lib/actions";
import { AvatarSVG } from "./Avatar";
import { formatRoleWithIcon, type Profile, type VibeAnswers, type ConnectState } from "@/lib/types";

export type DiscoverCard = {
  profile: Profile;
  vibe: VibeAnswers;
  project: import("@/lib/types").Project | null;
  score: number;
  connectStatus: ConnectState;
  contactUrl?: string | null;
  reciprocalMatch?: boolean;
};

const DIMS: Array<{ key: keyof VibeAnswers; label: string }> = [
  { key: "pace", label: "Pace" },
  { key: "comms", label: "Comms" },
  { key: "risk", label: "Risk" },
  { key: "energy", label: "Energy" },
];

export function DiscoverGrid({ cards, allCategories }: { cards: DiscoverCard[]; allCategories: string[] }) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [local, setLocal] = useState(cards);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  
  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showReciprocalOnly, setShowReciprocalOnly] = useState(false);

  // Apply filters
  const filtered = local.filter((c) => {
    if (hidden.has(c.profile.id)) return false;
    if (categoryFilter !== "all" && c.profile.industry_category !== categoryFilter) return false;
    if (showReciprocalOnly && !c.reciprocalMatch) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        c.profile.codename.toLowerCase().includes(q) ||
        (c.profile.professional_title || "").toLowerCase().includes(q) ||
        (c.profile.industry_category || "").toLowerCase().includes(q) ||
        (c.profile.bio || "").toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    return true;
  });

  if (local.length === 0) {
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
      {/* Filter Bar */}
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: 12, 
        marginBottom: 24, 
        alignItems: "center",
        padding: "16px 20px",
        background: "var(--surface-card)",
        border: "1px solid var(--stroke)",
        borderRadius: "var(--radius-sm)"
      }}>
        {/* Search */}
        <input 
          type="text"
          placeholder="Search by name, role, or skill..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
          style={{ 
            flex: "1 1 200px", 
            margin: 0, 
            minWidth: 200,
            background: "var(--surface-inset)",
            border: "1px solid var(--stroke-subtle)",
          }}
        />
        
        {/* Category filter pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <button
            className={categoryFilter === "all" ? "chip selected" : "chip"}
            onClick={() => setCategoryFilter("all")}
            style={{ fontSize: 13 }}
          >
            All
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              className={categoryFilter === cat ? "chip selected" : "chip"}
              onClick={() => setCategoryFilter(cat)}
              style={{ fontSize: 13 }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reciprocal toggle */}
        <button
          className={showReciprocalOnly ? "chip selected" : "chip"}
          onClick={() => setShowReciprocalOnly(!showReciprocalOnly)}
          style={{ fontSize: 13 }}
        >
          🎯 Best Matches
        </button>
      </div>

      {/* Results count */}
      <p className="sub" style={{ marginBottom: 16, fontSize: 13 }}>
        Showing {filtered.length} of {local.length} operators
        {categoryFilter !== "all" && <> in <strong>{categoryFilter}</strong></>}
        {showReciprocalOnly && <> · reciprocal matches only</>}
      </p>

      {error ? <p className="error">{error}</p> : null}

      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: 40, textAlign: "center" }}>
          <h3 style={{ margin: "0 0 8px", color: "var(--text-bright)" }}>No results found</h3>
          <p className="sub" style={{ margin: 0 }}>Try adjusting your filters or search query.</p>
        </div>
      ) : (
      <div className="match-grid">
        {filtered.map((card) => {
          const accepted = card.connectStatus === "accepted";
          const outgoing = card.connectStatus === "outgoing_pending";
          const incoming = card.connectStatus === "incoming_pending";
          const declined = card.connectStatus === "declined";
          const pending = busyId === card.profile.id;

          const isHighSynergy = card.score >= 90;

          return (
            <article 
              key={card.profile.id} 
              className={`glass ${accepted ? "border-emerald-500/50" : ""}`}
              style={{ padding: 24, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <AvatarSVG name={card.profile.codename} size={48} className={isHighSynergy ? "glow-cyan" : ""} />
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
                  paddingTop: 16,
                  borderTop: "1px solid var(--stroke-subtle)",
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "12px",
                  height: "40px"
                }}
              >
                {DIMS.map((d, i) => {
                  const val = card.vibe[d.key];
                  const heightPct = (val / 5) * 100;
                  return (
                    <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 4, height: "100%" }} title={`${d.label}: ${val}/5`}>
                      <div 
                        style={{ 
                          width: "100%", 
                          height: `${heightPct}%`, 
                          background: `var(--accent-${i+2 > 4 ? 'amber' : i+2})`, 
                          borderRadius: 4,
                          opacity: 0.8,
                          animationDelay: `${i * 0.15}s`
                        }} 
                        className="animate-bar-dance"
                      />
                      <span style={{ fontSize: "9px", textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.05em" }}>
                        {d.label.slice(0,3)}
                      </span>
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
      )}
    </div>
  );
}

