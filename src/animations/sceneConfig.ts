import type { AssetId } from '../data/businesses';
import type { ViewportMode } from '../hooks/useViewportMode';

export interface ObjectSceneKeyframe {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  visible: boolean;
  visibilityAlpha: number;
  floatingIntensity: number;
}

export interface SceneKeyframe {
  id: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  cameraFov: number;
  lighting: {
    keyIntensity: number;
    rimIntensity: number;
    envIntensity: number;
  };
  tankerLights: {
    headlights: number;
    taillights: number;
    brakelights: number;
    indicatorsActive: boolean;
  };
  effects: {
    oilDropletsProgress: number;
    engineAssemblyProgress: number;
    fuelStationReveal: number;
  };
  transform: {
    active: boolean;
    outgoingId: AssetId | null;
    incomingId: AssetId | null;
    progress: number;
    anchorPosition: [number, number, number];
  };
  objects: Record<AssetId, ObjectSceneKeyframe>;
}

const ASSET_IDS: AssetId[] = ['tanker', 'biofuel', 'drum', 'canister', 'dispenser'];

function hiddenObj(pos: [number, number, number], rot: [number, number, number] = [0, 0, 0]): ObjectSceneKeyframe {
  return {
    position: pos,
    rotation: rot,
    scale: 0.01,
    visible: false,
    visibilityAlpha: 0,
    floatingIntensity: 0,
  };
}

