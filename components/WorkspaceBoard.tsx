"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { WorkspaceFile } from "@/lib/types";
import { createCheckoutSession } from "@/lib/actions";

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

export function WorkspaceBoard({
  contractId,
  currentUserId,
  initialFiles,
  paymentStatus,
  categories,
}: {
  contractId: string;
  currentUserId: string;
  initialFiles: WorkspaceFile[];
  paymentStatus: "paid" | "unpaid";
  categories: string[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [files, setFiles] = useState(initialFiles);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

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

  async function handlePayment() {
    setError("");
    startTransition(async () => {
      const { url, error: paymentError } = await createCheckoutSession(contractId);
      if (paymentError) {
        setError(paymentError);
      } else if (url) {
        window.location.href = url;
      }
    });
  }

  return (
    <>
      <section className="glass-panel" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h3 style={{ margin: 0, color: "var(--text-bright)" }}>Milestone Payment</h3>
            <p className="sub" style={{ margin: "6px 0 0", fontSize: 14 }}>
              Securely release funds to your partner&apos;s connected Stripe account.
            </p>
          </div>
          {paymentStatus === "paid" ? (
            <button className="pill-btn accept" disabled style={{ background: "#10b981", borderColor: "#10b981" }}>
              ✔ Paid
            </button>
          ) : (
            <button className="pill-btn accept" onClick={handlePayment} disabled={pending}>
              {pending ? "Loading..." : "Pay via Stripe"}
            </button>
          )}
        </div>
        {error ? <p className="error" style={{ marginTop: 12 }}>{error}</p> : null}
      </section>

      {/* Role-based Dynamic Hub Blocks */}
      {categories.includes("Software & IT") && (
        <section className="glass-panel" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-bright)" }}>Developer Hub</h3>
              <p className="sub" style={{ margin: "6px 0 0", fontSize: 14 }}>
                Provision a shared GitHub repository or link your Linear ticket board.
              </p>
            </div>
            <button className="pill-btn skip">Link GitHub</button>
          </div>
        </section>
      )}

      {categories.includes("Creative & Design") && (
        <section className="glass-panel" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-bright)" }}>Design Studio</h3>
              <p className="sub" style={{ margin: "6px 0 0", fontSize: 14 }}>
                Embed a live Figma canvas or Miro board for real-time collaboration.
              </p>
            </div>
            <button className="pill-btn skip">Embed Figma</button>
          </div>
        </section>
      )}

      {(categories.includes("Business & Sales") || categories.includes("Marketing & Content")) && (
        <section className="glass-panel" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-bright)" }}>Operations Hub</h3>
              <p className="sub" style={{ margin: "6px 0 0", fontSize: 14 }}>
                Pin your Notion PRD, Google Sheets CRM, or Strategy documents.
              </p>
            </div>
            <button className="pill-btn skip">Link Notion</button>
          </div>
        </section>
      )}

      <section className="glass-panel" style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
        <div>
          <h3 style={{ margin: 0, color: "var(--text-bright)" }}>Shared files</h3>
          <p className="sub" style={{ margin: "6px 0 0", fontSize: 14 }}>
            Images, PDFs, and docs — only the two of you can see these.
          </p>
        </div>
        <label className="pill-btn accept" style={{ cursor: pending ? "wait" : "pointer" }}>
          {pending ? "Uploading…" : "Upload file"}
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
      {error ? <p className="error">{error}</p> : null}
      {files.length === 0 ? (
        <div className="empty" style={{ padding: 32 }}>
          No files yet. Drop the mock, spec, or screenshot you need to start.
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
          {files.map((f) => (
            <li
              key={f.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                padding: "12px 14px",
                background: "var(--surface-inset)",
                border: "1px solid var(--stroke-subtle)",
                borderRadius: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: "var(--text-bright)" }}>{f.file_name}</div>
                <div className="sub" style={{ fontSize: 12, margin: 0 }}>
                  {(f.size_bytes / 1024).toFixed(0)} KB · {new Date(f.created_at).toLocaleString()}
                </div>
              </div>
              <button type="button" className="pill-btn skip" onClick={() => openFile(f.path)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
    </>
  );
}
