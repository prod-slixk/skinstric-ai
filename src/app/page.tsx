"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import EnterCodeModal from "@/components/EnterCodeModal";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import PageWrapper from "@/components/PageWrapper";

const L_BRACKET = "https://skinstric-wandag.vercel.app/_next/static/media/Rectangle%202710.61a74ed4.png";
const R_BRACKET = "https://skinstric-wandag.vercel.app/_next/static/media/Rectangle%202711.b2b3b291.png";

export default function LandingPage() {
  const { push } = useTransitionRouter();
  const [showCodeModal, setShowCodeModal] = useState(false);

  const headingRef       = useRef<HTMLHeadingElement>(null);
  const leftRef          = useRef<HTMLButtonElement>(null);
  const rightRef         = useRef<HTMLButtonElement>(null);
  const leftDiamRef      = useRef<HTMLDivElement>(null);
  const rightDiamRef     = useRef<HTMLDivElement>(null);
  const leftCornerRef    = useRef<HTMLDivElement>(null);
  const rightCornerRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

    // Hero text shift
    gsap.to(headingRef.current, { x, duration: 0.5, ease: "power3.out" });

    // Opposite side (button + corner diamond) fades on hover
    gsap.to(rightRef.current,       { opacity: direction === "right" ? 0 : 1, duration: 0.3 });
    gsap.to(rightCornerRef.current, { opacity: direction === "right" ? 0 : 1, duration: 0.3 });
    gsap.to(leftRef.current,        { opacity: direction === "left"  ? 0 : 1, duration: 0.3 });
    gsap.to(leftCornerRef.current,  { opacity: direction === "left"  ? 0 : 1, duration: 0.3 });

    // Hovered button diamond pops slightly
    const pop = 1.35;
    gsap.to(leftDiamRef.current,  { scale: direction === "right" ? pop : 1, duration: 0.3, ease: "back.out(1.5)" });
    gsap.to(rightDiamRef.current, { scale: direction === "left"  ? pop : 1, duration: 0.3, ease: "back.out(1.5)" });
  };

  return (
    <PageWrapper>
      {/*
        CORNER DIAMONDS — Figma: two 602px diamonds, each centered on the
        left/right viewport edge so exactly half is visible on-screen.
        translate(±50%, -50%) achieves this without fixed pixel values.
      */}
      <div ref={leftCornerRef} style={{
        position: "fixed", left: 0, top: "50%",
        width: "31.35vw", height: "31.35vw",   /* 602/1920 = 31.35% */
        border: "1px dotted #A0A4AB",
        transform: "translate(-50%, -50%) rotate(45deg)",
        pointerEvents: "none", zIndex: 1,
      }} />
      <div ref={rightCornerRef} style={{
        position: "fixed", right: 0, top: "50%",
        width: "31.35vw", height: "31.35vw",
        border: "1px dotted #A0A4AB",
        transform: "translate(50%, -50%) rotate(45deg)",
        pointerEvents: "none", zIndex: 1,
      }} />

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

      {/* HERO — Figma: 128px, weight 300, tracking -0.07em, lineHeight 0.94, vertically centered */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 5 }}>
        <h1
          ref={headingRef}
          style={{
            fontSize: "clamp(3.5rem, 8vw, 8rem)",
            fontWeight: 300,
            letterSpacing: "-0.09em",
            lineHeight: 0.88,
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

      {/* DESCRIPTION — Figma: left 32px, top 862/960 ≈ bottom 26px */}
      <div className="desktop-only" style={{ position: "absolute", bottom: 26, left: 32, zIndex: 10 }}>
        <p style={{ fontSize: 14, fontWeight: 400, lineHeight: "24px", color: "#1A1B1C", textTransform: "uppercase" }}>
          Skinstric developed an A.I. that creates a<br />
          highly-personalized routine tailored to<br />
          what your skin needs.
        </p>
      </div>

      {/*
        LEFT BUTTON — DISCOVER A.I.
        Centered within the visible half of the left diamond.
        Diamond is 31.35vw wide, centered on left edge → visible half extends ~22.17vw.
        Button center placed at 11vw from left (midpoint of visible half), top 50%.
        Hover fires only on the button itself.
      */}
      <button
        ref={leftRef}
        className="desktop-flex-only"
        onMouseEnter={() => shiftHero("right")}
        onMouseLeave={() => shiftHero("center")}
        style={{
          position: "fixed",
          left: "11vw",
          top: "50%",
          transform: "translate(-50%, -50%)",
          alignItems: "center",
          gap: 16,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          padding: "8px 0",
          zIndex: 10,
          whiteSpace: "nowrap",
        }}
      >
        <div ref={leftDiamRef} style={{ position: "relative", width: 32, height: 32, flexShrink: 0, transformOrigin: "center center" }}>
          <div style={{ position: "absolute", inset: 0, border: "1px solid #1A1B1C", transform: "rotate(45deg)" }} />
          <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(180deg)", fontSize: 10, lineHeight: 1 }}>&#9654;</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", color: "#1A1B1C", opacity: 0.7 }}>DISCOVER A.I.</span>
      </button>

      {/*
        RIGHT BUTTON — TAKE TEST
        Centered within the visible half of the right diamond.
        Button center at 89vw from left (= 11vw from right edge), top 50%.
      */}
      <button
        ref={rightRef}
        className="desktop-flex-only"
        onMouseEnter={() => shiftHero("left")}
        onMouseLeave={() => shiftHero("center")}
        onClick={() => push("/intro")}
        style={{
          position: "fixed",
          left: "89vw",
          top: "50%",
          transform: "translate(-50%, -50%)",
          alignItems: "center",
          gap: 16,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          padding: "8px 0",
          zIndex: 10,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", color: "#1A1B1C", opacity: 0.7 }}>TAKE TEST</span>
        <div ref={rightDiamRef} style={{ position: "relative", width: 32, height: 32, flexShrink: 0, transformOrigin: "center center" }}>
          <div style={{ position: "absolute", inset: 0, border: "1px solid #1A1B1C", transform: "rotate(45deg)" }} />
          <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 10, lineHeight: 1 }}>&#9654;</span>
        </div>
      </button>

      {/* MOBILE */}
      <div className="mobile-only" style={{ position: "absolute", bottom: 80, left: 0, right: 0, flexDirection: "column", alignItems: "center", gap: 16, zIndex: 10 }}>
        <p style={{ fontSize: 14, fontWeight: 600, textAlign: "center", width: "30ch", color: "rgba(26,27,28,0.51)" }}>
          Skinstric developed an A.I. that creates a highly-personalized routine tailored to what your skin needs.
        </p>
        <button onClick={() => push("/intro")} style={{ display: "flex", alignItems: "center", gap: 16, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 12 }}>
          ENTER EXPERIENCE
          <div style={{ width: 24, height: 24, border: "1px solid #1A1B1C", transform: "rotate(45deg)" }} />
        </button>
      </div>

      {showCodeModal && <EnterCodeModal onClose={() => setShowCodeModal(false)} />}
    </PageWrapper>
  );
}
