export type SiteImageSource = string;

type ProductVisualSet = {
  hero: SiteImageSource;
  gallery: SiteImageSource[];
  card: SiteImageSource;
  alt: string;
};

export const homeVisuals = {
  sunHero: "/images/sun-hero.png",
  illuminatorHero: "/images/illum-hero.png",
  heroMotion: [
    "/images/sun-hero.png",
    "/images/sun-lifestyle.png",
    "/images/sun-texture.png",
    "/images/sun-model-warm.png",
    "/images/illum-model-banner.png",
    "/images/illum-hero.png",
  ],
  brandFilm: ["/images/sun-object.png", "/images/illum-hero.png", "/images/sun-texture.png", "/images/illum-model.png"],
};

export const productVisuals: Record<"sun-pack" | "illuminator", ProductVisualSet> = {
  "sun-pack": {
    hero: "/images/sunpack-thumb-02.png",
    card: "/images/sunpack-thumb-02.png",
    alt: "심플스틱 선팩 모델 썸네일 이미지",
    gallery: [
      "/images/sunpack-thumb-01.png",
      "/images/sunpack-thumb-02.png",
      "/images/sunpack-thumb-03.png",
      "/images/sunpack-thumb-04.png",
      "/images/sunpack-thumb-05.png",
      "/images/sunpack-thumb-06.png",
      "/images/sunpack-thumb-07.png",
    ],
  },
  illuminator: {
    hero: "/images/illum-hero.png",
    card: "/images/illum-model.png",
    alt: "일루미네이터 시스테아민 5% 제품 이미지",
    gallery: [
      "/images/illum-model.png",
      "/images/illum-hero.png",
      "/images/illum-model.png",
      "/images/illum-hero.png",
      "/images/illum-model.png",
    ],
  },
};

/** 실제 파일 픽셀 크기 — 표시 비율·업스케일 방지용 (파일 교체 시 함께 수정) */
export const sunPackDetailAssets = {
  heroImage: "/images/sunpack-thumb-02.png",
  heroPixelSize: { width: 800, height: 800 },
  thumbnailImages: [
    "/images/sunpack-thumb-01.png",
    "/images/sunpack-thumb-02.png",
    "/images/sunpack-thumb-03.png",
    "/images/sunpack-thumb-04.png",
    "/images/sunpack-thumb-05.png",
    "/images/sunpack-thumb-06.png",
    "/images/sunpack-thumb-07.png",
  ],
  thumbnailPixelSize: { width: 800, height: 800 },
  storyImages: [
    { src: "/images/sunpack-priority-01.png", width: 526, height: 1024 },
    { src: "/images/sunpack-priority-02.png", width: 600, height: 338 },
    { src: "/images/sunpack-priority-03.png", width: 299, height: 1024 },
    { src: "/images/sunpack-priority-04.png", width: 853, height: 1024 },
    { src: "/images/sunpack-priority-05.png", width: 600, height: 338 },
    { src: "/images/sunpack-priority-06.png", width: 799, height: 1024 },
    { src: "/images/sunpack-priority-07.png", width: 1005, height: 1024 },
  ],
};
