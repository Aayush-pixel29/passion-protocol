"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary:", error);
  }, [error]);

  return (
    <div className="site">
      <main
        className="wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "75vh",
        }}
      >
        <div
          className="glass-panel"
          style={{
            maxWidth: "580px",
            width: "100%",
            padding: "56px 40px",
            textAlign: "center",
            margin: "0 auto",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span className="kicker">Signal Error</span>
            <h1
              className="gradient-text"
              style={{
                fontSize: "2.75rem",
                fontWeight: 800,
                lineHeight: 1.15,
                margin: "16px 0 16px",
                letterSpacing: "-0.03em",
              }}
            >
              Something Glitched
            </h1>
            <p
              className="sub"
              style={{
                fontSize: "1.1rem",
                color: "var(--muted)",
                marginBottom: "36px",
                lineHeight: 1.6,
                maxWidth: "460px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Something went wrong on our end. It has been logged — try again, or head back home.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => reset()} className="primary-btn inline">
                Try Again
              </button>
              <Link href="/" className="primary-btn inline">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
