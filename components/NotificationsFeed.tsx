"use client";

import { useState } from "react";
import { respondToConnect, updateContractStatus } from "@/lib/actions";

type Sender = { id: string; codename: string; professional_title: string; industry_category: string };

export function NotificationsFeed({ connects, contracts, roleMatches, currentUserId }: {
  connects: any[];
  contracts: any[];
  roleMatches: any[];
  currentUserId: string;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleConnect = async (requestId: string, status: "accepted" | "declined") => {
    setLoading(requestId);
    await respondToConnect(requestId, status);
    window.location.reload();
  };

  const handleContract = async (contractId: string, status: "accepted" | "declined") => {
    setLoading(contractId);
    await updateContractStatus(contractId, status);
    window.location.reload();
  };

  if (connects.length === 0 && contracts.length === 0 && roleMatches.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: 60, textAlign: "center", borderRadius: 24 }}>
        <h3 style={{ margin: "0 0 8px", color: "var(--text-bright)", fontSize: 24 }}>All caught up!</h3>
        <p style={{ color: "var(--muted)", margin: 0 }}>You have no pending notifications at this time.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      
      {/* Contracts */}
      {contracts.length > 0 && (
        <section>
          <h3 style={{ borderBottom: "1px solid var(--stroke)", paddingBottom: 12, marginBottom: 20, color: "var(--text-bright)", fontSize: 18 }}>
            Contract Proposals
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {contracts.map(c => (
              <div key={c.id} className="glass" style={{ padding: 24, borderRadius: 16, borderLeft: "4px solid var(--accent-purple)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: 16, color: "var(--text-bright)" }}>
                      Partnership proposed by <span style={{ color: "var(--accent-purple)" }}>{c.sender?.codename || "Unknown"}</span>
                    </h4>
                    <p style={{ margin: 0, fontSize: 14, color: "var(--muted)" }}>
                      {c.contract_type ? c.contract_type.replace(/_/g, " ").toUpperCase() : "CUSTOM CONTRACT"}
                    </p>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--accent-purple)" }}>
                    ${c.price_amount}
                  </div>
                </div>
                
                <div style={{ background: "rgba(0,0,0,0.3)", padding: 12, borderRadius: 8, fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>
                  <strong>Scope:</strong> {c.deliverables}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button className="pill-btn skip" style={{ flex: 1 }} onClick={() => handleContract(c.id, "declined")} disabled={loading !== null}>
                    Decline
                  </button>
                  <button className="pill-btn" style={{ flex: 1, background: "var(--accent-emerald)", color: "#000", fontWeight: 700 }} onClick={() => handleContract(c.id, "accepted")} disabled={loading !== null}>
                    {loading === c.id ? "Processing..." : "Accept & Unlock Workspace"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Connections */}
      {connects.length > 0 && (
        <section>
          <h3 style={{ borderBottom: "1px solid var(--stroke)", paddingBottom: 12, marginBottom: 20, color: "var(--text-bright)", fontSize: 18 }}>
            Connection Requests
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {connects.map(req => (
              <div key={req.id} className="glass" style={{ padding: 20, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: 16, color: "var(--text-bright)" }}>
                    <span style={{ color: "var(--accent-emerald)" }}>{req.sender?.codename || "Unknown"}</span> requested to connect
                  </h4>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--muted)" }}>
                    {req.sender?.professional_title} &middot; {req.sender?.industry_category}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="pill-btn skip" onClick={() => handleConnect(req.id, "declined")} disabled={loading !== null} style={{ padding: "8px 16px" }}>
                    Decline
                  </button>
                  <button className="pill-btn" onClick={() => handleConnect(req.id, "accepted")} disabled={loading !== null} style={{ background: "var(--accent-emerald)", color: "#000", fontWeight: 700, padding: "8px 16px" }}>
                    {loading === req.id ? "..." : "Accept"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Alerts */}
      {roleMatches.length > 0 && (
        <section>
          <h3 style={{ borderBottom: "1px solid var(--stroke)", paddingBottom: 12, marginBottom: 20, color: "var(--text-bright)", fontSize: 18 }}>
            System Alerts
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="glass" style={{ padding: 20, borderRadius: 16, borderLeft: "4px solid var(--accent-amber)" }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 16, color: "var(--text-bright)" }}>
                Role Match Detected!
              </h4>
              <p style={{ margin: 0, fontSize: 14, color: "var(--muted)" }}>
                {roleMatches.length} operators recently joined who are looking for someone in your category. Head over to the Discover page to check them out!
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
