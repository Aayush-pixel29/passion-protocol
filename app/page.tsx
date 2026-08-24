import Link from "next/link";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { LandingSimulator } from "@/components/features/landing/LandingSimulator";
import { LandingFaq } from "@/components/features/landing/LandingFaq";
import { SneakPeekMarquee } from "@/components/features/landing/SneakPeekMarquee";
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
            <div style={{ background: 'var(--brand-tint)', color: 'var(--brand)', borderRadius: 'var(--radius-pill)', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', marginBottom: '24px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand)' }}></span>
              Now in Early Access · Zero-Spam Co-Founder Network
            </div>

            <p className="kicker">Match on energy, not a resume</p>

            <h1 className="hero-headline">
              Stop Building in Isolation.
              <br />
              <span style={{ background: "linear-gradient(to right, var(--brand), var(--brand-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Find Your Co-Founder Match.</span>
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
              <div className={styles.heroStatCard}>
                <span className={styles.heroStatValue}>4D</span>
                <span className={styles.heroStatLabel}>Vibe dimensions</span>
              </div>
              <div className={styles.heroStatCard}>
                <span className={styles.heroStatValue}>100%</span>
                <span className={styles.heroStatLabel}>Reciprocal matching</span>
              </div>
              <div className={styles.heroStatCard}>
                <span className={styles.heroStatValue}>&lt;2min</span>
                <span className={styles.heroStatLabel}>Onboarding time</span>
              </div>
              <div className={styles.heroStatCard}>
                <span className={styles.heroStatValue}>Free</span>
                <span className={styles.heroStatLabel}>During early access</span>
              </div>
            </div>
          </div>

          <LandingSimulator />
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
            {COMPARISONS.map((row, i) => {
              const tints = ['var(--brand-tint)', 'var(--accent-amber-tint)', 'var(--accent-emerald-tint)'];
              return (
                <div className={styles.compareRow} key={row.old} style={{ background: tints[i % tints.length] }}>
                  <div className={styles.compareCard}>
                    <span className={styles.compareOld}>{row.old}</span>
                  </div>
                  <div className={styles.compareArrowBox}>
                    <span className={styles.compareArrow}>→</span>
                  </div>
                  <div className={styles.compareCard}>
                    <span className={styles.compareNew}>{row.next}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* HOW IT WORKS — a real 3-step sequence, numbering earns its place here */}
        <section className={styles.stepsSection} id="how-it-works">
          <div className="section-header text-center">
            <p className="kicker" style={{ border: 'none', background: 'var(--brand-tint)', color: 'var(--brand)', boxShadow: 'none' }}>Three Steps</p>
            <h2 className="section-title">From Vibe Calibration to First Message</h2>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.stepLine}></div>
            <article className={styles.stepCard}>
              <div className={styles.stepBadge}>01</div>
              <h3>Calibrate Your Vibe &amp; Role</h3>
              <p>Define your discipline and target partner role. Tune your 4 work dimensions in under 2 minutes.</p>
            </article>

            <article className={styles.stepCard}>
              <div className={styles.stepBadge} style={{ background: 'linear-gradient(135deg, var(--accent-amber), #d97706)' }}>02</div>
              <h3>Browse Discover Deck</h3>
              <p>See candidates ranked by synergy score. Only complementary, reciprocal roles show up — no scrolling through mismatches.</p>
            </article>

            <article className={styles.stepCard}>
              <div className={styles.stepBadge} style={{ background: 'linear-gradient(135deg, var(--accent-emerald), #059669)' }}>03</div>
              <h3>Connect &amp; Lock Terms</h3>
              <p>Mutual interest unlocks real-time chat and a milestone contract builder — scope, deliverables, and revenue split, in writing.</p>
            </article>
          </div>
        </section>

        {/* HONEST NOTE — one real statement, not three invented case studies */}
        <section id="about" style={{ padding: '64px 0' }}>
          <div className={styles.testimonialCard}>
            <div style={{ color: 'var(--brand)', fontSize: '32px', marginBottom: '16px' }}>&ldquo;</div>
            <p className={styles.buildNoteQuote}>
              I built Passion Protocol solo because I kept getting ghosted after finding
              people who looked perfect on paper. It&apos;s early — the matching math is real and
              live, the user base is small and growing. Try it, and tell me what&apos;s broken.
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>A</div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>Aayush</div>
                <div style={{ fontSize: '14px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: 'var(--accent-emerald)' }}>✓</span> Builder, ships in public
                </div>
              </div>
            </div>
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
        <section className={styles.ctaGradient}>
          <h2 className="section-title" style={{ color: 'white', marginBottom: '16px' }}>Ready to find your match?</h2>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.9)', margin: "0 auto 32px" }}>
            Free during early access. Two minutes to set up.
          </p>
          <Link href={ctaHref} className="primary-btn lg" style={{ background: 'white', color: 'var(--brand)', padding: '14px 32px' }}>
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
