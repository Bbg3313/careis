export type SiteImageSource = string;

type ProductVisualSet = {
  hero: SiteImageSource;
  gallery: SiteImageSource[];
  card: SiteImageSource;
  alt: string;
};

export const homeVisuals = {
  sunHero: "/images/sun-model-banner.png",
  illuminatorHero: "/images/illum-hero-lifestyle.png",
  /** public 폴더에 실제 존재하는 이미지만 사용 */
  heroMotion: [
    "/images/sun-model-banner.png",
    "/images/sunpack-thumb-02.png",
    "/images/sunpack-thumb-04.png",
    "/images/illum-hero-lifestyle.png",
    "/images/illum-hero-hands.png",
    "/images/illum-hero-marble.png",
  ],
  brandFilm: [
    "/images/sun-model-banner.png",
    "/images/illum-hero-lifestyle.png",
    "/images/illum-hero-marble.png",
    "/images/illum-hero-hands.png",
  ],
};

export const productVisuals: Record<"sun-pack" | "illuminator", ProductVisualSet> = {
  "sun-pack": {
    hero: "/images/sun-model-banner.png",
    card: "/images/sun-model-banner.png",
    alt: "심플스틱 선팩 모델 비주얼",
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
    hero: "/images/illum-hero-lifestyle.png",
    card: "/images/illum-hero-hands.png",
    alt: "일루미네이터 시스테아민 5% 제품 이미지",
    gallery: [
      "/images/illum-hero-hands.png",
      "/images/illum-hero-marble.png",
      "/images/illum-hero-lifestyle.png",
      "/images/illum-hero-marble.png",
      "/images/illum-hero-hands.png",
    ],
  },
};

/** 상세 상단 갤러리 등 공통 가로 기준(px) */
export const SUN_PACK_DETAIL_MAX_WIDTH_PX = 960;
export const ILLUMINATOR_DETAIL_MAX_WIDTH_PX = 960;

export type SunPackStorySlide = {
  src: string;
  width: number;
  height: number;
  /** GIF 실패·호환 시 뒤에 깔 정지 이미지(동일 프레임 PNG 등) */
  posterSrc?: string;
  /** DB·관리자: 제품상세 스토리에서 이미지 아래 본문(빈 줄로 문단 구분) */
  body?: string;
};
export const sunPackDetailAssets = {
  heroImage: "/images/sunpack-thumb-02.png",
  heroPixelSize: { width: 800, height: 800 },
  /** 메인과 동일 파일 포함 가능 — 가로 스트립에서 전환 */
  thumbnailImages: [
    "/images/sunpack-thumb-01.png",
    "/images/sunpack-thumb-02.png",
    "/images/sunpack-thumb-03.png",
    "/images/sunpack-thumb-04.png",
    "/images/sunpack-thumb-05.png",
    "/images/sunpack-thumb-06.png",
    "/images/sunpack-thumb-07.png",
  ],
  /**
   * 예전 7장 스토리와 동일한 순서: GIF는 2번째·5번째 슬롯(인덱스 1·4) 고정.
   */
  storyImages: [
    { src: "/images/sunpack-detail-scroll-01.png", width: 526, height: 1024 },
    {
      src: "/images/sunpack-detail-gif-01.gif",
      width: 600,
      height: 338,
      posterSrc: "/images/sunpack-detail-gif-01.png",
    },
    { src: "/images/sunpack-priority-03.png", width: 299, height: 1024 },
    { src: "/images/sunpack-priority-04.png", width: 853, height: 1024 },
    {
      src: "/images/sunpack-detail-gif-02.gif",
      width: 600,
      height: 338,
      posterSrc: "/images/sunpack-detail-gif-02.png",
    },
    { src: "/images/sunpack-priority-06.png", width: 799, height: 1024 },
    { src: "/images/sunpack-priority-07.png", width: 1005, height: 1024 },
  ] satisfies SunPackStorySlide[],
};

/** 일루미네이터 상세 상단 썸네일(중복 없이 3장 순환) */
export const illuminatorDetailAssets = {
  heroImage: "/images/illum-hero-lifestyle.png",
  /** 정사각 프레임 + cover 기준(실파일과 무관하게 레이아웃만 맞춤) */
  heroPixelSize: { width: 1024, height: 1024 },
  thumbnailImages: [
    "/images/illum-hero-lifestyle.png",
    "/images/illum-hero-hands.png",
    "/images/illum-hero-marble.png",
  ],
} as const;
