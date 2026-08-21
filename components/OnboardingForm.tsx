"use client";

import { useActionState, useState } from "react";
import { saveOnboarding } from "@/lib/actions";
import { INDUSTRY_CATEGORIES, type IndustryCategory } from "@/lib/types";

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

export function OnboardingForm({ profile }: { profile?: any }) {
  const [category, setCategory] = useState<IndustryCategory | "">(profile?.industry_category ?? "");
  const [lookingCategory, setLookingCategory] = useState<IndustryCategory | "">(profile?.looking_for_category ?? "");
  
  const [state, action, pending] = useActionState(
    async (_prev: { error: string } | void, formData: FormData) => {
      return saveOnboarding(formData);
    },
    undefined
  );

  return (
    <form action={action} className="onboard-form" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      
      {/* 1. Identity */}
      <section>
        <h3 style={{ borderBottom: "1px solid var(--stroke)", paddingBottom: 8, marginBottom: 16 }}>1. Identity</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label>
            <span className="label">Codename (Public)</span>
            <input name="codename" className="input" defaultValue={profile?.codename ?? ""} required pattern="[A-Za-z0-9_ ]{2,32}" />
          </label>
          <label>
            <span className="label">Full Name (Optional, for Contracts)</span>
            <input name="full_name" className="input" defaultValue={profile?.full_name ?? ""} />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>
              <span className="label">Location</span>
              <input name="location" className="input" defaultValue={profile?.location ?? ""} placeholder="City, Country" />
            </label>
            <label>
              <span className="label">Spoken Languages</span>
              <input name="spoken_languages" className="input" defaultValue={profile?.spoken_languages?.join(", ") ?? ""} placeholder="English, Hindi..." />
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>
              <span className="label">LinkedIn URL</span>
              <input name="linkedin_url" className="input" defaultValue={profile?.linkedin_url ?? ""} />
            </label>
            <label>
              <span className="label">Phone Number</span>
              <input name="phone_number" className="input" defaultValue={profile?.phone_number ?? ""} />
            </label>
          </div>
        </div>
      </section>

      {/* 2. Profession */}
      <section>
        <h3 style={{ borderBottom: "1px solid var(--stroke)", paddingBottom: 8, marginBottom: 16 }}>2. Profession</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <p className="label plain">Industry Category</p>
            <input type="hidden" name="industry_category" value={category} />
            <div className="chip-row">
              {INDUSTRY_CATEGORIES.map((c) => (
                <button key={c} type="button" className={category === c ? "chip selected" : "chip"} onClick={() => setCategory(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <label>
            <span className="label">Professional Title (e.g., Mechanical Engineer, 3D Animator)</span>
            <input name="professional_title" className="input" defaultValue={profile?.professional_title ?? ""} required />
          </label>
          
          <div style={{ marginTop: 16 }}>
            <p className="label plain">I need a...</p>
            <input type="hidden" name="looking_for_category" value={lookingCategory} />
            <div className="chip-row">
              {INDUSTRY_CATEGORIES.map((c) => (
                <button key={c} type="button" className={lookingCategory === c ? "chip selected" : "chip"} onClick={() => setLookingCategory(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <label>
            <span className="label">Partner Title (e.g., AI Dev, Patent Lawyer)</span>
            <input name="looking_for_title" className="input" defaultValue={profile?.looking_for_title ?? ""} required />
          </label>
        </div>
      </section>

      {/* 3. Vibe */}
      <section>
        <h3 style={{ borderBottom: "1px solid var(--stroke)", paddingBottom: 8, marginBottom: 16 }}>3. The Vibe</h3>
        {SLIDERS.map((s) => (
          <label key={s.name} className="slider-block" style={{ marginBottom: 12 }}>
            <span className="slider-meta">
              <span>{s.label}: {s.left}</span>
              <span>{s.right}</span>
            </span>
            <input type="range" name={s.name} min={1} max={5} defaultValue={3} />
          </label>
        ))}
      </section>

      {state?.error ? <p className="error">{state.error}</p> : null}
      <button className="primary-btn" type="submit" disabled={pending} style={{ alignSelf: "flex-start", padding: "12px 32px" }}>
        {pending ? "Saving…" : "Complete Profile"}
      </button>
    </form>
  );
}
