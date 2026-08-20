import { DiscoverDeck, type DiscoverCard } from "@/components/DiscoverDeck";
import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile, loadCompletedOperators } from "@/lib/data";
import { rankMatches } from "@/lib/match";
import { redirect } from "next/navigation";
import { formatRole } from "@/lib/types";

export default async function DiscoverPage() {
  const { user, profile, vibe, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete || !profile.looking_for || !vibe) {
    redirect("/onboarding");
  }

  const pool = await loadCompletedOperators();
  const ranked = rankMatches(
    { id: user.id, looking_for: profile.looking_for, vibe },
    pool
  );

  const { data: connects } = await supabase
    .from("connect_requests")
    .select("from_id, to_id, status")
    .or(`from_id.eq.${user.id},to_id.eq.${user.id}`);

  const statusByUser = new Map<string, DiscoverCard["connectStatus"]>();
  for (const row of connects ?? []) {
    const otherId = row.from_id === user.id ? row.to_id : row.from_id;
    statusByUser.set(otherId, row.status as DiscoverCard["connectStatus"]);
  }

  const cards: DiscoverCard[] = ranked.map((row) => ({
    profile: row.profile,
    vibe: row.vibe,
    score: row.score,
    connectStatus: statusByUser.get(row.profile.id) ?? "none",
  }));

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
