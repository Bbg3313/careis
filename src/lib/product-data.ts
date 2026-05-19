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
  /** 모바일 스티키 CTA 등 — 실제 프로모션·레퍼럴 조건과 맞출 것 */
  promoMaxDiscountPercent?: number;
  promoMaxDiscountNote?: string;
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
      "시스테아민 5%·나이아신아마이드·알부틴과 ODT 막으로 야간 집중 → 4개월 후 주 2회 유지까지 이어지는 브라이트닝 루틴입니다.",
    theme: "cool",
    price: 150000,
    keywords: ["Night Care", "ODT Film", "Cysteamine 5%"],
    introPoints: [
      "기미, 잡티, PIH 고민을 고려한 야간 집중 케어",
      "Cysteamine 5% + Niacinamide + Arbutin 조합",
      "집중 4개월 후 유지 케어까지 이어지는 사용 제안",
    ],
    problemPoints: [
      "야간 브라이트닝은 자극 부담과 사용 지속성이 겹치면 루틴이 쉽게 끊깁니다.",
      "도포·대기·제거 단계가 길게 느껴지면 첫 주부터 이탈하기 쉽습니다.",
      "집중 케어와 유지 루틴을 한 흐름으로 설명하지 못하면 제품 신뢰가 흐려집니다.",
    ],
    benefits: [
      "ODT 기반의 크림 팩 루틴",
      "집중 사용 후 주 2회 유지 관리 루틴",
      "민감한 피부를 고려한 브라이트닝 케어 방향",
      "시술 병행 맥락을 고려한 더마코스메틱 포지셔닝",
    ],
    sections: [
      {
        title: "기미·PIH 케어를 한 번에 잡는 포지션",
        description:
          "기미·PIH를 겨냥한 나이트 집중 케어이며, 색소 시술 루틴과 병행해 쓰기 좋게 설계했습니다. 저자극 미백 기능성 방향을 유지합니다.",
        bullets: ["기미·잡티·PIH 맥락", "ODT로 전달 보강"],
        accent: "Solution",
      },
      {
        title: "시스테아민 5%가 잡는 브라이트닝 축",
        description:
          "멜라닌 생성 경로를 여러 단계에서 완화하는 데 기여한다고 알려진 성분입니다. 항산화·톤 정돈에 초점을 둡니다.",
        bullets: ["효소 경로 억제·멜라닌 전환 완화", "상대적으로 완만한 안전 프로파일 지향"],
        accent: "Cysteamine",
      },
      {
        title: "나이아신아마이드·알부틴 삼각 시너지",
        description:
          "나이아신아마이드는 미백·결·장벽 케어에, 알부틴은 멜라닌 생성 억제에 각각 초점을 둡니다. 시스테아민과 ODT 막이 함께합니다.",
        bullets: ["B3 + 알부틴으로 시너지", "막 형성으로 체류 시간 활용"],
        accent: "Synergy",
      },
      {
        title: "지속 가능한 사용감이 곧 효과의 전제",
        description:
          "초기 따가움은 흔하며 보통 30분 내 진정된다고 안내됩니다. 4개월 집중 후 주 2회 유지로 끊기지 않게 설계했습니다.",
        bullets: ["주기가 곧 효과", "도포형으로 일상 유지 용이"],
        accent: "Adherence",
      },
      {
        title: "문헌에서 확인되는 효능·내약성 방향",
        description:
          "시스테아민 5% 크림의 무작위 대조 연구(Mansouri 2015)와 TA 메조 비교 연구(Karrabi 2021) 등에서 기미 지표 개선·내약성 방향이 보고됩니다. 개인차가 큽니다.",
        bullets: ["임상·연구에서 보고된 개선 경향 참고", "효과·반응은 사람마다 다름"],
        accent: "Evidence",
      },
      {
        title: "ODT 막 + 500 Dalton 설계로 전달을 보강",
        description:
          "막으로 수분을 붙잡고 각질층 수화를 높여 성분이 스며들 환경을 만듭니다. 시스테아민(약 77 Da) 중심에 B3·알부틴을 얹어 500 Da 규칙에 맞춘 조합입니다.",
        bullets: ["폐쇄·보습·침투 경로", "저분자+시너지 성분"],
        accent: "ODT",
      },
      {
        title: "4단계 프로토콜과 반드시 지킬 안전 수칙",
        description:
          "세안 직후·기초 전 가장 먼저 바르고, 약 30분 뒤 막을 제거한 뒤 잔여는 흡수시킵니다. 1시간 초과 금지, 야간만, 1일 1회, 낮에는 자외선 차단을 병행하세요.",
        bullets: ["Apply → Wait → Peel-off → Maintain", "시간·횟수·야간 룰 엄수"],
        accent: "How to",
      },
    ],
    faq: [
      {
        question: "처음 쓸 때 따가운데, 이상 증상인가요?",
        answer:
          "초기 따가움은 흔합니다. 30분 넘게 지속되거나 붉은기가 심하면 세안 후 중단·간격을 넓기고, 필요 시 전문의 상담을 권합니다.",
      },
      {
        question: "왜 1시간 이상 두면 안 되나요?",
        answer: "ODT 막이 폐쇄·온도를 올려 장시간 방치 시 자극·화상 위험이 커집니다. 안내된 시간을 꼭 지키세요.",
      },
      {
        question: "언제 사용하는 제품인가요?",
        answer: "야간 전용입니다. 낮에는 자외선 차단제를 꼼꼼히 바르세요.",
      },
      {
        question: "얼마나 오래 사용해야 하나요?",
        answer: "매일 1회 약 4개월 집중 후, 유지는 주 2회로 줄이는 흐름을 권장합니다. 8주·4개월 부근에서 피부 반응을 점검하세요.",
      },
    ],
    info: [
      { label: "핵심 성분", value: "Cysteamine 5% / Niacinamide / Arbutin" },
      { label: "제형·기술", value: "ODT 크림 팩 — 막 형성으로 전달·보습 보강" },
      { label: "용량", value: "50g" },
      { label: "권장 루틴", value: "집중 약 4개월 매일 1회 → 이후 주 2회" },
      { label: "필수 주의", value: "야간만 · 1시간 초과 금지 · 1일 1회 · 낮 자외선 차단" },
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
