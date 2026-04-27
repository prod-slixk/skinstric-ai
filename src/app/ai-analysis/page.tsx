"use client";
import { useRef, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import DiamondButton from "@/components/DiamondButton";
import EnterCodeModal from "@/components/EnterCodeModal";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { FiArrowLeft } from "react-icons/fi";

const L_BRACKET = "https://skinstric-wandag.vercel.app/_next/static/media/Rectangle%202710.61a74ed4.png";
const R_BRACKET = "https://skinstric-wandag.vercel.app/_next/static/media/Rectangle%202711.b2b3b291.png";

const RES_LARGE  = "https://skinstric-wandag.vercel.app/_next/static/media/ResDiamond-large.884fc6a9.png";
const RES_MEDIUM = "https://skinstric-wandag.vercel.app/_next/static/media/ResDiamond-medium.2224a388.png";
const RES_SMALL  = "https://skinstric-wandag.vercel.app/_next/static/media/ResDiamond-small.bd0ba7e9.png";
const CAMERA_ICON   = "https://skinstric-wandag.vercel.app/_next/static/media/camera-icon.14742046.png";
const GALLERY_ICON  = "https://skinstric-wandag.vercel.app/_next/static/media/gallery-icon.c9f2deef.png";
const SCAN_LINE     = "https://skinstric-wandag.vercel.app/_next/static/media/ResScanLine.99dc727d.png";
const GALLERY_LINE  = "https://skinstric-wandag.vercel.app/_next/static/media/ResGalleryLine.84646ce1.png";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AiAnalysisPage() {
  const { push } = useTransitionRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError]         = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Please upload an image file."); return; }
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

  return (
    <PageWrapper>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

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

      {/* TO START ANALYSIS */}
      <div style={{ position: "absolute", top: 68, left: 36, zIndex: 10 }}>
        <p style={{ fontWeight: 600, fontSize: 12, color: "#1A1B1C", textTransform: "uppercase" }}>TO START ANALYSIS</p>
      </div>

      {/* TWO DIAMOND CLUSTERS */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 64 }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", position: "relative", width: "100%", maxWidth: 1100 }}>

          {/* LEFT CLUSTER — CAMERA */}
          <div
            onClick={() => push("/selfie")}
            style={{ position: "relative", width: "clamp(270px, 38vw, 482px)", height: "clamp(270px, 38vw, 482px)", cursor: "pointer", flexShrink: 0, marginRight: "-60px" }}
          >
            <img src={RES_LARGE} alt="" className="animate-spin-slow" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animationDelay: "0s" }} />
            <img src={RES_MEDIUM} alt="" className="animate-spin-slower" style={{ position: "absolute", inset: 0, width: "90%", height: "90%", top: "5%", left: "5%", animationDelay: "-4s" }} />
            <img src={RES_SMALL} alt="" className="animate-spin-slowest" style={{ position: "absolute", inset: 0, width: "80%", height: "80%", top: "10%", left: "10%", animationDelay: "-8s" }} />
            {/* Camera icon */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={CAMERA_ICON} alt="Camera" style={{ width: "clamp(80px,10vw,136px)", height: "clamp(80px,10vw,136px)", transition: "transform 0.7s ease-in-out" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
            {/* Scan label */}
            <div style={{ position: "absolute", bottom: "8%", right: "-10px", textAlign: "left" }}>
              <p style={{ fontSize: 13, fontWeight: 400, lineHeight: "24px", whiteSpace: "nowrap" }}>
                ALLOW A.I.<br />TO SCAN YOUR FACE
              </p>
              <img src={SCAN_LINE} alt="" style={{ position: "absolute", right: "100%", top: 8, width: 66, height: 59, marginRight: 4 }} />
            </div>
          </div>

          {/* RIGHT CLUSTER — GALLERY */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{ position: "relative", width: "clamp(270px, 38vw, 482px)", height: "clamp(270px, 38vw, 482px)", cursor: "pointer", flexShrink: 0, marginLeft: "-60px" }}
          >
            <img src={RES_LARGE} alt="" className="animate-spin-slow" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animationDelay: "-3s" }} />
            <img src={RES_MEDIUM} alt="" className="animate-spin-slower" style={{ position: "absolute", inset: 0, width: "90%", height: "90%", top: "5%", left: "5%", animationDelay: "-10s" }} />
            <img src={RES_SMALL} alt="" className="animate-spin-slowest" style={{ position: "absolute", inset: 0, width: "80%", height: "80%", top: "10%", left: "10%", animationDelay: "-5s" }} />
            {/* Gallery icon */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={GALLERY_ICON} alt="Gallery" style={{ width: "clamp(80px,10vw,136px)", height: "clamp(80px,10vw,136px)", transition: "transform 0.7s ease-in-out" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
            {/* Gallery label */}
            <div style={{ position: "absolute", bottom: "8%", left: "-10px", textAlign: "right" }}>
              <p style={{ fontSize: 13, fontWeight: 400, lineHeight: "24px", whiteSpace: "nowrap" }}>
                ALLOW A.I.<br />ACCESS GALLERY
              </p>
              <img src={GALLERY_LINE} alt="" style={{ position: "absolute", left: "100%", bottom: 10, width: 66, height: 59, marginLeft: 4 }} />
            </div>
          </div>
        </div>
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
        <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1A1B1C", fontWeight: 500 }}>BACK</span>
      </div>

      {showCodeModal && <EnterCodeModal onClose={() => setShowCodeModal(false)} />}
    </PageWrapper>
  );
}
