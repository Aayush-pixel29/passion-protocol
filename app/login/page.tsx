import { AuthForm } from "@/components/AuthForm";
import { SiteHeader } from "@/components/SiteHeader";

export default function LoginPage() {
  return (
    <div className="site">
      <SiteHeader current="none" signedIn={false} />
      <main className="wrap split-page">
        <section className="split-copy">
          <p className="kicker">Sign in</p>
          <h1>
            Welcome
            <br />
            back
          </h1>
          <p className="lede">
            Use email and a password. After that you set a codename and vibe — then Discover opens
            as a full desktop board, not a swipe stack.
          </p>
        </section>
        <section className="panel">
          <AuthForm />
        </section>
      </main>
    </div>
  );
}
