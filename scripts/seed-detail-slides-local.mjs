import sharp from "sharp";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";

function loadEnv() {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim().replace(/^["']|["']$/g, "");
    process.env[m[1].trim()] = v;
  }
}
loadEnv();

const prisma = new PrismaClient();

async function sizeOfPublic(urlPath) {
  const file = path.join(process.cwd(), "public", urlPath.replace(/^\//, ""));
  const meta = await sharp(file).metadata();
  return { width: meta.width ?? 800, height: meta.height ?? 800 };
}

const sunPackSlides = [
  {
    src: "/images/sunpack-detail-part-01.png",
    mimeType: "image/png",
    body: "백탁 없이 투명하게, 끈적임 없이 산뜻하게",
  },
  {
    src: "/images/sunpack-detail-gif-01.gif",
    mimeType: "image/gif",
    posterSrc: "/images/sunpack-detail-gif-01.png",
  },
  { src: "/images/sunpack-detail-part-02.png", mimeType: "image/png" },
  { src: "/images/sunpack-detail-part-03.png", mimeType: "image/png" },
  {
    src: "/images/sunpack-detail-gif-02.gif",
    mimeType: "image/gif",
    posterSrc: "/images/sunpack-detail-gif-02.png",
  },
  { src: "/images/sunpack-detail-part-04.png", mimeType: "image/png" },
  { src: "/images/sunpack-detail-part-05.png", mimeType: "image/png" },
];

const illuminatorSlides = [
  { src: "/images/illum-thumb-01.png", mimeType: "image/png" },
  { src: "/images/illum-thumb-02.png", mimeType: "image/png" },
];

try {
  await prisma.productDetailSlide.deleteMany();

  for (const [i, slide] of sunPackSlides.entries()) {
    const { width, height } = await sizeOfPublic(slide.src);
    await prisma.productDetailSlide.create({
      data: {
        productSlug: "sun-pack",
        sortOrder: i,
        url: slide.src,
        width,
        height,
        mimeType: slide.mimeType,
        posterUrl: slide.posterSrc ?? null,
        body: slide.body ?? null,
      },
    });
  }

  for (const [i, slide] of illuminatorSlides.entries()) {
    const { width, height } = await sizeOfPublic(slide.src);
    await prisma.productDetailSlide.create({
      data: {
        productSlug: "illuminator",
        sortOrder: i,
        width,
        height,
        mimeType: slide.mimeType,
        url: slide.src,
      },
    });
  }

  const counts = await prisma.productDetailSlide.groupBy({
    by: ["productSlug"],
    _count: true,
  });
  console.log("seeded", counts);
} finally {
  await prisma.$disconnect();
}
