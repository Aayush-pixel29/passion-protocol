"use client";

import { useTransition } from "react";
import { deleteAccount } from "@/lib/actions";

export function DeleteAccountButton() {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
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
      className="button"
      style={{
        background: "rgba(244, 63, 94, 0.12)",
        color: "#f43f5e",
        border: "1.5px solid rgba(244, 63, 94, 0.35)",
        padding: "10px 20px",
        borderRadius: "var(--radius-sm)",
        fontWeight: 700,
        fontSize: "14px",
        cursor: isPending ? "not-allowed" : "pointer",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 0 14px rgba(244, 63, 94, 0.15)",
      }}
    >
      <span>🗑️</span>
      <span>{isPending ? "Deleting..." : "Delete my account"}</span>
    </button>
  );
}

