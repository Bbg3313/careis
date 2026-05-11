import type { ReactNode } from "react";

export function DetailAccordionItem({
  title,
  summaryClassName = "text-lg font-semibold text-stone-900",
  children,
}: {
  title: string;
  summaryClassName?: string;
  children: ReactNode;
}) {
  return (
    <details className="group border-t border-stone-100 first:border-t-0 [&_summary::-webkit-details-marker]:hidden">
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg py-4 outline-none transition hover:text-stone-700 focus-visible:ring-2 focus-visible:ring-stone-400/50 focus-visible:ring-offset-2 ${summaryClassName}`}
      >
        <span>{title}</span>
        <span
          className="shrink-0 text-stone-400 transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </summary>
      <div className="border-t border-stone-100/80 pb-6 pt-2">{children}</div>
    </details>
  );
}
