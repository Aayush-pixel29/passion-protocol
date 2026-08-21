"use client";

import { useState, useTransition } from "react";
import { saveProject } from "@/lib/actions";
import type { Project } from "@/lib/types";

export function ProjectForm({ project }: { project: Project | null }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const action = (formData: FormData) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await saveProject(formData);
      if (res?.error) {
        setFeedback({ type: "error", text: res.error });
        alert(res.error);
      } else {
        setFeedback({ type: "success", text: "Project pitch saved successfully!" });
        alert("Project saved!");
      }
    });
  };

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {feedback ? (
        <div
          className={feedback.type === "error" ? "error" : "glass-inset"}
          style={{
            padding: "12px 16px",
            color: feedback.type === "error" ? "var(--danger)" : "var(--success)",
            borderColor: feedback.type === "error" ? "rgba(244, 63, 94, 0.3)" : "rgba(16, 185, 129, 0.3)",
            background: feedback.type === "error" ? "rgba(244, 63, 94, 0.08)" : "rgba(16, 185, 129, 0.08)",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>{feedback.type === "error" ? "⚠️" : "✨"}</span>
          <span>{feedback.text}</span>
        </div>
      ) : null}

      <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="label" style={{ margin: 0 }}>Project Title</span>
          <span style={{ fontSize: "12px", color: "var(--dim)" }}>3–100 characters</span>
        </div>
        <input
          className="input"
          name="title"
          defaultValue={project?.title || ""}
          placeholder="E.g., Next-Gen Fintech Protocol"
          required
          minLength={3}
          maxLength={100}
          style={{ margin: 0 }}
        />
      </label>
      
      <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="label" style={{ margin: 0 }}>Project Description</span>
          <span style={{ fontSize: "12px", color: "var(--dim)" }}>10–1000 characters</span>
        </div>
        <textarea
          className="input"
          name="description"
          defaultValue={project?.description || ""}
          placeholder="Describe your vision, current prototype stage, tech stack, and what co-founder superpowers you need..."
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          style={{ margin: 0, resize: "vertical", minHeight: "110px" }}
        />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="label" style={{ margin: 0 }}>Budget or Equity Range (Optional)</span>
          <span style={{ fontSize: "12px", color: "var(--dim)" }}>E.g. $1,000–$5,000 or 10–20% Equity</span>
        </div>
        <input
          className="input"
          name="budget_range"
          defaultValue={project?.budget_range || ""}
          placeholder="E.g., $2,500 milestone budget or 15% Co-founder Equity"
          maxLength={100}
          style={{ margin: 0 }}
        />
      </label>

      <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 4 }}>
        <button type="submit" disabled={isPending} className="primary-btn" style={{ minWidth: "180px" }}>
          {isPending ? "Saving..." : project ? "Update Project" : "Create Project"}
        </button>
      </div>
    </form>
  );
}

