import { writeFileSync } from "fs";
import { join } from "path";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = process.cwd();
const src = join(root, "public/branding/sunlumi-logo-transparent.png");
const bg = { r: 250, g: 250, b: 248, alpha: 1 };

async function square(px, filename) {
  await sharp(src)
    .resize(px, px, { fit: "contain", background: bg })
    .png()
    .toFile(join(root, "public", filename));
}

await square(16, "favicon-16.png");
await square(32, "favicon-32.png");
await square(48, "favicon-48.png");
await square(180, "apple-touch-icon.png");

const icoBuf = await pngToIco([
  join(root, "public/favicon-16.png"),
  join(root, "public/favicon-32.png"),
  join(root, "public/favicon-48.png"),
]);
writeFileSync(join(root, "public/favicon.ico"), icoBuf);
