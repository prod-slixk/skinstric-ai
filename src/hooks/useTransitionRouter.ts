"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

/**
 * Drop-in replacement for useRouter().push that plays an exit
 * animation on #page-root before navigating.
 */
export function useTransitionRouter() {
  const router = useRouter();

  const push = useCallback(
    (href: string) => {
      const page = document.getElementById("page-root");
      if (!page) { router.push(href); return; }

      gsap.to(page, {
        opacity: 0,
        y: -14,
        duration: 0.32,
        ease: "power2.in",
        onComplete: () => router.push(href),
      });
    },
    [router]
  );

  return { push };
}
