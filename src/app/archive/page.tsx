import type { Metadata } from "next";

import ArchiveEntryList from "@/components/archive/ArchiveEntryList";
import ArchiveShell, { ArchiveProgramHeading } from "@/components/archive/ArchiveShell";
import styles from "@/components/archive/Archive.module.css";
import { getArchiveData } from "@/lib/archive";
import { absoluteUrl, siteConfig } from "@/lib/site";

const title = "ARCHIVE";
const description = "국악 길라잡이 MEET UP의 실험과 만남을 기록합니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/archive") },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: absoluteUrl("/archive"),
    siteName: siteConfig.title,
    images: [siteConfig.ogImage],
    locale: "ko_KR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description, images: [siteConfig.ogImage.url] },
};

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string | string[] }>;
}) {
  const { programs, entries } = getArchiveData();
  const query = await searchParams;
  const program = programs.find((item) => item.enabled && item.id === query.program)
    ?? programs.find((item) => item.enabled)!;
  const programEntries = entries.filter((entry) => entry.program === program.id);
  return (
    <ArchiveShell program={program} programs={programs} entries={programEntries}>
      <header className={styles.indexHeading}>
        <span className={styles.rule} aria-hidden="true" />
        <ArchiveProgramHeading program={program} />
      </header>
      {programEntries.length ? <ArchiveEntryList entries={programEntries} /> : <p className={styles.empty}>준비 중입니다.</p>}
    </ArchiveShell>
  );
}
