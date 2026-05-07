"use client";

import { useCallback, useEffect, useState } from "react";

const TABS = [
  { id: "detail", label: "제품상세" },
  { id: "guide", label: "상품구매안내" },
  { id: "review", label: "리뷰" },
  { id: "qa", label: "Q&A" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SunPackDetailTabs() {
  const [active, setActive] = useState<TabId>("detail");

  const syncActiveFromScroll = useCallback(() => {
    const offset = 140;
    let current: TabId = "detail";
    for (const { id } of TABS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= offset) {
        current = id;
      }
    }
    setActive(current);
  }, []);

  useEffect(() => {
    syncActiveFromScroll();
    window.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    window.addEventListener("resize", syncActiveFromScroll);
    return () => {
      window.removeEventListener("scroll", syncActiveFromScroll);
      window.removeEventListener("resize", syncActiveFromScroll);
    };
  }, [syncActiveFromScroll]);

  function go(id: TabId) {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  }

  return (
    <nav className="sticky top-[72px] z-20 border-b border-stone-200 bg-[#fafaf8] py-3 md:py-4">
      <div className="flex w-full overflow-hidden rounded-[6px] border border-stone-300 bg-white shadow-sm">
        {TABS.map((tab, index) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => go(tab.id)}
              className={`relative min-h-[52px] flex-1 px-2 py-4 text-center text-[13px] font-semibold leading-tight transition md:min-h-[58px] md:px-4 md:text-[15px] lg:text-base ${
                isActive ? "bg-[#1f1f1f] text-white" : "bg-white text-stone-900 hover:bg-stone-50"
              } ${index > 0 ? "border-l border-stone-300" : ""}`}
            >
              <span className="inline-block max-w-[8em] md:max-w-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
