import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import OverviewWordBand from "@/components/overview/OverviewWordBand";
import { archiveProgramHref } from "@/lib/archive";
import type { ArchiveEntry, ArchiveProgram } from "@/types/archive";
import ArchiveEntryList from "./ArchiveEntryList";
import styles from "./Archive.module.css";

export function ArchiveProgramHeading({ program }: { program: ArchiveProgram }) {
  return (
    <div className={styles.programHeading}>
      <p className={styles.programLabel}>{program.label}</p>
      <h2>{program.title}</h2>
      {program.subtitle && <p className={styles.programSubtitle}>{program.subtitle}</p>}
      {program.period && <p className={styles.programPeriod}>{program.period}</p>}
    </div>
  );
}

export function ArchiveBackLink({ program }: { program: ArchiveProgram }) {
  return (
    <Link className={styles.backLink} href={archiveProgramHref(program)}>
      <Image src="/images/gukak/archive/arrow-back.svg" width={20} height={20} alt="" />
      <span>ARCHIVE 목록</span>
    </Link>
  );
}

export default function ArchiveShell({
  program, programs, entries, activeSlug, children,
}: {
  program: ArchiveProgram;
  programs: ArchiveProgram[];
  entries: ArchiveEntry[];
  activeSlug?: string;
  children: ReactNode;
}) {
  const detail = Boolean(activeSlug);
  return (
    <article className={`${styles.layout} ${detail ? styles.detail : styles.index}`}>
      <div className={styles.sidebarColumn}>
        <aside className={detail ? styles.detailSidebar : styles.indexSidebar} aria-label="ARCHIVE 메뉴">
          {detail ? (
            <>
              <div className={styles.detailSidebarHeading}>
                <ArchiveBackLink program={program} />
                <ArchiveProgramHeading program={program} />
              </div>
              <nav aria-label="아카이브 콘텐츠 목록">
                <ArchiveEntryList entries={entries} activeSlug={activeSlug} sidebar />
              </nav>
            </>
          ) : (
            <>
              <OverviewWordBand assetDirectory="/images/gukak/archive" />
              <h1 className={styles.archiveTitle}>ARCHIVE</h1>
              <nav className={styles.programNav} aria-label="ARCHIVE 프로그램">
                {programs.map((item) => item.enabled ? (
                  <Link
                    key={item.id}
                    href={archiveProgramHref(item)}
                    aria-current={item.id === program.id ? "page" : undefined}
                  >
                    <Image src="/images/gukak/overview-v2/nav-arrow.svg" width={35.53} height={30.8} alt="" />
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span key={item.id} className={styles.disabledProgram} role="link" aria-disabled="true">
                    <Image src="/images/gukak/overview-v2/nav-arrow.svg" width={35.53} height={30.8} alt="" />
                    <span>{item.label}</span>
                  </span>
                ))}
              </nav>
            </>
          )}
        </aside>
      </div>
      <div className={styles.content}>{children}</div>
    </article>
  );
}
