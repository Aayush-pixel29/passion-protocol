"use client";

import { useTransition } from "react";
import { saveProject } from "@/lib/actions";
import type { Project } from "@/lib/types";

export function ProjectForm({ project }: { project: Project | null }) {
  const [isPending, startTransition] = useTransition();

  const action = (formData: FormData) => {
    startTransition(async () => {
      const res = await saveProject(formData);
      if (res?.error) {
        alert(res.error);
      } else {
        alert("Project saved!");
      }
    });
  };

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <label>
        <span className="label">Project Title</span>
        <input name="title" defaultValue={project?.title || ""} placeholder="E.g., Next-Gen Fintech App" required minLength={3} maxLength={100} />
      </label>
      
      <label>
        <span className="label">Project Description</span>
        <textarea name="description" defaultValue={project?.description || ""} placeholder="Describe what you are building and what kind of help you need..." required minLength={10} maxLength={1000} rows={4} />
      </label>

      <label>
        <span className="label">Budget or Equity Range (Optional)</span>
        <input name="budget_range" defaultValue={project?.budget_range || ""} placeholder="E.g., $1000-$5000 or 5-10% Equity" maxLength={100} />
      </label>

      <button type="submit" disabled={isPending} className="primary-btn">
        {isPending ? "Saving..." : project ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
}
