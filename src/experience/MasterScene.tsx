import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { LiveExperienceState } from '../animations/sceneConfig';
import type { AssetId } from '../data/businesses';
import { CameraRig } from './CameraRig';
import { LightingRig } from './LightingRig';
import { BiofuelAssetModel } from './models/BiofuelAssetModel';
import { EngineAssemblyModel } from './models/EngineAssemblyModel';
import { FuelDispenserModel } from './models/FuelDispenserModel';
import { FuelStationModel } from './models/FuelStationModel';
import { LubricantCanisterModel } from './models/LubricantCanisterModel';
import { OilDropletsEffect } from './models/OilDropletsEffect';
import { OilDrumModel } from './models/OilDrumModel';
import { createContactShadowTexture } from './models/proceduralTextures';
import { TankerTruckModel, type TankerLightState } from './models/TankerTruckModel';
import { createDissolveUniforms, type DissolveUniforms } from './shaders/dissolveTransformShader';
import { TransformRig } from './TransformRig';

interface MasterSceneProps {
  stateRef: React.MutableRefObject<LiveExperienceState>;
  isSoftwareGl: boolean;
  reducedMotion: boolean;
}

const FLOAT_PHASES: Record<AssetId, number> = {
  tanker: 0.0,
  biofuel: 1.3,
  drum: 2.5,
  canister: 3.7,
  dispenser: 4.9,
};

const NIGHT_FLOOR = new THREE.Color('#0B0D10');
const DAY_FLOOR = new THREE.Color('#E3E7ED');
const NIGHT_RING = new THREE.Color('#252D37');
const DAY_RING = new THREE.Color('#B4BDC8');

