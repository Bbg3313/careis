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
    tagline: "특허 필름막 기술로 완성한 데일리 UV 프로텍션",
    heroTitle: "특허 기반 필름막 기술로 완성한 데일리 선케어",
    heroDescription:
      "심플스틱 선팩은 바이오 셀룰로오스 필름막 기술을 바탕으로, 자외선 차단 성능과 가벼운 사용감을 함께 담은 데일리 선케어입니다. 외출 전, 메이크업 전후, 야외 활동까지 부담 없이 손이 가는 제품입니다.",
    theme: "warm",
    price: 59000,
    keywords: ["Film Formula", "Irritation Free", "Easy Wash"],
    introPoints: [
      "특허 기반 바이오 셀룰로오스 필름막 기술",
      "SPF50+ / PA+++ / 미백·주름개선 3중 기능성",
      "메이크업 전후에도 부담이 적은 간결한 사용감",
    ],
    problemPoints: [
      "덧바름이 필요한 선케어는 일상에서 지속 사용이 어렵습니다.",
      "백탁, 눈시림, 무거운 잔여감은 재구매 장벽이 되기 쉽습니다.",
      "야외 활동이나 메이크업 위 사용성까지 설명 가능한 제품이 드뭅니다.",
    ],
    benefits: [
      "SPF50+ / PA+++ / 미백·주름개선 기능성",
      "필름막 형성 후의 가벼운 밀착감",
      "백탁과 눈시림 부담을 낮춘 데일리 사용감",
      "메이크업 전후와 야외 활동에도 편안한 사용감",
    ],
    sections: [
      {
        title: "왜 선팩인가",
        description:
          "단순한 자외선 차단제를 넘어, 자주 덧발라야 하는 번거로움과 무거운 잔여감을 줄여 매일 더 편하게 쓸 수 있도록 했습니다.",
        bullets: [
          "도포 후 더 가볍고 산뜻하게 남는 사용감",
          "하루 중 활동량이 많은 사용자에게 어울리는 루틴",
          "메이크업 위 사용성까지 고려한 사용 편의성",
        ],
        accent: "Daily Protection",
      },
      {
        title: "바이오 셀룰로오스 필름막",
        description:
          "피부 위에 얇고 유연한 막을 형성해 밀착감을 높이고, 외부 환경으로부터 피부를 보호하는 기술 스토리를 더 선명하게 전달합니다.",
        bullets: [
          "필름막 기술 기반의 밀착감",
          "백탁과 무거운 잔여감 부담 완화",
          "눈시림 부담을 덜어낸 편안한 사용감",
        ],
        accent: "Technology",
      },
      {
        title: "메이크업과 야외 활동 루틴",
        description:
          "골프, 외출, 이동이 많은 일정 속에서도 메이크업과 잘 어울리고, 하루 중 여러 번 손이 가도 부담 없는 사용감을 중심에 두었습니다.",
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
          "트레할로스는 건조한 환경에서도 편안한 피부 컨디션을 유지하도록 돕는 보조 스토리로, 선팩의 사용감을 한층 부드럽게 설명해줍니다.",
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
          "나노 크기의 바이오 셀룰로오스 막은 공기는 통과시키고 자외선 차단을 돕도록 고안되어 답답함 부담을 줄였습니다.",
      },
      {
        question: "사용 시 눈시림이 심하지 않을까요?",
        answer:
          "피부에 밀착되어 쉽게 흘러내리지 않도록 만들어져 눈시림 부담을 덜어줍니다.",
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
      { label: "사용 방법", value: "스킨케어 마지막 단계에 도포 후 가볍게 밀착" },
    ],
  },
  {
    sku: "CAREIS-ILLUM-001",
    slug: "illuminator",
    name: "일루미네이터 시스테아민 5%",
    shortName: "일루미네이터",
    englishName: "Illuminator Cysteamine 5%",
    tagline: "색소 고민과 PIH 케어를 위한 야간 브라이트닝 루틴",
    heroTitle: "시스테아민 5%와 ODT 기술이 담긴 집중 나이트 케어",
    heroDescription:
      "일루미네이터는 시스테아민 5%를 중심으로 나이아신아마이드와 알부틴을 배합하고, ODT 크림 팩을 더한 집중 케어 제품입니다. 기미, 잡티, PIH 고민을 위한 야간 브라이트닝 케어로 더 맑고 정돈된 피부 컨디션을 돕습니다.",
    theme: "cool",
    price: 119000,
    keywords: ["Night Care", "ODT Film", "Cysteamine 5%"],
    introPoints: [
      "기미, 잡티, PIH 고민을 고려한 야간 집중 케어",
      "Cysteamine 5% + Niacinamide + Arbutin 조합",
      "집중 4개월 후 유지 케어까지 이어지는 사용 제안",
    ],
    benefits: [
      "ODT 기반의 크림 팩 루틴",
      "집중 사용 후 주 2회 유지 관리 루틴",
      "민감한 피부를 고려한 브라이트닝 케어 방향",
      "시술 병행 맥락을 고려한 더마코스메틱 포지셔닝",
    ],
    sections: [
      {
        title: "색소 고민 집중 케어",
        description:
          "색소 고민, 시술 후 피부 톤 관리, 예민해진 피부 컨디션까지 함께 생각한 집중 케어 제품입니다.",
        bullets: [
          "기미 및 PIH 고민을 위한 루틴형 포지셔닝",
          "민감 피부도 고려한 기능성 케어 톤",
        ],
        accent: "Concern",
      },
      {
        title: "핵심 성분 포인트",
        description:
          "시스테아민 5%를 중심으로 나이아신아마이드와 알부틴을 더해, 브라이트닝 케어에 필요한 핵심 성분을 간결하게 담았습니다.",
        bullets: [
          "Cysteamine 5%",
          "Niacinamide",
          "Arbutin",
        ],
        accent: "Actives",
      },
      {
        title: "ODT 루틴 프로토콜",
        description:
          "도포 후 막 형성, 대기, 제거, 흡수로 이어지는 단계는 일루미네이터만의 사용감을 가장 또렷하게 보여주는 포인트입니다.",
        bullets: [
          "Apply",
          "Wait",
          "Peel-off",
          "Maintain",
        ],
        accent: "Protocol",
      },
      {
        title: "임상 기반 전달 톤",
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
          "야간 집중 관리용으로 사용하는 제품입니다. 낮 시간에는 자외선 차단제를 함께 사용하는 것을 권장합니다.",
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
    title: "프리미엄 사용감",
    description: "매일 손이 가는 텍스처와 무드를 중심으로 담아낸 제품 인상",
  },
  {
    title: "낮과 밤 2-Step",
    description: "선팩과 일루미네이터를 역할별로 또렷하게 나눈 케어 리듬",
  },
  {
    title: "레퍼럴 구매 지원",
    description: "추천 코드 구매와 일반 구매를 함께 이용할 수 있는 쇼핑 환경",
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
