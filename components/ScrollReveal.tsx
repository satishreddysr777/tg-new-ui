"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds the `in` class to `.reveal` elements as they scroll into view,
 * mirroring the behavior of the original tg.js. Re-runs on route change
 * so freshly mounted sections animate too.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal")
    );
    if (!reveals.length) return;

    if (!("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    reveals.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
