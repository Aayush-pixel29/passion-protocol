import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSessionUser } from "@/lib/data";

export const metadata: Metadata = {
  title: "How Scoring Works — Transparent 4D Vibe Formula",
  description: "Learn how Passion Protocol computes co-founder compatibility scores using a transparent 4-dimensional Manhattan distance formula.",
  openGraph: {
    title: "How Scoring Works — Passion Protocol",
    description: "Transparent mathematical formula behind co-founder compatibility matching.",
  },
};

export default async function HowScoringWorksPage() {
  const { user } = await getSessionUser();

  return (
    <div className="site">
      <SiteHeader current="scoring" signedIn={Boolean(user)} />

      <main className="wrap-narrow" style={{ padding: "48px 24px 80px" }}>
        <p className="kicker">Algorithmic Transparency</p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", marginBottom: 16 }}>
          How Compatibility Scoring Works
        </h1>
        <p className="sub" style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 36 }}>
          We don’t use black-box AI recommendation engines to decide who you should build with. Every match is calculated with an open, predictable mathematical formula based on 4 working dimensions.
        </p>

        {/* The 4 Dimensions */}
        <section style={{ background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-lg)", padding: 28, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginTop: 0, marginBottom: 16 }}>The 4 Core Work Dimensions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ padding: 16, background: "var(--surface-inset)", borderRadius: "var(--radius)" }}>
              <strong>1. Pace (1–5)</strong>
              <p className="sub" style={{ margin: "4px 0 0", fontSize: 13 }}>
                1 = Deliberate, methodical execution<br />
                5 = Rapid prototyping, daily ship cycles
              </p>
            </div>
            <div style={{ padding: 16, background: "var(--surface-inset)", borderRadius: "var(--radius)" }}>
              <strong>2. Communication (1–5)</strong>
              <p className="sub" style={{ margin: "4px 0 0", fontSize: 13 }}>
                1 = Deep asynchronous written updates<br />
                5 = Synchronous daily video huddles
              </p>
            </div>
            <div style={{ padding: 16, background: "var(--surface-inset)", borderRadius: "var(--radius)" }}>
              <strong>3. Risk Tolerance (1–5)</strong>
              <p className="sub" style={{ margin: "4px 0 0", fontSize: 13 }}>
                1 = Part-time nights/weekends bootstrapping<br />
                5 = Full-time, venture-scale risk
              </p>
            </div>
            <div style={{ padding: 16, background: "var(--surface-inset)", borderRadius: "var(--radius)" }}>
              <strong>4. Energy Style (1–5)</strong>
              <p className="sub" style={{ margin: "4px 0 0", fontSize: 13 }}>
                1 = Structured, analytical, systems-focused<br />
                5 = Intuitive, spontaneous, creative-driven
              </p>
            </div>
          </div>
        </section>

        {/* The Formula */}
        <section style={{ background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-lg)", padding: 28, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginTop: 0, marginBottom: 12 }}>The Manhattan Distance Formula</h2>
          <p className="sub" style={{ fontSize: 14, marginBottom: 20 }}>
            The base synergy score is calculated by taking the sum of the absolute differences across all 4 dimensions, divided by the maximum possible variance (16 points):
          </p>

          <div style={{ background: "var(--surface-inset)", padding: 20, borderRadius: "var(--radius)", fontFamily: "var(--font-mono)", fontSize: 14, overflowX: "auto", border: "1px solid var(--stroke)" }}>
            <code>
              Total Distance = |Pace_A - Pace_B| + |Comms_A - Comms_B| + |Risk_A - Risk_B| + |Energy_A - Energy_B|<br /><br />
              Base Score = 100 - ((Total Distance / 16) * 100)
            </code>
          </div>

          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
            <p style={{ margin: 0 }}><strong>Bonus Multipliers:</strong></p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="score-badge" style={{ fontSize: 12 }}>+10%</span>
              <span><strong>Reciprocal Category Match:</strong> You need what they offer AND they need what you offer.</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="score-badge" style={{ fontSize: 12 }}>+5%</span>
              <span><strong>Intent Match:</strong> Both creators are pursuing the same outcome (e.g. Hackathon, VC Startup, Side Project).</span>
            </div>
          </div>
        </section>

        {/* Worked Example */}
        <section style={{ background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-lg)", padding: 28, marginBottom: 36 }}>
          <h2 style={{ fontSize: 20, marginTop: 0, marginBottom: 16 }}>Worked Real-World Example</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ padding: 16, background: "var(--surface-inset)", borderRadius: "var(--radius)" }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 15 }}>Builder A (Coder)</h4>
              <p className="sub" style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                Seeking: Designer<br />
                Pace: <strong>4</strong> | Comms: <strong>3</strong><br />
                Risk: <strong>4</strong> | Energy: <strong>4</strong>
              </p>
            </div>
            <div style={{ padding: 16, background: "var(--surface-inset)", borderRadius: "var(--radius)" }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 15 }}>Builder B (Designer)</h4>
              <p className="sub" style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                Seeking: Coder<br />
                Pace: <strong>5</strong> | Comms: <strong>3</strong><br />
                Risk: <strong>3</strong> | Energy: <strong>4</strong>
              </p>
            </div>
          </div>

          <div style={{ padding: 16, background: "var(--surface-inset)", borderRadius: "var(--radius)", fontSize: 14 }}>
            <p style={{ margin: "0 0 8px" }}><strong>Step-by-Step Calculation:</strong></p>
            <ol style={{ paddingLeft: 20, margin: "0 0 12px", display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-mono)", fontSize: 13 }}>
              <li>Distance = |4 - 5| + |3 - 3| + |4 - 3| + |4 - 4| = 1 + 0 + 1 + 0 = <strong>2 points</strong></li>
              <li>Base Score = 100 - ((2 / 16) * 100) = 100 - 12.5 = <strong>88%</strong></li>
              <li>Reciprocal Bonus (Coder &harr; Designer) = <strong>+10%</strong></li>
            </ol>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--accent-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--accent-border)" }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>98%</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>Final Synergy Score &mdash; Exceptional Work Chemistry</span>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Link href={user ? "/discover" : "/login?tab=signup"} className="primary-btn lg">
            {user ? "Explore Discover Deck" : "Calibrate Your Own Vibe"} &rarr;
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
