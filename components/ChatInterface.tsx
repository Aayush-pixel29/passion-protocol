"use client";

import React, { useState, useEffect, useRef, useTransition, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, proposePartnership, respondToPartnership } from "@/lib/actions";
import Link from "next/link";
import type { Message, PartnershipContract, Profile, VibeAnswers, Project } from "@/lib/types";
import { CONTRACT_TEMPLATES } from "@/lib/types";
import { AvatarSVG } from "./Avatar";
import { VibeGraph } from "./VibeGraph";
import {
  Flame,
  Send,
  Shield,
  FileText,
  Smile,
  Search,
  CheckCheck,
  X,
  Zap,
  Info,
} from "lucide-react";

export interface ChatConnection {
  connect_request_id: string;
  partner: Partial<Profile> & {
    id: string;
    codename: string;
    professional_title?: string | null;
  };
  vibe?: VibeAnswers | null;
  project?: Project | null;
  synergyScore?: number;
  lastMessage?: {
    content: string;
    created_at: string;
    sender_id: string;
  } | null;
}

const QUICK_EMOJIS = ["🔥", "🚀", "⚡", "👍", "❤️", "🤝", "💡", "💻", "✨", "🎯"];

const ICEBREAKER_PROMPTS = [
  "🚀 Propose a 48-hour pilot sprint for our MVP",
  "🎨 Can you share your design system or portfolio?",
  "⚡ What is our tech stack & deployment workflow?",
  "💡 Let's schedule a 15-min alignment sync to review roles",
];

