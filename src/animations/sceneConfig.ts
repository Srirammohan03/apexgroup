import type { AssetId } from '../data/businesses';
import type { ViewportMode } from '../hooks/useViewportMode';

type Vec3 = [number, number, number];
type Rect = [number, number, number, number];

export interface ObjectSceneKeyframe {
  position: Vec3;
  rotation: Vec3;
  scale: number;
  visible: boolean;
  visibilityAlpha: number;
  floatingIntensity: number;
}

export interface SceneKeyframe {
  id: string;
  cameraPosition: Vec3;
  cameraTarget: Vec3;
  cameraFov: number;
  lighting: { keyIntensity: number; rimIntensity: number; envIntensity: number };
  tankerLights: { headlights: number; taillights: number; brakelights: number; indicatorsActive: boolean };
  effects: { oilDropletsProgress: number; engineAssemblyProgress: number; fuelStationReveal: number };
  transform: { active: boolean; outgoingId: AssetId | null; incomingId: AssetId | null; progress: number; anchorPosition: Vec3 };
  objects: Record<AssetId, ObjectSceneKeyframe>;
}

export interface LiveExperienceState {
  scrollProgress: number;
  activeSceneIndex: number;
  themeTarget: number;
  interpolated: SceneKeyframe;
  mouseNorm: { x: number; y: number };
}

const IDS: AssetId[] = ['tanker', 'biofuel', 'drum', 'canister', 'dispenser'];
const DIMENSIONS: Record<AssetId, Vec3> = {
  tanker: [4.6, 1.787, 1.612],
  biofuel: [1.915, 1.92, 1.24],
  drum: [1.156, 1.77, 1.156],
  canister: [1.473, 2.38, 0.65],
  dispenser: [1.554, 2.1, 0.655],
};
const STATION_DIMENSIONS: Vec3 = [6.4, 3.98, 4.4];

// Increase to 1.05 for tighter product close-ups; safe-zone fitting still applies.
const PRODUCT_SIZE = 1.18;
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => { const x = clamp(t); return x * x * (3 - 2 * x); };
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a: Vec3): Vec3 => mul(a, 1 / Math.max(Math.hypot(...a), 1e-8));
const mix = (a: Vec3, b: Vec3, t: number, out: Vec3) => { for (let i = 0; i < 3; i++) out[i] = lerp(a[i], b[i], t); };

function cameraBasis(k: SceneKeyframe) {
  const forward = unit(sub(k.cameraTarget, k.cameraPosition));
  const right = unit(cross(forward, [0, 1, 0]));
  return { forward, right, up: cross(right, forward) };
}

function corners(size: Vec3, yaw: number, scale: number): Vec3[] {
  const result: Vec3[] = [];
  const c = Math.cos(yaw), s = Math.sin(yaw);
  for (const x of [-size[0] / 2, size[0] / 2]) for (const y of [-size[1] / 2, size[1] / 2]) for (const z of [-size[2] / 2, size[2] / 2]) {
    result.push(mul([c * x + s * z, y, -s * x + c * z], scale));
  }
  return result;
}

function fit(k: SceneKeyframe, aspect: number, size: Vec3, rect: Rect, yaw: number, maxScale: number, depthOffset = 0, fixedScale = false) {
  const { forward, right, up } = cameraBasis(k);
  const tan = Math.tan(k.cameraFov * Math.PI / 360);
  const cx = (rect[0] + rect[2]) / 2, cy = (rect[1] + rect[3]) / 2;
  let depth = Math.hypot(...sub(k.cameraTarget, k.cameraPosition)) + depthOffset;
  let scale = maxScale;
  const project = (center: Vec3, scale: number): Rect => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of corners(size, yaw, scale)) {
      const v = sub(add(center, p), k.cameraPosition), z = dot(v, forward);
      if (z <= 0.1) return [-Infinity, -Infinity, Infinity, Infinity];
      const x = .5 + dot(v, right) / (2 * z * tan * aspect), y = .5 - dot(v, up) / (2 * z * tan);
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    return [minX, minY, maxX, maxY];
  };
  let center: Vec3 = [0, 0, 0];
  for (let i = 0; i < 100; i++) {
    center = add(k.cameraPosition, add(mul(forward, depth), add(mul(right, (cx * 2 - 1) * depth * tan * aspect), mul(up, (1 - cy * 2) * depth * tan))));
    // Center the projected silhouette, not merely the world-space pivot.
    for (let j = 0; j < 5; j++) {
      const box = project(center, scale);
      if (!box.every(Number.isFinite)) break;
      const dx = cx - (box[0] + box[2]) / 2, dy = cy - (box[1] + box[3]) / 2;
      center = add(center, add(mul(right, dx * 2 * depth * tan * aspect), mul(up, -dy * 2 * depth * tan)));
    }
    const box = project(center, scale);
    if (box[0] >= rect[0] && box[1] >= rect[1] && box[2] <= rect[2] && box[3] <= rect[3]) break;
    if (fixedScale) depth *= 1.035; else scale *= .975;
  }
  return { position: sub(center, [0, size[1] * scale / 2, 0]), scale };
}

