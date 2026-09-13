import type { Metadata } from "next";
import Image from "next/image";

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
    body: "당연하게 여겨온 공급자 중심의 기획 방식을 돌아봅니다. 서로 다른 관점과 질문을 통해 생각의 경계를 넓히고, 관객 경험(CX)과 소통(Communication)이라는 새로운 시각을 더합니다.",
  },
  {
    number: "2",
    title: "BOOTCAMP",
    subtitle: "팔리는 공연의 핵심을 찾아, 진짜 '상품'으로 만듭니다.",
    body: "막연히 큰 규모를 그리기보다 지금 당장 실행 가능한 최적의 스케일에 공연의 핵심 상품성을 정의합니다. 4인 1조 팀 프로젝트로 관객이 티켓을 구매할 명확한 이유를 구체화하고 쇼케이스 무대로 구현합니다.",
  },
  {
    number: "3",
    title: "SHOW UP",
    subtitle: "관객 앞에서 자생력을 검증합니다.",
    body: "완성된 공연을 실제 관객 앞에 선보입니다. 기획 의도와 시장 반응 사이의 간극을 데이터로 확인하며, 1회성 발표에 그치지 않고 지속해서 팔리는 '자생적인 국악 비즈니스 모델'을 증명합니다.",
  },
] as const;

const pacemakers = [
  {
    number: "1",
    focus: "기획과 제작의 시선",
    name: "손혜리",
    image: "/images/gukak/overview-v2/pacemaker-son.png",
    imageWidth: 333,
    imageHeight: 500,
    imageClass: "is-son",
    bio: "여우락 페스티벌 7대 제작총감독으로, 전통공연에 서로 다른 장르와 감각을 연결해온 기획자. 익숙한 공연을 새롭게 보고, 무대의 가능성을 확장합니다.",
  },
  {
    number: "2",
    focus: "교육과 창작의 시선",
    name: "한지연",
    image: "/images/gukak/overview-v2/pacemaker-han.png",
    imageWidth: 308,
    imageHeight: 333,
    imageClass: "is-han",
    bio: "링컨센터예술교육연구소(LCI)의 TA 교육시스템을 국내 최초로 도입한 예술교육 전문가. 익숙한 답에서 벗어나, 스스로 질문하고 발견하는 과정을 만듭니다.",
  },
  {
    number: "3",
    focus: "시장과 커뮤니케이션의 시선",
    name: "권희균",
    image: "/images/gukak/overview-v2/pacemaker-kwon.png",
    imageWidth: 750,
    imageHeight: 1000,
    imageClass: "is-kwon",
    bio: "보테가 베네타, BMW MINI 등 패션·뷰티·라이프스타일 시장을 넘나든 마케팅·커뮤니케이션 전문가. 가치가 사람의 관심을 얻고, 실제 선택으로 이어지는 방식을 살핍니다.",
  },
] as const;

export default function AboutPage() {
  return (
    <article className="overview-layout">
      <div className="overview-sidebar-column">
        <aside className="overview-visual">
          <OverviewWordBand />
          <OverviewSectionNav items={sectionNav} />
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

        <section id="how-we-work" className="overview-section overview-how">
          <OverviewSectionHeader
            title="HOW WE WORK"
            subtitle="관점을 바꾸고, 상품으로 짓고, 관객 앞에 섭니다."
            accent="purple"
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
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="pace-makers" className="overview-section overview-pace">
          <OverviewSectionHeader
            title="PACE MAKERS"
            subtitle="서로 다른 영역에서 자신의 길을 만들어온 세 명의 페이스메이커가 함께 합니다."
          />

          <ol className="overview-pacemaker-list">
            {pacemakers.map((person) => (
              <li className="overview-person" key={person.number}>
                <div className="overview-person-visual">
                  <div className="overview-person-image">
                    <Image
                      className={person.imageClass}
                      src={person.image}
                      alt={`${person.name} 페이스메이커`}
                      width={person.imageWidth}
                      height={person.imageHeight}
                    />
                  </div>
                </div>
                <div className="overview-person-copy">
                  <p className="overview-person-focus">{person.focus}</p>
                  <h3>{person.name}</h3>
                  <p>{person.bio}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
