"use client";

import { useState, useTransition } from "react";
import { sendConnect, respondToConnect } from "@/lib/actions";
import { formatRole, type Profile, type VibeAnswers, type ConnectState } from "@/lib/types";

export type DiscoverCard = {
  profile: Profile;
  vibe: VibeAnswers;
  score: number;
  connectStatus: ConnectState;
  contactUrl?: string | null;
};

const DIMS: Array<{ key: keyof VibeAnswers; label: string }> = [
  { key: "pace", label: "Pace" },
  { key: "comms", label: "Comms" },
  { key: "risk", label: "Risk" },
  { key: "energy", label: "Energy" },
];

function getAvatarGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 45) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 75%, 65%), hsl(${hue2}, 85%, 45%))`;
}

export function DiscoverDeck({ cards }: { cards: DiscoverCard[] }) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [local, setLocal] = useState(cards);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const visible = local.filter((c) => !hidden.has(c.profile.id));

  if (visible.length === 0) {
    return (
      <div className="empty">
        <p>No operators with that role yet.</p>
        <p>You&apos;re one of the first here — invite a collaborator or check back soon!</p>
      </div>
    );
  }

  function skip(id: string) {
    setError("");
    setHidden((prev) => new Set(prev).add(id));
  }

  function connect(id: string) {
    setError("");
    setBusyId(id);
    startTransition(async () => {
      const result = await sendConnect(id);
      setBusyId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      const status = result.status ?? "outgoing_pending";
      setLocal((rows) =>
        rows.map((row) => (row.profile.id === id ? { ...row, connectStatus: status } : row))
      );
    });
  }

  function respond(id: string, decision: "accepted" | "declined") {
    setError("");
    setBusyId(id);
    startTransition(async () => {
      const result = await respondToConnect(id, decision);
      setBusyId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      const status = result.status ?? decision;
      setLocal((rows) =>
        rows.map((row) => (row.profile.id === id ? { ...row, connectStatus: status } : row))
      );
    });
  }

  return (
    <div>
      {error ? <p className="error">{error}</p> : null}
      <div className="match-grid">
        {visible.map((card) => {
          const accepted = card.connectStatus === "accepted";
          const outgoing = card.connectStatus === "outgoing_pending";
          const incoming = card.connectStatus === "incoming_pending";
          const declined = card.connectStatus === "declined";
          const pending = busyId === card.profile.id;

          const avatarBg = getAvatarGradient(card.profile.id || card.profile.codename);
          const initial = card.profile.codename ? card.profile.codename[0].toUpperCase() : "O";

          return (
            <article key={card.profile.id} className={accepted ? "match-card success" : "match-card"}>
              <div className="match-card-top">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: avatarBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      flexShrink: 0,
                    }}
                  >
                    {initial}
                  </div>
                  <div>
                    <h3>{card.profile.codename}</h3>
                    <p className="card-skill">
                      {formatRole(card.profile.role)} · needs {formatRole(card.profile.looking_for)}
                    </p>
                  </div>
                </div>
                <div className="score-badge">{card.score}%</div>
              </div>
              {card.profile.bio ? <p className="sub" style={{ marginTop: 12 }}>{card.profile.bio}</p> : null}
              <div className="dims">
                {DIMS.map((d) => (
                  <span key={d.key}>
                    {d.label} {card.vibe[d.key]}/5
                  </span>
                ))}
              </div>
              {accepted ? (
                <div className="left">
                  <p className="status-line" style={{ color: "#10b981", fontWeight: 600 }}>
                    Partnership active
                  </p>
                  {card.contactUrl ? (
                    <p className="sub" style={{ marginTop: 4 }}>
                      Contact:{" "}
                      <a
                        href={card.contactUrl.startsWith("http") ? card.contactUrl : `https://${card.contactUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#3b82f6", textDecoration: "underline" }}
                      >
                        {card.contactUrl}
                      </a>
                    </p>
                  ) : (
                    <p className="sub" style={{ marginTop: 4 }}>No contact info added yet</p>
                  )}
                </div>
              ) : outgoing ? (
                <p className="status-line left">Request sent</p>
              ) : incoming ? (
                <div className="btn-row left">
                  <button
                    className="pill-btn skip"
                    type="button"
                    onClick={() => respond(card.profile.id, "declined")}
                    disabled={pending}
                  >
                    Decline
                  </button>
                  <button
                    className="pill-btn accept"
                    type="button"
                    onClick={() => respond(card.profile.id, "accepted")}
                    disabled={pending}
                  >
                    {pending ? "Accepting…" : "Accept"}
                  </button>
                </div>
              ) : declined ? (
                <p className="status-line left sub">Request declined</p>
              ) : (
                <div className="btn-row left">
                  <button className="pill-btn skip" type="button" onClick={() => skip(card.profile.id)}>
                    Skip
                  </button>
                  <button
                    className="pill-btn accept"
                    type="button"
                    onClick={() => connect(card.profile.id)}
                    disabled={pending}
                  >
                    {pending ? "Sending…" : "Connect"}
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
