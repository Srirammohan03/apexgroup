import { SectionHeading, SectionShell } from "./SectionShell";

export function AboutGroupSection() {
  return (
    <SectionShell id="about">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
        <SectionHeading
          id="about"
          eyebrow="About Apex Group"
          title="Connecting energy, industry and mobility."
        />
        <div
          data-corporate-reveal
          className="space-y-5 text-base leading-[1.8] text-[var(--apex-text-secondary)] lg:text-lg"
        >
          <p>
            Apex Group brings together five businesses spanning bulk liquid
            transportation, alternative fuels, industrial oils and chemicals,
            automotive and industrial lubricants, and retail fuelling.
          </p>
          <p>
            From industrial supply requirements to everyday mobility, each
            division offers a distinct area of expertise. Our group brings these
            capabilities together to help customers find solutions suited to
            their operations.
          </p>
          <div className="grid grid-cols-[auto_1fr] items-center gap-5 border-t border-[var(--apex-border)] pt-6">
            <span className="font-display text-5xl font-bold text-[var(--apex-text-primary)]">
              05<span className="text-[#F28C28]">.</span>
            </span>
            <p className="text-base">
              Business divisions
              <br />
              One connected group
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
