"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import PageWrapper from "@/components/PageWrapper";
import DiamondButton from "@/components/DiamondButton";
import EnterCodeModal from "@/components/EnterCodeModal";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

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

      {/* ROTATING DIAMONDS + INPUT */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 5 }}>

        {/* CLICK TO TYPE label */}
        <p style={{ fontSize: 14, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4, zIndex: 20, position: "relative" }}>
          CLICK TO TYPE
        </p>

        {/* Input */}
        <div style={{ position: "relative", zIndex: 20, marginBottom: 160 }}>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            placeholder={PLACEHOLDERS[step]}
            onChange={(e) => { setError(""); setInputVal(e.target.value); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleProceed(); }}
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
              width: "clamp(280px, 60vw, 432px)",
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

        {/* Spinning diamond images — behind input */}
        <img
          src={DIAMOND_LARGE}
          alt="Diamond Large"
          className="animate-spin-slow"
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(190deg)", width: "clamp(320px, 50vw, 762px)", height: "clamp(320px, 50vw, 762px)", pointerEvents: "none" }}
        />
        <img
          src={DIAMOND_MEDIUM}
          alt="Diamond Medium"
          className="animate-spin-slower"
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(185deg)", width: "clamp(260px, 42vw, 682px)", height: "clamp(260px, 42vw, 682px)", pointerEvents: "none" }}
        />
        <img
          src={DIAMOND_SMALL}
          alt="Diamond Small"
          className="animate-spin-slowest"
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "clamp(200px, 35vw, 602px)", height: "clamp(200px, 35vw, 602px)", pointerEvents: "none" }}
        />
      </div>

      {/* BACK */}
      <div style={{ position: "absolute", bottom: 32, left: 24, display: "flex", alignItems: "center", gap: 12, zIndex: 10 }}>
        <DiamondButton size={38} onClick={handleBack}><FiArrowLeft size={13} strokeWidth={1.5} /></DiamondButton>
        <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1A1B1C", fontWeight: 500 }}>BACK</span>
      </div>

      {/* PROCEED */}
      {showProceed && (
        <div style={{ position: "absolute", bottom: 32, right: 24, display: "flex", alignItems: "center", gap: 12, zIndex: 10 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1A1B1C", fontWeight: 500 }}>
            {loading ? "SENDING..." : "PROCEED"}
          </span>
          <DiamondButton size={38} onClick={handleProceed} disabled={loading}>
            <FiArrowRight size={13} strokeWidth={1.5} />
          </DiamondButton>
        </div>
      )}

      {showCodeModal && <EnterCodeModal onClose={() => setShowCodeModal(false)} />}
    </PageWrapper>
  );
}
