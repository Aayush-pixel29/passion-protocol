"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password.length > 72) {
      setError("Password is too long.");
      return;
    }
    setPending(true);
    const supabase = createClient();
    const { error: authError } =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
    setPending(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.refresh();
    router.push("/discover");
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

      <label className="label" htmlFor="password">
        Password
      </label>
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

      {error ? <p className="error">{error}</p> : null}

      <button className="primary-btn" type="submit" disabled={pending}>
        {pending ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
      </button>

      <button
        className="toggle-auth"
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setError("");
        }}
      >
        {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
      </button>
    </form>
  );
}
