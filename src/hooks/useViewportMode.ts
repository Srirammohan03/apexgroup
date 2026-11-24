import { useEffect, useState } from 'react';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

function getViewportMode(width: number): ViewportMode {
  if (width < 768) return 'mobile';
  if (width < 1180) return 'tablet';
  return 'desktop';
}

export function useViewportMode(): ViewportMode {
  const [mode, setMode] = useState<ViewportMode>(() =>
    typeof window === 'undefined' ? 'desktop' : getViewportMode(window.innerWidth)
  );

  useEffect(() => {
    const onResize = () => {
      setMode(getViewportMode(window.innerWidth));
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return mode;
}
