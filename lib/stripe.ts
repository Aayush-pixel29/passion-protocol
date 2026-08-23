import Stripe from "stripe";

// We provide a fallback 'sk_test_dummy' so the Vercel/GitHub Actions build
// doesn't crash during the static page collection phase when env vars might be missing.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2026-07-29.dahlia", 
  typescript: true,
});
