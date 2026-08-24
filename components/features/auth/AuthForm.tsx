"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const supabase = createClient();

    if (mode === "forgot") {
      setPending(true);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/login`,
      });
      setPending(false);

      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage("Check your email for the password reset link.");
      }
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password.length > 72) {
      setError("Password is too long.");
      return;
    }

    setPending(true);
    if (mode === "signup") {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      setPending(false);

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!data.session && data.user) {
        setMessage("Account created! Please check your email inbox to confirm your account.");
        return;
      }

      router.refresh();
      router.push("/discover");
    } else {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      setPending(false);

      if (authError) {
        setError(authError.message);
        return;
      }

      router.refresh();
      router.push("/discover");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24, marginBottom: 12 }}>
        <button
          type="button"
          onClick={async () => {
            setError("");
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
              },
            });
            if (error) setError(error.message);
          }}
          style={{
            background: "#ffffff",
            color: "var(--ink)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
            padding: "12px",
            fontSize: "1rem",
            fontWeight: 800,
            cursor: "pointer",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google
        </button>
        <div style={{ textAlign: "center", fontSize: "0.85rem", color: "#52525b", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 2, background: "var(--ink)" }}></div>
          OR
          <div style={{ flex: 1, height: 2, background: "var(--ink)" }}></div>
        </div>
      </div>

      <label className="label" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        className="input"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />

      {mode !== "forgot" ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label className="label" htmlFor="password">
              Password
            </label>
            {mode === "signin" ? (
              <button
                type="button"
                className="sub"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline", color: "inherit" }}
                onClick={() => {
                  setMode("forgot");
                  setError("");
                  setMessage("");
                }}
              >
                Forgot password?
              </button>
            ) : null}
          </div>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </>
      ) : null}

      {error ? <p className="error">{error}</p> : null}
      {message ? <p className="sub" style={{ color: "#10b981", fontWeight: 500, marginTop: 8 }}>{message}</p> : null}

      <button className="primary-btn" type="submit" disabled={pending} style={{ marginTop: 16 }}>
        {pending ? "Working…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
      </button>

      <button
        className="toggle-auth"
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setError("");
          setMessage("");
        }}
      >
        {mode === "signin"
          ? "Need an account? Sign up"
          : mode === "signup"
          ? "Have an account? Sign in"
          : "Back to Sign in"}
      </button>
    </form>
  );
}
