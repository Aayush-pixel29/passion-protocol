import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSessionUser } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy — Passion Protocol",
  description: "Learn how Passion Protocol handles, processes, and protects your data.",
};

export default async function PrivacyPage() {
  const { user } = await getSessionUser();

  return (
    <div className="site">
      <SiteHeader current="none" signedIn={Boolean(user)} />

      <main className="wrap-narrow" style={{ padding: "48px 24px 80px" }}>
        <p className="kicker">Privacy</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", marginBottom: 12 }}>
          Privacy Policy
        </h1>
        <p className="sub" style={{ fontSize: 14, marginBottom: 36 }}>
          Last Updated: September 2026
        </p>

        <article style={{ display: "flex", flexDirection: "column", gap: 24, fontSize: 15, lineHeight: 1.7, color: "var(--text)" }}>
          <section>
            <h2 style={{ fontSize: 18, marginBottom: 8, color: "var(--text-bright)" }}>1. Our Commitment to Data Privacy</h2>
            <p>
              At Passion Protocol, we believe your personal data belongs to you. We do not sell your personal information, train public AI models on private chat messages, or display your direct contact links (LinkedIn, phone, email) without mutual connection confirmation.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, marginBottom: 8, color: "var(--text-bright)" }}>2. Information We Collect</h2>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Account Information:</strong> Email address, encrypted authentication tokens.</li>
              <li><strong>Operator Dossier:</strong> Discipline category, professional title, location, languages, bio.</li>
              <li><strong>Work Vibe Preferences:</strong> Calibration values (1–5) for Pace, Communication, Risk, and Energy used exclusively to calculate synergy scores.</li>
              <li><strong>Project Pitch:</strong> Headlines and descriptions you publicly submit to find collaborators.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 18, marginBottom: 8, color: "var(--text-bright)" }}>3. How We Use Your Data</h2>
            <p>
              Your data is strictly used to:
            </p>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Compute 4D Manhattan distance synergy scores with potential co-founders.</li>
              <li>Enforce reciprocal role and intent matching.</li>
              <li>Deliver real-time chat messages between mutually accepted partners.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 18, marginBottom: 8, color: "var(--text-bright)" }}>4. Data Export &amp; Right to Be Forgotten</h2>
            <p>
              You have full rights under GDPR and CCPA to export all data stored on your account in standard JSON format, or request instant permanent erasure by clicking &ldquo;Delete Account&rdquo; in your Profile Settings.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
