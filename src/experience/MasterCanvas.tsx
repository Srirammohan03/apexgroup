import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';
import type { LiveExperienceState } from '../animations/sceneConfig';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useWebGLSupport } from '../hooks/useWebGLSupport';
import { MasterScene } from './MasterScene';

interface MasterCanvasProps {
  stateRef: React.MutableRefObject<LiveExperienceState>;
}

export function MasterCanvas({ stateRef }: MasterCanvasProps) {
  const { supported, isSoftwareGl } = useWebGLSupport();
  const reducedMotion = useReducedMotion();
  const [contextLost, setContextLost] = useState(false);

  if (!supported || contextLost) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 apex-theme-bg flex items-center justify-center pointer-events-none"
      >
        <div
          className="w-[72vw] h-[72vw] max-w-[780px] max-h-[780px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(242, 140, 40, 0.22), rgba(23, 28, 34, 0.45) 52%, transparent 75%)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        shadows={!isSoftwareGl}
        dpr={isSoftwareGl ? 1 : [1, 2]}
        camera={{ position: [-1.55, 1.55, 11.4], fov: 41, near: 0.1, far: 140 }}
        gl={{
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          const canvasEl = gl.domElement;
          canvasEl.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            setContextLost(true);
          });
          canvasEl.addEventListener('webglcontextrestored', () => {
            setContextLost(false);
          });
        }}
      >
        <MasterScene
          stateRef={stateRef}
          isSoftwareGl={isSoftwareGl}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}
