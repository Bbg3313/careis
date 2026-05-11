/** 브라우저 전용 — Node `path` / `Buffer` 없이 MIME 판별 */

function stripMime(mime: string): string {
  return mime.split(";")[0]?.trim().toLowerCase() ?? "";
}

function extOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

function sniffFromHead(buf: Uint8Array): "image/jpeg" | "image/png" | "image/gif" | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
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
    let sig = "";
    for (let i = 0; i < 6; i++) sig += String.fromCharCode(buf[i]!);
    if (sig === "GIF87a" || sig === "GIF89a") return "image/gif";
  }
  return null;
}

/** 관리자 업로드용: File 만으로 허용 MIME 추론 */
export async function resolveUploadMimeFromFile(file: File): Promise<string> {
  const fromBrowser = stripMime(file.type || "");
  if (fromBrowser && fromBrowser !== "application/octet-stream") {
    if (fromBrowser === "image/pjpeg" || fromBrowser === "image/jpg") return "image/jpeg";
    return fromBrowser;
  }
  const ext = extOf(file.name);
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".gif") return "image/gif";
  const head = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  const sniffed = sniffFromHead(head);
  if (sniffed) return sniffed;
  return fromBrowser || "application/octet-stream";
}

export async function readImageNaturalSize(file: File): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file);
  try {
    const dims = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth || 1, height: img.naturalHeight || 1 });
      };
      img.onerror = () => reject(new Error("이미지 크기를 읽을 수 없습니다."));
      img.src = url;
    });
    return dims;
  } finally {
    URL.revokeObjectURL(url);
  }
}
