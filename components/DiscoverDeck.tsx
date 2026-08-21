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
        <p>Invite someone, or run the demo seed so Discover has a pool.</p>
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

          return (
            <article key={card.profile.id} className={accepted ? "match-card success" : "match-card"}>
              <div className="match-card-top">
                <div>
                  <h3>{card.profile.codename}</h3>
                  <p className="card-skill">
                    {formatRole(card.profile.role)} · needs {formatRole(card.profile.looking_for)}
                  </p>
                </div>
                <div className="score-badge">{card.score}%</div>
              </div>
              {card.profile.bio ? <p className="sub">{card.profile.bio}</p> : null}
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
