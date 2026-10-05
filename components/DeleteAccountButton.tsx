"use client";

import { useTransition } from "react";
import { deleteAccount } from "@/lib/actions";

export function DeleteAccountButton() {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to permanently delete your account? All dossier details, messages, and matches will be permanently erased. This action cannot be undone.")) {
      startTransition(async () => {
        const result = await deleteAccount();
        if (result?.error) {
          alert("Failed to delete account: " + result.error);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      type="button"
      style={{
        background: "var(--danger-bg)",
        color: "var(--danger)",
        border: "1px solid var(--danger-border)",
        padding: "8px 16px",
        borderRadius: "var(--radius)",
        fontWeight: 600,
        fontSize: "13px",
        cursor: isPending ? "not-allowed" : "pointer",
        transition: "all 0.15s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
      <span>{isPending ? "Deleting…" : "Delete Account"}</span>
    </button>
  );
}
