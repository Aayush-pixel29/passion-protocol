import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSessionUser } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms of Service — Passion Protocol",
  description: "Terms of Service governing the use of Passion Protocol.",
};

export default async function TermsPage() {
  const { user } = await getSessionUser();

  return (
    <div className="site">
      <SiteHeader current="none" signedIn={Boolean(user)} />

      <main className="wrap-narrow" style={{ padding: "48px 24px 80px" }}>
        <p className="kicker">Legal</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", marginBottom: 12 }}>
          Terms of Service
        </h1>
        <p className="sub" style={{ fontSize: 14, marginBottom: 36 }}>
          Last Updated: September 2026
        </p>

        <article style={{ display: "flex", flexDirection: "column", gap: 24, fontSize: 15, lineHeight: 1.7, color: "var(--text)" }}>
          <section>
            <h2 style={{ fontSize: 18, marginBottom: 8, color: "var(--text-bright)" }}>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Passion Protocol (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not access or use the platform.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, marginBottom: 8, color: "var(--text-bright)" }}>2. Eligibility &amp; Age Requirement</h2>
            <p>
              You must be at least 18 years of age to register for an account and use the services provided by Passion Protocol. By creating an account, you affirm and warrant that you are 18 years of age or older.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, marginBottom: 8, color: "var(--text-bright)" }}>3. Account Conduct &amp; Zero-Spam Policy</h2>
            <p>
              You agree to provide accurate, truthful information in your operator dossier and project pitch. Any use of automated scraping bots, unsolicited mass outreach, abusive behavior, or misrepresentation of credentials will result in immediate permanent account termination.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, marginBottom: 8, color: "var(--text-bright)" }}>4. In-App Agreements &amp; Liability</h2>
            <p>
              Passion Protocol provides digital contract templates and compatibility scoring for informational and collaboration convenience. Passion Protocol is not a legal firm, broker, or financial advisor. Users are encouraged to consult independent legal counsel for formal corporate incorporation.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, marginBottom: 8, color: "var(--text-bright)" }}>5. Termination &amp; Data Erasure</h2>
            <p>
              You may terminate your account at any time via the Settings menu on your Profile page. Upon deletion, your dossier, pitch, and messages will be permanently removed from active tables in accordance with our Privacy Policy.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
