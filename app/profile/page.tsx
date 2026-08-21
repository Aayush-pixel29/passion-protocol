import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile } from "@/lib/data";
// formatRole removed
import { redirect } from "next/navigation";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { ProjectForm } from "@/components/ProjectForm";

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

  return (
    <div className="site">
      <SiteHeader current="profile" signedIn />
      <main className="wrap">
        <div className="page-intro">
          <p className="kicker">Your profile</p>
          <h2>{profile.codename}</h2>
        </div>
        <div className="profile-grid">
          <section className="identity">
            <p className="rank">
              {profile.professional_title} · looking for {profile.looking_for_title}
            </p>
            {profile.full_name ? <p className="sub">Name: {profile.full_name}</p> : null}
            {profile.location ? <p className="sub">Location: {profile.location}</p> : null}
            {profile.spoken_languages?.length ? <p className="sub">Languages: {profile.spoken_languages.join(", ")}</p> : null}
            
            {profile.linkedin_url || profile.phone_number ? (
              <div style={{ marginTop: 12, padding: 12, background: "#f8fafc", borderRadius: 8 }}>
                {profile.linkedin_url ? <p className="sub">LinkedIn: <a href={profile.linkedin_url} target="_blank">{profile.linkedin_url}</a></p> : null}
                {profile.phone_number ? <p className="sub">Phone: {profile.phone_number}</p> : null}
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
                <div className="stat-value" style={{ fontSize: "1rem" }}>{profile.industry_category}</div>
                <div className="stat-label">Category</div>
              </div>
            </div>
            <p style={{ marginTop: 20 }}>
              <Link href="/onboarding">Edit identity</Link>
            </p>
          </section>
          <section className="fingerprint">
            <p className="label plain">Vibe fingerprint</p>
            {vibe ? (
              DIMS.map((d) => (
                <div key={d.key}>
                  <div className="slider-meta">
                    <span>{d.label}</span>
                    <span>{vibe[d.key]} / 5</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(vibe[d.key] / 5) * 100}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="sub">No vibe answers yet.</p>
            )}
          </section>
        </div>

        <div style={{ marginTop: 40, padding: 24, border: "1px solid #eaeaea", borderRadius: 12 }}>
          <h3>Project Pitch</h3>
          <p className="sub" style={{ marginBottom: 24 }}>
            Describe what you are building to help potential partners decide if they want to collaborate.
          </p>
          <ProjectForm project={project} />
        </div>

        {partnerProfiles && partnerProfiles.length > 0 ? (
          <div style={{ marginTop: 40 }}>
            <h3>Active Partnerships ({partnerProfiles.length})</h3>
            <div className="match-grid" style={{ marginTop: 16 }}>
              {partnerProfiles.map((p) => {
                const contact = linkByUserId.get(p.id);
                return (
                  <article key={p.id} className="match-card success">
                    <div className="match-card-top">
                      <div>
                        <h3>{p.codename}</h3>
                        <p className="card-skill">{p.professional_title}</p>
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <p className="status-line" style={{ color: "#10b981", fontWeight: 600 }}>
                        Partnership active
                      </p>
                      {contact ? (
                        <p className="sub" style={{ marginTop: 4 }}>
                          Contact:{" "}
                          <a
                            href={contact.startsWith("http") ? contact : `https://${contact}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#3b82f6", textDecoration: "underline" }}
                          >
                            {contact}
                          </a>
                        </p>
                      ) : (
                        <p className="sub" style={{ marginTop: 4 }}>No contact info added</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: 60, borderTop: "1px solid #eaeaea", paddingTop: 40 }}>
          <h3 style={{ color: "#ef4444" }}>Danger Zone</h3>
          <p className="sub" style={{ marginTop: 8, marginBottom: 16 }}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <DeleteAccountButton />
        </div>
      </main>
    </div>
  );
}
