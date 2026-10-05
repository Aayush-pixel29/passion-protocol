import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getOwnProfile } from "@/lib/data";
import { redirect } from "next/navigation";
import { AvatarSVG } from "@/components/Avatar";
import { ProjectForm } from "@/components/ProjectForm";
import { formatRoleWithIcon, type VibeAnswers } from "@/lib/types";
import { vibeScore } from "@/lib/match";

const DIMS: Array<{ key: keyof VibeAnswers; label: string; low: string; high: string }> = [
  { key: "pace", label: "Pace", low: "Slow craft", high: "Ship fast" },
  { key: "comms", label: "Communication", low: "Async quiet", high: "Live sync" },
  { key: "risk", label: "Risk Tolerance", low: "Calculated", high: "Moonshot" },
  { key: "energy", label: "Energy Style", low: "Solo deep", high: "High vibe" },
];

const BADGES = [
  {
    id: "4d-calibrated",
    icon: "⚡",
    name: "4D Calibrated",
    desc: "Working dynamic rated across Pace, Comms, Risk & Energy",
    unlocked: true,
    tier: "rare",
  },
  {
    id: "verified-builder",
    icon: "🛡️",
    name: "Verified Operator",
    desc: "Identity & profile authenticated with zero-spam protection",
    unlocked: true,
    tier: "legendary",
  },
  {
    id: "reciprocal-champion",
    icon: "🤝",
    name: "100% Reciprocal",
    desc: "Disciplines mutually complement each other's domain",
    unlocked: true,
    tier: "epic",
  },
  {
    id: "contract-ready",
    icon: "📑",
    name: "Trial Sprint Ready",
    desc: "Authorized for 48h milestone trial tasks & revenue splits",
    unlocked: true,
    tier: "rare",
  },
  {
    id: "sprint-lead",
    icon: "🚀",
    name: "Hackathon Lead",
    desc: "Ready to sprint on fast-paced product MVPs and pitches",
    unlocked: true,
    tier: "epic",
  },
];

