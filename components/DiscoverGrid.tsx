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
  
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showReciprocalOnly, setShowReciprocalOnly] = useState(false);

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
          <Image src="/images/empty-discover-deck.png" alt="Empty" width={280} height={160} style={{ objectFit: "contain" }} priority />
        </div>
        <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-bright)", margin: 0 }}>No operators with that role yet</p>
        <Link href="/profile" className="outline-btn" style={{ marginTop: 8, padding: "10px 20px", fontSize: "14px" }}>Adjust Vibe Preferences &rarr;</Link>
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
      setLocal((rows) => rows.map((row) => (row.profile.id === id ? { ...row, connectStatus: status } : row)));
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
      setLocal((rows) => rows.map((row) => (row.profile.id === id ? { ...row, connectStatus: status } : row)));
    });
  }

  return (
    <div>
      {/* Sleek Horizontal Filter Bar */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        gap: 16, 
        marginBottom: 40,
        position: "sticky",
        top: 80,
        zIndex: 20,
        padding: "20px 24px",
        background: "rgba(18, 20, 32, 0.6)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--stroke-subtle)",
        borderRadius: 24,
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <input 
            type="text"
            placeholder="Search operators, bio, roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input glass"
            style={{ flex: "1 1 250px", margin: 0, borderRadius: 32, padding: "12px 24px", background: "rgba(0,0,0,0.3)" }}
          />
          <button
            onClick={() => setShowReciprocalOnly(!showReciprocalOnly)}
            style={{ 
              padding: "10px 20px", 
              borderRadius: 32, 
              fontSize: 13, 
              fontWeight: 700,
              background: showReciprocalOnly ? "rgba(255, 61, 110, 0.15)" : "rgba(255,255,255,0.02)",
              border: showReciprocalOnly ? "1px solid var(--accent)" : "1px solid var(--stroke)",
              color: showReciprocalOnly ? "var(--accent)" : "var(--muted)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            ⚡ Best Matches Only
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
          <button
            onClick={() => setCategoryFilter("all")}
            style={{ 
              padding: "8px 20px", 
              borderRadius: 32, 
              fontSize: 13, 
              whiteSpace: "nowrap",
              cursor: "pointer",
              background: categoryFilter === "all" ? "var(--accent-4)" : "rgba(255,255,255,0.03)",
              color: categoryFilter === "all" ? "#000" : "var(--muted)",
              border: "none",
              fontWeight: categoryFilter === "all" ? 800 : 500,
              boxShadow: categoryFilter === "all" ? "0 0 20px rgba(16, 185, 129, 0.4)" : "none"
            }}
          >
            All Domains
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{ 
                padding: "8px 20px", 
                borderRadius: 32, 
                fontSize: 13, 
                whiteSpace: "nowrap",
                cursor: "pointer",
                background: categoryFilter === cat ? "var(--accent-4)" : "rgba(255,255,255,0.03)",
                color: categoryFilter === cat ? "#000" : "var(--muted)",
                border: "none",
                fontWeight: categoryFilter === cat ? 800 : 500,
                boxShadow: categoryFilter === cat ? "0 0 20px rgba(16, 185, 129, 0.4)" : "none"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="error" style={{ marginBottom: 24, textAlign: "center" }}>{error}</p> : null}

      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: 60, textAlign: "center", borderRadius: 24 }}>
          <h3 style={{ margin: "0 0 8px", color: "var(--text-bright)", fontSize: 24 }}>No signals found</h3>
          <p className="sub" style={{ margin: 0 }}>Try adjusting your frequency (filters) to find more operators.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 32 }}>
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
                style={{ 
                  background: "var(--surface-card)",
                  border: `1px solid ${accepted ? "var(--accent-4)" : "var(--stroke)"}`,
                  borderRadius: 24, 
                  padding: 24,
                  display: "flex", 
                  flexDirection: "column", 
                  gap: 20, 
                  position: "relative",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(16, 185, 129, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
                }}
              >
                {/* Match Score Badge */}
                <div style={{ 
                  position: "absolute", 
                  top: -12, 
                  right: 24, 
                  background: isHighSynergy ? "var(--accent)" : "var(--bg)", 
                  color: isHighSynergy ? "#fff" : "var(--accent-4)", 
                  fontSize: 11, 
                  fontWeight: 800, 
                  padding: "6px 16px", 
                  borderRadius: 32, 
                  border: isHighSynergy ? "none" : "1px solid var(--accent-4)",
                  boxShadow: isHighSynergy ? "var(--glow-rose)" : "0 0 10px rgba(16, 185, 129, 0.2)",
                  display: "flex", 
                  alignItems: "center", 
                  gap: 6 
                }}>
                  {isHighSynergy ? '⚡ HOT MATCH ' : 'MATCH '}{card.score}%
                </div>

                {/* Top Tier: Identity */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
                  <AvatarSVG name={card.profile.codename} size={64} className={isHighSynergy ? "glow-rose" : ""} />
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 900, color: "var(--text-bright)", letterSpacing: "-0.02em" }}>
                      {card.profile.codename}
                    </h3>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--accent-3)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                      {formatRoleWithIcon(card.profile.industry_category, card.profile.professional_title)}
                    </p>
                  </div>
                </div>

                {/* Middle Tier: Bio & Languages */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                  {card.profile.bio ? (
                    <div style={{ 
                      padding: 16, 
                      background: "rgba(0,0,0,0.2)", 
                      borderRadius: 16, 
                      borderLeft: "2px solid var(--stroke-strong)" 
                    }}>
                      <p style={{ margin: 0, fontSize: 14, color: "var(--text)", lineHeight: 1.6, fontStyle: "italic" }}>
                        &ldquo;{card.profile.bio}&rdquo;
                      </p>
                    </div>
                  ) : null}

                  {card.profile.spoken_languages && card.profile.spoken_languages.length > 0 && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      {card.profile.spoken_languages.map(lang => (
                        <span key={lang} style={{ padding: "4px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--stroke-subtle)", borderRadius: 12, fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Bottom Tier: Vibe Print & Actions */}
                <div style={{ background: "rgba(0, 255, 179, 0.03)", border: "1px solid rgba(0, 255, 179, 0.15)", borderRadius: 16, padding: 16 }}>
                  <h4 style={{ margin: "0 0 16px 0", fontSize: 10, color: "var(--accent-4)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", display: "flex", justifyContent: "space-between" }}>
                    <span>VIBE PRINT</span>
                    {card.reciprocalMatch && <span style={{ color: "var(--accent-amber)" }}>MUTUAL PREF</span>}
                  </h4>
                  
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 40, marginBottom: 12 }}>
                    {DIMS.map((d) => {
                      const val = card.vibe[d.key];
                      const heightPct = (val / 5) * 100;
                      return (
                        <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                          <div style={{ width: "100%", height: 40, background: "rgba(0,0,0,0.4)", borderRadius: 4, position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${heightPct}%`, background: "var(--accent-4)", opacity: 0.8, borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
                            {d.key.substring(0,3)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
                  {accepted ? (
                    <Link href="/messages" className="pill-btn" style={{ flex: 1, textAlign: "center", background: "var(--surface-solid)", color: "var(--accent-4)", border: "1px solid var(--accent-4)", fontWeight: 800 }}>
                      Open Comms &rarr;
                    </Link>
                  ) : outgoing ? (
                    <button className="pill-btn" style={{ flex: 1, background: "rgba(255,255,255,0.05)", color: "var(--muted)" }} disabled>
                      Signal Sent...
                    </button>
                  ) : incoming ? (
                    <>
                      <button className="pill-btn skip" style={{ flex: 1 }} onClick={() => respond(card.profile.id, "declined")} disabled={pending}>
                        Pass
                      </button>
                      <button className="pill-btn" style={{ flex: 1, background: "var(--accent-4)", color: "#000", fontWeight: 800 }} onClick={() => respond(card.profile.id, "accepted")} disabled={pending}>
                        {pending ? "..." : "Accept"}
                      </button>
                    </>
                  ) : declined ? (
                    <button className="pill-btn" style={{ flex: 1, background: "transparent", color: "var(--muted)", border: "1px solid var(--stroke)" }} disabled>
                      Declined
                    </button>
                  ) : (
                    <>
                      <button className="pill-btn skip" style={{ flex: 1 }} onClick={() => skip(card.profile.id)} disabled={pending}>
                        Skip
                      </button>
                      <button className="pill-btn" style={{ flex: 1, background: "var(--text-bright)", color: "#000", fontWeight: 800 }} onClick={() => connect(card.profile.id)} disabled={pending}>
                        {pending ? "..." : "Send Signal"}
                      </button>
                    </>
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
