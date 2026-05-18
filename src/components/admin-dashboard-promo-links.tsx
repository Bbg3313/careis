"use client";

import Link from "next/link";

import { PromoReferralLinkCopy } from "@/components/promo-referral-link-copy";
import { formatCurrency } from "@/lib/utils";

type Row = {
  id: string;
  code: string;
  title: string;
  isActive: boolean;
  paidCount: number;
  totalPaidAmount: number;
};

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
      <table className="w-full min-w-[900px] border-collapse text-left text-sm text-stone-800">
        <thead className="bg-[#faf8f5] text-xs text-stone-600">
          <tr>
            <th className="align-middle px-5 py-3 font-medium">코드</th>
            <th className="align-middle px-5 py-3 font-medium">제목</th>
            <th className="align-middle px-5 py-3 font-medium">활성</th>
            <th className="align-middle px-5 py-3 font-medium">유입 링크</th>
            <th className="align-middle px-5 py-3 font-medium">결제완료</th>
            <th className="align-middle px-5 py-3 text-right font-medium">총액</th>
            <th className="align-middle px-5 py-3 font-medium">상세</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} className="border-t border-stone-100">
              <td className="align-top whitespace-nowrap px-5 py-3 font-mono text-stone-900">
                <Link href={`/admin/promos/${encodeURIComponent(c.id)}`} className="text-[#8b673f] hover:underline">
                  {c.code}
                </Link>
              </td>
              <td className="align-top px-5 py-3">
                <span className="line-clamp-2 max-w-[220px] text-stone-700">{c.title}</span>
              </td>
              <td className="align-top whitespace-nowrap px-5 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    c.isActive ? "bg-emerald-100 text-emerald-900" : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {c.isActive ? "ON" : "OFF"}
                </span>
              </td>
              <td className="align-top px-5 py-3">
                <div className="min-w-[200px] max-w-[320px]">
                  <PromoReferralLinkCopy baseUrlFromEnv={baseUrlFromEnv} code={c.code} compact />
                </div>
              </td>
              <td className="align-top whitespace-nowrap px-5 py-3 tabular-nums text-stone-800">{c.paidCount}건</td>
              <td className="align-top whitespace-nowrap px-5 py-3 text-right tabular-nums text-stone-800">{formatCurrency(c.totalPaidAmount)}</td>
              <td className="align-top whitespace-nowrap px-5 py-3">
                <Link href={`/admin/promos/${encodeURIComponent(c.id)}`} className="font-medium text-[#8b673f] hover:underline">
                  목록
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
