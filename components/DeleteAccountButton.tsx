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
      style={{ backgroundColor: "#ef4444", color: "#fff", borderColor: "#ef4444" }}
    >
      {isPending ? "Deleting..." : "Delete my account"}
    </button>
  );
}
