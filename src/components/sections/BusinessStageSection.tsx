import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { BusinessEntity } from "../../data/businesses";

interface BusinessStageSectionProps {
  id: string;
  business: BusinessEntity;
  variant: "intro" | "capabilities";
  nextLabel: string;
  onNextScene: () => void;
}

export function BusinessStageSection({
  id,
  business,
  variant,
  nextLabel,
  onNextScene,
}: BusinessStageSectionProps) {
  const isIntro = variant === "intro";
  const headline = isIntro
    ? business.introHeadline
    : business.capabilitiesHeadline;
  const bodyCopy = isIntro ? business.summary : business.capabilitiesSummary;
  const listItems = isIntro
    ? business.focusAreas
    : business.capabilityHighlights;
  const products = isIntro ? [] : (business.productCategories ?? []);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="relative isolate w-full min-h-[100svh] pointer-events-none"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden lg:block"
        style={{
          background: `linear-gradient(${isIntro ? 90 : 270}deg, rgba(var(--apex-scrim-rgb), .98) 0%, rgba(var(--apex-scrim-rgb), .88) 25%, rgba(var(--apex-scrim-rgb), .55) 42%, rgba(var(--apex-scrim-rgb), 0) 53%)`,
        }}
      />
      <div className="relative z-10 mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:min-h-[100svh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-10 lg:px-12 lg:pt-24 lg:pb-28 xl:gap-16 xl:px-16 2xl:px-20">
        <div
          aria-hidden="true"
          data-model-slot
          className={`order-1 h-[max(340px,58svh)] w-full sm:h-[max(400px,58svh)] lg:h-auto lg:min-h-[60svh] ${isIntro ? "lg:order-2" : "lg:order-1"}`}
        />
        <div
          className={`relative isolate order-2 min-w-0 w-full px-5 pb-24 pt-8 sm:px-8 lg:max-w-[650px] lg:px-0 lg:py-5 ${isIntro ? "lg:order-1 lg:justify-self-start" : "lg:order-2 lg:justify-self-end"}`}
        >
          <div
            aria-hidden="true"
            className="absolute -top-8 inset-x-0 bottom-0 -z-10 lg:hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(var(--apex-scrim-rgb), 0), rgba(var(--apex-scrim-rgb), 1) 40px)",
            }}
          />
          <div className="mb-4 flex items-start gap-3 lg:mb-5">
            <span className="mt-[9px] h-px w-6 shrink-0 bg-[#F28C28] sm:w-9" />
            <p className="min-w-0 font-mono text-[11px] font-medium uppercase leading-relaxed tracking-[.12em] text-[#F28C28] sm:text-xs">
              <span className="tabular-nums">{business.index}</span>
              <span aria-hidden="true"> / </span>
              {business.name}
            </p>
          </div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[.1em] leading-relaxed text-[var(--apex-text-secondary)] sm:text-sm">
            {business.sector}
          </p>
          <h2
            id={`${id}-heading`}
            className="font-display text-[clamp(1.95rem,7.8vw,3.3rem)] font-bold leading-[1.07] tracking-[-.035em] text-[var(--apex-text-primary)] lg:text-[clamp(2.25rem,3.15vw,3.75rem)]"
          >
            {headline}
          </h2>
          <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.75] text-[var(--apex-text-secondary)] sm:text-base xl:text-[17px]">
            {bodyCopy}
          </p>
          <div className="mt-6 border-t border-[var(--apex-border)] pt-5 lg:mt-7">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[.13em] text-[var(--apex-text-secondary)]">
              {isIntro ? "Our focus" : "Applications & capabilities"}
            </h3>
            <ul className="space-y-3">
              {listItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[var(--apex-text-primary)] sm:text-[15px] xl:text-base"
                >
                  <Check
                    aria-hidden="true"
                    size={17}
                    strokeWidth={2}
                    className="mt-[3px] shrink-0 text-[#F28C28]"
                  />
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {products.length > 0 && (
            <div className="mt-6 border-t border-[var(--apex-border)] pt-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[.13em] text-[var(--apex-text-secondary)]">
                Product categories
              </h3>
              <ul className="flex flex-wrap gap-2">
                {products.map((product) => (
                  <li
                    key={product}
                    className="rounded-sm border border-[var(--apex-border)] bg-[var(--apex-surface)] px-3 py-2 text-xs font-medium leading-relaxed text-[var(--apex-text-primary)] sm:text-sm"
                  >
                    {product}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="pointer-events-auto mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-8">
            <button
              type="button"
              onClick={onNextScene}
              className="group inline-flex min-h-[50px] items-center justify-between gap-4 rounded-md bg-[#F28C28] px-5 py-3 text-sm font-semibold leading-snug text-[#111418] transition-colors hover:bg-[#FF9F43] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F28C28]"
            >
              <span>{nextLabel}</span>
              <ArrowRight
                aria-hidden="true"
                size={18}
                className="shrink-0 transition-transform motion-safe:group-hover:translate-x-1"
              />
            </button>
            <a
              href={business.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${business.name} website (opens in a new tab)`}
              className="group inline-flex min-h-[50px] items-center justify-between gap-4 rounded-md border border-[var(--apex-border)] px-5 py-3 text-sm font-semibold leading-snug text-[var(--apex-text-primary)] transition-colors hover:border-[#F28C28] hover:text-[#F28C28] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F28C28]"
            >
              Visit Business Website{" "}
              <ArrowUpRight aria-hidden="true" size={17} className="shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
