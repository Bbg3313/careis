/**
 * 통신판매·PG 심사용 사업자 정보.
 * 사업자등록증·통신판매업 신고증과 문자·띄어쓰기·괄호까지 동일하게 맞춘 뒤 유지하세요.
 * (현재 값은 기존 사이트 문구를 옮겨 둔 것이며, 스캔 PDF는 자동 추출되지 않았습니다.)
 */
export const BUSINESS_INFO = {
  tradeName: "케어이즈",
  representativeName: "이명규",
  registrationNumber: "215-86-78967",
  /** 통신판매업 신고번호 */
  mailOrderReportNumber: "제2012-서울강남-01016호",
  /** 등록증상 본점(사업장) 소재지 */
  addressDesktop: "서울특별시 강남구 테헤란로43길 14, 13층(역삼동, 청수빌딩 13층)",
  /** 푸터 등 좁은 폭용 짧은 표기 */
  addressMobile: "서울 강남구 테헤란로43길 14 청수빌딩 13층",
  customerServicePhone: "010-2556-3263",
  customerServiceTelHref: "tel:01025563263",
  email: "startupscon@gmail.com",
  privacyOfficerName: "정재문",
  ntsBusinessNoConfirmUrl:
    "https://teht.hometax.go.kr/websquare/websquare.wq?w2xPath=/ui/ca/a/b/UTECAABA12.xml",
} as const;

export const BUSINESS_ORDER_FALLBACK_NAME = `${BUSINESS_INFO.tradeName} 주문` as const;

/** 개인정보처리방침 상단·고지용 한 줄 */
export function privacyCompanyNoticeLine(): string {
  const b = BUSINESS_INFO;
  return `상호: ${b.tradeName} / 대표자: ${b.representativeName} / 사업자등록번호: ${b.registrationNumber} / 사업장 주소: ${b.addressDesktop} / 연락처: ${b.customerServicePhone} / 이메일: ${b.email}`;
}

/** 교환·반품 안내 등에 쓰는 주소 + 상호 한 줄 */
export function exchangeReturnAddressWithTrade(): string {
  return `${BUSINESS_INFO.addressDesktop} ${BUSINESS_INFO.tradeName}`;
}
