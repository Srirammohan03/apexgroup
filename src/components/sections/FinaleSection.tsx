import { ArrowDownRight } from 'lucide-react';

interface FinaleSectionProps {
  onExploreDirectory: () => void;
}

export function FinaleSection({ onExploreDirectory }: FinaleSectionProps) {
  return (
    <section
      id="scene-12-finale"
      className="relative min-h-[110vh] w-full flex items-end md:items-center pt-28 pb-24 px-6 md:px-10 pointer-events-none"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(var(--apex-scrim-rgb), 0.88) 0%, rgba(var(--apex-scrim-rgb), 0.5) 38%, rgba(var(--apex-scrim-rgb), 0) 64%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{
          background:
            'linear-gradient(0deg, rgba(var(--apex-scrim-rgb), 0.96) 0%, rgba(var(--apex-scrim-rgb), 0.72) 48%, rgba(var(--apex-scrim-rgb), 0) 76%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <div className="w-full md:max-w-[42%] pt-[42vh] md:pt-0">
          <p className="font-mono text-xs tracking-[0.14em] uppercase text-[#F28C28] mb-4">
            Group Ecosystem
          </p>

          <h2
            className="font-display font-bold tracking-tight text-[var(--apex-text-primary)] leading-[1.03]"
            style={{ fontSize: 'clamp(2.1rem, 3.8vw, 3.5rem)' }}
          >
            Five Businesses. One Connected Future.
          </h2>

          <p className="mt-5 text-base md:text-lg text-[var(--apex-text-secondary)] leading-relaxed">
            From regional petroleum tanker logistics and industrial biofuels to
            specialty chemicals, formulated lubricants, and forecourt fuel
            dispensing—Apex Group integrates supply, processing, and last-mile
            delivery.
          </p>

          <div className="mt-8 pointer-events-auto">
            <button
              type="button"
              onClick={onExploreDirectory}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold tracking-wide bg-[#F28C28] text-[#0B0D10] rounded-sm hover:bg-[#ff9c3d] transition-colors duration-150 cursor-pointer whitespace-nowrap"
            >
              <span>Explore Our Businesses</span>
              <ArrowDownRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
