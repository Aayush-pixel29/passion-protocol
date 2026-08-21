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
      <main className="wrap narrow" style={{ maxWidth: 760 }}>
        <div className="page-intro" style={{ textAlign: "center", marginBottom: 36 }}>
          <div className="badge-pill" style={{ margin: "0 auto 12px" }}>
            <span style={{ color: "#ff3d6e" }}>⚡</span>
            <span>INITIALIZE IDENTITY</span>
          </div>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 44px)", margin: "8px 0 12px" }}>Who are you?</h2>
          <p className="sub" style={{ maxWidth: 540, margin: "0 auto" }}>
            Calibrate your builder persona, discipline, complementary search criteria, and 4D operating rhythm.
          </p>
        </div>
        <OnboardingForm profile={profile} />
      </main>
    </div>
  );
}