export function ChatInterface({
  currentUserId,
  connections,
}: {
  currentUserId: string;
  connections: ChatConnection[];
}) {
  const [activePartner, setActivePartner] = useState<ChatConnection | null>(connections[0] || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contracts, setContracts] = useState<PartnershipContract[]>([]);
  const [inputText, setInputText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showPropose, setShowPropose] = useState(false);
  const [showIntelDrawer, setShowIntelDrawer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarFilter, setSidebarFilter] = useState<"all" | "high" | "proposals">("all");
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof CONTRACT_TEMPLATES)[number]>(CONTRACT_TEMPLATES[0]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Sync active partner if connections list changes
  useEffect(() => {
    if (!activePartner && connections.length > 0) {
      setActivePartner(connections[0]);
    }
  }, [connections, activePartner]);

  // Fetch messages and contracts for active partner
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
    };

    fetchChat();

    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    const startRealtime = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.access_token) {
        await supabase.realtime.setAuth(sessionData.session.access_token);
      }
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
            setContracts((prev) => prev.map((c) => (c.id === next.id ? next : c)));
          }
        )
        .subscribe();
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

  const handleSend = (textToSend?: string) => {
    const raw = textToSend || inputText;
    if (!raw.trim() || !activePartner) return;
    const txt = raw.trim();
    setInputText("");
    setShowEmojiPicker(false);

    startTransition(async () => {
      const result = await sendMessage(activePartner.partner.id, txt);
      if (result.message) {
        setMessages((prev) =>
          prev.some((m) => m.id === result.message!.id) ? prev : [...prev, result.message!]
        );
      }
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

  const handleContractResponse = (contractId: string, decision: "accepted" | "declined") => {
    startTransition(async () => {
      const res = await respondToPartnership(contractId, decision);
      if (res?.error) alert(res.error);
      else {
        setContracts((prev) => prev.map((c) => (c.id === contractId ? { ...c, status: decision } : c)));
      }
    });
  };

  const filteredConnections = useMemo(() => {
    return connections.filter((conn) => {
      if (sidebarFilter === "high" && (conn.synergyScore || 0) < 90) return false;
      if (sidebarFilter === "proposals") {
        const hasPendingContract = contracts.some(
          (c) => c.connect_request_id === conn.connect_request_id && c.status === "pending"
        );
        if (!hasPendingContract && !conn.lastMessage?.content?.includes("Proposal")) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCodename = conn.partner.codename?.toLowerCase().includes(q);
        const matchesRole = conn.partner.professional_title?.toLowerCase().includes(q);
        const matchesCategory = conn.partner.industry_category?.toLowerCase().includes(q);
        const matchesMsg = conn.lastMessage?.content?.toLowerCase().includes(q);
        return matchesCodename || matchesRole || matchesCategory || matchesMsg;
      }
      return true;
    });
  }, [connections, sidebarFilter, searchQuery, contracts]);

  const activeVibe = activePartner?.vibe ?? { pace: 4, comms: 3, risk: 4, energy: 4 };
  const activeSynergy = activePartner?.synergyScore ?? 94;

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        background: "var(--surface)",
        color: "var(--text)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR: Direct Messages & Co-Founder Story Carousel              */}
      {/* ========================================================================= */}
      <div
        style={{
          width: "320px",
          minWidth: "280px",
          borderRight: "1px solid var(--stroke)",
          background: "var(--surface)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: "16px 16px 10px",
            borderBottom: "1px solid var(--stroke-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 900, margin: 0, color: "var(--text-bright)", letterSpacing: "-0.02em" }}>
                Messages
              </h2>
              <span
                style={{
                  padding: "1px 7px",
                  borderRadius: "9999px",
                  background: "var(--accent-subtle)",
                  color: "var(--accent)",
                  fontSize: "11px",
                  fontWeight: 800,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {connections.length}
              </span>
            </div>

            <Link
              href="/discover"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--accent)",
                textDecoration: "none",
                padding: "3px 8px",
                borderRadius: "6px",
                background: "var(--surface-inset)",
              }}
            >
              <span>+ New Match</span>
            </Link>
          </div>

          {/* Active Match Horizontal Avatar Strip */}
          <div style={{ display: "flex", gap: "10px", overflowX: "auto", padding: "2px 0 6px" }} className="custom-scrollbar">
            {connections.map((c) => {
              const isSelected = activePartner?.partner.id === c.partner.id;
              return (
                <div
                  key={c.partner.id}
                  onClick={() => setActivePartner(c)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "3px",
                    cursor: "pointer",
                    flexShrink: 0,
                    width: "50px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      padding: "2px",
                      borderRadius: "50%",
                      background: isSelected
                        ? "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)"
                        : "var(--stroke)",
                      transition: "transform 0.15s ease",
                    }}
                  >
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", background: "var(--surface)" }}>
                      <AvatarSVG name={c.partner.codename} size={38} />
                    </div>
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "9px",
                        height: "9px",
                        borderRadius: "50%",
                        background: "#10b981",
                        border: "1.5px solid var(--surface)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: isSelected ? 800 : 600,
                      color: isSelected ? "var(--text-bright)" : "var(--muted)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                    }}
                  >
                    {c.partner.codename}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Search Box */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              background: "var(--surface-inset)",
              borderRadius: "8px",
              padding: "5px 10px",
              border: "1px solid var(--stroke)",
            }}
          >
            <Search size={13} color="var(--dim)" style={{ marginRight: "6px", flexShrink: 0 }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "11px",
                color: "var(--text-bright)",
                width: "100%",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)", padding: 0 }}
              >
                <X size={11} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: "4px" }}>
            {[
              { key: "all", label: "All" },
              { key: "high", label: "⚡ 90%+ Match" },
              { key: "proposals", label: "📑 Proposals" },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setSidebarFilter(f.key as "all" | "high" | "proposals")}
                style={{
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: sidebarFilter === f.key ? "1px solid var(--accent)" : "1px solid var(--stroke)",
                  background: sidebarFilter === f.key ? "var(--accent)" : "transparent",
                  color: sidebarFilter === f.key ? "#ffffff" : "var(--muted)",
                  transition: "all 0.15s ease",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredConnections.length === 0 ? (
            <div style={{ padding: "24px 16px", textAlign: "center", color: "var(--dim)" }}>
              <p style={{ margin: 0, fontSize: "12px" }}>No matching conversations</p>
            </div>
          ) : (
            filteredConnections.map((conn) => {
              const isActive = activePartner?.partner.id === conn.partner.id;
              const score = conn.synergyScore || 94;
              const isHigh = score >= 90;

              return (
                <div
                  key={conn.partner.id}
                  onClick={() => setActivePartner(conn)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    background: isActive ? "var(--surface-inset)" : "transparent",
                    borderLeft: isActive ? "3px solid var(--accent)" : "3px solid transparent",
                    borderBottom: "1px solid var(--stroke-subtle)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "background 0.15s ease",
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: `1.5px solid ${isActive ? "var(--accent)" : "var(--stroke)"}`,
                        background: "var(--surface)",
                      }}
                    >
                      <AvatarSVG name={conn.partner.codename} size={38} />
                    </div>
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#10b981",
                        border: "1.5px solid var(--surface)",
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 800,
                            color: "var(--text-bright)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {conn.partner.codename}
                        </span>
                        <Shield size={11} color="#10b981" fill="#10b981" style={{ flexShrink: 0 }} />
                      </div>

                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "1px 5px",
                          borderRadius: "9999px",
                          background: isHigh ? "var(--accent-subtle)" : "var(--surface-inset)",
                          color: isHigh ? "var(--accent)" : "var(--muted)",
                          border: `1px solid ${isHigh ? "var(--accent-border)" : "var(--stroke)"}`,
                          fontFamily: "var(--font-mono)",
                          flexShrink: 0,
                        }}
                      >
                        {score}%
                      </span>
                    </div>

                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: "11px",
                        color: "var(--accent-3)",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {conn.partner.industry_category || conn.partner.professional_title || "Verified Builder"}
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        color: isActive ? "var(--text)" : "var(--muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {conn.lastMessage
                        ? `${conn.lastMessage.sender_id === currentUserId ? "You: " : ""}${conn.lastMessage.content}`
                        : "Tap to initiate real-time transmission..."}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MIDDLE COLUMN: Active Chat Canvas & Stream                             */}
      {/* ========================================================================= */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
          background: "var(--bg)",
          minWidth: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {activePartner ? (
          <>
            {/* Top Chat Bar */}
            <div
              style={{
                padding: "10px 18px",
                borderBottom: "1px solid var(--stroke)",
                background: "var(--surface)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
                zIndex: 5,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--accent)", background: "var(--surface-inset)" }}>
                    <AvatarSVG name={activePartner.partner.codename} size={38} />
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "9px",
                      height: "9px",
                      borderRadius: "50%",
                      background: "#10b981",
                      border: "1.5px solid var(--surface)",
                    }}
                  />
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 900, color: "var(--text-bright)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {activePartner.partner.codename}
                    </h3>
                    <span
                      style={{
                        padding: "1px 5px",
                        borderRadius: "9999px",
                        background: "rgba(16, 185, 129, 0.12)",
                        color: "#10b981",
                        fontSize: "9px",
                        fontWeight: 800,
                      }}
                    >
                      🛡️ VERIFIED
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "1px" }}>
                    <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {activePartner.partner.industry_category || "Co-Founder"} · {activePartner.partner.location || "Global Remote"}
                    </span>
                    <span style={{ fontSize: "10px", color: "#10b981", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      ● Realtime P2P
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                {/* Synergy Score Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    background: activeSynergy >= 90 ? "var(--accent)" : "var(--surface-inset)",
                    color: activeSynergy >= 90 ? "#ffffff" : "var(--text-bright)",
                    fontSize: "11px",
                    fontWeight: 800,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <Flame size={12} fill={activeSynergy >= 90 ? "#fff" : "#ff3d6e"} color={activeSynergy >= 90 ? "#fff" : "#ff3d6e"} />
                  <span>{activeSynergy}% Synergy</span>
                </div>

                {/* Propose Contract Action */}
                <button
                  type="button"
                  onClick={() => setShowPropose(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "5px 12px",
                    borderRadius: "9999px",
                    background: "linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "11px",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "transform 0.15s ease",
                  }}
                >
                  <FileText size={13} />
                  <span>Propose Milestone</span>
                </button>

                {/* Toggle 4D Intel Drawer */}
                <button
                  type="button"
                  onClick={() => setShowIntelDrawer(!showIntelDrawer)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "5px 10px",
                    borderRadius: "9999px",
                    background: showIntelDrawer ? "var(--accent)" : "var(--surface-inset)",
                    color: showIntelDrawer ? "#fff" : "var(--text-bright)",
                    border: "1px solid var(--stroke)",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 700,
                    transition: "all 0.15s ease",
                  }}
                  title="Toggle Operator 4D Intelligence"
                >
                  <Info size={13} />
                  <span>4D Intel</span>
                </button>
              </div>
            </div>

            {/* Main Chat Stream */}
            <div
              style={{
                flex: "1 1 0%",
                minHeight: 0,
                overflowY: "auto",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {/* Co-Founder Synergy Header Pill (Clean & Non-Intrusive) */}
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "14px",
                  background: "var(--surface)",
                  border: "1px solid var(--stroke)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  maxWidth: "600px",
                  margin: "0 auto 8px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Zap size={14} color="var(--accent)" />
                    <span style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.08em", color: "var(--accent)", textTransform: "uppercase" }}>
                      CO-FOUNDER SYNERGY ({activeSynergy}%)
                    </span>
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--dim)", fontFamily: "var(--font-mono)" }}>
                    Encrypted Protocol v2.4
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", border: "1.5px solid var(--accent)", flexShrink: 0 }}>
                    <AvatarSVG name={activePartner.partner.codename} size={36} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ margin: "0 0 1px", fontSize: "13px", fontWeight: 800, color: "var(--text-bright)" }}>
                      Connected with {activePartner.partner.codename}
                    </h4>
                    <p style={{ margin: 0, fontSize: "11px", color: "var(--muted)", lineHeight: 1.35 }}>
                      {activePartner.partner.bio || "Synchronized across technical and creative working disciplines."}
                    </p>
                  </div>
                </div>

                {/* Icebreaker Prompts Chips */}
                {messages.length === 0 && (
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                      💡 Quick Icebreakers:
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {ICEBREAKER_PROMPTS.map((prompt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setInputText(prompt);
                            inputRef.current?.focus();
                          }}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            background: "var(--surface-inset)",
                            border: "1px solid var(--stroke)",
                            color: "var(--text-bright)",
                            fontSize: "10px",
                            fontWeight: 600,
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Messages Stream */}
              {messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                const timeStr = new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isMe ? "flex-end" : "flex-start",
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMe ? "flex-end" : "flex-start",
                      margin: "1px 0",
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: "16px",
                        borderBottomRightRadius: isMe ? "3px" : "16px",
                        borderBottomLeftRadius: isMe ? "16px" : "3px",
                        background: isMe
                          ? "linear-gradient(135deg, var(--accent) 0%, #e11d48 100%)"
                          : "var(--surface)",
                        color: isMe ? "#ffffff" : "var(--text-bright)",
                        border: isMe ? "none" : "1px solid var(--stroke)",
                        boxShadow: isMe
                          ? "0 2px 8px rgba(255, 61, 110, 0.25)"
                          : "0 1px 4px rgba(0,0,0,0.02)",
                        fontSize: "13.5px",
                        lineHeight: 1.45,
                        wordBreak: "break-word",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <span>{msg.content}</span>
                      
                      {/* Integrated Micro Timestamp */}
                      <span
                        style={{
                          fontSize: "10px",
                          color: isMe ? "rgba(255,255,255,0.75)" : "var(--dim)",
                          alignSelf: "flex-end",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          marginTop: "2px",
                        }}
                      >
                        {timeStr}
                        {isMe && <CheckCheck size={12} color="rgba(255,255,255,0.9)" />}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Render In-Stream Micro-Contracts */}
              {contracts.map((ctr) => {
                const isMe = ctr.proposed_by === currentUserId;
                const isPendingRecipient = ctr.status === "pending" && ctr.proposed_to === currentUserId;

                return (
                  <div key={ctr.id} style={{ alignSelf: "center", width: "100%", maxWidth: "600px", margin: "8px 0" }}>
                    <div
                      style={{
                        padding: "16px 20px",
                        borderRadius: "16px",
                        border: ctr.status === "accepted" ? "2px solid #10b981" : "1px solid var(--stroke)",
                        background: "var(--surface)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <FileText size={15} color="var(--accent-2)" />
                          <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-2)" }}>
                            ⚡ Micro-Contract Proposal
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "10px",
                            padding: "2px 8px",
                            background:
                              ctr.status === "accepted"
                                ? "rgba(16, 185, 129, 0.15)"
                                : ctr.status === "declined"
                                ? "rgba(239, 68, 68, 0.15)"
                                : "rgba(245, 158, 11, 0.15)",
                            color: ctr.status === "accepted" ? "#10b981" : ctr.status === "declined" ? "#ef4444" : "#f59e0b",
                            borderRadius: "9999px",
                            fontWeight: 800,
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {ctr.status.toUpperCase()}
                        </span>
                      </div>

                      <h4 style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: 800, color: "var(--text-bright)" }}>
                        {ctr.deliverables}
                      </h4>

                      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", fontSize: "12px", color: "var(--muted)", margin: "6px 0 12px" }}>
                        <span><strong>Budget:</strong> ${ctr.price_amount}</span>
                        <span><strong>Split:</strong> {ctr.revenue_split_a}% / {ctr.revenue_split_b}%</span>
                        <span><strong>Type:</strong> {ctr.contract_type}</span>
                      </div>

                      {isPendingRecipient ? (
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            type="button"
                            onClick={() => handleContractResponse(ctr.id, "declined")}
                            disabled={isPending}
                            className="outline-btn"
                            style={{ flex: 1, padding: "8px 14px", fontSize: "12px" }}
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => handleContractResponse(ctr.id, "accepted")}
                            disabled={isPending}
                            className="primary-btn"
                            style={{ flex: 1.5, padding: "8px 14px", fontSize: "12px" }}
                          >
                            {isPending ? "Signing Pod..." : "⚡ Accept & Launch Pod"}
                          </button>
                        </div>
                      ) : ctr.status === "accepted" ? (
                        <Link
                          href={`/workspace/${ctr.id}`}
                          className="primary-btn"
                          style={{ display: "block", textAlign: "center", padding: "8px 14px", fontSize: "12px", textDecoration: "none" }}
                        >
                          Enter Shared Pod Workspace &rarr;
                        </Link>
                      ) : isMe && ctr.status === "pending" ? (
                        <p style={{ margin: 0, fontSize: "11px", color: "var(--muted)", fontStyle: "italic" }}>
                          Waiting for {activePartner.partner.codename} to review and sign.
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </div>

            {/* Bottom Command Input Bar */}
            <div
              style={{
                padding: "10px 16px",
                borderTop: "1px solid var(--stroke)",
                background: "var(--surface)",
                position: "relative",
                flexShrink: 0,
              }}
            >
              {/* Emoji Picker Popover */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{
                      position: "absolute",
                      bottom: "60px",
                      left: "16px",
                      background: "var(--surface)",
                      border: "1px solid var(--stroke)",
                      borderRadius: "12px",
                      padding: "8px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                      zIndex: 30,
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                      maxWidth: "220px",
                    }}
                  >
                    {QUICK_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setInputText((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                          inputRef.current?.focus();
                        }}
                        style={{
                          fontSize: "16px",
                          background: "var(--surface-inset)",
                          border: "none",
                          borderRadius: "6px",
                          padding: "5px",
                          cursor: "pointer",
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Clean Input Dock */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--surface-inset)",
                  borderRadius: "9999px",
                  padding: "4px 8px 4px 12px",
                  border: "1px solid var(--stroke)",
                }}
              >
                {/* Propose Contract Action */}
                <button
                  type="button"
                  onClick={() => setShowPropose(true)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "50%",
                    color: "var(--accent-2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Propose Micro-Contract"
                >
                  <FileText size={16} />
                </button>

                {/* Emoji Popover Button */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "50%",
                    color: "var(--dim)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Add Emoji"
                >
                  <Smile size={16} />
                </button>

                {/* Text Input */}
                <input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`Message ${activePartner.partner.codename}... (Press Enter to send)`}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontSize: "13px",
                    color: "var(--text-bright)",
                    padding: "6px 2px",
                  }}
                />

                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!inputText.trim() || isPending}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: inputText.trim()
                      ? "linear-gradient(135deg, var(--accent) 0%, #e11d48 100%)"
                      : "var(--surface)",
                    color: inputText.trim() ? "#ffffff" : "var(--dim)",
                    border: `1px solid ${inputText.trim() ? "transparent" : "var(--stroke)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: inputText.trim() ? "pointer" : "default",
                    transition: "all 0.15s ease",
                    boxShadow: inputText.trim() ? "0 2px 8px rgba(255, 61, 110, 0.4)" : "none",
                  }}
                  title="Send message"
                >
                  <Send size={13} style={{ marginLeft: "1px" }} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--dim)", padding: "40px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📡</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-bright)", margin: "0 0 6px" }}>
              No active comm links selected
            </h3>
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
              Select an operator from the left sidebar to begin encrypted communication.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. RIGHT DRAWER: Operator 4D Intelligence & Passport (Collapsible)        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showIntelDrawer && activePartner && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "320px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              borderLeft: "1px solid var(--stroke)",
              background: "var(--surface)",
              height: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", color: "var(--accent)", textTransform: "uppercase" }}>
                  OPERATOR 4D INTELLIGENCE
                </span>
                <button
                  type="button"
                  onClick={() => setShowIntelDrawer(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)", padding: "2px" }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Avatar & Specs */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "6px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--accent)" }}>
                  <AvatarSVG name={activePartner.partner.codename} size={64} />
                </div>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 900, color: "var(--text-bright)" }}>
                  {activePartner.partner.codename}
                </h3>
                <span style={{ fontSize: "11px", color: "var(--accent-3)", fontWeight: 700 }}>
                  {activePartner.partner.industry_category || "Software & IT"} · {activePartner.partner.professional_title || "Verified Builder"}
                </span>
              </div>

              {/* Bio */}
              {activePartner.partner.bio && (
                <div
                  style={{
                    padding: "8px 12px",
                    background: "var(--surface-inset)",
                    borderRadius: "8px",
                    borderLeft: "3px solid var(--accent)",
                    fontSize: "11px",
                    color: "var(--text)",
                    fontStyle: "italic",
                    lineHeight: 1.4,
                  }}
                >
                  &ldquo;{activePartner.partner.bio}&rdquo;
                </div>
              )}

              {/* 4D Working Rhythm Wave */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  4D Working Rhythm
                </span>
                <VibeGraph vibe={activeVibe} variant="wave" height={60} />
              </div>

              {/* 4D Polar Radar */}
              <div style={{ background: "var(--surface-inset)", borderRadius: "12px", padding: "10px", border: "1px solid var(--stroke)" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", textAlign: "center", marginBottom: "4px" }}>
                  POLAR RADAR MATRIX
                </span>
                <VibeGraph vibe={activeVibe} variant="radar" />
              </div>

              {/* Active Venture */}
              {activePartner.project && (
                <div style={{ padding: "10px", background: "var(--surface-inset)", border: "1px solid var(--stroke)", borderRadius: "10px" }}>
                  <span style={{ fontSize: "9px", fontWeight: 800, color: "var(--accent-2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    🚀 ACTIVE VENTURE
                  </span>
                  <h4 style={{ margin: "2px 0 2px", fontSize: "12px", fontWeight: 800, color: "var(--text-bright)" }}>
                    {activePartner.project.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: "11px", color: "var(--muted)", lineHeight: 1.35 }}>
                    {activePartner.project.description}
                  </p>
                </div>
              )}

              {/* Quick Contract Trigger */}
              <button
                type="button"
                onClick={() => setShowPropose(true)}
                className="primary-btn"
                style={{ padding: "10px", fontSize: "12px", width: "100%" }}
              >
                📑 Propose Milestone Contract
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. MODAL: Micro-Contract Proposal Architect                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showPropose && activePartner && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPropose(false)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              style={{
                position: "relative",
                maxWidth: "520px",
                width: "100%",
                background: "var(--surface)",
                border: "1px solid var(--stroke-strong)",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                zIndex: 10,
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 900, color: "var(--text-bright)" }}>
                    Propose Milestone Contract
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--muted)" }}>
                    Formalize collaboration with {activePartner.partner.codename}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPropose(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dim)", padding: "4px" }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Template Chips */}
              <div style={{ marginBottom: "16px" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                  Select Architecture
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {CONTRACT_TEMPLATES.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setSelectedTemplate(t)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        border: selectedTemplate.key === t.key ? "1px solid var(--accent-2)" : "1px solid var(--stroke)",
                        background: selectedTemplate.key === t.key ? "var(--accent-2)" : "var(--surface-inset)",
                        color: selectedTemplate.key === t.key ? "#ffffff" : "var(--text)",
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <p style={{ color: "var(--dim)", fontSize: "11px", marginTop: "6px", lineHeight: 1.35 }}>
                  {selectedTemplate.description}
                </p>
              </div>

              {/* Form */}
              <form action={submitContract} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input type="hidden" name="contract_type" value={selectedTemplate.key} />
                <input type="hidden" name="revenue_split_a" value={selectedTemplate.splitA} />
                <input type="hidden" name="revenue_split_b" value={selectedTemplate.splitB} />
                <input type="hidden" name="platform_fee_pct" value={selectedTemplate.platformFee} />

                <label style={{ display: "block" }}>
                  <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>
                    Project Budget ($ USD)
                  </span>
                  <input
                    name="price_amount"
                    type="number"
                    min={0}
                    required
                    placeholder={selectedTemplate.key === "portfolio_only" ? "0" : "500"}
                    defaultValue={selectedTemplate.key === "portfolio_only" ? 0 : 500}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--stroke)",
                      background: "var(--surface-inset)",
                      color: "var(--text-bright)",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </label>

                <label style={{ display: "block" }}>
                  <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>
                    Milestones &amp; Deliverables Scope
                  </span>
                  <textarea
                    name="deliverables"
                    required
                    placeholder="Outline milestone 1, timeline, and deliverables for this partnership..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--stroke)",
                      background: "var(--surface-inset)",
                      color: "var(--text-bright)",
                      fontSize: "12px",
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                      lineHeight: 1.4,
                    }}
                  />
                </label>

                <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setShowPropose(false)}
                    className="outline-btn"
                    style={{ flex: 1, padding: "10px", fontSize: "12px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="primary-btn"
                    style={{ flex: 2, padding: "10px", fontSize: "13px" }}
                  >
                    {isPending ? "Encrypting Proposal..." : `Transmit ${selectedTemplate.label} Proposal`}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatInterface;
