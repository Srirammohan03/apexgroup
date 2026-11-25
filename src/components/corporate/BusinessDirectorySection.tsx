import { useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SectionHeading, SectionShell } from "./SectionShell";
import { APEX_BUSINESSES } from "@/src/data/businesses";

export function BusinessDirectorySection({
  onJumpToBusinessScene,
}: {
  onJumpToBusinessScene: (sceneIndex: number) => void;
}) {
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const active = APEX_BUSINESSES[selected];
  return (
    <SectionShell id="businesses">
      <SectionHeading
        id="businesses"
        eyebrow="Our businesses"
        title="Five specialist businesses. One group."
        description="Explore our divisions and discover the products and services relevant to your requirements."
      />
      <div className="grid min-w-0 gap-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
        <div
          data-corporate-reveal
          className="min-w-0 divide-y divide-[var(--apex-border)] border-y border-[var(--apex-border)]"
        >
          {APEX_BUSINESSES.map((biz, idx) => (
            <div key={biz.id} className="py-5 sm:py-6">
              <button
                type="button"
                aria-expanded={selected === idx}
                aria-controls={`directory-${biz.id}`}
                onClick={() => setSelected(idx)}
                className="group flex w-full min-w-0 items-start gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F28C28] sm:gap-5"
              >
                <span
                  className={`shrink-0 font-mono text-sm ${selected === idx ? "text-[#F28C28]" : "text-[var(--apex-text-secondary)]"}`}
                >
                  {biz.index}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block break-words font-display text-xl font-semibold leading-tight sm:text-2xl">
                    {biz.name}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-[var(--apex-text-secondary)]">
                    {biz.sector}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className={`shrink-0 transition-colors ${selected === idx ? "text-[#F28C28]" : "text-[var(--apex-text-secondary)]"}`}
                  size={21}
                />
              </button>
              <div
                id={`directory-${biz.id}`}
                hidden={selected !== idx}
                className="mt-4 space-y-4 sm:pl-10"
              >
                <p className="text-base leading-relaxed text-[var(--apex-text-secondary)]">
                  {biz.summary}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onJumpToBusinessScene(biz.introSceneIndex)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#F28C28] px-4 py-2 text-sm font-semibold text-[#111418] hover:bg-[#FF9F43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F28C28]"
                  >
                    Explore in 3D <ArrowRight size={16} />
                  </button>
                  <a
                    href={biz.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--apex-border)] px-4 py-2 text-sm font-medium hover:border-[#F28C28] focus-visible:outline-2 focus-visible:outline-[#F28C28]"
                  >
                    Visit website <ArrowUpRight size={16} />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          data-corporate-reveal
          className="min-w-0 self-start lg:sticky lg:top-28"
        >
          <article className="overflow-hidden rounded-xl border border-[var(--apex-border)] apex-theme-surface">
            <div className="relative aspect-[16/10] overflow-hidden bg-[#171C22]">
              {!failed[active.id] ? (
                <img
                  key={active.id}
                  src={active.imageUrl}
                  alt={`${active.name} business illustration`}
                  loading="lazy"
                  decoding="async"
                  onError={() =>
                    setFailed((prev) => ({ ...prev, [active.id]: true }))
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-center text-xl font-semibold text-white">
                  {active.name}
                </div>
              )}
            </div>
            <div className="space-y-4 p-5 sm:p-7">
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--apex-text-secondary)]">
                Division {active.index} / 05
              </p>
              <h3 className="font-display text-2xl font-semibold">
                {active.name}
              </h3>
              <ul className="space-y-3 border-t border-[var(--apex-border)] pt-4 text-sm leading-relaxed text-[var(--apex-text-secondary)]">
                {active.focusAreas.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28C28]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>
    </SectionShell>
  );
}
