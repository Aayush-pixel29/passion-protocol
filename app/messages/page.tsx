import Image from "next/image";
import Link from "next/link";
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

  const partnerIds = partners.map((p) => p.partner_id);

  const { data: partnerProfiles } = partnerIds.length
    ? await supabase
        .from("profiles")
        .select("id, codename, professional_title")
        .in("id", partnerIds)
    : { data: [] };

  const partnerMap = new Map(partnerProfiles?.map((p) => [p.id, p]));

  const connections = partners
    .map((p) => ({
      connect_request_id: p.connect_request_id,
      partner: partnerMap.get(p.partner_id)!,
    }))
    .filter((p) => p.partner);

  return (
    <div className="site">
      <SiteHeader current="messages" signedIn />
      <main style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "calc(100vh - 64px)", // Assuming header is around 64px
        overflow: "hidden" 
      }}>
        {connections.length === 0 ? (
          <div className="empty glass-panel" style={{ margin: "40px auto", padding: "48px 32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 600 }}>
            <div style={{ maxWidth: 440, width: "100%", margin: "0 auto 24px" }}>
              <Image
                src="/images/empty-messages-chat.png"
                alt="No active partnerships"
                width={440}
                height={248}
                priority
                style={{ width: "100%", height: "auto", borderRadius: 14, border: "1px solid var(--stroke)" }}
              />
            </div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.35rem", color: "var(--text-bright)" }}>No Active Partnerships Yet</h3>
            <p style={{ margin: "0 0 6px 0", color: "#cbd5e1" }}>You don&apos;t have any active partnerships yet.</p>
            <p style={{ margin: "0 0 24px 0", color: "var(--muted)" }}>Go to Discover and connect with someone!</p>
            <Link href="/discover" className="primary-btn inline" style={{ padding: "12px 24px" }}>
              Explore Discover Deck &rarr;
            </Link>
          </div>
        ) : (
          <div style={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
            <ChatInterface currentUserId={user.id} connections={connections} />
          </div>
        )}
      </main>
    </div>
  );
}
