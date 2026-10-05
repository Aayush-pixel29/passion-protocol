import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSessionUser } from "@/lib/data";
import ChangeablePricingSection, { defaultPassionPlans } from "@/components/ChangeablePricingSection";

export const metadata: Metadata = {
  title: "Pricing & Plans — Transparent Founder Economics",
  description: "Simple, transparent pricing for startup creators, co-founder teams, and builders.",
  openGraph: {
    title: "Passion Protocol Pricing",
    description: "Simple, transparent pricing for startup creators, co-founder teams, and builders.",
  },
};

export default async function PricingPage() {
  const { user } = await getSessionUser();

  return (
    <div className="site">
      <SiteHeader current="pricing" signedIn={Boolean(user)} />

      <main className="wrap" style={{ padding: "48px 24px 80px" }}>
        <ChangeablePricingSection
          plans={defaultPassionPlans}
          defaultPlanId="pro"
          defaultCycle="monthly"
        />
      </main>

      <SiteFooter />
    </div>
  );
}
