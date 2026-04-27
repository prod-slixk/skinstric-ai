"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import EnterCodeModal from "@/components/EnterCodeModal";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import PageWrapper from "@/components/PageWrapper";
import CornerLines from "@/components/CornerLines";

const L_BRACKET = "https://skinstric-wandag.vercel.app/_next/static/media/Rectangle%202710.61a74ed4.png";
const R_BRACKET = "https://skinstric-wandag.vercel.app/_next/static/media/Rectangle%202711.b2b3b291.png";

export default function LandingPage() {
  const { push } = useTransitionRouter();
  const [showCodeModal, setShowCodeModal] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);
  const descRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Only the heading fades in; sidebars + description are immediately visible
      gsap.fromTo(headingRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, []);

  const shiftHero = (direction: "left" | "right" | "center") => {
    if (!headingRef.current) return;
    const w = headingRef.current.offsetWidth;
    const offset = Math.max(0, (window.innerWidth - w) / 2 - 48);
    const x = direction === "right" ? offset : direction === "left" ? -offset : 0;
    gsap.to(headingRef.current, { x, duration: 0.5, ease: "power3.out" });
    gsap.to(rightRef.current, { opacity: direction === "right" ? 0 : 1, duration: 0.3 });
    gsap.to(leftRef.current,  { opacity: direction === "left"  ? 0 : 1, duration: 0.3 });
  };

  return (
    <PageWrapper>
      <CornerLines />
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

      {/* HERO HEADING */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 5 }}>
        <h1
          ref={headingRef}
          style={{
            fontSize: "clamp(3.5rem, 8vw, 6.25rem)",
            fontWeight: 400,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "#1A1B1C",
            textAlign: "center",
            opacity: 0,
            fontFamily: "Inter, var(--font-dm-sans), system-ui, sans-serif",
            userSelect: "none",
          }}
        >
          Sophisticated<br />skincare
        </h1>
      </div>

      {/* DESCRIPTION — desktop only */}
      <div
        ref={descRef}
        className="desktop-only"
        style={{ position: "absolute", bottom: "7vh", left: "calc(20vw)", zIndex: 10 }}
      >
        <p style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.6, color: "#1A1B1C", textTransform: "uppercase" }}>
          Skinstric developed an A.I. that creates a<br />
          highly-personalized routine tailored to<br />
          what your skin needs.
        </p>
      </div>

      {/* LEFT HOVER ZONE — DISCOVER A.I. (desktop only) */}
      <div
        ref={leftRef}
        className="desktop-flex-only"
        onMouseEnter={() => shiftHero("right")}
        onMouseLeave={() => shiftHero("center")}
        style={{
          position: "fixed",
          left: 0, top: 0, bottom: 0,
          width: "28%",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 48,
          zIndex: 10,
        }}
      >
        <button
          style={{
            display: "inline-flex", alignItems: "center", gap: 16,
            fontSize: 14, fontWeight: 400, color: "#1A1B1C",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "inherit", padding: "8px 12px",
          }}
        >
          <div style={{ position: "relative", width: 30, height: 30, flexShrink: 0 }}>
            <div style={{ width: "100%", height: "100%", border: "1px solid #1A1B1C", transform: "rotate(45deg)" }} />
            <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(180deg)", fontSize: 10, lineHeight: 1 }}>▶</span>
          </div>
          <span>DISCOVER A.I.</span>
        </button>
      </div>

      {/* RIGHT HOVER ZONE — TAKE TEST (desktop only) */}
      <div
        ref={rightRef}
        className="desktop-flex-only"
        onMouseEnter={() => shiftHero("left")}
        onMouseLeave={() => shiftHero("center")}
        style={{
          position: "fixed",
          right: 0, top: 0, bottom: 0,
          width: "28%",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: 48,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => push("/intro")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 16,
            fontSize: 14, fontWeight: 400, color: "#1A1B1C",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "inherit", padding: "8px 12px",
          }}
        >
          <span>TAKE TEST</span>
          <div style={{ position: "relative", width: 30, height: 30, flexShrink: 0 }}>
            <div style={{ width: "100%", height: "100%", border: "1px solid #1A1B1C", transform: "rotate(45deg)" }} />
            <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 10, lineHeight: 1 }}>▶</span>
          </div>
        </button>
      </div>

      {/* MOBILE — description + CTA */}
      <div
        className="mobile-only"
        style={{ position: "absolute", bottom: 80, left: 0, right: 0, flexDirection: "column", alignItems: "center", gap: 16, zIndex: 10 }}
      >
        <p style={{ fontSize: 14, fontWeight: 600, textAlign: "center", width: "30ch", color: "rgba(26,27,28,0.51)" }}>
          Skinstric developed an A.I. that creates a highly-personalized routine tailored to what your skin needs.
        </p>
        <button
          onClick={() => push("/intro")}
          style={{ display: "flex", alignItems: "center", gap: 16, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 12 }}
        >
          ENTER EXPERIENCE
          <div style={{ width: 24, height: 24, border: "1px solid #1A1B1C", transform: "rotate(45deg)" }} />
        </button>
      </div>

      {showCodeModal && <EnterCodeModal onClose={() => setShowCodeModal(false)} />}
    </PageWrapper>
  );
}
