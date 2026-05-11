"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ScrollToTopButton() {
  const pathname = usePathname();
  const productDetailSticky =
    pathname != null && /^\/products\/[^/]+$/.test(pathname);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 320);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="맨 위로 가기"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(116,88,59,0.14)] bg-white/88 text-stone-900 shadow-[0_18px_40px_rgba(30,24,18,0.12)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white ${
        productDetailSticky
          ? "bottom-24 right-5 sm:right-6 md:bottom-[6.85rem] lg:bottom-6 lg:md:bottom-8 lg:md:right-8"
          : "bottom-6 right-6 md:bottom-8 md:right-8"
      } ${
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 14.5V3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4.5 8L9 3.5L13.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
