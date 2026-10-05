"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { WorkspaceFile, WorkspaceEmbed, WorkspaceTask, PartnershipContract, Profile } from "@/lib/types";
import { markContractAsPaid } from "@/lib/actions";
import { MacOSWorkspaceSidebar } from "./workspace/MacOSWorkspaceSidebar";
import { WorkspaceSearchModal } from "./workspace/WorkspaceSearchModal";
import {
  Shield,
  Zap,
  CheckCircle2,
  Sparkles,
  Code2,
  Database,
  Layers,
  Plus,
  Terminal,
  Trophy,
  Flame,
  Search,
} from "lucide-react";
import { RxArrowTopRight } from "react-icons/rx";

type TabKey = "kanban" | "ai_verifier" | "integrations" | "treasury" | "files" | "challenges";
type ToolType = "github" | "vscode" | "supabase" | "figma" | "general";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

const MAX_BYTES = 10 * 1024 * 1024;

function safeName(name: string) {
  return name.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 80);
}

const DEFAULT_TASKS: WorkspaceTask[] = [
  {
    id: "task-1",
    contract_id: "contract-curr",
    title: "1. Core Architecture & Supabase RLS Policies",
    description: "Setup project repo, initialize Supabase Auth, profiles schema, and write Row-Level Security rules.",
    assigned_to: "user-1",
    assigned_by: "user-2",
    status: "approved",
    priority: "urgent",
    tool_type: "supabase",
    deliverable_url: "https://github.com/passion-protocol/mvp-core/pull/1",
    deliverable_notes: "Implemented all 6 table schemas with strict RLS policies tested against unauthenticated access.",
    ai_verification: {
      score: 100,
      status: "passed",
      summary: "Verified: Schema adheres to 3NF, all tables have active RLS policies, 0 SQL injection vectors found.",
      checks: [
        { name: "Schema Normalization", passed: true, details: "Foreign keys and indices established." },
        { name: "RLS Security Policies", passed: true, details: "Zero unauthenticated read/write leaks." },
        { name: "Database Migrations", passed: true, details: "Clean idempotent migrations generated." },
      ],
      verified_at: new Date(Date.now() - 3600000).toISOString(),
    },
    approved_by_partner: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "task-2",
    contract_id: "contract-curr",
    title: "2. UI Design System, Figma Kit & Token Implementation",
    description: "Build 8px spacing scale, theme-aware tokens, responsive navigation, and modal components in Next.js.",
    assigned_to: "user-2",
    assigned_by: "user-1",
    status: "review",
    priority: "high",
    tool_type: "figma",
    deliverable_url: "https://www.figma.com/design/sample-passion-token-kit",
    deliverable_notes: "Complete component token library with responsive mobile & desktop viewports.",
    ai_verification: {
      score: 96,
      status: "passed",
      summary: "Verified: All components match 8px grid tokens, contrast ratio > 4.5:1, zero layout shift detected.",
      checks: [
        { name: "Design System Tokens", passed: true, details: "Warm neutral surface + indigo accents." },
        { name: "Accessibility Contrast", passed: true, details: "WCAG AAA compliant text tokens." },
        { name: "Responsive Viewports", passed: true, details: "Tested across mobile, tablet, desktop." },
      ],
      verified_at: new Date().toISOString(),
    },
    approved_by_partner: false,
    created_at: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "task-3",
    contract_id: "contract-curr",
    title: "3. End-to-End Test Matrix & CI Deployment Pipeline",
    description: "Configure GitHub Actions CI, run 298 end-to-end regression suites, and deploy preview to Vercel.",
    assigned_to: "user-1",
    assigned_by: "user-2",
    status: "in_progress",
    priority: "high",
    tool_type: "github",
    deliverable_url: "https://github.com/passion-protocol/mvp-core/actions",
    deliverable_notes: "Wiring up automatic test runner and preview deployments on pull requests.",
    ai_verification: null,
    approved_by_partner: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "task-4",
    contract_id: "contract-curr",
    title: "4. Live Launch, Analytics & Sponsor Bounty Submission",
    description: "Launch public demo on Product Hunt / X, submit to 48-Hour Sprint Challenge bounty pool.",
    assigned_to: "user-2",
    assigned_by: "user-1",
    status: "todo",
    priority: "medium",
    tool_type: "vscode",
    deliverable_url: null,
    deliverable_notes: null,
    ai_verification: null,
    approved_by_partner: false,
    created_at: new Date().toISOString(),
  },
];

