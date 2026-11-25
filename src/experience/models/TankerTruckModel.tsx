import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { applyDissolveToGroup, type DissolveUniforms } from '../shaders/dissolveTransformShader';
export interface TankerLightState {
  headlights: number;
  taillights: number;
  brakelights: number;
  indicators: number;
  wheelAngle: number;
}

interface TankerTruckModelProps {
  dissolveUniforms?: DissolveUniforms;
  lightStateRef?: MutableRefObject<TankerLightState>;
}

const MODEL_URL = '/assets/models/apex-tanker.glb';
const TARGET_LENGTH = 4.6;
const WHEEL_PREFIXES = [
  'Wheel_Front_Left_',
  'Wheel_Front_Right_',
  'Wheel_Rear_Left_',
  'Wheel_Rear_Right_',
] as const;

type LightKind = 'headlights' | 'rear' | 'indicators';
type LampMaterial = THREE.MeshStandardMaterial;

function lightKind(name: string): LightKind | undefined {
  if (/^Cab_Headlight_|^Front_FogLight_Lens_/.test(name)) return 'headlights';
  if (/^Rear_TailLight_/.test(name)) return 'rear';
  if (/^Cab_Roof_Marker_|^Side_Marker_Lamp_/.test(name)) return 'indicators';
  return undefined;
}

function prepareTruck(source: THREE.Group, uniforms?: DissolveUniforms) {
  const model = source.clone(true);
  const root = new THREE.Group();
  root.name = 'tanker_root';
  const materials = new Map<THREE.Material, THREE.Material>();
  const lamps = {
    headlights: new Set<LampMaterial>(),
    rear: new Set<LampMaterial>(),
    indicators: new Set<LampMaterial>(),
  };
  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const kind = lightKind(object.name);
    const cloneMaterial = (original: THREE.Material) => {
      let material = materials.get(original);
      if (!material) {
        material = original.clone();
        materials.set(original, material);
      }
      if (kind && material instanceof THREE.MeshStandardMaterial) lamps[kind].add(material);
      return material;
    };
    object.material = Array.isArray(object.material)
      ? object.material.map(cloneMaterial)
      : cloneMaterial(object.material);
    object.castShadow = true;
    object.receiveShadow = true;
  });
  model.updateMatrixWorld(true);
  const wheels: THREE.Group[] = [];
  WHEEL_PREFIXES.forEach((prefix, index) => {
    const parts: THREE.Mesh[] = [];
    model.traverse((object) => {
      if (object instanceof THREE.Mesh && object.name.startsWith(prefix)) parts.push(object);
    });
    const tire = parts.find((part) => part.name.endsWith('Tire'));
    if (!tire) return;
    const center = tire.getWorldPosition(new THREE.Vector3());
    const pivot = new THREE.Group();
    pivot.name = `wheel_${index}`;
    model.add(pivot);
    pivot.position.copy(model.worldToLocal(center));
    pivot.updateMatrixWorld(true);
    parts.forEach((part) => pivot.attach(part));
    wheels.push(pivot);
  });
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model, true);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = TARGET_LENGTH / Math.max(size.x, 0.0001);
  const normalized = new THREE.Group();
  normalized.scale.setScalar(scale);
  model.position.sub(new THREE.Vector3(center.x, bounds.min.y, center.z));
  normalized.add(model);
  root.add(normalized);
  if (uniforms) applyDissolveToGroup(root, uniforms);
  return { root, wheels, lamps, materials };
}

export function TankerTruckModel({ dissolveUniforms, lightStateRef }: TankerTruckModelProps) {
  const { scene } = useGLTF(MODEL_URL);
  const truck = useMemo(() => prepareTruck(scene, dissolveUniforms), [scene, dissolveUniforms]);

  useEffect(() => () => {
    truck.materials.forEach((material) => material.dispose());
  }, [truck]);

  useFrame(() => {
    const state = lightStateRef?.current;
    if (!state) return;
    for (const wheel of truck.wheels) wheel.rotation.z = state.wheelAngle;
    truck.lamps.headlights.forEach((material) => {
      material.emissiveIntensity = Math.max(0, state.headlights);
    });
    truck.lamps.rear.forEach((material) => {
      material.emissiveIntensity = Math.max(0, state.taillights, state.brakelights);
    });
    truck.lamps.indicators.forEach((material) => {
      material.emissiveIntensity = Math.max(0, state.indicators);
    });
  });

  return <primitive object={truck.root} dispose={null} />;
}

useGLTF.preload(MODEL_URL);
