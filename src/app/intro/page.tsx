"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import PageWrapper from "@/components/PageWrapper";
import EnterCodeModal from "@/components/EnterCodeModal";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";

const L_BRACKET = "https://skinstric-wandag.vercel.app/_next/static/media/Rectangle%202710.61a74ed4.png";
const R_BRACKET = "https://skinstric-wandag.vercel.app/_next/static/media/Rectangle%202711.b2b3b291.png";

const DIAMOND_LARGE  = "https://skinstric-wandag.vercel.app/_next/static/media/Diamond-light-large.27413569.png";
const DIAMOND_MEDIUM = "https://skinstric-wandag.vercel.app/_next/static/media/Diamond-medium-medium.7599ea96.png";
const DIAMOND_SMALL  = "https://skinstric-wandag.vercel.app/_next/static/media/Diamond-dark-small.c887a101.png";

type Step = "name" | "location";
const PLACEHOLDERS: Record<Step, string> = {
  name:     "Introduce Yourself",
  location: "Where are you from?",
};
function isValid(v: string) { return v.trim().length >= 2 && !/\d/.test(v); }

export default function IntroPage() {
  const { push } = useTransitionRouter();
  const [step, setStep]         = useState<Step>("name");
  const [values, setValues]     = useState({ name: "", location: "" });
  const [inputVal, setInputVal] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputVal(values[step] || "");
    setError("");
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleProceed = useCallback(async () => {
    if (!isValid(inputVal)) { setError("Letters only, at least 2 characters."); return; }
    const updated = { ...values, [step]: inputVal.trim() };
    setValues(updated);
    if (step === "name") { setStep("location"); return; }
    setLoading(true);
    try {
      const res = await fetch(
        "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: updated.name, location: updated.location }) }
      );
      if (!res.ok) throw new Error();
      localStorage.setItem("skinstric_user", JSON.stringify(updated));
      push("/ai-analysis");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }, [inputVal, step, values, push]);

  const handleBack = () => {
    if (step === "location") { setStep("name"); return; }
    push("/");
  };

  const showProceed = inputVal.trim().length >= 2;

  return (
    <PageWrapper>
      {/* NAV */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", height: 64, zIndex: 1000 }}>
        <div style={{ display: "flex", alignItems: "center", transform: "scale(0.75)", transformOrigin: "left center", paddingLeft: 16 }}>
          <a href="/" style={{ fontWeight: 600, fontSize: 14, letterSpacing: "0.05em", color: "#1A1B1C", textDecoration: "none", padding: "8px 16px" }}>SKINSTRIC</a>
          <img src={L_BRACKET} alt="[" width={5} height={19} style={{ width: 4, height: 17 }} />
          <span style={{ color: "rgba(26,27,28,0.51)", fontWeight: 600, fontSize: 14, margin: "0 6px" }}>INTRO</span>
          <img src={R_BRACKET} alt="]" width={5} height={19} style={{ width: 4, height: 17 }} />
        </div>
        <button
          onClick={() => setShowCodeModal(true)}
          style={{ fontWeight: 600, fontSize: 10, letterSpacing: "0.1em", color: "#FCFCFC", background: "#1A1B1C", border: "none", cursor: "pointer", padding: "8px 16px", transform: "scale(0.8)", transformOrigin: "right center", marginRight: 16, fontFamily: "inherit" }}
        >ENTER CODE</button>
      </div>

      {/* TO START ANALYSIS */}
      <div style={{ position: "absolute", top: 68, left: 36, zIndex: 10 }}>
        <p style={{ fontWeight: 600, fontSize: 12, color: "#1A1B1C", textTransform: "uppercase" }}>TO START ANALYSIS</p>
      </div>

      {/* CENTER AREA — diamonds + input, ref: flex col items-center justify-center mb-40 */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 5 }}>

        {/* CLICK TO TYPE */}
        <p style={{ fontSize: 14, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4, zIndex: 20, position: "relative" }}>
          CLICK TO TYPE
        </p>

        {/* Input — ref: w-[372px] sm:w-[432px], mb-40 pushes content up */}
        <div style={{ position: "relative", zIndex: 20, marginBottom: 160 }}>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            placeholder={PLACEHOLDERS[step]}
            onChange={e => { setError(""); setInputVal(e.target.value); }}
            onKeyDown={e => { if (e.key === "Enter") handleProceed(); }}
            autoComplete="off"
            spellCheck={false}
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              fontWeight: 400,
              textAlign: "center",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid #1A1B1C",
              outline: "none",
              width: "clamp(372px, 60vw, 432px)",
              letterSpacing: "-0.07em",
              lineHeight: "64px",
              color: "#1A1B1C",
              fontFamily: "Inter, var(--font-dm-sans), system-ui, sans-serif",
              paddingTop: 4,
              appearance: "none",
            }}
          />
          {error && (
            <p style={{ fontSize: 11, color: "#c0392b", textAlign: "center", marginTop: 6, position: "absolute", width: "100%" }}>{error}</p>
          )}
        </div>

        {/* Diamonds — ref sizes: 480→762, 400→682, 320→602 (via CSS class breakpoints) */}
        <div className="intro-diamond-lg" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }}>
          <img src={DIAMOND_LARGE} alt="" className="animate-spin-slow" style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
        <div className="intro-diamond-md" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }}>
          <img src={DIAMOND_MEDIUM} alt="" className="animate-spin-slower" style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
        <div className="intro-diamond-sm" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }}>
          <img src={DIAMOND_SMALL} alt="" className="animate-spin-slowest" style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: "absolute", bottom: 32, left: 24, right: 24, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
        <button onClick={handleBack} style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
          <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0, border: "1px solid #1A1B1C", transform: "rotate(45deg) scale(0.85)" }} />
            <span style={{ position: "absolute", left: 14, bottom: 12, transform: "rotate(180deg) scale(0.9)", fontSize: 12, lineHeight: 1 }}>&#9654;</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, marginLeft: 16, color: "#1A1B1C" }}>BACK</span>
        </button>

        {showProceed && (
          <button
            onClick={handleProceed}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", padding: 0, opacity: loading ? 0.5 : 1 }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, marginRight: 16, color: "#1A1B1C" }}>{loading ? "..." : "PROCEED"}</span>
            <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
              <div style={{ position: "absolute", inset: 0, border: "1px solid #1A1B1C", transform: "rotate(45deg) scale(0.85)" }} />
              <span style={{ position: "absolute", right: 14, bottom: 12, fontSize: 12, lineHeight: 1 }}>&#9654;</span>
            </div>
          </button>
        )}
      </div>

      {showCodeModal && <EnterCodeModal onClose={() => setShowCodeModal(false)} />}
    </PageWrapper>
  );
}
