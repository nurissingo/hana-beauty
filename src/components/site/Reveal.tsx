"use client";

import { useEffect } from "react";

function isNearViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  // Generous window so first paint / small scrolls never leave blank holes
  return rect.top < vh + 160 && rect.bottom > -80;
}

export function RevealObserver() {
  useEffect(() => {
    const reveal = (el: Element) => el.classList.add("in");

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "180px 0px 180px 0px", threshold: 0 },
    );

    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => {
        if (isNearViewport(el)) {
          reveal(el);
          io.unobserve(el);
        } else {
          io.observe(el);
        }
      });
    };

    scan();
    requestAnimationFrame(scan);
    window.addEventListener("scroll", scan, { passive: true });
    window.addEventListener("resize", scan, { passive: true });

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", scan);
      window.removeEventListener("resize", scan);
    };
  }, []);

  return null;
}
