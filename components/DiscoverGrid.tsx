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
        marginBottom: 32, 
        alignItems: "center",
        padding: "16px 24px",
        background: "var(--surface-card)",
        border: "1px solid var(--stroke)",
        borderRadius: 24,
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)"
      }}>
        {/* Search */}
        <input 
          type="text"
          placeholder="Search operators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input glass"
          style={{ 
            flex: "1 1 200px", 
            margin: 0, 
            minWidth: 200,
            borderRadius: 32
          }}
        />
        
        {/* Category filter pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            className={categoryFilter === "all" ? "chip selected glass-emerald" : "chip"}
            onClick={() => setCategoryFilter("all")}
            style={{ fontSize: 13, borderRadius: 32 }}
          >
            All
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              className={categoryFilter === cat ? "chip selected glass-emerald" : "chip"}
              onClick={() => setCategoryFilter(cat)}
              style={{ fontSize: 13, borderRadius: 32 }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reciprocal toggle */}
        <button
          className={showReciprocalOnly ? "chip selected glass-rose" : "chip"}
          onClick={() => setShowReciprocalOnly(!showReciprocalOnly)}
          style={{ fontSize: 13, borderRadius: 32 }}
        >
          🔥 Best Matches
        </button>
      </div>

      {error ? <p className="error" style={{ marginBottom: 24 }}>{error}</p> : null}

      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: 60, textAlign: "center", borderRadius: 24 }}>
          <h3 style={{ margin: "0 0 8px", color: "var(--text-bright)", fontSize: 24 }}>No signals found</h3>
          <p className="sub" style={{ margin: 0 }}>Try adjusting your frequency (filters) to find more operators.</p>
        </div>
      ) : (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
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
              style={{ padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}
            >
              {isHighSynergy && (
                <div style={{ position: "absolute", top: -12, left: 24, background: "var(--accent-rose)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 32, boxShadow: "var(--glow-rose)", display: "flex", alignItems: "center", gap: 6 }}>
                  🔥 HOT MATCH · {card.score}%
                </div>
              )}
              
              {!isHighSynergy && (
                <div style={{ position: "absolute", top: 12, right: 16, color: "var(--accent-emerald)", fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 32, border: "1px solid var(--accent-emerald)", background: "rgba(0, 255, 179, 0.1)" }}>
                  {card.score}% MATCH
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: isHighSynergy ? 12 : 0 }}>
                <AvatarSVG name={card.profile.codename} size={64} className={isHighSynergy ? "glow-rose" : ""} />
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{card.profile.codename}</h3>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    {formatRoleWithIcon(card.profile.industry_category, card.profile.professional_title)}
                  </p>
                </div>
              </div>
              
                            {card.profile.spoken_languages && card.profile.spoken_languages.length > 0 && (
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Languages:</span>
                  {card.profile.spoken_languages.map(lang => (
                    <span key={lang} style={{ padding: "4px 8px", background: "var(--surface-2)", border: "1px solid var(--stroke)", borderRadius: 12, fontSize: 11, color: "var(--ink)" }}>{lang}</span>
                  ))}
                </div>
              )}
              {card.project ? (
                <div 
                  style={{ 
                    padding: 16,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--stroke-subtle)",
                    borderRadius: 16
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0", fontSize: 14, color: "var(--text-bright)" }}>
                    Building: {card.project.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                    {card.project.description}
                  </p>
                </div>
              ) : card.profile.bio ? (
                <div 
                  style={{ 
                    padding: 16,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--stroke-subtle)",
                    borderRadius: 16
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0", fontSize: 12, color: "var(--text-bright)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Operator Pitch
                  </h4>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.5, fontStyle: "italic" }}>
                    &ldquo;{card.profile.bio}&rdquo;
                  </p>
                </div>
              ) : null}
              
              <div style={{ background: "rgba(0, 255, 179, 0.05)", border: "1px solid rgba(0, 255, 179, 0.2)", borderRadius: 16, padding: 16 }}>
                <h4 style={{ margin: "0 0 16px 0", fontSize: 10, color: "var(--accent-emerald)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>VIBE PRINT</h4>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 48 }}>
                  {DIMS.map((d, i) => {
                    const val = card.vibe[d.key];
                    const heightPct = (val / 5) * 100;
                    return (
                      <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 6, height: "100%" }} title={`${d.label}: ${val}/5`}>
                        <div 
                          style={{ 
                            width: "100%", 
                            height: `${heightPct}%`, 
                            background: "var(--accent-emerald)",
                            borderRadius: 4,
                            animationDelay: `${i * 0.15}s`,
                            boxShadow: "0 0 8px rgba(0, 255, 179, 0.4)"
                          }} 
                          className="animate-bar-dance"
                        />
                        <span style={{ fontSize: 9, textTransform: "uppercase", color: "var(--accent-emerald)", opacity: 0.8, fontWeight: 700 }}>
                          {d.label.slice(0,3)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                {accepted ? (
                  <>
                    <div style={{ textAlign: "center", padding: "12px", background: "rgba(16, 185, 129, 0.1)", borderRadius: 16, color: "#10b981", fontWeight: 700, fontSize: 14 }}>
                      Partnership Active ✔
                    </div>
                    {card.contactUrl && (
                      <a href={card.contactUrl.startsWith("http") ? card.contactUrl : `https://${card.contactUrl}`} target="_blank" rel="noopener noreferrer" style={{ textAlign: "center", fontSize: 12, color: "var(--text-bright)", textDecoration: "underline" }}>
                        Open Comms Channel ↗
                      </a>
                    )}
                  </>
                ) : outgoing ? (
                  <div style={{ textAlign: "center", padding: "12px", border: "1px solid var(--stroke)", borderRadius: 16, color: "var(--muted)", fontSize: 14, fontWeight: 600 }}>
                    Signal Transmitted...
                  </div>
                ) : incoming ? (
                  <div style={{ display: "flex", gap: 12 }}>
                    <button className="pill-btn skip" style={{ flex: 1 }} onClick={() => respond(card.profile.id, "declined")} disabled={pending}>Decline</button>
                    <button className="pill-btn" style={{ flex: 1, background: "var(--accent-emerald)", color: "#000", fontWeight: 700 }} onClick={() => respond(card.profile.id, "accepted")} disabled={pending}>Accept</button>
                  </div>
                ) : declined ? (
                  <div style={{ textAlign: "center", padding: "12px", borderRadius: 16, color: "var(--accent-rose)", fontSize: 14, fontWeight: 600 }}>
                    Signal Ignored
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 12 }}>
                    <button className="pill-btn skip" style={{ flex: 1 }} onClick={() => skip(card.profile.id)}>Pass</button>
                    <button className="pill-btn" style={{ flex: 2, background: "var(--text-bright)", color: "#000", fontWeight: 700, boxShadow: "0 0 16px rgba(255,255,255,0.2)" }} onClick={() => connect(card.profile.id)} disabled={pending}>
                      {pending ? "Transmitting..." : "Connect ⚡"}
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
      )}
    </div>
  );
}

