"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function DesktopBandOverflow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [copiesPerSide, setCopiesPerSide] = useState(1);

  useEffect(() => {
    const track = ref.current?.parentElement;
    const canvas = track?.closest(".poster-background-pc");
    const viewport = track?.closest(".desktop-poster");
    if (!track || !canvas || !viewport) return;

    const observer = new ResizeObserver(() => {
      const cycleWidth = track.getBoundingClientRect().width / 2;
      if (cycleWidth === 0) return;

      const gutter = Math.max(
        (viewport.clientWidth - canvas.clientWidth) / 2,
        0,
      );
      // One extra cycle covers the track's inset throughout its existing loop.
      setCopiesPerSide(Math.ceil(gutter / cycleWidth) + 1);
    });
    observer.observe(track);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  // Absolute copies leave the two-cycle track width and its -50% motion unchanged.
  return (
    <div ref={ref} className="home-band-overflow">
      {Array.from({ length: copiesPerSide }, (_, index) => [-index - 1, index + 2])
        .flat()
        .map((copy) => (
          <div
            key={copy}
            className="home-band-overflow-copy"
            style={{ left: `calc(var(--home-pc-cycle) * ${copy})` }}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
