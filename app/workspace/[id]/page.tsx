import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { WorkspaceBoard } from "@/components/WorkspaceBoard";
import { getOwnProfile } from "@/lib/data";
import type { PartnershipContract, WorkspaceFile, WorkspaceEmbed, Profile } from "@/lib/types";

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, profile, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete) redirect("/onboarding");

  let row: PartnershipContract;
  let partnerProfile: Partial<Profile>;
  let initialFiles: WorkspaceFile[] = [];
  let initialEmbeds: WorkspaceEmbed[] = [];

  if (id === "demo" || id === "preview" || id === "demo-pod") {
    row = {
      id,
      connect_request_id: "req-demo",
      proposed_by: user.id,
      proposed_to: "demo-partner-id",
      status: "accepted",
      payment_status: "paid",
      deliverables: "Autonomous Multi-Agent AI Workflow Engine (MVP Sprint)",
      price_amount: 3500,
      contract_type: "5050_revenue",
      revenue_split_a: 50,
      revenue_split_b: 50,
      platform_fee_pct: 5,
      created_at: new Date().toISOString(),
    };
    partnerProfile = {
      id: "demo-partner-id",
      codename: "CyberVibe",
      full_name: "Elena Rostova",
      professional_title: "Full-Stack AI Architect & Security Lead",
      industry_category: "Software & IT",
      location: "San Francisco, CA",
      bio: "Building resilient AI agents, zero-knowledge microservices, and high-frequency backend pipelines.",
      payment_link: "https://buy.stripe.com/demo_elena_protocol",
    };
  } else {
    const { data: contract } = await supabase
      .from("partnership_contracts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!contract || contract.status !== "accepted") notFound();
    if (contract.proposed_by !== user.id && contract.proposed_to !== user.id) notFound();

    const partnerId = contract.proposed_by === user.id ? contract.proposed_to : contract.proposed_by;
    const { data: partnerRow } = await supabase
      .from("profiles")
      .select("id, codename, full_name, professional_title, industry_category, location, bio, payment_link")
      .eq("id", partnerId)
      .maybeSingle();

    const { data: files } = await supabase
      .from("workspace_files")
      .select("*")
      .eq("contract_id", id)
      .order("created_at", { ascending: false });

    const { data: embeds } = await supabase
      .from("workspace_embeds")
      .select("*")
      .eq("contract_id", id)
      .order("created_at", { ascending: false });

    row = contract as PartnershipContract;
    partnerProfile = (partnerRow as Partial<Profile>) || {
      id: partnerId,
      codename: "Partner",
      professional_title: "Verified Builder",
      industry_category: "Software & IT",
    };
    initialFiles = (files ?? []) as WorkspaceFile[];
    initialEmbeds = (embeds ?? []) as WorkspaceEmbed[];
  }

  return (
    <div className="site" style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <SiteHeader current="messages" signedIn />
      <main style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "24px 20px 60px", boxSizing: "border-box", flex: 1 }}>
        <WorkspaceBoard
          contract={row}
          contractId={id}
          currentUserId={user.id}
          currentUserProfile={profile}
          partner={partnerProfile}
          initialFiles={initialFiles}
          initialEmbeds={initialEmbeds}
          paymentStatus={row.payment_status === "paid" ? "paid" : "unpaid"}
          categories={Array.from(new Set([profile?.industry_category, partnerProfile.industry_category].filter(Boolean))) as string[]}
          partnerPaymentLink={partnerProfile.payment_link}
        />
        <div style={{ marginTop: "32px", display: "flex", gap: "16px", fontSize: "13px", fontWeight: 700, color: "var(--muted)" }}>
          <Link href="/messages" style={{ color: "var(--accent)", textDecoration: "none" }}>&larr; Back to Realtime Messages</Link>
          <span>&middot;</span>
          <Link href="/discover" style={{ color: "var(--text-bright)", textDecoration: "none" }}>Explore Discover Deck</Link>
          <span>&middot;</span>
          <Link href="/profile" style={{ color: "var(--text-bright)", textDecoration: "none" }}>My Passport</Link>
        </div>
      </main>
    </div>
  );
}

