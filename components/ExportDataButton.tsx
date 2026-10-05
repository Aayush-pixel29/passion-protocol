"use client";

import type { Profile, VibeAnswers, Project } from "@/lib/types";

type Props = {
  userData: {
    profile: Profile | null;
    vibe: VibeAnswers | null;
    project: Project | null;
    exportedAt: string;
  };
};

export function ExportDataButton({ userData }: Props) {
  function handleExport() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `passion-protocol-data-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="outline-btn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: "14px",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Export My Data (JSON)
    </button>
  );
}