const DESKTOP_KEYFRAMES: SceneKeyframe[] = [
  // 01 — Master Hero: All 5 visible on right ~60%, clear of left headline
  {
    id: 'scene-01-hero',
    cameraPosition: [-1.55, 1.55, 11.4],
    cameraTarget: [-1.35, 0.35, 0],
    cameraFov: 41,
    lighting: { keyIntensity: 2.35, rimIntensity: 1.5, envIntensity: 1.08 },
    tankerLights: { headlights: 1.1, taillights: 0.5, brakelights: 0.2, indicatorsActive: false },
    effects: { oilDropletsProgress: 0, engineAssemblyProgress: 0, fuelStationReveal: 0 },
    transform: {
      active: false,
      outgoingId: null,
      incomingId: null,
      progress: 0,
      anchorPosition: [2.05, -0.62, 0.75],
    },
    objects: {
      tanker: { position: [-0.05, -0.58, 0.75], rotation: [0.04, -0.48, 0], scale: 0.94, visible: true, visibilityAlpha: 1, floatingIntensity: 0.08 },
      biofuel: { position: [1.3, 0.92, -1.95], rotation: [0.04, 0.38, -0.02], scale: 0.9, visible: true, visibilityAlpha: 1, floatingIntensity: 0.11 },
      drum: { position: [0.42, -0.82, 2.55], rotation: [0.06, -0.25, 0.02], scale: 0.76, visible: true, visibilityAlpha: 1, floatingIntensity: 0.13 },
      canister: { position: [2.88, -0.78, 2.05], rotation: [0.05, -0.42, -0.02], scale: 0.86, visible: true, visibilityAlpha: 1, floatingIntensity: 0.14 },
      dispenser: { position: [3.9, 0.72, -1.3], rotation: [0.03, -0.42, 0.02], scale: 0.9, visible: true, visibilityAlpha: 1, floatingIntensity: 0.1 },
    },
  },
  // 02 — Apex Road Lines Intro: Tanker moves to right, front 3/4 view, content left
  {
    id: 'scene-02-roadlines-intro',
    cameraPosition: [-0.5, 1.48, 8.6],
    cameraTarget: [0.85, 0.35, 0.2],
    cameraFov: 38,
    lighting: { keyIntensity: 2.65, rimIntensity: 1.7, envIntensity: 1.15 },
    tankerLights: { headlights: 1.8, taillights: 0.9, brakelights: 0.3, indicatorsActive: false },
    effects: { oilDropletsProgress: 0, engineAssemblyProgress: 0, fuelStationReveal: 0 },
    transform: {
      active: false,
      outgoingId: null,
      incomingId: null,
      progress: 0,
      anchorPosition: [2.0, -0.68, 0.65],
    },
    objects: {
      tanker: { position: [2.0, -0.68, 0.65], rotation: [0.03, -0.68, 0], scale: 1.06, visible: true, visibilityAlpha: 1, floatingIntensity: 0.025 },
      biofuel: hiddenObj([-7.5, 2.0, -5.0], [0, 0.6, 0]),
      drum: hiddenObj([-7.0, -2.0, 3.5], [0, 0.5, 0]),
      canister: hiddenObj([8.5, -1.6, 3.2], [0, -0.8, 0]),
      dispenser: hiddenObj([9.0, 2.2, -4.5], [0, -0.7, 0]),
    },
  },
  // 03 — Apex Road Lines Capabilities: Same tanker travels right -> left, wheel motion & lights
  {
    id: 'scene-03-roadlines-capabilities',
    cameraPosition: [-0.75, 1.25, 7.65],
    cameraTarget: [-1.15, 0.32, 0.6],
    cameraFov: 35,
    lighting: { keyIntensity: 2.75, rimIntensity: 2.05, envIntensity: 1.22 },
    tankerLights: { headlights: 3.1, taillights: 2.4, brakelights: 2.9, indicatorsActive: true },
    effects: { oilDropletsProgress: 0, engineAssemblyProgress: 0, fuelStationReveal: 0 },
    transform: {
      active: false,
      outgoingId: null,
      incomingId: null,
      progress: 0,
      anchorPosition: [2.05, -0.62, 0.75],
    },
    objects: {
      tanker: { position: [-2.25, -0.72, 0.85], rotation: [0.02, 0.56, 0], scale: 1.12, visible: true, visibilityAlpha: 1, floatingIntensity: 0.01 },
      biofuel: hiddenObj([2.05, -0.62, 0.75], [0.04, -0.45, 0]),
      drum: hiddenObj([-7.0, -2.0, 3.5]),
      canister: hiddenObj([8.5, -1.6, 3.2]),
      dispenser: hiddenObj([9.0, 2.2, -4.5]),
    },
  },
  // 04 — Apex Bio Fuel Intro: Tanker transforms into Biofuel reactor on right
  {
    id: 'scene-04-biofuel-intro',
    cameraPosition: [-0.45, 1.4, 7.3],
    cameraTarget: [0.85, 0.42, 0.5],
    cameraFov: 37,
    lighting: { keyIntensity: 2.7, rimIntensity: 1.95, envIntensity: 1.25 },
    tankerLights: { headlights: 1.2, taillights: 0.8, brakelights: 0.4, indicatorsActive: false },
    effects: { oilDropletsProgress: 0, engineAssemblyProgress: 0, fuelStationReveal: 0 },
    transform: {
      active: false,
      outgoingId: 'tanker',
      incomingId: 'biofuel',
      progress: 1,
      anchorPosition: [2.05, -0.62, 0.75],
    },
    objects: {
      tanker: hiddenObj([2.05, -0.62, 0.75], [0.02, -0.45, 0]),
      biofuel: { position: [2.05, -0.62, 0.75], rotation: [0.04, -0.45, 0], scale: 1.16, visible: true, visibilityAlpha: 1, floatingIntensity: 0.04 },
      drum: hiddenObj([-7.0, -2.0, 3.5]),
      canister: hiddenObj([8.5, -1.6, 3.2]),
      dispenser: hiddenObj([9.0, 2.2, -4.5]),
    },
  },
  // 05 — Apex Bio Fuel Capabilities: Biofuel sweeps right -> left with orbital close-up
  {
    id: 'scene-05-biofuel-capabilities',
    cameraPosition: [-0.55, 1.25, 6.2],
    cameraTarget: [-1.25, 0.52, 0.75],
    cameraFov: 34,
    lighting: { keyIntensity: 2.8, rimIntensity: 2.15, envIntensity: 1.3 },
    tankerLights: { headlights: 0.4, taillights: 0.2, brakelights: 0.1, indicatorsActive: false },
    effects: { oilDropletsProgress: 0, engineAssemblyProgress: 0, fuelStationReveal: 0 },
    transform: {
      active: false,
      outgoingId: null,
      incomingId: null,
      progress: 0,
      anchorPosition: [2.05, -0.65, 0.75],
    },
    objects: {
      tanker: hiddenObj([-7.5, 1.5, -4.5]),
      biofuel: { position: [-1.95, -0.68, 0.85], rotation: [0.06, 0.72, 0], scale: 1.22, visible: true, visibilityAlpha: 1, floatingIntensity: 0.03 },
      drum: hiddenObj([2.05, -0.65, 0.75], [0.06, -0.42, 0]),
      canister: hiddenObj([8.5, -1.6, 3.2]),
      dispenser: hiddenObj([9.0, 2.2, -4.5]),
    },
  },
  // 06 — Pranar Oils Intro: Biofuel transforms into 208L Steel Drum on right
  {
    id: 'scene-06-pranar-intro',
    cameraPosition: [-0.45, 1.38, 7.1],
    cameraTarget: [0.85, 0.35, 0.5],
    cameraFov: 36,
    lighting: { keyIntensity: 2.75, rimIntensity: 2.0, envIntensity: 1.32 },
    tankerLights: { headlights: 0.4, taillights: 0.2, brakelights: 0.1, indicatorsActive: false },
    effects: { oilDropletsProgress: 0.15, engineAssemblyProgress: 0, fuelStationReveal: 0 },
    transform: {
      active: false,
      outgoingId: 'biofuel',
      incomingId: 'drum',
      progress: 1,
      anchorPosition: [2.05, -0.65, 0.75],
    },
    objects: {
      tanker: hiddenObj([-7.5, 1.5, -4.5]),
      biofuel: hiddenObj([2.05, -0.65, 0.75], [0.04, -0.42, 0]),
      drum: { position: [2.05, -0.65, 0.75], rotation: [0.06, -0.42, 0], scale: 1.18, visible: true, visibilityAlpha: 1, floatingIntensity: 0.04 },
      canister: hiddenObj([8.5, -1.6, 3.2]),
      dispenser: hiddenObj([9.0, 2.2, -4.5]),
    },
  },
  // 07 — Pranar Oils Capabilities: Drum moves right -> left, close-up ridges & golden oil droplets
  {
    id: 'scene-07-pranar-capabilities',
    cameraPosition: [-0.55, 1.48, 6.1],
    cameraTarget: [-1.25, 0.42, 0.8],
    cameraFov: 34,
    lighting: { keyIntensity: 2.9, rimIntensity: 2.25, envIntensity: 1.38 },
    tankerLights: { headlights: 0.4, taillights: 0.2, brakelights: 0.1, indicatorsActive: false },
    effects: { oilDropletsProgress: 1, engineAssemblyProgress: 0, fuelStationReveal: 0 },
    transform: {
      active: false,
      outgoingId: null,
      incomingId: null,
      progress: 0,
      anchorPosition: [2.05, -0.65, 0.75],
    },
    objects: {
      tanker: hiddenObj([-7.5, 1.5, -4.5]),
      biofuel: hiddenObj([-7.5, 2.0, -5.0]),
      drum: { position: [-1.95, -0.68, 0.85], rotation: [0.12, 1.35, 0], scale: 1.24, visible: true, visibilityAlpha: 1, floatingIntensity: 0.03 },
      canister: hiddenObj([2.05, -0.65, 0.75], [0.04, -0.35, 0]),
      dispenser: hiddenObj([9.0, 2.2, -4.5]),
    },
  },
  // 08 — Natural Lubes Intro: Drum transforms into Lubricant Canister on right
  {
    id: 'scene-08-lubes-intro',
    cameraPosition: [-0.45, 1.38, 6.9],
    cameraTarget: [0.85, 0.42, 0.5],
    cameraFov: 36,
    lighting: { keyIntensity: 2.8, rimIntensity: 2.15, envIntensity: 1.32 },
    tankerLights: { headlights: 0.4, taillights: 0.2, brakelights: 0.1, indicatorsActive: false },
    effects: { oilDropletsProgress: 0, engineAssemblyProgress: 0, fuelStationReveal: 0 },
    transform: {
      active: false,
      outgoingId: 'drum',
      incomingId: 'canister',
      progress: 1,
      anchorPosition: [2.05, -0.65, 0.75],
    },
    objects: {
      tanker: hiddenObj([-7.5, 1.5, -4.5]),
      biofuel: hiddenObj([-7.5, 2.0, -5.0]),
      drum: hiddenObj([2.05, -0.65, 0.75], [0.04, -0.35, 0]),
      canister: { position: [2.05, -0.65, 0.75], rotation: [0.04, -0.35, 0], scale: 1.24, visible: true, visibilityAlpha: 1, floatingIntensity: 0.045 },
      dispenser: hiddenObj([9.0, 2.2, -4.5]),
    },
  },
  // 09 — Natural Lubes Technology: Canister rotates to back formulation range + engine gear/piston assembly
  {
    id: 'scene-09-lubes-tech',
    cameraPosition: [-0.4, 1.32, 6.8],
    cameraTarget: [-1.05, 0.45, 0.7],
    cameraFov: 35,
    lighting: { keyIntensity: 2.9, rimIntensity: 2.3, envIntensity: 1.35 },
    tankerLights: { headlights: 0.4, taillights: 0.2, brakelights: 0.1, indicatorsActive: false },
    effects: { oilDropletsProgress: 0, engineAssemblyProgress: 1, fuelStationReveal: 0 },
    transform: {
      active: false,
      outgoingId: null,
      incomingId: null,
      progress: 0,
      anchorPosition: [2.05, -0.72, 0.75],
    },
    objects: {
      tanker: hiddenObj([-7.5, 1.5, -4.5]),
      biofuel: hiddenObj([-7.5, 2.0, -5.0]),
      drum: hiddenObj([-7.0, -2.0, 3.5]),
      canister: { position: [-2.35, -0.68, 0.85], rotation: [0.04, 2.75, 0], scale: 1.16, visible: true, visibilityAlpha: 1, floatingIntensity: 0.03 },
      dispenser: hiddenObj([2.05, -0.72, 0.75], [0.03, -0.45, 0]),
    },
  },
  // 10 — JS Fuels Intro: Canister transforms into Fuel Dispenser on right
  {
    id: 'scene-10-jsfuels-intro',
    cameraPosition: [-0.45, 1.42, 7.2],
    cameraTarget: [0.85, 0.45, 0.5],
    cameraFov: 36,
    lighting: { keyIntensity: 2.75, rimIntensity: 2.1, envIntensity: 1.28 },
    tankerLights: { headlights: 0.4, taillights: 0.2, brakelights: 0.1, indicatorsActive: false },
    effects: { oilDropletsProgress: 0, engineAssemblyProgress: 0, fuelStationReveal: 0 },
    transform: {
      active: false,
      outgoingId: 'canister',
      incomingId: 'dispenser',
      progress: 1,
      anchorPosition: [2.05, -0.72, 0.75],
    },
    objects: {
      tanker: hiddenObj([-7.5, 1.5, -4.5]),
      biofuel: hiddenObj([-7.5, 2.0, -5.0]),
      drum: hiddenObj([-7.0, -2.0, 3.5]),
      canister: hiddenObj([2.05, -0.72, 0.75], [0.03, -0.45, 0]),
      dispenser: { position: [2.05, -0.72, 0.75], rotation: [0.03, -0.45, 0], scale: 1.14, visible: true, visibilityAlpha: 1, floatingIntensity: 0.035 },
    },
  },
  // 11 — JS Fuels Experience: Camera pulls back into aerial 3/4 view + full station canopy
  {
    id: 'scene-11-jsfuels-experience',
    cameraPosition: [-0.6, 3.35, 11.4],
    cameraTarget: [-1.1, 0.95, 0.3],
    cameraFov: 42,
    lighting: { keyIntensity: 2.85, rimIntensity: 2.0, envIntensity: 1.25 },
    tankerLights: { headlights: 0.4, taillights: 0.2, brakelights: 0.1, indicatorsActive: false },
    effects: { oilDropletsProgress: 0, engineAssemblyProgress: 0, fuelStationReveal: 1 },
    transform: {
      active: false,
      outgoingId: null,
      incomingId: null,
      progress: 0,
      anchorPosition: [-2.15, -0.78, 0.45],
    },
    objects: {
      tanker: hiddenObj([-7.5, 1.2, -3.5], [0.04, -0.45, 0]),
      biofuel: hiddenObj([-4.5, 2.4, -5.5], [0.04, 0.35, 0]),
      drum: hiddenObj([-4.0, -1.6, 4.5], [0.06, -0.25, 0]),
      canister: hiddenObj([6.5, -1.5, 4.0], [0.05, -0.45, 0]),
      dispenser: { position: [-2.15, -0.78, 0.45], rotation: [0, 0.42, 0], scale: 1.06, visible: true, visibilityAlpha: 1, floatingIntensity: 0 },
    },
  },
  // 12 — Grand Finale: All 5 return smoothly into balanced group composition
  {
    id: 'scene-12-finale',
    cameraPosition: [-1.45, 1.85, 12.2],
    cameraTarget: [-0.95, 0.45, 0],
    cameraFov: 42,
    lighting: { keyIntensity: 2.6, rimIntensity: 1.8, envIntensity: 1.2 },
    tankerLights: { headlights: 1.4, taillights: 0.6, brakelights: 0.2, indicatorsActive: false },
    effects: { oilDropletsProgress: 0, engineAssemblyProgress: 0, fuelStationReveal: 0 },
    transform: {
      active: false,
      outgoingId: null,
      incomingId: null,
      progress: 0,
      anchorPosition: [0, 0, 0],
    },
    objects: {
      tanker: { position: [0.35, -0.65, 0.55], rotation: [0.03, -0.45, 0], scale: 0.96, visible: true, visibilityAlpha: 1, floatingIntensity: 0.06 },
      biofuel: { position: [1.55, 0.85, -1.9], rotation: [0.04, 0.35, -0.02], scale: 0.92, visible: true, visibilityAlpha: 1, floatingIntensity: 0.09 },
      drum: { position: [0.75, -0.82, 2.4], rotation: [0.05, -0.28, 0.02], scale: 0.78, visible: true, visibilityAlpha: 1, floatingIntensity: 0.1 },
      canister: { position: [3.15, -0.78, 1.95], rotation: [0.04, -0.45, -0.02], scale: 0.88, visible: true, visibilityAlpha: 1, floatingIntensity: 0.11 },
      dispenser: { position: [4.05, 0.68, -1.15], rotation: [0.02, -0.42, 0.02], scale: 0.92, visible: true, visibilityAlpha: 1, floatingIntensity: 0.08 },
    },
  },
];

