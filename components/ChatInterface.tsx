"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, proposePartnership, respondToPartnership } from "@/lib/actions";
import type { Message, PartnershipContract } from "@/lib/types";
import { CONTRACT_TEMPLATES } from "@/lib/types";

type Connection = {
  connect_request_id: string;
  partner: {
    id: string;
    codename: string;
    professional_title: string | null;
  };
};

export function ChatInterface({
  currentUserId,
  connections,
}: {
  currentUserId: string;
  connections: Connection[];
}) {
  const [activePartner, setActivePartner] = useState<Connection | null>(connections[0] || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contracts, setContracts] = useState<PartnershipContract[]>([]);
  const [inputText, setInputText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showPropose, setShowPropose] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof CONTRACT_TEMPLATES)[number]>(CONTRACT_TEMPLATES[0]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!activePartner) return;

    const fetchChat = async () => {
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${activePartner.partner.id}),and(sender_id.eq.${activePartner.partner.id},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      if (msgs) setMessages(msgs as Message[]);

      const { data: ctrs } = await supabase
        .from("partnership_contracts")
        .select("*")
        .eq("connect_request_id", activePartner.connect_request_id);

      if (ctrs) setContracts(ctrs as PartnershipContract[]);
      // #region agent log
      fetch("http://127.0.0.1:7518/ingest/4bb1dd6d-a36d-4f55-9d17-5bde7c70d01a", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "7345ba" },
        body: JSON.stringify({
          sessionId: "7345ba",
          runId: "pre-fix",
          hypothesisId: "D",
          location: "ChatInterface.tsx:fetchChat",
          message: "loaded contracts for thread",
          data: {
            count: (ctrs ?? []).length,
            pendingAsRecipient: (ctrs ?? []).filter(
              (c: PartnershipContract) => c.status === "pending" && c.proposed_to === currentUserId
            ).length,
            hasAcceptAction: false,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    };

    fetchChat();

    const channel = supabase
      .channel(`chat_${activePartner.connect_request_id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new as Message;
          const matches =
            (newMsg.sender_id === currentUserId && newMsg.receiver_id === activePartner.partner.id) ||
            (newMsg.sender_id === activePartner.partner.id && newMsg.receiver_id === currentUserId);
          // #region agent log
          fetch("http://127.0.0.1:7518/ingest/4bb1dd6d-a36d-4f55-9d17-5bde7c70d01a", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "7345ba" },
            body: JSON.stringify({
              sessionId: "7345ba",
              runId: "pre-fix",
              hypothesisId: "B",
              location: "ChatInterface.tsx:messages-insert",
              message: "realtime messages INSERT",
              data: {
                matches,
                hasId: Boolean(newMsg?.id),
                senderIsMe: newMsg.sender_id === currentUserId,
              },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
          // #endregion
          if (matches) {
            setMessages((prev) => (prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "partnership_contracts" },
        (payload) => {
          const newCtr = payload.new as PartnershipContract;
          // #region agent log
          fetch("http://127.0.0.1:7518/ingest/4bb1dd6d-a36d-4f55-9d17-5bde7c70d01a", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "7345ba" },
            body: JSON.stringify({
              sessionId: "7345ba",
              runId: "pre-fix",
              hypothesisId: "E",
              location: "ChatInterface.tsx:contracts-insert",
              message: "realtime contracts INSERT",
              data: {
                sameConnect: newCtr.connect_request_id === activePartner.connect_request_id,
                iAmRecipient: newCtr.proposed_to === currentUserId,
                status: newCtr.status,
              },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
          // #endregion
          if (newCtr.connect_request_id === activePartner.connect_request_id) {
            setContracts((prev) => (prev.some((c) => c.id === newCtr.id) ? prev : [...prev, newCtr]));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "partnership_contracts" },
        (payload) => {
          const next = payload.new as PartnershipContract;
          // #region agent log
          fetch("http://127.0.0.1:7518/ingest/4bb1dd6d-a36d-4f55-9d17-5bde7c70d01a", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "7345ba" },
            body: JSON.stringify({
              sessionId: "7345ba",
              runId: "post-fix",
              hypothesisId: "E",
              location: "ChatInterface.tsx:contracts-update",
              message: "realtime contracts UPDATE",
              data: { id: next.id, status: next.status },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
          // #endregion
          setContracts((prev) => prev.map((c) => (c.id === next.id ? next : c)));
        }
      )
      .subscribe((status, err) => {
        // #region agent log
        fetch("http://127.0.0.1:7518/ingest/4bb1dd6d-a36d-4f55-9d17-5bde7c70d01a", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "7345ba" },
          body: JSON.stringify({
            sessionId: "7345ba",
            runId: "pre-fix",
            hypothesisId: "A",
            location: "ChatInterface.tsx:subscribe",
            message: "realtime subscribe status",
            data: { status, err: err ? String(err) : null, channel: `chat_${activePartner.connect_request_id}` },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
      });

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePartner, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, contracts]);

  const handleSend = () => {
    if (!inputText.trim() || !activePartner) return;
    const txt = inputText;
    setInputText("");
    startTransition(async () => {
      const result = await sendMessage(activePartner.partner.id, txt);
      if (result.message) {
        setMessages((prev) =>
          prev.some((m) => m.id === result.message!.id) ? prev : [...prev, result.message!]
        );
      }
      // #region agent log
      fetch("http://127.0.0.1:7518/ingest/4bb1dd6d-a36d-4f55-9d17-5bde7c70d01a", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "7345ba" },
        body: JSON.stringify({
          sessionId: "7345ba",
          runId: "post-fix",
          hypothesisId: "C",
          location: "ChatInterface.tsx:handleSend",
          message: "sendMessage finished",
          data: { ok: !result?.error, error: result?.error ?? null, localAppend: Boolean(result.message) },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    });
  };

  const submitContract = (formData: FormData) => {
    formData.append("connect_request_id", activePartner!.connect_request_id);
    formData.append("proposed_to", activePartner!.partner.id);
    startTransition(async () => {
      const res = await proposePartnership(formData);
      if (res?.error) alert(res.error);
      if (res?.contract) {
        setContracts((prev) => (prev.some((c) => c.id === res.contract!.id) ? prev : [...prev, res.contract!]));
      }
      setShowPropose(false);
    });
  };

  const handleContractDecision = (contractId: string, decision: "accepted" | "declined") => {
    startTransition(async () => {
      const res = await respondToPartnership(contractId, decision);
      // #region agent log
      fetch("http://127.0.0.1:7518/ingest/4bb1dd6d-a36d-4f55-9d17-5bde7c70d01a", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "7345ba" },
        body: JSON.stringify({
          sessionId: "7345ba",
          runId: "post-fix",
          hypothesisId: "D",
          location: "ChatInterface.tsx:handleContractDecision",
          message: "respondToPartnership finished",
          data: { ok: !res?.error, error: res?.error ?? null, decision },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      if (res?.error) {
        alert(res.error);
        return;
      }
      setContracts((prev) => prev.map((c) => (c.id === contractId ? { ...c, status: decision } : c)));
    });
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: "flex",
        height: "680px",
        overflow: "hidden",
        boxShadow: "var(--shadow)",
        border: "1px solid var(--stroke)",
      }}
    >
      {/* Active Partner Sidebar */}
      <div
        style={{
          width: 300,
          borderRight: "1px solid var(--stroke)",
          background: "var(--surface-inset)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--stroke)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "var(--muted)", textTransform: "uppercase" }}>
            Partners ({connections.length})
          </span>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {connections.map((conn) => {
            const isActive = activePartner?.partner.id === conn.partner.id;
            const initial = conn.partner.codename.charAt(0).toUpperCase();

            return (
              <div
                key={conn.partner.id}
                onClick={() => setActivePartner(conn)}
                style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  background: isActive ? "rgba(139, 92, 246, 0.16)" : "transparent",
                  borderLeft: isActive ? "3px solid var(--accent-2)" : "3px solid transparent",
                  borderBottom: "1px solid var(--stroke-subtle)",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ position: "relative" }}>
                  <div className="avatar-badge sm gradient-violet">
                    <span className="avatar-initial">{initial}</span>
                  </div>
                  <span className="status-dot" />
                </div>
                <div style={{ overflow: "hidden" }}>
                  <h4 style={{ margin: "0 0 2px 0", fontSize: 15, color: isActive ? "#fff" : "var(--text)" }}>
                    {conn.partner.codename}
                  </h4>
                  <p className="sub" style={{ margin: 0, fontSize: "0.8rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {conn.partner.professional_title || "Verified Builder"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--surface-card)" }}>
        {activePartner ? (
          <>
            {/* Chat Top Header */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--stroke)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(18, 20, 32, 0.65)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="avatar-badge sm gradient-sunset">
                  <span className="avatar-initial">{activePartner.partner.codename.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, color: "var(--text-bright)" }}>
                    Chat with {activePartner.partner.codename}
                  </h3>
                  <span style={{ fontSize: 12, color: "var(--accent-4)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--accent-4)", boxShadow: "0 0 8px var(--accent-4)" }} />
                    Encrypted Realtime Channel
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="pill-btn accept"
                onClick={() => setShowPropose(true)}
                style={{ fontSize: 13, padding: "8px 16px" }}
              >
                🤝 Propose Partnership
              </button>
            </div>

            {/* Message Stream */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {messages.length === 0 && contracts.length === 0 ? (
                <div style={{ margin: "auto", textAlign: "center", color: "var(--dim)", padding: 24 }}>
                  <p style={{ margin: "0 0 6px 0", fontSize: 16, color: "var(--muted)" }}>
                    This is the start of your encrypted dialogue with <strong>{activePartner.partner.codename}</strong>.
                  </p>
                  <p style={{ margin: 0, fontSize: 13 }}>Send a message or propose a milestone contract below.</p>
                </div>
              ) : null}

              {messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                return (
                  <div key={msg.id} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                    <div
                      style={{
                        background: isMe ? "linear-gradient(135deg, #ff3d6e 0%, #8b5cf6 100%)" : "rgba(255, 255, 255, 0.07)",
                        border: isMe ? "none" : "1px solid var(--stroke)",
                        color: isMe ? "#ffffff" : "var(--text)",
                        padding: "12px 18px",
                        borderRadius: 18,
                        borderBottomRightRadius: isMe ? 4 : 18,
                        borderBottomLeftRadius: !isMe ? 4 : 18,
                        boxShadow: isMe ? "0 4px 16px rgba(255, 61, 110, 0.28)" : "var(--shadow-sm)",
                        fontSize: 15,
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {/* Holographic Partnership Contracts */}
              {contracts.map((ctr) => (
                <div
                  key={ctr.id}
                  style={{
                    alignSelf: "center",
                    width: "100%",
                    maxWidth: 440,
                    background: "rgba(18, 20, 32, 0.90)",
                    backdropFilter: "blur(20px)",
                    border: "1.5px solid var(--stroke-cyan)",
                    borderRadius: "var(--radius-md)",
                    padding: 20,
                    textAlign: "center",
                    boxShadow: "0 12px 36px rgba(0, 0, 0, 0.6), var(--glow-cyan)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>🤝</span>
                    <h4 style={{ margin: 0, fontSize: 18, color: "var(--text-bright)", fontFamily: "var(--font-display)" }}>
                      Partnership Proposed
                    </h4>
                  </div>
                  {ctr.contract_type && ctr.contract_type !== "custom" && (
                    <div style={{ marginBottom: 10 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          padding: "4px 10px",
                          background: "rgba(139, 92, 246, 0.15)",
                          border: "1px solid rgba(139, 92, 246, 0.35)",
                          color: "#c4b5fd",
                          borderRadius: "var(--radius-full)",
                        }}
                      >
                        {ctr.contract_type.replace(/_/g, " ")}
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      background: "var(--surface-inset)",
                      border: "1px solid var(--stroke-subtle)",
                      borderRadius: 10,
                      padding: "12px 16px",
                      margin: "0 0 14px 0",
                      color: "#cbd5e1",
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {ctr.deliverables}
                  </div>
                  <div
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 800,
                      color: "var(--accent-3)",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.02em",
                      marginBottom: 8,
                    }}
                  >
                    ${ctr.price_amount}
                  </div>
                  {ctr.price_amount > 0 && (
                    <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: 12 }}>
                      Platform {ctr.platform_fee_pct}% · You {ctr.revenue_split_a}% · Partner {ctr.revenue_split_b}%
                    </div>
                  )}
                  <div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        padding: "6px 14px",
                        background: "rgba(6, 182, 212, 0.15)",
                        border: "1px solid rgba(6, 182, 212, 0.40)",
                        color: "#67e8f9",
                        borderRadius: "var(--radius-full)",
                        boxShadow: "0 0 12px rgba(6, 182, 212, 0.20)",
                      }}
                    >
                      Status: {ctr.status}
                    </span>
                    {ctr.status === "pending" && ctr.proposed_to === currentUserId ? (
                      <div className="btn-row left" style={{ marginTop: 14, justifyContent: "center" }}>
                        <button
                          type="button"
                          className="pill-btn skip"
                          disabled={isPending}
                          onClick={() => handleContractDecision(ctr.id, "declined")}
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          className="pill-btn accept"
                          disabled={isPending}
                          onClick={() => handleContractDecision(ctr.id, "accepted")}
                        >
                          Accept
                        </button>
                      </div>
                    ) : null}
                    {ctr.status === "pending" && ctr.proposed_by === currentUserId ? (
                      <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--muted)" }}>
                        Waiting for {activePartner.partner.codename} to accept. You cannot accept your own proposal.
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Proposal Drawer or Message Input */}
            {showPropose ? (
              <div
                style={{
                  padding: 24,
                  borderTop: "1px solid var(--stroke)",
                  background: "var(--surface-solid)",
                  backdropFilter: "blur(20px)",
                  maxHeight: 420,
                  overflowY: "auto",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h4 style={{ margin: 0, fontSize: 16, color: "var(--text-bright)" }}>⚡ Micro-Contract &ldquo;Fayda&rdquo;</h4>
                  <button
                    type="button"
                    onClick={() => setShowPropose(false)}
                    className="ghost-btn"
                    style={{ padding: "4px 10px", fontSize: 13 }}
                  >
                    ✕ Cancel
                  </button>
                </div>

                {/* Template Selector */}
                <div style={{ marginBottom: 16 }}>
                  <span className="label" style={{ marginBottom: 8, display: "block" }}>Contract Template</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {CONTRACT_TEMPLATES.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        className={selectedTemplate.key === t.key ? "chip selected" : "chip"}
                        onClick={() => setSelectedTemplate(t)}
                        style={{ fontSize: 13 }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ color: "var(--dim)", fontSize: 12, marginTop: 6 }}>
                    {selectedTemplate.description}
                  </p>
                </div>

                {/* Revenue Split Visualization */}
                {selectedTemplate.key !== "portfolio_only" && (
                  <div
                    style={{
                      background: "var(--surface-inset)",
                      border: "1px solid var(--stroke-subtle)",
                      borderRadius: "var(--radius-sm)",
                      padding: 14,
                      marginBottom: 14,
                    }}
                  >
                    <span className="label" style={{ marginBottom: 8, display: "block", fontSize: 11 }}>Revenue Split Breakdown</span>
                    <div style={{ display: "flex", gap: 6, height: 24, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
                      <div style={{ flex: selectedTemplate.platformFee, background: "var(--accent)", borderRadius: "8px 0 0 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>
                        {selectedTemplate.platformFee}%
                      </div>
                      <div style={{ flex: selectedTemplate.splitA * (100 - selectedTemplate.platformFee) / 100, background: "var(--accent-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>
                        {Math.round(selectedTemplate.splitA * (100 - selectedTemplate.platformFee) / 100)}%
                      </div>
                      <div style={{ flex: selectedTemplate.splitB * (100 - selectedTemplate.platformFee) / 100, background: "var(--accent-3)", borderRadius: "0 8px 8px 0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>
                        {Math.round(selectedTemplate.splitB * (100 - selectedTemplate.platformFee) / 100)}%
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)" }}>
                      <span>🏢 Platform ({selectedTemplate.platformFee}%)</span>
                      <span>👤 You ({selectedTemplate.splitA}% of {100 - selectedTemplate.platformFee}%)</span>
                      <span>🤝 Partner ({selectedTemplate.splitB}% of {100 - selectedTemplate.platformFee}%)</span>
                    </div>
                  </div>
                )}

                <form action={submitContract} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <input type="hidden" name="contract_type" value={selectedTemplate.key} />
                  <input type="hidden" name="revenue_split_a" value={selectedTemplate.splitA} />
                  <input type="hidden" name="revenue_split_b" value={selectedTemplate.splitB} />
                  <input type="hidden" name="platform_fee_pct" value={selectedTemplate.platformFee} />
                  <label>
                    <span className="label">Price / Budget ($)</span>
                    <input name="price_amount" type="number" min={0} required placeholder={selectedTemplate.key === "portfolio_only" ? "0" : "E.g., 500"} className="input" style={{ marginBottom: 0 }} defaultValue={selectedTemplate.key === "portfolio_only" ? 0 : undefined} />
                  </label>
                  <label>
                    <span className="label">Deliverables / Scope</span>
                    <textarea name="deliverables" required placeholder="What exact milestones or outcomes will be delivered?" rows={3} className="input" style={{ marginBottom: 0 }} />
                  </label>
                  <button type="submit" disabled={isPending} className="primary-btn" style={{ marginTop: 4 }}>
                    {isPending ? "Sending..." : `Send ${selectedTemplate.label} Proposal`}
                  </button>
                </form>
              </div>
            ) : (
              <div
                style={{
                  padding: "16px 20px",
                  borderTop: "1px solid var(--stroke)",
                  display: "flex",
                  gap: 12,
                  background: "var(--surface-inset)",
                  alignItems: "center",
                }}
              >
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="input"
                  style={{ flex: 1, margin: 0 }}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputText.trim() || isPending}
                  className="primary-btn inline"
                  style={{ height: 48, padding: "0 24px" }}
                >
                  Send
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dim)" }}>
            Select a partnership to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

