import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile } from "@/lib/data";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/ChatInterface";

export default async function MessagesPage() {
  const { user, profile, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete) redirect("/onboarding");

  // Get active connections
  const { data: acceptedRows } = await supabase
    .from("connect_requests")
    .select("id, from_id, to_id")
    .or(`from_id.eq.${user.id},to_id.eq.${user.id}`)
    .eq("status", "accepted");

  const partners = (acceptedRows ?? []).map((row) => ({
    connect_request_id: row.id,
    partner_id: row.from_id === user.id ? row.to_id : row.from_id,
  }));

  const partnerIds = partners.map(p => p.partner_id);

  const { data: partnerProfiles } = partnerIds.length
    ? await supabase.from("profiles").select("id, codename, professional_title").in("id", partnerIds)
    : { data: [] };

  const partnerMap = new Map(partnerProfiles?.map(p => [p.id, p]));

  const connections = partners.map(p => ({
    connect_request_id: p.connect_request_id,
    partner: partnerMap.get(p.partner_id)!,
  })).filter(p => p.partner);

  return (
    <div className="site">
      <SiteHeader current="messages" signedIn />
      <main className="wrap" style={{ maxWidth: 1000 }}>
        <div className="page-intro">
          <p className="kicker">Messages</p>
          <h2>Active Partnerships</h2>
        </div>
        
        {connections.length === 0 ? (
          <div className="empty" style={{ marginTop: 40 }}>
            <p>You don&apos;t have any active partnerships yet.</p>
            <p>Go to Discover and connect with someone!</p>
          </div>
        ) : (
          <ChatInterface currentUserId={user.id} connections={connections} />
        )}
      </main>
    </div>
  );
}
