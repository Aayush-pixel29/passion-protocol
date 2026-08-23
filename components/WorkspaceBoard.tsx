"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { WorkspaceFile, WorkspaceEmbed } from "@/lib/types";
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
  initialEmbeds,
  paymentStatus,
  categories,
}: {
  contractId: string;
  currentUserId: string;
  initialFiles: WorkspaceFile[];
  initialEmbeds: WorkspaceEmbed[];
  paymentStatus: "paid" | "unpaid";
  categories: string[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [files, setFiles] = useState(initialFiles);
  const [embeds, setEmbeds] = useState<WorkspaceEmbed[]>(initialEmbeds);
  const [paymentError, setPaymentError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [embedError, setEmbedError] = useState("");
  const [pending, startTransition] = useTransition();

  async function onUpload(file: File) {
    setUploadError("");
    if (!ALLOWED.has(file.type)) {
      setUploadError("Use an image, PDF, Word doc, or text file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError("File must be 10MB or smaller.");
      return;
    }
    const path = `${contractId}/${crypto.randomUUID()}-${safeName(file.name)}`;
    const { error: upError } = await supabase.storage.from("pod-workspace").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (upError) {
      setUploadError(upError.message);
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
      setUploadError(metaError.message);
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
      setUploadError(signError?.message || "Could not open file.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function handleAddEmbed(type: "figma" | "github" | "notion", url: string) {
    if (!url) return;
    setUploadError("");

    // Validate URL
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      setEmbedError("Invalid URL format.");
      return;
    }

    if (parsedUrl.protocol !== "https:") {
      setEmbedError("Only HTTPS URLs are allowed.");
      return;
    }

    const host = parsedUrl.hostname.toLowerCase();
    
    if (type === "github" && host !== "github.com") {
      setEmbedError("Only github.com URLs are allowed for Developer Hub.");
      return;
    }
    
    if (type === "figma" && host !== "www.figma.com" && host !== "figma.com") {
      setEmbedError("Only figma.com URLs are allowed for Design Studio.");
      return;
    }
    
    if (type === "notion" && !host.endsWith("notion.so") && !host.endsWith("notion.site")) {
      setEmbedError("Only Notion URLs are allowed for Operations Hub.");
      return;
    }

    // Sanitize Figma URL to always be the embed format if not already
    let finalUrl = url;
    if (type === "figma") {
      // The embed iframe does this dynamically, but storing it clean is safer
      // We will let the iframe renderer handle it, so just store the validated URL
      finalUrl = url;
    }

    const { data, error: insertError } = await supabase
      .from("workspace_embeds")
      .insert({
        contract_id: contractId,
        added_by: currentUserId,
        embed_type: type,
        url: finalUrl,
        title: `${type} Link`
      })
      .select("*")
      .single();
      
    if (insertError) {
      setEmbedError(insertError.message);
    } else if (data) {
      setEmbeds(prev => [data as WorkspaceEmbed, ...prev]);
    }
  }

  async function handlePayment() {
    setUploadError("");
    startTransition(async () => {
      const { url, error: paymentError } = await createCheckoutSession(contractId);
      if (paymentError) {
        setPaymentError(paymentError);
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
        {paymentError ? <p className="error" style={{ marginTop: 12 }}>{paymentError}</p> : null}
      </section>

      {/* Role-based Dynamic Hub Blocks */}
      {categories.includes("Software & IT") && (
        <section className="glass-panel" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: embeds.some(e => e.embed_type === 'github') ? 16 : 0 }}>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-bright)" }}>Developer Hub</h3>
              <p className="sub" style={{ margin: "6px 0 0", fontSize: 14 }}>
                Provision a shared GitHub repository or link your Linear ticket board.
              </p>
            </div>
            <button 
              className="pill-btn skip"
              onClick={() => {
                const url = window.prompt("Enter GitHub Repository URL:");
                if (url) handleAddEmbed("github", url);
              }}
            >
              Link GitHub
            </button>
          </div>
          {embeds.filter(e => e.embed_type === 'github').length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {embeds.filter(e => e.embed_type === 'github').map(e => (
                <a key={e.id} href={e.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", padding: "12px 16px", background: "var(--surface-inset)", border: "1px solid var(--stroke)", borderRadius: 8, color: "var(--text-bright)", textDecoration: "none" }}>
                  <span style={{ marginRight: 12 }}>💻</span>
                  <span style={{ flexGrow: 1 }}>{e.url.replace("https://github.com/", "")}</span>
                  <span style={{ color: "var(--accent-primary)", fontSize: 13 }}>Open &rarr;</span>
                </a>
              ))}
            </div>
          )}
        </section>
      )}

      {categories.includes("Creative & Design") && (
        <section className="glass-panel" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: embeds.some(e => e.embed_type === 'figma') ? 16 : 0 }}>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-bright)" }}>Design Studio</h3>
              <p className="sub" style={{ margin: "6px 0 0", fontSize: 14 }}>
                Embed a live Figma canvas or Miro board for real-time collaboration.
              </p>
            </div>
            <button 
              className="pill-btn skip"
              onClick={() => {
                const url = window.prompt("Enter Figma Share URL:");
                if (url) handleAddEmbed("figma", url);
              }}
            >
              Embed Figma
            </button>
          </div>
          {embeds.filter(e => e.embed_type === 'figma').length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {embeds.filter(e => e.embed_type === 'figma').map(e => {
                const isFigmaUrl = e.url.includes('figma.com');
                const embedUrl = isFigmaUrl ? `https://www.figma.com/embed?embed_host=passionprotocol&url=${encodeURIComponent(e.url)}` : e.url;
                
                return (
                  <div key={e.id} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--stroke)" }}>
                    <iframe 
                      src={embedUrl}
                      style={{ width: "100%", height: 400, border: "none" }}
                      allowFullScreen
                      sandbox="allow-same-origin allow-scripts allow-popups"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {(categories.includes("Business & Sales") || categories.includes("Marketing & Content")) && (
        <section className="glass-panel" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: embeds.some(e => e.embed_type === 'notion') ? 16 : 0 }}>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-bright)" }}>Operations Hub</h3>
              <p className="sub" style={{ margin: "6px 0 0", fontSize: 14 }}>
                Pin your Notion PRD, Google Sheets CRM, or Strategy documents.
              </p>
            </div>
            <button 
              className="pill-btn skip"
              onClick={() => {
                const url = window.prompt("Enter Notion or Google Doc URL:");
                if (url) handleAddEmbed("notion", url);
              }}
            >
              Link Doc
            </button>
          </div>
          {embeds.filter(e => e.embed_type === 'notion').length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {embeds.filter(e => e.embed_type === 'notion').map(e => (
                <a key={e.id} href={e.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", padding: "12px 16px", background: "var(--surface-inset)", border: "1px solid var(--stroke)", borderRadius: 8, color: "var(--text-bright)", textDecoration: "none" }}>
                  <span style={{ marginRight: 12 }}>📝</span>
                  <span style={{ flexGrow: 1 }}>{e.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
                  <span style={{ color: "var(--accent-primary)", fontSize: 13 }}>Open &rarr;</span>
                </a>
              ))}
            </div>
          )}
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
      {uploadError ? <p className="error">{uploadError}</p> : null}
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
