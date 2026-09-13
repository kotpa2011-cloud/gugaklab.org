"use client";

import { useEffect, useRef } from "react";

const FOOTER_HEIGHT = 130;

type HomeFooterProps = {
  variant?: "overlay" | "static";
};

export default function HomeFooter({ variant = "overlay" }: HomeFooterProps) {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (variant === "static") return;

    const footer = footerRef.current;
    if (!footer) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const updatePosition = () => {
      animationFrame = 0;
      const availableScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      );
      const revealDistance = Math.min(FOOTER_HEIGHT, availableScroll);
      const progress = revealDistance > 0
        ? Math.min(Math.max(window.scrollY / revealDistance, 0), 1)
        : 0;
      const translateY = reducedMotion.matches
        ? progress === 1
          ? 0
          : 100
        : (1 - progress) * 100;

      footer.style.transform = `translate3d(0, ${translateY}%, 0)`;
    };

    const requestPositionUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener("scroll", requestPositionUpdate, { passive: true });
    window.addEventListener("resize", requestPositionUpdate);
    reducedMotion.addEventListener("change", requestPositionUpdate);

    return () => {
      window.removeEventListener("scroll", requestPositionUpdate);
      window.removeEventListener("resize", requestPositionUpdate);
      reducedMotion.removeEventListener("change", requestPositionUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [variant]);

  return (
    <footer
      ref={footerRef}
      className={`home-footer${variant === "static" ? " is-static" : ""}`}
      aria-label="전통공연예술진흥재단 정보"
      data-node-id="15:58692"
    >
      <p className="home-footer-name" data-node-id="16:58696">
        (재)전통공연예술진흥재단
      </p>

      <div className="home-footer-info" data-node-id="16:58714">
        <p className="home-footer-address" data-node-id="16:58698">
          서울 서초구 남부순환로 2364 (서초동)국립국악원 국악연수관 1층
        </p>
        <div className="home-footer-contacts" data-node-id="16:58713">
          <p data-node-id="16:58702">
            <strong data-node-id="16:58700">대표</strong>
            <span data-node-id="16:58701"> : 배영호</span>
          </p>
          <p data-node-id="16:58703">
            <strong data-node-id="16:58704">T.</strong>
            <span data-node-id="16:58705"> 02-580-3280</span>
          </p>
          <p data-node-id="16:58710">
            <strong data-node-id="16:58711">E.</strong>
            <span data-node-id="16:58712"> webmaster@kotpa.org</span>
          </p>
        </div>
      </div>

      <p className="home-footer-copyright" data-node-id="16:58699">
        © 2026 Korean Traditional Performing Arts Foundation. All Rights Reserved.
      </p>
    </footer>
  );
}