function hidden(position: Vec3 = [0, -2, -6]): ObjectSceneKeyframe {
  return { position: [...position], rotation: [0, 0, 0], scale: .01, visible: false, visibilityAlpha: 0, floatingIntensity: 0 };
}

function base(id: string, cameraPosition: Vec3, cameraTarget: Vec3, cameraFov: number, light: [number, number, number]): SceneKeyframe {
  return {
    id, cameraPosition, cameraTarget, cameraFov,
    lighting: { keyIntensity: light[0], rimIntensity: light[1], envIntensity: light[2] },
    tankerLights: { headlights: .4, taillights: .2, brakelights: .1, indicatorsActive: false },
    effects: { oilDropletsProgress: 0, engineAssemblyProgress: 0, fuelStationReveal: 0 },
    transform: { active: false, outgoingId: null, incomingId: null, progress: 0, anchorPosition: [0, 0, 0] },
    objects: { tanker: hidden(), biofuel: hidden(), drum: hidden(), canister: hidden(), dispenser: hidden() }
  };
}

interface Chapter { id: string; asset: AssetId; side: 'left' | 'right'; yaw: number; scale: number; distance: number; fov: number; light: [number, number, number] }
const CHAPTERS: Chapter[] = [
  { id: 'scene-02-roadlines-intro', asset: 'tanker', side: 'right', yaw: -.60, scale: 1.03, distance: 10.5, fov: 39, light: [2.65, 1.7, 1.15] },
  { id: 'scene-03-roadlines-capabilities', asset: 'tanker', side: 'left', yaw: .28, scale: 1.04, distance: 10.3, fov: 39, light: [2.75, 2.05, 1.22] },
  { id: 'scene-04-biofuel-intro', asset: 'biofuel', side: 'right', yaw: -.28, scale: 1.48, distance: 8.2, fov: 36, light: [2.7, 1.95, 1.25] },
  { id: 'scene-05-biofuel-capabilities', asset: 'biofuel', side: 'left', yaw: .42, scale: 1.55, distance: 8.0, fov: 37, light: [2.8, 2.15, 1.3] },
  { id: 'scene-06-pranar-intro', asset: 'drum', side: 'right', yaw: -.18, scale: 1.68, distance: 7.8, fov: 36, light: [2.75, 2, 1.32] },
  { id: 'scene-07-pranar-capabilities', asset: 'drum', side: 'left', yaw: .35, scale: 1.68, distance: 7.9, fov: 36, light: [2.9, 2.25, 1.38] },
  { id: 'scene-08-lubes-intro', asset: 'canister', side: 'right', yaw: -.28, scale: 1.35, distance: 8.0, fov: 36, light: [2.8, 2.15, 1.32] },
  { id: 'scene-09-lubes-tech', asset: 'canister', side: 'left', yaw: .55, scale: 1.28, distance: 8.5, fov: 38, light: [2.9, 2.3, 1.35] },
  { id: 'scene-10-jsfuels-intro', asset: 'dispenser', side: 'right', yaw: -.28, scale: 1.42, distance: 8.1, fov: 36, light: [2.75, 2.1, 1.28] },
  { id: 'scene-11-jsfuels-experience', asset: 'dispenser', side: 'left', yaw: 0, scale: 1.06, distance: 12.5, fov: 42, light: [2.85, 2, 1.25] },
];

function visualRect(side: 'left' | 'right', mode: ViewportMode): Rect {
  if (mode === 'mobile') return [.045, .12, .955, .50];
  if (mode === 'tablet') return side === 'left' ? [.035, .13, .475, .87] : [.525, .13, .965, .87];
  return side === 'left' ? [.035, .12, .475, .88] : [.525, .12, .965, .88];
}

