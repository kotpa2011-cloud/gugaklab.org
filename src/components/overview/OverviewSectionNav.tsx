"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";

type OverviewSectionNavProps = {
  compact?: boolean;
  items: ReadonlyArray<{ href: string; label: string }>;
};

const DESKTOP_MEDIA = "(min-width: 1101px)";
// Where a section lands when jumped to via nav click / URL hash (matches the
// `.overview-section` scroll-margin-top in globals.css) — a design/layout value,
// left untouched.
const NAV_SCROLL_OFFSET = 144;
// Where the *next* section is considered "entered" during normal scrolling, i.e.
// how far down the viewport its top edge can still be while switching the active
// nav item. Larger = earlier activation. Kept separate from NAV_SCROLL_OFFSET so
// scroll-spy timing can be tuned without moving where clicks/hash jumps land.
const ACTIVATION_LINE = 280;
const ACTIVATION_HYSTERESIS = 28;
const LOCK_TIMEOUT = 1800;

export default function OverviewSectionNav({ items, compact = false }: OverviewSectionNavProps) {
  const sectionIds = useMemo(() => items.map((item) => item.href.replace(/^#/, "")), [items]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const lastScrollYRef = useRef(0);
  const lockedTargetRef = useRef<string | null>(null);
  const lockTimeoutRef = useRef<number | null>(null);
  const syncFromPositionRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MEDIA);
    let resizeTimer: number | null = null;
    let scrollTimer: number | null = null;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const updateActive = (id: string, updateHash = true) => {
      activeIdRef.current = id;
      setActiveId(id);
      if (updateHash && window.location.hash !== `#${id}`) {
        window.history.replaceState(null, "", `#${id}`);
      }
    };

    const syncFromPosition = () => {
      if (!media.matches || sections.length === 0) return;

      const isScrollingDown = window.scrollY >= lastScrollYRef.current;
      let currentIndex = sections.findIndex((section) => section.id === activeIdRef.current);

      if (currentIndex < 0) {
        currentIndex = 0;
        for (let index = 0; index < sections.length; index += 1) {
          if (sections[index].getBoundingClientRect().top <= ACTIVATION_LINE) currentIndex = index;
          else break;
        }
      } else if (isScrollingDown) {
        const downLine = ACTIVATION_LINE - ACTIVATION_HYSTERESIS;
        while (
          currentIndex < sections.length - 1 &&
          sections[currentIndex + 1].getBoundingClientRect().top <= downLine
        ) {
          currentIndex += 1;
        }
      } else {
        const upLine = ACTIVATION_LINE + ACTIVATION_HYSTERESIS;
        while (
          currentIndex > 0 &&
          sections[currentIndex].getBoundingClientRect().top >= upLine
        ) {
          currentIndex -= 1;
        }
      }

      lastScrollYRef.current = window.scrollY;
      updateActive(sections[currentIndex].id);
    };

    syncFromPositionRef.current = syncFromPosition;

    const clearLock = () => {
      lockedTargetRef.current = null;
      if (lockTimeoutRef.current !== null) {
        window.clearTimeout(lockTimeoutRef.current);
        lockTimeoutRef.current = null;
      }
    };

    const setupObserver = () => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!media.matches || sections.length === 0) {
        clearLock();
        activeIdRef.current = null;
        setActiveId(null);
        return;
      }

      const bottomInset = Math.max(window.innerHeight - ACTIVATION_LINE - 2, 0);
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const lockedTarget = lockedTargetRef.current;
          if (lockedTarget) {
            const targetReached = entries.some(
              (entry) => entry.target.id === lockedTarget && entry.isIntersecting,
            );
            if (targetReached) {
              clearLock();
              updateActive(lockedTarget);
            }
            return;
          }

          if (entries.some((entry) => entry.isIntersecting)) syncFromPosition();
        },
        {
          root: null,
          rootMargin: `-${ACTIVATION_LINE}px 0px -${bottomInset}px 0px`,
          threshold: 0,
        },
      );

      sections.forEach((section) => observerRef.current?.observe(section));

      const hashId = window.location.hash.replace(/^#/, "");
      if (sectionIds.includes(hashId)) updateActive(hashId, false);
      else syncFromPosition();
    };

    const handleResize = () => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setupObserver, 120);
    };

    const handleScroll = () => {
      if (!media.matches || lockedTargetRef.current) return;
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(syncFromPosition, 80);
    };

    const handleHashChange = () => {
      if (!media.matches) return;
      const hashId = window.location.hash.replace(/^#/, "");
      if (sectionIds.includes(hashId)) updateActive(hashId, false);
      else syncFromPosition();
    };

    setupObserver();
    media.addEventListener("change", setupObserver);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      observerRef.current?.disconnect();
      media.removeEventListener("change", setupObserver);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
      clearLock();
      syncFromPositionRef.current = () => undefined;
    };
  }, [sectionIds]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!window.matchMedia(DESKTOP_MEDIA).matches) return;

    const targetId = href.replace(/^#/, "");
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    activeIdRef.current = targetId;
    lastScrollYRef.current = window.scrollY;
    lockedTargetRef.current = targetId;
    setActiveId(targetId);
    window.history.pushState(null, "", href);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targetTop = window.scrollY + target.getBoundingClientRect().top - NAV_SCROLL_OFFSET;
    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    if (lockTimeoutRef.current !== null) window.clearTimeout(lockTimeoutRef.current);
    lockTimeoutRef.current = window.setTimeout(() => {
      lockedTargetRef.current = null;
      lockTimeoutRef.current = null;
      syncFromPositionRef.current();
    }, LOCK_TIMEOUT);
  };

  return (
    <nav className="overview-section-nav" aria-label="OVERVIEW 페이지 목차">
      {items.map((item) => {
        const sectionId = item.href.replace(/^#/, "");
        const isActive = activeId === sectionId;

        return (
          <a
            href={item.href}
            aria-current={isActive ? "location" : undefined}
            onClick={(event) => handleClick(event, item.href)}
            key={item.href}
          >
            <span className="overview-nav-arrow" aria-hidden="true">
              {compact && <Image className="is-compact" src="/images/gukak/overview-v2/nav-arrow-compact.svg" alt="" width={23} height={21} />}
              <Image
                className="is-default"
                src="/images/gukak/overview-v2/nav-arrow.svg"
                alt=""
                width={36}
                height={31}
              />
              <Image
                className="is-active-hover"
                src="/images/gukak/overview-v2/nav-arrow-active-hover.svg"
                alt=""
                width={36}
                height={31}
              />
            </span>
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
