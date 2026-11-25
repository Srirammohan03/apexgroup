import { APEX_BUSINESSES } from "@/src/data/businesses";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    icon: FaFacebookF,
    href: "",
    color: "#1877F2",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    href: "",
    color: "#E4405F",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedinIn,
    href: "",
    color: "#0A66C2",
  },
  {
    name: "YouTube",
    icon: FaYoutube,
    href: "",
    color: "#FF0000",
  },
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    href: "",
    color: "#25D366",
  },
];

const QUICK_LINKS = [
  { id: "about", title: "About Us" },
  { id: "businesses", title: "Our Businesses" },
  { id: "industries", title: "Industries" },
  { id: "contact", title: "Contact Us" },
];

interface CorporateFooterProps {
  onNavigateSection?: (id: string) => void;
}

export function CorporateFooter({ onNavigateSection }: CorporateFooterProps) {
  const activeSocialLinks = SOCIAL_LINKS.filter(
    (social) => social.href.trim().length > 0,
  );

  const handleBackToTop = () => {
    if (onNavigateSection) {
      onNavigateSection("top");
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-[var(--apex-border)] apex-theme-bg text-[var(--apex-text-primary)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F28C28] to-transparent"
      />

      <div className="mx-auto w-full max-w-[1680px] px-5 pt-12 pb-28 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20 lg:pb-32 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_.65fr] lg:gap-14 xl:gap-20">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <a
              href="#top"
              onClick={(e) => {
                if (onNavigateSection) {
                  e.preventDefault();
                  handleBackToTop();
                }
              }}
              className="inline-block font-display text-2xl font-bold tracking-tight sm:text-3xl"
            >
              APEX GROUP
              <span className="text-[#F28C28]">.</span>
            </a>

            <p className="mt-3 text-sm font-medium uppercase tracking-[0.12em] text-[#F28C28]">
              Powering a world in motion.
            </p>

            <p className="mt-5 max-w-[380px] text-[15px] leading-[1.85] text-[var(--apex-text-secondary)] sm:text-base">
              Bringing together energy, transportation, industrial oils,
              lubricants and fuel solutions to support the evolving needs of
              industries and everyday mobility.
            </p>

            {activeSocialLinks.length > 0 && (
              <div className="mt-7">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--apex-text-secondary)]">
                  Connect with us
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                  {activeSocialLinks.map((social) => {
                    const Icon = social.icon;

                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Apex Group on ${social.name}`}
                        title={social.name}
                        style={
                          {
                            "--social-color": social.color,
                          } as React.CSSProperties
                        }
                        className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--apex-border)] bg-[var(--apex-surface)] text-[var(--apex-text-secondary)] transition-all duration-300 hover:border-[var(--social-color)] hover:bg-[var(--social-color)] hover:text-white motion-safe:hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F28C28]"
                      >
                        <Icon
                          size={17}
                          aria-hidden="true"
                          className="transition-transform duration-300 motion-safe:group-hover:scale-110"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em]">
              <span
                aria-hidden="true"
                className="h-px w-5 shrink-0 bg-[#F28C28]"
              />
              Our Businesses
            </h2>

            <ul className="space-y-4">
              {APEX_BUSINESSES.map((biz) => (
                <li key={biz.id}>
                  <a
                    href={biz.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-start gap-2 text-[14px] leading-relaxed text-[var(--apex-text-secondary)] transition-colors duration-300 hover:text-[#F28C28] sm:text-[15px]"
                  >
                    <span>{biz.name}</span>

                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="mt-1 shrink-0 opacity-60 transition-all duration-300 group-hover:opacity-100 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                    />

                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em]">
              <span
                aria-hidden="true"
                className="h-px w-5 shrink-0 bg-[#F28C28]"
              />
              Quick Links
            </h2>

            <ul className="space-y-4">
              {QUICK_LINKS.map(({ id, title }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      if (
                        onNavigateSection &&
                        !e.ctrlKey &&
                        !e.metaKey &&
                        !e.shiftKey &&
                        !e.altKey
                      ) {
                        e.preventDefault();
                        onNavigateSection(id);
                      }
                    }}
                    className="group inline-flex items-center gap-2 text-[14px] leading-relaxed text-[var(--apex-text-secondary)] transition-all duration-300 hover:text-[#F28C28] sm:text-[15px]"
                  >
                    <span>{title}</span>

                    <ArrowUpRight
                      size={13}
                      aria-hidden="true"
                      className="shrink-0 opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              onClick={(e) => {
                if (onNavigateSection) {
                  e.preventDefault();
                  onNavigateSection("contact");
                }
              }}
              className="group mt-7 inline-flex min-h-[46px] items-center justify-center gap-3 rounded-md border border-[#F28C28] px-5 py-3 text-sm font-semibold text-[#F28C28] transition-all duration-300 hover:bg-[#F28C28] hover:text-[#0B0D10]"
            >
              Get in Touch
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-[var(--apex-border)] pt-7 sm:mt-16 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-center text-xs leading-relaxed text-[var(--apex-text-secondary)] sm:text-sm lg:text-left">
            © {new Date().getFullYear()} Apex Group. All rights reserved.
          </p>

          <p className="text-center text-xs leading-relaxed text-[var(--apex-text-secondary)] sm:text-sm">
            Powered by{" "}
            <a
              href="https://www.outrightcreators.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-semibold text-[#F28C28] transition-colors duration-300 hover:underline hover:underline-offset-4"
            >
              Outright Creators
              <ArrowUpRight
                size={13}
                aria-hidden="true"
                className="transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
              />
            </a>
          </p>

          <button
            type="button"
            onClick={handleBackToTop}
            className="group mx-auto inline-flex min-h-[42px] items-center justify-center gap-3 rounded-md border border-[var(--apex-border)] px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-[var(--apex-text-secondary)] transition-all duration-300 hover:border-[#F28C28] hover:text-[#F28C28] lg:mx-0"
          >
            Back to Top
            <ArrowUp
              size={15}
              aria-hidden="true"
              className="transition-transform duration-300 motion-safe:group-hover:-translate-y-1"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
