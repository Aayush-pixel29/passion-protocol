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
      <main className="wrap narrow">
        <div className="page-intro">
          <p className="kicker">Onboarding</p>
          <h2>Who are you?</h2>
        </div>
        <OnboardingForm profile={profile} />
      </main>
    </div>
  );
}
