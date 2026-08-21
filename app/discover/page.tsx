import { DiscoverDeck, type DiscoverCard } from "@/components/DiscoverDeck";
import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile, loadCompletedOperators } from "@/lib/data";
import { rankMatches } from "@/lib/match";
import { redirect } from "next/navigation";
import { type ConnectState } from "@/lib/types";

export default async function DiscoverPage() {
  const { user, profile, vibe, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete || !profile.looking_for_category || !profile.industry_category || !vibe) {
    redirect("/onboarding");
  }

  const pool = await loadCompletedOperators();
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

  const { data: connects } = await supabase
    .from("connect_requests")
    .select("from_id, to_id, status")
    .or(`from_id.eq.${user.id},to_id.eq.${user.id}`);

  const statusByUser = new Map<string, ConnectState>();
  for (const row of connects ?? []) {
    const otherId = row.from_id === user.id ? row.to_id : row.from_id;
    let state: ConnectState;
    if (row.status === "accepted") state = "accepted";
    else if (row.status === "declined") state = "declined";
    else state = row.from_id === user.id ? "outgoing_pending" : "incoming_pending";
    statusByUser.set(otherId, state);
  }

  // RLS on profile_links will automatically return links for accepted partners and self
  const { data: links } = await supabase.from("profile_links").select("user_id, contact_url");
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
    };
  });

  return (
    <div className="site">
      <SiteHeader current="discover" signedIn />
      <main className="wrap">
        <div className="page-intro spread">
          <div>
            <div className="badge-pill" style={{ marginBottom: 12 }}>
              <span style={{ color: "#ff3d6e" }}>⚡</span>
              <span>DISCOVER OPERATORS</span>
            </div>
            <h2>
              People who match your <span className="gradient-text">vibe</span>
            </h2>
            <p className="sub">
              <strong>{profile.codename}</strong> · seeking <strong>{profile.looking_for_title}</strong> · ranked by 4D synergy & reciprocal discipline
            </p>
          </div>
          <div 
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: "var(--surface-card)",
              border: "1px solid var(--stroke)",
              borderRadius: "var(--radius-full)",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--muted)",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <span 
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 8px rgba(16, 185, 129, 0.7)"
              }} 
            />
            <span>{cards.length} {cards.length === 1 ? "operator" : "operators"} available</span>
          </div>
        </div>
        <DiscoverDeck cards={cards} />
      </main>
    </div>
  );
}

