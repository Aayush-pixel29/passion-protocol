import Link from "next/link";
import { signOut } from "@/lib/actions";

type Props = {
  current: "discover" | "profile" | "messages" | "none";
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
          <span 
            style={{ 
              color: "#ff3d6e", 
              marginRight: 6,
              filter: "drop-shadow(0 0 8px rgba(255, 61, 110, 0.6))",
              fontSize: "1.25rem",
              lineHeight: 1
            }}
          >
            ⚡
          </span>
          <span className="brand-text">Passion Protocol</span>
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
              <form action={signOut} style={{ display: "inline" }}>
                <button className="ghost-btn" type="submit" aria-label="Sign out of your account">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="ghost-btn">
                Sign in
              </Link>
              <Link href="/login" className="header-cta pill-btn">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

