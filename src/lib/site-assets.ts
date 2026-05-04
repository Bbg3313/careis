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
  ],
  brandFilm: ["/images/sun-object.png", "/images/illum-hero.png", "/images/sun-texture.png", "/images/illum-model.png"],
};

export const productVisuals: Record<"sun-pack" | "illuminator", ProductVisualSet> = {
  "sun-pack": {
    hero: "/images/sun-hero.png",
    card: "/images/sun-object.png",
    alt: "심플스틱 선팩 제품 이미지",
    gallery: [
      "/images/sun-object.png",
      "/images/sun-texture.png",
      "/images/sun-model-warm.png",
      "/images/sun-package.png",
      "/images/sun-lifestyle.png",
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
