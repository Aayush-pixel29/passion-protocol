"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, proposePartnership } from "@/lib/actions";
import type { Message, PartnershipContract } from "@/lib/types";

type Connection = {
  connect_request_id: string;
  partner: {
    id: string;
    codename: string;
    professional_title: string | null;
  };
};

export function ChatInterface({ currentUserId, connections }: { currentUserId: string, connections: Connection[] }) {
  const [activePartner, setActivePartner] = useState<Connection | null>(connections[0] || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contracts, setContracts] = useState<PartnershipContract[]>([]);
  const [inputText, setInputText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showPropose, setShowPropose] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!activePartner) return;
    
    const fetchChat = async () => {
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${activePartner.partner.id}),and(sender_id.eq.${activePartner.partner.id},receiver_id.eq.${currentUserId})`)
        .order("created_at", { ascending: true });
        
      if (msgs) setMessages(msgs as Message[]);

      const { data: ctrs } = await supabase
        .from("partnership_contracts")
        .select("*")
        .eq("connect_request_id", activePartner.connect_request_id);

      if (ctrs) setContracts(ctrs as PartnershipContract[]);
    };

    fetchChat();

    const channel = supabase
      .channel(`chat_${activePartner.connect_request_id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_id === currentUserId && newMsg.receiver_id === activePartner.partner.id) ||
            (newMsg.sender_id === activePartner.partner.id && newMsg.receiver_id === currentUserId)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "partnership_contracts" },
        (payload) => {
          const newCtr = payload.new as PartnershipContract;
          if (newCtr.connect_request_id === activePartner.connect_request_id) {
            setContracts((prev) => [...prev, newCtr]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activePartner, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, contracts]);

  const handleSend = () => {
    if (!inputText.trim() || !activePartner) return;
    const txt = inputText;
    setInputText("");
    startTransition(async () => {
      await sendMessage(activePartner.partner.id, txt);
    });
  };

  const submitContract = (formData: FormData) => {
    formData.append("connect_request_id", activePartner!.connect_request_id);
    formData.append("proposed_to", activePartner!.partner.id);
    startTransition(async () => {
      const res = await proposePartnership(formData);
      if (res?.error) alert(res.error);
      setShowPropose(false);
    });
  };

  return (
    <div style={{ display: "flex", gap: 24, height: "600px", border: "1px solid var(--stroke)", borderRadius: 12, overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 280, borderRight: "1px solid var(--stroke)", background: "var(--bg)", overflowY: "auto" }}>
        {connections.map(conn => (
          <div 
            key={conn.partner.id}
            onClick={() => setActivePartner(conn)}
            style={{ 
              padding: "16px 20px", 
              cursor: "pointer", 
              background: activePartner?.partner.id === conn.partner.id ? "rgba(0,0,0,0.04)" : "transparent",
              borderBottom: "1px solid var(--stroke)"
            }}
          >
            <h4 style={{ margin: 0 }}>{conn.partner.codename}</h4>
            <p className="sub" style={{ margin: 0, fontSize: "0.85rem" }}>{conn.partner.professional_title}</p>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff" }}>
        {activePartner ? (
          <>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--stroke)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Chat with {activePartner.partner.codename}</h3>
              <button className="primary-btn inline" onClick={() => setShowPropose(true)}>
                Propose Partnership
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.map(msg => {
                const isMe = msg.sender_id === currentUserId;
                return (
                  <div key={msg.id} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                    <div style={{ 
                      background: isMe ? "var(--accent)" : "#f1f5f9", 
                      color: isMe ? "#fff" : "var(--text)", 
                      padding: "10px 16px", 
                      borderRadius: 16,
                      borderBottomRightRadius: isMe ? 4 : 16,
                      borderBottomLeftRadius: !isMe ? 4 : 16
                    }}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              
              {contracts.map(ctr => (
                <div key={ctr.id} style={{ alignSelf: "center", width: "100%", maxWidth: 400, background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 12, padding: 16, textAlign: "center" }}>
                  <h4 style={{ margin: "0 0 8px 0" }}>🤝 Partnership Proposed</h4>
                  <p className="sub" style={{ margin: "0 0 12px 0" }}>{ctr.deliverables}</p>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent)" }}>
                    ${ctr.price_amount}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, padding: "4px 8px", background: "#e2e8f0", borderRadius: 4 }}>
                      Status: {ctr.status}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {showPropose ? (
              <div style={{ padding: 24, borderTop: "1px solid var(--stroke)", background: "#fafafa" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h4 style={{ margin: 0 }}>Propose Terms</h4>
                  <button onClick={() => setShowPropose(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)" }}>Cancel</button>
                </div>
                <form action={submitContract} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <label>
                    <span className="label">Price / Budget ($)</span>
                    <input name="price_amount" type="number" min={0} required placeholder="E.g., 500" />
                  </label>
                  <label>
                    <span className="label">Deliverables / Scope</span>
                    <textarea name="deliverables" required placeholder="What exactly is being delivered?" rows={2} />
                  </label>
                  <button type="submit" disabled={isPending} className="primary-btn">
                    {isPending ? "Sending..." : "Send Proposal"}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ padding: 16, borderTop: "1px solid var(--stroke)", display: "flex", gap: 12 }}>
                <input 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  style={{ flex: 1, margin: 0 }}
                />
                <button 
                  onClick={handleSend} 
                  disabled={!inputText.trim() || isPending}
                  className="primary-btn inline"
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
