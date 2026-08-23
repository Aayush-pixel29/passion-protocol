import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile } from "@/lib/data";

export default async function WorkspacesPage() {
  const { user, profile, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete) redirect("/onboarding");

  // Fetch all accepted contracts
  const { data: contracts } = await supabase
    .from("partnership_contracts")
    .select(`
      *,
      proposed_by:profiles!partnership_contracts_proposed_by_fkey(id, codename, professional_title, industry_category),
      proposed_to:profiles!partnership_contracts_proposed_to_fkey(id, codename, professional_title, industry_category)
    `)
    .or(`proposed_by.eq.${user.id},proposed_to.eq.${user.id}`)
    .eq("status", "accepted")
    .order("created_at", { ascending: false });

  return (
    <div className="site">
      <SiteHeader current="workspaces" signedIn />
      <main className="wrap">
        <div className="page-intro" style={{ marginBottom: 40 }}>
          <p className="kicker">Command Center</p>
          <h2>Your Active Workspaces</h2>
          <p className="sub">
            Manage your ongoing micro-contracts and collaborate with your partners.
          </p>
        </div>

        {(!contracts || contracts.length === 0) ? (
          <div className="glass-panel" style={{ padding: 40, textAlign: "center" }}>
            <h3 style={{ margin: "0 0 12px", color: "var(--text-bright)" }}>No active workspaces yet</h3>
            <p className="sub" style={{ marginBottom: 24 }}>
              Match with a partner and accept a micro-contract to unlock a workspace.
            </p>
            <Link href="/discover" className="pill-btn accept">
              Find Partners
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {contracts.map((c: Record<string, unknown> & { id: string; payment_status: string; deliverables: string; price_amount: number; proposed_by: { id: string; codename: string; professional_title: string; industry_category: string }; proposed_to: { id: string; codename: string; professional_title: string; industry_category: string } }) => {
              const partner = c.proposed_by.id === user.id ? c.proposed_to : c.proposed_by;
              return (
                <Link key={c.id} href={`/workspace/${c.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="glass-panel hover-lift" style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column", transition: "transform 0.2s, border-color 0.2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <div className="role-tag" style={{ marginBottom: 8, display: "inline-block" }}>
                          {partner.industry_category}
                        </div>
                        <h3 style={{ margin: 0, color: "var(--text-bright)", fontSize: "1.25rem" }}>
                          {partner.codename}
                        </h3>
                        <div className="sub" style={{ fontSize: 14 }}>{partner.professional_title}</div>
                      </div>
                      <div style={{ 
                        width: 12, height: 12, borderRadius: "50%", 
                        background: c.payment_status === "paid" ? "#10b981" : "#eab308",
                        boxShadow: `0 0 8px ${c.payment_status === "paid" ? "rgba(16, 185, 129, 0.4)" : "rgba(234, 179, 8, 0.4)"}`
                      }} title={c.payment_status === "paid" ? "Paid" : "Payment Pending"} />
                    </div>
                    
                    <div style={{ flexGrow: 1, padding: "16px 0", borderTop: "1px solid var(--stroke-subtle)" }}>
                      <div className="sub" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                        Deliverables
                      </div>
                      <div style={{ color: "var(--text-main)", fontSize: 15, lineHeight: 1.5 }}>
                        {c.deliverables}
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid var(--stroke-subtle)" }}>
                      <div style={{ fontFamily: "var(--font-mono)", color: "var(--text-bright)", fontWeight: 700 }}>
                        ${c.price_amount}
                      </div>
                      <div style={{ color: "var(--accent-primary)", fontSize: 14, fontWeight: 600 }}>
                        Enter Workspace &rarr;
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
