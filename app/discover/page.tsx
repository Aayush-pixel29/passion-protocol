import { DiscoverDeck, type DiscoverCard } from "@/components/DiscoverDeck";
import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile, loadCompletedOperators } from "@/lib/data";
import { rankMatches } from "@/lib/match";
import { redirect } from "next/navigation";
import { formatRole, type ConnectState } from "@/lib/types";

export default async function DiscoverPage() {
  const { user, profile, vibe, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete || !profile.looking_for || !profile.role || !vibe) {
    redirect("/onboarding");
  }

  const pool = await loadCompletedOperators();
  const ranked = rankMatches(
    { id: user.id, role: profile.role, looking_for: profile.looking_for, vibe },
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
            <p className="kicker">Discover</p>
            <h2>People who match your vibe</h2>
            <p className="sub">
              {profile.codename} · looking for {formatRole(profile.looking_for)} · ranked in a grid
            </p>
          </div>
        </div>
        <DiscoverDeck cards={cards} />
      </main>
    </div>
  );
}
