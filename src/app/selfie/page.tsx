"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import CornerLines from "@/components/CornerLines";
import DiamondButton from "@/components/DiamondButton";
import EnterCodeModal from "@/components/EnterCodeModal";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { FiArrowLeft, FiCamera, FiRefreshCw, FiCheck } from "react-icons/fi";

type SelfieState = "idle" | "ready" | "captured" | "uploading" | "error";

const DIAMOND = 400;

export default function SelfiePage() {
  const { push } = useTransitionRouter();
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState]             = useState<SelfieState>("idle");
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [error, setError]             = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setState("ready"); // render change happens; useEffect below wires up the ref
      setError("");
    } catch {
      setError("Camera access denied. Please allow camera access and try again.");
    }
  }, []);

  // Wire stream → video element AFTER React has rendered the visible video
  useEffect(() => {
    if (state === "ready" && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [state]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const capture = useCallback(() => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    c.width  = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    ctx.save();
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0);
    ctx.restore();
    setCapturedUrl(c.toDataURL("image/jpeg", 0.92));
    stopCamera();
    setState("captured");
  }, [stopCamera]);

  const retake = useCallback(() => {
    setCapturedUrl(null);
    setState("idle");
  }, []);

  const submit = useCallback(() => {
    if (!capturedUrl) return;
    sessionStorage.setItem("skinstric_pending_image", capturedUrl.split(",")[1]);
    push("/ai-analysis/result");
  }, [capturedUrl, push]);

  const showIdle    = state === "idle" || state === "error";
  const showVideo   = state === "ready";
  const showCapture = !!capturedUrl;

  return (
    <PageWrapper>
      <CornerLines />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* ── NAV ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", zIndex: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", color: "#1a1a1a" }}>SKINSTRIC</span>
            <span style={{ fontSize: 13, fontWeight: 300, letterSpacing: "0.1em", color: "#6b6b6b" }}>[ SELFIE ]</span>
          </div>
          <span style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 500 }}>
            A.I. PHOTO ANALYSIS
          </span>
        </div>
        <button
          onClick={() => setShowCodeModal(true)}
          style={{ padding: "6px 14px", background: "#1a1a1a", color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          ENTER CODE
        </button>
      </div>

      {/* ── DIAMOND ── */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
        <div style={{ position: "relative", width: DIAMOND, height: DIAMOND }}>

          {/* SVG border — always on top */}
          <svg
            width={DIAMOND} height={DIAMOND}
            style={{ position: "absolute", inset: 0, overflow: "visible", zIndex: 3, pointerEvents: "none" }}
          >
            <polygon
              points="200,2 398,200 200,398 2,200"
              fill="transparent"
              stroke="#c4c4c0"
              strokeWidth="1"
              strokeDasharray="3 8"
            />
            {showIdle && (
              <polygon
                points="200,80 320,200 200,320 80,200"
                fill="transparent"
                stroke="#d8d8d4"
                strokeWidth="1"
                strokeDasharray="3 8"
              />
            )}
          </svg>

          {/*
            Video — always rendered so ref is available.
            Clipped to diamond via clip-path.
            Visibility toggled by opacity/display.
          */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              overflow: "hidden",
              zIndex: 1,
              opacity: showVideo ? 1 : 0,
              pointerEvents: showVideo ? "auto" : "none",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scaleX(-1)",
                display: "block",
              }}
            />
          </div>

          {/* Captured image */}
          {showCapture && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                overflow: "hidden",
                zIndex: 2,
              }}
            >
              <img
                src={capturedUrl!}
                alt="Selfie"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {state === "uploading" && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(245,244,240,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 32, height: 32, border: "2px solid #1a1a1a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                </div>
              )}
            </div>
          )}

          {/* Idle / error content */}
          {showIdle && (
            <div
              onClick={startCamera}
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center", cursor: "pointer", zIndex: 4, padding: "0 80px" }}
            >
              <FiCamera size={22} strokeWidth={1.5} style={{ color: "#6b6b6b" }} />
              <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ababab" }}>
                CLICK TO START
              </span>
              <span style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)", fontWeight: 300, color: "#1a1a1a", textDecoration: "underline", textUnderlineOffset: 6 }}>
                {state === "error" ? "Try Again" : "Start Camera"}
              </span>
              {error && (
                <span style={{ fontSize: 11, color: "#c0392b", marginTop: 4 }}>{error}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── BACK ── */}
      <div style={{ position: "absolute", bottom: 32, left: 24, display: "flex", alignItems: "center", gap: 12, zIndex: 10 }}>
        <DiamondButton size={38} onClick={() => { stopCamera(); push("/ai-analysis"); }}>
          <FiArrowLeft size={13} strokeWidth={1.5} />
        </DiamondButton>
        <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 500 }}>BACK</span>
      </div>

      {/* ── CAPTURE (camera live) ── */}
      {showVideo && (
        <div style={{ position: "absolute", bottom: 32, right: 24, display: "flex", alignItems: "center", gap: 12, zIndex: 10 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 500 }}>CAPTURE</span>
          <DiamondButton size={38} onClick={capture}>
            <FiCamera size={13} strokeWidth={1.5} />
          </DiamondButton>
        </div>
      )}

      {/* ── RETAKE / ANALYSE (photo taken) ── */}
      {state === "captured" && (
        <div style={{ position: "absolute", bottom: 32, right: 24, display: "flex", alignItems: "center", gap: 20, zIndex: 10 }}>
          <button
            onClick={retake}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6b6b", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            <FiRefreshCw size={12} strokeWidth={1.5} /> RETAKE
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 500 }}>ANALYSE</span>
            <DiamondButton size={38} onClick={submit}>
              <FiCheck size={13} strokeWidth={1.5} />
            </DiamondButton>
          </div>
        </div>
      )}

      {/* ── ENTER CODE MODAL ── */}
      {showCodeModal && <EnterCodeModal onClose={() => setShowCodeModal(false)} />}
    </PageWrapper>
  );
}
