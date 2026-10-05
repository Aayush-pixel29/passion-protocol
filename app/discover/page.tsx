import { DiscoverGrid, type DiscoverCard } from "@/components/DiscoverGrid";
import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile } from "@/lib/data";
import { rankMatches } from "@/lib/match";
import { redirect } from "next/navigation";
import { type ConnectState, INDUSTRY_CATEGORIES } from "@/lib/types";

export default async function DiscoverPage() {
  const { user, profile, vibe, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete || !profile.looking_for_category || !profile.industry_category || !vibe) {
    redirect("/onboarding");
  }

  // Execute all discovery queries in parallel for instant sub-100ms loading
  const [
    { data: profiles },
    { data: vibes },
    { data: projects },
    { data: connects },
    { data: links }
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("onboarding_complete", true),
    supabase.from("vibe_answers").select("*"),
    supabase.from("projects").select("*"),
    supabase.from("connect_requests").select("from_id, to_id, status").or(`from_id.eq.${user.id},to_id.eq.${user.id}`),
    supabase.from("profile_links").select("user_id, contact_url")
  ]);

  const vibeByUser = new Map();
  for (const row of vibes || []) vibeByUser.set(row.user_id, row);

  const projectByUser = new Map();
  for (const row of projects || []) projectByUser.set(row.user_id, row);

  const validProfiles = (profiles || []).filter(p => Boolean(p.industry_category && p.professional_title && p.looking_for_category && p.looking_for_title));

  const pool = validProfiles.flatMap(p => {
    const v = vibeByUser.get(p.id);
    const proj = projectByUser.get(p.id) ?? null;
    return v ? [{ profile: p, vibe: v, project: proj }] : [];
  });

  const ranked = rankMatches(
    { 
      id: user.id, 
      industry_category: profile.industry_category, 
      looking_for_category: profile.looking_for_category,
      spoken_languages: profile.spoken_languages || [],
      intent_filter: profile.intent_filter ?? null,
      vibe 
    },
    pool
  );

  const statusByUser = new Map<string, ConnectState>();
  for (const row of connects ?? []) {
    const otherId = row.from_id === user.id ? row.to_id : row.from_id;
    let state: ConnectState;
    if (row.status === "accepted") state = "accepted";
    else if (row.status === "declined") state = "declined";
    else state = row.from_id === user.id ? "outgoing_pending" : "incoming_pending";
    statusByUser.set(otherId, state);
  }

  const linkByUser = new Map<string, string>();
  for (const row of links ?? []) {
    if (row.contact_url) linkByUser.set(row.user_id, row.contact_url);
  }

  const cards: DiscoverCard[] = ranked.map((row) => {
    const status = statusByUser.get(row.profile.id) ?? "none";
    return {
      profile: {
        ...row.profile,
        contact_url: linkByUser.get(row.profile.id) ?? null,
      },
      vibe: row.vibe,
      project: row.project,
      score: row.score,
      connectStatus: status,
      contactUrl: status === "accepted" ? linkByUser.get(row.profile.id) ?? null : null,
      reciprocalMatch: row.reciprocalMatch,
    };
  });

  const presentCategories = [...new Set(ranked.map(r => r.profile.industry_category).filter(Boolean))] as string[];
  const allCategories = INDUSTRY_CATEGORIES.filter(cat => presentCategories.includes(cat));

  return (
    <div className="site">
      <SiteHeader current="discover" signedIn />
      <main className="wrap" style={{ padding: "36px 24px 80px" }}>
        <div className="page-intro spread" style={{ marginBottom: 28 }}>
          <div>
            <div className="badge-pill" style={{ marginBottom: 12 }}>
              <span>DISCOVER OPERATORS</span>
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.6rem)", fontWeight: 800, color: "var(--text-bright, #111827)", margin: "0 0 8px" }}>
              People who match your <span className="gradient-text">vibe</span>
            </h2>
            <p className="sub" style={{ margin: 0, fontSize: 14 }}>
              <strong>{profile.codename}</strong> &middot; seeking <strong>{profile.looking_for_title}</strong> &middot; ranked by 4D synergy & reciprocal discipline
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                background: "var(--surface, #ffffff)",
                border: "1px solid var(--stroke, #e5e3db)",
                borderRadius: "var(--radius-full, 9999px)",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--muted, #4b5563)",
                boxShadow: "var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))"
              }}
            >
              <span 
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--success, #059669)",
                }} 
              />
              <span>{cards.length} {cards.length === 1 ? "operator" : "operators"} available</span>
            </div>
          </div>
        </div>

        <DiscoverGrid cards={cards} allCategories={allCategories} />
      </main>
    </div>
  );
}
