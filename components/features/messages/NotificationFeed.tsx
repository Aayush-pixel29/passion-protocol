import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { acceptContract, declineContract } from "@/lib/actions";

type Contract = any;

export function NotificationFeed({ currentUserId }: { currentUserId: string }) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchContracts = async () => {
      const { data } = await supabase
        .from("partnership_contracts")
        .select(`*, proposer:proposer_id(id, codename, industry_category, professional_title)`)
        .eq("receiver_id", currentUserId)
        .eq("status", "proposed");
      if (data) setContracts(data);
    };
    fetchContracts();

    const channel = supabase.channel("notifs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "partnership_contracts", filter: `receiver_id=eq.${currentUserId}` },
        () => fetchContracts()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUserId, supabase]);

  if (contracts.length === 0) return null;

  return (
    <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", background: "rgba(244, 63, 94, 0.05)" }}>
      <h3 style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-rose)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Pending Contracts ({contracts.length})</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {contracts.map(c => (
          <div key={c.id} style={{ padding: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--ink)" }}>
              <strong>{c.proposer?.codename}</strong> proposed a Micro-Contract.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                className="pill-btn" 
                style={{ flex: 1, padding: "6px 0", fontSize: 12, background: "var(--brand)", color: "#fff", fontWeight: 700 }}
                onClick={() => startTransition(() => { acceptContract(c.id, "/messages"); })}
                disabled={isPending}
              >
                Accept
              </button>
              <button 
                className="pill-btn skip" 
                style={{ flex: 1, padding: "6px 0", fontSize: 12 }}
                onClick={() => startTransition(() => { declineContract(c.id, "/messages"); })}
                disabled={isPending}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

