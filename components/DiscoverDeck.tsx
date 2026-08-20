"use client";

import { useState, useTransition } from "react";
import { sendConnect } from "@/lib/actions";
import { formatRole, type Profile, type VibeAnswers } from "@/lib/types";

export type DiscoverCard = {
  profile: Profile;
  vibe: VibeAnswers;
  score: number;
  connectStatus: "none" | "pending" | "accepted" | "declined";
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
      const status = (result.status as DiscoverCard["connectStatus"]) ?? "pending";
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
          const waiting = card.connectStatus === "pending";
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
                <p className="status-line left">Partnership active</p>
              ) : waiting ? (
                <p className="status-line left">Request sent</p>
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
