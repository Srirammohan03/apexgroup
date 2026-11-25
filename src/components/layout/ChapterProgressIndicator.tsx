import { APEX_BUSINESSES, SCENE_CHAPTERS } from '../../data/businesses';

interface ChapterProgressIndicatorProps {
  activeSceneIndex: number;
  onSelectScene: (index: number) => void;
}

const RAIL_STOPS = [
  { label: 'Ecosystem', sceneIndex: 0, range: [0, 0] },
  { label: 'Road Lines', sceneIndex: 1, range: [1, 2] },
  { label: 'Bio Fuel', sceneIndex: 3, range: [3, 4] },
  { label: 'Pranar Oils', sceneIndex: 5, range: [5, 6] },
  { label: 'Natural Lubes', sceneIndex: 7, range: [7, 8] },
  { label: 'JS Fuels', sceneIndex: 9, range: [9, 10] },
  { label: 'Future', sceneIndex: 11, range: [11, 11] },
];

export function ChapterProgressIndicator({
  activeSceneIndex,
  onSelectScene,
}: ChapterProgressIndicatorProps) {
  const currentMeta = SCENE_CHAPTERS[activeSceneIndex] ?? SCENE_CHAPTERS[0];
  const progressPct = ((activeSceneIndex + 1) / SCENE_CHAPTERS.length) * 100;

  return (
    <aside
      aria-label="Story Chapter Navigation"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[min(800px,92vw)] pointer-events-none hidden sm:flex flex-col items-center"
    >
      <div className="pointer-events-auto w-full bg-[var(--apex-surface)]/95 border border-[var(--apex-border)] rounded-sm px-4 py-2.5 shadow-lg">
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {RAIL_STOPS.map((stop, idx) => {
            const isActive =
              activeSceneIndex >= stop.range[0] && activeSceneIndex <= stop.range[1];
            const biz = APEX_BUSINESSES[idx - 1];
            return (
              <button
                key={stop.label}
                type="button"
                onClick={() => onSelectScene(stop.sceneIndex)}
                className={`px-2.5 py-1 text-[11px] font-mono tracking-wide rounded-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#F28C28] ${
                  isActive
                    ? 'text-[#F28C28] font-semibold'
                    : 'text-[var(--apex-text-secondary)] hover:text-[var(--apex-text-primary)]'
                }`}
                title={biz ? biz.name : stop.label}
              >
                <span className="tabular-nums opacity-75">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span>{stop.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1 h-[2px] bg-[var(--apex-border)] overflow-hidden">
            <div
              className="h-full bg-[#F28C28] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--apex-text-secondary)] tabular-nums whitespace-nowrap">
            {currentMeta.number} / 12 · {currentMeta.groupLabel}
          </span>
        </div>
      </div>
    </aside>
  );
}
