"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import PageWrapper from "@/components/PageWrapper";
import CornerLines from "@/components/CornerLines";
import DiamondButton from "@/components/DiamondButton";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

type Step = "name" | "location";
const STEPS: Record<Step, { prompt: string }> = {
  name:     { prompt: "Introduce Yourself" },
  location: { prompt: "Where are you from?" },
};
function isValidString(v: string) {
  return v.trim().length >= 2 && !/\d/.test(v);
}

export default function IntroPage() {
  const { push } = useTransitionRouter();
  const [step, setStep]         = useState<Step>("name");
  const [values, setValues]     = useState({ name: "", location: "" });
  const [inputVal, setInputVal] = useState("");
  const [focused, setFocused]   = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [hover, setHover]       = useState(false);

  const inputRef   = useRef<HTMLInputElement>(null);
  const outerRef   = useRef<SVGPolygonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Focus hidden input + animate polygon
  const focusDiamond = useCallback(() => { inputRef.current?.focus(); }, []);

  // Animate polygon stroke on focus/blur
  useEffect(() => {
    if (!outerRef.current) return;
    gsap.to(outerRef.current, {
      attr: { stroke: focused ? "#1a1a1a" : hover ? "#888" : "#c4c4c0" },
      duration: 0.25,
      ease: "power2.out",
    });
  }, [focused, hover]);

  // Pulse the diamond when step changes (new question appears)
  useEffect(() => {
    if (!outerRef.current) return;
    gsap.timeline()
      .fromTo(outerRef.current, { attr: { strokeWidth: 1 } }, { attr: { strokeWidth: 2.5 }, duration: 0.18, ease: "power2.out" })
      .to(outerRef.current, { attr: { strokeWidth: 1 }, duration: 0.35, ease: "power2.in" });

    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
    }

    setInputVal(values[step] || "");
    setError("");
    setTimeout(() => inputRef.current?.focus(), 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleProceed = useCallback(async () => {
    if (!isValidString(inputVal)) {
      setError("Letters only, at least 2 characters.");
      // Shake the diamond
      gsap.to(outerRef.current, {
        keyframes: [
          { attr: { "transform": "translate(-4,0)" } },
          { attr: { "transform": "translate(4,0)" } },
          { attr: { "transform": "translate(-3,0)" } },
          { attr: { "transform": "translate(3,0)" } },
          { attr: { "transform": "translate(0,0)" } },
        ],
        duration: 0.4,
        ease: "none",
      });
      return;
    }
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

  const config      = STEPS[step];
  const displayVal  = inputVal;
  const showProceed = inputVal.trim().length >= 2;

  return (
    <PageWrapper>
      <CornerLines />

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="text"
        value={inputVal}
        onChange={(e) => { setError(""); setInputVal(e.target.value); }}
        onKeyDown={(e) => { if (e.key === "Enter") handleProceed(); }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
        autoComplete="off" spellCheck={false}
      />

      {/* NAV */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", zIndex: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", color: "#1a1a1a" }}>SKINSTRIC</span>
            <span style={{ fontSize: 13, fontWeight: 300, letterSpacing: "0.1em", color: "#6b6b6b" }}>[ INTRO ]</span>
          </div>
          <span style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 500 }}>
            TO START ANALYSIS
          </span>
        </div>
        <button style={{ padding: "6px 14px", background: "#1a1a1a", color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          ENTER CODE
        </button>
      </div>

      {/* DIAMOND INPUT */}
      <div
        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, cursor: "text" }}
        onClick={focusDiamond}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ position: "relative", width: 400, height: 400 }}>
          <svg width={400} height={400} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <polygon
              ref={outerRef}
              points="200,2 398,200 200,398 2,200"
              fill="transparent"
              stroke="#c4c4c0"
              strokeWidth="1"
              strokeDasharray="3 8"
            />
            <polygon
              points="200,80 320,200 200,320 80,200"
              fill="transparent"
              stroke="#d8d8d4"
              strokeWidth="1"
              strokeDasharray="3 8"
            />
          </svg>

          <div
            ref={contentRef}
            style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, textAlign: "center", padding: "0 80px" }}
          >
            {!displayVal && (
              <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ababab" }}>
                CLICK TO TYPE
              </span>
            )}
            {displayVal && (
              <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6b6b" }}>
                {config.prompt.toUpperCase()}
              </span>
            )}
            <span style={{ fontSize: displayVal ? "clamp(1.3rem, 2.2vw, 1.8rem)" : "clamp(1.1rem, 1.8vw, 1.4rem)", fontWeight: 300, color: "#1a1a1a", textDecoration: "underline", textUnderlineOffset: 6, wordBreak: "break-word", lineHeight: 1.25 }}>
              {displayVal || config.prompt}
              {focused && (
                <span style={{ display: "inline-block", width: 1.5, height: "1em", background: "#1a1a1a", marginLeft: 3, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />
              )}
            </span>
            {error && <span style={{ fontSize: 11, color: "#c0392b", marginTop: 4 }}>{error}</span>}
          </div>
        </div>
      </div>

      {/* BACK */}
      <div style={{ position: "absolute", bottom: 32, left: 24, display: "flex", alignItems: "center", gap: 12, zIndex: 10 }}>
        <DiamondButton size={38} onClick={handleBack}><FiArrowLeft size={13} strokeWidth={1.5} /></DiamondButton>
        <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 500 }}>BACK</span>
      </div>

      {/* PROCEED */}
      {showProceed && (
        <div style={{ position: "absolute", bottom: 32, right: 24, display: "flex", alignItems: "center", gap: 12, zIndex: 10 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 500 }}>
            {loading ? "SENDING..." : "PROCEED"}
          </span>
          <DiamondButton size={38} onClick={handleProceed} disabled={loading}>
            <FiArrowRight size={13} strokeWidth={1.5} />
          </DiamondButton>
        </div>
      )}
    </PageWrapper>
  );
}
