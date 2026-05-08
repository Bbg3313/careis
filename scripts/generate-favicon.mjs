import { copyFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = process.cwd();
const svgSunMoon = join(root, "public/branding/favicon-sun-moon.svg");
const pngPreferred = join(root, "public/branding/favicon-source.png");
const pngFallback = join(root, "public/branding/sunlumi-logo-transparent.png");

/** 탭 배경 — 메인 바디 톤과 맞춤 (PNG 폴백용) */
const bg = { r: 250, g: 250, b: 248, alpha: 1 };

function useSvgSource() {
  return existsSync(svgSunMoon);
}

/** SVG → PNG (정사각 타일, 배경색 메탈과 동일) */
async function squareFromSvg(px, filename) {
  const buf = readFileSync(svgSunMoon);
  await sharp(buf)
    .resize(px, px, {
      fit: "contain",
      background: { r: 250, g: 248, b: 245, alpha: 1 },
      position: "centre",
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toFile(join(root, "public", filename));
}

/** 투명 여백 제거 후 정사각 안에 가운데 맞춤(contain) — 레거시 PNG 소스 */
async function preparedPngPipeline() {
  const src = existsSync(pngPreferred) ? pngPreferred : pngFallback;
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

async function squareFromPng(px, filename) {
  const base = await preparedPngPipeline();
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

async function square(px, filename) {
  if (useSvgSource()) await squareFromSvg(px, filename);
  else await squareFromPng(px, filename);
}

await square(16, "favicon-16.png");
await square(32, "favicon-32.png");
await square(48, "favicon-48.png");
await square(64, "favicon-64.png");
await square(180, "apple-touch-icon.png");

if (useSvgSource()) {
  copyFileSync(svgSunMoon, join(root, "public/icon.svg"));
}

const icoBuf = await pngToIco([
  join(root, "public/favicon-16.png"),
  join(root, "public/favicon-32.png"),
  join(root, "public/favicon-48.png"),
  join(root, "public/favicon-64.png"),
]);
writeFileSync(join(root, "public/favicon.ico"), icoBuf);
