import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getSessionUser } from "@/lib/data";

export default async function HomePage() {
  const { user } = await getSessionUser();
  const ctaHref = user ? "/discover" : "/login";
  const ctaLabel = user ? "Explore Discover Deck" : "Find Your Partner";

  return (
    <div className="site">
      <SiteHeader current="none" signedIn={Boolean(user)} />
      <main className="wrap">
        <section className="hero-split">
          <div>
            <p className="kicker">Match on energy, not a resume</p>
            <h1>
              Find a partner
              <br />
              who <span className="accent">actually clicks</span>
            </h1>
            <p className="lede">
              Passion Protocol connects builders, designers, writers, and makers. Your role is the filter;
              your vibe is the match. Discover collaborators who share your pace, comms style, and risk tolerance.
            </p>
            <div className="hero-actions">
              <Link href={ctaHref} className="primary-btn inline">
                {ctaLabel} →
              </Link>
              {!user ? (
                <Link href="/login" className="text-link" style={{ fontWeight: 600 }}>
                  Already have an account? Sign in
                </Link>
              ) : null}
            </div>
          </div>
          <aside className="hero-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p className="hero-panel-label" style={{ margin: 0 }}>Sample match</p>
              <span style={{ fontSize: "0.75rem", background: "#f0fdf4", color: "#16a34a", padding: "4px 8px", borderRadius: 6, fontWeight: 700 }}>
                ● Real-time Match
              </span>
            </div>
            <div className="hero-sample">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff3d6e, #7c3aed)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                  }}
                >
                  R
                </div>
                <div>
                  <strong>RIYA_DESIGNS 🎨</strong>
                  <span>Designer looking for a Coder 💻</span>
                </div>
              </div>
              <div className="score-badge">94%</div>
            </div>
            <ul className="hero-list">
              <li>⚡ Vibe sliders instead of CV dumps</li>
              <li>🔒 Private contact reveal on mutual connect</li>
              <li>📱 Seamless on mobile &amp; desktop</li>
            </ul>
          </aside>
        </section>

        <section className="feature-grid">
          <article className="feature-card">
            <div className="feature-index one">01</div>
            <h3>Role is just a filter</h3>
            <p>Define who you are and what skill you need. The discovery pool stays targeted so you only meet complementary operators.</p>
          </article>
          <article className="feature-card">
            <div className="feature-index two">02</div>
            <h3>Vibe is the score</h3>
            <p>Match percentages are computed deterministically from 4 key work dimensions: Pace, Comms, Risk, and Energy.</p>
          </article>
          <article className="feature-card">
            <div className="feature-index three">03</div>
            <h3>Connect when it fits</h3>
            <p>Send a request or pass quietly. When both sides express interest, contact information is instantly unlocked.</p>
          </article>
        </section>
        
        <footer style={{ marginTop: 64, paddingTop: 24, borderTop: "1px solid var(--stroke)", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--dim)", fontSize: "0.85rem" }}>
          <p>Passion Protocol · Vibe-based Co-founder &amp; Collaborator Matching</p>
          <p>Built for real builders ⚡</p>
        </footer>
      </main>
    </div>
  );
}
