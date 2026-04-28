"use client";
import { useRef, ReactNode } from "react";
import gsap from "gsap";

interface DiamondButtonProps {
  onClick?: () => void;
  children?: ReactNode;
  size?: number;
  disabled?: boolean;
}

export default function DiamondButton({
  onClick,
  children,
  size = 40,
  disabled = false,
}: DiamondButtonProps) {
  const diamondRef = useRef<HTMLDivElement>(null);
  const iconRef    = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    gsap.to(diamondRef.current, {
      backgroundColor: "#1a1a1a",
      scale: 1.20,
      duration: 0.3,
      ease: "back.out(1.5)",
    });
    gsap.to(iconRef.current, { color: "#ffffff", duration: 0.18 });
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    gsap.to(diamondRef.current, {
      backgroundColor: "transparent",
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.to(iconRef.current, { color: "#1a1a1a", duration: 0.18 });
  };

  const handleClick = () => {
    if (disabled) return;
    // Satisfying press-then-release feel
    gsap.timeline()
      .to(diamondRef.current, { scale: 0.88, duration: 0.1, ease: "power2.in" })
      .to(diamondRef.current, { scale: 1.08, duration: 0.15, ease: "back.out(2)" })
      .to(diamondRef.current, { scale: 1, duration: 0.12, ease: "power2.out" });
    onClick?.();
  };

  return (
    <button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.3 : 1,
        flexShrink: 0,
      }}
    >
      <div
        ref={diamondRef}
        style={{
          width: size,
          height: size,
          border: "1px solid #1a1a1a",
          transform: "rotate(45deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          backgroundColor: "transparent",
        }}
      >
        <span
          ref={iconRef}
          style={{
            transform: "rotate(-45deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1a1a1a",
          }}
        >
          {children}
        </span>
      </div>
    </button>
  );
}
