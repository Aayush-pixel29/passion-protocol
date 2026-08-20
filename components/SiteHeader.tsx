import Link from "next/link";
import { signOut } from "@/lib/actions";

type Props = {
  current: "discover" | "profile" | "none";
  signedIn: boolean;
};

export function SiteHeader({ current, signedIn }: Props) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href={signedIn ? "/discover" : "/"} className="brand">
          Passion Protocol
        </Link>
        <nav className="nav">
          {signedIn ? (
            <>
              <Link href="/discover" className={current === "discover" ? "active" : ""}>
                Discover
              </Link>
              <Link href="/profile" className={current === "profile" ? "active" : ""}>
                Profile
              </Link>
              <form action={signOut}>
                <button className="ghost-btn" type="submit">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">Sign in</Link>
              <Link href="/login" className="header-cta">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
