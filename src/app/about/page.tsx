import type { Metadata } from "next";
import styles from "./Overview.module.css";

import NumberDisc from "@/components/overview/NumberDisc";
import OverviewSectionHeader from "@/components/overview/OverviewSectionHeader";
import OverviewSectionNav from "@/components/overview/OverviewSectionNav";
import OverviewWordBand from "@/components/overview/OverviewWordBand";
import { absoluteUrl, siteConfig } from "@/lib/site";

const title = "OVERVIEW";
const description = "국악 길라잡이 비즈니스 랩의 관점과 과정, 페이스메이커를 소개합니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: absoluteUrl("/about"),
    siteName: siteConfig.title,
    images: [siteConfig.ogImage],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
    images: [siteConfig.ogImage.url],
  },
};

const sectionNav = [
  { href: "#about", label: "ABOUT" },
  { href: "#human-scale-concert", label: "HUMAN SCALE CONCERT" },
  { href: "#how-we-work", label: "HOW WE WORK" },
  { href: "#pace-makers", label: "PACE MAKERS" },
] as const;

const aboutParagraphGroups = [
  [
    "<국악길라잡이 : 비즈니스 랩>은 예술성을 지키면서도, 국악이 시장에서 지속 가능한 '상품'으로 살아남는 새로운 문법을 실험합니다.",
    "관객의 선택은 단지 객석을 채우는 데 그치지 않습니다. 예술가가 다음 무대를 스스로 이어갈 수 있는 자생력을 만듭니다.",
  ],
  [
    "국악길라잡이는 창작자의 관점에 시장 친화적인 시선을 더합니다. 공연을 순수 작품에 머무르게 하지 않고, 관객이 기꺼이 시간과 비용을 지불할 가치가 있는 '매력적인 문화상품'으로 다시 바라봅니다.",
    "우리는 시장을 예술의 반대편에 두지 않습니다. 시장은 예술이 소비자와 만나 지속 가능한 생명력을 얻는 가장 중요한 무대입니다.",
  ],
] as const;

const workSteps = [
  {
    number: "1",
    title: "MEET UP",
    subtitle: "익숙한 창작의 틀에서 벗어납니다",
    body: ["당연하게 여겨온 공급자 중심의 기획 방식을 돌아봅니다.", "서로 다른 관점과 질문을 통해 생각의 경계를 넓히고, 관객 경험(CX)과 소통(Communication)이라는 새로운 시각을 더합니다."],
  },
  {
    number: "2",
    title: "BOOT CAMP",
    subtitle: "팔리는 공연의 핵심을 찾아, 진짜 '상품'으로 만듭니다.",
    body: ["막연히 큰 규모를 그리기보다 지금 당장 실행 가능한 최적의 스케일에 공연의 핵심 상품성을 정의합니다.", "4인 1조 팀 프로젝트로 관객이 티켓을 구매할 명확한 이유를 구체화하고 쇼케이스 무대로 구현합니다."],
  },
  {
    number: "3",
    title: "SHOW UP",
    subtitle: "관객 앞에서 자생력을 검증합니다.",
    body: ["완성된 공연을 실제 관객 앞에 선보입니다. 기획 의도와 시장 반응 사이의 간극을 데이터로 확인하며,", "1회성 발표에 그치지 않고 지속해서 팔리는 '자생적인 국악 비즈니스 모델'을 증명합니다."],
  },
] as const;

// OVERVIEW 콘텐츠: 이름, 전문 분야, 소개 문구를 이곳에서 수정합니다.
const humanScaleConcert = {
  title: "오늘의 박수가 다음 무대로 이어지도록",
  subtitle: "비즈니스 모델 ‘휴먼 스케일 콘서트’",
  body: "좋은 공연이 계속되려면 수익이 이어지는 구조가 필요합니다. 국악 본연의 자연 음향과 관객과 나누는 친근한 호흡은 살리고, 기획∙제작의 부담은 가볍게. 관객이 찾고, 창작자가 꾸준히 선보일 수 있는 비즈니스 모델을 실험하며 국악 공연의 다음을 모색합니다.",
};

