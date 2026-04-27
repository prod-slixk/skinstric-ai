"use client";
import { useRef, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import EnterCodeModal from "@/components/EnterCodeModal";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";

const L_BRACKET = "https://skinstric-wandag.vercel.app/_next/static/media/Rectangle%202710.61a74ed4.png";
const R_BRACKET = "https://skinstric-wandag.vercel.app/_next/static/media/Rectangle%202711.b2b3b291.png";

const RES_LARGE  = "https://skinstric-wandag.vercel.app/_next/static/media/ResDiamond-large.884fc6a9.png";
const RES_MEDIUM = "https://skinstric-wandag.vercel.app/_next/static/media/ResDiamond-medium.2224a388.png";
const RES_SMALL  = "https://skinstric-wandag.vercel.app/_next/static/media/ResDiamond-small.bd0ba7e9.png";
const CAMERA_ICON  = "https://skinstric-wandag.vercel.app/_next/static/media/camera-icon.14742046.png";
const GALLERY_ICON = "https://skinstric-wandag.vercel.app/_next/static/media/gallery-icon.c9f2deef.png";
const SCAN_LINE    = "https://skinstric-wandag.vercel.app/_next/static/media/ResScanLine.99dc727d.png";
const GALLERY_LINE = "https://skinstric-wandag.vercel.app/_next/static/media/ResGalleryLine.84646ce1.png";

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
  const [error, setError]               = useState("");
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

  /* Reference exact sizes: 482px desktop, 270px mobile */
  const CLUSTER = 482;

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

      {/* TWO DIAMOND CLUSTERS — absolute layout matching reference */}
      <div style={{ position: "absolute", inset: 0 }}>

        {/* LEFT CLUSTER — CAMERA: left-[55%] -translate-x-full */}
        <div
          onClick={() => push("/selfie")}
          style={{
            position: "absolute",
            top: "50%",
            left: "55%",
            transform: "translate(-100%, -50%)",
            width: CLUSTER,
            height: CLUSTER,
            cursor: "pointer",
          }}
        >
          <img src={RES_LARGE}  alt="" className="animate-spin-slow"    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
          <img src={RES_MEDIUM} alt="" className="animate-spin-slower"  style={{ position: "absolute", inset: 0, width: "92%", height: "92%", top: "4%", left: "4%" }} />
          <img src={RES_SMALL}  alt="" className="animate-spin-slowest" style={{ position: "absolute", inset: 0, width: "84%", height: "84%", top: "8%", left: "8%" }} />

          {/* Camera icon */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={CAMERA_ICON} alt="Camera"
              style={{ width: 136, height: 136, transition: "transform 0.7s ease-in-out" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Scan label — top: 30.9%, right: -12px (matches reference exactly) */}
          <div style={{ position: "absolute", top: "30.9%", right: -12, transform: "translateY(-20px)", textAlign: "left" }}>
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: "24px", whiteSpace: "nowrap", marginTop: 4 }}>
              ALLOW A.I.<br />TO SCAN YOUR FACE
            </p>
            {/* Scan line: right: 143px, top: 20px from label container */}
            <img src={SCAN_LINE} alt="" style={{ position: "absolute", right: 143, top: 20, width: 66, height: 59 }} />
          </div>
        </div>

        {/* RIGHT CLUSTER — GALLERY: left-[45%] */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            position: "absolute",
            top: "50%",
            left: "45%",
            transform: "translateY(-50%)",
            width: CLUSTER,
            height: CLUSTER,
            cursor: "pointer",
          }}
        >
          <img src={RES_LARGE}  alt="" className="animate-spin-slow"    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animationDelay: "-3s" }} />
          <img src={RES_MEDIUM} alt="" className="animate-spin-slower"  style={{ position: "absolute", inset: 0, width: "92%", height: "92%", top: "4%", left: "4%", animationDelay: "-10s" }} />
          <img src={RES_SMALL}  alt="" className="animate-spin-slowest" style={{ position: "absolute", inset: 0, width: "84%", height: "84%", top: "8%", left: "8%", animationDelay: "-5s" }} />

          {/* Gallery icon */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={GALLERY_ICON} alt="Gallery"
              style={{ width: 136, height: 136, transition: "transform 0.7s ease-in-out" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Gallery label — top: 70%, left: 17px (matches reference exactly) */}
          <div style={{ position: "absolute", top: "70%", left: 17, transform: "translateY(-10px)", textAlign: "right" }}>
            <p style={{ fontSize: 13, fontWeight: 400, lineHeight: "24px", whiteSpace: "nowrap", marginTop: 8 }}>
              ALLOW A.I.<br />ACCESS GALLERY
            </p>
            {/* Gallery line: left: 120px, bottom: 39px from label container */}
            <img src={GALLERY_LINE} alt="" style={{ position: "absolute", left: 120, bottom: 39, width: 66, height: 59 }} />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", zIndex: 10 }}>
          <span style={{ fontSize: 11, color: "#c0392b" }}>{error}</span>
        </div>
      )}

      {/* BACK — reference style button */}
      <div style={{ position: "absolute", bottom: 32, left: 24, display: "flex", alignItems: "center", zIndex: 10 }}>
        <button onClick={() => push("/intro")} style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
          <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0, border: "1px solid #1A1B1C", transform: "rotate(45deg) scale(0.85)" }} />
            <span style={{ position: "absolute", left: 14, bottom: 12, transform: "rotate(180deg) scale(0.9)", fontSize: 12, lineHeight: 1 }}>&#9654;</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, marginLeft: 16, color: "#1A1B1C" }}>BACK</span>
        </button>
      </div>

      {showCodeModal && <EnterCodeModal onClose={() => setShowCodeModal(false)} />}
    </PageWrapper>
  );
}
