"use client";
import { useEffect } from "react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";

export default function AnalysisError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Skinstric/ai-analysis]", error);
  }, [error]);

  const { push } = useTransitionRouter();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#f5f4f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        gap: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ababab", marginBottom: 12, fontWeight: 500 }}>
          Skinstric · A.I. Analysis
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 200, letterSpacing: "-0.01em", color: "#1a1a1a", marginBottom: 12, lineHeight: 1.1 }}>
          Analysis failed.
        </h1>
        <p style={{ fontSize: 12, color: "#6b6b6b", letterSpacing: "0.04em", lineHeight: 1.7, marginBottom: 32 }}>
          We couldn&apos;t process your image. Please try again with a different photo.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              padding: "10px 20px",
              background: "#1a1a1a",
              color: "#f5f4f0",
              border: "none",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => push("/ai-analysis")}
            style={{
              padding: "10px 20px",
              background: "transparent",
              color: "#1a1a1a",
              border: "1px solid #d4d4d0",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Back to Camera
          </button>
        </div>
      </div>
    </div>
  );
}
