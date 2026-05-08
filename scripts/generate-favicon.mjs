import { copyFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = process.cwd();
const svgMark = join(root, "public/branding/favicon-sun-moon.svg");
const pngPreferred = join(root, "public/branding/favicon-source.png");
const pngFallback = join(root, "public/branding/sunlumi-logo-transparent.png");

/** 탭/타일 배경 — 사이트 바디 톤 */
const bg = { r: 250, g: 250, b: 248, alpha: 1 };

function useSvgSource() {
  return existsSync(svgMark);
}

function usePngSource() {
  return existsSync(pngPreferred);
}

/** SVG → PNG (SVG 마크가 있을 때만) */
async function squareFromSvg(px, filename) {
  const buf = readFileSync(svgMark);
  await sharp(buf)
    .resize(px, px, {
      fit: "contain",
      background: { r: 26, g: 33, b: 48, alpha: 1 },
      position: "centre",
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toFile(join(root, "public", filename));
}

/** 마스터 PNG: 트림 후 정사각 contain */
async function preparedPngPipeline() {
  const src = usePngSource() ? pngPreferred : pngFallback;
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
  if (usePngSource()) await squareFromPng(px, filename);
  else if (useSvgSource()) await squareFromSvg(px, filename);
  else await squareFromPng(px, filename);
}

await square(16, "favicon-16.png");
await square(32, "favicon-32.png");
await square(48, "favicon-48.png");
await square(64, "favicon-64.png");
await square(180, "apple-touch-icon.png");

const iconSvgPublic = join(root, "public/icon.svg");
if (useSvgSource() && !usePngSource()) {
  copyFileSync(svgMark, iconSvgPublic);
} else if (existsSync(iconSvgPublic)) {
  unlinkSync(iconSvgPublic);
}

const icoBuf = await pngToIco([
  join(root, "public/favicon-16.png"),
  join(root, "public/favicon-32.png"),
  join(root, "public/favicon-48.png"),
  join(root, "public/favicon-64.png"),
]);
writeFileSync(join(root, "public/favicon.ico"), icoBuf);
