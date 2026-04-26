"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import PageWrapper from "@/components/PageWrapper";
import CornerLines from "@/components/CornerLines";
import DiamondButton from "@/components/DiamondButton";
import EnterCodeModal from "@/components/EnterCodeModal";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

interface Demographics { race: Record<string, number>; age: Record<string, number>; gender: Record<string, number>; }
type Category = "race" | "age" | "gender";

function toSorted(obj: Record<string, number>) {
  return Object.entries(obj).map(([label, score]) => ({ label, score })).sort((a, b) => b.score - a.score);
}
function cap(s: string) { return s.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" "); }

const CAT_LABELS: Record<Category, string> = { race: "RACE", age: "AGE", gender: "SEX" };
const CATEGORIES: Category[] = ["race", "age", "gender"];

function DonutChart({ percent }: { percent: number }) {
  const size = 320;
  const strokeW = 10;
  const radius = (size - strokeW * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!circleRef.current) return;
    const filled = (percent / 100) * circumference;
    gsap.fromTo(
      circleRef.current,
      { strokeDashoffset: circumference },
      { strokeDashoffset: circumference - filled, duration: 1.1, ease: "power3.out", delay: 0.1 }
    );
  }, [percent, circumference]);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#d4d4d0" strokeWidth={strokeW} />
        <circle
          ref={circleRef}
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#1a1a1a" strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "3rem", fontWeight: 200, color: "#1a1a1a", letterSpacing: "-0.02em", lineHeight: 1 }}>
          {percent}<span style={{ fontSize: "1.3rem" }}>%</span>
        </span>
      </div>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <PageWrapper style={{ display: "flex", flexDirection: "column" }}>
      <CornerLines />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", flexShrink: 0, position: "relative", zIndex: 10 }}>
        <div className="skeleton" style={{ width: 120, height: 16 }} />
        <div className="skeleton" style={{ width: 80, height: 28 }} />
      </div>
      <div style={{ padding: "0 24px 20px", flexShrink: 0 }}>
        <div className="skeleton" style={{ width: 80, height: 10, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: 260, height: 52, marginBottom: 12 }} />
        <div className="skeleton" style={{ width: 180, height: 10 }} />
      </div>
      <div style={{ flex: 1, display: "flex", padding: "0 24px", overflow: "hidden", minHeight: 0 }}>
        <div style={{ width: 180, flexShrink: 0, display: "flex", flexDirection: "column", gap: 1, borderRight: "1px solid #d4d4d0" }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="skeleton" style={{ height: 72, marginBottom: i < 2 ? 1 : 0 }} />
          ))}
        </div>
        <div style={{ flex: 1, background: "#ebebeb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "24px 32px" }}>
          <div style={{ position: "relative", width: 240, height: 240 }}>
            <div className="skeleton" style={{ width: 240, height: 240, borderRadius: "50%" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 170, height: 170, borderRadius: "50%", background: "#ebebeb" }} />
            </div>
          </div>
          <div className="skeleton" style={{ width: 100, height: 14 }} />
        </div>
        <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", borderLeft: "1px solid #d4d4d0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #1a1a1a" }}>
            <div className="skeleton" style={{ width: 40, height: 10 }} />
            <div className="skeleton" style={{ width: 90, height: 10 }} />
          </div>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid #e4e4e0" }}>
              <div className="skeleton" style={{ width: 100 + (i % 3) * 30, height: 12 }} />
              <div className="skeleton" style={{ width: 32, height: 12 }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="skeleton" style={{ width: 38, height: 38 }} />
          <div className="skeleton" style={{ width: 40, height: 10 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="skeleton" style={{ width: 80, height: 10 }} />
          <div className="skeleton" style={{ width: 38, height: 38 }} />
        </div>
      </div>
    </PageWrapper>
  );
}

export default function ResultPage() {
  const { push } = useTransitionRouter();
  const [data, setData] = useState<Demographics | null>(null);
  const [selected, setSelected] = useState<Category>("race");
  const [overrides, setOverrides] = useState<Record<Category, string | null>>({ race: null, age: null, gender: null });
  const [showCodeModal, setShowCodeModal] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("skinstric_demographics");
    if (!raw) { push("/ai-analysis"); return; }
    setData(JSON.parse(raw));
  }, [push]);

  if (!data) return <ResultSkeleton />;

  const entries = toSorted(data[selected]);
  const topLabel = overrides[selected] ?? entries[0].label;
  const topScore = entries.find(e => e.label === topLabel)?.score ?? entries[0].score;
  const topPercent = Math.round(topScore * 100);

  const categoryTops: Record<Category, string> = {
    race:   cap(toSorted(data.race)[0].label),
    age:    cap(toSorted(data.age)[0].label),
    gender: cap(toSorted(data.gender)[0].label),
  };

  return (
    <PageWrapper style={{ display: "flex", flexDirection: "column" }}>
      <CornerLines />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", flexShrink: 0, position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", color: "#1a1a1a" }}>SKINSTRIC</span>
          <span style={{ fontSize: 13, fontWeight: 300, letterSpacing: "0.1em", color: "#6b6b6b" }}>[ INTRO ]</span>
        </div>
        <button
          onClick={() => setShowCodeModal(true)}
          style={{ padding: "6px 14px", background: "#1a1a1a", color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          ENTER CODE
        </button>
      </div>
      <div style={{ padding: "0 24px 20px", flexShrink: 0, position: "relative", zIndex: 10 }}>
        <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#1a1a1a", margin: "0 0 4px", fontWeight: 500 }}>A.I. ANALYSIS</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 5vw, 4.2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "#1a1a1a", lineHeight: 1, margin: 0, textTransform: "uppercase" }}>
          Demographics
        </h1>
        <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6b6b", margin: "8px 0 0", fontWeight: 400 }}>PREDICTED RACE &amp; AGE &amp; SEX</p>
      </div>
      <div style={{ flex: 1, display: "flex", padding: "0 24px", overflow: "hidden", position: "relative", zIndex: 5, minHeight: 0 }}>
        <div style={{ width: 180, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: "1px solid #d4d4d0" }}>
          {CATEGORIES.map(cat => {
            const isActive = cat === selected;
            return (
              <button
                key={cat}
                onClick={() => setSelected(cat)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-start",
                  padding: "16px 16px",
                  background: isActive ? "#1a1a1a" : "#f5f5f1",
                  color: isActive ? "#fff" : "#1a1a1a",
                  border: "none", borderBottom: "1px solid #d4d4d0",
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                <span style={{ fontSize: "1.05rem", fontWeight: 600, letterSpacing: "0.01em" }}>{categoryTops[cat]}</span>
                <span style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.55, marginTop: 3 }}>{CAT_LABELS[cat]}</span>
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1, background: "#ebebeb", display: "flex", flexDirection: "column", padding: "24px 32px", minHeight: 0 }}>
          <p style={{ fontSize: "1.35rem", fontWeight: 300, color: "#1a1a1a", margin: 0 }}>{cap(topLabel)}</p>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DonutChart key={`${selected}-${topLabel}`} percent={topPercent} />
          </div>
        </div>
        <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", borderLeft: "1px solid #d4d4d0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
            <span style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 600 }}>{CAT_LABELS[selected]}</span>
            <span style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 600 }}>A.I. CONFIDENCE</span>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {entries.map(entry => {
              const isActive = overrides[selected] === entry.label || (!overrides[selected] && entry.label === entries[0].label);
              return (
                <button
                  key={entry.label}
                  onClick={() => setOverrides(p => ({ ...p, [selected]: entry.label }))}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px",
                    background: isActive ? "#1a1a1a" : "transparent",
                    color: isActive ? "#fff" : "#1a1a1a",
                    border: "none", borderBottom: "1px solid #e4e4e0",
                    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f0f0ec"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width={10} height={10} viewBox="0 0 10 10" style={{ flexShrink: 0 }}>
                      <polygon points="5,0 10,5 5,10 0,5" fill={isActive ? "#fff" : "transparent"} stroke={isActive ? "#fff" : "#1a1a1a"} strokeWidth="1" />
                    </svg>
                    <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 300 }}>{cap(entry.label)}</span>
                  </div>
                  <span style={{ fontSize: 13, fontVariantNumeric: "tabular-nums", letterSpacing: "0.06em" }}>
                    {Math.round(entry.score * 100)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px", flexShrink: 0, position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <DiamondButton size={38} onClick={() => push("/ai-analysis")}><FiArrowLeft size={13} strokeWidth={1.5} /></DiamondButton>
          <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 500 }}>BACK</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 500 }}>VIEW ROUTINE</span>
          <DiamondButton size={38} onClick={() => {}}><FiArrowRight size={13} strokeWidth={1.5} /></DiamondButton>
        </div>
      </div>

      {/* ENTER CODE MODAL */}
      {showCodeModal && <EnterCodeModal onClose={() => setShowCodeModal(false)} />}
    </PageWrapper>
  );
}
