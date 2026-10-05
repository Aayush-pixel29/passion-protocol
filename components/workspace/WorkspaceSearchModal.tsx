"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import {
  Search,
  X,
  Sparkles,
  Plus,
  Layers,
  Code2,
  DollarSign,
  UploadCloud,
  Trophy,
  FileText,
  ExternalLink,
} from "lucide-react";
import type { WorkspaceTask, WorkspaceFile } from "@/lib/types";

export interface WorkspaceSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: WorkspaceTask[];
  files: WorkspaceFile[];
  onSelectTab: (tab: "kanban" | "ai_verifier" | "integrations" | "treasury" | "files" | "challenges") => void;
  onAddTask: () => void;
  onVerifyAI: () => void;
  onLaunchVSCode: () => void;
  onUploadFile: () => void;
}

interface FilterTag {
  label: string;
  key: string;
  icon?: React.ComponentType<{ size?: number }>;
}

const FILTER_TAGS: FilterTag[] = [
  { label: "All Items", key: "all" },
  { label: "Tasks", key: "tasks", icon: Layers },
  { label: "AI Checks", key: "ai", icon: Sparkles },
  { label: "Dev Tools", key: "tools", icon: Code2 },
  { label: "Vault Files", key: "files", icon: UploadCloud },
];

export function WorkspaceSearchModal({
  open,
  onOpenChange,
  tasks,
  files,
  onSelectTab,
  onAddTask,
  onVerifyAI,
  onLaunchVSCode,
  onUploadFile,
}: WorkspaceSearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (K, ⌘K, Ctrl+K, /, Escape)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // Open on 'k' / 'K' / '/' when not inside another input, or ⌘K / Ctrl+K anywhere
      if (
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") ||
        (!isInputFocused && !open && (e.key.toLowerCase() === "k" || e.key === "/"))
      ) {
        e.preventDefault();
        onOpenChange(true);
        return;
      }

      if (e.key === "Escape" && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  // Filter tasks based on query and activeTag
  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesTag = activeTag === "all" || activeTag === "tasks" || (activeTag === "ai" && t.ai_verification);
      const matchesQuery = !q || `${t.title} ${t.description} ${t.tool_type} ${t.priority}`.toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [query, activeTag, tasks]);

  // Filter files
  const filteredFiles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (activeTag !== "all" && activeTag !== "files") return [];
    return files.filter((f) => !q || f.file_name.toLowerCase().includes(q));
  }, [query, activeTag, files]);

  const quickActions = [
    {
      label: "Assign New Milestone Deliverable",
      shortcut: "E",
      icon: Plus,
      action: () => {
        onOpenChange(false);
        onAddTask();
      },
    },
    {
      label: "Run AI Pod Verifier on Active Tasks",
      shortcut: "V",
      icon: Sparkles,
      action: () => {
        onOpenChange(false);
        onVerifyAI();
      },
    },
    {
      label: "Launch Shared Cloud VS Code Editor",
      shortcut: "C",
      icon: Code2,
      action: () => {
        onOpenChange(false);
        onLaunchVSCode();
      },
    },
    {
      label: "Upload Document or Spec to Vault",
      shortcut: "U",
      icon: UploadCloud,
      action: () => {
        onOpenChange(false);
        onUploadFile();
      },
    },
    {
      label: "Inspect Escrow Status & Revenue Split",
      shortcut: "T",
      icon: DollarSign,
      action: () => {
        onOpenChange(false);
        onSelectTab("treasury");
      },
    },
    {
      label: "View 48-Hour Sprint Bounty Challenge",
      shortcut: "B",
      icon: Trophy,
      action: () => {
        onOpenChange(false);
        onSelectTab("challenges");
      },
    },
  ];

  if (!open) return null;

  return (
    <div
      onClick={() => onOpenChange(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "16px",
        paddingTop: "10vh",
        background: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "var(--surface)",
          border: "1px solid var(--stroke)",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.3)",
          color: "var(--text-bright)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 18px",
            borderBottom: "1px solid var(--stroke)",
            gap: "10px",
          }}
        >
          <Search size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deliverables, run AI verification, tools (⌘K)..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-bright)",
              minWidth: 0,
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                fontFamily: "var(--font-mono)",
                padding: "2px 6px",
                borderRadius: "6px",
                background: "var(--surface-inset)",
                border: "1px solid var(--stroke)",
                color: "var(--muted)",
              }}
            >
              ESC TO CLOSE
            </span>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Filter Tag Pills */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            padding: "10px 18px",
            borderBottom: "1px solid var(--stroke)",
            background: "var(--surface-inset)",
            overflowX: "auto",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", alignSelf: "center", marginRight: "4px" }}>
            Filter:
          </span>
          {FILTER_TAGS.map((tag) => {
            const isSelected = activeTag === tag.key;
            return (
              <button
                key={tag.key}
                type="button"
                onClick={() => setActiveTag(tag.key)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: isSelected ? "1px solid var(--accent)" : "1px solid var(--stroke)",
                  background: isSelected ? "var(--accent)" : "var(--surface)",
                  color: isSelected ? "#fff" : "var(--muted)",
                  whiteSpace: "nowrap",
                  transition: "all 0.12s ease",
                }}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        {/* Search Results & Quick Actions Container */}
        <div style={{ maxHeight: "420px", overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "12px" }}>
          
          {/* Quick Actions List */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", padding: "4px 8px 6px" }}>
              ⚡ Quick Commands
            </div>
            <div style={{ display: "grid", gap: "4px" }}>
              {quickActions.map((qa) => {
                const Icon = qa.icon;
                return (
                  <button
                    key={qa.label}
                    type="button"
                    onClick={qa.action}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      background: "transparent",
                      border: "1px solid transparent",
                      color: "var(--text-bright)",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      fontSize: "13px",
                      fontWeight: 600,
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--surface-inset)";
                      e.currentTarget.style.borderColor = "var(--stroke)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          background: "rgba(99, 102, 241, 0.1)",
                          color: "var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={14} />
                      </span>
                      <span>{qa.label}</span>
                    </div>

                    <kbd
                      style={{
                        fontSize: "11px",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 800,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: "var(--surface-inset)",
                        border: "1px solid var(--stroke)",
                        color: "var(--muted)",
                      }}
                    >
                      {qa.shortcut}
                    </kbd>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matched Tasks Section */}
          {filteredTasks.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", padding: "6px 8px 6px" }}>
                📋 Pod Deliverables ({filteredTasks.length})
              </div>
              <div style={{ display: "grid", gap: "6px" }}>
                {filteredTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onOpenChange(false);
                      onSelectTab("kanban");
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "var(--surface-inset)",
                      border: "1px solid var(--stroke)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-bright)" }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
                        Tool: <strong>{t.tool_type}</strong> &middot; Priority: <strong>{t.priority}</strong> &middot; Status: <strong>{t.status}</strong>
                      </div>
                    </div>

                    {t.ai_verification ? (
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "9999px",
                          fontSize: "11px",
                          fontWeight: 800,
                          background: t.ai_verification.status === "passed" ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                          color: t.ai_verification.status === "passed" ? "#10b981" : "#ef4444",
                          border: `1px solid ${t.ai_verification.status === "passed" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Sparkles size={12} /> {t.ai_verification.score}% AI Score
                      </span>
                    ) : (
                      <span style={{ fontSize: "11px", color: "var(--muted)" }}>In Review &rarr;</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Files Section */}
          {filteredFiles.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", padding: "6px 8px 6px" }}>
                📁 Vault Files ({filteredFiles.length})
              </div>
              <div style={{ display: "grid", gap: "6px" }}>
                {filteredFiles.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "var(--surface-inset)",
                      border: "1px solid var(--stroke)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FileText size={15} style={{ color: "var(--accent)" }} />
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-bright)" }}>
                        {f.file_name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onOpenChange(false);
                        onSelectTab("files");
                      }}
                      style={{
                        color: "var(--accent)",
                        fontSize: "12px",
                        fontWeight: 700,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span>View in Vault</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "10px 18px",
            borderTop: "1px solid var(--stroke)",
            background: "var(--surface-inset)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "var(--muted)",
          }}
        >
          <span>
            Tip: Press <kbd style={{ padding: "1px 4px", borderRadius: "4px", background: "var(--surface)", border: "1px solid var(--stroke)" }}>⌘K</kbd> anywhere to toggle this search menu.
          </span>
          <span style={{ fontWeight: 700, color: "var(--accent)" }}>
            ⚡ Passion Protocol AI Pod Engine
          </span>
        </div>
      </motion.div>
    </div>
  );
}
