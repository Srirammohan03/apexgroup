import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createInitialExperienceState,
  initMasterScrollTimeline,
  type MasterTimelineController,
} from '../animations/masterTimeline';
import {
  evaluateSceneState,
  getSceneKeyframes,
  type LiveExperienceState,
} from '../animations/sceneConfig';
import { ChapterProgressIndicator } from '../components/layout/ChapterProgressIndicator';
import { DevToolsOverlay } from '../components/layout/DevToolsOverlay';
import { Navbar } from '../components/layout/Navbar';
import { BusinessStageSection } from '../components/sections/BusinessStageSection';
import { CorporateGroupSection } from '../components/sections/CorporateGroupSection';
import { FinaleSection } from '../components/sections/FinaleSection';
import { HeroSection } from '../components/sections/HeroSection';
import { APEX_BUSINESSES } from '../data/businesses';
import { MasterCanvas } from '../experience/MasterCanvas';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useThemeMode } from '../hooks/useThemeMode';
import { useViewportMode } from '../hooks/useViewportMode';

const STAGE_PAIRS = [
  {
    bizIdx: 0,
    introId: 'scene-02-roadlines-intro',
    capId: 'scene-03-roadlines-capabilities',
    introNextLabel: 'Fleet Capabilities',
    capNextLabel: 'Continue to Bio Fuel',
  },
  {
    bizIdx: 1,
    introId: 'scene-04-biofuel-intro',
    capId: 'scene-05-biofuel-capabilities',
    introNextLabel: 'Renewable Flow',
    capNextLabel: 'Continue to Pranar Oils',
  },
  {
    bizIdx: 2,
    introId: 'scene-06-pranar-intro',
    capId: 'scene-07-pranar-capabilities',
    introNextLabel: 'Specialty Chemicals',
    capNextLabel: 'Continue to Natural Lubes',
  },
  {
    bizIdx: 3,
    introId: 'scene-08-lubes-intro',
    capId: 'scene-09-lubes-tech',
    introNextLabel: 'Engine Protection',
    capNextLabel: 'Continue to JS Fuels',
  },
  {
    bizIdx: 4,
    introId: 'scene-10-jsfuels-intro',
    capId: 'scene-11-jsfuels-experience',
    introNextLabel: 'Forecourt Experience',
    capNextLabel: 'View Connected Future',
  },
];

export function HomePage() {
  const viewportMode = useViewportMode();
  const reducedMotion = useReducedMotion();
  const { theme, isDay, toggleTheme } = useThemeMode();

  const keyframes = useMemo(() => getSceneKeyframes(viewportMode), [viewportMode]);

  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const timelineCtrlRef = useRef<MasterTimelineController | null>(null);
  const stateRef = useRef<LiveExperienceState>(
    createInitialExperienceState(keyframes, isDay ? 1 : 0)
  );

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  useEffect(() => {
    stateRef.current.themeTarget = isDay ? 1 : 0;
  }, [isDay]);

  useEffect(() => {
    const el = scrollTrackRef.current;
    if (!el) return;

    evaluateSceneState(
      keyframes,
      stateRef.current.scrollProgress,
      stateRef.current.interpolated
    );

    const ctrl = initMasterScrollTimeline(
      el,
      keyframes,
      stateRef,
      reducedMotion,
      (nextIndex) => setActiveSceneIndex(nextIndex)
    );
    timelineCtrlRef.current = ctrl;

    return () => {
      ctrl.destroy();
      timelineCtrlRef.current = null;
    };
  }, [keyframes, reducedMotion]);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
      stateRef.current.mouseNorm.x = nx;
      stateRef.current.mouseNorm.y = ny;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  const handleJumpToScene = useCallback((sceneIndex: number) => {
    timelineCtrlRef.current?.scrollToScene(sceneIndex);
  }, []);

  const handleNavigateSection = useCallback((sectionId: string) => {
    timelineCtrlRef.current?.scrollToElement(sectionId);
  }, []);

  return (
    <div id="top" className="relative min-h-screen apex-theme-bg text-[var(--apex-text-primary)]">
      <MasterCanvas stateRef={stateRef} />

      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigateSection={handleNavigateSection}
        onJumpToScene={handleJumpToScene}
      />

      <main className="relative z-10">
        <div ref={scrollTrackRef} className="relative">
          <HeroSection
            onExplore={() => handleJumpToScene(1)}
            onDirectory={() => handleNavigateSection('businesses')}
          />

          {STAGE_PAIRS.map((pair) => {
            const biz = APEX_BUSINESSES[pair.bizIdx];
            return (
              <div key={biz.id}>
                <BusinessStageSection
                  id={pair.introId}
                  business={biz}
                  variant="intro"
                  nextLabel={pair.introNextLabel}
                  onNextScene={() => handleJumpToScene(biz.capabilitiesSceneIndex)}
                />
                <BusinessStageSection
                  id={pair.capId}
                  business={biz}
                  variant="capabilities"
                  nextLabel={pair.capNextLabel}
                  onNextScene={() => handleJumpToScene(biz.capabilitiesSceneIndex + 1)}
                />
              </div>
            );
          })}

          <FinaleSection
            onExploreDirectory={() => handleNavigateSection('businesses')}
          />
        </div>

        <CorporateGroupSection onJumpToBusinessScene={handleJumpToScene} />
      </main>

      <ChapterProgressIndicator
        activeSceneIndex={activeSceneIndex}
        onSelectScene={handleJumpToScene}
      />

      <DevToolsOverlay />
    </div>
  );
}
