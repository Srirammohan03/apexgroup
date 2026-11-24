import { ArrowRight, ExternalLink } from 'lucide-react';
import type { BusinessEntity } from '../../data/businesses';

interface BusinessStageSectionProps {
  id: string;
  business: BusinessEntity;
  variant: 'intro' | 'capabilities';
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
  const isIntro = variant === 'intro';
  const alignRight = !isIntro;

  const headline = isIntro ? business.introHeadline : business.capabilitiesHeadline;
  const bodyCopy = isIntro ? business.summary : business.capabilitiesSummary;
  const listItems = isIntro ? business.focusAreas : business.capabilityHighlights;
  const showProductRange = !isIntro && business.productCategories && business.productCategories.length > 0;

  return (
    <section
      id={id}
      className="relative min-h-[115vh] w-full flex items-end md:items-center pt-28 pb-24 px-6 md:px-10 pointer-events-none"
    >
      {/* Desktop directional scrim strictly behind content half (left 40% or right 40%) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background: alignRight
            ? 'linear-gradient(270deg, rgba(var(--apex-scrim-rgb), 0.90) 0%, rgba(var(--apex-scrim-rgb), 0.56) 38%, rgba(var(--apex-scrim-rgb), 0) 64%)'
            : 'linear-gradient(90deg, rgba(var(--apex-scrim-rgb), 0.90) 0%, rgba(var(--apex-scrim-rgb), 0.56) 38%, rgba(var(--apex-scrim-rgb), 0) 64%)',
        }}
      />

      {/* Mobile bottom scrim keeping upper 44vh completely unobstructed for 3D visual */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{
          background:
            'linear-gradient(0deg, rgba(var(--apex-scrim-rgb), 0.96) 0%, rgba(var(--apex-scrim-rgb), 0.78) 48%, rgba(var(--apex-scrim-rgb), 0) 76%)',
        }}
      />

      <div
        className={`relative z-10 mx-auto w-full max-w-[1440px] flex ${
          alignRight ? 'justify-end' : 'justify-start'
        }`}
      >
        <div className="w-full md:max-w-[42%] lg:max-w-[39%] pt-[42vh] md:pt-0">
          <div className="flex items-center gap-3 font-mono text-xs tracking-wider uppercase text-[#F28C28] mb-3">
            <span className="tabular-nums">{business.index}</span>
            <span aria-hidden="true">·</span>
            <span>{business.name}</span>
          </div>

          <h2
            className="font-display font-bold tracking-tight text-[var(--apex-text-primary)] leading-[1.04]"
            style={{ fontSize: 'clamp(1.9rem, 3.4vw, 3.1rem)' }}
          >
            {headline}
          </h2>

          <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[var(--apex-text-secondary)]">
            {business.sector}
          </p>

          <p className="mt-4 text-sm md:text-base text-[var(--apex-text-secondary)] leading-relaxed">
            {bodyCopy}
          </p>

          <ul className="mt-6 space-y-2.5 border-t border-[var(--apex-border)] pt-5">
            {listItems.map((item, idx) => (
              <li
                key={item}
                className="flex items-baseline gap-3.5 text-sm text-[var(--apex-text-primary)]"
              >
                <span className="font-mono text-xs text-[#F28C28] tabular-nums shrink-0">
                  0{idx + 1}.
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {showProductRange && (
            <div className="mt-6 pt-4 border-t border-[var(--apex-border)]">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--apex-text-secondary)] mb-2">
                Verified Portfolio
              </p>
              <p className="font-mono text-xs text-[var(--apex-text-primary)] leading-relaxed">
                {business.productCategories!.join('  ·  ')}
              </p>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-5 pointer-events-auto">
            <button
              type="button"
              onClick={onNextScene}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider bg-[var(--apex-surface)] border border-[var(--apex-border)] text-[var(--apex-text-primary)] hover:border-[#F28C28] rounded-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{nextLabel}</span>
              <ArrowRight size={15} className="text-[#F28C28]" />
            </button>

            <a
              href={business.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--apex-text-secondary)] hover:text-[#F28C28] transition-colors whitespace-nowrap"
            >
              <span>{business.domainLabel}</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