// Explicit sequential shader transitions between adjacent scenes [fromSceneIdx -> toSceneIdx]
const TRANSITION_PAIRS: Record<number, { outId: AssetId; inId: AssetId }> = {
  2: { outId: 'tanker', inId: 'biofuel' },     // 03 -> 04
  4: { outId: 'biofuel', inId: 'drum' },       // 05 -> 06
  6: { outId: 'drum', inId: 'canister' },      // 07 -> 08
  8: { outId: 'canister', inId: 'dispenser' }, // 09 -> 10
};

function adaptKeyframeForViewport(kf: SceneKeyframe, mode: ViewportMode): SceneKeyframe {
  if (mode === 'desktop') return kf;

  const isMobile = mode === 'mobile';
  const clone: SceneKeyframe = JSON.parse(JSON.stringify(kf));

  if (isMobile) {
    clone.cameraFov = kf.cameraFov + 9;
    clone.cameraPosition = [
      kf.cameraPosition[0] * 0.25,
      kf.cameraPosition[1] + 0.5,
      kf.cameraPosition[2] + 2.6,
    ];
    clone.cameraTarget = [0, 0.25, 0.3];

    if (kf.id === 'scene-01-hero' || kf.id === 'scene-12-finale') {
      clone.cameraTarget = [0, 0.42, 0.2];
      clone.objects.tanker = { ...kf.objects.tanker, position: [0, -0.75, 0.2], scale: 0.7 };
      clone.objects.biofuel = { ...kf.objects.biofuel, position: [-1.7, 0.55, -1.4], scale: 0.6 };
      clone.objects.drum = { ...kf.objects.drum, position: [-1.4, -1.35, 0.9], scale: 0.56 };
      clone.objects.canister = { ...kf.objects.canister, position: [1.5, -1.35, 0.95], scale: 0.62 };
      clone.objects.dispenser = { ...kf.objects.dispenser, position: [1.75, 0.6, -1.4], scale: 0.6 };
    } else if (kf.id === 'scene-11-jsfuels-experience') {
      clone.cameraPosition = [0, 3.6, 13.8];
      clone.cameraTarget = [0, 1.3, 0.2];
      clone.objects.dispenser = { ...kf.objects.dispenser, position: [0, -0.95, 0.4], scale: 0.85 };
      clone.transform.anchorPosition = [0, -0.95, 0.4];
    } else {
      clone.transform.anchorPosition = [0, -0.95, 0.55];
      for (const id of ASSET_IDS) {
        if (clone.objects[id].visible) {
          clone.objects[id].position = [0, -0.95, 0.55];
          clone.objects[id].scale = kf.objects[id].scale * 0.78;
        } else {
          clone.objects[id].position = [0, -0.95, 0.55];
        }
      }
    }
  } else {
    // Tablet: gently tighten horizontal spread
    clone.cameraFov = kf.cameraFov + 3;
    clone.cameraPosition = [
      kf.cameraPosition[0] * 0.72,
      kf.cameraPosition[1] + 0.12,
      kf.cameraPosition[2] + 1.0,
    ];
    clone.transform.anchorPosition = [
      kf.transform.anchorPosition[0] * 0.78,
      kf.transform.anchorPosition[1],
      kf.transform.anchorPosition[2],
    ];
    for (const id of ASSET_IDS) {
      clone.objects[id].position = [
        kf.objects[id].position[0] * 0.78,
        kf.objects[id].position[1],
        kf.objects[id].position[2],
      ];
      clone.objects[id].scale = kf.objects[id].scale * 0.9;
    }
  }

  return clone;
}

