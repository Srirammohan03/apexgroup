import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  evaluateSceneState,
  type LiveExperienceState,
  type SceneKeyframe,
} from './sceneConfig';

gsap.registerPlugin(ScrollTrigger);

export function createInitialExperienceState(
  keyframes: SceneKeyframe[],
  initialThemeTarget = 0
): LiveExperienceState {
  const firstClone: SceneKeyframe = JSON.parse(JSON.stringify(keyframes[0]));
  return {
    scrollProgress: 0,
    activeSceneIndex: 0,
    themeTarget: initialThemeTarget,
    interpolated: firstClone,
    mouseNorm: { x: 0, y: 0 },
  };
}

export interface MasterTimelineController {
  destroy: () => void;
  scrollToScene: (sceneIndex: number) => void;
  scrollToElement: (elementId: string) => void;
}

export function initMasterScrollTimeline(
  triggerElement: HTMLElement,
  keyframes: SceneKeyframe[],
  stateRef: React.MutableRefObject<LiveExperienceState>,
  reducedMotion: boolean,
  onSceneIndexChange?: (index: number) => void
): MasterTimelineController {
  let lenis: Lenis | null = null;
  let tickerCallback: ((time: number) => void) | null = null;

  if (!reducedMotion && typeof window !== 'undefined') {
    lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });

    lenis.on('scroll', ScrollTrigger.update);

    tickerCallback = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);
  }

  const proxy = { progress: stateRef.current.scrollProgress };

  const tween = gsap.to(proxy, {
    progress: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: triggerElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: reducedMotion ? false : 0.45,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        stateRef.current.scrollProgress = p;

        evaluateSceneState(keyframes, p, stateRef.current.interpolated);

        const segIndex = Math.min(
          keyframes.length - 1,
          Math.round(p * (keyframes.length - 1))
        );
        if (stateRef.current.activeSceneIndex !== segIndex) {
          stateRef.current.activeSceneIndex = segIndex;
          onSceneIndexChange?.(segIndex);
        }
      },
    },
  });

  const scrollToScene = (sceneIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(keyframes.length - 1, sceneIndex));
    const st = tween.scrollTrigger;
    if (!st) return;
    const targetProgress = clampedIndex / Math.max(1, keyframes.length - 1);
    const targetY = st.start + (st.end - st.start) * targetProgress;

    if (lenis) {
      lenis.scrollTo(targetY, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  const scrollToElement = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.1 });
    } else {
      el.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  return {
    destroy: () => {
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
        tickerCallback = null;
      }
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
      tween.scrollTrigger?.kill();
      tween.kill();
    },
    scrollToScene,
    scrollToElement,
  };
}
