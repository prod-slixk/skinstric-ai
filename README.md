<div align="center">

# Skinstric — AI Skincare Analysis

**A motion-rich skincare AI app that analyses your skin from a selfie or uploaded photo and delivers a personalised routine.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge)](https://skinstric-ai-theta.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Source%20Code-181717?style=for-the-badge&logo=github)](https://github.com/prod-slixk/skinstric-ai)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://gsap.com)

</div>

---

## Overview

Skinstric is a multi-step AI skincare experience. Users introduce themselves, choose how to submit their photo (live camera or gallery), and receive a personalised skin analysis powered by a Firebase Cloud Function. Every screen is animated — page transitions fade and slide out via a custom GSAP hook, diamond elements spin and pulse, and SVG corner lines draw themselves in on load.

---

## User Flow

```
/ (Landing)
  └─ GSAP hero + bracket shift on hover
       │
       ▼
/intro  (2-step form)
  ├─ Step 1: Enter name  (letters only, 2+ chars)
  └─ Step 2: Enter city  → POST skinstricPhaseOne Cloud Function
                         → store user in localStorage
                              │
                              ▼
/ai-analysis  (choose input method)
  ├─ Camera  ──────────────────────────────────┐
  └─ Gallery (file upload → FileReader base64) │
                                               ▼
/selfie  (live camera)                    sessionStorage ← base64 image
  ├─ getUserMedia → diamond-clipped video       │
  ├─ Canvas API capture + mirror               ▼
  └─ Retake / Analyse                 /ai-analysis/result
                                       (AI skin analysis output)
```

---

## Features

- **GSAP page transitions** — exit animation on `#page-root` (opacity + y slide) before every route change
- **Diamond camera viewport** — live `getUserMedia` feed clipped to a diamond shape via CSS `clip-path`; Canvas API captures and mirrors the frame
- **Gallery upload** — `FileReader` converts any image to base64 for the same analysis pipeline
- **Animated entry sequences** — `CornerLines` draws SVG diagonals in via `stroke-dashoffset`; `DiamondButton` uses GSAP for hover expand and press-release feel
- **2-step intro form** — name + city validated (letters only, 2+ chars), posted to Firebase Cloud Function `skinstricPhaseOne`
- **Spinning diamond loaders** — three concentric diamond images rotate at different speeds as ambient background motion
- **Full Open Graph + Twitter Card metadata** — title, description, preview image, robots

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animation | GSAP 3 |
| Icons | React Icons 5 |
| Font | DM Sans (Google Fonts) |
| Backend | Firebase Cloud Functions |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing — GSAP hero, bracket shift on hover
│   ├── layout.tsx                # Root layout — DM Sans, metadata, OG tags
│   ├── intro/
│   │   └── page.tsx              # 2-step name/city form → Cloud Function POST
│   ├── ai-analysis/
│   │   ├── page.tsx              # Choose: Camera (→ /selfie) or Gallery upload
│   │   └── result/
│   │       └── page.tsx          # AI skin analysis results
│   └── selfie/
│       └── page.tsx              # getUserMedia → diamond clip → Canvas capture
├── components/
│   ├── CornerLines.tsx           # SVG diagonals with stroke-dashoffset draw-in
│   ├── DiamondButton.tsx         # Rotated button with GSAP hover + press micro-animations
│   ├── Navigation.tsx            # Persistent nav with section label
│   └── PageWrapper.tsx           # Layout shell — exposes #page-root for transitions
└── hooks/
    └── useTransitionRouter.ts    # GSAP exit animation wrapping Next.js useRouter
```

---

## Key Implementation Details

### `useTransitionRouter`

A drop-in replacement for `useRouter().push` that fades and lifts the current page out before navigating. Every page uses this instead of the bare router.

```ts
const push = (href: string) => {
  gsap.to(document.getElementById("page-root"), {
    opacity: 0, y: -14, duration: 0.32, ease: "power2.in",
    onComplete: () => router.push(href),
  });
};
```

### `CornerLines`

Full-viewport SVG with two dashed diagonal lines. On mount, GSAP calculates the viewport diagonal and animates `strokeDashoffset` from that value to `0` — creating a "pen drawing" effect.

### `DiamondButton`

Reusable rotated button with three GSAP states: hover (scale up + fill), leave (scale down + clear), click (compress → overshoot → settle).

---

## Getting Started

```bash
# 1. Clone and install
git clone https://github.com/prod-slixk/skinstric-ai.git
cd skinstric-ai
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # ESLint
```

---

## License

MIT
