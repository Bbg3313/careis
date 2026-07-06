/**
 * Storage 파일이 없는 슬라이드 레코드 삭제 → 선팩은 public/images 폴백 사용
 */
import { PrismaClient } from "@prisma/client";

const NEW_DB =
  "postgresql://postgres.qzndymsotizutpffnyey:thrhrl92%21%21%21@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

const p = new PrismaClient({ datasources: { db: { url: NEW_DB } } });
try {
  const { count } = await p.productDetailSlide.deleteMany();
  console.log(`deleted ${count} slides — sun-pack은 site-assets 폴백, illuminator는 관리자 재업로드 필요`);
} finally {
  await p.$disconnect();
}
