"use client";

import React, { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// Official Google SVG Icon
const GoogleIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" className={className} suppressHydrationWarning>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

function AuthFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(
    tabParam === "signup" ? "signup" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (tabParam === "signup") {
      setMode("signup");
    } else if (tabParam === "signin") {
      setMode("signin");
    }
  }, [tabParam]);

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

    if (mode === "signup" && !agreedToTerms) {
      setError("You must be 18+ and agree to the Terms of Service and Privacy Policy to create an account.");
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

  async function handleQuickDemoLogin() {
    setPending(true);
    setError("");
    setMessage("");
    const testEmail = "dev.arjun@example.com";
    const testPassword = "DemoPartner1!";
    setEmail(testEmail);
    setPassword(testPassword);
    setAgreedToTerms(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (authError) {
      // Auto-signup if not registered yet
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      if (signUpError) {
        setPending(false);
        setError(signUpError.message);
        return;
      }

      if (!signUpData.session && signUpData.user) {
        setPending(false);
        setMessage("Demo account registered! Please check email or sign in.");
        return;
      }
    }

    setPending(false);
    router.refresh();
    router.push("/discover");
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 340,
        damping: 26,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      suppressHydrationWarning
      style={{ width: "100%", maxWidth: "420px", margin: "0 auto" }}
    >
      {/* Header Titles */}
      <motion.div variants={itemVariants} style={{ marginBottom: "28px", textAlign: "left" }} suppressHydrationWarning>
        <h1
          suppressHydrationWarning
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            color: "var(--text-bright)",
            marginBottom: "8px",
            lineHeight: 1.15,
          }}
        >
          {mode === "signin"
            ? "Welcome back"
            : mode === "signup"
            ? "Create your account"
            : "Reset your password"}
        </h1>
        <p suppressHydrationWarning style={{ fontSize: "14px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
          {mode === "signin"
            ? "Sign in to access your Discover Deck and active partnerships."
            : mode === "signup"
            ? "Find your complementary co-founder & build together."
            : "Enter your account email to receive a secure reset link."}
        </p>
      </motion.div>

      {/* Google OAuth Button */}
      <motion.div variants={itemVariants} style={{ marginBottom: "20px" }} suppressHydrationWarning>
        <button
          type="button"
          suppressHydrationWarning
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
          className="outline-btn"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            padding: "12px 20px",
            borderRadius: "var(--radius-md)",
            fontSize: "14px",
            fontWeight: 600,
            background: "var(--surface)",
            border: "1px solid var(--stroke)",
            color: "var(--text-bright)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <GoogleIcon />
          <span>Login with Google</span>
        </button>
      </motion.div>

      {/* Divider */}
      <motion.div
        variants={itemVariants}
        suppressHydrationWarning
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "var(--stroke)" }} />
        <span
          suppressHydrationWarning
          style={{ fontSize: "12px", fontWeight: 500, color: "var(--dim)" }}
        >
          or
        </span>
        <div style={{ flex: 1, height: "1px", background: "var(--stroke)" }} />
      </motion.div>

      {/* Form */}
      <form onSubmit={onSubmit} suppressHydrationWarning style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <motion.div variants={itemVariants} suppressHydrationWarning style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label className="label" htmlFor="email" suppressHydrationWarning style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-bright)" }}>
            Email
          </label>
          <input
            id="email"
            className="input"
            type="email"
            autoComplete="email"
            required
            suppressHydrationWarning
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              fontSize: "14px",
              border: "1px solid var(--stroke)",
              background: "var(--surface)",
              color: "var(--text-bright)",
              outline: "none",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            }}
          />
        </motion.div>

        {mode !== "forgot" && (
          <motion.div variants={itemVariants} suppressHydrationWarning style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="label" htmlFor="password" suppressHydrationWarning style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-bright)" }}>
                Password
              </label>
              {mode === "signin" && (
                <button
                  type="button"
                  suppressHydrationWarning
                  className="sub"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--accent)",
                    padding: 0,
                  }}
                  onClick={() => {
                    setMode("forgot");
                    setError("");
                    setMessage("");
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>

            <div style={{ position: "relative" }}>
              <input
                id="password"
                className="input"
                type={showPassword ? "text" : "password"} /* type="password" */
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
                suppressHydrationWarning
                minLength={8}
                maxLength={72}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "12px 48px 12px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "14px",
                  border: "1px solid var(--stroke)",
                  background: "var(--surface)",
                  color: "var(--text-bright)",
                  outline: "none",
                }}
              />
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--muted)",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Signup Legal & Age Checkbox */}
        {mode === "signup" && (
          <motion.div
            variants={itemVariants}
            suppressHydrationWarning
            style={{
              background: "var(--surface-inset)",
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--stroke-subtle)",
            }}
          >
            <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "var(--text)", cursor: "pointer" }}>
              <input
                type="checkbox"
                required
                suppressHydrationWarning
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ marginTop: "3px" }}
              />
              <span style={{ lineHeight: 1.4 }}>
                I am 18+ and agree to the{" "}
                <Link href="/terms" target="_blank" style={{ color: "var(--accent)", fontWeight: 600 }}>Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" style={{ color: "var(--accent)", fontWeight: 600 }}>Privacy Policy</Link>.
              </span>
            </label>
            <p style={{ fontSize: "11px", color: "var(--dim)", margin: "6px 0 0 22px", lineHeight: 1.4 }}>
              Data notice: We use your answers solely to compute compatibility scores without sharing contact info.
            </p>
          </motion.div>
        )}

        {/* Feedback Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="error"
              suppressHydrationWarning
              style={{
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                background: "var(--danger-bg)",
                border: "1px solid var(--danger-border)",
                color: "var(--danger)",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="sub"
              suppressHydrationWarning
              style={{
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                background: "var(--success-bg)",
                border: "1px solid var(--success-border)",
                color: "var(--success)",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              ✅ {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div variants={itemVariants} suppressHydrationWarning style={{ marginTop: "4px" }}>
          <button
            className="primary-btn"
            type="submit"
            disabled={pending}
            suppressHydrationWarning
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: "9999px",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              background: "linear-gradient(135deg, #ff3d6e 0%, #d92455 100%)",
              boxShadow: "0 4px 20px rgba(255, 61, 110, 0.35)",
              border: "none",
              color: "#ffffff",
              cursor: pending ? "wait" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {pending ? "Working…" : mode === "signup" ? "Create Account" : mode === "forgot" ? "Send Reset Link" : "Sign In"}
          </button>
        </motion.div>

        {/* Bottom Switch Toggle */}
        <motion.div variants={itemVariants} suppressHydrationWarning style={{ textAlign: "center", marginTop: "12px" }}>
          <button
            className="toggle-auth"
            type="button"
            suppressHydrationWarning
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
              setMessage("");
            }}
            style={{
              background: "none",
              border: "none",
              fontSize: "13px",
              color: "var(--muted)",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            {mode === "signin" ? (
              <span>
                Don&apos;t have an account? <strong style={{ color: "var(--accent)" }}>Sign up</strong>
              </span>
            ) : mode === "signup" ? (
              <span>
                Already have an account? <strong style={{ color: "var(--accent)" }}>Sign in</strong>
              </span>
            ) : (
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>&larr; Back to Sign in</span>
            )}
          </button>
        </motion.div>

        {/* Local Dev Demo Fast Sign-In */}
        <motion.div variants={itemVariants} suppressHydrationWarning style={{ marginTop: "8px" }}>
          <button
            type="button"
            suppressHydrationWarning
            disabled={pending}
            onClick={handleQuickDemoLogin}
            style={{
              background: "var(--surface-inset)",
              border: "1px dashed var(--stroke)",
              borderRadius: "var(--radius-md)",
              padding: "9px 12px",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--accent)",
              cursor: pending ? "wait" : "pointer",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            ⚡ {pending ? "Signing in…" : "1-Click Instant Demo Login (dev.arjun@example.com)"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}

export function AuthForm() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>Loading form…</div>}>
      <AuthFormInner />
    </Suspense>
  );
}
