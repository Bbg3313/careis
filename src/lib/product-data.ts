export type ProductSlug = "sun-pack" | "illuminator";

export type ProductContent = {
  sku: string;
  slug: ProductSlug;
  name: string;
  shortName: string;
  englishName: string;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  theme: "warm" | "cool";
  price: number;
  keywords: string[];
  introPoints: string[];
  problemPoints?: string[];
  benefits: string[];
  sections: {
    title: string;
    description: string;
    bullets?: string[];
    accent?: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  info: {
    label: string;
    value: string;
  }[];
};

export const products: ProductContent[] = [
  {
    sku: "CAREIS-SUNPACK-001",
    slug: "sun-pack",
    name: "심플스틱 선팩",
    shortName: "선팩",
    englishName: "Simple Stick Sun Pack",
    tagline: "한 번의 밀착, 오래가는 보호",
    heroTitle: "Film Formula로 완성한 데일리 선 케어",
    heroDescription:
      "병원 유통 기반의 필름막 기술로 자외선 차단, 편안한 사용감, 이지 워시 경험을 동시에 제안합니다.",
    theme: "warm",
    price: 59000,
    keywords: ["Film Formula", "Irritation Free", "Easy Wash"],
    introPoints: [
      "특허 기반 바이오 셀룰로오스 필름막",
      "1회 사용 후 장시간 보호를 돕는 데일리 선 케어",
      "메이크업 전후 모두 어울리는 가벼운 사용감",
    ],
    problemPoints: [
      "일반 선크림은 자주 덧발라야 하는 번거로움이 있습니다.",
      "눈시림, 백탁, 잔여감이 부담으로 남기 쉽습니다.",
      "야외 활동 중 메이크업 위 덧바름이 불편할 수 있습니다.",
    ],
    benefits: [
      "SPF50+ / PA+++ / 미백·주름개선 기능성",
      "투명한 막 형성으로 백탁 부담을 줄인 사용감",
      "메이크업 전후 활용 가능한 데일리 루틴",
      "1차 세안 중심의 간편한 클렌징 경험",
    ],
    sections: [
      {
        title: "왜 선팩인가",
        description:
          "여러 번 덧바르는 선케어의 불편함을 줄이고 피부 위에 얇게 밀착되는 필름막 감각에 집중했습니다.",
        bullets: [
          "도포 후 막 형성으로 사용감을 더 가볍게 설계",
          "하루 중 활동량이 많은 사용자에게 어울리는 루틴",
          "메이크업 위 사용성까지 고려한 사용 편의성",
        ],
        accent: "Daily Protection",
      },
      {
        title: "바이오 셀룰로오스 필름막",
        description:
          "피부 위에 얇고 유연한 막을 형성해 밀착감을 높이고, 외부 환경으로부터 피부를 보호하는 사용 경험을 만듭니다.",
        bullets: [
          "필름막 기술 기반의 밀착감",
          "백탁과 무거운 잔여감 부담 완화",
          "눈시림에 대한 부담을 줄인 사용 흐름",
        ],
        accent: "Technology",
      },
      {
        title: "야외 활동과 메이크업 루틴",
        description:
          "골프, 외출, 이동이 많은 일정 속에서도 간편하게 사용할 수 있는 선 케어 경험을 제공합니다.",
        bullets: [
          "메이크업 전후 사용 가능",
          "야외 활동 시 편안한 밀착감",
          "가볍고 촉촉한 발림성",
        ],
        accent: "Use Scene",
      },
      {
        title: "트레할로스 스토리",
        description:
          "건조한 환경에서도 수분 유지에 도움을 주는 보조 스토리로 선팩의 편안한 피부 컨디션을 보완합니다.",
        bullets: [
          "수분 보유력 중심의 성분 스토리",
          "시술 후 선케어 루틴과도 어울리는 컨셉",
        ],
        accent: "Ingredient Story",
      },
    ],
    faq: [
      {
        question: "하이드로콜로이드 막이 답답하지 않나요?",
        answer:
          "나노 크기의 바이오 셀룰로오스 막은 공기는 통과시키고 자외선 차단을 돕는 방향으로 설계되어 답답함 부담을 줄였습니다.",
      },
      {
        question: "사용 시 눈시림이 심하지 않을까요?",
        answer:
          "막 형성 후 밀착되도록 설계된 사용 흐름으로 피부 주름을 따라 쉽게 흘러내리지 않아 눈시림 부담을 완화했습니다.",
      },
      {
        question: "메이크업 위에도 사용할 수 있나요?",
        answer:
          "메이크업 전후 모두 어울리도록 기획된 제품으로, 사용 후에도 들뜸 없이 매끈한 피부 표현을 돕는 방향으로 소개할 수 있습니다.",
      },
    ],
    info: [
      { label: "기능성", value: "SPF50+ / PA+++ / 미백 / 주름개선 3중 기능성 화장품" },
      { label: "용량", value: "50g" },
      { label: "사용 포인트", value: "데일리 선 보호, 야외 활동, 메이크업 루틴" },
      { label: "권장 흐름", value: "스킨케어 마지막 단계에 도포 후 막 형성 확인" },
    ],
  },
  {
    sku: "CAREIS-ILLUM-001",
    slug: "illuminator",
    name: "일루미네이터 시스테아민 5%",
    shortName: "일루미네이터",
    englishName: "Illuminator Cysteamine 5%",
    tagline: "색소 고민을 위한 야간 집중 케어",
    heroTitle: "ODT 기술로 완성한 나이트 브라이트닝 루틴",
    heroDescription:
      "시스테아민 5%와 ODT 크림 팩 기술을 중심으로, 민감 피부도 고려한 집중 관리 루틴을 제안합니다.",
    theme: "cool",
    price: 119000,
    keywords: ["Night Care", "ODT Film", "Cysteamine 5%"],
    introPoints: [
      "색소 고민과 PIH 관리 니즈를 고려한 나이트 케어",
      "시스테아민 5% + 나이아신아마이드 + 알부틴 조합",
      "집중 관리 이후 유지 루틴까지 제안하는 프로토콜형 제품",
    ],
    benefits: [
      "ODT 기반의 크림 팩 루틴",
      "야간 집중 관리 후 주 2회 유지 사용 가능",
      "민감한 피부를 고려한 브라이트닝 케어 방향",
      "시술 병행 맥락을 고려한 더마코스메틱 포지셔닝",
    ],
    sections: [
      {
        title: "Concern Focus",
        description:
          "색소 고민, 시술 후 피부 톤 관리, 예민해진 피부에 대한 루틴 니즈를 기준으로 설계한 집중 케어 제품입니다.",
        bullets: [
          "기미 및 PIH 고민을 위한 루틴형 포지셔닝",
          "민감 피부도 고려한 기능성 케어 톤",
        ],
        accent: "Concern",
      },
      {
        title: "Active Story",
        description:
          "시스테아민 5%를 중심으로 나이아신아마이드, 알부틴을 더해 브라이트닝 시너지를 구성합니다.",
        bullets: [
          "Cysteamine 5%",
          "Niacinamide",
          "Arbutin",
        ],
        accent: "Actives",
      },
      {
        title: "ODT Technology",
        description:
          "도포 후 투명한 막이 형성되고, 30분 전후의 적용 시간을 거쳐 제거 후 잔여물을 흡수시키는 루틴으로 설계됩니다.",
        bullets: [
          "Apply",
          "Wait",
          "Peel-off",
          "Maintain",
        ],
        accent: "Protocol",
      },
      {
        title: "Clinical Tone",
        description:
          "임상 및 논문 근거를 기반으로 하되, 웹사이트에서는 과장 없는 더마코스메틱 톤으로 정제해 전달합니다.",
        bullets: [
          "임상 결과 요약 인용",
          "의료광고 표현 대신 브라이트닝 관리 중심 카피",
        ],
        accent: "Evidence",
      },
    ],
    faq: [
      {
        question: "언제 사용하는 제품인가요?",
        answer:
          "야간 집중 관리 루틴용으로 제안합니다. 낮 시간에는 자외선 차단제를 함께 사용하는 흐름이 적합합니다.",
      },
      {
        question: "얼마나 오래 사용해야 하나요?",
        answer:
          "집중 관리 4개월, 이후 주 2회 유지 루틴 형태로 설명하는 구성이 적합합니다.",
      },
      {
        question: "처음 사용할 때 따가울 수 있나요?",
        answer:
          "초기 사용 시 일시적인 따가움 가능성을 사전 안내하고, 권장 사용 시간과 주의사항을 함께 제시하는 방식이 적합합니다.",
      },
    ],
    info: [
      { label: "핵심 성분", value: "Cysteamine 5% / Niacinamide / Arbutin" },
      { label: "용량", value: "50g" },
      { label: "권장 시간", value: "야간 사용 권장" },
      { label: "루틴", value: "집중 관리 4개월 후 주 2회 유지" },
    ],
  },
];

export const siteHighlights = [
  {
    title: "병원 유통 기반",
    description: "신뢰를 우선하는 더마 코스메틱 포지셔닝",
  },
  {
    title: "기능성 중심 설계",
    description: "과장보다 사용 경험과 루틴에 집중한 구조",
  },
  {
    title: "2-SKU 집중 운영",
    description: "적게, 깊게 설명하는 브랜드 커머스 방식",
  },
];

export const paymentMethods = [
  { value: "CREDIT_CARD", label: "신용카드" },
  { value: "NAVER_PAY", label: "네이버페이" },
  { value: "TOSS_PAY", label: "토스페이" },
  { value: "KAKAO_PAY", label: "카카오페이" },
] as const;

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
