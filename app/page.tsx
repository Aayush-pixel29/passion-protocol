import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getSessionUser } from "@/lib/data";

export default async function HomePage() {
  const { user } = await getSessionUser();
  const ctaHref = user ? "/discover" : "/login";
  const ctaLabel = user ? "Open Discover" : "Get started";

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
              Passion Protocol is a website for builders, designers, writers, and makers. Role is a
              filter. The score comes from how you like to work — pace, comms, risk, and energy.
            </p>
            <div className="hero-actions">
              <Link href={ctaHref} className="primary-btn inline">
                {ctaLabel}
              </Link>
              {!user ? (
                <Link href="/login" className="text-link">
                  Already have an account? Sign in
                </Link>
              ) : null}
            </div>
          </div>
          <aside className="hero-panel">
            <p className="hero-panel-label">Sample match</p>
            <div className="hero-sample">
              <div>
                <strong>RIYA_DESIGNS</strong>
                <span>Designer looking for a coder</span>
              </div>
              <div className="score-badge">94%</div>
            </div>
            <ul className="hero-list">
              <li>Vibe sliders, not a CV dump</li>
              <li>Connect only when both sides want it</li>
              <li>Built for laptop first — full page, not a phone frame</li>
            </ul>
          </aside>
        </section>

        <section className="feature-grid">
          <article className="feature-card">
            <div className="feature-index one">01</div>
            <h3>Role is just a filter</h3>
            <p>Say who you are and who you need. The pool stays focused so you are not browsing the wrong crowd.</p>
          </article>
          <article className="feature-card">
            <div className="feature-index two">02</div>
            <h3>Vibe is the score</h3>
            <p>Match percentage is computed from four sliders. You see alignment before you send a request.</p>
          </article>
          <article className="feature-card">
            <div className="feature-index three">03</div>
            <h3>Connect when it fits</h3>
            <p>Skip or connect from a grid of people. When both sides are in, you have a partner.</p>
          </article>
        </section>
        <p className="version">Passion Protocol · website</p>
      </main>
    </div>
  );
}
