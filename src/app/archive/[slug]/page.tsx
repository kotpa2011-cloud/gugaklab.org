import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArchiveBody from "@/components/archive/ArchiveBody";
import ArchiveEntryList from "@/components/archive/ArchiveEntryList";
import ArchiveShell, { ArchiveBackLink, ArchiveProgramHeading } from "@/components/archive/ArchiveShell";
import styles from "@/components/archive/Archive.module.css";
import { formatArchiveDate, getArchiveData } from "@/lib/archive";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArchiveData().entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getArchiveData().entries.find((item) => item.slug === slug);
  if (!entry) notFound();
  const url = absoluteUrl(`/archive/${entry.slug}`);
  return {
    title: entry.title,
    description: entry.subtitle || `${entry.badge} · ${formatArchiveDate(entry.date)} · ${entry.location}`,
    alternates: { canonical: url },
    openGraph: {
      title: `${entry.title} | ${siteConfig.name}`,
      url,
      type: "article",
      images: [siteConfig.ogImage],
    },
  };
}

export default async function ArchiveDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { entries, programs } = getArchiveData();
  const entry = entries.find((item) => item.slug === slug);
  if (!entry) notFound();
  const program = programs.find((item) => item.id === entry.program)!;
  const programEntries = entries.filter((item) => item.program === program.id);
  return (
    <ArchiveShell program={program} programs={programs} entries={programEntries} activeSlug={entry.slug}>
      <header className={styles.articleHeading}>
        <span className={styles.rule} aria-hidden="true" />
        <p className={styles.articleBadge}>{entry.badge}</p>
        <h1>{entry.title}</h1>
        <p className={styles.dateLocation}>
          <time dateTime={entry.date}>{formatArchiveDate(entry.date)}</time>
          {entry.location && <span>{entry.location}</span>}
        </p>
        {entry.subtitle && <p className={styles.articleSubtitle}>{entry.subtitle}</p>}
      </header>
      <ArchiveBody markdown={entry.body} />
      <nav className={styles.mobileRelated} aria-label="다른 아카이브 콘텐츠">
        <ArchiveBackLink program={program} />
        <ArchiveProgramHeading program={program} />
        <ArchiveEntryList entries={programEntries} activeSlug={entry.slug} sidebar />
      </nav>
    </ArchiveShell>
  );
}
