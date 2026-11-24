import { ArrowUpRight, Check, Copy, ExternalLink, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { APEX_BUSINESSES, INDUSTRY_SECTORS } from '../../data/businesses';

interface CorporateGroupSectionProps {
  onJumpToBusinessScene: (sceneIndex: number) => void;
}

export function CorporateGroupSection({
  onJumpToBusinessScene,
}: CorporateGroupSectionProps) {
  const [selectedBizIdx, setSelectedBizIdx] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [division, setDivision] = useState(APEX_BUSINESSES[0].name);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preparedBrief, setPreparedBrief] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeBiz = APEX_BUSINESSES[selectedBizIdx];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !email.trim() || !email.includes('@') || !message.trim()) {
      setError('Please enter your organization name, a valid email address, and enquiry details.');
      return;
    }
    setError(null);

    const briefText = [
      `Apex Group Business Enquiry`,
      `Division: ${division}`,
      `Organization: ${company.trim()}`,
      `Reply Email: ${email.trim()}`,
      `Requirements:`,
      message.trim(),
    ].join('\n');

    setPreparedBrief(briefText);
    setCopied(false);
  };

  const handleCopyBrief = async () => {
    if (!preparedBrief || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(preparedBrief);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard write unavailable in restricted context
    }
  };

  const mailtoHref = preparedBrief
    ? `mailto:?subject=${encodeURIComponent(`Apex Group Enquiry — ${division}`)}&body=${encodeURIComponent(preparedBrief)}`
    : '#contact';

  return (
    <div className="relative z-20 apex-theme-bg border-t border-[var(--apex-border)]">
      {/* ABOUT THE GROUP */}
      <section id="about" className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs tracking-[0.14em] uppercase text-[#F28C28] mb-3">
              About Apex Group
            </p>
            <h2
              className="font-display font-bold tracking-tight text-[var(--apex-text-primary)] leading-[1.06]"
              style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.85rem)' }}
            >
              An Integrated Industrial Energy Architecture.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-5 text-base text-[var(--apex-text-secondary)] leading-relaxed">
            <p>
              Apex Group coordinates five specialized operating entities across
              petroleum transport, biomass energy, industrial oils and chemicals,
              engineered lubricants, and commercial fuel dispensing.
            </p>
            <p>
              Rather than operating as isolated service providers, each division
              supports the adjacent stage of the energy value chain—from bulk
              tanker haulage and chemical intermediates to packaged machine
              protection and multi-fuel forecourts serving fleets and motorists.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE EDITORIAL BUSINESS DIRECTORY (No generic card grid) */}
      <section
        id="businesses"
        className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 border-t border-[var(--apex-border)]"
      >
        <div className="max-w-2xl mb-12">
          <p className="font-mono text-xs tracking-[0.14em] uppercase text-[#F28C28] mb-3">
            Operating Divisions
          </p>
          <h2
            className="font-display font-bold tracking-tight text-[var(--apex-text-primary)]"
            style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)' }}
          >
            Five Businesses. One Connected Ecosystem.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Interactive numbered index list */}
          <div className="lg:col-span-7 divide-y divide-[var(--apex-border)] border-t border-b border-[var(--apex-border)]">
            {APEX_BUSINESSES.map((biz, idx) => {
              const isSelected = idx === selectedBizIdx;
              return (
                <div
                  key={biz.id}
                  onMouseEnter={() => setSelectedBizIdx(idx)}
                  className="py-5 md:py-6 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedBizIdx(idx)}
                    aria-expanded={isSelected}
                    className="w-full text-left flex items-start justify-between gap-6 group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F28C28]"
                  >
                    <div className="flex items-baseline gap-5 md:gap-7">
                      <span
                        className={`font-display text-2xl md:text-3xl font-bold tabular-nums transition-colors ${
                          isSelected
                            ? 'text-[#F28C28]'
                            : 'text-[var(--apex-text-secondary)] opacity-55 group-hover:opacity-100'
                        }`}
                      >
                        {biz.index}
                      </span>
                      <div>
                        <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--apex-text-primary)] group-hover:text-[#F28C28] transition-colors">
                          {biz.name}
                        </h3>
                        <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[var(--apex-text-secondary)]">
                          {biz.sector}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      size={20}
                      className={`shrink-0 mt-1 transition-transform duration-200 ${
                        isSelected
                          ? 'text-[#F28C28] translate-x-0.5 -translate-y-0.5'
                          : 'text-[var(--apex-text-secondary)] opacity-50 group-hover:opacity-100'
                      }`}
                    />
                  </button>

                  {isSelected && (
                    <div className="mt-4 pl-12 md:pl-16 space-y-4">
                      <p className="text-sm md:text-base text-[var(--apex-text-secondary)] leading-relaxed">
                        {biz.summary}
                      </p>
                      <div className="flex flex-wrap items-center gap-5 pt-1">
                        <button
                          type="button"
                          onClick={() => onJumpToBusinessScene(biz.introSceneIndex)}
                          className="text-xs font-mono uppercase tracking-wider text-[#F28C28] hover:underline cursor-pointer"
                        >
                          View in 3D Sequence
                        </button>
                        <a
                          href={biz.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--apex-text-primary)] hover:text-[#F28C28] transition-colors"
                        >
                          <span>{biz.domainLabel}</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sticky Editorial Visual Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="apex-theme-surface border border-[var(--apex-border)] rounded-sm overflow-hidden">
              <div className="relative aspect-[16/10] w-full bg-[#12161D] overflow-hidden">
                {!failedImages[activeBiz.id] ? (
                  <img
                    src={activeBiz.imageUrl}
                    alt={`${activeBiz.name} — ${activeBiz.sector}`}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [activeBiz.id]: true }))
                    }
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-end p-6"
                    style={{
                      background:
                        'linear-gradient(135deg, #171C22 0%, #0B0D10 70%, rgba(242,140,40,0.22) 100%)',
                    }}
                  >
                    <span className="font-mono text-xs uppercase tracking-wider text-[#F28C28]">
                      {activeBiz.index} · {activeBiz.sector}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xs text-[#F28C28] tabular-nums">
                    DIVISION {activeBiz.index}
                  </span>
                  <span className="font-mono text-xs text-[var(--apex-text-secondary)]">
                    {activeBiz.shortName}
                  </span>
                </div>
                <h4 className="font-display text-lg font-bold text-[var(--apex-text-primary)]">
                  {activeBiz.name}
                </h4>
                <ul className="space-y-1.5 text-xs text-[var(--apex-text-secondary)] border-t border-[var(--apex-border)] pt-4">
                  {activeBiz.focusAreas.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-1.5 h-[1px] bg-[#F28C28]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES SERVED */}
      <section
        id="industries"
        className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 border-t border-[var(--apex-border)]"
      >
        <div className="max-w-2xl mb-12">
          <p className="font-mono text-xs tracking-[0.14em] uppercase text-[#F28C28] mb-3">
            Industries Served
          </p>
          <h2
            className="font-display font-bold tracking-tight text-[var(--apex-text-primary)]"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
          >
            Built for Transport, Manufacturing &amp; Mobility
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 border-t border-[var(--apex-border)] pt-10">
          {INDUSTRY_SECTORS.map((sector) => (
            <div key={sector.index} className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-[#F28C28] tabular-nums">
                  {sector.index}
                </span>
                <h3 className="font-display text-xl font-bold text-[var(--apex-text-primary)]">
                  {sector.title}
                </h3>
              </div>
              <p className="text-sm text-[var(--apex-text-secondary)] leading-relaxed">
                {sector.description}
              </p>
              <p className="font-mono text-xs text-[var(--apex-text-primary)] opacity-85 pt-1">
                {sector.alignedDivisions.join('  ·  ')}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPACT ACCESSIBLE CONTACT */}
      <section
        id="contact"
        className="mx-auto max-w-[1440px] px-6 md:px-10 py-20 border-t border-[var(--apex-border)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs tracking-wider uppercase text-[#F28C28] mb-3">
              Centralized Enquiries
            </p>
            <h2
              className="font-display font-bold tracking-tight text-[var(--apex-text-primary)]"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              Connect With Apex Group
            </h2>
            <p className="mt-4 text-sm md:text-base text-[var(--apex-text-secondary)] leading-relaxed">
              Prepare a structured enquiry brief for bulk tanker logistics,
              biomass energy supply, industrial oils, formulated lubricants, or
              forecourt operations.
            </p>
          </div>

          <div className="lg:col-span-7">
            {preparedBrief ? (
              <div className="apex-theme-surface border border-[#F28C28]/50 rounded-sm p-6 md:p-8 space-y-5">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#F28C28]">
                    Enquiry Brief Ready
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-[var(--apex-text-primary)]">
                    Prepared for {division}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--apex-text-secondary)]">
                    Open your email client with the structured brief pre-filled, or
                    copy the formatted summary below.
                  </p>
                </div>

                <pre className="p-4 text-xs font-mono bg-[var(--apex-bg)] border border-[var(--apex-border)] rounded-sm text-[var(--apex-text-primary)] whitespace-pre-wrap overflow-x-auto">
                  {preparedBrief}
                </pre>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#F28C28] text-[#0B0D10] rounded-sm hover:bg-[#ff9c3d] transition-colors"
                  >
                    <Mail size={14} />
                    <span>Open in Email Client</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyBrief}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider bg-[var(--apex-bg)] border border-[var(--apex-border)] text-[var(--apex-text-primary)] hover:border-[#F28C28] rounded-sm cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-[#F28C28]" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied Brief' : 'Copy Brief'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPreparedBrief(null);
                      setCompany('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[var(--apex-text-secondary)] hover:text-[var(--apex-text-primary)] cursor-pointer"
                  >
                    Edit Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="apex-theme-surface border border-[var(--apex-border)] rounded-sm p-6 md:p-8 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="enquiry-company"
                      className="block text-xs font-mono uppercase tracking-wider text-[var(--apex-text-secondary)] mb-2"
                    >
                      Organization / Name
                    </label>
                    <input
                      id="enquiry-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Organization name"
                      className="w-full px-3.5 py-2.5 text-sm bg-[var(--apex-bg)] border border-[var(--apex-border)] rounded-sm text-[var(--apex-text-primary)] placeholder:opacity-45 focus:outline-none focus:border-[#F28C28]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="enquiry-email"
                      className="block text-xs font-mono uppercase tracking-wider text-[var(--apex-text-secondary)] mb-2"
                    >
                      Business Email
                    </label>
                    <input
                      id="enquiry-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-[var(--apex-bg)] border border-[var(--apex-border)] rounded-sm text-[var(--apex-text-primary)] placeholder:opacity-45 focus:outline-none focus:border-[#F28C28]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="enquiry-division"
                    className="block text-xs font-mono uppercase tracking-wider text-[var(--apex-text-secondary)] mb-2"
                  >
                    Business Division
                  </label>
                  <select
                    id="enquiry-division"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[var(--apex-bg)] border border-[var(--apex-border)] rounded-sm text-[var(--apex-text-primary)] focus:outline-none focus:border-[#F28C28]"
                  >
                    {APEX_BUSINESSES.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name} — {b.sector}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="enquiry-message"
                    className="block text-xs font-mono uppercase tracking-wider text-[var(--apex-text-secondary)] mb-2"
                  >
                    Requirements
                  </label>
                  <textarea
                    id="enquiry-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your logistics corridor, supply requirements, or enquiry details..."
                    className="w-full px-3.5 py-2.5 text-sm bg-[var(--apex-bg)] border border-[var(--apex-border)] rounded-sm text-[var(--apex-text-primary)] placeholder:opacity-45 focus:outline-none focus:border-[#F28C28]"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-medium text-[#F28C28]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-[#F28C28] text-[#0B0D10] rounded-sm hover:bg-[#ff9c3d] transition-colors cursor-pointer"
                >
                  Prepare Business Enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--apex-border)] py-8 px-6 md:px-10">
        <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--apex-text-secondary)]">
          <span>APEX GROUP · POWERING A WORLD IN MOTION</span>
          <span>Five Businesses · Connected Energy Ecosystem</span>
        </div>
      </footer>
    </div>
  );
}
