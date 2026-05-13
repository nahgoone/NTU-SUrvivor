// app/components/dashboard/useStickyDashboard.ts

import { useEffect, useRef, useState } from "react";

export function useStickyDashboard<T extends HTMLElement>(showOffsetPx = 80) {
  const targetRef = useRef<T | null>(null);
  const [showStickyDashboard, setShowStickyDashboard] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const targetElement = targetRef.current;

      if (!targetElement) return;

      const targetBottom = targetElement.getBoundingClientRect().bottom;

      setShowStickyDashboard(targetBottom <= showOffsetPx);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [showOffsetPx]);

  return {
    targetRef,
    showStickyDashboard,
  };
}
