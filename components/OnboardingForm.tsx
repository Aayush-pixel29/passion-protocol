"use client";

import { useActionState, useState } from "react";
import { saveOnboarding } from "@/lib/actions";
import { formatRole, ROLES, type OperatorRole } from "@/lib/types";

const SLIDERS: Array<{
  name: "pace" | "comms" | "risk" | "energy";
  label: string;
  left: string;
  right: string;
}> = [
  { name: "pace", label: "Pace", left: "Slow craft", right: "Ship fast" },
  { name: "comms", label: "Comms", left: "Async quiet", right: "High-bandwidth" },
  { name: "risk", label: "Risk", left: "Safe bets", right: "Experimental" },
  { name: "energy", label: "Energy", left: "Deep solo", right: "Social collab" },
];

type Props = {
  defaultCodename?: string;
  defaultRole?: OperatorRole | null;
  defaultLookingFor?: OperatorRole | null;
  defaultBio?: string | null;
};

export function OnboardingForm({
  defaultCodename = "",
  defaultRole = null,
  defaultLookingFor = null,
  defaultBio = "",
}: Props) {
  const [role, setRole] = useState<OperatorRole | "">(defaultRole ?? "");
  const [lookingFor, setLookingFor] = useState<OperatorRole | "">(defaultLookingFor ?? "");
  const [state, action, pending] = useActionState(
    async (_prev: { error: string } | void, formData: FormData) => {
      return saveOnboarding(formData);
    },
    undefined
  );

  return (
    <form action={action} className="onboard-form">
      <div>
        <label className="label" htmlFor="codename">
          Codename
        </label>
        <input
          id="codename"
          name="codename"
          className="input"
          defaultValue={defaultCodename}
          placeholder="e.g. NEO_BUILDER"
          minLength={2}
          required
        />

        <div className="section">
          <p className="label plain">I am a…</p>
          <input type="hidden" name="role" value={role} />
          <div className="chip-row">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                className={role === r ? "chip selected" : "chip"}
                onClick={() => setRole(r)}
              >
                {formatRole(r)}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <p className="label plain">I need a…</p>
          <input type="hidden" name="lookingFor" value={lookingFor} />
          <div className="chip-row">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                className={lookingFor === r ? "chip selected" : "chip"}
                onClick={() => setLookingFor(r)}
              >
                {formatRole(r)}
              </button>
            ))}
          </div>
        </div>

        <label className="label" htmlFor="bio">
          Optional note
        </label>
        <input
          id="bio"
          name="bio"
          className="input"
          defaultValue={defaultBio ?? ""}
          placeholder="What you want to build together"
        />
      </div>

      <div>
        <p className="label plain">Vibe (not a resume)</p>
        {SLIDERS.map((s) => (
          <label key={s.name} className="slider-block">
            <span className="slider-meta">
              <span>
                {s.label}: {s.left}
              </span>
              <span>{s.right}</span>
            </span>
            <input type="range" name={s.name} min={1} max={5} defaultValue={3} />
          </label>
        ))}
        {state?.error ? <p className="error">{state.error}</p> : null}
        <button className="outline-btn" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Start matching"}
        </button>
      </div>
    </form>
  );
}
