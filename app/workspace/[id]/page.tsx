import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { WorkspaceBoard } from "@/components/WorkspaceBoard";
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
    .select("codename, professional_title")
    .eq("id", partnerId)
    .maybeSingle();

  const { data: files } = await supabase
    .from("workspace_files")
    .select("*")
    .eq("contract_id", id)
    .order("created_at", { ascending: false });

  const row = contract as PartnershipContract;

  return (
    <div className="site">
      <SiteHeader current="messages" signedIn />
      <main className="wrap" style={{ maxWidth: 880 }}>
        <div className="page-intro">
          <p className="kicker">Pod workspace</p>
          <h2>
            Working with {partner?.codename ?? "partner"}
          </h2>
          <p className="sub">
            {row.deliverables} · ${row.price_amount}
          </p>
          <p className="sub" style={{ fontSize: 13, marginTop: 8 }}>
            This is a working record between the two of you — not legal advice, and Passion Protocol does not hold funds.
          </p>
        </div>
        <WorkspaceBoard
          contractId={id}
          currentUserId={user.id}
          initialFiles={(files ?? []) as WorkspaceFile[]}
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
