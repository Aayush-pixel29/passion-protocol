"use client";

import { useState, useTransition } from "react";
import { savePaymentLink } from "@/lib/actions";

export function PaymentSettings({ initialLink }: { initialLink: string | null }) {
  const [link, setLink] = useState(initialLink || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!link.trim()) {
      setError("Please enter a valid link or UPI ID.");
      return;
    }

    startTransition(async () => {
      const res = await savePaymentLink(link);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Payment info updated successfully.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "var(--muted)" }}>
            UPI ID or Payment Link (PayPal, Stripe)
          </label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="e.g. name@upi or https://paypal.me/..."
            style={{ width: "100%", padding: "10px 14px", background: "var(--surface-inset)", border: "1px solid var(--stroke-subtle)", borderRadius: "var(--radius-sm)", color: "var(--text-bright)" }}
          />
        </div>
        <button type="submit" disabled={pending} className="pill-btn" style={{ height: 42 }}>
          {pending ? "Saving..." : "Save Payment Info"}
        </button>
      </div>
      {error && <p className="error" style={{ marginTop: 8, fontSize: 13 }}>{error}</p>}
      {success && <p className="success" style={{ marginTop: 8, fontSize: 13, color: "var(--success)" }}>{success}</p>}
    </form>
  );
}
