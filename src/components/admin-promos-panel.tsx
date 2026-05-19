"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  formatPromoDateTimeKoNoSeconds,
  localDateAndHourToDatetimeLocal,
  toLocalDateInputValue,
} from "@/lib/admin-promo-datetime";
import { PromoReferralLinkCopy } from "@/components/promo-referral-link-copy";
import { formatCurrency } from "@/lib/utils";

const PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

type Campaign = {
  id: string;
  code: string;
  title: string;
  discountType: "PERCENT" | "FIXED_PER_UNIT";
  discountValue: number;
  productSlugs: unknown;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  paidCount: number;
  totalPaidAmount: number;
};

const PRODUCT_SLUG_LABEL_KO: Record<string, string> = {
  "sun-pack": "썬팩",
  illuminator: "일루미네이터",
};

function formatProductSlugsKo(slugs: unknown): string {
  if (!Array.isArray(slugs)) return "—";
  const parts = slugs
    .filter((s): s is string => s === "sun-pack" || s === "illuminator")
    .map((s) => PRODUCT_SLUG_LABEL_KO[s] ?? s);
  return parts.length > 0 ? parts.join(", ") : "—";
}

export function AdminPromosPanel() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/promos");
      const data = (await res.json()) as {
        ok?: boolean;
        campaigns?: (Campaign & { paidCount?: number; totalPaidAmount?: number })[];
        error?: string;
      };
      if (!res.ok || !data.ok || !data.campaigns) {
        throw new Error(data.error ?? "목록을 불러오지 못했습니다.");
      }
      setCampaigns(
        data.campaigns.map((row) => ({
          ...row,
          paidCount: row.paidCount ?? 0,
          totalPaidAmount: row.totalPaidAmount ?? 0,
        })),
      );
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "목록을 불러오지 못했습니다.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleActive(c: Campaign) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/promos/${encodeURIComponent(c.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "저장 실패");
      }
      await load();
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  }

  async function onCreate(formData: FormData) {
    setFormError(null);
    setSaving(true);
    try {
      const startsAt = localDateAndHourToDatetimeLocal(
        String(formData.get("startsDate") ?? ""),
        String(formData.get("startsHour") ?? ""),
      );
      const endsAt = localDateAndHourToDatetimeLocal(
        String(formData.get("endsDate") ?? ""),
        String(formData.get("endsHour") ?? ""),
      );
      if (!startsAt || !endsAt) {
        throw new Error("시작·종료 날짜와 시각을 확인해 주세요.");
      }

      const body = {
        code: String(formData.get("code") ?? "").trim(),
        title: String(formData.get("title") ?? "").trim(),
        discountType: String(formData.get("discountType") ?? "PERCENT"),
        discountValue: Number(formData.get("discountValue") ?? 0),
        productSlugs: ["sun-pack", "illuminator"].filter((slug) => formData.get(`p_${slug}`) === "on"),
        startsAt,
        endsAt,
        isActive: formData.get("isActive") === "on",
      };

      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "생성 실패");
      }
      (document.getElementById("promo-create-form") as HTMLFormElement | null)?.reset();
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "생성 실패");
    } finally {
      setSaving(false);
    }
  }

  const nowLocal = new Date();
  const startHour = new Date(nowLocal);
  startHour.setMinutes(0, 0, 0);
  startHour.setMilliseconds(0);
  const defaultStartDate = toLocalDateInputValue(startHour);
  const defaultStartHour = String(startHour.getHours());
  const endHour = new Date(startHour);
  endHour.setDate(endHour.getDate() + 14);
  const defaultEndDate = toLocalDateInputValue(endHour);
  const defaultEndHour = String(endHour.getHours());

  return (
    <div className="space-y-10">
      {loadError ? <p className="text-sm text-red-600">{loadError}</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="min-w-[920px] w-full text-left text-[13px] text-stone-700">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-stone-500">코드</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-stone-500">제목</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-stone-500">할인</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-stone-500">상품</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-stone-500">기간</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-stone-500">유입 링크</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-stone-500">실적</th>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-stone-500">활성</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-b border-stone-100 last:border-0">
                <td className="px-3 py-2.5 align-middle font-mono text-[13px] text-stone-700">{c.code}</td>
                <td className="px-3 py-2.5 align-middle text-[13px] text-stone-700">{c.title}</td>
                <td className="px-3 py-2.5 align-middle tabular-nums text-[13px] text-stone-700">
                  {c.discountType === "PERCENT" ? `${c.discountValue}%` : `${formatCurrency(c.discountValue)} /개`}
                </td>
                <td className="px-3 py-2.5 align-middle text-[13px] text-stone-700">{formatProductSlugsKo(c.productSlugs)}</td>
                <td className="px-3 py-2.5 align-middle text-[13px] leading-snug text-stone-700">
                  {formatPromoDateTimeKoNoSeconds(c.startsAt)} ~ {formatPromoDateTimeKoNoSeconds(c.endsAt)}
                </td>
                <td className="max-w-[11rem] px-3 py-2.5 align-middle">
                  <PromoReferralLinkCopy baseUrlFromEnv={PUBLIC_SITE_URL} code={c.code} compact />
                </td>
                <td className="px-3 py-2.5 align-middle">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] text-stone-700">
                    <span className="whitespace-nowrap tabular-nums">결제 {c.paidCount}건</span>
                    <span className="text-stone-400" aria-hidden>
                      ·
                    </span>
                    <span className="whitespace-nowrap tabular-nums">{formatCurrency(c.totalPaidAmount)}</span>
                    <Link
                      href={`/admin/promos/${encodeURIComponent(c.id)}`}
                      className="whitespace-nowrap text-[11px] font-medium text-[#8b673f] underline-offset-2 hover:underline"
                    >
                      상세
                    </Link>
                  </div>
                </td>
                <td className="px-3 py-2.5 align-middle">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={c.isActive}
                    aria-label={`${c.title} (${c.code}) ${c.isActive ? "비활성화" : "활성화"}`}
                    disabled={saving}
                    onClick={() => void toggleActive(c)}
                    className={`flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 ${
                      c.isActive ? "justify-end bg-emerald-500" : "justify-start bg-stone-300"
                    } ${saving ? "cursor-wait opacity-50" : ""}`}
                  >
                    <span className="pointer-events-none h-6 w-6 rounded-full bg-white shadow-sm ring-1 ring-black/5" />
                  </button>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-[13px] text-stone-700">
                  등록된 공구가 없습니다. 아래에서 새로 만듭니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">프로모션 생성</h2>
        <p className="mt-2 text-sm text-stone-600">
          코드는 URL <span className="font-mono text-stone-800">?ref=코드</span> 또는 주문서 쿠폰란과 동일하게 소문자로 매칭됩니다.
          쿠폰 입력이 있으면 레퍼럴보다 우선 적용됩니다.
        </p>

        <form
          id="promo-create-form"
          className="mt-6 grid gap-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            void onCreate(new FormData(e.currentTarget));
          }}
        >
          <label className="space-y-1 text-sm text-stone-700 md:col-span-2">
            <span>코드</span>
            <input name="code" required className="w-full rounded-xl border border-stone-200 px-3 py-2 font-mono" placeholder="influ_a_may" />
          </label>
          <label className="space-y-1 text-sm text-stone-700 md:col-span-2">
            <span>제목 (내부용)</span>
            <input name="title" required className="w-full rounded-xl border border-stone-200 px-3 py-2" placeholder="인플루A 5월 공구" />
          </label>
          <label className="space-y-1 text-sm text-stone-700">
            <span>할인 유형</span>
            <select name="discountType" className="w-full rounded-xl border border-stone-200 px-3 py-2">
              <option value="PERCENT">정률 (%)</option>
              <option value="FIXED_PER_UNIT">정액 (원/1개)</option>
            </select>
          </label>
          <label className="space-y-1 text-sm text-stone-700">
            <span>할인 값</span>
            <input name="discountValue" type="number" required min={1} className="w-full rounded-xl border border-stone-200 px-3 py-2" placeholder="10" />
          </label>
          <fieldset className="md:col-span-2">
            <legend className="text-sm text-stone-700">적용 상품</legend>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="p_sun-pack" defaultChecked />
                선팩
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="p_illuminator" defaultChecked />
                일루미네이터
              </label>
            </div>
          </fieldset>
          <div className="space-y-1 text-sm text-stone-700">
            <span>시작 (현지)</span>
            <div className="flex flex-wrap gap-2">
              <input
                name="startsDate"
                type="date"
                required
                defaultValue={defaultStartDate}
                className="min-w-0 flex-1 rounded-xl border border-stone-200 px-3 py-2"
              />
              <select
                name="startsHour"
                required
                defaultValue={defaultStartHour}
                className="w-full min-w-[7.5rem] rounded-xl border border-stone-200 px-3 py-2 sm:w-auto"
                aria-label="시작 시각(시)"
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <option key={h} value={String(h)}>
                    {String(h).padStart(2, "0")}시 (정각)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1 text-sm text-stone-700">
            <span>종료 (현지)</span>
            <div className="flex flex-wrap gap-2">
              <input
                name="endsDate"
                type="date"
                required
                defaultValue={defaultEndDate}
                className="min-w-0 flex-1 rounded-xl border border-stone-200 px-3 py-2"
              />
              <select
                name="endsHour"
                required
                defaultValue={defaultEndHour}
                className="w-full min-w-[7.5rem] rounded-xl border border-stone-200 px-3 py-2 sm:w-auto"
                aria-label="종료 시각(시)"
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <option key={h} value={String(h)}>
                    {String(h).padStart(2, "0")}시 (정각)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-stone-500 md:col-span-2">시간은 시 단위(정각)만 선택됩니다.</p>
          <label className="flex items-center gap-2 text-sm text-stone-700 md:col-span-2">
            <input type="checkbox" name="isActive" defaultChecked />
            생성 즉시 활성
          </label>
          {formError ? <p className="text-sm text-red-600 md:col-span-2">{formError}</p> : null}
          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "처리 중…" : "프로모션 생성"}
          </button>
        </form>
      </div>
    </div>
  );
}