export function getSceneKeyframes(mode: ViewportMode): SceneKeyframe[] {
  return DESKTOP_KEYFRAMES.map((kf) => adaptKeyframeForViewport(kf, mode));
}

export interface LiveExperienceState {
  scrollProgress: number;
  activeSceneIndex: number;
  themeTarget: number; // 0 = Night, 1 = Day
  interpolated: SceneKeyframe;
  mouseNorm: { x: number; y: number };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep01(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function lerpTuple3(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
  out: [number, number, number]
): void {
  out[0] = lerp(a[0], b[0], t);
  out[1] = lerp(a[1], b[1], t);
  out[2] = lerp(a[2], b[2], t);
}

export function evaluateSceneState(
  keyframes: SceneKeyframe[],
  scrollProgress: number,
  outState: SceneKeyframe
): void {
  const clamped = Math.max(0, Math.min(1, scrollProgress));
  const segCount = keyframes.length - 1;
  const scaled = clamped * segCount;
  const idxA = Math.min(Math.floor(scaled), segCount - 1);
  const idxB = Math.min(idxA + 1, segCount);
  const localT = smoothstep01(scaled - idxA);

  const kfA = keyframes[idxA];
  const kfB = keyframes[idxB];

  outState.id = localT < 0.5 ? kfA.id : kfB.id;
  outState.cameraFov = lerp(kfA.cameraFov, kfB.cameraFov, localT);
  lerpTuple3(kfA.cameraPosition, kfB.cameraPosition, localT, outState.cameraPosition);
  lerpTuple3(kfA.cameraTarget, kfB.cameraTarget, localT, outState.cameraTarget);

  outState.lighting.keyIntensity = lerp(kfA.lighting.keyIntensity, kfB.lighting.keyIntensity, localT);
  outState.lighting.rimIntensity = lerp(kfA.lighting.rimIntensity, kfB.lighting.rimIntensity, localT);
  outState.lighting.envIntensity = lerp(kfA.lighting.envIntensity, kfB.lighting.envIntensity, localT);

  outState.tankerLights.headlights = lerp(kfA.tankerLights.headlights, kfB.tankerLights.headlights, localT);
  outState.tankerLights.taillights = lerp(kfA.tankerLights.taillights, kfB.tankerLights.taillights, localT);
  outState.tankerLights.brakelights = lerp(kfA.tankerLights.brakelights, kfB.tankerLights.brakelights, localT);
  outState.tankerLights.indicatorsActive =
    localT < 0.5 ? kfA.tankerLights.indicatorsActive : kfB.tankerLights.indicatorsActive;

  outState.effects.oilDropletsProgress = lerp(
    kfA.effects.oilDropletsProgress,
    kfB.effects.oilDropletsProgress,
    localT
  );
  outState.effects.engineAssemblyProgress = lerp(
    kfA.effects.engineAssemblyProgress,
    kfB.effects.engineAssemblyProgress,
    localT
  );
  outState.effects.fuelStationReveal = lerp(
    kfA.effects.fuelStationReveal,
    kfB.effects.fuelStationReveal,
    localT
  );

  const transitionPair = TRANSITION_PAIRS[idxA];
  let transformProgress = 0;

  if (transitionPair) {
    transformProgress = smoothstep01((localT - 0.22) / 0.68);
    outState.transform.active = transformProgress > 0.01 && transformProgress < 0.99;
    outState.transform.outgoingId = transitionPair.outId;
    outState.transform.incomingId = transitionPair.inId;
    outState.transform.progress = transformProgress;
    outState.transform.anchorPosition[0] = kfB.transform.anchorPosition[0];
    outState.transform.anchorPosition[1] = kfB.transform.anchorPosition[1];
    outState.transform.anchorPosition[2] = kfB.transform.anchorPosition[2];
  } else {
    outState.transform.active = false;
    outState.transform.outgoingId = null;
    outState.transform.incomingId = null;
    outState.transform.progress = 0;
    lerpTuple3(
      kfA.transform.anchorPosition,
      kfB.transform.anchorPosition,
      localT,
      outState.transform.anchorPosition
    );
  }

  for (const id of ASSET_IDS) {
    const objA = kfA.objects[id];
    const objB = kfB.objects[id];
    const target = outState.objects[id];

    lerpTuple3(objA.position, objB.position, localT, target.position);
    lerpTuple3(objA.rotation, objB.rotation, localT, target.rotation);
    target.scale = lerp(objA.scale, objB.scale, localT);
    target.floatingIntensity = lerp(objA.floatingIntensity, objB.floatingIntensity, localT);
    target.visibilityAlpha = lerp(objA.visibilityAlpha, objB.visibilityAlpha, localT);
    target.visible = objA.visible || objB.visible;

    if (transitionPair) {
      if (id === transitionPair.outId) {
        const anchorBlend = smoothstep01(localT / 0.34);
        lerpTuple3(objA.position, outState.transform.anchorPosition, anchorBlend, target.position);
        target.scale = lerp(objA.scale, objA.scale * 0.85, transformProgress);
        target.visibilityAlpha = 1 - transformProgress;
        target.visible = target.visibilityAlpha > 0.005;
      } else if (id === transitionPair.inId) {
        target.position[0] = outState.transform.anchorPosition[0];
        target.position[1] = outState.transform.anchorPosition[1];
        target.position[2] = outState.transform.anchorPosition[2];
        target.scale = lerp(objB.scale * 0.78, objB.scale, transformProgress);
        target.visibilityAlpha = transformProgress;
        target.visible = target.visibilityAlpha > 0.005;
      }
    }
  }
}
