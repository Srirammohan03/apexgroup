import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { LiveExperienceState } from '../animations/sceneConfig';

interface LightingRigProps {
  stateRef: React.MutableRefObject<LiveExperienceState>;
  themeFactorRef: React.MutableRefObject<number>;
  isSoftwareGl: boolean;
}

const NIGHT_BG = new THREE.Color('#0B0D10');
const DAY_BG = new THREE.Color('#F2F3F5');
const _bgLerp = new THREE.Color();

const NIGHT_HEMI_SKY = new THREE.Color('#9CB8D9');
const DAY_HEMI_SKY = new THREE.Color('#FFFFFF');
const NIGHT_HEMI_GND = new THREE.Color('#12161D');
const DAY_HEMI_GND = new THREE.Color('#B8C0C8');

const NIGHT_KEY = new THREE.Color('#FFF0D8');
const DAY_KEY = new THREE.Color('#FFFDF9');

const NIGHT_RIM = new THREE.Color('#A6C4E8');
const DAY_RIM = new THREE.Color('#CBD5E1');

export function LightingRig({
  stateRef,
  themeFactorRef,
  isSoftwareGl,
}: LightingRigProps) {
  const { scene, gl } = useThree();
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);
  const amberAccentLightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;

    const initialDay = stateRef.current.themeTarget;
    themeFactorRef.current = initialDay;
    const initColor = initialDay > 0.5 ? DAY_BG.clone() : NIGHT_BG.clone();
    scene.background = initColor;
    scene.fog = new THREE.FogExp2(initColor.getHex(), initialDay > 0.5 ? 0.014 : 0.032);

    roomEnv.dispose();
    pmrem.dispose();

    return () => {
      envTarget.dispose();
      scene.environment = null;
    };
  }, [gl, scene, stateRef, themeFactorRef]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const lighting = stateRef.current.interpolated.lighting;

    // ~1.2s smooth interpolation between Night (0) and Day (1)
    const dayFactor = THREE.MathUtils.damp(
      themeFactorRef.current,
      stateRef.current.themeTarget,
      3.4,
      dt
    );
    themeFactorRef.current = dayFactor;

    _bgLerp.copy(NIGHT_BG).lerp(DAY_BG, dayFactor);
    if (scene.background instanceof THREE.Color) {
      scene.background.copy(_bgLerp);
    }
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(_bgLerp);
      scene.fog.density = THREE.MathUtils.lerp(0.032, 0.012, dayFactor);
    }

    if (hemiLightRef.current) {
      hemiLightRef.current.color.copy(NIGHT_HEMI_SKY).lerp(DAY_HEMI_SKY, dayFactor);
      hemiLightRef.current.groundColor.copy(NIGHT_HEMI_GND).lerp(DAY_HEMI_GND, dayFactor);
      hemiLightRef.current.intensity = THREE.MathUtils.lerp(0.85, 1.35, dayFactor);
    }

    if (keyLightRef.current) {
      keyLightRef.current.color.copy(NIGHT_KEY).lerp(DAY_KEY, dayFactor);
      const targetKey = lighting.keyIntensity * THREE.MathUtils.lerp(1.0, 1.18, dayFactor);
      keyLightRef.current.intensity = THREE.MathUtils.damp(
        keyLightRef.current.intensity,
        targetKey,
        6,
        dt
      );
    }

    if (rimLightRef.current) {
      rimLightRef.current.color.copy(NIGHT_RIM).lerp(DAY_RIM, dayFactor);
      const targetRim = lighting.rimIntensity * THREE.MathUtils.lerp(1.0, 0.65, dayFactor);
      rimLightRef.current.intensity = THREE.MathUtils.damp(
        rimLightRef.current.intensity,
        targetRim,
        6,
        dt
      );
    }

    if (amberAccentLightRef.current) {
      amberAccentLightRef.current.intensity = THREE.MathUtils.lerp(1.75, 0.35, dayFactor);
    }

    if ('environmentIntensity' in scene) {
      const targetEnv = lighting.envIntensity * THREE.MathUtils.lerp(1.0, 0.85, dayFactor);
      (scene as THREE.Scene & { environmentIntensity: number }).environmentIntensity =
        THREE.MathUtils.damp(
          (scene as THREE.Scene & { environmentIntensity: number }).environmentIntensity ?? 1,
          targetEnv,
          6,
          dt
        );
    }

    gl.toneMappingExposure = THREE.MathUtils.lerp(1.12, 1.0, dayFactor);
  });

  return (
    <>
      <hemisphereLight
        ref={hemiLightRef}
        args={['#9CB8D9', '#12161D', 0.85]}
        position={[0, 12, 0]}
      />
      <directionalLight
        ref={keyLightRef}
        color="#FFF0D8"
        intensity={2.35}
        position={[6.5, 9.5, 7.5]}
        castShadow={!isSoftwareGl}
        shadow-mapSize-width={isSoftwareGl ? 512 : 2048}
        shadow-mapSize-height={isSoftwareGl ? 512 : 2048}
        shadow-camera-near={1}
        shadow-camera-far={32}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <directionalLight
        ref={rimLightRef}
        color="#A6C4E8"
        intensity={1.45}
        position={[-7.5, 5.5, -6.5]}
      />
      <pointLight
        ref={amberAccentLightRef}
        color="#F28C28"
        intensity={1.75}
        distance={16}
        decay={2}
        position={[3.5, 1.4, -3.5]}
      />
    </>
  );
}
