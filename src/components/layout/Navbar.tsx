import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import type { ThemeMode } from '../../hooks/useThemeMode';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigateSection: (sectionId: string) => void;
  onJumpToScene: (sceneIndex: number) => void;
}

const NAV_LINKS = [
  { label: 'Businesses', target: 'businesses' },
  { label: 'About', target: 'about' },
  { label: 'Industries', target: 'industries' },
  { label: 'Contact', target: 'contact' },
];

export function Navbar({
  theme,
  onToggleTheme,
  onNavigateSection,
  onJumpToScene,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDay = theme === 'day';

  const handleLinkClick = (target: string) => {
    setMobileOpen(false);
    onNavigateSection(target);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background:
          'linear-gradient(to bottom, rgba(var(--apex-scrim-rgb), 0.92) 0%, rgba(var(--apex-scrim-rgb), 0.56) 68%, rgba(var(--apex-scrim-rgb), 0) 100%)',
      }}
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onJumpToScene(0);
          }}
          className="font-display text-lg md:text-xl font-bold tracking-[0.06em] text-[var(--apex-text-primary)] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#F28C28] focus-visible:outline-offset-4"
        >
          APEX GROUP
        </a>

        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--apex-text-secondary)]"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={`#${item.target}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.target);
              }}
              className="relative py-1 text-[var(--apex-text-secondary)] hover:text-[var(--apex-text-primary)] transition-colors duration-200 whitespace-nowrap shrink-0 after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#F28C28] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-2 focus-visible:outline-[#F28C28] focus-visible:outline-offset-4"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDay ? 'Switch to Night mode' : 'Switch to Day mode'}
            title={isDay ? 'Switch to Night mode' : 'Switch to Day mode'}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-sm border border-[var(--apex-border)] bg-[var(--apex-surface)] text-[var(--apex-text-primary)] hover:border-[#F28C28] transition-colors duration-200 cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-[#F28C28]"
          >
            <span
              className={`absolute transition-all duration-500 ${
                isDay
                  ? 'opacity-100 rotate-0 scale-100'
                  : 'opacity-0 -rotate-90 scale-50'
              }`}
            >
              <Sun size={17} className="text-[#F28C28]" />
            </span>
            <span
              className={`absolute transition-all duration-500 ${
                isDay
                  ? 'opacity-0 rotate-90 scale-50'
                  : 'opacity-100 rotate-0 scale-100'
              }`}
            >
              <Moon size={16} className="text-[#F7F9FB]" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('contact')}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-[0.04em] uppercase bg-[#F28C28] text-[#0B0D10] rounded-sm hover:bg-[#ff9c3d] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--apex-text-primary)] focus-visible:outline-offset-2"
          >
            Enquire Now
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-sm bg-[var(--apex-surface)] border border-[var(--apex-border)] text-[var(--apex-text-primary)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F28C28]"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[var(--apex-bg)] border-t border-b border-[var(--apex-border)] px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={`#${item.target}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.target);
              }}
              className="py-2 text-base font-medium text-[var(--apex-text-primary)] border-b border-[var(--apex-border)]"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => handleLinkClick('contact')}
            className="mt-2 w-full py-3 text-sm font-semibold uppercase tracking-wider bg-[#F28C28] text-[#0B0D10] rounded-sm"
          >
            Enquire Now
          </button>
        </div>
      )}
    </header>
  );
}
