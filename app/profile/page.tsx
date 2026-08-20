import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile } from "@/lib/data";
import { formatRole } from "@/lib/types";
import { redirect } from "next/navigation";

const DIMS: Array<{ key: "pace" | "comms" | "risk" | "energy"; label: string }> = [
  { key: "pace", label: "Pace" },
  { key: "comms", label: "Comms" },
  { key: "risk", label: "Risk" },
  { key: "energy", label: "Energy" },
];

export default async function ProfilePage() {
  const { user, profile, vibe, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete) redirect("/onboarding");

  const { count: pendingCount } = await supabase
    .from("connect_requests")
    .select("*", { count: "exact", head: true })
    .eq("to_id", user.id)
    .eq("status", "pending");

  const { count: acceptedCount } = await supabase
    .from("connect_requests")
    .select("*", { count: "exact", head: true })
    .or(`from_id.eq.${user.id},to_id.eq.${user.id}`)
    .eq("status", "accepted");

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
              {formatRole(profile.role)} · looking for {formatRole(profile.looking_for)}
            </p>
            {profile.bio ? <p className="sub">{profile.bio}</p> : null}
            <div className="stats">
              <div>
                <div className="stat-value">{acceptedCount ?? 0}</div>
                <div className="stat-label">Partners</div>
              </div>
              <div>
                <div className="stat-value">{pendingCount ?? 0}</div>
                <div className="stat-label">Inbound</div>
              </div>
              <div>
                <div className="stat-value">{formatRole(profile.role)}</div>
                <div className="stat-label">Role</div>
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
      </main>
    </div>
  );
}
