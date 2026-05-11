"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { readImageNaturalSize, resolveUploadMimeFromFile } from "@/lib/image-mime-web";
import type { ProductSlug } from "@/lib/product-data";

const STORAGE_BUCKET = "product-detail";

async function parseResponseJson(res: Response): Promise<Record<string, unknown>> {
  try {
    const text = await res.text();
    return text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export type AdminDetailSlideRow = {
  id: string;
  productSlug: string;
  sortOrder: number;
  url: string;
  width: number;
  height: number;
  mimeType: string;
  posterUrl: string | null;
  body: string | null;
};

function DetailSlideBodyEditor({
  slide,
  disabled,
  saving,
  onSave,
}: {
  slide: AdminDetailSlideRow;
  disabled: boolean;
  saving: boolean;
  onSave: (body: string | null) => Promise<void>;
}) {
  const [value, setValue] = useState(slide.body ?? "");
  useEffect(() => {
    setValue(slide.body ?? "");
  }, [slide.id, slide.body]);

  return (
    <div className="space-y-2 border-t border-stone-100 pt-3">
      <label className="block text-xs font-medium text-stone-600">
        제품상세 스토리에서 이 컷 바로 아래에 붙는 문단 (빈 줄 한 번 = 문단 구분, 비우면 표시 안 함)
      </label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={5}
        disabled={disabled || saving}
        className="min-h-[5.5rem] w-full rounded-lg border border-stone-200 bg-white px-3 py-2 font-sans text-sm leading-relaxed text-stone-800 placeholder:text-stone-400 disabled:opacity-50"
        placeholder={"첫 문단\n\n둘째 문단"}
      />
      <button
        type="button"
        disabled={disabled || saving}
        onClick={() => void onSave(value.trim() === "" ? null : value)}
        className="rounded-lg border border-stone-900 bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 disabled:opacity-40"
      >
        {saving ? "저장 중…" : "본문 저장"}
      </button>
    </div>
  );
}

export function ProductDetailSlidesAdmin({
  initialBySlug,
  supabaseUrl = null,
  supabaseAnonKey = null,
}: {
  initialBySlug: Record<ProductSlug, AdminDetailSlideRow[]>;
  supabaseUrl?: string | null;
  supabaseAnonKey?: string | null;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState<ProductSlug>("sun-pack");
  const slides = initialBySlug[slug];
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [savingBodyId, setSavingBodyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setMsg(null);

    const list = Array.from(files);
    const useDirectUpload = Boolean(supabaseUrl?.trim() && supabaseAnonKey?.trim());

    if (useDirectUpload) {
      let okCount = 0;
      try {
        const sb = createSupabaseBrowser(supabaseUrl!.trim(), supabaseAnonKey!.trim());
        for (const file of list) {
          const mimeType = await resolveUploadMimeFromFile(file);
          if (mimeType !== "image/jpeg" && mimeType !== "image/png" && mimeType !== "image/gif") {
            setMsg("허용되는 형식은 JPG, PNG, GIF 입니다.");
            setBusy(false);
            return;
          }

          const signRes = await fetch("/api/admin/product-detail/sign-upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, mimeType }),
          });
          const signData = (await parseResponseJson(signRes)) as {
            ok?: boolean;
            error?: string;
            signedUrl?: string;
            token?: string;
            path?: string;
          };
          if (!signRes.ok || !signData.ok || !signData.token || !signData.path) {
            setMsg(
              typeof signData.error === "string"
                ? signData.error
                : `서명 URL 실패 (HTTP ${signRes.status})`,
            );
            setBusy(false);
            return;
          }

          const { error: upErr } = await sb.storage.from(STORAGE_BUCKET).uploadToSignedUrl(signData.path, signData.token, file, {
            contentType: mimeType,
            upsert: false,
          });
          if (upErr) {
            setMsg(`스토리지 업로드 실패: ${upErr.message}`);
            setBusy(false);
            return;
          }

          let width = 1;
          let height = 1;
          try {
            const dims = await readImageNaturalSize(file);
            width = dims.width;
            height = dims.height;
          } catch {
            setMsg("이미지 가로·세로를 읽지 못했습니다. 다른 파일로 시도해 주세요.");
            setBusy(false);
            return;
          }

          const finRes = await fetch("/api/admin/product-detail/finalize-upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug,
              path: signData.path,
              mimeType,
              width,
              height,
            }),
          });
          const finData = (await parseResponseJson(finRes)) as { ok?: boolean; error?: string };
          if (!finRes.ok || !finData.ok) {
            setMsg(typeof finData.error === "string" ? finData.error : `DB 반영 실패 (HTTP ${finRes.status})`);
            setBusy(false);
            return;
          }
          okCount += 1;
        }
        setMsg(`${okCount}개 업로드되었습니다.`);
        router.refresh();
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "업로드 처리 중 오류가 났습니다.");
      } finally {
        setBusy(false);
      }
      return;
    }

    const fd = new FormData();
    fd.append("slug", slug);
    for (let i = 0; i < list.length; i++) {
      fd.append("files", list[i]!);
    }
    const res = await fetch("/api/admin/product-detail/upload", { method: "POST", body: fd });
    const data = (await parseResponseJson(res)) as { error?: string; slides?: unknown[] };
    setBusy(false);
    if (!res.ok) {
      if (res.status === 413) {
        setMsg(
          "업로드 용량 제한(약 4.5MB)에 걸렸습니다. Supabase URL/Anon 키가 페이지에 전달되면 대용량은 브라우저→스토리지 직접 업로드로 우회합니다.",
        );
        return;
      }
      setMsg(typeof data.error === "string" ? data.error : `업로드 실패 (HTTP ${res.status})`);
      return;
    }
    setMsg(`${(data.slides as unknown[] | undefined)?.length ?? 0}개 업로드되었습니다.`);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("이 이미지를 삭제할까요? 스토리지 파일도 함께 삭제됩니다.")) return;
    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/admin/product-detail/slide/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setMsg(data.error ?? "삭제 실패");
      return;
    }
    router.refresh();
  }

  async function saveSlideBody(id: string, body: string | null) {
    setSavingBodyId(id);
    setMsg(null);
    const res = await fetch(`/api/admin/product-detail/slide/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const data = (await parseResponseJson(res)) as { ok?: boolean; error?: string };
    setSavingBodyId(null);
    if (!res.ok || !data.ok) {
      setMsg(typeof data.error === "string" ? data.error : `저장 실패 (HTTP ${res.status})`);
      return;
    }
    setMsg("본문이 저장되었습니다.");
    router.refresh();
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = slides.findIndex((s) => s.id === id);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= slides.length) return;
    const orderedIds = slides.map((s) => s.id);
    const t = orderedIds[idx];
    orderedIds[idx] = orderedIds[j];
    orderedIds[j] = t;
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/product-detail/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, orderedIds }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setMsg(data.error ?? "순서 변경 실패");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
        {(["sun-pack", "illuminator"] as const).map((s) => (
          <button
            key={s}
            type="button"
            disabled={busy}
            onClick={() => {
              setSlug(s);
              setMsg(null);
            }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              slug === s ? "bg-[#b89156] text-white" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            {s === "sun-pack" ? "선팩" : "일루미네이터"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
        <p>
          이 목록에 이미지가 <strong>하나라도</strong> 있으면 쇼핑몰 상세는 <strong>업로드한 순서대로만</strong> 표시합니다.
          비어 있으면 선팩은 코드에 넣어 둔 기본 컷을 사용합니다.
        </p>
        <p className="mt-2 text-xs text-amber-900/80">
          Supabase 배포 시 공개 버킷 <code className="rounded bg-white/70 px-1">product-detail</code> ·{" "}
          <code className="rounded bg-white/70 px-1">SUPABASE_SERVICE_ROLE_KEY</code> · 브라우저용{" "}
          <code className="rounded bg-white/70 px-1">NEXT_PUBLIC_SUPABASE_*</code> 가 있으면, 큰 GIF도 Vercel 용량 제한 없이
          스토리지로 직접 올라갑니다. (키가 없으면 서버 경유 업로드, 로컬 폴더 저장은 개발용)
        </p>
      </div>

      {msg ? (
        <p
          className={`text-sm ${
            msg.includes("실패") || msg.includes("제한") || msg.includes("HTTP") || msg.includes("오류")
              ? "text-red-600"
              : "text-emerald-700"
          }`}
        >
          {msg}
        </p>
      ) : null}

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-900">업로드</h2>
        <p className="mt-1 text-xs text-stone-500">JPG, PNG, GIF · 여러 장 선택 가능 · 파일당 최대 15MB</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,.jpg,.jpeg,.png,.gif"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              void upload(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
          >
            파일 선택
          </button>
          {busy ? <span className="text-sm text-stone-500">처리 중…</span> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-stone-900">현재 순서 ({slides.length}장)</h2>
        </div>
        {slides.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-stone-500">등록된 이미지가 없습니다.</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {slides.map((slide, index) => (
              <li key={slide.id} className="flex flex-col gap-4 px-5 py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.url} alt="" className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700">
                        #{index + 1}
                      </span>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                        {slide.mimeType.includes("gif") ? "GIF" : slide.mimeType.includes("png") ? "PNG" : "JPG"}
                      </span>
                      <span className="text-xs text-stone-400">
                        {slide.width}×{slide.height}px
                      </span>
                    </div>
                    <p className="truncate font-mono text-xs text-stone-500">{slide.url}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy || index === 0}
                      onClick={() => void move(slide.id, -1)}
                      className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium hover:bg-stone-50 disabled:opacity-40"
                    >
                      위로
                    </button>
                    <button
                      type="button"
                      disabled={busy || index === slides.length - 1}
                      onClick={() => void move(slide.id, 1)}
                      className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium hover:bg-stone-50 disabled:opacity-40"
                    >
                      아래로
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void remove(slide.id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <DetailSlideBodyEditor
                  slide={slide}
                  disabled={busy}
                  saving={savingBodyId === slide.id}
                  onSave={(body) => saveSlideBody(slide.id, body)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
