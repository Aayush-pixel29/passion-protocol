import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="wrap">
        <div className="footer-grid">
          {/* Brand & Support Column */}
          <div className="footer-col">
            <Link href="/" className="brand" style={{ marginBottom: 12 }}>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: "var(--accent)" }}
              >
                <rect x="2" y="2" width="9" height="9" rx="2.5" fill="currentColor" fillOpacity="0.9" />
                <rect x="13" y="2" width="9" height="9" rx="2.5" fill="currentColor" fillOpacity="0.3" />
                <rect x="2" y="13" width="9" height="9" rx="2.5" fill="currentColor" fillOpacity="0.3" />
                <rect x="13" y="13" width="9" height="9" rx="2.5" fill="currentColor" fillOpacity="0.9" />
              </svg>
              <span className="brand-text">Passion Protocol</span>
            </Link>
            <p className="sub" style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 300, margin: "8px 0 16px" }}>
              A transparent co-founder matching platform connecting builders by working compatibility, pace, and risk tolerance.
            </p>
            <p className="sub" style={{ fontSize: 13, margin: 0 }}>
              Support:{" "}
              <a href="mailto:support@passionprotocol.com" style={{ color: "var(--accent)" }}>
                support@passionprotocol.com
              </a>
            </p>
          </div>

          {/* Product Column */}
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><Link href="/how-scoring-works">How Scoring Works</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/discover">Discover Deck</Link></li>
              <li><Link href="/workspaces">Workspaces</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/refunds">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Passion Protocol. All rights reserved.</span>
          <span>Built for trustworthy co-founder matching.</span>
        </div>
      </div>
    </footer>
  );
}
