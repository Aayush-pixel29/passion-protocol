import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSessionUser } from "@/lib/data";

export const metadata: Metadata = {
  title: "Refund Policy — Passion Protocol",
  description: "Refund and cancellation policy for Passion Protocol subscription and digital legal packs.",
};

export default async function RefundsPage() {
  const { user } = await getSessionUser();

  return (
    <div className="site">
      <SiteHeader current="none" signedIn={Boolean(user)} />

      <main className="wrap-narrow" style={{ padding: "48px 24px 80px" }}>
        <p className="kicker">Billing &amp; Purchases</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", marginBottom: 12 }}>
          Refund &amp; Cancellation Policy
        </h1>
        <p className="sub" style={{ fontSize: 14, marginBottom: 36 }}>
          Last Updated: September 2026
        </p>

        <article style={{ display: "flex", flexDirection: "column", gap: 24, fontSize: 15, lineHeight: 1.7, color: "var(--text)" }}>
          <section>
            <h2 style={{ fontSize: 18, marginBottom: 8, color: "var(--text-bright)" }}>1. Free Tier</h2>
            <p>
              Passion Protocol offers a fully functional Free tier for creators to calibrate their vibe, discover potential partners, and connect. No credit card is required to use the free service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, marginBottom: 8, color: "var(--text-bright)" }}>2. Pro Creator Subscriptions</h2>
            <p>
              When paid plans go live, Pro Creator subscriptions ($15/month) may be cancelled at any time from your account settings. Upon cancellation, you will retain Pro access through the end of your current billing cycle, with no future charges.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, marginBottom: 8, color: "var(--text-bright)" }}>3. Digital Legal &amp; Split Packs</h2>
            <p>
              Digital legal packs ($49 one-time) include instant template generation and digital signing tools. If you experience technical defects preventing the generation or export of your agreement, please contact <a href="mailto:support@passionprotocol.com" style={{ color: "var(--accent)" }}>support@passionprotocol.com</a> within 14 days of purchase for a prompt full refund.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
