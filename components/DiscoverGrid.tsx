"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
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
  const [showProModal, setShowProModal] = useState<string | null>(null);

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
      {/* Sleek Filter Bar with In-Line Pro Features */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          marginBottom: "32px",
          padding: "18px 22px",
          background: "var(--surface, #ffffff)",
          border: "1px solid var(--stroke, #e5e3db)",
          borderRadius: "var(--radius-xl, 16px)",
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
                background: "var(--surface-inset, #f4f3ee)",
                border: "1px solid var(--stroke, #e5e3db)",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setShowReciprocalOnly(!showReciprocalOnly)}
              style={{
                padding: "9px 18px",
                borderRadius: "9999px",
                fontSize: "13px",
                fontWeight: 700,
                background: showReciprocalOnly ? "rgba(255, 61, 110, 0.1)" : "var(--surface-inset, #f4f3ee)",
                border: `1px solid ${showReciprocalOnly ? "var(--accent, #ff3d6e)" : "var(--stroke, #e5e3db)"}`,
                color: showReciprocalOnly ? "var(--accent, #ff3d6e)" : "var(--muted, #4b5563)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {showReciprocalOnly ? "✓ Mutual Prefs Only" : "⭐ Top Matches Only"}
            </button>

            {/* In-Line Pro Filter Trigger */}
            <button
              type="button"
              onClick={() => setShowProModal("filters")}
              style={{
                padding: "9px 18px",
                borderRadius: "9999px",
                fontSize: "13px",
                fontWeight: 700,
                background: "linear-gradient(135deg, rgba(255, 61, 110, 0.12), rgba(139, 92, 246, 0.12))",
                border: "1px solid rgba(255, 61, 110, 0.35)",
                color: "var(--accent, #ff3d6e)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              <span>⚡ Pro Filters</span>
              <span style={{ fontSize: 10, background: "var(--accent, #ff3d6e)", color: "#fff", padding: "1px 6px", borderRadius: 999 }}>NEW</span>
            </button>
          </div>
        </div>

        {/* Category Pills & Pro Locked Pills */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none", alignItems: "center" }}>
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
              background: categoryFilter === "all" ? "var(--accent, #ff3d6e)" : "var(--surface-inset, #f4f3ee)",
              color: categoryFilter === "all" ? "#ffffff" : "var(--muted, #4b5563)",
              border: "1px solid var(--stroke, #e5e3db)",
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
                background: categoryFilter === cat ? "var(--accent, #ff3d6e)" : "var(--surface-inset, #f4f3ee)",
                color: categoryFilter === cat ? "#ffffff" : "var(--muted, #4b5563)",
                border: "1px solid var(--stroke, #e5e3db)",
                boxShadow: categoryFilter === cat ? "0 2px 10px rgba(255, 61, 110, 0.3)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          ))}

          {/* Locked In-line Pro Pills */}
          <div style={{ height: 16, width: 1, background: "var(--stroke, #e5e3db)", margin: "0 4px" }} />
          <button
            type="button"
            onClick={() => setShowProModal("timezone")}
            style={{
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              cursor: "pointer",
              background: "rgba(139, 92, 246, 0.08)",
              color: "#8b5cf6",
              border: "1px dashed rgba(139, 92, 246, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span>🌐 Timezone Match</span>
            <span style={{ fontSize: 10 }}>🔒</span>
          </button>

          <button
            type="button"
            onClick={() => setShowProModal("ai_pods")}
            style={{
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              cursor: "pointer",
              background: "rgba(16, 185, 129, 0.08)",
              color: "#059669",
              border: "1px dashed rgba(16, 185, 129, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span>🤖 AI Verified Pods</span>
            <span style={{ fontSize: 10 }}>🔒</span>
          </button>
        </div>

        {/* In-Line Micro Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, rgba(255, 61, 110, 0.06), rgba(139, 92, 246, 0.06))",
            border: "1px solid rgba(255, 61, 110, 0.18)",
            borderRadius: 10,
            padding: "8px 16px",
            fontSize: 13,
            color: "var(--text-bright, #111827)",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <span>
              <strong>Pro Matchmaker</strong>: Get verified placement &amp; 50% lower settlement fees on milestone payouts.
            </span>
          </div>
          <Link
            href="/pricing"
            style={{
              color: "var(--accent, #ff3d6e)",
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>View Pro Plans ($7.99/mo)</span>
            <span>&rarr;</span>
          </Link>
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
          {filtered.map((card, index) => {
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

      {/* In-Line Pro Matchmaker Modal */}
      <AnimatePresence>
        {showProModal && (
          <div
            onClick={() => setShowProModal(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: 24,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--surface, #ffffff)",
                border: "1px solid var(--stroke, #e5e3db)",
                borderRadius: "var(--radius-xl, 16px)",
                padding: "36px 32px",
                maxWidth: 480,
                width: "100%",
                boxShadow: "0 24px 60px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(255, 61, 110, 0.1)",
                  color: "var(--accent, #ff3d6e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  margin: "0 auto 16px",
                  border: "1px solid rgba(255, 61, 110, 0.25)",
                }}
              >
                ⚡
              </div>

              <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-bright, #111827)", margin: "0 0 8px" }}>
                Unlock Pro Matching
              </h3>
              <p style={{ fontSize: 14, color: "var(--muted, #4b5563)", margin: "0 0 24px", lineHeight: 1.5 }}>
                Filter by timezone, nights vs full-time sprint availability, and automated AI code verifications with Pro.
              </p>

              <div style={{ background: "var(--surface-inset, #f4f3ee)", borderRadius: 12, padding: "16px 20px", textAlign: "left", marginBottom: 24 }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "var(--text-bright, #111827)" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--accent, #ff3d6e)", fontWeight: 800 }}>✓</span>
                    <span><strong>50% Lower Fees</strong> on milestone payouts (10% vs 20%)</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--accent, #ff3d6e)", fontWeight: 800 }}>✓</span>
                    <span><strong>Automated AI Pod Verifier</strong> for code &amp; RLS testing</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--accent, #ff3d6e)", fontWeight: 800 }}>✓</span>
                    <span><strong>Verified Pro Badge</strong> &amp; Priority Discover placement</span>
                  </li>
                </ul>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowProModal(null)}
                  className="outline-btn"
                  style={{ flex: 1, padding: "12px", fontSize: 14, borderRadius: 10 }}
                >
                  Maybe Later
                </button>
                <Link
                  href="/pricing"
                  className="primary-btn"
                  style={{
                    flex: 1.4,
                    padding: "12px",
                    fontSize: 14,
                    borderRadius: 10,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    boxShadow: "0 4px 16px rgba(255, 61, 110, 0.35)",
                  }}
                >
                  <span>Start Free Trial ($7.99)</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
