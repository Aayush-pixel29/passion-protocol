import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getOwnProfile } from "@/lib/data";
import { redirect } from "next/navigation";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { ExportDataButton } from "@/components/ExportDataButton";
import { PaymentSettings } from "@/components/PaymentSettings";
import { ProjectForm } from "@/components/ProjectForm";

const DIMS: Array<{ key: "pace" | "comms" | "risk" | "energy"; label: string }> = [
  { key: "pace", label: "Pace" },
  { key: "comms", label: "Communication" },
  { key: "risk", label: "Risk Tolerance" },
  { key: "energy", label: "Energy Style" },
];

export default async function ProfilePage() {
  const { user, profile, vibe, project, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete) redirect("/onboarding");

  const { count: pendingCount } = await supabase
    .from("connect_requests")
    .select("*", { count: "exact", head: true })
    .eq("to_id", user.id)
    .eq("status", "pending");

  const { data: acceptedRows } = await supabase
    .from("connect_requests")
    .select("from_id, to_id")
    .or(`from_id.eq.${user.id},to_id.eq.${user.id}`)
    .eq("status", "accepted");

  const partnerIds = (acceptedRows ?? []).map((row) =>
    row.from_id === user.id ? row.to_id : row.from_id
  );

  const { data: partnerProfiles } = partnerIds.length
    ? await supabase.from("profiles").select("id, codename, industry_category, professional_title").in("id", partnerIds)
    : { data: [] };

  const { data: partnerLinks } = partnerIds.length
    ? await supabase.from("profile_links").select("user_id, contact_url").in("user_id", partnerIds)
    : { data: [] };

  const linkByUserId = new Map<string, string>();
  for (const link of partnerLinks ?? []) {
    if (link.contact_url) linkByUserId.set(link.user_id, link.contact_url);
  }

  const { data: acceptedContracts } = await supabase
    .from("partnership_contracts")
    .select("id, deliverables, price_amount, status, proposed_by, proposed_to")
    .or(`proposed_by.eq.${user.id},proposed_to.eq.${user.id}`)
    .eq("status", "accepted");

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
              <span className="kicker" style={{ margin: 0 }}>Operator Profile</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "12px", color: "var(--success)", background: "var(--success-bg)", border: "1px solid var(--success-border)", padding: "2px 8px", borderRadius: "var(--radius-sm)", fontWeight: 600 }}>
                Active Profile
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)", fontWeight: 800, margin: 0 }}>
              {profile.codename}
            </h1>
          </div>

          <div>
            <Link href="/onboarding" className="outline-btn" style={{ fontSize: 13 }}>
              Edit Vibe &amp; Details
            </Link>
          </div>
        </div>

        {/* Profile Grid: Identity + Vibe Fingerprint */}
        <div className="profile-grid">
          {/* Left Column: Identity Card */}
          <section className="identity">
            <div style={{ marginBottom: 12 }}>
              <span className="role-tag">
                {profile.industry_category}
              </span>
            </div>

            <h3 style={{ fontSize: 20, margin: "0 0 6px", fontWeight: 700 }}>
              {profile.professional_title}
            </h3>

            <p style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600, margin: "0 0 16px" }}>
              Seeking: <span style={{ color: "var(--text-bright)" }}>{profile.looking_for_title}</span> ({profile.looking_for_category})
            </p>

            {profile.full_name ? (
              <p className="sub" style={{ margin: "6px 0", fontSize: 14 }}>
                <span style={{ color: "var(--dim)" }}>Name:</span>{" "}
                <span style={{ color: "var(--text-bright)", fontWeight: 500 }}>{profile.full_name}</span>
              </p>
            ) : null}

            {profile.location ? (
              <p className="sub" style={{ margin: "6px 0", fontSize: 14 }}>
                <span style={{ color: "var(--dim)" }}>Location:</span>{" "}
                <span style={{ color: "var(--text-bright)", fontWeight: 500 }}>{profile.location}</span>
              </p>
            ) : null}

            {profile.spoken_languages?.length ? (
              <div style={{ margin: "8px 0", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                <span style={{ color: "var(--dim)", fontSize: 14 }}>Languages:</span>
                {profile.spoken_languages.map((lang) => (
                  <span key={lang} style={{ fontSize: 12, padding: "2px 8px", background: "var(--surface-inset)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-sm)" }}>
                    {lang}
                  </span>
                ))}
              </div>
            ) : null}

            {profile.bio ? (
              <p className="sub" style={{ marginTop: 12, padding: "12px 14px", background: "var(--surface-inset)", borderRadius: "var(--radius-sm)", border: "1px solid var(--stroke)", fontSize: 13, lineHeight: 1.6 }}>
                &ldquo;{profile.bio}&rdquo;
              </p>
            ) : null}
            
            {profile.linkedin_url || profile.phone_number ? (
              <div style={{ marginTop: 16, padding: 14, background: "var(--surface-inset)", borderRadius: "var(--radius)", border: "1px solid var(--stroke)" }}>
                {profile.linkedin_url ? (
                  <p className="sub" style={{ margin: "4px 0", fontSize: 13 }}>
                    <span style={{ color: "var(--dim)" }}>LinkedIn:</span>{" "}
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline", fontWeight: 500 }}>
                      {profile.linkedin_url} &rarr;
                    </a>
                  </p>
                ) : null}
                {profile.phone_number ? (
                  <p className="sub" style={{ margin: "4px 0", fontSize: 13 }}>
                    <span style={{ color: "var(--dim)" }}>Phone:</span>{" "}
                    <span style={{ color: "var(--text-bright)", fontWeight: 500 }}>{profile.phone_number}</span>
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="stats">
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

          {/* Right Column: Vibe Fingerprint Panel */}
          <section className="fingerprint">
            <div style={{ marginBottom: 12 }}>
              <p className="label plain" style={{ margin: 0, fontSize: 16, color: "var(--text-bright)" }}>
                Vibe Fingerprint
              </p>
              <p className="sub" style={{ margin: "4px 0 16px", fontSize: 13 }}>
                4-dimensional work dynamics calibration.
              </p>
            </div>

            {vibe ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {DIMS.map((d) => (
                  <div key={d.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: "1px solid var(--stroke-subtle)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-bright)", fontWeight: 500 }}>{d.label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--accent)", fontWeight: 700 }}>
                      {vibe[d.key]} / 5
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="sub">No vibe answers recorded.</p>
            )}
          </section>
        </div>

        {/* Project Pitch Section */}
        <section className="glass-panel" style={{ marginTop: 32, padding: 28 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-bright)" }}>Project Pitch</h3>
            <p className="sub" style={{ margin: "4px 0 0", fontSize: 14 }}>
              Broadcast what you are building so complementary co-founders can discover your project.
            </p>
          </div>
          <ProjectForm project={project} />
        </section>

        {/* Payment Settings Section */}
        <section className="glass-panel" style={{ marginTop: 32, padding: 28 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-bright)" }}>Payment Settings</h3>
            <p className="sub" style={{ margin: "4px 0 0", fontSize: 14 }}>
              Add your payout or payment link so partners can settle milestone agreements.
            </p>
          </div>
          <PaymentSettings initialLink={profile.payment_link || null} />
        </section>

        {/* Active Partnerships */}
        {partnerProfiles && partnerProfiles.length > 0 ? (
          <section style={{ marginTop: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-bright)" }}>
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
                          <h3 style={{ fontSize: 16, color: "var(--text-bright)", margin: "4px 0" }}>{p.codename}</h3>
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
                              style={{ color: "var(--accent)", textDecoration: "underline", fontWeight: 600 }}
                            >
                              {contact} &rarr;
                            </a>
                          </p>
                        ) : (
                          <p className="sub" style={{ marginTop: 6, marginBottom: 0, fontSize: 13 }}>
                            No contact handle provided
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
            <h3 style={{ margin: "0 0 16px", fontSize: 18, color: "var(--text-bright)" }}>
              Active Milestone Contracts
            </h3>
            <div className="match-grid">
              {acceptedContracts.map((c) => {
                const otherId = c.proposed_by === user.id ? c.proposed_to : c.proposed_by;
                return (
                  <article key={c.id} className="match-card success">
                    <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>
                      {contractPartnerName.get(otherId) ?? "Partner"}
                    </h3>
                    <p className="card-skill">{c.deliverables}</p>
                    <p className="sub" style={{ marginBottom: 14 }}>${c.price_amount} &middot; Accepted</p>
                    <Link href={`/workspace/${c.id}`} className="pill-btn accept" style={{ textAlign: "center", display: "block", fontSize: 13 }}>
                      Open Workspace
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Settings: Export My Data & Delete Account */}
        <section className="glass-panel" style={{ marginTop: 48, padding: 28, border: "1px solid var(--stroke)" }}>
          <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "var(--text-bright)" }}>
            Account Settings &amp; Data Rights
          </h3>
          <p className="sub" style={{ margin: "0 0 20px", fontSize: 14 }}>
            Manage your account lifecycle, download a complete copy of your data, or permanently erase your profile.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, padding: "16px 20px", background: "var(--surface-inset)", borderRadius: "var(--radius)", marginBottom: 16 }}>
            <div>
              <strong style={{ fontSize: 14, display: "block" }}>Export My Data</strong>
              <span className="sub" style={{ fontSize: 13 }}>Download your complete operator dossier, vibe answers, and project pitches in JSON format.</span>
            </div>
            <ExportDataButton userData={exportPayload} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, padding: "16px 20px", background: "var(--danger-bg)", border: "1px solid var(--danger-border)", borderRadius: "var(--radius)" }}>
            <div>
              <strong style={{ fontSize: 14, color: "var(--danger)", display: "block" }}>Delete Account</strong>
              <span style={{ fontSize: 13, color: "var(--text)" }}>Permanently remove your account, profile, matches, and messages. Irreversible.</span>
            </div>
            <DeleteAccountButton />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
