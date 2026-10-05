import Link from "next/link";
import { signOut } from "@/lib/actions";

type Props = {
  current: "discover" | "dashboard" | "profile" | "messages" | "workspaces" | "notifications" | "about" | "pricing" | "scoring" | "none";
  signedIn: boolean;
};

export function SiteHeader({ current, signedIn }: Props) {
  return (
    <header className="site-header" role="banner">
      <div className="site-header-inner">
        <Link 
          href={signedIn ? "/discover" : "/"} 
          className="brand" 
          aria-label="Passion Protocol Home"
        >
          {/* Trustworthy SVG Wordmark Emblem */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "var(--accent)", flexShrink: 0 }}
          >
            <rect x="2" y="2" width="9" height="9" rx="2.5" fill="currentColor" fillOpacity="0.9" />
            <rect x="13" y="2" width="9" height="9" rx="2.5" fill="currentColor" fillOpacity="0.3" />
            <rect x="2" y="13" width="9" height="9" rx="2.5" fill="currentColor" fillOpacity="0.3" />
            <rect x="13" y="13" width="9" height="9" rx="2.5" fill="currentColor" fillOpacity="0.9" />
          </svg>
          <span className="brand-text">⚡ Passion Protocol</span>
        </Link>

        <nav className="nav" aria-label="Main Navigation">
          {signedIn ? (
            <>
              <Link 
                href="/discover" 
                className={current === "discover" ? "active" : ""}
                aria-current={current === "discover" ? "page" : undefined}
              >
                Discover
              </Link>
              <Link 
                href="/dashboard" 
                className={current === "dashboard" ? "active" : ""}
                aria-current={current === "dashboard" ? "page" : undefined}
              >
                Dashboard
              </Link>
              <Link 
                href="/messages" 
                className={current === "messages" ? "active" : ""}
                aria-current={current === "messages" ? "page" : undefined}
              >
                Messages
              </Link>
              <Link 
                href="/profile" 
                className={current === "profile" ? "active" : ""}
                aria-current={current === "profile" ? "page" : undefined}
              >
                Profile
              </Link>
              <form action={signOut} style={{ display: "inline" }} suppressHydrationWarning>
                <button 
                  className="ghost-btn" 
                  type="submit" 
                  aria-label="Sign out of your account"
                  suppressHydrationWarning
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link 
                href="/how-scoring-works" 
                className={current === "scoring" ? "active" : ""}
              >
                How It Works
              </Link>
              <Link 
                href="/pricing" 
                className={current === "pricing" ? "active" : ""}
              >
                Pricing
              </Link>
              <Link 
                href="/about" 
                className={current === "about" ? "active" : ""}
              >
                About
              </Link>
              <Link href="/login?tab=signin" className="ghost-btn">
                Sign in
              </Link>
              <Link href="/login?tab=signup" className="primary-btn sm">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