export function MasterScene({
  stateRef,
  isSoftwareGl,
  reducedMotion,
}: MasterSceneProps) {
  const scrollRefs = {
    tanker: useRef<THREE.Group>(null),
    biofuel: useRef<THREE.Group>(null),
    drum: useRef<THREE.Group>(null),
    canister: useRef<THREE.Group>(null),
    dispenser: useRef<THREE.Group>(null),
  };

  const floatRefs = {
    tanker: useRef<THREE.Group>(null),
    biofuel: useRef<THREE.Group>(null),
    drum: useRef<THREE.Group>(null),
    canister: useRef<THREE.Group>(null),
    dispenser: useRef<THREE.Group>(null),
  };

  const floorMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const themeFactorRef = useRef<number>(stateRef.current.themeTarget);
  const oilDropletsProgressRef = useRef(0);
  const engineAssemblyProgressRef = useRef(0);
  const fuelStationRevealRef = useRef(0);

  const drumAnchorRef = useRef<[number, number, number]>([-1.95, -0.68, 0.85]);
  const canisterAnchorRef = useRef<[number, number, number]>([-2.35, -0.68, 0.85]);
  const dispenserAnchorRef = useRef<[number, number, number]>([-2.15, -0.78, 0.45]);

  const prevTankerPos = useRef({ x: -0.05, z: 0.75 });
  const tankerLightStateRef = useRef<TankerLightState>({
    headlights: 0.9,
    taillights: 0.4,
    brakelights: 0.2,
    indicators: 0,
    wheelAngle: 0,
  });

  const uniformMap = useMemo<Record<AssetId, DissolveUniforms>>(
    () => ({
      tanker: createDissolveUniforms(1, '#F28C28', 0.065),
      biofuel: createDissolveUniforms(1, '#F28C28', 0.065),
      drum: createDissolveUniforms(1, '#F28C28', 0.065),
      canister: createDissolveUniforms(1, '#F28C28', 0.065),
      dispenser: createDissolveUniforms(1, '#F28C28', 0.065),
    }),
    []
  );

  const contactShadowTex = useMemo(() => createContactShadowTexture(), []);
  useEffect(() => {
    return () => {
      contactShadowTex.dispose();
    };
  }, [contactShadowTex]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const elapsed = state.clock.getElapsedTime();
    const { interpolated, mouseNorm } = stateRef.current;

    const dampSpeed = reducedMotion ? 16 : 6.5;

    (['tanker', 'biofuel', 'drum', 'canister', 'dispenser'] as AssetId[]).forEach((id) => {
      const scrollGrp = scrollRefs[id].current;
      const floatGrp = floatRefs[id].current;
      if (!scrollGrp || !floatGrp) return;

      const cfg = interpolated.objects[id];

      if (!cfg.visible && cfg.visibilityAlpha <= 0.005 && scrollGrp.scale.x < 0.03) {
        scrollGrp.visible = false;
        return;
      }
      scrollGrp.visible = true;

      // Outer ScrollGroup: strict deterministic scroll position, rotation & scale
      scrollGrp.position.x = THREE.MathUtils.damp(scrollGrp.position.x, cfg.position[0], dampSpeed, dt);
      scrollGrp.position.y = THREE.MathUtils.damp(scrollGrp.position.y, cfg.position[1], dampSpeed, dt);
      scrollGrp.position.z = THREE.MathUtils.damp(scrollGrp.position.z, cfg.position[2], dampSpeed, dt);

      scrollGrp.rotation.x = THREE.MathUtils.damp(scrollGrp.rotation.x, cfg.rotation[0], dampSpeed, dt);
      scrollGrp.rotation.y = THREE.MathUtils.damp(scrollGrp.rotation.y, cfg.rotation[1], dampSpeed, dt);
      scrollGrp.rotation.z = THREE.MathUtils.damp(scrollGrp.rotation.z, cfg.rotation[2], dampSpeed, dt);

      const s = THREE.MathUtils.damp(scrollGrp.scale.x, cfg.scale, dampSpeed, dt);
      scrollGrp.scale.setScalar(s);

      // Inner FloatGroup: purely delta-time floating, subtle mouse tilt & continuous inspection spin
      const floatAmp = reducedMotion ? 0 : cfg.floatingIntensity;
      floatGrp.position.y = Math.sin(elapsed * 1.15 + FLOAT_PHASES[id]) * floatAmp;
      floatGrp.rotation.z = Math.cos(elapsed * 0.85 + FLOAT_PHASES[id]) * floatAmp * 0.35;

      const mouseTiltY = reducedMotion ? 0 : mouseNorm.x * 0.075;
      const mouseTiltX = reducedMotion ? 0 : mouseNorm.y * 0.04;

      let inspectSpin = 0;
      if (!reducedMotion) {
        if (id === 'drum' && interpolated.effects.oilDropletsProgress > 0.25) {
          inspectSpin = Math.sin(elapsed * 0.45) * 0.35 * interpolated.effects.oilDropletsProgress;
        } else if (id === 'canister' && interpolated.effects.engineAssemblyProgress > 0.25) {
          inspectSpin = Math.sin(elapsed * 0.5) * 0.45 * interpolated.effects.engineAssemblyProgress;
        }
      }

      floatGrp.rotation.x = mouseTiltX;
      floatGrp.rotation.y = mouseTiltY + inspectSpin;
    });

    // Update companion effect anchors & progress refs
    oilDropletsProgressRef.current = THREE.MathUtils.damp(
      oilDropletsProgressRef.current,
      interpolated.effects.oilDropletsProgress,
      6,
      dt
    );
    engineAssemblyProgressRef.current = THREE.MathUtils.damp(
      engineAssemblyProgressRef.current,
      interpolated.effects.engineAssemblyProgress,
      6,
      dt
    );
    fuelStationRevealRef.current = THREE.MathUtils.damp(
      fuelStationRevealRef.current,
      interpolated.effects.fuelStationReveal,
      6,
      dt
    );

    if (scrollRefs.drum.current) {
      drumAnchorRef.current[0] = scrollRefs.drum.current.position.x;
      drumAnchorRef.current[1] = scrollRefs.drum.current.position.y;
      drumAnchorRef.current[2] = scrollRefs.drum.current.position.z;
    }
    if (scrollRefs.canister.current) {
      canisterAnchorRef.current[0] = scrollRefs.canister.current.position.x;
      canisterAnchorRef.current[1] = scrollRefs.canister.current.position.y;
      canisterAnchorRef.current[2] = scrollRefs.canister.current.position.z;
    }
    if (scrollRefs.dispenser.current) {
      dispenserAnchorRef.current[0] = scrollRefs.dispenser.current.position.x;
      dispenserAnchorRef.current[1] = scrollRefs.dispenser.current.position.y;
      dispenserAnchorRef.current[2] = scrollRefs.dispenser.current.position.z;
    }

    // Tanker wheel travel distance kinematics & Day/Night responsive headlights
    if (scrollRefs.tanker.current) {
      const dx = scrollRefs.tanker.current.position.x - prevTankerPos.current.x;
      const dz = scrollRefs.tanker.current.position.z - prevTankerPos.current.z;
      const travelSign = dx <= 0 ? 1 : -1;
      const travelDist = Math.hypot(dx, dz) * travelSign;
      tankerLightStateRef.current.wheelAngle -= travelDist * 2.45;

      prevTankerPos.current.x = scrollRefs.tanker.current.position.x;
      prevTankerPos.current.z = scrollRefs.tanker.current.position.z;

      const nightWeight = 1 - themeFactorRef.current;
      tankerLightStateRef.current.headlights =
        interpolated.tankerLights.headlights * (0.08 + 0.92 * nightWeight);
      tankerLightStateRef.current.taillights =
        interpolated.tankerLights.taillights * (0.25 + 0.75 * nightWeight);
      tankerLightStateRef.current.brakelights = interpolated.tankerLights.brakelights;
      tankerLightStateRef.current.indicators = interpolated.tankerLights.indicatorsActive
        ? Math.sin(elapsed * 7.5) > 0
          ? 2.6
          : 0.15
        : 0.15;
    }

    // Sync floor & reference ring color with Day/Night interpolation
    const dayFactor = themeFactorRef.current;
    if (floorMatRef.current) {
      floorMatRef.current.color.copy(NIGHT_FLOOR).lerp(DAY_FLOOR, dayFactor);
    }
    if (ringMatRef.current) {
      ringMatRef.current.color.copy(NIGHT_RING).lerp(DAY_RING, dayFactor);
    }
  });

  return (
    <>
      <LightingRig
        stateRef={stateRef}
        themeFactorRef={themeFactorRef}
        isSoftwareGl={isSoftwareGl}
      />
      <CameraRig stateRef={stateRef} reducedMotion={reducedMotion} />
      <TransformRig stateRef={stateRef} uniformMap={uniformMap} />

      <OilDropletsEffect
        visibleProgressRef={oilDropletsProgressRef}
        anchorRef={drumAnchorRef}
      />
      <EngineAssemblyModel
        visibleProgressRef={engineAssemblyProgressRef}
        anchorRef={canisterAnchorRef}
      />
      <FuelStationModel
        revealProgressRef={fuelStationRevealRef}
        themeFactorRef={themeFactorRef}
        anchorRef={dispenserAnchorRef}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.52, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          ref={floorMatRef}
          color="#0B0D10"
          metalness={0.3}
          roughness={0.85}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <ringGeometry args={[6.4, 6.44, 80]} />
        <meshBasicMaterial
          ref={ringMatRef}
          color="#252D37"
          transparent
          opacity={0.42}
        />
      </mesh>

      <group ref={scrollRefs.tanker} position={[-0.05, -0.58, 0.75]}>
        <group ref={floatRefs.tanker}>
          <TankerTruckModel
            dissolveUniforms={uniformMap.tanker}
            lightStateRef={tankerLightStateRef}
          />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <planeGeometry args={[5.8, 2.4]} />
            <meshBasicMaterial
              map={contactShadowTex}
              transparent
              opacity={0.45}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>

      <group ref={scrollRefs.biofuel} position={[1.3, 0.92, -1.95]}>
        <group ref={floatRefs.biofuel}>
          <BiofuelAssetModel dissolveUniforms={uniformMap.biofuel} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <planeGeometry args={[2.5, 2.5]} />
            <meshBasicMaterial
              map={contactShadowTex}
              transparent
              opacity={0.4}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>

      <group ref={scrollRefs.drum} position={[0.42, -0.82, 2.55]}>
        <group ref={floatRefs.drum}>
          <OilDrumModel dissolveUniforms={uniformMap.drum} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <planeGeometry args={[2.1, 2.1]} />
            <meshBasicMaterial
              map={contactShadowTex}
              transparent
              opacity={0.42}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>

      <group ref={scrollRefs.canister} position={[2.88, -0.78, 2.05]}>
        <group ref={floatRefs.canister}>
          <LubricantCanisterModel dissolveUniforms={uniformMap.canister} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <planeGeometry args={[2.2, 2.2]} />
            <meshBasicMaterial
              map={contactShadowTex}
              transparent
              opacity={0.44}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>

      <group ref={scrollRefs.dispenser} position={[3.9, 0.72, -1.3]}>
        <group ref={floatRefs.dispenser}>
          <FuelDispenserModel dissolveUniforms={uniformMap.dispenser} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <planeGeometry args={[2.2, 2.2]} />
            <meshBasicMaterial
              map={contactShadowTex}
              transparent
              opacity={0.4}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}
