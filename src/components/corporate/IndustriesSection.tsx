import { Truck, Factory, CarFront, Leaf } from "lucide-react";
import { SectionHeading, SectionShell } from "./SectionShell";
import { INDUSTRY_SECTORS } from "@/src/data/businesses";

const icons = [Truck, Factory, CarFront, Leaf];
export function IndustriesSection() {
  return (
    <SectionShell id="industries">
      <SectionHeading
        id="industries"
        eyebrow="Industries we serve"
        title="Solutions for the industries that keep the world moving."
        description="Discover how our business divisions address different transportation, manufacturing, mobility and energy requirements."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
        {INDUSTRY_SECTORS.map((sector, idx) => {
          const Icon = icons[idx] ?? Factory;
          return (
            <article
              data-corporate-reveal
              key={sector.index}
              className="flex min-w-0 flex-col rounded-xl border border-[var(--apex-border)] apex-theme-surface p-5 sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <Icon
                  size={30}
                  strokeWidth={1.5}
                  className="text-[#F28C28]"
                  aria-hidden="true"
                />
                <span className="font-mono text-xs text-[var(--apex-text-secondary)]">
                  {sector.index}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold sm:text-2xl">
                {sector.title}
              </h3>
              <p className="mb-6 mt-3 text-base leading-relaxed text-[var(--apex-text-secondary)]">
                {sector.description}
              </p>
              <div className="mt-auto border-t border-[var(--apex-border)] pt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider">
                  Related businesses
                </p>
                <div className="flex flex-wrap gap-2">
                  {sector.alignedDivisions.map((name) => (
                    <span
                      key={name}
                      className="rounded border border-[var(--apex-border)] px-3 py-1.5 text-xs leading-relaxed text-[var(--apex-text-secondary)]"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
