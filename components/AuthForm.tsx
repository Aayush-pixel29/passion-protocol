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
