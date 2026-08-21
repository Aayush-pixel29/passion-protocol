import Link from "next/link";

export default function NotFound() {
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
            <span className="kicker">404 Error</span>
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
              404 - Signal Lost
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
              The co-founder or page you are looking for has shifted frequencies.
            </p>
            <div>
              <Link href="/" className="primary-btn inline">
                Return to Orbit
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
