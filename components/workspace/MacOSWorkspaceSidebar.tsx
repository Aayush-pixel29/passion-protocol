"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Layers,
  Sparkles,
  Code2,
  DollarSign,
  UploadCloud,
  Trophy,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import type { Profile } from "@/lib/types";

export type TabKey = "kanban" | "ai_verifier" | "integrations" | "treasury" | "files" | "challenges";

export interface NavItemConfig {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  badge?: string | number;
  highlight?: boolean;
}

interface MacOSWorkspaceSidebarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onAddTask: () => void;
  partner?: Partial<Profile>;
  currentUserProfile?: Partial<Profile> | null;
  tasksCount: number;
  verifiedScore: number;
  paymentStatus: "paid" | "unpaid";
  defaultOpen?: boolean;
  className?: string;
}

export function MacOSWorkspaceSidebar({
  activeTab,
  onSelectTab,
  onAddTask,
  partner,
  currentUserProfile,
  tasksCount,
  verifiedScore,
  paymentStatus,
  defaultOpen = true,
  className = "",
}: MacOSWorkspaceSidebarProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [hoveredTab, setHoveredTab] = useState<TabKey | null>(null);

  const NAV_ITEMS: NavItemConfig[] = [
    {
      key: "kanban",
      label: "Tasks & Kanban",
      icon: Layers,
      badge: tasksCount > 0 ? tasksCount : undefined,
    },
    {
      key: "ai_verifier",
      label: "AI Pod Verifier",
      icon: Sparkles,
      badge: verifiedScore > 0 ? `${verifiedScore}%` : "Ready",
      highlight: true,
    },
    {
      key: "integrations",
      label: "Dev Ecosystem",
      icon: Code2,
      badge: "4 Tools",
    },
    {
      key: "treasury",
      label: "Treasury & Escrow",
      icon: DollarSign,
      badge: paymentStatus === "paid" ? "Funded" : "Pending",
    },
    {
      key: "files",
      label: "Encrypted Vault",
      icon: UploadCloud,
    },
    {
      key: "challenges",
      label: "48h Sprint Bounty",
      icon: Trophy,
      badge: "$5K Pool",
      highlight: true,
    },
  ];

  return (
    <motion.aside
      animate={{
        width: isOpen ? 260 : 72,
      }}
      transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
      className={`relative shrink-0 flex flex-col justify-between rounded-2xl border transition-colors ${className}`}
      style={{
        background: "var(--surface)",
        borderColor: "var(--stroke)",
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.06)",
        padding: isOpen ? "16px 12px" : "16px 8px",
        overflow: "hidden",
        minHeight: "680px",
      }}
    >
      {/* Top Controls & Header */}
      <div className="flex flex-col gap-3">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "space-between" : "center",
            padding: "0 4px 10px",
            borderBottom: "1px solid var(--stroke)",
          }}
        >
          {isOpen && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 8px #10b981",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  color: "var(--text-bright)",
                  textTransform: "uppercase",
                }}
              >
                Sprint Pod
              </span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {isOpen && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddTask}
                title="Assign New Task"
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                }}
              >
                <Plus size={14} />
              </motion.button>
            )}

            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "var(--surface-inset)",
                color: "var(--muted)",
                border: "1px solid var(--stroke)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {isOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
            </motion.button>
          </div>
        </div>

        {/* Navigation Items List */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            marginTop: "6px",
          }}
          onMouseLeave={() => setHoveredTab(null)}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.key;
            const isHovered = hoveredTab === item.key;

            return (
              <div
                key={item.key}
                className="relative cursor-pointer select-none"
                onMouseEnter={() => setHoveredTab(item.key)}
                onClick={() => onSelectTab(item.key)}
                style={{
                  position: "relative",
                  borderRadius: "10px",
                  padding: isOpen ? "10px 12px" : "12px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isOpen ? "flex-start" : "center",
                  gap: "10px",
                  transition: "color 0.15s ease",
                  color: isSelected ? "var(--text-bright)" : "var(--muted)",
                }}
              >
                {/* Active Background Pill */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute inset-0 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                      style={{
                        background: "var(--surface-inset)",
                        border: "1px solid var(--stroke)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                        zIndex: 0,
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Hover Indicator */}
                <AnimatePresence>
                  {isHovered && !isSelected && (
                    <motion.div
                      layoutId="sidebar-hover-indicator"
                      className="absolute inset-0 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      style={{
                        background: "rgba(99, 102, 241, 0.05)",
                        border: "1px solid rgba(99, 102, 241, 0.15)",
                        zIndex: 0,
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon */}
                <span
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isSelected ? "var(--accent)" : "currentColor",
                  }}
                >
                  <Icon size={18} />
                </span>

                {/* Expanded Label & Badge */}
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: isSelected ? 800 : 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.label}
                    </span>

                    {item.badge && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "2px 7px",
                          borderRadius: "9999px",
                          background: item.highlight
                            ? "rgba(99, 102, 241, 0.12)"
                            : "var(--surface-inset)",
                          color: item.highlight ? "var(--accent)" : "var(--dim)",
                          border: item.highlight
                            ? "1px solid rgba(99, 102, 241, 0.25)"
                            : "1px solid var(--stroke)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Synergy Card / Partner Info */}
      <div
        style={{
          borderTop: "1px solid var(--stroke)",
          paddingTop: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: "10px",
              background: "var(--surface-inset)",
              border: "1px solid var(--stroke)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" }}>
                🤝 Co-Founder Pod
              </span>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "#10b981", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={11} /> 98% Synergy
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {(partner?.codename || "P").slice(0, 2).toUpperCase()}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-bright)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {partner?.codename || "Partner"}
                </div>
                <div style={{ fontSize: "10px", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {partner?.professional_title || "Verified Lead"}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div
            title={`Co-Founder: ${partner?.codename || "Partner"} & ${currentUserProfile?.codename || "You"}`}
            style={{
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--accent)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              <ShieldCheck size={16} />
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
