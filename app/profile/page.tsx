import Link from "next/link";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { getOwnProfile } from "@/lib/data";
import { redirect } from "next/navigation";
import { DeleteAccountButton } from "@/components/ui/DeleteAccountButton";
import { PaymentSettings } from "@/components/features/profile/PaymentSettings";
import { ProjectForm } from "@/components/features/onboarding/ProjectForm";
import { CATEGORY_ICONS } from "@/lib/types";

const DIMS: Array<{ key: "pace" | "comms" | "risk" | "energy"; label: string }> = [
  { key: "pace", label: "Pace" },
  { key: "comms", label: "Comms" },
  { key: "risk", label: "Risk" },
  { key: "energy", label: "Energy" },
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
  const categoryIcon = CATEGORY_ICONS[profile.industry_category || ""] || "🧑‍💻";

  return (
    <div className="site">
      <SiteHeader current="profile" signedIn />
      <main className="wrap">
        {/* Page Header */}
        <div className="page-intro" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span className="kicker" style={{ margin: 0 }}>OPERATOR DOSSIER</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "12px", color: "var(--success)", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 10px", borderRadius: 999 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)" }} />
              Verified Active
            </span>
          </div>
          <h1 className="gradient-text" style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
            {profile.codename}
          </h1>
        </div>

        {/* Profile Grid: Identity + Vibe Fingerprint */}
        <div className="profile-grid">
          {/* Left Column: Identity Card */}
          <section className="identity">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span className="role-tag" style={{ fontSize: "12px", padding: "4px 10px" }}>
                {categoryIcon} {profile.industry_category}
              </span>
            </div>

            <h3 style={{ fontSize: "20px", color: "var(--text-bright)", margin: "0 0 6px", fontWeight: 700 }}>
              {profile.professional_title}
            </h3>

            <p style={{ color: "var(--accent-3)", fontSize: "14px", fontWeight: 600, margin: "0 0 16px" }}>
              Seeking: <span style={{ color: "var(--text-bright)" }}>{profile.looking_for_title}</span> ({profile.looking_for_category})
            </p>

            {profile.full_name ? (
              <p className="sub" style={{ margin: "6px 0", fontSize: "14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--dim)" }}>Name:</span>
                <span style={{ color: "var(--text-bright)", fontWeight: 500 }}>{profile.full_name}</span>
              </p>
            ) : null}

            {profile.location ? (
              <p className="sub" style={{ margin: "6px 0", fontSize: "14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--dim)" }}>Location:</span>
                <span style={{ color: "var(--text-bright)", fontWeight: 500 }}>📍 {profile.location}</span>
              </p>
            ) : null}

            {profile.spoken_languages?.length ? (
              <div style={{ margin: "8px 0", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                <span style={{ color: "var(--dim)", fontSize: "14px" }}>Languages:</span>
                {profile.spoken_languages.map((lang) => (
                  <span key={lang} style={{ fontSize: "12px", padding: "2px 8px", background: "var(--surface-inset)", border: "1px solid var(--stroke-subtle)", borderRadius: "var(--radius-sm)", color: "var(--text)" }}>
                    🌐 {lang}
                  </span>
                ))}
              </div>
            ) : null}

            {profile.bio ? (
              <p className="sub" style={{ marginTop: 12, padding: "10px 14px", background: "var(--surface-inset)", borderRadius: "var(--radius-sm)", border: "1px solid var(--stroke-subtle)", fontSize: "13px", fontStyle: "italic", lineHeight: 1.5 }}>
                &ldquo;{profile.bio}&rdquo;
              </p>
            ) : null}
            
            {profile.linkedin_url || profile.phone_number ? (
              <div className="glass-inset" style={{ marginTop: 16, padding: 14 }}>
                {profile.linkedin_url ? (
                  <p className="sub" style={{ margin: "4px 0", fontSize: "13px" }}>
                    <span style={{ color: "var(--dim)" }}>LinkedIn:</span>{" "}
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-3)", textDecoration: "underline", fontWeight: 500 }}>
                      {profile.linkedin_url} ↗
                    </a>
                  </p>
                ) : null}
                {profile.phone_number ? (
                  <p className="sub" style={{ margin: "4px 0", fontSize: "13px" }}>
                    <span style={{ color: "var(--dim)" }}>Phone:</span>{" "}
                    <span style={{ color: "var(--text-bright)", fontWeight: 500 }}>📱 {profile.phone_number}</span>
                  </p>
                ) : null}
              </div>
            ) : null}

            {/* Glowing Stats Strip */}
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
                <div className="stat-value" style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 4 }}>
                  <span>{categoryIcon}</span>
                </div>
                <div className="stat-label">{profile.industry_category?.split(" ")[0] || "Category"}</div>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <Link href="/onboarding" className="outline-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "14px", padding: "10px 18px" }}>
                <span>✏️</span> Edit identity
              </Link>
            </div>
          </section>

          {/* Right Column: Vibe Fingerprint Panel */}
          <section className="fingerprint">
            <div style={{ marginBottom: 4 }}>
              <p className="label plain" style={{ margin: 0, fontSize: "18px", color: "var(--text-bright)" }}>
                Vibe fingerprint
              </p>
              <p className="sub" style={{ margin: "4px 0 16px", fontSize: "13px", color: "var(--muted)" }}>
                4-dimensional behavioral chemistry calibration.
              </p>
            </div>

            {vibe ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                {DIMS.map((d) => (
                  <div key={d.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: "1px solid var(--stroke-subtle)" }}>
                    <span style={{ fontSize: "13px", color: "var(--text-bright)", fontWeight: 500 }}>{d.label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--accent-2)", fontWeight: 600 }}>
                      {vibe[d.key]}/5
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="sub">No vibe answers yet.</p>
            )}
          </section>
        </div>

        {/* Project Pitch Section */}
        <section className="glass-panel" style={{ marginTop: 40, padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "28px" }}>🚀</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "20px", color: "var(--text-bright)" }}>Project Pitch</h3>
              <p className="sub" style={{ margin: "4px 0 0", fontSize: "14px" }}>
                Broadcast what you are building to attract synergistic co-founders and collaborators across the protocol.
              </p>
            </div>
          </div>
          <ProjectForm project={project} />
        </section>

        {/* Payment Settings Section */}
        <section className="glass-panel" style={{ marginTop: 40, padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: "28px" }}>💳</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "20px", color: "var(--text-bright)" }}>Payment Settings</h3>
              <p className="sub" style={{ margin: "4px 0 0", fontSize: "14px" }}>
                Add your UPI ID or Payment Link so partners can pay you directly for micro-contracts.
              </p>
            </div>
          </div>
          <PaymentSettings initialLink={profile.payment_link || null} />
        </section>

        {/* Active Partnerships Grid */}
        {partnerProfiles && partnerProfiles.length > 0 ? (
          <section style={{ marginTop: 48 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: "20px", color: "var(--text-bright)", display: "flex", alignItems: "center", gap: 8 }}>
                <span>🤝</span> Active Partnerships ({partnerProfiles.length})
              </h3>
              <Link href="/messages" className="pill-btn" style={{ fontSize: "13px", padding: "6px 14px" }}>
                Open Messages →
              </Link>
            </div>
            <div className="match-grid">
              {partnerProfiles.map((p) => {
                const contact = linkByUserId.get(p.id);
                const partnerIcon = CATEGORY_ICONS[p.industry_category || ""] || "🧑‍💻";
                return (
                  <article key={p.id} className="match-card success" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div className="match-card-top">
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span className="role-tag" style={{ fontSize: "11px", padding: "2px 8px" }}>
                              {partnerIcon} {p.industry_category}
                            </span>
                          </div>
                          <h3 style={{ fontSize: "18px", color: "var(--text-bright)", margin: "4px 0" }}>{p.codename}</h3>
                          <p className="card-skill">{p.professional_title}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "var(--radius-sm)" }}>
                        <p style={{ color: "var(--success)", fontWeight: 700, fontSize: "13px", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} />
                          Partnership active
                        </p>
                        {contact ? (
                          <p className="sub" style={{ marginTop: 6, marginBottom: 0, fontSize: "13px" }}>
                            Contact:{" "}
                            <a
                              href={contact.startsWith("http") ? contact : `https://${contact}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "var(--accent-3)", textDecoration: "underline", fontWeight: 600 }}
                            >
                              {contact} ↗
                            </a>
                          </p>
                        ) : (
                          <p className="sub" style={{ marginTop: 6, marginBottom: 0, fontSize: "13px", color: "var(--dim)" }}>
                            No contact info added
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <Link href="/messages" className="pill-btn" style={{ width: "100%", textAlign: "center", display: "block", fontSize: "13px" }}>
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
          <section style={{ marginTop: 48 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "20px", color: "var(--text-bright)" }}>
              Active work
            </h3>
            <div className="match-grid">
              {acceptedContracts.map((c) => {
                const otherId = c.proposed_by === user.id ? c.proposed_to : c.proposed_by;
                return (
                  <article key={c.id} className="match-card success">
                    <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>
                      {contractPartnerName.get(otherId) ?? "Partner"}
                    </h3>
                    <p className="card-skill">{c.deliverables}</p>
                    <p className="sub" style={{ marginBottom: 14 }}>${c.price_amount} · accepted</p>
                    <Link href={`/workspace/${c.id}`} className="pill-btn accept" style={{ textAlign: "center", display: "block" }}>
                      Open workspace
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Danger Zone */}
        <section className="glass-card" style={{ marginTop: 56, padding: "28px 32px", border: "1px solid rgba(244, 63, 94, 0.25)", background: "rgba(244, 63, 94, 0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <h3 style={{ color: "var(--danger)", margin: "0 0 6px", fontSize: "18px", display: "flex", alignItems: "center", gap: 8 }}>
                <span>⚠️</span> Danger Zone
              </h3>
              <p className="sub" style={{ margin: 0, maxWidth: "560px", fontSize: "14px", lineHeight: 1.5 }}>
                Permanently delete your account, operator identity, project pitches, vibe calibration, and all associated messages. This action is irreversible.
              </p>
            </div>
            <DeleteAccountButton />
          </div>
        </section>
      </main>
    </div>
  );
}

