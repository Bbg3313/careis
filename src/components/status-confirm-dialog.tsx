"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  open: boolean;
  title: string;
  message: string;
  /** URL에서 제거할 쿼리 키 (예: ok, cancelOk) */
  clearParam?: string;
  confirmLabel?: string;
};

export function StatusConfirmDialog({
  open: openProp,
  title,
  message,
  clearParam,
  confirmLabel = "확인",
}: Props) {
  const [open, setOpen] = useState(openProp);
  const titleId = useId();
  const descId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setOpen(openProp);
  }, [openProp]);

  const close = useCallback(() => {
    setOpen(false);
    if (!clearParam) return;
    const next = new URLSearchParams(searchParams.toString());
    if (!next.has(clearParam)) return;
    next.delete(clearParam);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [clearParam, pathname, router, searchParams]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/45"
        aria-label="닫기"
        onClick={close}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-[1] w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_24px_80px_rgba(30,24,18,0.22)]"
      >
        <p id={titleId} className="text-lg font-semibold text-stone-900">
          {title}
        </p>
        <p id={descId} className="mt-3 text-sm leading-6 text-stone-600">
          {message}
        </p>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={close}
            className="btn-luxe-primary w-full rounded-full px-6 py-3 text-sm font-semibold sm:w-auto"
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
