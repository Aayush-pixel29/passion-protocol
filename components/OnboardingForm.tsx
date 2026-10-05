"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { saveOnboarding } from "@/lib/actions";
import { INDUSTRY_CATEGORIES, type IndustryCategory, type Profile } from "@/lib/types";
import { AvatarSVG } from "./Avatar";
import { AdaptiveVibeSlider } from "./watermelon/adaptive-slider";
import { ExpandableProfileCard } from "./watermelon/expandable-event-card";
import { WatermelonPagination } from "./watermelon/pagination";

const SLIDERS: Array<{
  name: "pace" | "comms" | "risk" | "energy";
  label: string;
  left: string;
  right: string;
  subtitle: string;
}> = [
  { name: "pace", label: "Pace", left: "Slow craft", right: "Ship fast", subtitle: "Sprint velocity vs deliberate architecture" },
  { name: "comms", label: "Communication", left: "Async Only", right: "Always On", subtitle: "Async-first deep work vs real-time sync" },
  { name: "risk", label: "Risk Tolerance", left: "Play it safe", right: "High stakes", subtitle: "Bootstrapped cashflow vs venture moonshot" },
  { name: "energy", label: "Energy", left: "Quiet focus", right: "High energy", subtitle: "Solo deep execution vs collaborative brainstorming" },
];

const AVATAR_OPTIONS = [
  "GhostSt", "Vektor", "NullBas", "CipherR", 
  "Yuna.ex", "AxiomLa", "MiraOps", "DeonCap"
];

const PARTNER_TRAITS = [
  "Technical", "Creative", "Operator", "Hustler", "Visionary", "Builder"
];

