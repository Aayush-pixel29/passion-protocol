import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getOwnProfile } from "@/lib/data";
import { redirect } from "next/navigation";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { ExportDataButton } from "@/components/ExportDataButton";
import { PaymentSettings } from "@/components/PaymentSettings";
import { LiveVibeEqualizer } from "@/components/LiveVibeEqualizer";
import { SubscriptionSettingsCard } from "@/components/SubscriptionSettingsCard";

export default async function ProfilePage() {
  const { user, profile, vibe, project, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete) redirect("/onboarding");

  // Parallel database execution for instant page loading
  const [
    { count: pendingCount },
    { data: acceptedRows },
    { data: acceptedContracts }
  ] = await Promise.all([
    supabase.from("connect_requests").select("*", { count: "exact", head: true }).eq("to_id", user.id).eq("status", "pending"),
    supabase.from("connect_requests").select("from_id, to_id").or(`from_id.eq.${user.id},to_id.eq.${user.id}`).eq("status", "accepted"),
    supabase.from("partnership_contracts").select("id, deliverables, price_amount, status, proposed_by, proposed_to").or(`proposed_by.eq.${user.id},proposed_to.eq.${user.id}`).eq("status", "accepted")
  ]);

  const partnerIds = (acceptedRows ?? []).map((row) =>
    row.from_id === user.id ? row.to_id : row.from_id
  );

  // Parallel fetch partner details
  const [
    { data: partnerProfiles },
    { data: partnerLinks }
  ] = await Promise.all([
    partnerIds.length
      ? supabase.from("profiles").select("id, codename, industry_category, professional_title").in("id", partnerIds)
      : Promise.resolve({ data: [] }),
    partnerIds.length
      ? supabase.from("profile_links").select("user_id, contact_url").in("user_id", partnerIds)
      : Promise.resolve({ data: [] })
  ]);

  const linkByUserId = new Map<string, string>();
  for (const link of partnerLinks ?? []) {
    if (link.contact_url) linkByUserId.set(link.user_id, link.contact_url);
  }

  const contractPartnerIds = (acceptedContracts ?? []).map((c) =>
    c.proposed_by === user.id ? c.proposed_to : c.proposed_by
  );
  const { data: contractPartners } = contractPartnerIds.length
    ? await supabase.from("profiles").select("id, codename").in("id", contractPartnerIds)
    : { data: [] };
  const contractPartnerName = new Map((contractPartners ?? []).map((p) => [p.id, p.codename]));

  const exportPayload = {
    profile,
    vibe,
    project,
    exportedAt: new Date().toISOString(),
  };

  return (
    <div className="site">
      <SiteHeader current="profile" signedIn />
      
      <main className="wrap" style={{ padding: "36px 24px 80px" }}>
        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span className="kicker" style={{ margin: 0 }}>Builder Passport</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "12px", color: "var(--success)", background: "var(--success-bg)", border: "1px solid var(--success-border)", padding: "2px 8px", borderRadius: "var(--radius-sm)", fontWeight: 600 }}>
                Active Profile
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.6rem)", fontWeight: 800, margin: 0, color: "var(--text-bright, #111827)" }}>
              {profile.codename}
            </h1>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/discover" className="primary-btn" style={{ fontSize: 13, padding: "8px 18px", borderRadius: 999 }}>
              Explore Matches &rarr;
            </Link>
            <Link href="/onboarding" className="outline-btn" style={{ fontSize: 13, padding: "8px 18px", borderRadius: 999 }}>
              Edit Details
            </Link>
          </div>
        </div>

        {/* Subscription Perks & Billing Card */}
        <div style={{ marginBottom: 32 }}>
          <SubscriptionSettingsCard currentTier="starter" />
        </div>

        {/* Profile Grid: Identity + Live Vibe Equalizer */}
        <div className="profile-grid">
          {/* Left Column: Identity Card */}
          <section className="identity" style={{ background: "var(--surface, #ffffff)", border: "1px solid var(--stroke, #e5e3db)", borderRadius: "var(--radius-xl, 16px)", padding: 28, boxShadow: "var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))" }}>
            <div style={{ marginBottom: 12 }}>
              <span className="role-tag">
                {profile.industry_category}
              </span>
            </div>

            <h3 style={{ fontSize: 20, margin: "0 0 6px", fontWeight: 750, color: "var(--text-bright, #111827)" }}>
              {profile.professional_title}
            </h3>

            <p style={{ color: "var(--accent, #ff3d6e)", fontSize: 14, fontWeight: 600, margin: "0 0 16px" }}>
              Seeking: <span style={{ color: "var(--text-bright, #111827)" }}>{profile.looking_for_title}</span> ({profile.looking_for_category})
            </p>

            {profile.full_name ? (
              <p className="sub" style={{ margin: "6px 0", fontSize: 14 }}>
                <span style={{ color: "var(--dim, #6b7280)" }}>Name:</span>{" "}
                <span style={{ color: "var(--text-bright, #111827)", fontWeight: 500 }}>{profile.full_name}</span>
              </p>
            ) : null}

            {profile.location ? (
              <p className="sub" style={{ margin: "6px 0", fontSize: 14 }}>
                <span style={{ color: "var(--dim, #6b7280)" }}>Location:</span>{" "}
                <span style={{ color: "var(--text-bright, #111827)", fontWeight: 500 }}>{profile.location}</span>
              </p>
            ) : null}

            {profile.spoken_languages?.length ? (
              <div style={{ margin: "8px 0", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                <span style={{ color: "var(--dim, #6b7280)", fontSize: 14 }}>Languages:</span>
                {profile.spoken_languages.map((lang) => (
                  <span key={lang} style={{ fontSize: 12, padding: "2px 8px", background: "var(--surface-inset, #f4f3ee)", border: "1px solid var(--stroke, #e5e3db)", borderRadius: "var(--radius-sm, 6px)" }}>
                    {lang}
                  </span>
                ))}
              </div>
            ) : null}

            {profile.bio ? (
              <p className="sub" style={{ marginTop: 12, padding: "12px 14px", background: "var(--surface-inset, #f4f3ee)", borderRadius: "var(--radius-sm, 6px)", border: "1px solid var(--stroke, #e5e3db)", fontSize: 13, lineHeight: 1.6 }}>
                &ldquo;{profile.bio}&rdquo;
              </p>
            ) : null}
            
            {profile.linkedin_url || profile.phone_number ? (
              <div style={{ marginTop: 16, padding: 14, background: "var(--surface-inset, #f4f3ee)", borderRadius: "var(--radius, 8px)", border: "1px solid var(--stroke, #e5e3db)" }}>
                {profile.linkedin_url ? (
                  <p className="sub" style={{ margin: "4px 0", fontSize: 13 }}>
                    <span style={{ color: "var(--dim, #6b7280)" }}>LinkedIn:</span>{" "}
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent, #ff3d6e)", textDecoration: "underline", fontWeight: 500 }}>
                      {profile.linkedin_url} &rarr;
                    </a>
                  </p>
                ) : null}
                {profile.phone_number ? (
                  <p className="sub" style={{ margin: "4px 0", fontSize: 13 }}>
                    <span style={{ color: "var(--dim, #6b7280)" }}>Phone:</span>{" "}
                    <span style={{ color: "var(--text-bright, #111827)", fontWeight: 500 }}>{profile.phone_number}</span>
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="stats" style={{ marginTop: 20 }}>
              <div>
                <div className="stat-value">{partnerIds.length}</div>
                <div className="stat-label">Partners</div>
              </div>
              <div>
                <div className="stat-value">{pendingCount ?? 0}</div>
                <div className="stat-label">Inbound</div>
              </div>
              <div>
                <div className="stat-value" style={{ fontSize: "1rem" }}>
                  {profile.industry_category?.split(" ")[0] || "Discipline"}
                </div>
                <div className="stat-label">Role</div>
              </div>
            </div>
          </section>

          {/* Right Column: Live Vibe Equalizer & 4D Fingerprint (Pace, Comms, Risk, Energy) */}
          <section className="fingerprint">
            {vibe ? (
              <LiveVibeEqualizer initialVibe={vibe} />
            ) : (
              <p className="sub">No vibe answers recorded. Pace, Comms, Risk, Energy uncalibrated.</p>
            )}
          </section>
        </div>


        {/* Payment Settings Section */}
        <section className="glass-panel" style={{ marginTop: 32, padding: 28, background: "var(--surface, #ffffff)", border: "1px solid var(--stroke, #e5e3db)", borderRadius: "var(--radius-xl, 16px)" }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 750, color: "var(--text-bright, #111827)" }}>Payment Settings</h3>
            <p className="sub" style={{ margin: "4px 0 0", fontSize: 14, color: "var(--muted, #4b5563)" }}>
              Add your payout or payment link so partners can settle milestone agreements.
            </p>
          </div>
          <PaymentSettings initialLink={profile.payment_link || null} />
        </section>

        {/* Active Partnerships */}
        {partnerProfiles && partnerProfiles.length > 0 ? (
          <section style={{ marginTop: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 750, color: "var(--text-bright, #111827)" }}>
                Active Partnerships ({partnerProfiles.length})
              </h3>
              <Link href="/messages" className="pill-btn" style={{ fontSize: 12, padding: "6px 14px" }}>
                Open Messages &rarr;
              </Link>
            </div>
            <div className="match-grid">
              {partnerProfiles.map((p) => {
                const contact = linkByUserId.get(p.id);
                return (
                  <article key={p.id} className="match-card success" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div className="match-card-top">
                        <div>
                          <span className="role-tag" style={{ fontSize: 11, padding: "2px 8px", marginBottom: 6 }}>
                            {p.industry_category}
                          </span>
                          <h3 style={{ fontSize: 16, color: "var(--text-bright, #111827)", margin: "4px 0", fontWeight: 750 }}>{p.codename}</h3>
                          <p className="card-skill">{p.professional_title}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--success-bg)", border: "1px solid var(--success-border)", borderRadius: "var(--radius-sm)" }}>
                        <p style={{ color: "var(--success)", fontWeight: 700, fontSize: 13, margin: 0 }}>
                          Partnership Confirmed
                        </p>
                        {contact ? (
                          <p className="sub" style={{ marginTop: 6, marginBottom: 0, fontSize: 13 }}>
                            Contact:{" "}
                            <a
                              href={contact.startsWith("http") ? contact : `https://${contact}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "var(--accent, #ff3d6e)", textDecoration: "underline", fontWeight: 600 }}
                            >
                              {contact} &rarr;
                            </a>
                          </p>
                        ) : (
                          <p className="sub" style={{ marginTop: 6, marginBottom: 0, fontSize: 13 }}>
                            No external link provided
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <Link href="/messages" className="pill-btn" style={{ width: "100%", textAlign: "center", display: "block", fontSize: 13 }}>
                        Chat with {p.codename}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {acceptedContracts && acceptedContracts.length > 0 ? (
          <section style={{ marginTop: 40 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 750, color: "var(--text-bright, #111827)" }}>
              Active Milestone Contracts
            </h3>
            <div className="match-grid">
              {acceptedContracts.map((c) => {
                const otherId = c.proposed_by === user.id ? c.proposed_to : c.proposed_by;
                return (
                  <article key={c.id} className="match-card success" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 750 }}>
                        {contractPartnerName.get(otherId) ?? "Partner"}
                      </h3>
                      <p className="card-skill">{c.deliverables}</p>
                      <p className="sub" style={{ marginBottom: 14 }}>${c.price_amount} &middot; Accepted</p>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <Link href={`/workspace/${c.id}`} className="pill-btn accept" style={{ textAlign: "center", display: "block", fontSize: 13, width: "100%" }}>
                        Open Workspace &rarr;
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Settings: Export My Data & Delete Account */}
        <section className="glass-panel" style={{ marginTop: 48, padding: 28, background: "var(--surface, #ffffff)", border: "1px solid var(--stroke, #e5e3db)", borderRadius: "var(--radius-xl, 16px)" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 750, color: "var(--text-bright, #111827)" }}>
            Account Settings &amp; Data Rights
          </h3>
          <p className="sub" style={{ margin: "0 0 20px", fontSize: 14, color: "var(--muted, #4b5563)" }}>
            Manage your account lifecycle, download a complete copy of your data, or permanently erase your profile.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, padding: "16px 20px", background: "var(--surface-inset, #f4f3ee)", borderRadius: "var(--radius, 8px)", marginBottom: 16 }}>
            <div>
              <strong style={{ fontSize: 14, display: "block", color: "var(--text-bright, #111827)" }}>Export My Data</strong>
              <span className="sub" style={{ fontSize: 13, color: "var(--muted, #4b5563)" }}>Download your complete operator dossier, vibe answers, and project pitches in JSON format.</span>
            </div>
            <ExportDataButton userData={exportPayload} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, padding: "16px 20px", background: "var(--danger-bg)", border: "1px solid var(--danger-border)", borderRadius: "var(--radius, 8px)" }}>
            <div>
              <strong style={{ fontSize: 14, color: "var(--danger)", display: "block" }}>Delete Account</strong>
              <span style={{ fontSize: 13, color: "var(--text, #1f2937)" }}>Permanently remove your account, profile, matches, and messages. Irreversible.</span>
            </div>
            <DeleteAccountButton />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