function ecosystem(id: string, mode: ViewportMode, aspect: number): SceneKeyframe {
  const mobile = mode === 'mobile';
  const k = base(id, [0, 1.7, 12], [0, .65, 0], 41, [2.35, 1.5, 1.08]);
  const slots: Record<AssetId, Rect> = mobile ? {
    tanker: [.045, .31, .955, .50], biofuel: [.045, .12, .27, .30], drum: [.28, .12, .49, .30], canister: [.50, .12, .72, .30], dispenser: [.73, .12, .955, .30]
  } : {
    tanker: [.525, .49, .965, .88], biofuel: [.525, .12, .645, .47], drum: [.65, .16, .745, .47], canister: [.75, .12, .855, .47], dispenser: [.86, .12, .965, .47]
  };
  for (const asset of IDS) {
    const yaw = asset === 'tanker' ? -.45 : -.20;
    const f = fit(k, aspect, DIMENSIONS[asset], slots[asset], yaw, asset === 'tanker' ? 1.35 : 1.35);
    k.objects[asset] = { ...f, rotation: [0, yaw, 0], visible: true, visibilityAlpha: 1, floatingIntensity: mobile ? .008 : .015 };
  }
  const tankerMinY = -.68;
  const lift = Math.max(0, tankerMinY - k.objects.tanker.position[1]);
  if (lift > 0) {
    const shift: Vec3 = [0, lift, 0];
    k.cameraPosition = add(k.cameraPosition, shift);
    k.cameraTarget = add(k.cameraTarget, shift);
    k.transform.anchorPosition = add(k.transform.anchorPosition, shift);
    for (const asset of IDS) {
      k.objects[asset].position = add(k.objects[asset].position, shift);
    }
  }
  k.tankerLights = { headlights: 1.1, taillights: .5, brakelights: .2, indicatorsActive: false };
  return k;
}

export function getSceneKeyframes(mode: ViewportMode): SceneKeyframe[] {
  const aspect = typeof window === 'undefined' ? (mode === 'mobile' ? .48 : mode === 'tablet' ? 1.33 : 1.9) : Math.max(.25, window.innerWidth / Math.max(1, window.innerHeight));
  const mobile = mode === 'mobile';
  const frames = [ecosystem('scene-01-hero', mode, aspect)];
  for (const c of CHAPTERS) {
    const station = c.id === 'scene-11-jsfuels-experience';
    const k = base(c.id, [0, station ? 3.35 : 1.45, c.distance], [0, station ? 1.1 : .7, 0], c.fov, c.light);
    const rect = visualRect(c.side, mode);
    if (station) {
      const f = fit(k, aspect, STATION_DIMENSIONS, rect, 0, 1, 0, true);
      const shift: Vec3 = [0, -.78 - f.position[1], .45 - f.position[2]];
      k.cameraPosition = add(k.cameraPosition, shift);
      k.cameraTarget = add(k.cameraTarget, shift);
      f.position = add(f.position, shift);
      k.objects.dispenser = { position: [...f.position], rotation: [0, 0, 0], scale: c.scale, visible: true, visibilityAlpha: 1, floatingIntensity: 0 };
      k.transform.anchorPosition = [...f.position];
      k.effects.fuelStationReveal = 1;
    } else {
      const slot: Rect = c.id === 'scene-09-lubes-tech' && !mobile ? [.035, .12, .34, .88] : rect;
      const f = fit(k, aspect, DIMENSIONS[c.asset], slot, c.yaw, c.scale * PRODUCT_SIZE, 0);
      const groundY = -.68;
      const shift: Vec3 = [0, groundY - f.position[1], 0];
      k.cameraPosition = add(k.cameraPosition, shift);
      k.cameraTarget = add(k.cameraTarget, shift);
      f.position = add(f.position, shift);
      k.objects[c.asset] = { ...f, rotation: [0, c.yaw, 0], visible: true, visibilityAlpha: 1, floatingIntensity: c.asset === 'tanker' ? .006 : .014 };
      k.transform.anchorPosition = [...f.position];
    }
    if (c.id === 'scene-02-roadlines-intro') k.tankerLights = { headlights: 1.8, taillights: .9, brakelights: .3, indicatorsActive: false };
    if (c.id === 'scene-03-roadlines-capabilities') k.tankerLights = { headlights: 3.1, taillights: 2.4, brakelights: 2.9, indicatorsActive: true };
    if (c.id === 'scene-06-pranar-intro') k.effects.oilDropletsProgress = .15;
    if (c.id === 'scene-07-pranar-capabilities') k.effects.oilDropletsProgress = 1;
    if (c.id === 'scene-09-lubes-tech') k.effects.engineAssemblyProgress = 1;
    frames.push(k);
  }
  frames.push(ecosystem('scene-12-finale', mode, aspect));
  for (const [i, pair] of Object.entries(TRANSITIONS)) {
    const a = frames[Number(i)], b = frames[Number(i) + 1];
    const anchor = b.objects[pair.inId].position;
    a.objects[pair.inId] = { ...hidden(anchor), rotation: [...b.objects[pair.inId].rotation] };
    b.objects[pair.outId] = { ...hidden(anchor), rotation: [...a.objects[pair.outId].rotation] };
    b.transform = { active: false, outgoingId: pair.outId, incomingId: pair.inId, progress: 1, anchorPosition: [...anchor] };
  }
  return frames;
}

