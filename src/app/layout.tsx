import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const BASE_URL = "https://skinstric.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Skinstric | Sophisticated Skincare",
    template: "%s | Skinstric",
  },
  description:
    "Skinstric developed an A.I. that creates a highly-personalised routine tailored to what your skin needs.",
  keywords: ["skincare", "AI skincare", "personalised routine", "skin analysis", "beauty tech"],
  authors: [{ name: "Skinstric" }],
  creator: "Skinstric",

  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Skinstric",
    title: "Skinstric | Sophisticated Skincare",
    description:
      "An A.I. that creates a highly-personalised skincare routine tailored to what your skin needs.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Skinstric — Sophisticated Skincare A.I.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Skinstric | Sophisticated Skincare",
    description:
      "An A.I. that creates a highly-personalised skincare routine tailored to what your skin needs.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
