"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import PageWrapper from "@/components/PageWrapper";
import CornerLines from "@/components/CornerLines";
import DiamondButton from "@/components/DiamondButton";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function LandingPage() {
  const { push } = useTransitionRouter();

  const navRef      = useRef<HTMLDivElement>(null);
  const heroRef     = useRef<HTMLHeadingElement>(null);
  const leftNavRef  = useRef<HTMLDivElement>(null);
  const rightNavRef = useRef<HTMLDivElement>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);

  // Entrance animation — simple fade + slight rise, no horizontal offset
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(navRef.current,      { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.5 }, 0.2)
        .fromTo(heroRef.current,     { opacity: 0, y: 20 },  { opacity: 1, y: 0, duration: 0.7, clearProps: "transform" }, 0.3)
        .fromTo(leftNavRef.current,  { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 }, 0.55)
        .fromTo(rightNavRef.current, { opacity: 0, x: 20 },  { opacity: 1, x: 0, duration: 0.5 }, 0.65)
        .fromTo(bottomRef.current,   { opacity: 0 },         { opacity: 1, duration: 0.5 }, 0.85);
    });
    return () => ctx.revert();
  }, []);

  // Hero shifts RIGHT when hovering left nav, LEFT when hovering right nav
  // Both nav buttons fade out on hover, fade back in on leave
  const shiftHero = (direction: "left" | "right" | "center") => {
    if (!heroRef.current) return;
    // Max safe offset = half the remaining space after the text, minus a small margin
    const heroWidth = heroRef.current.offsetWidth;
    const offset = Math.max(0, (window.innerWidth - heroWidth) / 2 - 24);
    const x = direction === "right" ? offset : direction === "left" ? -offset : 0;
    const isHovering = direction !== "center";

    gsap.to(heroRef.current, { x, duration: 0.55, ease: "power3.out" });
    // Hover left → hide right. Hover right → hide left. Leave → restore both.
    gsap.to(rightNavRef.current, {
      opacity: direction === "right" ? 0 : 1,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(leftNavRef.current, {
      opacity: direction === "left" ? 0 : 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <PageWrapper>
      {/* BACKGROUND VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* LIGHT OVERLAY — keeps text legible */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(245, 244, 240, 0.52)",
          zIndex: 1,
        }}
      />

      <CornerLines />

      {/* NAV */}
      <div
        ref={navRef}
        style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", zIndex: 10, opacity: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", color: "#1a1a1a" }}>SKINSTRIC</span>
          <span style={{ fontSize: 13, fontWeight: 300, letterSpacing: "0.1em", color: "#6b6b6b" }}>[ INTRO ]</span>
        </div>
        <button style={{ padding: "6px 14px", background: "#1a1a1a", color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          ENTER CODE
        </button>
      </div>

      {/* LEFT NAV — hover pushes hero RIGHT */}
      <div
        ref={leftNavRef}
        onMouseEnter={() => shiftHero("right")}
        onMouseLeave={() => shiftHero("center")}
        style={{
          position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)",
          display: "flex", alignItems: "center", gap: 12, zIndex: 10, opacity: 0,
          cursor: "pointer",
        }}
      >
        <DiamondButton size={40} onClick={() => {}}>
          <FiArrowLeft size={14} strokeWidth={1.5} />
        </DiamondButton>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a" }}>
          DISCOVER A.I.
        </span>
      </div>

      {/* RIGHT NAV — hover pushes hero LEFT */}
      <div
        ref={rightNavRef}
        onMouseEnter={() => shiftHero("left")}
        onMouseLeave={() => shiftHero("center")}
        style={{
          position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)",
          display: "flex", alignItems: "center", gap: 12, zIndex: 10, opacity: 0,
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a" }}>
          TAKE TEST
        </span>
        <DiamondButton size={40} onClick={() => push("/intro")}>
          <FiArrowRight size={14} strokeWidth={1.5} />
        </DiamondButton>
      </div>

      {/* HERO */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 5 }}>
        <h1
          ref={heroRef}
          style={{
            fontSize: "clamp(3.5rem, 7vw, 6.5rem)",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            color: "#1a1a1a",
            textAlign: "center",
            lineHeight: 1.05,
            userSelect: "none",
            opacity: 0,
          }}
        >
          Sophisticated
          <br />
          skincare
        </h1>
      </div>

      {/* BOTTOM DESCRIPTION */}
      <div
        ref={bottomRef}
        style={{ position: "absolute", bottom: 32, left: 24, zIndex: 10, opacity: 0 }}
      >
        <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.9, color: "#1a1a1a", fontWeight: 400 }}>
          SKINSTRIC DEVELOPED AN A.I. THAT CREATES
          <br />
          A HIGHLY-PERSONALISED ROUTINE TAILORED TO
          <br />
          WHAT YOUR SKIN NEEDS.
        </p>
      </div>
    </PageWrapper>
  );
}
