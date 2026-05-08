import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = process.cwd();
const preferred = join(root, "public/branding/favicon-source.png");
const fallback = join(root, "public/branding/sunlumi-logo-transparent.png");
const src = existsSync(preferred) ? preferred : fallback;

/** 탭 배경 — 메인 바디 톤과 맞춤 */
const bg = { r: 250, g: 250, b: 248, alpha: 1 };

/** 투명 여백 제거 후 정사각 안에 가운데 맞춤(contain) — 잘림 없음 */
async function preparedPipeline() {
  let img = sharp(src);
  try {
    img = img.trim({
      threshold: 8,
      lineArt: false,
    });
  } catch {
    /* trim 불가 시 원본 사용 */
  }
  return img;
}

async function square(px, filename) {
  const base = await preparedPipeline();
  await base
    .clone()
    .resize(px, px, {
      fit: "contain",
      background: bg,
      position: "center",
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toFile(join(root, "public", filename));
}

await square(16, "favicon-16.png");
await square(32, "favicon-32.png");
await square(48, "favicon-48.png");
await square(64, "favicon-64.png");
await square(180, "apple-touch-icon.png");

const icoBuf = await pngToIco([
  join(root, "public/favicon-16.png"),
  join(root, "public/favicon-32.png"),
  join(root, "public/favicon-48.png"),
  join(root, "public/favicon-64.png"),
]);
writeFileSync(join(root, "public/favicon.ico"), icoBuf);
