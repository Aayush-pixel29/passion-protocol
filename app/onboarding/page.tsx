import { OnboardingForm } from "@/components/OnboardingForm";
import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const { user, profile } = await getOwnProfile();
  if (!user) redirect("/login");

  return (
    <div className="site">
      <SiteHeader current="none" signedIn />
      <main className="wrap">
        <div className="page-intro">
          <p className="kicker">Set up your profile</p>
          <h2>Tell us how you work</h2>
          <p className="sub">
            Identity on the left, vibe sliders on the right. Role is a filter. Vibe is the score.
          </p>
        </div>
        <div className="panel">
          <OnboardingForm
            defaultCodename={profile?.codename ?? ""}
            defaultRole={profile?.role}
            defaultLookingFor={profile?.looking_for}
            defaultBio={profile?.bio}
            defaultContactUrl={profile?.contact_url}
          />
        </div>
      </main>
    </div>
  );
}
