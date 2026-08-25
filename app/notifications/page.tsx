import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile } from "@/lib/data";
import { redirect } from "next/navigation";
import { NotificationsFeed } from "@/components/NotificationsFeed";

export default async function NotificationsPage() {
  const { user, profile, supabase } = await getOwnProfile();
  if (!user || !profile) redirect("/login");

  // 1. Fetch pending inbound connection requests
  const { data: rawConnects } = await supabase
    .from("connect_requests")
    .select("id, from_id, created_at, status")
    .eq("to_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // 2. Fetch pending inbound contracts
  const { data: rawContracts } = await supabase
    .from("partnership_contracts")
    .select("*")
    .eq("proposed_to", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // 3. Fetch sender profiles for context
  const senderIds = new Set<string>();
  rawConnects?.forEach(c => senderIds.add(c.from_id));
  rawContracts?.forEach(c => senderIds.add(c.proposed_by));

  const { data: senders } = await supabase
    .from("profiles")
    .select("id, codename, professional_title, industry_category")
    .in("id", Array.from(senderIds));

  const senderMap = new Map();
  senders?.forEach(s => senderMap.set(s.id, s));

  // 4. Role Matches (System Alerts) - People who joined recently looking for your role
  // We'll limit it to the last 5 for simplicity
  const { data: roleMatches } = await supabase
    .from("profiles")
    .select("id, codename, industry_category")
    .eq("onboarding_complete", true)
    .eq("looking_for_category", profile.industry_category || "")
    .neq("id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const connects = (rawConnects || []).map(c => ({
    ...c,
    sender: senderMap.get(c.from_id)
  }));

  const contracts = (rawContracts || []).map(c => ({
    ...c,
    sender: senderMap.get(c.proposed_by)
  }));

  return (
    <div className="site">
      <SiteHeader current="notifications" signedIn />
      <main className="wrap" style={{ maxWidth: 800 }}>
        <div className="page-intro">
          <h2>Notifications</h2>
          <p className="sub">Manage connection requests, contract proposals, and system alerts.</p>
        </div>
        
        <NotificationsFeed 
          connects={connects} 
          contracts={contracts} 
          roleMatches={roleMatches || []} 
          currentUserId={user.id}
        />
      </main>
    </div>
  );
}