export function WorkspaceBoard({
  contract,
  contractId,
  currentUserId,
  currentUserProfile,
  partner,
  initialFiles,
  initialEmbeds,
  paymentStatus: initialPaymentStatus,
  categories,
  partnerPaymentLink,
}: {
  contract?: PartnershipContract;
  contractId: string;
  currentUserId: string;
  currentUserProfile?: Partial<Profile> | null;
  partner?: Partial<Profile>;
  initialFiles: WorkspaceFile[];
  initialEmbeds: WorkspaceEmbed[];
  paymentStatus: "paid" | "unpaid";
  categories: string[];
  partnerPaymentLink?: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<TabKey>("kanban");
  const [files, setFiles] = useState(initialFiles);
  const [embeds, setEmbeds] = useState<WorkspaceEmbed[]>(initialEmbeds);
  const [tasks, setTasks] = useState<WorkspaceTask[]>(DEFAULT_TASKS);
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "unpaid">(initialPaymentStatus);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  // New task modal state
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>(partner?.id || "partner");
  const [newTaskTool, setNewTaskTool] = useState<ToolType>("github");

  const [selectedTaskForProof, setSelectedTaskForProof] = useState<WorkspaceTask | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [proofNotes, setProofNotes] = useState("");
  const [isVerifyingAI, setIsVerifyingAI] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  function handleLaunchVSCode() {
    setActiveTab("integrations");
    window.open("https://github.dev/passion-protocol/mvp-core", "_blank");
  }

  function handleTriggerAIModal() {
    setActiveTab("ai_verifier");
  }

  const priceAmount = contract?.price_amount ?? 500;
  const deliverables = contract?.deliverables ?? "Next.js + Supabase MVP Web Platform";
  const revenueSplitA = contract?.revenue_split_a ?? 50;
  const revenueSplitB = contract?.revenue_split_b ?? 50;
  const platformFeePct = contract?.platform_fee_pct ?? 5;

  const feeAmount = (priceAmount * platformFeePct) / 100;
  const netPool = priceAmount - feeAmount;
  const payoutA = (netPool * revenueSplitA) / 100;
  const payoutB = (netPool * revenueSplitB) / 100;

  const completedCount = tasks.filter((t) => t.status === "approved").length;
  const progressPct = Math.round((completedCount / (tasks.length || 1)) * 100);

  // File Upload Handler
  async function onUpload(file: File) {
    setError("");
    if (!ALLOWED.has(file.type)) {
      setError("Use an image, PDF, Word doc, or text file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File must be 10MB or smaller.");
      return;
    }
    const path = `${contractId}/${crypto.randomUUID()}-${safeName(file.name)}`;
    const { error: upError } = await supabase.storage.from("pod-workspace").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (upError) {
      setError(upError.message);
      return;
    }
    const { data, error: metaError } = await supabase
      .from("workspace_files")
      .insert({
        contract_id: contractId,
        uploaded_by: currentUserId,
        path,
        file_name: file.name.slice(0, 120),
        mime_type: file.type,
        size_bytes: file.size,
      })
      .select("*")
      .single();
    if (metaError) {
      setError(metaError.message);
      return;
    }
    setFiles((prev) => [data as WorkspaceFile, ...prev]);
    router.refresh();
  }

  async function openFile(path: string) {
    const { data, error: signError } = await supabase.storage
      .from("pod-workspace")
      .createSignedUrl(path, 120);
    if (signError || !data?.signedUrl) {
      setError(signError?.message || "Could not open file.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function handleAddEmbed(type: "figma" | "github" | "notion", url: string) {
    if (!url) return;
    setError("");

    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== "https:") {
        setError("Only HTTPS URLs are allowed.");
        return;
      }
    } catch {
      setError("Invalid URL format.");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("workspace_embeds")
      .insert({
        contract_id: contractId,
        added_by: currentUserId,
        embed_type: type,
        url,
        title: `${type.toUpperCase()} Hub Link`,
      })
      .select("*")
      .single();

    if (insertError) {
      setError(insertError.message);
    } else if (data) {
      setEmbeds((prev) => [data as WorkspaceEmbed, ...prev]);
    }
  }

  async function handlePayment() {
    setError("");
    startTransition(async () => {
      const { error: paymentError } = await markContractAsPaid(contractId);
      if (paymentError) {
        setError(paymentError);
      } else {
        setPaymentStatus("paid");
      }
    });
  }

  // Task creation handler
  function handleCreateTask() {
    if (!newTaskTitle.trim()) return;
    const newTask: WorkspaceTask = {
      id: `task-${Date.now()}`,
      contract_id: contractId,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || undefined,
      assigned_to: newTaskAssignee,
      assigned_by: currentUserId,
      status: "todo",
      priority: "high",
      tool_type: newTaskTool,
      deliverable_url: null,
      deliverable_notes: null,
      ai_verification: null,
      approved_by_partner: false,
      created_at: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setShowAddTask(false);
  }

  // Trigger AI Pod Verification simulation
  function handleRunAIVerification(task: WorkspaceTask) {
    setIsVerifyingAI(true);
    setTimeout(() => {
      const score = Math.floor(Math.random() * 6) + 95; // 95..100
      const updated: WorkspaceTask = {
        ...task,
        status: "review",
        deliverable_url: proofUrl || task.deliverable_url || "https://github.com/passion-protocol/mvp-core",
        deliverable_notes: proofNotes || task.deliverable_notes || "Submitted code deliverables and schema.",
        ai_verification: {
          score,
          status: "passed",
          summary: `Passion AI Pod Verifier: Confirmed 100% adherence to milestone contract acceptance criteria. Passed 4 security & RLS checks, zero critical vulnerabilities, 0 layout shifts.`,
          checks: [
            { name: "Milestone Acceptance Criteria", passed: true, details: "All required deliverables accounted for." },
            { name: "Code Security & Supabase RLS", passed: true, details: "Zero exposed API keys, strict RLS enforced." },
            { name: "UI & Design System Alignment", passed: true, details: "Clean 8px spacing tokens & responsive layout." },
            { name: "Build & Regression Test Sanity", passed: true, details: "298 / 298 tests passed cleanly." },
          ],
          verified_at: new Date().toISOString(),
        },
      };

      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      setIsVerifyingAI(false);
      setSelectedTaskForProof(null);
      setProofUrl("");
      setProofNotes("");
    }, 1200);
  }

  // Partner dual sign-off
  function handleDualApproveTask(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "approved",
              approved_by_partner: true,
            }
          : t
      )
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* ========================================================================= */}
      {/* 1. TOP HEADER: Co-Founder Partnership & Milestone Summary Card           */}
      {/* ========================================================================= */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--stroke)",
          borderRadius: "24px",
          padding: "24px 28px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "0.08em", color: "var(--accent)", textTransform: "uppercase" }}>
                ⚡ CO-FOUNDER COLLABORATIVE POD
              </span>
              <span style={{ padding: "1px 6px", borderRadius: "9999px", background: "rgba(16, 185, 129, 0.12)", color: "#10b981", fontSize: "10px", fontWeight: 800 }}>
                ACTIVE WORKSPACE
              </span>
              {categories && categories.length > 0 && Array.from(new Set(categories)).map((cat) => (
                <span
                  key={cat}
                  style={{
                    padding: "1px 8px",
                    borderRadius: "9999px",
                    background: "var(--surface-inset)",
                    border: "1px solid var(--stroke)",
                    color: "var(--muted)",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  #{cat}
                </span>
              ))}
            </div>
            <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 900, color: "var(--text-bright)", letterSpacing: "-0.02em" }}>
              {deliverables}
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--muted)" }}>
              Co-Founders: <strong style={{ color: "var(--text-bright)" }}>{currentUserProfile?.codename || "You"}</strong> &amp; <strong style={{ color: "var(--text-bright)" }}>{partner?.codename || "Partner"}</strong> &middot; ${priceAmount} Milestone Budget
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Quick Search Palette Trigger */}
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "12px",
                background: "var(--surface-inset)",
                border: "1px solid var(--stroke)",
                color: "var(--muted)",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <Search size={14} style={{ color: "var(--accent)" }} />
              <span>Search &amp; Commands</span>
              <kbd
                style={{
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  background: "var(--surface)",
                  border: "1px solid var(--stroke)",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-bright)",
                }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Escrow Status Pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "9999px",
                background: paymentStatus === "paid" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                border: `1px solid ${paymentStatus === "paid" ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                color: paymentStatus === "paid" ? "#10b981" : "#f59e0b",
                fontSize: "12px",
                fontWeight: 800,
                fontFamily: "var(--font-mono)",
              }}
            >
              <Shield size={14} />
              <span>{paymentStatus === "paid" ? "ESCROW SECURED & FUNDED" : "ESCROW PENDING"}</span>
            </div>

            {/* Quick Action */}
            <button
              type="button"
              onClick={() => setShowAddTask(true)}
              className="primary-btn"
              style={{ padding: "8px 16px", fontSize: "13px" }}
            >
              <Plus size={14} />
              <span>+ Assign Task</span>
            </button>
          </div>
        </div>

        {/* Sprint Progress Bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
            <span style={{ color: "var(--text-bright)" }}>
              Sprint Progress ({completedCount} of {tasks.length} Deliverables Approved)
            </span>
            <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
              {progressPct}% Verified
            </span>
          </div>
          <div style={{ width: "100%", height: "8px", borderRadius: "9999px", background: "var(--surface-inset)", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #10b981 0%, var(--accent) 100%)",
                borderRadius: "9999px",
              }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN RESPONSIVE WORKSPACE AREA WITH SPRING MACOS SIDEBAR             */}
      {/* ========================================================================= */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", width: "100%", position: "relative" }}>
        <MacOSWorkspaceSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onAddTask={() => setShowAddTask(true)}
          partner={partner}
          currentUserProfile={currentUserProfile}
          tasksCount={tasks.length}
          verifiedScore={tasks.find((t) => t.ai_verification)?.ai_verification?.score ?? 94}
          paymentStatus={paymentStatus}
        />

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* 2. TAB CONTENT 1: SPRINT KANBAN & TASK ASSIGNMENT MANAGEMENT */}
          {activeTab === "kanban" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {[
            { key: "todo", label: "To Do / Backlog", color: "#64748b" },
            { key: "in_progress", label: "In Progress / Sprinted", color: "#0ea5e9" },
            { key: "review", label: "Submit Proof / Under Review", color: "#f59e0b" },
            { key: "approved", label: "AI Verified & Approved", color: "#10b981" },
          ].map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div
                key={col.key}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--stroke)",
                  borderRadius: "18px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  minHeight: "400px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1px solid var(--stroke-subtle)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: col.color }} />
                    <h3 style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: "var(--text-bright)" }}>
                      {col.label}
                    </h3>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--dim)", fontFamily: "var(--font-mono)" }}>
                    {colTasks.length}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                  {colTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      style={{
                        background: "var(--surface-inset)",
                        border: "1px solid var(--stroke)",
                        borderRadius: "14px",
                        padding: "14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "6px" }}>
                        <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: "var(--text-bright)", lineHeight: 1.35 }}>
                          {task.title}
                        </h4>
                      </div>

                      {task.description && (
                        <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)", lineHeight: 1.4 }}>
                          {task.description}
                        </p>
                      )}

                      {/* Tool & Proof Badge */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                        <span
                          style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: "rgba(139, 92, 246, 0.1)",
                            color: "var(--accent-2)",
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          {task.tool_type || "TASK"}
                        </span>

                        {task.ai_verification && (
                          <span
                            style={{
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: "rgba(16, 185, 129, 0.1)",
                              color: "#10b981",
                              fontSize: "10px",
                              fontWeight: 800,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                            }}
                          >
                            <Sparkles size={10} />
                            {task.ai_verification.score}% AI Verified
                          </span>
                        )}
                      </div>

                      {/* Proof Deliverable URL */}
                      {task.deliverable_url && (
                        <a
                          href={task.deliverable_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                            color: "var(--accent)",
                            fontWeight: 700,
                            textDecoration: "none",
                            wordBreak: "break-all",
                          }}
                        >
                          <span>🔗 Proof: {task.deliverable_url.replace("https://", "").slice(0, 30)}...</span>
                          <RxArrowTopRight size={12} />
                        </a>
                      )}

                      {/* Interactive Task Actions */}
                      <div style={{ display: "flex", gap: "6px", marginTop: "6px", paddingTop: "8px", borderTop: "1px solid var(--stroke-subtle)" }}>
                        {task.status === "todo" && (
                          <button
                            type="button"
                            onClick={() => setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: "in_progress" } : t)))}
                            style={{ flex: 1, padding: "5px", fontSize: "11px", fontWeight: 700, borderRadius: "6px", background: "var(--surface)", border: "1px solid var(--stroke)", cursor: "pointer" }}
                          >
                            ⚡ Start Sprint
                          </button>
                        )}

                        {task.status === "in_progress" && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTaskForProof(task);
                              setProofUrl(task.deliverable_url || "");
                              setProofNotes(task.deliverable_notes || "");
                            }}
                            className="primary-btn"
                            style={{ flex: 1, padding: "5px", fontSize: "11px", fontWeight: 700, borderRadius: "6px" }}
                          >
                            📤 Submit Proof
                          </button>
                        )}

                        {task.status === "review" && (
                          <div style={{ display: "flex", gap: "6px", width: "100%" }}>
                            <button
                              type="button"
                              onClick={() => handleRunAIVerification(task)}
                              style={{ flex: 1, padding: "5px", fontSize: "11px", fontWeight: 800, borderRadius: "6px", background: "linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)", color: "#fff", border: "none", cursor: "pointer" }}
                            >
                              🤖 AI Verify
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDualApproveTask(task.id)}
                              style={{ flex: 1, padding: "5px", fontSize: "11px", fontWeight: 800, borderRadius: "6px", background: "#10b981", color: "#fff", border: "none", cursor: "pointer" }}
                            >
                              ✅ Approve
                            </button>
                          </div>
                        )}

                        {task.status === "approved" && (
                          <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <CheckCircle2 size={13} />
                            Dual-Signed &amp; Approved
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT 2: AI POD VERIFIER & QUALITY ASSURANCE ENGINE              */}
      {/* ========================================================================= */}
      {activeTab === "ai_verifier" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 900, color: "var(--text-bright)" }}>
                    Passion AI Pod Verifier
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--muted)" }}>
                    Automated deliverable validation against milestone specs, security rules &amp; tests
                  </p>
                </div>
              </div>

              <span style={{ padding: "4px 12px", borderRadius: "9999px", background: "rgba(16, 185, 129, 0.12)", color: "#10b981", fontSize: "12px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>
                ⚡ Pod Health: 98/100
              </span>
            </div>

            {/* List of Verified Deliverables */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
              {tasks.filter((t) => t.ai_verification).map((task) => (
                <div
                  key={task.id}
                  style={{
                    padding: "16px",
                    borderRadius: "14px",
                    background: "var(--surface-inset)",
                    border: "1px solid var(--stroke)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "var(--text-bright)" }}>
                      {task.title}
                    </h4>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#10b981",
                        fontSize: "11px",
                        fontWeight: 800,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      🛡️ {task.ai_verification?.score}% Spec Alignment
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: "12px", color: "var(--text)", lineHeight: 1.45 }}>
                    {task.ai_verification?.summary}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px", marginTop: "4px" }}>
                    {task.ai_verification?.checks.map((check, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "8px",
                          background: "var(--surface)",
                          border: "1px solid var(--stroke)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <CheckCircle2 size={13} color="#10b981" />
                          <strong style={{ fontSize: "12px", color: "var(--text-bright)" }}>{check.name}</strong>
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--muted)" }}>{check.details}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB CONTENT 3: DEV ECOSYSTEM (GITHUB, VS CODE, SUPABASE, FIGMA)        */}
      {/* ========================================================================= */}
      {activeTab === "integrations" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
          {/* GitHub Integration */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "18px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#24292e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Code2 size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "var(--text-bright)" }}>GitHub Repository &amp; PRs</h3>
                <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700 }}>● Connected &amp; Tracking CI</span>
              </div>
            </div>

            <div style={{ padding: "12px", borderRadius: "10px", background: "var(--surface-inset)", border: "1px solid var(--stroke)", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
              github.com/passion-protocol/mvp-pod &middot; branch: main
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="outline-btn"
                style={{ flex: 1, padding: "8px 12px", fontSize: "12px", textAlign: "center", textDecoration: "none" }}
              >
                View Repository ↗
              </a>
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt("Enter GitHub Repository or PR URL:");
                  if (url) handleAddEmbed("github", url);
                }}
                className="primary-btn"
                style={{ flex: 1, padding: "8px 12px", fontSize: "12px" }}
              >
                + Link PR
              </button>
            </div>
          </div>

          {/* VS Code Integration */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "18px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#007acc", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Terminal size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "var(--text-bright)" }}>VS Code &amp; Web Editor</h3>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>One-click workspace launcher</span>
              </div>
            </div>

            <div style={{ padding: "12px", borderRadius: "10px", background: "var(--surface-inset)", border: "1px solid var(--stroke)", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-bright)" }}>
              $ git clone https://github.com/... &amp;&amp; npm i &amp;&amp; npm run dev
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <a
                href="https://github.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="primary-btn"
                style={{ flex: 1, padding: "8px 12px", fontSize: "12px", textAlign: "center", textDecoration: "none", background: "#007acc" }}
              >
                Open in Web VS Code ↗
              </a>
            </div>
          </div>

          {/* Supabase Database Status */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "18px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#3ecf8e", color: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Database size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "var(--text-bright)" }}>Supabase Backend &amp; RLS</h3>
                <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700 }}>● PostgreSQL 15 &middot; RLS Active</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "11px" }}>
              <div style={{ padding: "8px", background: "var(--surface-inset)", borderRadius: "8px", border: "1px solid var(--stroke)" }}>
                <span style={{ color: "var(--muted)", display: "block" }}>Tables Active</span>
                <strong style={{ color: "var(--text-bright)" }}>6 Schemas</strong>
              </div>
              <div style={{ padding: "8px", background: "var(--surface-inset)", borderRadius: "8px", border: "1px solid var(--stroke)" }}>
                <span style={{ color: "var(--muted)", display: "block" }}>Realtime Channels</span>
                <strong style={{ color: "var(--text-bright)" }}>4 P2P Subscriptions</strong>
              </div>
            </div>
          </div>

          {/* Figma Design Studio */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "18px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f24e1e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Layers size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "var(--text-bright)" }}>Figma Design Studio</h3>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>Shared canvas &amp; design kit</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const url = window.prompt("Enter Figma Share URL:");
                if (url) handleAddEmbed("figma", url);
              }}
              className="outline-btn"
              style={{ padding: "8px 12px", fontSize: "12px" }}
            >
              + Mount Figma Canvas
            </button>
          </div>

          {/* Mounted Embeds List */}
          {embeds.length > 0 && (
            <div style={{ gridColumn: "1 / -1", background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "18px", padding: "20px" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: 800, color: "var(--text-bright)" }}>
                Mounted Ecosystem Links &amp; Canvases ({embeds.length})
              </h3>
              <div style={{ display: "grid", gap: "8px" }}>
                {embeds.map((emb) => (
                  <div
                    key={emb.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      background: "var(--surface-inset)",
                      borderRadius: "10px",
                      border: "1px solid var(--stroke)",
                      fontSize: "12px",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "var(--text-bright)" }}>{emb.title || emb.embed_type}</span>
                    <a
                      href={emb.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      <span>Open Tool</span>
                      <RxArrowTopRight size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB CONTENT 4: TREASURY & ESCROW SPLIT                                 */}
      {/* ========================================================================= */}
      {activeTab === "treasury" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: "var(--text-bright)" }}>
                Milestone Escrow &amp; Revenue Split
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted)" }}>
                Secured milestone funds are held in escrow and released upon dual sign-off.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {paymentStatus === "paid" ? (
                <span style={{ padding: "6px 14px", borderRadius: "9999px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontSize: "13px", fontWeight: 800 }}>
                  Funds Secured in Escrow ✔
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={pending}
                  className="primary-btn"
                  style={{ padding: "10px 20px", fontSize: "13px" }}
                >
                  {pending ? "Syncing..." : "⚡ Fund & Mark as Secured"}
                </button>
              )}
            </div>
          </div>

          {/* Financial Breakdown Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            <div style={{ padding: "16px", background: "var(--surface-inset)", borderRadius: "12px", border: "1px solid var(--stroke)" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Total Contract Budget</span>
              <h4 style={{ margin: "4px 0 0", fontSize: "1.5rem", fontWeight: 900, color: "var(--text-bright)", fontFamily: "var(--font-mono)" }}>
                ${priceAmount}
              </h4>
            </div>

            <div style={{ padding: "16px", background: "var(--surface-inset)", borderRadius: "12px", border: "1px solid var(--stroke)" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Platform Escrow Fee ({platformFeePct}%)</span>
              <h4 style={{ margin: "4px 0 0", fontSize: "1.5rem", fontWeight: 900, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                ${feeAmount.toFixed(2)}
              </h4>
            </div>

            <div style={{ padding: "16px", background: "var(--surface-inset)", borderRadius: "12px", border: "1px solid var(--stroke)" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{currentUserProfile?.codename || "You"} ({revenueSplitA}%)</span>
              <h4 style={{ margin: "4px 0 0", fontSize: "1.5rem", fontWeight: 900, color: "#10b981", fontFamily: "var(--font-mono)" }}>
                ${payoutA.toFixed(2)}
              </h4>
            </div>

            <div style={{ padding: "16px", background: "var(--surface-inset)", borderRadius: "12px", border: "1px solid var(--stroke)" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{partner?.codename || "Partner"} ({revenueSplitB}%)</span>
              <h4 style={{ margin: "4px 0 0", fontSize: "1.5rem", fontWeight: 900, color: "#10b981", fontFamily: "var(--font-mono)" }}>
                ${payoutB.toFixed(2)}
              </h4>
            </div>
          </div>

          {partnerPaymentLink && (
            <div style={{ padding: "14px", background: "var(--surface-inset)", borderRadius: "12px", border: "1px solid var(--stroke)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", display: "block" }}>
                  Partner Direct Settlement Link
                </span>
                <span style={{ fontSize: "13px", color: "var(--text-bright)", fontFamily: "var(--font-mono)" }}>
                  {partnerPaymentLink}
                </span>
              </div>
              <a
                href={partnerPaymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-btn"
                style={{ padding: "6px 14px", fontSize: "12px" }}
              >
                Open External Gateway &rarr;
              </a>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB CONTENT 5: ASSET DROPZONE & VAULT FILES                            */}
      {/* ========================================================================= */}
      {activeTab === "files" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: "var(--text-bright)" }}>
                Encrypted File Vault
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted)" }}>
                Upload architectural diagrams, PRDs, seed data, and contracts (10MB max).
              </p>
            </div>

            <label className="primary-btn" style={{ cursor: pending ? "wait" : "pointer", padding: "8px 16px", fontSize: "13px" }}>
              {pending ? "Encrypting Upload..." : "Upload Asset ☁"}
              <input
                type="file"
                hidden
                disabled={pending}
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) startTransition(() => onUpload(file));
                }}
              />
            </label>
          </div>

          {error && <p className="error" style={{ margin: 0, padding: "10px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", color: "#ef4444", fontSize: "12px" }}>{error}</p>}

          {files.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--dim)", background: "var(--surface-inset)", borderRadius: "14px", border: "1px dashed var(--stroke)" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>📁</div>
              <p style={{ margin: 0, fontSize: "13px" }}>No files uploaded yet. Drag &amp; drop or click Upload Asset.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {files.map((f) => (
                <div
                  key={f.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "var(--surface-inset)",
                    border: "1px solid var(--stroke)",
                    borderRadius: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "20px" }}>📄</span>
                    <div>
                      <strong style={{ fontSize: "13px", color: "var(--text-bright)", display: "block" }}>{f.file_name}</strong>
                      <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                        {(f.size_bytes / 1024).toFixed(0)} KB &middot; {new Date(f.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button type="button" onClick={() => openFile(f.path)} className="outline-btn" style={{ padding: "6px 12px", fontSize: "12px" }}>
                    Open ↗
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB CONTENT 6: 48-HOUR SPRINT BOUNTY CHALLENGE & MONETIZATION STRATEGY */}
      {/* ========================================================================= */}
      {activeTab === "challenges" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--stroke)", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <Trophy size={18} color="#f59e0b" />
              <span style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "0.08em", color: "#f59e0b", textTransform: "uppercase" }}>
                PASSION 48-HOUR SPRINT CHALLENGE
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 900, color: "var(--text-bright)" }}>
              Compete in Co-Founder Bounties &amp; Win Sponsored Prizes
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
              Co-founders find each other on Passion Protocol, lock an active pod workspace, sprint for 48 hours, and submit their AI-verified MVP to win prize pools sponsored by Supabase, Vercel &amp; Stripe.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <div style={{ padding: "18px", borderRadius: "14px", background: "var(--surface-inset)", border: "1px solid var(--stroke)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Flame size={16} color="var(--accent)" />
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "var(--text-bright)" }}>
                  1. How We Monetize &amp; Charge
                </h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "var(--muted)", lineHeight: 1.6 }}>
                <li><strong>Free Matching &amp; Portfolio:</strong> $0 fee on non-funded open-source / portfolio trial sprints.</li>
                <li><strong>Milestone Escrow Fee:</strong> 5% platform protection fee on funded deliverables (Stripe Connect).</li>
                <li><strong>Verified Pro Pass:</strong> $19/month for unlimited AI Pod Verifier runs, priority discover rank, and certified NFT credentials.</li>
              </ul>
            </div>

            <div style={{ padding: "18px", borderRadius: "14px", background: "var(--surface-inset)", border: "1px solid var(--stroke)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Zap size={16} color="#10b981" />
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "var(--text-bright)" }}>
                  2. The 48h Viral Growth Loop
                </h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "var(--muted)", lineHeight: 1.6 }}>
                <li><strong>Find Your Match:</strong> Match with a partner in 30 seconds using 4D Working Rhythm.</li>
                <li><strong>Sprint &amp; AI Verify:</strong> Build an MVP and pass the Passion AI Pod Verifier.</li>
                <li><strong>Win $2,500 Bounties:</strong> Top verified pods get featured to angel investors and win prize pools.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. MODAL: ASSIGN NEW SPRINT TASK                                          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showAddTask && (
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
              onClick={() => setShowAddTask(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              style={{
                position: "relative",
                maxWidth: "480px",
                width: "100%",
                background: "var(--surface)",
                border: "1px solid var(--stroke)",
                borderRadius: "20px",
                padding: "24px",
                zIndex: 10,
              }}
            >
              <h3 style={{ margin: "0 0 16px", fontSize: "1.2rem", fontWeight: 900, color: "var(--text-bright)" }}>
                Assign New Pod Task
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <label>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Task Title</span>
                  <input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="E.g. Setup Supabase Auth & RLS rules"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--stroke)", background: "var(--surface-inset)", marginTop: "4px", boxSizing: "border-box" }}
                  />
                </label>

                <label>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Scope / Acceptance Criteria</span>
                  <textarea
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Outline what needs to be delivered and verified..."
                    rows={3}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--stroke)", background: "var(--surface-inset)", marginTop: "4px", boxSizing: "border-box" }}
                  />
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Assignee</span>
                    <select
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--stroke)", background: "var(--surface-inset)", marginTop: "4px" }}
                    >
                      <option value={currentUserId}>You ({currentUserProfile?.codename || "Lead"})</option>
                      <option value={partner?.id || "partner"}>Partner ({partner?.codename || "Partner"})</option>
                    </select>
                  </label>

                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Tool Integration</span>
                    <select
                      value={newTaskTool}
                      onChange={(e) => setNewTaskTool(e.target.value as ToolType)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--stroke)", background: "var(--surface-inset)", marginTop: "4px" }}
                    >
                      <option value="github">GitHub PR</option>
                      <option value="vscode">VS Code</option>
                      <option value="supabase">Supabase Schema</option>
                      <option value="figma">Figma UI</option>
                      <option value="general">General Deliverable</option>
                    </select>
                  </label>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                  <button type="button" onClick={() => setShowAddTask(false)} className="outline-btn" style={{ flex: 1, padding: "10px" }}>
                    Cancel
                  </button>
                  <button type="button" onClick={handleCreateTask} className="primary-btn" style={{ flex: 1.5, padding: "10px" }}>
                    Assign Task &rarr;
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 9. MODAL: SUBMIT DELIVERABLE PROOF & TRIGGER AI VERIFIER                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedTaskForProof && (
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
              onClick={() => setSelectedTaskForProof(null)}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              style={{
                position: "relative",
                maxWidth: "500px",
                width: "100%",
                background: "var(--surface)",
                border: "1px solid var(--stroke)",
                borderRadius: "20px",
                padding: "24px",
                zIndex: 10,
              }}
            >
              <h3 style={{ margin: "0 0 4px", fontSize: "1.2rem", fontWeight: 900, color: "var(--text-bright)" }}>
                Submit Proof of Deliverable
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: "12px", color: "var(--muted)" }}>
                {selectedTaskForProof.title}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <label>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>GitHub PR / Figma / Preview URL</span>
                  <input
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="https://github.com/passion-protocol/pull/1"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--stroke)", background: "var(--surface-inset)", marginTop: "4px", boxSizing: "border-box" }}
                  />
                </label>

                <label>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Notes &amp; Verification Instructions</span>
                  <textarea
                    value={proofNotes}
                    onChange={(e) => setProofNotes(e.target.value)}
                    placeholder="Describe completed deliverables and how partner/AI should verify..."
                    rows={3}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--stroke)", background: "var(--surface-inset)", marginTop: "4px", boxSizing: "border-box" }}
                  />
                </label>

                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                  <button type="button" onClick={() => setSelectedTaskForProof(null)} className="outline-btn" style={{ flex: 1, padding: "10px" }}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRunAIVerification(selectedTaskForProof)}
                    disabled={isVerifyingAI}
                    className="primary-btn"
                    style={{ flex: 2, padding: "10px", background: "linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)" }}
                  >
                    {isVerifyingAI ? "AI Inspecting Code & Specs..." : "⚡ Submit & Run AI Verifier"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 10. COMMAND PALETTE & SEARCH MODAL */}
      <WorkspaceSearchModal
        open={showSearchModal}
        onOpenChange={setShowSearchModal}
        tasks={tasks}
        files={files}
        onSelectTab={setActiveTab}
        onAddTask={() => setShowAddTask(true)}
        onVerifyAI={handleTriggerAIModal}
        onLaunchVSCode={handleLaunchVSCode}
        onUploadFile={() => setActiveTab("files")}
      />
    </div>
  );
}

export default WorkspaceBoard;
