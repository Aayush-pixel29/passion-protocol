import type { Metadata } from "next";
import Image from "next/image";
import { AuthForm } from "@/components/AuthForm";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Sign In & Create Account — Passion Protocol",
  description: "Access your Passion Protocol co-founder discover deck, trial tasks, and messaging workspace.",
};

export default function LoginPage() {
  return (
    <div className="site" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--background)" }}>
      <SiteHeader current="none" signedIn={false} />

      <main
        className="wrap"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px 40px",
          position: "relative",
          width: "100%",
        }}
      >
        {/* Background Ambient Glows */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "15%",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 61, 110, 0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "15%",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Watermelon UI auth-07 Inspired Split Container */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "1060px",
            display: "grid",
            gridTemplateColumns: "1fr",
            background: "var(--surface)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--stroke)",
            boxShadow: "0 30px 60px -20px rgba(0, 0, 0, 0.12), 0 0 0 1px var(--stroke-subtle)",
            overflow: "hidden",
          }}
          className="login-split-grid"
        >
          {/* Left Form Section */}
          <div
            style={{
              padding: "44px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AuthForm />
          </div>

          {/* Right Visual Artwork Showcase Panel (Pure Fine-Art Aesthetic) */}
          <div
            className="login-visual-panel"
            style={{
              padding: "14px",
              background: "var(--surface-inset)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: 1,
                minHeight: "560px",
                borderRadius: "calc(var(--radius-xl) - 4px)",
                overflow: "hidden",
                border: "1px solid var(--stroke)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 40px -10px rgba(0,0,0,0.3)",
              }}
            >
              {/* Full-bleed Stippled Clouds Art Image */}
              <Image
                src="/images/auth/auth-clouds-art.png"
                alt="Passion Protocol Architectural Cloudscape Art"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{
                  objectFit: "cover",
                  objectPosition: "center 30%",
                  zIndex: 0,
                  filter: "contrast(1.04) brightness(0.96)",
                }}
              />

              {/* Minimal Subtle Scrim for Depth */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(12, 12, 18, 0.05) 0%, rgba(12, 12, 18, 0) 50%, rgba(12, 12, 18, 0.75) 90%, rgba(12, 12, 18, 0.92) 100%)",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              />

              {/* Elegant Minimal Editorial Caption */}
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "24px",
                  right: "24px",
                  zIndex: 2,
                  color: "#ffffff",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: "#ffffff",
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
                  }}
                >
                  Find the builder who complements your craft.
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "12.5px",
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: 1.4,
                    textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  4D synergy matchmaking &amp; verified chemistry for co-founders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
