import { ArrowDownRight, ArrowUpRight, ArrowDown } from "lucide-react";

interface HeroSectionProps {
  onExplore: () => void;
  onDirectory: () => void;
}

const HERO_HIGHLIGHTS = [
  {
    value: "05",
    label: "Business Divisions",
  },
  {
    value: "One",
    label: "Connected Ecosystem",
  },
  {
    value: "B2B & B2C",
    label: "Energy Solutions",
  },
];

export function HeroSection({ onExplore, onDirectory }: HeroSectionProps) {
  return (
    <section
      id="scene-01-hero"
      aria-labelledby="hero-heading"
      className="relative isolate w-full min-h-[100svh] overflow-hidden pointer-events-none"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(var(--apex-scrim-rgb), 0.96) 0%, rgba(var(--apex-scrim-rgb), 0.76) 24%, rgba(var(--apex-scrim-rgb), 0.32) 43%, rgba(var(--apex-scrim-rgb), 0) 54%)",
        }}
      />

      <div
        className="
          relative z-10
          mx-auto
          grid w-full
          max-w-[1680px]
          grid-cols-1
          lg:min-h-[100svh]
          lg:grid-cols-[46%_54%]
          lg:items-center
          lg:px-12
          lg:pt-28
          lg:pb-32
          xl:px-16
          2xl:px-20
        "
      >
        <div
          aria-hidden="true"
          className="
            order-1
            w-full
            h-[max(340px,58svh)]
            sm:h-[max(400px,58svh)]
            lg:order-2
            lg:h-auto
            lg:min-h-[65svh]
          "
        />

        <div
          className="
            relative
            order-2
            w-full
            min-w-0
            px-5
            pb-16
            pt-8
            sm:px-8
            sm:pt-10
            lg:order-1
            lg:max-w-[690px]
            lg:px-0
            lg:py-0
            lg:pr-8
            xl:pr-12
          "
        >
          <div
            aria-hidden="true"
            className="
              absolute
              -top-10
              inset-x-0
              bottom-0
              -z-10
              lg:hidden
            "
            style={{
              background:
                "linear-gradient(180deg, rgba(var(--apex-scrim-rgb), 0) 0%, rgba(var(--apex-scrim-rgb), 0.98) 65px, rgba(var(--apex-scrim-rgb), 1) 100%)",
            }}
          />

          <div
            className="
              mb-4
              flex
              items-center
              gap-3
              sm:mb-5
              lg:mb-6
            "
          >
            <span className="h-px w-5 shrink-0 bg-[#F28C28] sm:w-9" />

            <p
              className="
                font-mono
                text-[10px]
                font-medium
                uppercase
                leading-relaxed
                tracking-[0.12em]
                text-[#F28C28]
                sm:text-xs
                lg:tracking-[0.18em]
              "
            >
              Energy &amp; Industrial Solutions
            </p>
          </div>

          <h1
            id="hero-heading"
            className="
              font-display
              text-[clamp(1.95rem,8.5vw,3.8rem)]
              font-bold
              uppercase
              leading-[1.04]
              tracking-[-0.04em]
              text-[var(--apex-text-primary)]
              lg:text-[clamp(2.75rem,4.1vw,5rem)]
              lg:leading-[0.98]
            "
          >
            <span className="lg:block">POWERING A </span>

            <span className="lg:block">WORLD IN </span>

            <span className="text-[#F28C28] lg:block">MOTION.</span>
          </h1>

          <div
            className="
              mt-5
              max-w-[590px]
              border-l-2
              border-[#F28C28]
              pl-3
              sm:pl-5
              lg:mt-7
            "
          >
            <p
              className="
                text-base
                font-medium
                leading-relaxed
                text-[var(--apex-text-primary)]
                sm:text-xl
                xl:text-2xl
              "
            >
              Connecting industries. Delivering energy.
            </p>
          </div>

          <p
            className="
              mt-4
              max-w-[560px]
              text-sm
              leading-[1.8]
              text-[var(--apex-text-secondary)]
              sm:text-base
              lg:mt-5
              xl:text-[17px]
            "
          >
            From bulk liquid transportation and alternative fuels to industrial
            oils, advanced lubricants and retail fuel solutions, Apex Group
            brings five businesses together under one connected vision.
          </p>

          <div
            className="
              pointer-events-auto
              mt-6
              flex
              flex-col
              gap-3
              sm:mt-8
              sm:flex-row
              sm:flex-wrap
              sm:items-center
              sm:gap-4
              xl:mt-9
            "
          >
            <button
              type="button"
              onClick={onExplore}
              className="
                group
                inline-flex
                min-h-[50px]
                w-full
                items-center
                justify-between
                gap-4
                rounded-md
                bg-[#F28C28]
                px-4
                py-3
                text-sm
                font-semibold
                text-[#111418]
                transition-colors
                duration-300
                hover:bg-[#FF9F43]
                focus-visible:outline-2
                focus-visible:outline-offset-4
                focus-visible:outline-[#F28C28]
                sm:w-auto
                lg:min-h-[54px]
                lg:px-6
              "
            >
              Explore Our Businesses
              <ArrowDownRight
                size={18}
                aria-hidden="true"
                className="
                  shrink-0
                  transition-transform
                  duration-300
                  motion-safe:group-hover:translate-x-1
                  motion-safe:group-hover:translate-y-1
                "
              />
            </button>

            <button
              type="button"
              onClick={onDirectory}
              className="
                group
                inline-flex
                min-h-[50px]
                w-full
                items-center
                justify-between
                gap-4
                rounded-md
                border
                border-[var(--apex-border)]
                px-4
                py-3
                text-sm
                font-semibold
                text-[var(--apex-text-primary)]
                transition-colors
                duration-300
                hover:border-[#F28C28]
                hover:text-[#F28C28]
                focus-visible:outline-2
                focus-visible:outline-offset-4
                focus-visible:outline-[#F28C28]
                sm:w-auto
                lg:min-h-[54px]
                lg:px-6
              "
            >
              Discover Apex Group
              <ArrowUpRight
                size={17}
                aria-hidden="true"
                className="
                  shrink-0
                  transition-transform
                  duration-300
                  motion-safe:group-hover:-translate-y-1
                  motion-safe:group-hover:translate-x-1
                "
              />
            </button>
          </div>

          <div
            className="
              mt-8
              grid
              grid-cols-3
              gap-2
              border-t
              border-[var(--apex-border)]
              pt-5
              sm:gap-5
              lg:mt-10
              lg:pt-6
              xl:mt-12
            "
          >
            {HERO_HIGHLIGHTS.map((item, index) => (
              <div
                key={item.label}
                className={`
                  min-w-0
                  ${
                    index !== 0
                      ? "border-l border-[var(--apex-border)] pl-2 sm:pl-5"
                      : ""
                  }
                `}
              >
                <p
                  className="
                    font-display
                    text-[clamp(1rem,4vw,1.5rem)]
                    font-semibold
                    tracking-tight
                    text-[#F28C28]
                    xl:text-[30px]
                  "
                >
                  {item.value}
                </p>

                <p
                  className="
                    mt-2
                    break-words
                    text-[10px]
                    leading-relaxed
                    text-[var(--apex-text-secondary)]
                    sm:text-xs
                    xl:text-sm
                  "
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
