"use client";

import { useActionState, useState } from "react";
import { saveOnboarding } from "@/lib/actions";
import { INDUSTRY_CATEGORIES, INTENT_FILTERS, INTENT_ICONS, type IndustryCategory, type IntentFilter, type Profile } from "@/lib/types";
import { AvatarSVG } from "./Avatar";

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

export function OnboardingForm({ profile }: { profile?: Profile | null }) {
  const [step, setStep] = useState(1);
  const [codename, setCodename] = useState(profile?.codename ?? "");
  const [category, setCategory] = useState<IndustryCategory | "">((profile?.industry_category as IndustryCategory) ?? "");
  const [lookingCategory, setLookingCategory] = useState<IndustryCategory | "">((profile?.looking_for_category as IndustryCategory) ?? "");
  const [intent, setIntent] = useState<IntentFilter | "">((profile?.intent_filter as IntentFilter) ?? "");
  
  const [state, action, pending] = useActionState(
    async (_prev: { error: string } | void, formData: FormData) => {
      return saveOnboarding(formData);
    },
    undefined
  );

  return (
    <div className="glass" style={{ padding: 40, borderRadius: 24, maxWidth: 640, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <div className="mesh-bg" style={{ position: "absolute", inset: 0, opacity: 0.2, pointerEvents: "none" }} />
      
      {/* Animated Step Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 40, position: "relative", zIndex: 10 }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ 
            width: s === step ? 24 : 8, 
            height: 8, 
            borderRadius: 4, 
            background: s === step ? "var(--accent-emerald)" : "var(--stroke-strong)",
            transition: "all 0.3s ease",
            boxShadow: s === step ? "var(--glow-emerald)" : "none"
          }} />
        ))}
      </div>

      <form action={action} style={{ position: "relative", zIndex: 10 }}>
        
        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <AvatarSVG name={codename || "New User"} size={80} className="glow-emerald mx-auto mb-4" />
              <h2 style={{ margin: 0, fontSize: 24 }}>Calibrate Identity</h2>
            </div>
            
            <label>
              <span className="label">Codename (Public)</span>
              <input name="codename" className="input glass" value={codename} onChange={e => setCodename(e.target.value)} required pattern="[A-Za-z0-9_ ]{2,32}" />
            </label>
            <label>
              <span className="label">Full Name (Optional, for Contracts)</span>
              <input name="full_name" className="input glass" defaultValue={profile?.full_name ?? ""} />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label>
                <span className="label">Location</span>
                <input name="location" className="input glass" defaultValue={profile?.location ?? ""} placeholder="City, Country" />
              </label>
              <label>
                <span className="label">Spoken Languages</span>
                <input name="spoken_languages" className="input glass" defaultValue={profile?.spoken_languages?.join(", ") ?? ""} placeholder="English, Hindi..." />
              </label>
            </div>
            <button type="button" className="pill-btn accept" style={{ marginTop: 16 }} onClick={() => setStep(2)}>Next Step →</button>
          </div>
        )}

        {/* Step 2: Vibe Sliders */}
        {step === 2 && (
          <div className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <h2 style={{ margin: 0, fontSize: 24, textAlign: "center" }}>Vibe Sliders</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {SLIDERS.map((s) => (
                <div key={s.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span className="sub">{s.left}</span>
                    <span style={{ fontWeight: 600, color: "var(--accent-emerald)" }}>{s.label}</span>
                    <span className="sub">{s.right}</span>
                  </div>
                  <input
                    name={s.name}
                    type="range"
                    min={1}
                    max={5}
                    defaultValue={(profile as any)?.[s.name] ?? 3}
                    className="slider"
                    style={{ width: "100%" }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <button type="button" className="pill-btn skip" onClick={() => setStep(1)}>← Back</button>
              <button type="button" className="pill-btn accept" style={{ flex: 1 }} onClick={() => setStep(3)}>Next Step →</button>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <h2 style={{ margin: 0, fontSize: 24, textAlign: "center" }}>Professional Stack</h2>
            
            <div>
              <p className="label plain">Industry Category</p>
              <input type="hidden" name="industry_category" value={category} />
              <div className="chip-row">
                {INDUSTRY_CATEGORIES.map((c) => (
                  <button key={c} type="button" className={`chip ${category === c ? "selected glass-emerald" : ""}`} onClick={() => setCategory(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            
            <label>
              <span className="label">Professional Title (e.g., UI Engineer)</span>
              <input name="professional_title" className="input glass" defaultValue={profile?.professional_title ?? ""} required />
            </label>

            <div style={{ marginTop: 16 }}>
              <p className="label plain">I need a...</p>
              <input type="hidden" name="looking_for_category" value={lookingCategory} />
              <div className="chip-row">
                {INDUSTRY_CATEGORIES.map((c) => (
                  <button key={c} type="button" className={`chip ${lookingCategory === c ? "selected glass-emerald" : ""}`} onClick={() => setLookingCategory(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <label>
              <span className="label">Looking for Title</span>
              <input name="looking_for_title" className="input glass" defaultValue={profile?.looking_for_title ?? ""} required />
            </label>

            <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
              <button type="button" className="pill-btn skip" onClick={() => setStep(2)}>← Back</button>
              <button type="button" className="pill-btn accept" style={{ flex: 1 }} onClick={() => setStep(4)}>Next Step →</button>
            </div>
          </div>
        )}

        {/* Step 4: Ready */}
        {step === 4 && (
          <div className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <h2 style={{ margin: 0, fontSize: 24, textAlign: "center" }}>Intent & Finalize</h2>
            
            <div>
              <p className="label plain">Primary Intent</p>
              <input type="hidden" name="intent_filter" value={intent} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                {INTENT_FILTERS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    className={`chip ${intent === i ? "selected glass-emerald border-emerald-500" : ""}`}
                    onClick={() => setIntent(i)}
                    style={{ textAlign: "left", padding: "12px 16px", display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <span style={{ fontSize: 20 }}>{INTENT_ICONS[i]}</span>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <label>
              <span className="label">Project Pitch or Short Bio</span>
              <textarea name="bio" className="input glass" rows={4} defaultValue={profile?.bio ?? ""} placeholder="I'm building..." />
            </label>

            {state?.error && <p className="error">{state.error}</p>}
            
            <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
              <button type="button" className="pill-btn skip" onClick={() => setStep(3)}>← Back</button>
              <button type="submit" className="pill-btn accept" style={{ flex: 1 }} disabled={pending}>
                {pending ? "Saving..." : "Lock in Profile 🚀"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
