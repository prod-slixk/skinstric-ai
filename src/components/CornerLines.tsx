"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Full-viewport diagonal dashed lines that draw themselves in on mount.
 * Uses stroke-dashoffset animation to create the "pen drawing" effect.
 */
export default function CornerLines() {
  const line1Ref = useRef<SVGLineElement>(null);
  const line2Ref = useRef<SVGLineElement>(null);

  useEffect(() => {
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    if (!l1 || !l2) return;

    // Diagonal length of the viewport
    const diag = Math.hypot(window.innerWidth, window.innerHeight) + 50;

    // Start fully hidden, then draw in
    gsap.set([l1, l2], { strokeDashoffset: diag });

    const tl = gsap.timeline({ delay: 0.1 });
    tl.to(l1, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out" }, 0)
      .to(l2, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out" }, 0.15);

    return () => { tl.kill(); };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, overflow: "hidden" }}>
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        <line
          ref={line1Ref}
          x1="0" y1="0" x2="100%" y2="100%"
          stroke="#c8c8c4"
          strokeWidth="1"
          strokeDasharray="3 8"
        />
        <line
          ref={line2Ref}
          x1="100%" y1="0" x2="0" y2="100%"
          stroke="#c8c8c4"
          strokeWidth="1"
          strokeDasharray="3 8"
        />
      </svg>
    </div>
  );
}
