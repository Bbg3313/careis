import { copyFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = process.cwd();
const svgMark = join(root, "public/branding/favicon-sun-moon.svg");
const pngSlLogo = join(root, "public/branding/favicon-sl-logo.png");
const pngPreferred = join(root, "public/branding/favicon-source.png");
const pngFallback = join(root, "public/branding/sunlumi-logo-transparent.png");

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

function useSvgSource() {
  return existsSync(svgMark);
}

function useSlLogo() {
  return existsSync(pngSlLogo);
}

/** 우선순위: SL 마스터 → 기존 소스 PNG → 로고 PNG */
function faviconPngMasterPath() {
  if (useSlLogo()) return pngSlLogo;
  if (existsSync(pngPreferred)) return pngPreferred;
  return pngFallback;
}

/**
 * JPEG 등 불투명 마스터: 정사각 캔버스 모서리 체크 배경은 원 밖으로 간주해 투명 처리.
 * (중앙 원형 배지 에셋 전제 — 이미지 중심 기준)
 */
async function rasterMasterToSharp(srcPath) {
  const meta = await sharp(srcPath).metadata();

  if (meta.hasAlpha && meta.format === "png") {
    return sharp(srcPath).ensureAlpha();
  }

  if (meta.format === "jpeg" || (meta.channels === 3 && !meta.hasAlpha)) {
    const { data: rgb, info } = await sharp(srcPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const w = info.width;
    const h = info.height;
    const cx = (w - 1) / 2;
    const cy = (h - 1) / 2;
    const R = Math.min(w, h) * 0.36;

    const out = Buffer.alloc(w * h * 4);

    const insideCircle = (x, y) => {
      const dx = x - cx;
      const dy = y - cy;
      return dx * dx + dy * dy <= R * R;
    };

    const sample = (x, y) => {
      const si = (y * w + x) * 3;
      return {
        r: rgb[si],
        g: rgb[si + 1],
        b: rgb[si + 2],
        si,
      };
    };

    const metrics = (r, g, b) => {
      const maxc = Math.max(r, g, b);
      const minc = Math.min(r, g, b);
      const sat = maxc === 0 ? 0 : (maxc - minc) / maxc;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      return { sat, lum };
    };

    const preOpaque = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = y * w + x;
        if (!insideCircle(x, y)) continue;
        const dx = x - cx;
        const dy = y - cy;
        const distSq = dx * dx + dy * dy;
        const innerDiskR = Math.min(w, h) * 0.21;
        const innerDisk = distSq <= innerDiskR * innerDiskR;

        const { r, g, b } = sample(x, y);
        const { sat, lum } = metrics(r, g, b);
        const blackTile = sat < 0.15 && lum < 72;
        const bridgeGrey = lum > 128 && lum < 202 && sat < 0.078;
        const colored = sat > 0.13 || lum < 102;
        preOpaque[p] = blackTile || bridgeGrey || !(innerDisk || colored) ? 0 : 1;
      }
    }

    const seen = new Uint8Array(w * h);
    const q = [];
    let qt = 0;

    const trySeed = (x, y) => {
      if (x < 0 || x >= w || y < 0 || y >= h) return;
      const p = y * w + x;
      if (!preOpaque[p] || seen[p]) return;
      const { r, g, b } = sample(x, y);
      const { sat, lum } = metrics(r, g, b);
      const coloredSeed = (sat > 0.17 && lum > 92) || (lum < 112 && sat > 0.055);
      if (!coloredSeed) return;
      seen[p] = 1;
      q.push([x, y]);
    };

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        trySeed(x, y);
      }
    }

    if (q.length === 0) {
      trySeed(Math.round(cx), Math.round(cy));
    }

    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    while (qt < q.length) {
      const [x, y] = q[qt++];
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
        const np = ny * w + nx;
        if (!preOpaque[np] || seen[np]) continue;
        seen[np] = 1;
        q.push([nx, ny]);
      }
    }

    const innerCutoff = Math.min(w, h) * 0.245;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = y * w + x;
        if (!seen[p]) continue;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx, dy);
        const { r, g, b } = sample(x, y);
        const { lum, sat } = metrics(r, g, b);
        if (lum > 244 && sat < 0.052 && dist > innerCutoff) {
          seen[p] = 0;
        }
      }
    }

    let minX = w;
    let minY = h;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = y * w + x;
        const si = p * 3;
        const di = p * 4;
        out[di] = rgb[si];
        out[di + 1] = rgb[si + 1];
        out[di + 2] = rgb[si + 2];
        const visible = seen[p] === 1;
        out[di + 3] = visible ? 255 : 0;
        if (visible) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (maxX < minX) {
      return sharp(srcPath).ensureAlpha();
    }

    return sharp(out, { raw: { width: w, height: h, channels: 4 } }).extract({
      left: minX,
      top: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    });
  }

  return sharp(srcPath).ensureAlpha();
}

/** 투명 여백 제거 후 정사각 안에 최대 크기(contain)로 맞춤 */
async function preparedPngPipeline() {
  const path = faviconPngMasterPath();
  const raw = await rasterMasterToSharp(path);
  let trimmed = raw;
  try {
    const buf = await raw.clone().ensureAlpha().trim().png().toBuffer();
    trimmed = sharp(buf).ensureAlpha();
  } catch {
    trimmed = raw.clone().ensureAlpha();
  }
  return trimmed;
}

async function squareFromSvg(px, filename) {
  const buf = readFileSync(svgMark);
  await sharp(buf)
    .ensureAlpha()
    .resize(px, px, {
      fit: "contain",
      background: transparent,
      position: "centre",
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toFile(join(root, "public", filename));
}

/**
 * @param {{ softAlpha?: boolean }} opts SL 로고 등: 알파 이진화 생략(안티앨리어싱 유지)
 */
async function squareFromPng(px, filename, opts = {}) {
  const base = await preparedPngPipeline();
  const resized = base.clone().ensureAlpha().resize(px, px, {
    fit: "contain",
    background: transparent,
    position: "center",
    kernel: sharp.kernel.lanczos3,
  });

  if (opts.softAlpha) {
    await resized.png().toFile(join(root, "public", filename));
    return;
  }

  const { data, info } = await resized.raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) {
    const on = data[i] >= 130;
    data[i] = on ? 255 : 0;
    if (!on) {
      data[i - 3] = 0;
      data[i - 2] = 0;
      data[i - 1] = 0;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(join(root, "public", filename));
}

async function square(px, filename) {
  if (useSlLogo()) {
    await squareFromPng(px, filename, { softAlpha: true });
    return;
  }
  if (useSvgSource()) await squareFromSvg(px, filename);
  else await squareFromPng(px, filename);
}

await square(16, "favicon-16.png");
await square(32, "favicon-32.png");
await square(48, "favicon-48.png");
await square(64, "favicon-64.png");
await square(180, "apple-touch-icon.png");

copyFileSync(join(root, "public/favicon-64.png"), join(root, "src/app/icon.png"));

const iconSvgPublic = join(root, "public/icon.svg");
if (useSlLogo()) {
  if (existsSync(iconSvgPublic)) unlinkSync(iconSvgPublic);
} else if (useSvgSource()) {
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
