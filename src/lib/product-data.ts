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
    promoMaxDiscountPercent: 15,
    promoMaxDiscountNote: "* 레퍼럴·기간 한정 할인 등 적용 시 기준이 달라질 수 있습니다.",
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
      "시스테아민 5%를 축으로 나이아신아마이드·알부틴을 얹고, ODT 막 형성으로 성분 전달을 돕는 나이트 집중 케어입니다. 기미·PIH 고민과 시술 병행 루틴을 함께 고려했고, 4개월 집중 후 주 2회 유지까지 이어지는 사용 설계를 제안합니다.",
    theme: "cool",
    price: 119000,
    promoMaxDiscountPercent: 15,
    promoMaxDiscountNote: "* 레퍼럴·기간 한정 할인 등 적용 시 기준이 달라질 수 있습니다.",
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
          "일루미네이터는 기미가 신경 쓰이는 피부와 PIH(색소 침착) 관리를 함께 염두에 둔 나이트 집중 케어입니다. 단독으로도 쓰기 좋고, 색소 레이저 등 시술 루틴과 병행할 때 시너지를 기대하는 구성으로 설계되었습니다. 잦은 시술로 민감해진 피부도 부담을 줄이기 위해 저자극 미백 기능성 방향을 유지합니다.",
        bullets: [
          "기미·잡티·PIH 맥락의 브라이트닝 케어",
          "시술 병행 시 효율을 높이려는 사용자까지 고려",
          "ODT(Occlusive Dressing Technique) 크림 팩으로 유효 성분의 피부 침투를 돕는 제형",
        ],
        accent: "Solution",
      },
      {
        title: "시스테아민 5%가 잡는 브라이트닝 축",
        description:
          "시스테아민은 멜라닌 생성 과정에 개입해 어두운 멜라닌(Eumelanin) 합성을 억제하고, 밝은 멜라닌(Pheomelanin) 쪽 합성 경로를 도와 톤을 정돈하는 데 도움을 준다고 알려져 있습니다. 타이로시나제·퍼옥시다제 활성 억제, 도파퀴논 퀀칭, Fenton형 반응 억제 등 여러 단계에 걸쳐 색소 생성 신호를 다각도로 완화하는 성분으로 소개됩니다.",
        bullets: [
          "멜라닌 합성 효소 경로에 대한 다중 억제 메커니즘이 문헌에서 제시됨",
          "강한 항산화·글루타치온 합성 증가와 연결된 보호 효과 설명",
          "하이드로퀴논 대비 상대적으로 완만한 안전 프로파일을 지향하는 대체 루트로 주목",
        ],
        accent: "Cysteamine",
      },
      {
        title: "나이아신아마이드·알부틴 삼각 시너지",
        description:
          "비타민 B3(나이아신아마이드)는 미백 기능성 성분으로 흡수 속도와 피부 컨디션 케어에 강점이 있고, 알부틴은 멜라닌 생성 효소 활성을 억제하는 데 초점을 둔 성분입니다. 시스테아민과 맞물려 ‘억제–정돈–유지’ 흐름을 한 제품 안에서 이어 가도록 배합했습니다.",
        bullets: [
          "나이아신아마이드: 미백·장벽·결 케어까지 폭넓게 쓰이는 시너지 성분",
          "알부틴: 티로시나제 기반 멜라닌 생성 억제에 기여하는 성분",
          "세 성분이 ODT 막과 만나 피부에 머무는 시간을 활용",
        ],
        accent: "Synergy",
      },
      {
        title: "지속 가능한 사용감이 곧 효과의 전제",
        description:
          "브라이트닝 케어는 한두 번이 아니라 주기가 생명입니다. 일루미네이터는 초기 도포 시 일시적인 따가움이 있을 수 있으나 대개 30분 이내 진정되는 패턴으로 보고되며, 장기 사용 시 내성 우려가 상대적으로 낮은 방향을 지향합니다. 집중 케어 4개월 매일 사용 후, 유지를 위해 주 2회로 전환하는 프로토콜을 권장합니다.",
        bullets: [
          "초기 따가움은 흔히 나타나는 반응이며 과도하면 사용 간격·양을 조절",
          "4개월 집중 → 이후 주 2회 유지로 루틴 이탈을 줄이는 설계",
          "복용제·고자극 연고 루트와 비교해 일상 적용이 쉬운 도포형 케어",
        ],
        accent: "Adherence",
      },
      {
        title: "문헌에서 확인되는 효능·내약성 방향",
        description:
          "시스테아민 5% 크림에 대한 무작위 이중맹검 위약 대조 연구(Mansouri et al., 2015)에서는 기미 병변에서 MASI 점수·멜라닌 지수 개선과 높은 환자 만족이 보고되었고, 중대한 이상반응은 관찰되지 않았다고 보고됩니다. 또한 트라넥삼산 메조테라피와의 단일맹 비교 연구(Karrabi et al., 2021)에서는 mMASI 개선이 유사하면서 합병증 빈도가 더 낮았다는 결과가 제시됩니다. 효과와 반응은 사람마다 다릅니다.",
        bullets: [
          "기미 병변 색소 지표 개선 경향이 전문지에 보고됨",
          "침습 시술 대비 부담을 줄인 비침습 대안으로서의 데이터 참고",
          "개인 피부 타입·병용 제품에 따라 결과는 달라질 수 있음",
        ],
        accent: "Evidence",
      },
      {
        title: "ODT 막 + 500 Dalton 설계로 전달을 보강",
        description:
          "국내 특허를 바탕으로 한 ODT는 막을 형성해 수분 증발을 막고 각질층 수화를 높여 성분이 스며들 환경을 만듭니다. 공기 접촉을 줄여 시스테아민 산화도 억제하고, 굴곡에 밀착되는 필름으로 일상 동작 중에도 밀착을 유지합니다. 500 Dalton 규칙에 맞춰 분자량이 작은 시스테아민(약 77 Da)을 메인에 두고, 나이아신아마이드(약 122 Da)·알부틴(약 272 Da)을 더해 피부 침투 관점에서 균형을 맞췄습니다.",
        bullets: [
          "막 형성 → 폐쇄 → 수분 보유 → 유효 성분 침투 경로 강화",
          "주사 없이 막을 통한 전달을 지향하는 Needleless MTS Film 컨셉",
          "저분자·중분자 성분을 조합해 흡수와 기능의 균형",
        ],
        accent: "ODT",
      },
      {
        title: "4단계 프로토콜과 반드시 지킬 안전 수칙",
        description:
          "세안 후 물기를 닦고 기초 제품 전, 가장 먼저 얇게(또는 병변 부위는 두껍게) 펴 바릅니다. 약 30분간 두면 투명 막이 형성되며, 가장자리부터 천천히 제거한 뒤 남은 내용은 가볍게 흡수시킵니다. 막 제거 후 물 세안 없이 이어갈 수 있는 흐름이지만, 1시간 이상 방치하면 자극·화상 위험이 있으므로 시간을 반드시 지켜야 합니다. 낮 사용은 피하고, 치료 기간 중 낮에는 자외선 차단제를 꼼꼼히 바르세요.",
        bullets: [
          "Apply → Wait(막 형성) → Peel-off → Maintain(4개월 매일, 이후 주 2회)",
          "1시간 초과 방치 금지·야간 전용·1일 1회 준수",
          "따가움이 지속되면 사용량·시간을 줄이고 필요 시 세안 후 재평가",
        ],
        accent: "How to",
      },
    ],
    faq: [
      {
        question: "처음 쓸 때 따가운데, 이상 증상인가요?",
        answer:
          "초기 도포 시 일시적인 따가움이 느껴질 수 있으며, 자료 기준으로는 대개 30분 이내 진정되는 경우가 많다고 안내합니다. 팩 제거 후에도 붉은기나 따가움이 계속되면 1시간 정도 흡수만 두고 세안한 뒤 사용을 중단하거나 간격을 넓히고, 필요하면 피부과 전문의와 상담하세요.",
      },
      {
        question: "왜 1시간 이상 두면 안 되나요?",
        answer:
          "ODT 막은 폐쇄 효과로 피부 온도·자극을 높일 수 있어, 장시간 방치 시 화상·자극 위험이 커집니다. 반드시 제품 안내의 접촉 시간을 지키고, 막이 형성된 뒤에는 가이드에 따라 제거·흡수 단계로 넘어가세요.",
      },
      {
        question: "언제 사용하는 제품인가요?",
        answer:
          "야간 전용으로 설계되었습니다. 햇빛과 반응해 감작성이 올라갈 수 있어 취침 전 루틴에만 사용하고, 낮에는 자외선 차단제를 꼼꼼히 발라 주세요.",
      },
      {
        question: "얼마나 오래 사용해야 하나요?",
        answer:
          "집중 케어로는 매일 1회를 약 4개월 권장하고, 이후에는 유지 목적으로 주 2회로 줄이는 프로토콜이 제안됩니다. 1차 평가는 약 8주, 최종 평가는 약 4개월 시점을 참고해 피부 반응을 점검하는 것이 좋습니다.",
      },
    ],
    info: [
      { label: "핵심 성분", value: "Cysteamine 5% / Niacinamide (Vitamin B3) / Arbutin" },
      { label: "제형·기술", value: "ODT(Occlusive Dressing Technique) 크림 팩 — 국내 특허 기반 막 형성" },
      { label: "용량", value: "50g" },
      { label: "권장 루틴", value: "집중: 약 4개월 매일 1회 → 유지: 주 2회" },
      { label: "필수 주의", value: "야간만 사용 · 1시간 이상 방치 금지 · 1일 1회 · 낮 자외선 차단 병행" },
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
