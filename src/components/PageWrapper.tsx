"use client";
import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";

interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  style?: React.CSSProperties;
}

/**
 * Wraps every page with:
 * - id="page-root" (targeted by useTransitionRouter exit animation)
 * - GSAP enter animation: fade + slide up from y:24
 * - Consistent base positioning styles
 */
export default function PageWrapper({ children, style, ...rest }: PageWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", clearProps: "transform" }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      id="page-root"
      {...rest}
      style={{
        position: "fixed",
        inset: 0,
        background: "#f5f4f0",
        overflow: "hidden",
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
