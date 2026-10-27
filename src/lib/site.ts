/**
 * 사이트 전역 정보.
 * 사이트명, 설명, 메뉴 이름을 바꿀 때는 이 파일만 수정하면 됩니다.
 */
export const SITE_URL = "https://www.gugaklab.org/";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export const siteConfig = {
  name: "국악 길라잡이",
  title: "국악 길라잡이: 비즈니스 랩",
  description:
    "예술의 바깥에서 새로운 국악의 무대를 만드는 국악 길라잡이 비즈니스 랩입니다.",
  url: SITE_URL,
  ogImage: {
    url: absoluteUrl("/images/og-image.jpg"),
    width: 1230,
    height: 630,
  },
} as const;

/** Header / Footer 공통 메뉴 */
export const mainNav = [
  { href: "/about", label: "OVERVIEW", disabled: false },
  { href: "/archive", label: "ARCHIVE", disabled: false },
] as const;
