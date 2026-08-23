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

    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    const startRealtime = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasAccessToken = Boolean(sessionData.session?.access_token);
      if (sessionData.session?.access_token) {
        await supabase.realtime.setAuth(sessionData.session.access_token);
      }
      // #region agent log
      fetch("http://127.0.0.1:7518/ingest/4bb1dd6d-a36d-4f55-9d17-5bde7c70d01a", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "7345ba" },
        body: JSON.stringify({
          sessionId: "7345ba",
          runId: "post-fix",
          hypothesisId: "A",
          location: "ChatInterface.tsx:startRealtime",
          message: "attaching auth before subscribe",
          data: { hasAccessToken },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      if (cancelled) return;

      channel = supabase
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
    };

    void startRealtime();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
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
    <>
      <style>{`
        .chat-container-responsive {
          display: flex;
          height: 100%;
          width: 100%;
          overflow: hidden;
          box-shadow: var(--shadow);
          border: 1px solid #000000;
          border-radius: 24px;
        }
        .chat-sidebar {
          width: 320px;
          border-right: 1px solid #000000;
          background: #f4f4f5;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .chat-container-responsive {
            flex-direction: column;
            border-radius: 16px;
          }
          .chat-sidebar {
            width: 100%;
            height: 140px;
            border-right: none;
            border-bottom: 1px solid #000000;
            flex-shrink: 0;
          }
        }
      `}</style>
      <div className="chat-container-responsive match-card">
        {/* Active Partner Sidebar */}
        <div className="chat-sidebar">
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #000000",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "#52525b", textTransform: "uppercase" }}>
              Active Comm Links ({connections.length})
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
                    padding: "16px 24px",
                    cursor: "pointer",
                    background: isActive ? "#f4f4f5" : "transparent",
                    borderLeft: isActive ? "4px solid #000000" : "4px solid transparent",
                    borderBottom: "1px solid #000000",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f4f4f5", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #000000", color: "#000000", fontWeight: 700, fontSize: 18, boxShadow: isActive ? "0 0 16px #000000" : "none" }}>
                      {initial}
                    </div>
                    <span style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: "50%", background: "#000000", border: "2px solid #080810" }} />
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: 16, fontWeight: 800, color: isActive ? "#fff" : "var(--text)" }}>
                      {conn.partner.codename}
                    </h4>
                    <p style={{ margin: 0, fontSize: 13, color: "#52525b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "var(--font-mono)" }}>
                      {conn.partner.professional_title || "Verified Builder"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "rgba(8, 8, 16, 0.6)" }}>
          {activePartner ? (
            <>
              {/* Chat Top Header */}
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid #000000",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "linear-gradient(180deg, #f4f4f5 0%, transparent 100%)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f4f4f5", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #000000", color: "#000000", fontWeight: 700, fontSize: 20 }}>
                    {activePartner.partner.codename.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: 18, fontWeight: 800, color: "#000000" }}>
                      Chat with {activePartner.partner.codename}
                    </h3>
                    <span style={{ fontSize: 12, color: "#000000", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                      <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#000000", boxShadow: "0 0 8px #000000" }} />
                      Encrypted Realtime Channel
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="pill-btn"
                  onClick={() => setShowPropose(true)}
                  style={{ fontSize: 13, padding: "8px 16px", background: "#000000", color: "#000", fontWeight: 700 }}
                >
                  Propose Partnership ⚡
                </button>
              </div>

              {/* Message Stream */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                {messages.length === 0 && contracts.length === 0 ? (
                  <div style={{ margin: "auto", textAlign: "center", color: "var(--dim)", padding: 40, background: "rgba(255,255,255,0.02)", borderRadius: 24, border: "1px solid #000000" }}>
                    <div style={{ fontSize: 32, marginBottom: 16 }}>🔒</div>
                    <p style={{ margin: "0 0 8px 0", fontSize: 16, color: "#000000", fontWeight: 700 }}>
                      Secure connection established with {activePartner.partner.codename}.
                    </p>
                    <p style={{ margin: 0, fontSize: 14, color: "#52525b" }}>Send a message to sync up, or propose a milestone contract to start building.</p>
                  </div>
                ) : null}

                {messages.map((msg) => {
                  const isMe = msg.sender_id === currentUserId;
                  return (
                    <div key={msg.id} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                      <div className={isMe ? "bubble-me" : "bubble-them"} style={{ 
                        fontSize: 15, 
                        lineHeight: 1.6, 
                        wordBreak: "break-word",
                        background: isMe ? "#f4f4f5" : "#f4f4f5",
                        border: isMe ? "1px solid #000000" : "1px solid #000000",
                        color: "#000000",
                        padding: "14px 20px",
                        borderRadius: 24,
                        borderBottomRightRadius: isMe ? 4 : 24,
                        borderBottomLeftRadius: isMe ? 24 : 4,
                        boxShadow: isMe ? "0 4px 24px #000000" : "none"
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}

                {/* Holographic Partnership Contracts */}
                {contracts.map((ctr) => (
                  <div
                    key={ctr.id}
                    className=""
                    style={{
                      alignSelf: "center",
                      width: "100%",
                      maxWidth: 480,
                      borderRadius: 24,
                      padding: 32,
                      textAlign: "center",
                      border: ctr.status === "accepted" ? "1px solid #000000" : "1px solid #000000",
                      background: ctr.status === "accepted" ? "#f4f4f5" : "rgba(255,255,255,0.02)",
                      boxShadow: ctr.status === "accepted" ? "0 8px 32px #f4f4f5" : "none",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    {ctr.status === "accepted" && (
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#000000", boxShadow: "0 0 16px #000000" }} />
                    )}
                    
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
                      <span style={{ fontSize: 24 }}>🤝</span>
                      <h4 style={{ margin: 0, fontSize: 20, color: "#000000", fontWeight: 800 }}>
                        {ctr.status === "accepted" ? "Workspace Unlocked" : "Partnership Proposed"}
                      </h4>
                    </div>
                    
                    {ctr.contract_type && ctr.contract_type !== "custom" && (
                      <div style={{ marginBottom: 16 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "4px 12px",
                            background: "#f4f4f5",
                            border: "1px solid #000000",
                            color: "#d8b4fe",
                            borderRadius: 32,
                          }}
                        >
                          {ctr.contract_type.replace(/_/g, " ")}
                        </span>
                      </div>
                    )}
                    
                    <div
                      style={{
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid #000000",
                        borderRadius: 16,
                        padding: 16,
                        margin: "0 0 20px 0",
                        color: "#52525b",
                        fontSize: 14,
                        lineHeight: 1.6,
                        textAlign: "left"
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#000000", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Deliverables / Scope</div>
                      {ctr.deliverables}
                    </div>
                    
                    <div
                      style={{
                        fontSize: 32,
                        fontWeight: 800,
                        color: ctr.status === "accepted" ? "#000000" : "#000000",
                        letterSpacing: "-0.02em",
                        marginBottom: 8,
                      }}
                    >
                      ${ctr.price_amount}
                    </div>
                    
                    {ctr.price_amount > 0 && (
                      <div style={{ fontSize: 12, color: "var(--dim)", marginBottom: 20, display: "flex", justifyContent: "center", gap: 12, fontFamily: "var(--font-mono)" }}>
                        <span>Platform {ctr.platform_fee_pct}%</span>
                        <span>You {ctr.revenue_split_a}%</span>
                        <span>Partner {ctr.revenue_split_b}%</span>
                      </div>
                    )}
                    
                    <div>
                      {ctr.status === "pending" && String(ctr.proposed_to) === String(currentUserId) ? (
                        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                          <button
                            type="button"
                            className="pill-btn skip"
                            style={{ flex: 1 }}
                            disabled={isPending}
                            onClick={() => handleContractDecision(ctr.id, "declined")}
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            className="pill-btn"
                            style={{ flex: 1, background: "#000000", color: "#000", fontWeight: 700 }}
                            disabled={isPending}
                            onClick={() => handleContractDecision(ctr.id, "accepted")}
                          >
                            Accept
                          </button>
                        </div>
                      ) : null}
                      {ctr.status === "accepted" ? (
                        <a
                          href={`/workspace/${ctr.id}`}
                          className="pill-btn"
                          style={{ display: "block", marginTop: 24, textDecoration: "none", background: "#000000", color: "#000", fontWeight: 800, padding: 16, borderRadius: 32 }}
                        >
                          Enter Workspace 🚀
                        </a>
                      ) : null}
                      {ctr.status === "pending" && String(ctr.proposed_by) === String(currentUserId) ? (
                        <p style={{ margin: "16px 0 0", fontSize: 13, color: "#52525b", background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: 8 }}>
                          Waiting for {activePartner.partner.codename} to respond.
                        </p>
                      ) : null}
                      {ctr.status === "declined" ? (
                        <p style={{ margin: "16px 0 0", fontSize: 14, color: "#000000", fontWeight: 700 }}>
                          Proposal Declined
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
                  className=""
                  style={{
                    padding: 32,
                    borderTop: "1px solid #000000",
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                    maxHeight: 500,
                    overflowY: "auto",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h4 style={{ margin: 0, fontSize: 18, color: "#000000", fontWeight: 800 }}>⚡ Micro-Contract Proposal</h4>
                    <button
                      type="button"
                      onClick={() => setShowPropose(false)}
                      className="pill-btn skip"
                      style={{ padding: "8px 16px", fontSize: 13 }}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Template Selector */}
                  <div style={{ marginBottom: 24 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 12 }}>Select Architecture</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {CONTRACT_TEMPLATES.map((t) => (
                        <button
                          key={t.key}
                          type="button"
                          className={selectedTemplate.key === t.key ? "chip selected glass-purple" : "chip"}
                          onClick={() => setSelectedTemplate(t)}
                          style={{ fontSize: 13, padding: "8px 16px", borderRadius: 32, background: selectedTemplate.key === t.key ? "#000000" : "transparent", color: selectedTemplate.key === t.key ? "#fff" : "var(--text)" }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <p style={{ color: "var(--dim)", fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>
                      {selectedTemplate.description}
                    </p>
                  </div>

                  <form action={submitContract} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <input type="hidden" name="contract_type" value={selectedTemplate.key} />
                    <input type="hidden" name="revenue_split_a" value={selectedTemplate.splitA} />
                    <input type="hidden" name="revenue_split_b" value={selectedTemplate.splitB} />
                    <input type="hidden" name="platform_fee_pct" value={selectedTemplate.platformFee} />
                    
                    <label style={{ display: "block" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Project Budget ($)</span>
                      <input name="price_amount" type="number" min={0} required placeholder={selectedTemplate.key === "portfolio_only" ? "0" : "E.g., 500"} className="input glass" style={{ width: "100%", fontSize: 16, padding: 16, borderRadius: 16 }} defaultValue={selectedTemplate.key === "portfolio_only" ? 0 : undefined} />
                    </label>
                    
                    <label style={{ display: "block" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Milestones & Scope</span>
                      <textarea name="deliverables" required placeholder="Outline exactly what needs to be delivered..." rows={4} className="input glass" style={{ width: "100%", fontSize: 15, padding: 16, borderRadius: 16, resize: "vertical" }} />
                    </label>
                    
                    <button type="submit" disabled={isPending} className="pill-btn" style={{ background: "#000000", color: "#000", fontWeight: 800, padding: 16, borderRadius: 32, fontSize: 15, marginTop: 8 }}>
                      {isPending ? "Encrypting Proposal..." : `Transmit ${selectedTemplate.label} Proposal`}
                    </button>
                  </form>
                </div>
              ) : (
                <div
                  style={{
                    padding: "20px 24px",
                    borderTop: "1px solid #000000",
                    display: "flex",
                    gap: 16,
                    background: "rgba(255,255,255,0.02)",
                    alignItems: "center",
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                  }}
                >
                  <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Transmit secure message..."
                    className="input glass"
                    style={{ flex: 1, margin: 0, borderRadius: 32, padding: "12px 20px" }}
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!inputText.trim() || isPending}
                    className="pill-btn"
                    style={{ height: 48, padding: "0 32px", background: inputText.trim() ? "#000000" : "var(--surface)", color: inputText.trim() ? "#000" : "#52525b", fontWeight: 800, borderRadius: 32, transition: "all 0.2s" }}
                  >
                    Send
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--dim)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ fontSize: 48, marginBottom: 24, opacity: 0.5 }}>📡</div>
              <p style={{ fontSize: 18, color: "#000000", fontWeight: 700, margin: "0 0 8px 0" }}>No active comm links selected</p>
              <p style={{ fontSize: 14, margin: 0 }}>Select a partner from the sidebar to establish a connection.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

