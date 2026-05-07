export default function PrivacyPage() {
  return (
    <div className="space-y-8 pb-20">
      <section className="rounded-[36px] bg-white p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Privacy</p>
        <h1 className="headline-balance mt-4 text-4xl font-semibold text-stone-900">개인정보처리방침</h1>
        <p className="mt-4 text-sm leading-7 text-stone-500">
          시행일자: 2026년 5월 6일
        </p>
        <div className="copy-pretty mt-8 space-y-8 text-sm leading-8 text-stone-600">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">0. 개인정보처리방침 적용 대상</h2>
            <p>본 방침은 CAREIS가 운영하는 웹사이트 및 비회원 주문, 고객 문의, 결제 및 배송 관련 서비스 전반에 적용됩니다.</p>
            <p>상호: 케어이즈 / 대표자: 이명규 / 연락처: 010-2556-3263 / 이메일: startupscon@gmail.com</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">1. 개인정보의 처리 목적</h2>
            <p>케어이즈는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
            <p>1. 상품 주문 접수, 결제 확인, 배송 및 교환/반품 처리</p>
            <p>2. 고객 문의 응대 및 민원 처리</p>
            <p>3. 병원·클리닉 도입 문의 접수 및 상담 진행</p>
            <p>4. 레퍼럴 코드 기반 유입 경로 확인 및 주문 관리</p>
            <p>5. 서비스 운영 및 부정 이용 방지</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">2. 처리하는 개인정보 항목</h2>
            <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 처리할 수 있습니다.</p>
            <p>1. 주문 시: 이름, 휴대전화번호, 주소, 우편번호, 배송 메모, 결제수단 정보</p>
            <p>2. 문의 시: 이름, 연락처, 이메일, 문의 내용</p>
            <p>3. 서비스 이용 과정에서 자동 생성되는 정보: 접속 로그, 쿠키, 기기 정보, IP 주소</p>
            <p>4. 레퍼럴 운영 시: referral_code, coupon_code 등 유입 및 정산 관련 식별 정보</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">3. 개인정보의 처리 및 보유기간</h2>
            <p>
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시 동의받은
              개인정보 보유·이용기간 내에서 개인정보를 처리 및 보유합니다.
            </p>
            <p>1. 주문 및 계약 관련 기록: 전자상거래법에 따라 5년</p>
            <p>2. 대금결제 및 재화 공급에 관한 기록: 전자상거래법에 따라 5년</p>
            <p>3. 소비자 불만 또는 분쟁처리에 관한 기록: 전자상거래법에 따라 3년</p>
            <p>4. 접속 로그: 통신비밀보호법에 따라 3개월</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">4. 개인정보의 제3자 제공</h2>
            <p>
              회사는 정보주체의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 법령에 특별한
              규정이 있거나 정보주체의 별도 동의가 있는 경우에는 예외로 합니다.
            </p>
            <p>
              결제 진행 시에는 전자결제 처리 및 승인 확인을 위해 계약된 결제대행사(PG) 또는 간편결제
              사업자에게 주문번호, 결제금액, 구매자명, 연락처 등 필요한 범위의 정보가 제공될 수 있습니다.
            </p>
            <p>
              상품 배송이 필요한 경우에는 배송 수행을 위해 수취인 정보가 택배사 또는 물류 수행사에 제공될 수 있습니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">5. 개인정보 처리의 위탁</h2>
            <p>
              회사는 원활한 서비스 제공을 위해 필요한 경우 일부 업무를 외부 전문업체에 위탁할 수
              있으며, 위탁 시 관련 법령에 따라 수탁자를 관리·감독합니다.
            </p>
            <p>현재 확인 가능한 위탁 범위: 호스팅 및 시스템 운영, 결제 처리, 배송 업무, 고객상담 및 주문 처리</p>
            <p>호스팅 및 시스템 운영: Vercel</p>
            <p>실제 계약된 PG사, 택배사, 물류사 등 수탁자가 확정되는 경우 본 방침에 반영하여 고지합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">6. 정보주체의 권리·의무 및 행사방법</h2>
            <p>
              정보주체는 회사에 대해 언제든지 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를
              행사할 수 있습니다.
            </p>
            <p>
              권리 행사는 서면, 이메일 등 회사가 안내하는 방법을 통해 요청할 수 있으며, 회사는 관련
              법령에 따라 지체 없이 조치합니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">7. 개인정보의 파기 절차 및 방법</h2>
            <p>
              회사는 개인정보 보유기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는
              지체 없이 해당 개인정보를 파기합니다.
            </p>
            <p>1. 전자적 파일 형태: 복구 불가능한 기술적 방법으로 삭제</p>
            <p>2. 종이 문서 형태: 분쇄 또는 소각</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">8. 쿠키의 사용</h2>
            <p>
              회사는 서비스 이용 편의성 향상 및 레퍼럴 유입 확인을 위하여 쿠키를 사용할 수 있습니다.
            </p>
            <p>
              이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 일부 서비스 이용에
              제한이 발생할 수 있습니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">9. 개인정보의 안전성 확보조치</h2>
            <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취합니다.</p>
            <p>1. 관리적 조치: 내부관리계획 수립·시행, 접근권한 관리</p>
            <p>2. 기술적 조치: 접근 통제, 보안 프로그램 운영, 로그 관리</p>
            <p>3. 물리적 조치: 개인정보 보관 장소 접근 제한</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">10. 개인정보 보호책임자</h2>
            <p>회사는 개인정보 처리에 관한 업무를 총괄하여 책임지고 있습니다.</p>
            <p>개인정보 보호책임자: 케어이즈 운영책임자</p>
            <p>연락처: 010-2556-3263</p>
            <p>이메일: startupscon@gmail.com</p>
          </section>
        </div>
      </section>
    </div>
  );
}
