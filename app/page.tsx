import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { LandingHeroPreview } from "@/components/LandingHeroPreview";
import { LandingBentoGrid } from "@/components/LandingBentoGrid";
import { LandingSimulator } from "@/components/LandingSimulator";
import { LandingFaq } from "@/components/LandingFaq";
import { SneakPeekMarquee } from "@/components/SneakPeekMarquee";
import { getSessionUser, loadSneakPeekProfiles } from "@/lib/data";

export default async function HomePage() {
  const { user } = await getSessionUser();
  const sneakProfiles = await loadSneakPeekProfiles();
  const ctaHref = user ? "/discover" : "/login";
  const ctaLabel = user ? "Explore Discover Deck" : "Find Your Partner";

  return (
    <div className="site">
      <SiteHeader current="none" signedIn={Boolean(user)} />

      <main className="wrap">
        {/* SECTION 2: HERO SECTION */}
        <section className="hero-split hero-section">
          <div className="hero-content">
            <div className="hero-badge-pill">
              <span className="badge-spark">✨</span>
              <span>Now in Early Access · Zero-Spam Co-Founder Network</span>
            </div>

            <p className="kicker">Match on energy, not a resume</p>

            <h1 className="hero-headline">
              Stop Building in Isolation.
              <br />
              <span className="gradient-text">Find Your Co-Founder Match.</span>
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
                <Link href="/login" className="outline-btn inline" style={{ fontWeight: 600 }}>
                  Explore Live Deck ⚡
                </Link>
              ) : (
                <Link href="/discover" className="outline-btn inline" style={{ fontWeight: 600 }}>
                  Browse Operators ⚡
                </Link>
              )}
            </div>

            <div className="hero-social-proof">
              <div className="avatar-stack">
                <Image
                  src="/images/avatar-alex-coder.png"
                  alt="Alex"
                  width={32}
                  height={32}
                  className="stack-avatar"
                />
                <Image
                  src="/images/avatar-maya-designer.png"
                  alt="Maya"
                  width={32}
                  height={32}
                  className="stack-avatar"
                />
                <Image
                  src="/images/avatar-david-hardware.png"
                  alt="David"
                  width={32}
                  height={32}
                  className="stack-avatar"
                />
                <Image
                  src="/images/avatar-elena-growth.png"
                  alt="Elena"
                  width={32}
                  height={32}
                  className="stack-avatar"
                />
              </div>
              <div className="social-proof-text">
                <span className="rating-stars">★★★★★</span>
                <span className="rating-desc">Built solo, shipped for real builders</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Preview (hero-panel, hero-sample, score-badge 94%, Real-time Match, Sample match: RIYA_DESIGNS 🎨 Designer looking for a Coder 💻, hero-list) */}
          <LandingHeroPreview ctaHref={ctaHref} ctaLabel={ctaLabel} />
        </section>

        {/* SNEAK PEEK MARQUEE — Active Builder Profiles */}
        <SneakPeekMarquee profiles={sneakProfiles} />

        {/* SECTION 3: SOCIAL PROOF & METRICS RIBBON */}
        <section className="metrics-ribbon-section">
          <div className="metrics-ribbon glass-panel">
            <div className="stat-card">
              <div className="stat-value gradient-text">4D</div>
              <div className="stat-label">Vibe Dimensions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value gradient-text">100%</div>
              <div className="stat-label">Reciprocal Matching</div>
            </div>
            <div className="stat-card">
              <div className="stat-value gradient-text">&lt;2min</div>
              <div className="stat-label">Onboarding Time</div>
            </div>
            <div className="stat-card">
              <div className="stat-value gradient-text">Free</div>
              <div className="stat-label">During Early Access</div>
            </div>
          </div>
        </section>

        {/* SECTION 4: BENTO GRID FEATURE SHOWCASE (feature-grid, feature-card, feature-index: 01, 02, 03, 04, 05) */}
        <section className="bento-section" id="features">
          <div className="section-header text-center">
            <p className="kicker">Engineered for Chemistry</p>
            <h2 className="section-title">Built for Real Builders Who Ship</h2>
            <p className="section-subtitle">
              Traditional co-founder search is broken by resume dumps and cold DMs. Passion Protocol pairs you based on deterministic 4D chemistry.
            </p>
          </div>
          <LandingBentoGrid />
        </section>

        {/* SECTION 5: STEP-BY-STEP "HOW IT WORKS" */}
        <section className="how-it-works-section" id="how-it-works">
          <div className="section-header text-center">
            <p className="kicker">Seamless 3-Step Journey</p>
            <h2 className="section-title">From Vibe Calibration to MVP Launch</h2>
            <p className="section-subtitle">
              How ambitious builders go from solo ideation to shipped product in under 30 days.
            </p>
          </div>
          <div className="how-it-works-grid">
            <article className="step-card glass-panel">
              <div className="step-badge">01</div>
              <div className="step-icon-wrap">
                <Image
                  src="/images/role-software-coder.png"
                  alt="Calibrate Vibe"
                  width={64}
                  height={64}
                  className="step-icon-img"
                />
              </div>
              <h3>01. Calibrate Your Vibe &amp; Role</h3>
              <p>
                Define your discipline and target partner role. Tune your 4 key work dimensions: Pace, Comms, Risk, and Energy in under 2 minutes.
              </p>
            </article>

            <article className="step-card glass-panel">
              <div className="step-badge">02</div>
              <div className="step-icon-wrap">
                <Image
                  src="/images/role-creative-designer.png"
                  alt="Browse Discover Deck"
                  width={64}
                  height={64}
                  className="step-icon-img"
                />
              </div>
              <h3>02. Browse Discover Deck</h3>
              <p>
                Explore targeted collaborator discovery with deterministic synergy percentages. Filter by inverted complementary roles and shared languages.
              </p>
            </article>

            <article className="step-card glass-panel">
              <div className="step-badge">03</div>
              <div className="step-icon-wrap">
                <Image
                  src="/images/role-hardware-maker.png"
                  alt="Mutual Connect & Launch"
                  width={64}
                  height={64}
                  className="step-icon-img"
                />
              </div>
              <h3>03. Mutual Connect &amp; Launch</h3>
              <p>
                Send a connect request. When mutual interest matches, private contact information is instantly unlocked alongside milestone contract tools.
              </p>
            </article>
          </div>
        </section>

        {/* SECTION 6: INTERACTIVE MATCHMAKER SIMULATOR */}
        <section className="simulator-section" id="simulator">
          <div className="section-header text-center">
            <p className="kicker">Live Interactive Sandbox</p>
            <h2 className="section-title">Test the Vibe Compatibility Engine</h2>
            <p className="section-subtitle">
              Adjust your work habits and target discipline to see real-time synergy recalculation against diverse builder archetypes.
            </p>
          </div>
          <LandingSimulator isAuthed={Boolean(user)} />
        </section>

        {/* SECTION 7: CO-FOUNDER TESTIMONIALS & CASE STUDIES */}
        <section className="testimonials-section" id="testimonials">
          <div className="section-header text-center">
            <p className="kicker">Verified Founder Stories</p>
            <h2 className="section-title">From First Match to Seed Funding</h2>
            <p className="section-subtitle">
              Real co-founders who met through Passion Protocol and turned working chemistry into real-world venture outcomes.
            </p>
          </div>
          <div className="testimonials-grid">
            <article className="testimonial-card glass-panel">
              <div className="testimonial-header">
                <div className="pair-avatars">
                  <Image
                    src="/images/avatar-alex-coder.png"
                    alt="Alex"
                    width={48}
                    height={48}
                    className="pair-avatar"
                  />
                  <Image
                    src="/images/avatar-maya-designer.png"
                    alt="Maya"
                    width={48}
                    height={48}
                    className="pair-avatar overlap"
                  />
                </div>
                <div className="pair-info">
                  <div className="pair-names">ALEX_AI 💻 &amp; MAYA_UX 🎨</div>
                  <div className="pair-roles">Software &amp; IT ↔ Creative &amp; Design</div>
                </div>
                <div className="score-badge sm">98% Synergy</div>
              </div>
              <p className="testimonial-quote">
                &ldquo;We were both looking for fast-paced async builders. Met on Tuesday, aligned on milestone scopes, and deployed our MVP in 14 days.&rdquo;
              </p>
              <div className="testimonial-footer">
                <span className="outcome-pill">⚡ MVP in 14 Days</span>
                <span className="verified-badge">● Verified Match</span>
              </div>
            </article>

            <article className="testimonial-card glass-panel">
              <div className="testimonial-header">
                <div className="pair-avatars">
                  <Image
                    src="/images/avatar-david-hardware.png"
                    alt="David"
                    width={48}
                    height={48}
                    className="pair-avatar"
                  />
                  <Image
                    src="/images/avatar-elena-growth.png"
                    alt="Elena"
                    width={48}
                    height={48}
                    className="pair-avatar overlap"
                  />
                </div>
                <div className="pair-info">
                  <div className="pair-names">DAVID_ROBOTICS ⚙️ &amp; ELENA_GROWTH 📈</div>
                  <div className="pair-roles">Engineering &amp; Hardware ↔ Business &amp; Sales</div>
                </div>
                <div className="score-badge sm">94% Synergy</div>
              </div>
              <p className="testimonial-quote">
                &ldquo;Finding hardware-friendly business partners is notoriously difficult. Passion Protocol&apos;s vibe matching cut through months of awkward networking events.&rdquo;
              </p>
              <div className="testimonial-footer">
                <span className="outcome-pill">⚙️ Hardware × Business</span>
                <span className="verified-badge">● Early Builder</span>
              </div>
            </article>

            <article className="testimonial-card glass-panel">
              <div className="testimonial-header">
                <div className="pair-avatars">
                  <Image
                    src="/images/avatar-carlos-writer.png"
                    alt="Carlos"
                    width={48}
                    height={48}
                    className="pair-avatar"
                  />
                  <Image
                    src="/images/avatar-priya-fintech.png"
                    alt="Priya"
                    width={48}
                    height={48}
                    className="pair-avatar overlap"
                  />
                </div>
                <div className="pair-info">
                  <div className="pair-names">CARLOS_DOCS ✍️ &amp; PRIYA_FINTECH 💻</div>
                  <div className="pair-roles">Marketing &amp; Content ↔ Software &amp; IT</div>
                </div>
                <div className="score-badge sm">92% Synergy</div>
              </div>
              <p className="testimonial-quote">
                &ldquo;Zero recruiter spam and zero ego. Pure builder energy with milestone contracts that locked in our deliverables and compensation upfront.&rdquo;
              </p>
              <div className="testimonial-footer">
                <span className="outcome-pill">🤝 Milestone Contract Signed</span>
                <span className="verified-badge">● Early Builder</span>
              </div>
            </article>
          </div>
        </section>

        {/* SECTION 8: INTERACTIVE FAQ ACCORDION */}
        <section className="faq-section" id="faq">
          <div className="section-header text-center">
            <p className="kicker">Frequently Asked Questions</p>
            <h2 className="section-title">Everything You Need to Know</h2>
            <p className="section-subtitle">
              Clear answers on how deterministic matching, zero-spam privacy, and milestone contracts work.
            </p>
          </div>
          <LandingFaq />
        </section>

        {/* SECTION 9: PRE-FOOTER HIGH-CONVERSION CTA BANNER */}
        <section className="cta-banner-section">
          <div className="cta-banner glass-panel">
            <div className="cta-backdrop-wrap">
              <Image
                src="/images/cta-nebula-backdrop.png"
                alt="Cosmic Nebula Background"
                fill
                sizes="(max-width: 1240px) 100vw, 1240px"
                className="cta-backdrop-img"
              />
            </div>
            <div className="cta-content">
              <span className="cta-pill">✨ Instant Onboarding · 100% Free for Builders</span>
              <h2 className="cta-title">Ready to Build Something Remarkable?</h2>
              <p className="cta-desc">
                Join the first wave of ambitious builders and discover your complementary co-founder today.
              </p>
              <div className="cta-actions">
                <Link href={ctaHref} className="primary-btn lg">
                  {ctaLabel} →
                </Link>
                {!user ? (
                  <Link href="/login" className="ghost-btn lg">
                    Already have an account? Sign in
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: MODERN MULTI-COLUMN FOOTER */}
        <footer className="site-footer" style={{ borderTop: "1px solid var(--stroke)" }}>
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <div className="footer-brand">
                <span className="brand-icon">⚡</span>
                <span className="brand-name">Passion Protocol</span>
              </div>
              <p className="footer-tagline">
                Passion Protocol · Vibe-based Co-founder &amp; Collaborator Matching. Built for real builders ⚡
              </p>
              <div className="system-status">
                <span className="status-dot"></span>
                <span className="status-text">All Systems Operational</span>
              </div>
            </div>

            <div className="footer-col">
              <h4>Product</h4>
              <ul className="footer-links">
                <li><Link href="/discover">Discover Deck</Link></li>
                <li><Link href="/onboarding">Vibe Calibration</Link></li>
                <li><Link href="/profile">Project Incubator</Link></li>
                <li><Link href="/messages">Messages &amp; Contracts</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Ecosystem</h4>
              <ul className="footer-links">
                <li><Link href="#testimonials">Startups Launched</Link></li>
                <li><Link href="#simulator">Vibe Simulator</Link></li>
                <li><Link href="#how-it-works">Builder Timeline</Link></li>
                <li><Link href="#features">Feature Bento</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Stay Connected</h4>
              <p className="newsletter-desc">Get weekly curated builder matches and startup sprint updates.</p>
              <div className="footer-newsletter">
                <input
                  type="email"
                  placeholder="builder@startup.co"
                  className="newsletter-input"
                  aria-label="Email address"
                />
                <button type="button" className="primary-btn sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Passion Protocol. All rights reserved.</p>
            <div className="footer-legal-links">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
