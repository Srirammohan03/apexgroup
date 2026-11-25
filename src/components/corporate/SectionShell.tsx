import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SectionShell({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (!ref.current) return;
      const items = ref.current.querySelectorAll("[data-corporate-reveal]");
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 94%", once: true },
            clearProps: "transform,opacity",
          },
        );
      });
    });
    return () => media.revert();
  }, []);
  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 border-b border-[var(--apex-border)]"
    >
      <div className="mx-auto w-full max-w-[1680px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28 xl:px-16 2xl:px-20">
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div data-corporate-reveal className="mb-8 max-w-3xl sm:mb-12">
      <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.14em] text-[var(--apex-text-primary)]">
        <span className="h-0.5 w-8 bg-[#F28C28]" />
        {eyebrow}
      </p>
      <h2
        id={`${id}-heading`}
        className="font-display text-[clamp(1.85rem,4vw,3.6rem)] font-bold leading-[1.08] tracking-tight text-[var(--apex-text-primary)]"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--apex-text-secondary)] lg:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
