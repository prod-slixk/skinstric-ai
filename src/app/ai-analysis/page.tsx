"use client";

import { useRef, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import CornerLines from "@/components/CornerLines";
import DiamondButton from "@/components/DiamondButton";
import EnterCodeModal from "@/components/EnterCodeModal";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { FiArrowLeft } from "react-icons/fi";

type UploadState = "idle" | "uploading" | "success" | "error";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Flat-top hexagon points generator
function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}


export default function AiAnalysisPage() {
  const { push } = useTransitionRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadState>("idle");
  const [error, setError] = useState("");
  const [hoveredZone, setHoveredZone] = useState<"camera" | "gallery" | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Please upload an image file."); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setError("");
    try {
      const base64 = await fileToBase64(file);
      sessionStorage.setItem("skinstric_pending_image", base64);
      push("/ai-analysis/result");
    } catch {
      setError("Failed to read image. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // SVG layout constants
  const W = 1100, H = 520;
  const leftCx = W * 0.28, rightCx = W * 0.72, Cy = H * 0.5;
  const rings = [90, 140, 190, 240, 290];

  return (
    <PageWrapper>
      <CornerLines />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* NAV */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", zIndex: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", color: "#1a1a1a" }}>SKINSTRIC</span>
            <span style={{ fontSize: 13, fontWeight: 300, letterSpacing: "0.1em", color: "#6b6b6b" }}>[ INTRO ]</span>
          </div>
        </div>
        <button
          onClick={() => setShowCodeModal(true)}
          style={{ padding: "6px 14px", background: "#1a1a1a", color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          ENTER CODE
        </button>
      </div>

      {/* TO START ANALYSIS label */}
      <div style={{ position: "absolute", top: 72, left: 24, zIndex: 10 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 500 }}>
          TO START ANALYSIS
        </span>
      </div>

      {/* PREVIEW BOX — top right */}
      <div style={{
        position: "absolute", top: 60, right: 24, zIndex: 10,
        width: 110, height: 90,
        border: "1px solid #c4c4c0",
        overflow: "hidden",
        background: "#fff",
      }}>
        {preview ? (
          <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.12em", color: "#ababab", textTransform: "uppercase" }}>Preview</span>
          </div>
        )}
        {status === "uploading" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 20, height: 20, border: "2px solid #1a1a1a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        )}
      </div>

      {/* MAIN SVG — hexagon zones */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "90%", maxWidth: 1100, height: "auto" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ── LEFT ZONE — CAMERA ── */}
          <g
            style={{ cursor: "pointer" }}
            onClick={() => push("/selfie")}
            onMouseEnter={() => setHoveredZone("camera")}
            onMouseLeave={() => setHoveredZone(null)}
          >
            {rings.map((r, i) => (
              <polygon
                key={i}
                points={hexPoints(leftCx, Cy, r)}
                fill="transparent"
                stroke={hoveredZone === "camera" ? "#a0a09c" : "#c8c8c4"}
                strokeWidth="1"
                strokeDasharray="3 7"
                style={{ transition: "stroke 0.2s" }}
              />
            ))}
            {/* Connector line */}
            <line
              x1={leftCx + 44} y1={Cy - 44}
              x2={leftCx + 110} y2={Cy - 95}
              stroke="#c4c4c0" strokeWidth="0.75"
            />
            {/* Label */}
            <text x={leftCx + 116} y={Cy - 105} fontSize="9" fill="#1a1a1a" letterSpacing="1.5" fontFamily="var(--font-dm-sans), system-ui">
              ALLOW A.I.
            </text>
            <text x={leftCx + 116} y={Cy - 91} fontSize="9" fill="#1a1a1a" letterSpacing="1.5" fontFamily="var(--font-dm-sans), system-ui">
              TO SCAN YOUR FACE
            </text>
            {/* Icon circle */}
            <foreignObject x={leftCx - 44} y={Cy - 44} width="88" height="88">
              <img
                src="https://skinstric-wandag.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcamera-icon.14742046.png&w=256&q=75"
                alt="Camera"
                style={{ width: 88, height: 88, objectFit: "contain" }}
              />
            </foreignObject>
          </g>

          {/* ── RIGHT ZONE — GALLERY ── */}
          <g
            style={{ cursor: "pointer" }}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={() => setHoveredZone("gallery")}
            onMouseLeave={() => setHoveredZone(null)}
          >
            {rings.map((r, i) => (
              <polygon
                key={i}
                points={hexPoints(rightCx, Cy, r)}
                fill="transparent"
                stroke={hoveredZone === "gallery" ? "#a0a09c" : "#c8c8c4"}
                strokeWidth="1"
                strokeDasharray="3 7"
                style={{ transition: "stroke 0.2s" }}
              />
            ))}
            {/* Connector line */}
            <line
              x1={rightCx - 44} y1={Cy + 44}
              x2={rightCx - 110} y2={Cy + 95}
              stroke="#c4c4c0" strokeWidth="0.75"
            />
            {/* Label */}
            <text x={rightCx - 240} y={Cy + 102} fontSize="9" fill="#1a1a1a" letterSpacing="1.5" fontFamily="var(--font-dm-sans), system-ui">
              ALLOW A.I.
            </text>
            <text x={rightCx - 240} y={Cy + 116} fontSize="9" fill="#1a1a1a" letterSpacing="1.5" fontFamily="var(--font-dm-sans), system-ui">
              ACCESS GALLERY
            </text>
            {/* Icon circle */}
            <foreignObject x={rightCx - 44} y={Cy - 44} width="88" height="88">
              <img
                src="https://skinstric-wandag.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgallery-icon.c9f2deef.png&w=256&q=75"
                alt="Gallery"
                style={{ width: 88, height: 88, objectFit: "contain" }}
              />
            </foreignObject>
          </g>
        </svg>
      </div>

      {/* Error */}
      {error && (
        <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", zIndex: 10 }}>
          <span style={{ fontSize: 11, color: "#c0392b" }}>{error}</span>
        </div>
      )}

      {/* BACK */}
      <div style={{ position: "absolute", bottom: 32, left: 24, display: "flex", alignItems: "center", gap: 12, zIndex: 10 }}>
        <DiamondButton size={38} onClick={() => push("/intro")}>
          <FiArrowLeft size={13} strokeWidth={1.5} />
        </DiamondButton>
        <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 500 }}>BACK</span>
      </div>

      {/* ENTER CODE MODAL */}
      {showCodeModal && <EnterCodeModal onClose={() => setShowCodeModal(false)} />}
    </PageWrapper>
  );
}
