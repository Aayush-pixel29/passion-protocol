import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SynergyProof } from "@/components/SynergyProof";
import { LandingFaq } from "@/components/LandingFaq";
import { SneakPeekMarquee } from "@/components/SneakPeekMarquee";
import { WordMorph } from "@/components/ui/WordMorph";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { ScrollProgressLine } from "@/components/ui/ScrollProgressLine";
import { SkiperCrowd } from "@/components/ui/SkiperCrowd";
import { TrialTaskShowcase } from "@/components/landing/TrialTaskShowcase";
import { getSessionUser, loadSneakPeekProfiles } from "@/lib/data";
import styles from "./page.module.css";

const COMPARISONS = [
  { old: "Resume dumps & credentials", next: "4 calibrated dimensions: Pace, Comms, Risk, Energy" },
  { old: "Cold DMs & one-way outreach", next: "Reciprocal matching — only interact with mutual role alignment" },
  { old: "\u201CLet's just start and see\u201D", next: "A small, time-boxed trial task before anyone commits" },
  { old: "Handshake deals with no trail", next: "In-app milestone contracts with documented deliverables" },
];

const AUDIENCE = [
  "🎓 CS students",
  "⚡ Hackathon teams",
  "💻 Full-stack developers",
  "🧠 ML engineers",
  "🎨 Product designers",
  "🛠️ Hardware hackers",
  "🚀 Indie hackers",
  "🌱 Open-source maintainers",
  "✍️ Technical writers",
  "📈 Growth operators",
];

const AVATARS = [
  { src: "/images/avatar-alex-coder.png", alt: "Backend engineer" },
  { src: "/images/avatar-maya-designer.png", alt: "Product designer" },
  { src: "/images/avatar-priya-fintech.png", alt: "Fintech operator" },
  { src: "/images/avatar-david-hardware.png", alt: "Hardware engineer" },
  { src: "/images/avatar-elena-growth.png", alt: "Growth lead" },
];

const STEPS = [
  {
    n: "01",
    title: "Calibrate your vibe",
    body: "Pick your discipline and who you're looking for, then tune Pace, Comms, Risk and Energy. Two minutes.",
  },
  {
    n: "02",
    title: "Get matched, not spammed",
    body: "Reciprocal matching: you only see partners whose role complements yours — and who are looking for you.",
  },
  {
    n: "03",
    title: "Swap a trial task",
    body: "Send a small, time-boxed task. Work on something real together before anyone commits.",
  },
  {
    n: "04",
    title: "Connect & team up",
    body: "Mutual yes unlocks contact details, chat, a shared workspace and milestone contracts.",
  },
];

const TRIAL_POINTS = [
  { icon: "🎯", title: "Scope it small", body: "One feature, one screen, one bug. Something that takes hours, not weeks." },
  { icon: "⏱", title: "Time-box it", body: "24, 48 or 72 hours. A clear deadline shows real pace and follow-through." },
  { icon: "🔁", title: "Review both ways", body: "Both sides rate pace, communication and quality. Honest and private." },
  { icon: "🤝", title: "Decide together", body: "If it clicks, team up with one tap. If not, part ways with no awkwardness." },
];

