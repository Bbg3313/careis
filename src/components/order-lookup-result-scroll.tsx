"use client";

import { useEffect } from "react";

/** 조회 결과가 있으면 모바일에서 바로 보이도록 스크롤 */
export function OrderLookupResultScroll({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;
    const el = document.getElementById("lookup-result");
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [active]);

  return null;
}