const TRANSITIONS: Record<number, { outId: AssetId; inId: AssetId }> = {
  2: { outId: 'tanker', inId: 'biofuel' }, 4: { outId: 'biofuel', inId: 'drum' }, 6: { outId: 'drum', inId: 'canister' }, 8: { outId: 'canister', inId: 'dispenser' }
};

export function evaluateSceneState(keyframes: SceneKeyframe[], scrollProgress: number, out: SceneKeyframe): void {
  if (keyframes.length < 2) return;
  const n = keyframes.length - 1, scaled = clamp(scrollProgress) * n;
  const i = Math.min(Math.floor(scaled), n - 1), a = keyframes[i], b = keyframes[i + 1];
  const t = smooth((scaled - i - .10) / .80);
  out.id = t < .5 ? a.id : b.id;
  out.cameraFov = lerp(a.cameraFov, b.cameraFov, t);
  mix(a.cameraPosition, b.cameraPosition, t, out.cameraPosition);
  mix(a.cameraTarget, b.cameraTarget, t, out.cameraTarget);
  for (const key of ['keyIntensity', 'rimIntensity', 'envIntensity'] as const) out.lighting[key] = lerp(a.lighting[key], b.lighting[key], t);
  for (const key of ['headlights', 'taillights', 'brakelights'] as const) out.tankerLights[key] = lerp(a.tankerLights[key], b.tankerLights[key], t);
  out.tankerLights.indicatorsActive = t < .5 ? a.tankerLights.indicatorsActive : b.tankerLights.indicatorsActive;
  for (const key of ['oilDropletsProgress', 'engineAssemblyProgress', 'fuelStationReveal'] as const) out.effects[key] = lerp(a.effects[key], b.effects[key], t);
  const pair = TRANSITIONS[i];
  const p = pair ? smooth((t - .32) / .48) : 0;
  out.transform.active = !!pair && p > .001 && p < .999;
  out.transform.outgoingId = pair?.outId ?? null;
  out.transform.incomingId = pair?.inId ?? null;
  out.transform.progress = p;
  if (pair) mix(b.transform.anchorPosition, b.transform.anchorPosition, 0, out.transform.anchorPosition);
  else mix(a.transform.anchorPosition, b.transform.anchorPosition, t, out.transform.anchorPosition);
  for (const id of IDS) {
    const x = a.objects[id], y = b.objects[id], o = out.objects[id];
    mix(x.position, y.position, t, o.position);
    mix(x.rotation, y.rotation, t, o.rotation);
    o.scale = lerp(x.scale, y.scale, t);
    o.floatingIntensity = lerp(x.floatingIntensity, y.floatingIntensity, t);
    o.visibilityAlpha = lerp(x.visibilityAlpha, y.visibilityAlpha, t);
    if (pair && id === pair.outId) {
      mix(x.position, b.transform.anchorPosition, smooth(t / .32), o.position);
      o.scale = lerp(x.scale, x.scale * .78, p);
      o.visibilityAlpha = 1 - p;
    } else if (pair && id === pair.inId) {
      mix(b.transform.anchorPosition, y.position, t, o.position);
      o.scale = lerp(y.scale * .78, y.scale, p);
      o.visibilityAlpha = p;
    }
    o.visible = o.visibilityAlpha > .005;
    if (t === 0 || t === 1) {
      const endpoint = t === 0 ? x : y;
      mix(endpoint.position, endpoint.position, 0, o.position);
      mix(endpoint.rotation, endpoint.rotation, 0, o.rotation);
      o.scale = endpoint.scale; o.visibilityAlpha = endpoint.visibilityAlpha; o.visible = endpoint.visible; o.floatingIntensity = endpoint.floatingIntensity;
    }
    if (id === 'tanker' && o.visible) {
      o.position[1] = Math.max(-.68, o.position[1]);
    }
  }
}
