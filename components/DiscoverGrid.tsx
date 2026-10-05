"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { sendConnect, respondToConnect } from "@/lib/actions";
import { AvatarSVG } from "./Avatar";
import { formatRoleWithIcon, type Profile, type VibeAnswers, type ConnectState } from "@/lib/types";
import { ExpandableProfileCard } from "./watermelon/expandable-event-card";

export type DiscoverCard = {
  profile: Profile;
  vibe: VibeAnswers;
  project: import("@/lib/types").Project | null;
  score: number;
  connectStatus: ConnectState;
  contactUrl?: string | null;
  reciprocalMatch?: boolean;
};

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
      <div className="empty" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center", padding: "60px 0" }}>
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
    <div style={{ paddingBottom: "60px" }}>
      {/* Sleek Filter Bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          marginBottom: "32px",
          padding: "16px 20px",
          background: "var(--surface)",
          border: "1px solid var(--stroke)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ position: "relative", flex: "1 1 280px" }}>
            <input
              type="text"
              placeholder="Search operators, superpower, roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{
                borderRadius: "9999px",
                padding: "10px 18px",
                background: "var(--surface-inset)",
                border: "1px solid var(--stroke)",
                fontSize: "14px",
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowReciprocalOnly(!showReciprocalOnly)}
            style={{
              padding: "9px 18px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 700,
              background: showReciprocalOnly ? "var(--accent-subtle)" : "var(--surface-inset)",
              border: `1px solid ${showReciprocalOnly ? "var(--accent)" : "var(--stroke)"}`,
              color: showReciprocalOnly ? "var(--accent)" : "var(--muted)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {showReciprocalOnly ? "✓ Mutual Prefs Only" : "⭐ Top Matches Only"}
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            style={{
              padding: "7px 16px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: categoryFilter === "all" ? 800 : 600,
              whiteSpace: "nowrap",
              cursor: "pointer",
              background: categoryFilter === "all" ? "var(--accent)" : "var(--surface-inset)",
              color: categoryFilter === "all" ? "#ffffff" : "var(--muted)",
              border: "1px solid var(--stroke)",
              boxShadow: categoryFilter === "all" ? "0 2px 10px rgba(255, 61, 110, 0.3)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            All Domains
          </button>
          {allCategories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: "7px 16px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: categoryFilter === cat ? 800 : 600,
                whiteSpace: "nowrap",
                cursor: "pointer",
                background: categoryFilter === cat ? "var(--accent)" : "var(--surface-inset)",
                color: categoryFilter === cat ? "#ffffff" : "var(--muted)",
                border: "1px solid var(--stroke)",
                boxShadow: categoryFilter === cat ? "0 2px 10px rgba(255, 61, 110, 0.3)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="error" style={{ marginBottom: "20px", textAlign: "center" }}>⚠️ {error}</p> : null}

      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: "48px 24px", textAlign: "center", borderRadius: "var(--radius-xl)" }}>
          <h3 style={{ margin: "0 0 8px", color: "var(--text-bright)", fontSize: "1.25rem" }}>No matching operators found</h3>
          <p className="sub" style={{ margin: 0 }}>Try clearing your search query or selecting All Domains.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "28px" }}>
          {filtered.map((card) => {
            const accepted = card.connectStatus === "accepted";
            const outgoing = card.connectStatus === "outgoing_pending";
            const incoming = card.connectStatus === "incoming_pending";
            const declined = card.connectStatus === "declined";
            const pending = busyId === card.profile.id;

            return (
              <ExpandableProfileCard
                key={card.profile.id}
                title={card.profile.codename}
                subtitle={formatRoleWithIcon(card.profile.industry_category, card.profile.professional_title)}
                description={card.profile.bio || undefined}
                score={card.score}
                location={card.profile.location || "Remote / Global"}
                githubUrl={card.profile.linkedin_url || undefined}
                languages={card.profile.spoken_languages?.length ? card.profile.spoken_languages : ["English"]}
                categories={[card.profile.industry_category || "Software & IT"]}
                vibe={card.vibe}
                projectTitle={card.project?.title}
                projectDesc={card.project?.description}
                connectStatus={card.connectStatus}
                isPending={pending}
                onConnect={() => connect(card.profile.id)}
                avatarComponent={<AvatarSVG name={card.profile.codename} size={48} />}
                footerAction={
                  <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                    {accepted ? (
                      <Link
                        href="/messages"
                        className="pill-btn"
                        style={{
                          flex: 1,
                          textAlign: "center",
                          background: "var(--success)",
                          color: "#ffffff",
                          fontWeight: 800,
                          padding: "10px 0",
                        }}
                      >
                        Open Comms &rarr;
                      </Link>
                    ) : outgoing ? (
                      <button
                        className="pill-btn"
                        style={{ flex: 1, background: "var(--surface-inset)", color: "var(--dim)", border: "1px solid var(--stroke)" }}
                        disabled
                      >
                        ✓ Signal Sent...
                      </button>
                    ) : incoming ? (
                      <>
                        <button
                          className="pill-btn skip"
                          type="button"
                          style={{ flex: 1, padding: "10px" }}
                          onClick={() => respond(card.profile.id, "declined")}
                          disabled={pending}
                        >
                          Pass
                        </button>
                        <button
                          className="pill-btn accept"
                          type="button"
                          style={{ flex: 1, padding: "10px" }}
                          onClick={() => respond(card.profile.id, "accepted")}
                          disabled={pending}
                        >
                          {pending ? "..." : "Accept"}
                        </button>
                      </>
                    ) : declined ? (
                      <button className="pill-btn" style={{ flex: 1, background: "transparent", color: "var(--muted)", border: "1px solid var(--stroke)" }} disabled>
                        Declined
                      </button>
                    ) : (
                      <>
                        <button
                          className="outline-btn"
                          type="button"
                          style={{ flex: 1, padding: "10px", fontSize: "13px" }}
                          onClick={() => skip(card.profile.id)}
                          disabled={pending}
                        >
                          Skip
                        </button>
                        <button
                          className="primary-btn"
                          type="button"
                          style={{ flex: 1.4, padding: "10px", fontSize: "13px" }}
                          onClick={() => connect(card.profile.id)}
                          disabled={pending}
                        >
                          {pending ? "Sending…" : "⚡ Send Signal"}
                        </button>
                      </>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