export default async function HomePage() {
  const { user } = await getSessionUser();
  const sneakProfiles = await loadSneakPeekProfiles();
  const ctaHref = user ? "/discover" : "/login?tab=signup";
  const ctaLabel = user ? "Explore Discover Deck" : "Find your teammate";

  return (
    <div className="site" style={{ position: "relative", overflowX: "hidden" }}>
      <ScrollProgressLine />
      <SiteHeader current="none" signedIn={Boolean(user)} />

      {/* ============================ HERO ============================ */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroBg} aria-hidden="true" />

        <div className={styles.heroInner}>
          <Link href="#trial-tasks" className={`hero-badge-pill ${styles.badge}`}>
            <span className={styles.badgeNew}>New</span>
            <span>Trial tasks — test the fit before you team up</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>

          <p className={`kicker ${styles.kicker}`}>For students, developers, hackers &amp; engineers</p>

          <h1 id="hero-title" className={`hero-headline ${styles.headline}`}>
            Find the people
            <br />
            you&apos;ll build{" "}
            <span className={styles.serifAccent}>
              <WordMorph words={["with.", "a startup with.", "a hackathon with.", "open source with."]} intervalMs={2800} />
            </span>
          </h1>

          <p className={`lede ${styles.lede}`}>
            Passion Protocol matches builders on <strong>how they actually work</strong> &mdash; pace, communication,
            risk and energy &mdash; not on resumes. Then you swap a small trial task, so you know you click before you commit.
          </p>

          <div className={styles.ctaRow}>
            <ShimmerButton href={ctaHref} className="primary-btn lg" style={{ padding: "15px 28px", borderRadius: "999px" }}>
              <span>{ctaLabel}</span>
              <span aria-hidden="true">&rarr;</span>
            </ShimmerButton>
            <Link href="#how-it-works" className={`outline-btn ${styles.secondaryBtn}`}>
              See how it works
            </Link>
          </div>

          <div className={styles.proof}>
            <div className={styles.avatarStack}>
              {AVATARS.map((a) => (
                <Image key={a.src} src={a.src} alt={a.alt} width={34} height={34} className={styles.avatarImg} />
              ))}
            </div>
            <span>
              Free to start &middot; Private until mutual &middot; <strong>Zero cold DMs</strong>
            </span>
          </div>
        </div>

        {/* Floating product chips (desktop only) */}
        <div className={`${styles.floatCard} ${styles.floatLeft}`} aria-hidden="true">
          <div className={styles.floatHead}>
            <span className={styles.floatDotGreen} /> Trial task accepted
          </div>
          <div className={styles.floatTitle}>Build the auth flow</div>
          <div className={styles.floatMeta}>⏱ 48h &middot; 💻 Alex &rarr; 🎨 Maya</div>
        </div>

        <div className={`${styles.floatCard} ${styles.floatRight}`} aria-hidden="true">
          <div className={styles.floatScore}>96%</div>
          <div>
            <div className={styles.floatTitle}>Vibe match</div>
            <div className={styles.floatMeta}>Pace 5/5 &middot; Async comms</div>
          </div>
        </div>

        <div className={`${styles.floatCard} ${styles.floatLeftLow}`} aria-hidden="true">
          <div className={styles.floatMeta}>🔒 Contact revealed after mutual connect</div>
        </div>

        {/* The walking crowd — the community, literally on the move */}
        <div className={styles.crowd}>
          <SkiperCrowd height={380} peepScale={0.82} />
        </div>
      </section>

      {/* ========================= AUDIENCE MARQUEE ========================= */}
      <section className={styles.audience} aria-label="Who Passion Protocol is for">
        <p className={styles.audienceLabel}>Built for builders, makers, designers, writers and engineers</p>
        <div className={styles.marquee}>
          <div className={styles.marqueeTrack}>
            {[...AUDIENCE, ...AUDIENCE].map((item, i) => (
              <span key={`${item}-${i}`} className={styles.marqueeItem} aria-hidden={i >= AUDIENCE.length}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <main className="wrap" style={{ position: "relative", zIndex: 1 }}>
        {/* ========================= HOW IT WORKS ========================= */}
        <section className={`how-it-works-section ${styles.section}`} id="how-it-works">
          <div className={styles.sectionHead}>
            <p className="kicker">How it works</p>
            <h2 className={styles.h2}>
              From stranger to teammate <span className={styles.serifAccentInline}>in four steps</span>
            </h2>
            <p className={styles.sub}>A deliberate flow that protects your time and filters for real chemistry.</p>
          </div>

          <ol className={styles.steps}>
            {STEPS.map((s) => (
              <li key={s.n} className={`${styles.step} glass-panel`}>
                <span className={`feature-index ${styles.stepIndex}`}>{s.n}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepBody}>{s.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      {/* ========================= TRIAL TASKS (dark) ========================= */}
      <section className={styles.dark} id="trial-tasks" aria-labelledby="trial-title">
        <div className={styles.darkGlow} aria-hidden="true" />
        <div className={`wrap ${styles.darkInner}`}>
          <div className={styles.darkCopy}>
            <p className={styles.darkKicker}>New · Trial tasks</p>
            <h2 id="trial-title" className={styles.darkH2}>
              Don&apos;t trust a profile.
              <br />
              <span className={styles.serifAccentDark}>Work together first.</span>
            </h2>
            <p className={styles.darkSub}>
              Not sure someone is the right partner? Give each other a small task. You&apos;ll learn more from 48 hours
              of real work than from 48 messages.
            </p>

            <ul className={styles.trialList}>
              {TRIAL_POINTS.map((p) => (
                <li key={p.title} className={styles.trialItem}>
                  <span className={styles.trialIcon} aria-hidden="true">{p.icon}</span>
                  <div>
                    <div className={styles.trialTitle}>{p.title}</div>
                    <div className={styles.trialBody}>{p.body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <TrialTaskShowcase />
        </div>
      </section>

      <main className="wrap" style={{ position: "relative", zIndex: 1 }}>
        {/* ========================= USE CASES BENTO ========================= */}
        <section className={styles.section} id="use-cases">
          <div className={styles.sectionHead}>
            <p className="kicker">What you can do</p>
            <h2 className={styles.h2}>
              One platform, <span className={styles.serifAccentInline}>every kind of team</span>
            </h2>
            <p className={styles.sub}>Co-founder, hackathon squad or a weekend project partner &mdash; same honest matching.</p>
          </div>

          <div className={styles.bento}>
            <article className={`${styles.bentoCard} ${styles.bentoWide}`}>
              <div className={styles.bentoText}>
                <span className={styles.bentoTag}>Co-founders</span>
                <h3 className={styles.bentoTitle}>Role is just a filter</h3>
                <p className={styles.bentoBody}>
                  Engineers meet designers, operators meet makers. You only see complementary roles that are also looking for you.
                </p>
              </div>
              <div className={styles.bentoMedia}>
                <Image src="/images/bento-roles-complement.png" alt="Code and design pieces fitting together" fill sizes="(max-width: 900px) 100vw, 40vw" className={styles.bentoImg} />
              </div>
            </article>

            <article className={styles.bentoCard}>
              <div className={styles.bentoMediaTall}>
                <Image src="/images/bento-project-incubator.png" alt="A project taking shape" fill sizes="(max-width: 900px) 100vw, 30vw" className={styles.bentoImg} />
              </div>
              <div className={styles.bentoText}>
                <span className={styles.bentoTag}>Teams</span>
                <h3 className={styles.bentoTitle}>Assemble a hackathon team</h3>
                <p className={styles.bentoBody}>Find the missing designer or ML person the night before the deadline.</p>
              </div>
            </article>

            <article className={styles.bentoCard}>
              <div className={styles.bentoMediaTall}>
                <Image src="/images/bento-vibe-engine.png" alt="Vibe score engine" fill sizes="(max-width: 900px) 100vw, 30vw" className={styles.bentoImg} />
              </div>
              <div className={styles.bentoText}>
                <span className={styles.bentoTag}>Matching</span>
                <h3 className={styles.bentoTitle}>Vibe is the score</h3>
                <p className={styles.bentoBody}>An open formula over Pace, Comms, Risk and Energy. No black box.</p>
              </div>
            </article>

            <article className={styles.bentoCard}>
              <div className={styles.bentoMediaTall}>
                <Image src="/images/bento-privacy-shield.png" alt="Privacy shield" fill sizes="(max-width: 900px) 100vw, 30vw" className={styles.bentoImg} />
              </div>
              <div className={styles.bentoText}>
                <span className={styles.bentoTag}>Privacy</span>
                <h3 className={styles.bentoTitle}>Private until mutual</h3>
                <p className={styles.bentoBody}>Your contact details stay hidden until both sides click Connect.</p>
              </div>
            </article>

            <article className={styles.bentoCard}>
              <div className={styles.bentoMediaTall}>
                <Image src="/images/bento-smart-contracts.png" alt="Milestone contract" fill sizes="(max-width: 900px) 100vw, 30vw" className={styles.bentoImg} />
              </div>
              <div className={styles.bentoText}>
                <span className={styles.bentoTag}>Commitment</span>
                <h3 className={styles.bentoTitle}>Lock it in with milestones</h3>
                <p className={styles.bentoBody}>Turn a good trial into a real agreement with documented deliverables.</p>
              </div>
            </article>
          </div>
        </section>

        {/* ========================= COMPARISON + STATS ========================= */}
        <section className={styles.compareSection} id="how-its-different">
          <div className={styles.sectionHead}>
            <p className="kicker">Why it&apos;s different</p>
            <h2 className={styles.h2}>
              Chemistry <span className={styles.serifAccentInline}>before</span> commitment
            </h2>
            <p className={styles.sub}>Most teams break up over pace, communication and risk &mdash; not skills.</p>
          </div>

          <div className={styles.compareGrid}>
            {COMPARISONS.map((row) => (
              <div className={styles.compareRow} key={row.old}>
                <span className={styles.compareOld}>{row.old}</span>
                <span className={styles.compareArrow} aria-hidden="true">&rarr;</span>
                <span className={styles.compareNew}>{row.next}</span>
              </div>
            ))}
          </div>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>4D</span>
              <span className={styles.heroStatLabel}>Work dimensions</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>100%</span>
              <span className={styles.heroStatLabel}>Reciprocal filtering</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>48h</span>
              <span className={styles.heroStatLabel}>Typical trial task</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>0</span>
              <span className={styles.heroStatLabel}>Cold DMs</span>
            </div>
          </div>
        </section>

        {/* Real registered builders (self-hides if the pool is empty) */}
        <SneakPeekMarquee profiles={sneakProfiles} />

        {/* ========================= FOUNDER NOTE ========================= */}
        <section id="mission" className={styles.section}>
          <figure className={`${styles.buildNote} glass-panel`}>
            <blockquote className={styles.buildNoteQuote}>
              &ldquo;I built Passion Protocol because finding a teammate shouldn&apos;t feel like a corporate resume screen.
              The matching math is open, and trial tasks let you see how someone really works. Try it and tell me what to fix.&rdquo;
            </blockquote>
            <figcaption className={styles.buildNoteAttribution}>&mdash; Aayush, founder of Passion Protocol</figcaption>
          </figure>
        </section>

        {/* ========================= FAQ ========================= */}
        <section className={`faq-section ${styles.section}`} id="faq">
          <div className={styles.sectionHead}>
            <p className="kicker">FAQ</p>
            <h2 className={styles.h2}>Questions, answered</h2>
          </div>
          <LandingFaq />
        </section>
      </main>

      {/* ========================= FINAL CTA ========================= */}
      <section className={styles.ctaSimple} aria-labelledby="cta-title">
        <div className={styles.ctaInner}>
          <h2 id="cta-title" className={styles.ctaTitle}>
            Your next teammate is <span className={styles.serifAccentInline}>already walking by.</span>
          </h2>
          <p className={styles.ctaSub}>
            Create your account, calibrate in two minutes, and start matching with builders who work the way you do.
          </p>
          <ShimmerButton href={ctaHref} className="primary-btn lg" style={{ padding: "16px 34px", fontSize: "16px", borderRadius: "999px" }}>
            <span>{ctaLabel}</span>
            <span aria-hidden="true">&rarr;</span>
          </ShimmerButton>
        </div>
        <div className={styles.ctaCrowd}>
          <SkiperCrowd height={250} peepScale={0.6} />
        </div>
      </section>

      {/* Live formula widget kept for the Discover redesign + test invariants */}
      <div style={{ display: "none" }}>
        <SynergyProof />
      </div>

      <footer className={styles.footerSimple}>
        <SiteFooter />
      </footer>
    </div>
  );
}
