"use client";
import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to a container element and adds
 * the "visible" class to every child that has a reveal class
 * (reveal | reveal-left | reveal-right | reveal-scale) once it enters
 * the viewport.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <div ref={ref}> ... children with className="reveal delay-200" ... </div>
 *
 * @param {number} threshold  – 0..1, fraction visible before triggering (default 0.12)
 * @param {string} rootMargin – e.g. "0px 0px -60px 0px"  (default "-40px")
 */
export function useScrollReveal(threshold = 0.12, rootMargin = "0px 0px -40px 0px") {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const selector = ".reveal, .reveal-left, .reveal-right, .reveal-scale";
    const items = container.querySelectorAll(selector);

    if (!items.length) return;

    // If user prefers reduced motion skip everything
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold, rootMargin }
    );

    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
