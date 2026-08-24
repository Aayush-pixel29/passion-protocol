import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SynergyProof } from "@/components/SynergyProof";
import { LandingFaq } from "@/components/LandingFaq";
import { SneakPeekMarquee } from "@/components/SneakPeekMarquee";
import { getSessionUser, loadSneakPeekProfiles } from "@/lib/data";
import styles from "./page.module.css";

const COMPARISONS = [
  { old: "Resume dumps and job titles", next: "4 sliders: Pace, Comms, Risk, Energy" },
  { old: "Cold DMs into the void", next: "Reciprocal matching — you only see people who want you back" },
  { old: "Handshake deals, no paper trail", next: "In-app milestone contracts with a locked revenue split" },
];

export default async function HomePage() {
  const { user } = await getSessionUser();
  const sneakProfiles = await loadSneakPeekProfiles();
  const ctaHref = user ? "/discover" : "/login";
  const ctaLabel = user ? "Explore Discover Deck" : "Find Your Partner";

  return (
    <div className="site">
      <SiteHeader current="none" signedIn={Boolean(user)} />

      <main className="wrap" style={{ minHeight: '100vh' }}>
        {/* HERO — the pitch, paired with the actual mechanism, not a mockup of it */}
        <section className={styles.hero}>
          <div>
            <div className="hero-badge-pill match-card">
              
              <span>Now in Early Access · Zero-Spam Co-Founder Network</span>
            </div>

            <p className="kicker">Match on energy, not a resume</p>

            <h1 className="hero-headline">
              Stop Building in Isolation.
              <br />
              <span >Find Your Co-Founder Match.</span>
            </h1>

            <p className="lede">
              Passion Protocol connects builders, designers, writers, and makers. Your role is the
              filter; your vibe is the match — computed with a formula you can check yourself, not a
              black-box recommendation engine.
            </p>

            <div className="hero-actions">
              <Link href={ctaHref} className="primary-btn inline">
                {ctaLabel} →
              </Link>
              <Link href="/login" className="outline-btn inline" style={{ fontWeight: 600 }}>
                See how scoring works ↓
              </Link>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>4D</span>
                <span className={styles.heroStatLabel}>Vibe dimensions</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>100%</span>
                <span className={styles.heroStatLabel}>Reciprocal matching</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>&lt;2min</span>
                <span className={styles.heroStatLabel}>Onboarding time</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>Free</span>
                <span className={styles.heroStatLabel}>During early access</span>
              </div>
            </div>
          </div>

          <SynergyProof />
        </section>

        {/* Real registered builders — this component hides itself if the pool is empty */}
        <SneakPeekMarquee profiles={sneakProfiles} />

        {/* WHAT'S DIFFERENT — three real contrasts, not a five-card feature grid */}
        <section className={styles.compareSection} id="how-its-different">
          <div className="section-header text-center">
            <p className="kicker">What&apos;s Actually Different</p>
            <h2 className="section-title">Chemistry Before Commitment</h2>
          </div>
          <div className={styles.compareGrid}>
            {COMPARISONS.map((row) => (
              <div className={styles.compareRow} key={row.old}>
                <span className={styles.compareOld}>{row.old}</span>
                <span className={styles.compareArrow}>→</span>
                <span className={styles.compareNew}>{row.next}</span>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS — a real 3-step sequence, numbering earns its place here */}
        <section className="how-it-works-section" id="how-it-works">
          <div className="section-header text-center">
            <p className="kicker">Three Steps</p>
            <h2 className="section-title">From Vibe Calibration to First Message</h2>
          </div>
          <div className="how-it-works-grid">
            <article className="step-card match-card">
              <div className="step-badge">01</div>
              <h3>Calibrate Your Vibe &amp; Role</h3>
              <p>
                Define your discipline and target partner role. Tune your 4 work dimensions in
                under 2 minutes.
              </p>
            </article>

            <article className="step-card match-card">
              <div className="step-badge">02</div>
              <h3>Browse Discover Deck</h3>
              <p>
                See candidates ranked by synergy score. Only complementary, reciprocal roles show
                up — no scrolling through mismatches.
              </p>
            </article>

            <article className="step-card match-card">
              <div className="step-badge">03</div>
              <h3>Connect &amp; Lock Terms</h3>
              <p>
                Mutual interest unlocks real-time chat and a milestone contract builder — scope,
                deliverables, and revenue split, in writing.
              </p>
            </article>
          </div>
        </section>

        {/* HONEST NOTE — one real statement, not three invented case studies */}
        <section id="about">
          <div className={`${styles.buildNote} match-card`}>
            <p className={styles.buildNoteQuote}>
              &ldquo;I built Passion Protocol solo because I kept getting ghosted after finding
              people who looked perfect on paper. It&apos;s early — the matching math is real and
              live, the user base is small and growing. Try it, and tell me what&apos;s broken.&rdquo;
            </p>
            <p className={styles.buildNoteAttribution}>— Aayush, builder</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section" id="faq">
          <div className="section-header text-center">
            <p className="kicker">Frequently Asked Questions</p>
            <h2 className="section-title">Everything You Need to Know</h2>
          </div>
          <LandingFaq />
        </section>

        {/* CTA — one ask */}
        <section className={styles.ctaSimple}>
          <h2 className="section-title">Ready to find your match?</h2>
          <p className="section-subtitle" style={{ margin: "12px auto 28px" }}>
            Free during early access. Two minutes to set up.
          </p>
          <Link href={ctaHref} className="primary-btn lg">
            {ctaLabel} →
          </Link>
        </section>

        <footer className={styles.footerSimple}>
          <span className="footer-tagline" style={{ margin: 0 }}>
            ⚡ Passion Protocol — vibe-based co-founder matching.
          </span>
          <ul className={styles.footerLinks}>
            <li><Link href="/discover">Discover</Link></li>
            <li><Link href="/messages">Messages</Link></li>
            <li><Link href="#faq">FAQ</Link></li>
          </ul>
        </footer>
      </main>
    </div>
  );
}
