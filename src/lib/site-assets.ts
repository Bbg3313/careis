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

export const sunPackDetailAssets = {
  heroImage: "/images/sunpack-priority-01.png",
  thumbnailImages: [
    "/images/sunpack-thumb-01.png",
    "/images/sunpack-thumb-02.png",
    "/images/sunpack-thumb-03.png",
    "/images/sunpack-thumb-04.png",
    "/images/sunpack-thumb-05.png",
    "/images/sunpack-thumb-06.png",
    "/images/sunpack-thumb-07.png",
  ],
  storyImages: [
    "/images/sunpack-priority-01.png",
    "/images/sunpack-priority-02.png",
    "/images/sunpack-priority-03.png",
    "/images/sunpack-priority-04.png",
    "/images/sunpack-priority-05.png",
    "/images/sunpack-priority-06.png",
    "/images/sunpack-priority-07.png",
  ],
};
