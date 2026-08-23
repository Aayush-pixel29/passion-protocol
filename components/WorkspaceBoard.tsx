"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { WorkspaceFile, WorkspaceEmbed } from "@/lib/types";
import { markContractAsPaid } from "@/lib/actions";

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
  partnerPaymentLink,
}: {
  contractId: string;
  currentUserId: string;
  initialFiles: WorkspaceFile[];
  initialEmbeds: WorkspaceEmbed[];
  paymentStatus: "paid" | "unpaid";
  categories: string[];
  partnerPaymentLink?: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [files, setFiles] = useState(initialFiles);
  const [embeds, setEmbeds] = useState<WorkspaceEmbed[]>(initialEmbeds);
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

  async function handleAddEmbed(type: "figma" | "github" | "notion", url: string) {
    if (!url) return;
    setError("");

    // Validate URL
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      setError("Invalid URL format.");
      return;
    }

    if (parsedUrl.protocol !== "https:") {
      setError("Only HTTPS URLs are allowed.");
      return;
    }

    const host = parsedUrl.hostname.toLowerCase();
    
    if (type === "github" && host !== "github.com") {
      setError("Only github.com URLs are allowed for Developer Hub.");
      return;
    }
    
    if (type === "figma" && host !== "www.figma.com" && host !== "figma.com") {
      setError("Only figma.com URLs are allowed for Design Studio.");
      return;
    }
    
    if (type === "notion" && !host.endsWith("notion.so") && !host.endsWith("notion.site")) {
      setError("Only Notion URLs are allowed for Operations Hub.");
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
      setError(insertError.message);
    } else if (data) {
      setEmbeds(prev => [data as WorkspaceEmbed, ...prev]);
    }
  }

  async function handlePayment() {
    setError("");
    startTransition(async () => {
      const { error: paymentError } = await markContractAsPaid(contractId);
      if (paymentError) {
        setError(paymentError);
      }
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Milestone Payment Widget */}
      <section className="" style={{ padding: 32, borderRadius: 24, position: "relative", overflow: "hidden" }}>
        {paymentStatus === "unpaid" ? (
          <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: "#000000", boxShadow: "var(--glow-rose)" }} />
        ) : (
          <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: "#000000", boxShadow: "var(--)" }} />
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <h3 style={{ margin: "0 0 8px 0", color: "#000000", fontSize: 24, fontWeight: 800 }}>
              Milestone Treasury
            </h3>
            <p className="sub" style={{ margin: 0, fontSize: 14, fontFamily: "var(--font-mono)" }}>
              Directly fund this milestone via the partner&apos;s secure gateway.
            </p>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {paymentStatus === "unpaid" && partnerPaymentLink && (
              <a 
                href={partnerPaymentLink.startsWith('http') ? partnerPaymentLink : `upi://pay?pa=${partnerPaymentLink}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="pill-btn"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #000000", color: "#000000", fontWeight: 700 }}
              >
                Initiate Transfer ↗
              </a>
            )}
            {paymentStatus === "unpaid" && !partnerPaymentLink && (
              <span className="sub" style={{ fontSize: 13, padding: "8px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 32, border: "1px solid #000000" }}>
                Awaiting Routing Link
              </span>
            )}
            {paymentStatus === "paid" ? (
              <button className="pill-btn accept" disabled style={{ background: "rgba(0, 255, 179, 0.1)", color: "#000000", border: "1px solid #000000", opacity: 1, boxShadow: "0 0 16px #000000", cursor: "default" }}>
                Funds Secured ✔
              </button>
            ) : (
              <button className="pill-btn" onClick={handlePayment} disabled={pending} style={{ background: "#000000", color: "#000", fontWeight: 800 }}>
                {pending ? "Syncing..." : "Mark as Transferred"}
              </button>
            )}
          </div>
        </div>
        {error ? <p className="error" style={{ marginTop: 16, padding: "12px", background: "rgba(255,61,120,0.1)", borderRadius: 8, border: "1px solid #000000" }}>{error}</p> : null}
      </section>

      {/* Role-based Dynamic Hub Blocks */}
      {categories.includes("Software & IT") && (
        <section className="" style={{ padding: 32, borderRadius: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: embeds.some(e => e.embed_type === 'github') ? 24 : 0 }}>
            <div>
              <h3 style={{ margin: "0 0 8px 0", color: "#000000", fontSize: 20, fontWeight: 800 }}>Developer Terminal</h3>
              <p className="sub" style={{ margin: 0, fontSize: 14 }}>
                Provision a shared codebase or ticket board.
              </p>
            </div>
            <button 
              className="pill-btn skip"
              onClick={() => {
                const url = window.prompt("Enter GitHub Repository URL:");
                if (url) handleAddEmbed("github", url);
              }}
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              + Link Repository
            </button>
          </div>
          {embeds.filter(e => e.embed_type === 'github').length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {embeds.filter(e => e.embed_type === 'github').map(e => (
                <a key={e.id} href={e.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", padding: "16px", background: "rgba(0,0,0,0.3)", border: "1px solid #000000", borderRadius: 16, color: "#000000", textDecoration: "none", transition: "all 0.2s ease" }} className="hover:border-cyan-500 hover:bg-cyan-900/10">
                  <span style={{ marginRight: 16, fontSize: 20 }}>💻</span>
                  <span style={{ flexGrow: 1, fontFamily: "var(--font-mono)", fontSize: 14 }}>{e.url.replace("https://github.com/", "")}</span>
                  <span style={{ color: "#000000", fontSize: 13, fontWeight: 700 }}>EXECUTE ↗</span>
                </a>
              ))}
            </div>
          )}
        </section>
      )}

      {categories.includes("Creative & Design") && (
        <section className="" style={{ padding: 32, borderRadius: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: embeds.some(e => e.embed_type === 'figma') ? 24 : 0 }}>
            <div>
              <h3 style={{ margin: "0 0 8px 0", color: "#000000", fontSize: 20, fontWeight: 800 }}>Design Studio</h3>
              <p className="sub" style={{ margin: 0, fontSize: 14 }}>
                Embed a live Figma canvas for real-time collaboration.
              </p>
            </div>
            <button 
              className="pill-btn skip"
              onClick={() => {
                const url = window.prompt("Enter Figma Share URL:");
                if (url) handleAddEmbed("figma", url);
              }}
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              + Mount Canvas
            </button>
          </div>
          {embeds.filter(e => e.embed_type === 'figma').length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {embeds.filter(e => e.embed_type === 'figma').map(e => {
                const isFigmaUrl = e.url.includes('figma.com');
                const embedUrl = isFigmaUrl ? `https://www.figma.com/embed?embed_host=passionprotocol&url=${encodeURIComponent(e.url)}` : e.url;
                
                return (
                  <div key={e.id} style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #000000", boxShadow: "0 0 32px #f4f4f5" }}>
                    <iframe 
                      src={embedUrl}
                      style={{ width: "100%", height: 500, border: "none", background: "#000" }}
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
        <section className="" style={{ padding: 32, borderRadius: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: embeds.some(e => e.embed_type === 'notion') ? 24 : 0 }}>
            <div>
              <h3 style={{ margin: "0 0 8px 0", color: "#000000", fontSize: 20, fontWeight: 800 }}>Operations Hub</h3>
              <p className="sub" style={{ margin: 0, fontSize: 14 }}>
                Pin your Notion PRD, Strategy, or Analytics docs.
              </p>
            </div>
            <button 
              className="pill-btn skip"
              onClick={() => {
                const url = window.prompt("Enter Notion or Google Doc URL:");
                if (url) handleAddEmbed("notion", url);
              }}
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              + Link Blueprint
            </button>
          </div>
          {embeds.filter(e => e.embed_type === 'notion').length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {embeds.filter(e => e.embed_type === 'notion').map(e => (
                <a key={e.id} href={e.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", padding: "16px", background: "rgba(0,0,0,0.3)", border: "1px solid #000000", borderRadius: 16, color: "#000000", textDecoration: "none", transition: "all 0.2s ease" }} className="hover:border-purple-500 hover:bg-purple-900/10">
                  <span style={{ marginRight: 16, fontSize: 20 }}>📝</span>
                  <span style={{ flexGrow: 1, fontFamily: "var(--font-mono)", fontSize: 14 }}>{e.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
                  <span style={{ color: "#000000", fontSize: 13, fontWeight: 700 }}>OPEN ↗</span>
                </a>
              ))}
            </div>
          )}
        </section>
      )}

      <section 
        style={{ 
          padding: 32, 
          borderRadius: 24,
          background: "#f4f4f5",
          border: "2px dashed #000000",
          position: "relative",
          transition: "all 0.2s"
        }}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.style.borderColor = "#000000"; e.currentTarget.style.background = "rgba(0,255,179,0.05)"; }}
        onDragLeave={(e) => { e.currentTarget.style.borderColor = "#000000"; e.currentTarget.style.background = "#f4f4f5"; }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.style.borderColor = "#000000"; e.currentTarget.style.background = "#f4f4f5";
          const file = e.dataTransfer.files?.[0];
          if (file) startTransition(() => onUpload(file));
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: files.length > 0 ? 24 : 0 }}>
        <div>
          <h3 style={{ margin: "0 0 8px 0", color: "#000000", fontSize: 20, fontWeight: 800 }}>Asset Dropzone</h3>
          <p className="sub" style={{ margin: 0, fontSize: 14 }}>
            Images, PDFs, docs. Drag & drop to securely transfer.
          </p>
        </div>
        <label className="pill-btn" style={{ cursor: pending ? "wait" : "pointer", background: "#000000", color: "#000", fontWeight: 800 }}>
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
      {error ? <p className="error" style={{ marginBottom: 16 }}>{error}</p> : null}
      {files.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center", color: "var(--dim)" }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>📁</div>
          <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 14 }}>Drop secure assets here to mount to workspace.</p>
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
          {files.map((f) => (
            <li
              key={f.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "center",
                padding: "16px 20px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid #000000",
                borderRadius: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: "1px solid #000000" }}>
                  📄
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#000000", fontSize: 15, marginBottom: 4 }}>{f.file_name}</div>
                  <div className="sub" style={{ fontSize: 12, margin: 0, fontFamily: "var(--font-mono)" }}>
                    {(f.size_bytes / 1024).toFixed(0)} KB • {new Date(f.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <button type="button" className="pill-btn skip" onClick={() => openFile(f.path)} style={{ background: "rgba(255,255,255,0.05)" }}>
                View ↗
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
    </div>
  );
}
