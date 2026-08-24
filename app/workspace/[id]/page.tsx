import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { WorkspaceBoard } from "@/components/features/workspace/WorkspaceBoard";
import { getOwnProfile } from "@/lib/data";
import type { PartnershipContract, WorkspaceFile } from "@/lib/types";

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, profile, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete) redirect("/onboarding");

  const { data: contract } = await supabase
    .from("partnership_contracts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!contract || contract.status !== "accepted") notFound();
  if (contract.proposed_by !== user.id && contract.proposed_to !== user.id) notFound();

  const partnerId = contract.proposed_by === user.id ? contract.proposed_to : contract.proposed_by;
  const { data: partner } = await supabase
    .from("profiles")
    .select("codename, professional_title, industry_category, stripe_account_id")
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

  const row = contract as PartnershipContract;

  return (
    <div className="site">
      <SiteHeader current="messages" signedIn />
      <main className="wrap" style={{ maxWidth: 880 }}>
        <div className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="kicker">Pod workspace</p>
            <h2>Working with {partner?.codename ?? "partner"}</h2>
            <p className="sub">
              {row.deliverables} &middot; ${row.price_amount}
            </p>
            <p className="sub" style={{ fontSize: 13, marginTop: 8 }}>
              This is a working record between the two of you — not legal advice.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="role-tag" style={{ 
              display: "inline-block", 
              background: row.payment_status === "paid" ? "rgba(16, 185, 129, 0.1)" : "rgba(234, 179, 8, 0.1)",
              borderColor: row.payment_status === "paid" ? "rgba(16, 185, 129, 0.3)" : "rgba(234, 179, 8, 0.3)",
              color: row.payment_status === "paid" ? "#10b981" : "#eab308"
            }}>
              {row.payment_status === "paid" ? "Contract Paid" : "Payment Pending"}
            </div>
          </div>
        </div>
        <WorkspaceBoard
          contractId={id}
          currentUserId={user.id}
          initialFiles={(files ?? []) as WorkspaceFile[]}
          initialEmbeds={(embeds ?? [])}
          paymentStatus={row.payment_status as "paid" | "unpaid"}
          categories={[profile?.industry_category, partner?.industry_category].filter(Boolean) as string[]}
        />
        <p style={{ marginTop: 20 }}>
          <Link href="/messages">Back to messages</Link>
          {" · "}
          <Link href="/profile">View on profile</Link>
        </p>
      </main>
    </div>
  );
}