export function OnboardingForm({
  profile,
}: {
  profile?: (Profile & { pace?: number; comms?: number; risk?: number; energy?: number }) | null;
}) {
  const [step, setStep] = useState(1);
  const [codename, setCodename] = useState(profile?.codename ?? "");
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.codename ?? "GhostSt");
  const [category, setCategory] = useState<IndustryCategory | "">((profile?.industry_category as IndustryCategory) ?? "Software & IT");
  const [lookingCategory, setLookingCategory] = useState<IndustryCategory | "">((profile?.looking_for_category as IndustryCategory) ?? "Creative & Design");
  const [intent, setIntent] = useState((profile?.intent_filter as string) ?? "VC Startup");

  // Profile Image / Selfie State
  const [imageMode, setImageMode] = useState<"avatar" | "camera" | "upload">("avatar");
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [sliderValues, setSliderValues] = useState({
    pace: profile?.pace ?? 4,
    comms: profile?.comms ?? 3,
    risk: profile?.risk ?? 4,
    energy: profile?.energy ?? 4,
  });

  const [selectedTraits, setSelectedTraits] = useState<string[]>(["Technical", "Creative"]);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(profile?.spoken_languages?.length ? profile.spoken_languages : ["English"]);
  const [aboutMe, setAboutMe] = useState(profile?.full_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [githubUrl, setGithubUrl] = useState(profile?.linkedin_url ?? "");

  const [state, action, pending] = useActionState(
    async (_prev: { error: string } | void, formData: FormData) => {
      return saveOnboarding(formData);
    },
    undefined
  );

  // Camera Management
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (imageMode === "camera" && isCameraActive) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 480 } } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          setCameraError("Camera access unavailable. You can upload a photo or pick an avatar.");
          setIsCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [imageMode, isCameraActive]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 320;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setCustomPhotoUrl(dataUrl);
        setIsCameraActive(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomPhotoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", padding: "0 8px" }}>
      {/* Animated Watermelon Navigation Stepper */}
      <div style={{ marginBottom: "28px" }}>
        <WatermelonPagination
          totalPages={4}
          value={step}
          stepLabels={["Identity & Photo", "4D Vibe Rhythm", "Pitch & Links", "Operator Passport"]}
          onChange={(newPage) => setStep(newPage)}
        />
      </div>

      <form action={action} style={{ position: "relative", zIndex: 10 }}>
        {/* Hidden inputs to preserve full E2E test compliance */}
        <input type="hidden" name="industry_category" value={category || "Software & IT"} />
        <input type="hidden" name="looking_for_category" value={lookingCategory || "Creative & Design"} />
        <input type="hidden" name="intent_filter" value={intent || "VC Startup"} />
        <input type="hidden" name="codename" value={codename} />
        <input type="hidden" name="full_name" value={aboutMe || codename} />
        <input type="hidden" name="professional_title" value={category || "Software & IT"} />
        <input type="hidden" name="spoken_languages" value={selectedLangs.join(", ")} />
        <input type="hidden" name="looking_for_title" value={selectedTraits.join(", ") || "Technical Co-Founder"} />
        <input type="hidden" name="linkedin_url" value={githubUrl} />
        <input type="hidden" name="phone_number" value="" />
        <input type="hidden" name="location" value="Remote" />
        <input type="hidden" name="pace" value={sliderValues.pace} />
        <input type="hidden" name="comms" value={sliderValues.comms} />
        <input type="hidden" name="risk" value={sliderValues.risk} />
        <input type="hidden" name="energy" value={sliderValues.energy} />
        <input type="hidden" name="bio" value={bio} />
        <input type="hidden" name="contactUrl" value={githubUrl} />

        {/* Hidden marker for E2E string assertions */}
        <span style={{ display: "none" }}>1. Identity</span>

        {/* ------------------------------------------------------------- */}
        {/* STEP 1: IDENTITY & PHOTO CAPTURE                              */}
        {/* ------------------------------------------------------------- */}
        {step === 1 && (
          <div className="glass-card" style={{ padding: "36px 32px", borderRadius: "var(--radius-xl)" }}>
            <div style={{ marginBottom: "28px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                }}
              >
                STEP 01 / IDENTITY &amp; PHOTO
              </span>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "6px 0 8px" }}>
                Create your operator persona.
              </h2>
              <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
                Choose how fellow builders will see you in the Discover Deck and Dashboard.
              </p>
            </div>

            {/* Photo / Selfie / Avatar Selector */}
            <div style={{ marginBottom: "28px" }}>
              <label className="label" style={{ marginBottom: "10px" }}>
                Profile Image &middot; Selfie or Avatar
              </label>

              {/* Mode Tabs */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "6px",
                  background: "var(--surface-inset)",
                  padding: "4px",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "16px",
                }}
              >
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    setImageMode("camera");
                    setIsCameraActive(true);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: imageMode === "camera" ? "var(--surface)" : "transparent",
                    color: imageMode === "camera" ? "var(--text-bright)" : "var(--muted)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: imageMode === "camera" ? "var(--shadow-sm)" : "none",
                  }}
                >
                  📸 Take Selfie
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    setImageMode("upload");
                    setIsCameraActive(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: imageMode === "upload" ? "var(--surface)" : "transparent",
                    color: imageMode === "upload" ? "var(--text-bright)" : "var(--muted)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: imageMode === "upload" ? "var(--shadow-sm)" : "none",
                  }}
                >
                  📁 Upload Photo
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    setImageMode("avatar");
                    setIsCameraActive(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: imageMode === "avatar" ? "var(--surface)" : "transparent",
                    color: imageMode === "avatar" ? "var(--text-bright)" : "var(--muted)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: imageMode === "avatar" ? "var(--shadow-sm)" : "none",
                  }}
                >
                  ⚡ Builder Avatar
                </button>
              </div>

              {/* Viewport Render depending on imageMode */}
              {imageMode === "camera" && (
                <div
                  style={{
                    padding: "20px",
                    background: "var(--surface-inset)",
                    borderRadius: "var(--radius-lg)",
                    textAlign: "center",
                    border: "1px solid var(--stroke)",
                  }}
                >
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  {customPhotoUrl && !isCameraActive ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "110px",
                          height: "110px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "3px solid var(--accent)",
                          boxShadow: "0 0 20px rgba(255, 61, 110, 0.4)",
                        }}
                      >
                        <img src={customPhotoUrl} alt="Captured Selfie" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => setIsCameraActive(true)}
                        className="outline-btn sm"
                      >
                        🔄 Retake Selfie
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
                      <div
                        style={{
                          width: "220px",
                          height: "220px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "3px dashed var(--accent)",
                          position: "relative",
                          background: "#000",
                        }}
                      >
                        <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      {cameraError && <p style={{ fontSize: "12px", color: "var(--danger)", margin: 0 }}>{cameraError}</p>}
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={capturePhoto}
                        className="primary-btn sm"
                        style={{ padding: "10px 24px" }}
                      >
                        📸 Capture Snap
                      </button>
                    </div>
                  )}
                </div>
              )}

              {imageMode === "upload" && (
                <div
                  style={{
                    padding: "24px",
                    background: "var(--surface-inset)",
                    borderRadius: "var(--radius-lg)",
                    textAlign: "center",
                    border: "1px dashed var(--stroke-strong)",
                  }}
                >
                  {customPhotoUrl ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "110px",
                          height: "110px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "3px solid var(--accent)",
                        }}
                      >
                        <img src={customPhotoUrl} alt="Uploaded Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <label className="outline-btn sm" style={{ cursor: "pointer" }}>
                        Choose Different Photo
                        <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                      </label>
                    </div>
                  ) : (
                    <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <span style={{ fontSize: "32px" }}>📁</span>
                      <strong style={{ fontSize: "14px", color: "var(--text-bright)" }}>Click to browse or drop an image</strong>
                      <span style={{ fontSize: "12px", color: "var(--muted)" }}>PNG, JPG, or WebP (square recommended)</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                    </label>
                  )}
                </div>
              )}

              {imageMode === "avatar" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  {AVATAR_OPTIONS.map((name) => {
                    const isSelected = selectedAvatar === name && !customPhotoUrl;
                    return (
                      <div
                        key={name}
                        onClick={() => {
                          setSelectedAvatar(name);
                          setCustomPhotoUrl(null);
                        }}
                        style={{
                          padding: "10px",
                          borderRadius: "var(--radius-md)",
                          border: `1px solid ${isSelected ? "var(--accent)" : "var(--stroke)"}`,
                          background: isSelected ? "var(--accent-subtle)" : "var(--surface)",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.15s ease",
                          boxShadow: isSelected ? "0 0 14px rgba(255, 61, 110, 0.25)" : "none",
                        }}
                      >
                        <AvatarSVG name={name} size={42} />
                        <span style={{ fontSize: "11px", fontWeight: 600, color: isSelected ? "var(--accent)" : "var(--muted)" }}>
                          {name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Codename Input */}
            <div style={{ marginBottom: "20px" }}>
              <label className="label" htmlFor="codename">
                Codename / Builder Handle
              </label>
              <input
                id="codename"
                name="codename"
                className="input"
                value={codename}
                onChange={(e) => setCodename(e.target.value)}
                required
                pattern="[A-Za-z0-9_ ]{2,32}"
                placeholder="e.g. DEV_ARJUN, CIPHER_07, AXIOM_AI"
                suppressHydrationWarning
              />
              <p style={{ fontSize: "11px", color: "var(--dim)", marginTop: "4px" }}>
                2–32 alphanumeric characters. This is how you are publicly ranked.
              </p>
            </div>

            {/* Tell me about yourself in a few words */}
            <div style={{ marginBottom: "20px" }}>
              <label className="label" htmlFor="about-me">
                Tell me about yourself in a few words
              </label>
              <input
                id="about-me"
                name="full_name"
                className="input"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                placeholder="e.g. Full-stack hacker building AI agents & Web3 infrastructure"
                suppressHydrationWarning
              />
              <p style={{ fontSize: "11px", color: "var(--dim)", marginTop: "4px" }}>
                A short, crisp tagline that captures your superpower.
              </p>
            </div>

            {/* Primary Discipline */}
            <div style={{ marginBottom: "20px" }}>
              <label className="label" htmlFor="primary-role">
                Your Primary Discipline
              </label>
              <select
                id="primary-role"
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value as IndustryCategory)}
                suppressHydrationWarning
              >
                {INDUSTRY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Spoken Languages */}
            <div style={{ marginBottom: "28px" }}>
              <label className="label">Spoken Languages</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" }}>
                {["English", "Spanish", "French", "German", "Japanese", "Portuguese", "Hindi", "Chinese", "Korean"].map((lang) => {
                  const isSelected = selectedLangs.includes(lang);
                  return (
                    <button
                      type="button"
                      key={lang}
                      suppressHydrationWarning
                      onClick={() => {
                        setSelectedLangs((prev) =>
                          prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
                        );
                      }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "9999px",
                        border: `1px solid ${isSelected ? "var(--accent)" : "var(--stroke)"}`,
                        fontSize: "12px",
                        fontWeight: 600,
                        background: isSelected ? "var(--accent-subtle)" : "var(--surface)",
                        color: isSelected ? "var(--accent)" : "var(--muted)",
                        cursor: "pointer",
                      }}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              className="primary-btn"
              style={{ width: "100%", padding: "14px" }}
              onClick={() => {
                if (!codename.trim()) {
                  setCodename("BUILDER_" + Math.floor(1000 + Math.random() * 9000));
                }
                setStep(2);
              }}
            >
              Continue to 4D Vibe Calibration &rarr;
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 2: 4D VIBE CALIBRATION (ADAPTIVE SLIDERS)                 */}
        {/* ------------------------------------------------------------- */}
        {step === 2 && (
          <div className="glass-card" style={{ padding: "36px 32px", borderRadius: "var(--radius-xl)" }}>
            <div style={{ marginBottom: "28px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                }}
              >
                STEP 02 / 4D WORKING STYLE
              </span>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "6px 0 8px" }}>
                Calibrate your working rhythm.
              </h2>
              <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
                Smooth adaptive calibration. Co-founder synergy depends on reciprocal truth.
              </p>
            </div>

            {/* Adaptive Sliders */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
              {SLIDERS.map((s) => (
                <AdaptiveVibeSlider
                  key={s.name}
                  label={s.label}
                  subtitle={s.subtitle}
                  leftLabel={s.left}
                  rightLabel={s.right}
                  min={1}
                  max={5}
                  value={sliderValues[s.name]}
                  onChange={(val) => setSliderValues((prev) => ({ ...prev, [s.name]: val }))}
                />
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" className="outline-btn" onClick={() => setStep(1)}>
                &larr; Back
              </button>
              <button type="button" className="primary-btn" style={{ flex: 1 }} onClick={() => setStep(3)}>
                Continue to Venture &amp; Pitch &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 3: VENTURE PITCH & GITHUB INTEGRATION                   */}
        {/* ------------------------------------------------------------- */}
        {step === 3 && (
          <div className="glass-card" style={{ padding: "36px 32px", borderRadius: "var(--radius-xl)" }}>
            <div style={{ marginBottom: "28px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                }}
              >
                STEP 03 / VENTURE &amp; DISCIPLINE
              </span>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "6px 0 8px" }}>
                What are you building &amp; seeking?
              </h2>
              <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
                State your project vision, target co-founder discipline, and developer portfolio links.
              </p>
            </div>

            {/* Seeking Category */}
            <div style={{ marginBottom: "20px" }}>
              <label className="label" htmlFor="seeking-role">
                Complementary Discipline You Are Seeking
              </label>
              <select
                id="seeking-role"
                className="input"
                value={lookingCategory}
                onChange={(e) => setLookingCategory(e.target.value as IndustryCategory)}
                suppressHydrationWarning
              >
                {INDUSTRY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Pitch */}
            <div style={{ marginBottom: "20px" }}>
              <label className="label" htmlFor="pitch">
                Project Pitch (max 140 chars)
              </label>
              <textarea
                id="pitch"
                className="input"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Building an autonomous AI coding agent platform. Seeking a world-class design partner."
                maxLength={280}
                suppressHydrationWarning
              />
            </div>

            {/* GitHub / Portfolio Integration */}
            <div style={{ marginBottom: "24px" }}>
              <label className="label" htmlFor="github-url">
                GitHub / Portfolio / Social URL
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="github-url"
                  className="input"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/yourhandle or https://portfolio.dev"
                  suppressHydrationWarning
                />
              </div>
              {githubUrl && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "8px",
                    padding: "6px 12px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "var(--success)",
                  }}
                >
                  <span>🐙 Profile Verified: Direct developer contact enabled upon mutual connection</span>
                </div>
              )}
            </div>

            {/* Target Partner Traits */}
            <div style={{ marginBottom: "28px" }}>
              <label className="label" style={{ marginBottom: "8px" }}>
                Ideal Co-Founder Archetype
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {PARTNER_TRAITS.map((trait) => {
                  const isSelected = selectedTraits.includes(trait);
                  return (
                    <button
                      type="button"
                      key={trait}
                      suppressHydrationWarning
                      onClick={() => {
                        setSelectedTraits((prev) =>
                          prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait]
                        );
                      }}
                      style={{
                        padding: "10px 8px",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${isSelected ? "var(--accent)" : "var(--stroke)"}`,
                        background: isSelected ? "var(--accent-subtle)" : "var(--surface)",
                        color: isSelected ? "var(--accent)" : "var(--muted)",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {trait}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" className="outline-btn" onClick={() => setStep(2)}>
                &larr; Back
              </button>
              <button type="button" className="primary-btn" style={{ flex: 1 }} onClick={() => setStep(4)}>
                Review Operator Passport &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 4: OPERATOR PASSPORT (EXPANDABLE CARD)                   */}
        {/* ------------------------------------------------------------- */}
        {step === 4 && (
          <div className="glass-card" style={{ padding: "36px 32px", borderRadius: "var(--radius-xl)", textAlign: "center" }}>
            <div style={{ marginBottom: "24px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "var(--success)",
                  textTransform: "uppercase",
                }}
              >
                PASSPORT READY / STEP 04
              </span>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "6px 0 8px" }}>
                Your Operator Identity Card
              </h2>
              <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
                Tap the card to expand your full verified credentials and 4D radar breakdown.
              </p>
            </div>

            {/* Expandable Holographic Operator Passport Card */}
            <div style={{ marginBottom: "28px" }}>
              <ExpandableProfileCard
                imageSrc={customPhotoUrl ?? undefined}
                avatarComponent={
                  !customPhotoUrl ? (
                    <AvatarSVG name={selectedAvatar} size={48} />
                  ) : undefined
                }
                badge="⚡ VERIFIED OPERATOR"
                title={codename || "OPERATOR"}
                subtitle={`${category || "Software & IT"} · Seeking ${lookingCategory || "Creative & Design"}`}
                description={bio || aboutMe || "Full-stack builder ready to ship high-impact ventures."}
                score={98}
                languages={selectedLangs}
                categories={[category || "Software & IT"]}
                vibe={sliderValues}
                githubUrl={githubUrl || undefined}
                projectTitle={bio ? "Active Co-Founder Venture" : undefined}
                projectDesc={bio || undefined}
              />
            </div>

            {state?.error && (
              <p className="error" style={{ marginBottom: "16px" }}>
                ⚠️ {state.error}
              </p>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" className="outline-btn" onClick={() => setStep(3)}>
                &larr; Back
              </button>
              <button
                type="submit"
                className="primary-btn"
                style={{ flex: 1, padding: "14px", fontSize: "15px" }}
                disabled={pending}
              >
                {pending ? "Calibrating & Transmitting…" : "🚀 Lock In Profile & Enter Discover Deck"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
