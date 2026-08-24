import React from "react";
import Image from "next/image";

export function LandingBentoGrid() {
  return (
    <div className="bento-grid feature-grid">
      {/* CARD 1: 4D Vibe & Chemistry Engine (2-Column Wide) */}
      <article className="bento-card bento-card-wide glass-panel feature-card" key="vibe">
        <div className="bento-card-top">
          <div className="feature-index one">01</div>
          <span className="bento-tag">Deterministic Chemistry</span>
        </div>
        <div className="bento-card-body">
          <div className="bento-text">
            <h3>Vibe is the score</h3>
            <p>
              Match percentages are computed deterministically from 4 key work dimensions: Pace, Comms, Risk, and Energy.
              No subjective resume dumps—just mathematical working chemistry.
            </p>
            <div className="bento-chips">
              <span className="role-tag">⚡ Pace: Ship Fast</span>
              <span className="role-tag">💬 Comms: Async Quiet</span>
              <span className="role-tag">🎲 Risk: High Stakes</span>
            </div>
          </div>
          <div className="bento-image-wrap">
            <Image
              src="/images/bento-vibe-engine.png"
              alt="4D Vibe Engine"
              width={280}
              height={280}
              className="bento-image"
            />
          </div>
        </div>
      </article>

      {/* CARD 2: Inverted Complementary Role Filtering (1-Column Tall) */}
      <article className="bento-card bento-card-tall glass-panel feature-card" key="roles">
        <div className="bento-card-top">
          <div className="feature-index two">02</div>
          <span className="bento-tag">Inverted Matching</span>
        </div>
        <div className="bento-card-body vertical">
          <div className="bento-image-wrap">
            <Image
              src="/images/bento-roles-complement.png"
              alt="Inverted Role Filtering"
              width={220}
              height={220}
              className="bento-image"
            />
          </div>
          <div className="bento-text">
            <h3>Role is just a filter</h3>
            <p>
              Define who you are and what skill you need. The discovery pool stays targeted so you only meet complementary operators:
              Coders meet Designers, Hardware Makers meet Growth Hackers.
            </p>
          </div>
        </div>
      </article>

      {/* CARD 3: Project Incubator & Budgets (1-Column) */}
      <article className="bento-card glass-panel feature-card" key="incubator">
        <div className="bento-card-top">
          <div className="feature-index three">03</div>
          <span className="bento-tag">Project Incubator</span>
        </div>
        <div className="bento-card-body vertical">
          <div className="bento-image-wrap">
            <Image
              src="/images/bento-project-incubator.png"
              alt="Project Incubator"
              width={200}
              height={200}
              className="bento-image"
            />
          </div>
          <div className="bento-text">
            <h3>Verified Project Pitches</h3>
            <p>
              Showcase active MVPs, target budget ranges ($5k - $50k), and milestone roadmaps directly on candidate profile cards.
            </p>
          </div>
        </div>
      </article>

      {/* CARD 4: Zero-Spam Privacy Vault (1-Column) */}
      <article className="bento-card glass-panel feature-card" key="privacy">
        <div className="bento-card-top">
          <div className="feature-index four">04</div>
          <span className="bento-tag">Zero-Spam Privacy</span>
        </div>
        <div className="bento-card-body vertical">
          <div className="bento-image-wrap">
            <Image
              src="/images/bento-privacy-shield.png"
              alt="Zero Spam Privacy Vault"
              width={200}
              height={200}
              className="bento-image"
            />
          </div>
          <div className="bento-text">
            <h3>Connect when it fits</h3>
            <p>
              Browse discreetly with high-status anonymous codenames. Private contact reveal on mutual connect ensures contact information is instantly unlocked only when both sides agree.
            </p>
          </div>
        </div>
      </article>

      {/* CARD 5: Milestone Contracts & Real-Time Chat (2-Column Wide) */}
      <article className="bento-card bento-card-wide glass-panel feature-card" key="contracts">
        <div className="bento-card-top">
          <div className="feature-index five">05</div>
          <span className="bento-tag">Milestone Contracts</span>
        </div>
        <div className="bento-card-body">
          <div className="bento-text">
            <h3>Milestone Contracts &amp; Encrypted Chat</h3>
            <p>
              Lock in project deliverables, agreed milestone compensation, and sprint deadlines through holographic in-chat agreement cards.
            </p>
            <div className="contract-preview-badge">
              🤝 Escrow-Ready Agreements · Real-Time Postgres Subscriptions
            </div>
          </div>
          <div className="bento-image-wrap">
            <Image
              src="/images/bento-smart-contracts.png"
              alt="Milestone Contracts"
              width={280}
              height={280}
              className="bento-image"
            />
          </div>
        </div>
      </article>
    </div>
  );
}
