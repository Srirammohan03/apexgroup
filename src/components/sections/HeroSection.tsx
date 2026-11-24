import { ArrowDownRight } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onDirectory: () => void;
}

export function HeroSection({ onExplore, onDirectory }: HeroSectionProps) {
  return (
    <section
      id="scene-01-hero"
      className="relative min-h-[108vh] w-full flex flex-col justify-between pt-24 md:pt-28 pb-20 px-6 md:px-10 pointer-events-none"
    >
      {/* Directional theme-aware readability scrim on left 44% only */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(var(--apex-scrim-rgb), 0.88) 0%, rgba(var(--apex-scrim-rgb), 0.52) 38%, rgba(var(--apex-scrim-rgb), 0) 62%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(var(--apex-scrim-rgb), 0.92) 0%, rgba(var(--apex-scrim-rgb), 0.62) 42%, rgba(var(--apex-scrim-rgb), 0) 68%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] md:my-auto pt-4 md:pt-0">
        <div className="max-w-xl lg:max-w-[44%]">
          <p className="font-mono text-xs tracking-[0.14em] uppercase text-[#F28C28] mb-5">
            Apex Group · Connected Energy &amp; Logistics
          </p>

          <h1
            className="font-display font-bold tracking-[-0.03em] leading-[0.98] text-[var(--apex-text-primary)]"
            style={{ fontSize: 'clamp(2.4rem, 4.9vw, 4.4rem)' }}
          >
            POWERING A WORLD IN MOTION.
          </h1>

          <p className="mt-6 text-base md:text-lg text-[var(--apex-text-secondary)] max-w-md leading-relaxed">
            Five Businesses. One Vision. A Connected Energy Ecosystem.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 pointer-events-auto">
            <button
              type="button"
              onClick={onExplore}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold tracking-wide bg-[#F28C28] text-[#0B0D10] rounded-sm hover:bg-[#ff9c3d] transition-colors duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[var(--apex-text-primary)] focus-visible:outline-offset-2"
            >
              <span>Explore Our Businesses</span>
              <ArrowDownRight size={17} />
            </button>

            <button
              type="button"
              onClick={onDirectory}
              className="text-sm font-medium text-[var(--apex-text-secondary)] hover:text-[var(--apex-text-primary)] underline underline-offset-4 decoration-[var(--apex-border)] hover:decoration-[#F28C28] transition-colors cursor-pointer"
            >
              View Group Directory
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] pt-6 border-t border-[var(--apex-border)] hidden sm:flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[var(--apex-text-secondary)]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>Apex Road Lines</span>
          <span aria-hidden="true" className="opacity-35">·</span>
          <span>Apex Bio Fuel</span>
          <span aria-hidden="true" className="opacity-35">·</span>
          <span>Pranar Oils &amp; Chemicals</span>
          <span aria-hidden="true" className="opacity-35">·</span>
          <span>Apex Natural Lubes</span>
          <span aria-hidden="true" className="opacity-35">·</span>
          <span>JS Fuels</span>
        </div>
        <span className="opacity-80">Scroll to follow the fleet &amp; energy sequence</span>
      </div>
    </section>
  );
}
