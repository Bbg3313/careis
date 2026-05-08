#!/usr/bin/env node
/**
 * Flattened composite export from a PSD to lossless PNG.
 *
 * Usage:
 *   npm run export-psd -- path/to/file.psd
 *   npm run export-psd -- path/to/file.psd path/to/out.png
 *   npm run export-psd -- path/to/file.psd public/images/
 *   npm run export-psd -- path/to/file.psd --density 300
 *
 * Photoshop: save with "Maximize PSD Compatibility" (레이어 호환성 / 호환성 최대화).
 * Otherwise psd.js may export an empty composite and you should use ImageMagick or
 * Photoshop's own Export.
 *
 * If `magick` (ImageMagick 7) is on PATH, it is preferred for many PSDs (density applies).
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const PSD = require("psd");

function hasMagick() {
  try {
    execFileSync("magick", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function parseArgs(argv) {
  const args = [...argv];
  let density = 144;
  const d = args.indexOf("--density");
  if (d !== -1 && args[d + 1]) {
    density = Number.parseInt(args[d + 1], 10);
    if (Number.isNaN(density) || density < 1) {
      console.error("Invalid --density value");
      process.exit(1);
    }
    args.splice(d, 2);
  }
  return { positional: args, density };
}

async function main() {
  const { positional, density } = parseArgs(process.argv.slice(2));

  if (positional.length < 1) {
    console.error(`Usage: node scripts/export-psd.cjs <file.psd> [out.png|dir/] [--density 144]

Examples:
  npm run export-psd -- design/sun-detail.psd
  npm run export-psd -- design/sun-detail.psd public/images/sun-detail-full.png

Default output: public/images/<basename>-composite.png`);
    process.exit(1);
  }

  const input = path.resolve(positional[0]);
  const outArg = positional[1];
  const basename = path.basename(input, path.extname(input));

  if (!fs.existsSync(input)) {
    console.error("Input not found:", input);
    process.exit(1);
  }

  const defaultOut = path.join(process.cwd(), "public", "images", `${basename}-composite.png`);
  let output;
  if (!outArg) {
    output = defaultOut;
  } else {
    const resolved = path.resolve(outArg);
    if (
      outArg.endsWith("/") ||
      outArg.endsWith("\\") ||
      (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory())
    ) {
      output = path.join(resolved, `${basename}-composite.png`);
    } else {
      output = resolved;
    }
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });

  if (hasMagick()) {
    console.log(`Using ImageMagick (density=${density})…`);
    execFileSync(
      "magick",
      [
        "-define",
        "psd:alpha-unblend=false",
        "-density",
        String(density),
        input,
        "-flatten",
        output,
      ],
      { stdio: "inherit" },
    );
    console.log("Wrote", output);
    return;
  }

  console.log("ImageMagick (`magick`) not on PATH; using psd.js merged preview…");
  console.log('If the PNG is blank or wrong, save the PSD with "Maximize PSD Compatibility" or install ImageMagick.');
  const psd = await PSD.open(input);
  await psd.image.saveAsPng(output);
  console.log("Wrote", output);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
