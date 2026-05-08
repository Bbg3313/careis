import { AdminDbUnavailableNotice } from "@/components/admin-db-unavailable";
import { ProductDetailSlidesAdmin } from "@/components/product-detail-slides-admin";
import { listDetailSlidesAdmin } from "@/lib/product-detail-slides";

export const dynamic = "force-dynamic";

function rowFromSlide(s: {
  id: string;
  productSlug: string;
  sortOrder: number;
  url: string;
  width: number;
  height: number;
  mimeType: string;
  posterUrl: string | null;
}) {
  return {
    id: s.id,
    productSlug: s.productSlug,
    sortOrder: s.sortOrder,
    url: s.url,
    width: s.width,
    height: s.height,
    mimeType: s.mimeType,
    posterUrl: s.posterUrl,
  };
}

export default async function AdminProductDetailPage() {
  let sunPack: Awaited<ReturnType<typeof listDetailSlidesAdmin>> = [];
  let illuminator: Awaited<ReturnType<typeof listDetailSlidesAdmin>> = [];
  let dbOk = true;
  try {
    [sunPack, illuminator] = await Promise.all([
      listDetailSlidesAdmin("sun-pack"),
      listDetailSlidesAdmin("illuminator"),
    ]);
  } catch (error) {
    console.error("[admin product-detail] list slides failed", error);
    dbOk = false;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">상품 상세 이미지</h1>
        <p className="mt-1 text-sm text-stone-500">
          관리자에서 JPG · PNG · GIF 를 올리면 상품 상세 세로 스토리 영역에 반영됩니다.
        </p>
      </div>

      {!dbOk ? <AdminDbUnavailableNotice /> : null}

      <ProductDetailSlidesAdmin
        initialBySlug={{
          "sun-pack": sunPack.map(rowFromSlide),
          illuminator: illuminator.map(rowFromSlide),
        }}
      />
    </div>
  );
}
