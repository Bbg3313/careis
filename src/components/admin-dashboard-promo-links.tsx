"use client";

import Link from "next/link";

import { PromoReferralLinkCopy } from "@/components/promo-referral-link-copy";

type Row = { id: string; code: string; title: string; isActive: boolean };

export function AdminDashboardPromoLinks({ baseUrlFromEnv, campaigns }: { baseUrlFromEnv: string; campaigns: Row[] }) {
  if (campaigns.length === 0) {
    return (
      <p className="text-sm text-stone-500">
        등록된 공구가 없습니다.{" "}
        <Link href="/admin/promos" className="font-medium text-[#8b673f] underline underline-offset-2">
          공구캠페인
        </Link>
        에서 만드세요.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[#faf8f5] text-xs text-stone-600">
          <tr>
            <th className="px-5 py-3 font-medium">코드</th>
            <th className="px-5 py-3 font-medium">제목</th>
            <th className="px-5 py-3 font-medium">활성</th>
            <th className="px-5 py-3 font-medium">유입 링크</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} className="border-t border-stone-100">
              <td className="whitespace-nowrap px-5 py-3 font-mono text-stone-900">{c.code}</td>
              <td className="max-w-[200px] px-5 py-3 text-stone-700">
                <span className="line-clamp-2">{c.title}</span>
              </td>
              <td className="whitespace-nowrap px-5 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    c.isActive ? "bg-emerald-100 text-emerald-900" : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {c.isActive ? "ON" : "OFF"}
                </span>
              </td>
              <td className="min-w-[200px] px-5 py-3">
                <PromoReferralLinkCopy baseUrlFromEnv={baseUrlFromEnv} code={c.code} compact />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
