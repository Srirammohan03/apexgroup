import { ArrowDownRight, Network, Factory, TrendingUp } from "lucide-react";

interface FinaleSectionProps {
  onExploreDirectory: () => void;
}

export function FinaleSection({ onExploreDirectory }: FinaleSectionProps) {
  return (
    <section
      id="scene-12-finale"
      aria-labelledby="finale-heading"
      className="relative isolate w-full min-h-[100svh] overflow-hidden pointer-events-none"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(var(--apex-scrim-rgb), 0.96) 0%, rgba(var(--apex-scrim-rgb), 0.78) 24%, rgba(var(--apex-scrim-rgb), 0.35) 43%, rgba(var(--apex-scrim-rgb), 0) 54%)",
        }}
      />

      <div
        className="
          relative z-10
          mx-auto
          grid
          w-full
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
          data-model-slot="finale"
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
            pb-20
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

          <div className="mb-5 flex items-center gap-3 lg:mb-7">
            <span
              aria-hidden="true"
              className="h-px w-6 shrink-0 bg-[#F28C28] sm:w-9"
            />

            <p
              className="
                font-mono
                text-[10px]
                font-medium
                uppercase
                leading-relaxed
                tracking-[0.14em]
                text-[#F28C28]
                sm:text-xs
                lg:tracking-[0.18em]
              "
            >
              The Apex Group Advantage
            </p>
          </div>

          <h2
            id="finale-heading"
            className="
              font-display
              text-[clamp(2rem,8.5vw,3.8rem)]
              font-bold
              leading-[1.06]
              tracking-[-0.045em]
              text-[var(--apex-text-primary)]
              lg:text-[clamp(2.8rem,3.9vw,4.8rem)]
              lg:leading-[1.02]
            "
          >
            <span className="block">Five Businesses.</span>

            <span className="block text-[#F28C28]">One Connected Future.</span>
          </h2>

          <div
            className="
              mt-5
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
              United by purpose. Driven by progress.
            </p>
          </div>

          <p
            className="
              mt-5
              max-w-[590px]
              text-[15px]
              leading-[1.85]
              text-[var(--apex-text-secondary)]
              sm:text-base
              xl:text-[17px]
            "
          >
            Apex Group brings together transportation, alternative energy,
            industrial oils, automotive lubricants and retail fuel solutions to
            serve the evolving needs of industries and communities.
          </p>

          <p
            className="
              mt-4
              max-w-[590px]
              text-[15px]
              leading-[1.85]
              text-[var(--apex-text-secondary)]
              sm:text-base
              xl:text-[17px]
            "
          >
            Our vision is to build lasting business relationships through
            responsible operations, customer-focused solutions and a shared
            commitment to progress.
          </p>

         

          <div
            className="
              pointer-events-auto
              mt-7
              flex
              flex-col
              items-stretch
              gap-3
              sm:mt-9
              sm:flex-row
              sm:flex-wrap
              sm:items-center
              sm:gap-4
            "
          >
            <button
              type="button"
              onClick={onExploreDirectory}
              className="
                group
                inline-flex
                min-h-[52px]
                w-full
                items-center
                justify-between
                gap-5
                rounded-md
                bg-[#F28C28]
                px-5
                py-3.5
                text-sm
                font-semibold
                text-[#111418]
                transition-all
                duration-300
                hover:bg-[#FF9F43]
                focus-visible:outline-2
                focus-visible:outline-offset-4
                focus-visible:outline-[#F28C28]
                motion-safe:hover:-translate-y-0.5
                sm:w-auto
                lg:min-h-[56px]
                lg:px-6
              "
            >
              <span>Discover Our Businesses</span>

              <ArrowDownRight
                size={19}
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
          </div>

        </div>
      </div>
    </section>
  );
}
