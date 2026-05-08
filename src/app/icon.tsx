import { ImageResponse } from "next/og";

import { getSunlumiLogoDataUri } from "@/lib/sunlumi-logo-data-uri";

export const runtime = "nodejs";

export const size = { width: 512, height: 512 };

export const contentType = "image/png";

/** PNG 원본 픽셀 비율 (contain으로 사각 프레임 안에 전부 들어감) */
const LOGO_INTRINSIC_W = 662;
const LOGO_INTRINSIC_H = 570;

export default function Icon() {
  const src = getSunlumiLogoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAF8",
        }}
      >
        {/* ImageResponse는 next/image 미지원 — 로고 contain 렌더링 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src={src}
          width={LOGO_INTRINSIC_W}
          height={LOGO_INTRINSIC_H}
          style={{
            maxWidth: "86%",
            maxHeight: "86%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
