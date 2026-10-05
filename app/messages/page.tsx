import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile } from "@/lib/data";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/ChatInterface";
import { vibeScore } from "@/lib/match";
import type { Profile, VibeAnswers, Project } from "@/lib/types";

export interface EnrichedPartnerConnection {
  connect_request_id: string;
  partner: Profile;
  vibe: VibeAnswers;
  project: Project | null;
  synergyScore: number;
  lastMessage: {
    content: string;
    created_at: string;
    sender_id: string;
  } | null;
}

export default async function MessagesPage() {
  const { user, profile, vibe: myVibe, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete) redirect("/onboarding");

  // Get active accepted connections
  const { data: acceptedRows } = await supabase
    .from("connect_requests")
    .select("id, from_id, to_id, created_at")
    .or(`from_id.eq.${user.id},to_id.eq.${user.id}`)
    .eq("status", "accepted");

  const partners = (acceptedRows ?? []).map((row) => ({
    connect_request_id: row.id,
    partner_id: row.from_id === user.id ? row.to_id : row.from_id,
  }));

  const partnerIds = partners.map((p) => p.partner_id);

  // Fetch full partner profiles
  const { data: partnerProfiles } = partnerIds.length
    ? await supabase
        .from("profiles")
        .select("id, codename, full_name, professional_title, industry_category, bio, location, linkedin_url, spoken_languages, intent_filter, onboarding_complete")
        .in("id", partnerIds)
    : { data: [] };

  // Fetch partner vibes
  const { data: partnerVibes } = partnerIds.length
    ? await supabase
        .from("vibe_answers")
        .select("user_id, pace, comms, risk, energy")
        .in("user_id", partnerIds)
    : { data: [] };

  // Fetch partner projects
  const { data: partnerProjects } = partnerIds.length
    ? await supabase
        .from("projects")
        .select("id, user_id, title, description, budget_range")
        .in("user_id", partnerIds)
    : { data: [] };

  // Fetch latest message for each partner
  const { data: recentMessages } = partnerIds.length
    ? await supabase
        .from("messages")
        .select("id, sender_id, receiver_id, content, created_at")
        .or(
          partnerIds
            .map((pid) => `and(sender_id.eq.${user.id},receiver_id.eq.${pid}),and(sender_id.eq.${pid},receiver_id.eq.${user.id})`)
            .join(",")
        )
        .order("created_at", { ascending: false })
    : { data: [] };

  const partnerMap = new Map((partnerProfiles ?? []).map((p) => [p.id, p]));
  const vibeMap = new Map((partnerVibes ?? []).map((v) => [v.user_id, v as VibeAnswers]));
  const projectMap = new Map((partnerProjects ?? []).map((pj) => [pj.user_id, pj as Project]));

  // Index latest message per partner
  const lastMsgMap = new Map<string, { content: string; created_at: string; sender_id: string }>();
  for (const msg of recentMessages ?? []) {
    const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
    if (!lastMsgMap.has(otherId)) {
      lastMsgMap.set(otherId, {
        content: msg.content,
        created_at: msg.created_at,
        sender_id: msg.sender_id,
      });
    }
  }

  const defaultVibe: VibeAnswers = { pace: 4, comms: 3, risk: 4, energy: 4 };
  const userVibe = myVibe ?? defaultVibe;

  const rawConnections = partners
    .map((p) => {
      const partnerProfile = partnerMap.get(p.partner_id);
      if (!partnerProfile) return null;
      const partnerVibe = vibeMap.get(p.partner_id) ?? defaultVibe;
      const partnerProject = projectMap.get(p.partner_id) ?? null;
      const score = vibeScore(userVibe, partnerVibe);
      const lastMessage = lastMsgMap.get(p.partner_id) ?? null;

      const conn: EnrichedPartnerConnection = {
        connect_request_id: p.connect_request_id,
        partner: partnerProfile as Profile,
        vibe: partnerVibe,
        project: partnerProject,
        synergyScore: score,
        lastMessage,
      };
      return conn;
    });

  const connections: EnrichedPartnerConnection[] = rawConnections.filter(
    (p): p is EnrichedPartnerConnection => p !== null
  );

  return (
    <div className="site" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <SiteHeader current="messages" signedIn />
      <main style={{ 
        display: "flex", 
        flexDirection: "column", 
        flex: 1,
        height: "calc(100vh - 64px)",
        padding: "12px 16px 16px",
        boxSizing: "border-box",
        maxWidth: "1440px",
        width: "100%",
        margin: "0 auto",
        overflow: "hidden" 
      }}>
        {connections.length === 0 ? (
          <div className="empty glass-panel" style={{ margin: "auto", padding: "48px 32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 600, borderRadius: 24, border: "1px solid var(--stroke)" }}>
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
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.35rem", color: "var(--text-bright)", fontWeight: 800 }}>No Active Partnerships Yet</h3>
            <p style={{ margin: "0 0 6px 0", color: "var(--muted)" }}>You don&apos;t have any active partnerships yet.</p>
            <p style={{ margin: "0 0 24px 0", color: "var(--dim)", fontSize: "14px" }}>Go to Discover and connect with someone!</p>
            <Link href="/discover" className="primary-btn inline" style={{ padding: "12px 28px", borderRadius: 9999, fontWeight: 700 }}>
              Explore Discover Deck &rarr;
            </Link>
          </div>
        ) : (
          <div style={{ flexGrow: 1, display: "flex", overflow: "hidden", height: "100%", borderRadius: 20, border: "1px solid var(--stroke)", boxShadow: "0 8px 32px rgba(0,0,0,0.06)", background: "var(--surface)" }}>
            <ChatInterface 
              currentUserId={user.id} 
              connections={connections} 
            />
          </div>
        )}
      </main>
    </div>
  );
}

