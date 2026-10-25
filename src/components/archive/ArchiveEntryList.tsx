import Image from "next/image";
import Link from "next/link";

import { archiveEntryHref } from "@/lib/archive";
import type { ArchiveEntry } from "@/types/archive";
import styles from "./Archive.module.css";

export default function ArchiveEntryList({
  entries, activeSlug, sidebar = false,
}: {
  entries: ArchiveEntry[];
  activeSlug?: string;
  sidebar?: boolean;
}) {
  return (
    <ul className={`${styles.entryList}${sidebar ? ` ${styles.sidebarList}` : ""}`}>
      {entries.map((entry, index) => (
        <li key={entry.id}>
          <Link
            className={styles.entry}
            href={archiveEntryHref(entry)}
            aria-current={entry.slug === activeSlug ? "page" : undefined}
          >
            <span className={styles.badge} data-repeated={!sidebar && entries[index - 1]?.badge === entry.badge || undefined} data-intro={entry.badge.toUpperCase() === "INTRO" || undefined}>
              {entry.badge}
            </span>
            <span className={styles.entryTitle}>{entry.listTitle}</span>
            <Image
              className={styles.entryArrow}
              src={`/images/gukak/archive/arrow-${sidebar ? "black" : "muted"}.svg`}
              width={28}
              height={24}
              alt=""
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
