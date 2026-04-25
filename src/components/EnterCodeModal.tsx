"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";

interface EnterCodeModalProps {
  onClose: () => void;
}

// A valid access code: 4–12 alphanumeric characters (case-insensitive)
function isValidCode(v: string): boolean {
  return /^[a-zA-Z0-9]{4,12}$/.test(v.trim());
}

export default function EnterCodeModal({ onClose }: EnterCodeModalProps) {
  const { push } = useTransitionRouter();

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef    = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);

  const [code, setCode]       = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // ── Entrance ──────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.fromTo(panelRef.current, { opacity: 0, scale: 0.96, y: 8 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out", delay: 0.05 });
    });
    setTimeout(() => inputRef.current?.focus(), 120);
    return () => ctx.revert();
  }, []);

  // ── ESC to close ──────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Animated close ────────────────────────────────────────
  const handleClose = () => {
    gsap.to(panelRef.current, { opacity: 0, scale: 0.96, y: 8, duration: 0.22, ease: "power2.in" });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.28, ease: "power2.in", onComplete: onClose });
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async () => {
    const trimmed = code.trim();
    if (!isValidCode(trimmed)) {
      setError("Invalid code — 4–12 alphanumeric characters.");
      // Shake the input
      gsap.to(inputRef.current, {
        keyframes: [
          { x: -5 }, { x: 5 }, { x: -4 }, { x: 4 }, { x: 0 },
        ],
        duration: 0.38,
        ease: "none",
      });
      return;
    }
    setLoading(true);
    setError("");
    // Store the code and skip the intro form
    localStorage.setItem("skinstric_code", trimmed.toUpperCase());
    // Brief pause so the button state registers visually
    await new Promise((r) => setTimeout(r, 300));
    push("/ai-analysis");
  };

  return (
    // Backdrop
    <div
      ref={backdropRef}
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26, 26, 26, 0.55)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      {/* Panel — stop click from bubbling to backdrop */}
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#f5f4f0",
          border: "1px solid #d4d4d0",
          padding: "48px 40px 40px",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 28,
            height: 28,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            color: "#6b6b6b",
            fontSize: 18,
            lineHeight: 1,
            fontFamily: "inherit",
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ababab", marginBottom: 8, fontWeight: 500 }}>
          Skinstric · Access
        </p>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 300, letterSpacing: "-0.01em", color: "#1a1a1a", marginBottom: 6 }}>
          Enter Code
        </h2>
        <p style={{ fontSize: 12, color: "#6b6b6b", letterSpacing: "0.04em", marginBottom: 32, lineHeight: 1.6 }}>
          Have an access code? Enter it below to skip the intake form and go straight to A.I. analysis.
        </p>

        {/* Input */}
        <div style={{ marginBottom: 24, position: "relative" }}>
          <input
            ref={inputRef}
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder="e.g. SKIN2026"
            maxLength={12}
            autoComplete="off"
            spellCheck={false}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              borderBottom: `1px solid ${error ? "#c0392b" : "#1a1a1a"}`,
              padding: "10px 0",
              fontSize: "1rem",
              fontWeight: 300,
              letterSpacing: "0.12em",
              color: "#1a1a1a",
              outline: "none",
              fontFamily: "inherit",
              textTransform: "uppercase",
              caretColor: "#1a1a1a",
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontSize: 11, color: "#c0392b", marginBottom: 16, letterSpacing: "0.04em" }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#1a1a1a",
            color: "#f5f4f0",
            border: "none",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            fontFamily: "inherit",
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "VERIFYING..." : "PROCEED →"}
        </button>
      </div>
    </div>
  );
}
