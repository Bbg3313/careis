import path from "path";

/** Content-Type 에 붙는 charset 등 제거 */
export function stripMimeParameters(mime: string): string {
  return mime.split(";")[0]?.trim().toLowerCase() ?? "";
}

/** 브라우저 타입 + 확장자로도 안 잡힐 때 버퍼 시그니처로 판별 */
export function sniffImageMimeFromBuffer(buf: Buffer): "image/jpeg" | "image/png" | "image/gif" | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return "image/png";
  }
  if (buf.length >= 6) {
    const head = buf.subarray(0, 6).toString("ascii");
    if (head === "GIF87a" || head === "GIF89a") {
      return "image/gif";
    }
  }
  return null;
}

export function inferImageMimeFromFileName(fileName: string): "image/jpeg" | "image/png" | "image/gif" | null {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".gif") return "image/gif";
  return null;
}

export function resolveUploadImageMime(file: File, buffer: Buffer): string {
  const fromBrowser = stripMimeParameters(file.type || "");
  if (fromBrowser && fromBrowser !== "application/octet-stream") {
    if (fromBrowser === "image/pjpeg" || fromBrowser === "image/jpg") return "image/jpeg";
    return fromBrowser;
  }
  const fromName = inferImageMimeFromFileName(file.name);
  if (fromName) return fromName;
  const sniffed = sniffImageMimeFromBuffer(buffer);
  if (sniffed) return sniffed;
  return fromBrowser || "application/octet-stream";
}
