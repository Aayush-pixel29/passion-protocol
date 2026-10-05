import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSessionUser } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact & Support — Passion Protocol",
  description: "Get in touch with the Passion Protocol team for inquiries, partnership, or technical support.",
  openGraph: {
    title: "Contact Passion Protocol",
    description: "Support and contact details for Passion Protocol.",
  },
};

export default async function ContactPage() {
  const { user } = await getSessionUser();

  return (
    <div className="site">
      <SiteHeader current="none" signedIn={Boolean(user)} />

      <main className="wrap-narrow" style={{ padding: "48px 24px 80px" }}>
        <p className="kicker">Get in Touch</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", marginBottom: 12 }}>
          Contact &amp; Support
        </h1>
        <p className="sub" style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 36 }}>
          Have a question, feedback on scoring, or need technical assistance? We read and respond to every message.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-lg)", padding: 32 }}>
            <h3 style={{ fontSize: 18, marginTop: 0, marginBottom: 8 }}>Email Support</h3>
            <p className="sub" style={{ fontSize: 14, marginBottom: 16 }}>
              For general inquiries, account assistance, or data privacy requests:
            </p>
            <a 
              href="mailto:support@passionprotocol.com" 
              className="primary-btn"
              style={{ display: "inline-flex" }}
            >
              support@passionprotocol.com
            </a>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-lg)", padding: 32 }}>
            <h3 style={{ fontSize: 18, marginTop: 0, marginBottom: 8 }}>Founder Direct</h3>
            <p className="sub" style={{ fontSize: 14, marginBottom: 16 }}>
              Connect directly with our founder on LinkedIn for partnerships, product suggestions, or press inquiries:
            </p>
            <a 
              href="https://www.linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="outline-btn"
              style={{ display: "inline-flex" }}
            >
              Connect on LinkedIn &rarr;
            </a>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