const pacemakerGroups = [
  {
    title: "MEET UP",
    people: [
      { name: "손혜리", focus: "공연 기획", bio: ["여우락 페스티벌 제작 총감독", "전 경기아트센터 사장"] },
      { name: "한지연", focus: "경험 설계", bio: ["현 서울문화재단 예술문화본부장", "LCI TA 교육시스템 국내 최초 도입"] },
      { name: "권희균", focus: "마케팅 커뮤니케이션", bio: ["프리미엄 마케팅 전문가", "까르띠에 · 제네시스 · BMW 등", "브랜드 마케팅"] },
      { name: "조신애", focus: "마케팅 커뮤니케이션", bio: ["웹진 <월간 공진단> 론칭", "국립심포니오케스트라 리브랜딩 총괄"] },
    ],
  },
  {
    title: "BOOT CAMP",
    people: [
      { name: "임선경", focus: "기획 · 연출", bio: ["음악극 ‘정조와 햄릿’,", "오페라 ‘이상의 날개', ‘논개' 등 연출"] },
      { name: "김영교", focus: "음향", bio: ["국민대학교 종합예술대학원", "디지털 음향 전공 겸임교수"] },
      { name: "김지은", focus: "기획 · 연출", bio: ["뮤지컬 <앨리스 스튜디오> 작, 연출", "<여기에는 메데이아가 없습니다>", "구성, 연출"] },
      { name: "최은지", focus: "도슨트", bio: ["해금연주자", "국가무형유산 종묘제례악 이수자", "휴먼스케일 옹기콘서트 <판소리>편 도슨트"] },
      { name: "장윤희", focus: "마케팅 커뮤니케이션", bio: ["전통 문화예술 연구가", "한국문화 콘텐츠랩 열두달(주) 대표", "‘모두의 풍류' 브랜드 마케팅"] },
    ],
  },
] as const;

export default function AboutPage() {
  return (
    <article className={`overview-layout ${styles.layout}`}>
      <div className="overview-sidebar-column">
        <aside className="overview-visual">
          <OverviewWordBand />
          <p className={styles.mobileTitle}>OVERVIEW</p>
          <OverviewSectionNav items={sectionNav} compact />
        </aside>
      </div>

      <div className="overview-content">
        <section id="about" className="overview-section overview-about">
          <OverviewSectionHeader
            title="ABOUT"
            subtitle="예술의 바깥, 선택의 무대"
            accent="yellow"
            level={1}
          />
          <div className="overview-about-copy">
            {aboutParagraphGroups.map((group) => (
              <div className="overview-about-copy-group" key={group[0]}>
                {group.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section id="human-scale-concert" className={`overview-section ${styles.concert}`}>
          <OverviewSectionHeader title={humanScaleConcert.title} subtitle={humanScaleConcert.subtitle} accent="purple" />
          <p className={styles.concertBody}>{humanScaleConcert.body}</p>
        </section>

        <section id="how-we-work" className="overview-section overview-how">
          <OverviewSectionHeader
            title="HOW WE WORK"
            subtitle="관점을 바꾸고, 상품으로 짓고, 관객 앞에 섭니다."
            accent="yellow"
          />
          <ol className="overview-work-list">
            {workSteps.map((step) => (
              <li className="overview-work-item" key={step.number}>
                <NumberDisc>{step.number}</NumberDisc>
                <div className="overview-work-copy">
                  <h3>
                    <span>{step.title}</span>
                    <span>{step.subtitle}</span>
                  </h3>
                  <p>{step.body.map((sentence, index) => (
                    <span className={styles.workSentence} key={sentence}>{index > 0 && " "}{sentence}</span>
                  ))}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="pace-makers" className="overview-section overview-pace">
          <OverviewSectionHeader
            title="PACE MAKERS"
            subtitle="서로 다른 영역에서 자신의 길을 만들어온 페이스메이커(전문가)가 함께 합니다."
          />

          <div className={styles.expertGroups}>
            {pacemakerGroups.map((group) => (
              <section className={styles.expertGroup} key={group.title}>
                <h3 className={styles.groupTitle}>{`<${group.title}>`}</h3>
                <ul className={styles.expertGrid}>
                  {group.people.map((person) => (
                    <li className={styles.expert} key={person.name}>
                      <div className={styles.expertHeading}>
                        <h4>{person.name}</h4>
                        <p>{person.focus}</p>
                      </div>
                      <div className={styles.expertBio}>
                        {person.bio.map((line) => <p key={line}>{line}</p>)}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
