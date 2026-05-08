import { readFileSync } from "fs";
import { join } from "path";

let cached: string | null = null;

/** 헤더와 동일: `sunlumi-logo-transparent.png` */
export function getSunlumiLogoDataUri(): string {
  if (cached) return cached;
  const filePath = join(process.cwd(), "public/branding/sunlumi-logo-transparent.png");
  const base64 = readFileSync(filePath).toString("base64");
  cached = `data:image/png;base64,${base64}`;
  return cached;
}
