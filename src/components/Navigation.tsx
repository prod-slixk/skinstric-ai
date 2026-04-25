"use client";

import Link from "next/link";

interface NavigationProps {
  section?: string;
  showEnterCode?: boolean;
}

export default function Navigation({
  section = "INTRO",
  showEnterCode = true,
}: NavigationProps) {
  return (
    <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 z-50">
      {/* Brand + section */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="text-[13px] font-semibold tracking-[0.12em] uppercase text-[#1a1a1a] hover:opacity-70 transition-opacity"
        >
          SKINSTRIC
        </Link>
        <span className="text-[13px] tracking-[0.1em] text-[#6b6b6b] font-light">
          [ {section} ]
        </span>
      </div>

      {/* Right side */}
      {showEnterCode && (
        <button className="px-4 py-[6px] bg-[#1a1a1a] text-white text-[11px] font-medium tracking-[0.14em] uppercase hover:bg-[#333] transition-colors">
          ENTER CODE
        </button>
      )}
    </nav>
  );
}
