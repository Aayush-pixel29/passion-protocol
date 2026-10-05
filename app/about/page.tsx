import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSessionUser } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Passion Protocol — Built for Authentic Co-Founder Matches",
  description: "Learn why Passion Protocol was created to fix startup founder friction with transparent work compatibility.",
  openGraph: {
    title: "About Passion Protocol",
    description: "Learn why Passion Protocol was created to fix startup founder friction with transparent work compatibility.",
  },
};

export default async function AboutPage() {
  const { user } = await getSessionUser();

  return (
    <div className="site">
      <SiteHeader current="about" signedIn={Boolean(user)} />
      
      <main className="wrap-narrow" style={{ padding: "48px 24px 80px" }}>
        <p className="kicker">About Passion Protocol</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", marginBottom: 24, lineHeight: 1.2 }}>
          Matching Founders on Real Work Chemistry, Not Resumes.
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: 24, background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-lg)", marginBottom: 36 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--accent-subtle)", border: "2px solid var(--accent-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700, fontSize: "1.5rem", color: "var(--accent)" }}>
            AS
          </div>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 18 }}>Aayush Shelar</h3>
            <p className="sub" style={{ margin: "0 0 8px", fontSize: 14 }}>Founder &amp; Solo Architect</p>
            <a 
              href="https://www.linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              Connect on LinkedIn &rarr;
            </a>
          </div>
        </div>

        <section style={{ display: "flex", flexDirection: "column", gap: 24, fontSize: 16, lineHeight: 1.7, color: "var(--text)" }}>
          <h2 style={{ fontSize: 22, marginTop: 12 }}>The Story Behind Passion Protocol</h2>
          <p>
            Every year, thousands of promising startups and creative side-projects fail not because their idea lacked merit, but because the co-founders could not work together. Traditional networking platforms evaluate candidates on corporate resumes, degrees, and job titles. Yet when building an early-stage project, what truly matters is daily operational alignment:
          </p>

          <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <li><strong>Pace:</strong> Are you shipping daily prototypes or deliberating for weeks?</li>
            <li><strong>Communication:</strong> Do you prefer asynchronous daily standups or synchronous brainstorm calls?</li>
            <li><strong>Risk Tolerance:</strong> Are you bootstrapping on nights/weekends or going all-in with high venture risk?</li>
            <li><strong>Energy Dynamics:</strong> Is your working energy analytical and structured, or spontaneous and creative?</li>
          </ul>

          <h2 style={{ fontSize: 22, marginTop: 16 }}>Our Principles</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ padding: 20, background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "var(--radius)" }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 15 }}>1. Zero Cold DM Spam</h4>
              <p className="sub" style={{ margin: 0, fontSize: 14 }}>
                Reciprocal filtering ensures you only discover and communicate with collaborators who are actively looking for your exact discipline.
              </p>
            </div>
            <div style={{ padding: 20, background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "var(--radius)" }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 15 }}>2. Open Mathematical Formula</h4>
              <p className="sub" style={{ margin: 0, fontSize: 14 }}>
                No mysterious algorithmic black boxes. Every synergy score is computed via a transparent 4-dimensional Manhattan distance formula.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 32, padding: 24, background: "var(--accent-subtle)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-md)" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "var(--accent)" }}>Ready to find a partner?</h3>
            <p className="sub" style={{ margin: "0 0 16px", color: "var(--text)" }}>
              Create your profile in 2 minutes and calibrate your 4 work dimensions.
            </p>
            <Link href={user ? "/discover" : "/login?tab=signup"} className="primary-btn">
              {user ? "Go to Discover Deck" : "Get Started Now"} &rarr;
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