export default async function DashboardPage() {
  const { user, profile, vibe, project, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete) redirect("/onboarding");

  // Fetch Accepted Partners
  const { data: acceptedRows } = await supabase
    .from("connect_requests")
    .select("from_id, to_id, created_at")
    .or(`from_id.eq.${user.id},to_id.eq.${user.id}`)
    .eq("status", "accepted");

  const partnerIds = (acceptedRows ?? []).map((row) =>
    row.from_id === user.id ? row.to_id : row.from_id
  );

  const { data: partnerProfiles } = partnerIds.length
    ? await supabase
        .from("profiles")
        .select("id, codename, industry_category, professional_title, spoken_languages, bio")
        .in("id", partnerIds)
    : { data: [] };

  const { data: partnerVibes } = partnerIds.length
    ? await supabase.from("vibe_answers").select("*").in("user_id", partnerIds)
    : { data: [] };
  const partnerVibeMap = new Map((partnerVibes ?? []).map((v) => [v.user_id, v]));

  const { data: partnerLinks } = partnerIds.length
    ? await supabase.from("profile_links").select("user_id, contact_url").in("user_id", partnerIds)
    : { data: [] };

  const linkByUserId = new Map<string, string>();
  for (const link of partnerLinks ?? []) {
    if (link.contact_url) linkByUserId.set(link.user_id, link.contact_url);
  }

  // Fetch Pending Inbound Requests
  const { count: pendingCount } = await supabase
    .from("connect_requests")
    .select("*", { count: "exact", head: true })
    .eq("to_id", user.id)
    .eq("status", "pending");

  // Fetch Partnership Contracts
  const { data: contracts } = await supabase
    .from("partnership_contracts")
    .select("id, deliverables, price_amount, status, proposed_by, proposed_to, created_at")
    .or(`proposed_by.eq.${user.id},proposed_to.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const contractPartnerIds = (contracts ?? []).map((c) =>
    c.proposed_by === user.id ? c.proposed_to : c.proposed_by
  );
  const { data: contractPartners } = contractPartnerIds.length
    ? await supabase.from("profiles").select("id, codename").in("id", contractPartnerIds)
    : { data: [] };
  const contractPartnerName = new Map((contractPartners ?? []).map((p) => [p.id, p.codename]));

  const partners = (partnerProfiles ?? []).map((p) => {
    const pVibe = partnerVibeMap.get(p.id);
    const score = vibe && pVibe ? vibeScore(vibe, pVibe) : 90;
    return {
      profile: p,
      vibe: pVibe,
      contactUrl: linkByUserId.get(p.id) || null,
      score,
    };
  });

  return (
    <div className="site">
      <SiteHeader current="dashboard" signedIn />

      <main className="wrap" style={{ padding: "36px 20px 80px", maxWidth: "1200px" }}>
        {/* Dashboard Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "32px",
            paddingBottom: "24px",
            borderBottom: "1px solid var(--stroke)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  background: "var(--accent-subtle)",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  border: "1px solid var(--stroke)",
                }}
              >
                OPERATOR DASHBOARD
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--success)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)" }} />
                Active in Pool
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
              Welcome back, <span className="gradient-text">{profile.codename}</span>
            </h1>
            <p style={{ fontSize: "14px", color: "var(--muted)", margin: "6px 0 0" }}>
              {formatRoleWithIcon(profile.industry_category, profile.professional_title)} &middot; Seeking{" "}
              <strong>{profile.looking_for_title}</strong> in <strong>{profile.looking_for_category}</strong>
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link href="/discover" className="primary-btn" style={{ fontSize: "14px" }}>
              ⚡ Discover Co-Founders
            </Link>
            <Link href="/messages" className="outline-btn" style={{ fontSize: "14px" }}>
              💬 Chat Workspace
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "36px",
          }}
        >
          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "6px" }}>
              ACTIVE PARTNERS
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-bright)" }}>
              {partners.length}
            </div>
            <p style={{ fontSize: "12px", color: "var(--dim)", margin: "4px 0 0" }}>
              Verified co-founders connected
            </p>
          </div>

          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "6px" }}>
              INBOUND REQUESTS
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: pendingCount ? "var(--accent)" : "var(--text-bright)" }}>
              {pendingCount ?? 0}
            </div>
            <p style={{ fontSize: "12px", color: "var(--dim)", margin: "4px 0 0" }}>
              Operators waiting for your response
            </p>
          </div>

          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "6px" }}>
              TRIAL CONTRACTS
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-bright)" }}>
              {(contracts ?? []).length}
            </div>
            <p style={{ fontSize: "12px", color: "var(--dim)", margin: "4px 0 0" }}>
              Milestone sprints in progress
            </p>
          </div>

          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "6px" }}>
              BADGES EARNED
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981" }}>
              {BADGES.length}
            </div>
            <p style={{ fontSize: "12px", color: "var(--dim)", margin: "4px 0 0" }}>
              Accredited platform accolades
            </p>
          </div>
        </div>

        {/* Main 2-Column Dashboard Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "28px" }}>
          {/* Left Column: Partners & Contracts */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* Section: Active Partners & Friends */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0 }}>
                    🤝 Active Partners ({partners.length})
                  </h2>
                  <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0" }}>
                    Operators you have connected with and established mutual synergy.
                  </p>
                </div>
                <Link href="/discover" className="outline-btn sm" style={{ fontSize: "12px" }}>
                  + Find More
                </Link>
              </div>

              {partners.length === 0 ? (
                <div
                  className="glass-inset"
                  style={{
                    padding: "36px 20px",
                    textAlign: "center",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <div style={{ position: "relative", width: "160px", height: "100px", margin: "0 auto 12px" }}>
                    <Image
                      src="/images/empty-discover-deck.png"
                      alt="No partners yet"
                      fill
                      sizes="160px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 6px" }}>
                    No active partners yet
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--muted)", maxWidth: "380px", margin: "0 auto 16px" }}>
                    Explore the Discover Deck to review matching candidate profiles, evaluate 4D working styles, and send connection requests.
                  </p>
                  <Link href="/discover" className="primary-btn sm">
                    Browse Discover Deck
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {partners.map(({ profile: p, score, contactUrl }) => (
                    <div
                      key={p.id}
                      className="glass-card"
                      style={{
                        padding: "18px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--stroke)" }}>
                          <AvatarSVG name={p.codename} size={44} />
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <strong style={{ fontSize: "15px", color: "var(--text-bright)" }}>
                              {p.codename}
                            </strong>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: "9999px",
                                background: "var(--accent-subtle)",
                                color: "var(--accent)",
                              }}
                            >
                              {score}% Synergy
                            </span>
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                            {formatRoleWithIcon(p.industry_category, p.professional_title)}
                          </div>
                          {contactUrl && (
                            <div style={{ fontSize: "12px", color: "var(--accent)", marginTop: "4px" }}>
                              🔗 <a href={contactUrl} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>{contactUrl}</a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <Link href="/messages" className="outline-btn sm" style={{ fontSize: "12px" }}>
                          💬 Chat
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section: 48h Trial Tasks & Milestone Contracts */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0 }}>
                    📑 Trial Tasks &amp; Contracts ({(contracts ?? []).length})
                  </h2>
                  <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0" }}>
                    Standardized 48h milestone agreements to evaluate chemistry with escrow security.
                  </p>
                </div>
                <Link href="/messages" className="outline-btn sm" style={{ fontSize: "12px" }}>
                  + New Proposal
                </Link>
              </div>

              {(contracts ?? []).length === 0 ? (
                <div
                  className="glass-inset"
                  style={{
                    padding: "28px 20px",
                    textAlign: "center",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
                    No active milestone contracts. Open a chat with any partner to propose a 48h trial task.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {(contracts ?? []).map((c) => (
                    <div
                      key={c.id}
                      className="glass-card"
                      style={{
                        padding: "16px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "14px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background:
                                c.status === "accepted"
                                  ? "var(--success-bg)"
                                  : c.status === "paid"
                                  ? "rgba(59, 130, 246, 0.15)"
                                  : "var(--surface-inset)",
                              color:
                                c.status === "accepted"
                                  ? "var(--success)"
                                  : c.status === "paid"
                                  ? "#60a5fa"
                                  : "var(--muted)",
                              border: "1px solid var(--stroke)",
                            }}
                          >
                            {c.status}
                          </span>
                          <strong style={{ fontSize: "14px", color: "var(--text-bright)" }}>
                            ${c.price_amount} USD
                          </strong>
                          <span style={{ fontSize: "12px", color: "var(--dim)" }}>
                            with {contractPartnerName.get(c.proposed_by === user.id ? c.proposed_to : c.proposed_by) || "Partner"}
                          </span>
                        </div>
                        <p style={{ fontSize: "13px", color: "var(--text)", margin: 0 }}>
                          {c.deliverables}
                        </p>
                      </div>

                      <Link href="/messages" className="outline-btn sm" style={{ fontSize: "12px" }}>
                        View in Chat
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section: Project Pitch */}
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 16px" }}>
                💡 My Project Pitch
              </h2>
              <ProjectForm project={project} />
            </div>
          </div>

          {/* Right Column: 4D Working Style & Badges */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* 4D Working Style Equalizer */}
            <div className="glass-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
                  ⚡ 4D Working Dynamic
                </h3>
                <Link href="/onboarding" className="sub" style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600 }}>
                  Recalibrate
                </Link>
              </div>

              {vibe ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {DIMS.map((dim) => {
                    const val = vibe[dim.key] ?? 3;
                    const pct = Math.round((val / 5) * 100);
                    return (
                      <div key={dim.key}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                          <span style={{ fontWeight: 600, color: "var(--text-bright)" }}>{dim.label}</span>
                          <span style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}>{val} / 5</span>
                        </div>
                        <div className="bar-track" style={{ height: "8px", background: "var(--surface-inset)" }}>
                          <div
                            className="bar-fill"
                            style={{
                              width: `${pct}%`,
                              background: "linear-gradient(90deg, #ff3d6e, #8b5cf6)",
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--dim)", marginTop: "2px" }}>
                          <span>{dim.low}</span>
                          <span>{dim.high}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize: "13px", color: "var(--muted)" }}>
                  Complete your onboarding calibration to generate your 4D working style fingerprint.
                </p>
              )}
            </div>

            {/* Badges & Reputation Vault */}
            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 16px" }}>
                🏆 Badges &amp; Accreditations ({BADGES.length})
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {BADGES.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface-inset)",
                      border: "1px solid var(--stroke-subtle)",
                    }}
                  >
                    <span style={{ fontSize: "24px", lineHeight: 1 }}>{b.icon}</span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <strong style={{ fontSize: "13px", color: "var(--text-bright)" }}>{b.name}</strong>
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            padding: "1px 6px",
                            borderRadius: "4px",
                            background: "rgba(16, 185, 129, 0.15)",
                            color: "#10b981",
                          }}
                        >
                          UNLOCKED
                        </span>
                      </div>
                      <p style={{ fontSize: "11px", color: "var(--muted)", margin: "2px 0 0", lineHeight: 1.4 }}>
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
