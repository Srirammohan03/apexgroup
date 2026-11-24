import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { AssetId } from '../../data/businesses';

export type AssetSourceMode = 'procedural-placeholder' | 'glb';

export interface AssetMaterialOverride {
  nodePattern: RegExp;
  color?: string;
  metalness?: number;
  roughness?: number;
  clearcoat?: number;
}

export interface AssetDescriptor {
  id: AssetId;
  businessName: string;
  title: string;
  sourceMode: AssetSourceMode;
  glbPath: string;
  targetScaleHeight: number;
  pivotMode: 'bottom-center' | 'center';
  expectedNodes: string[];
  materialOverrides: AssetMaterialOverride[];
  placeholderNotice: string;
}

export const ASSET_REGISTRY: Record<AssetId, AssetDescriptor> = {
  tanker: {
    id: 'tanker',
    businessName: 'Apex Road Lines',
    title: 'Petroleum Tanker Truck',
    sourceMode: 'procedural-placeholder',
    glbPath: '/assets/models/apex-tanker-truck.glb',
    targetScaleHeight: 2.4,
    pivotMode: 'bottom-center',
    expectedNodes: [
      'cab_body',
      'tank_barrel',
      'chassis_frame',
      'wheel_0..5',
      'headlights',
      'taillights',
      'brakelights',
      'indicators',
    ],
    materialOverrides: [
      { nodePattern: /tank_barrel/i, metalness: 0.92, roughness: 0.22 },
      { nodePattern: /cab_body/i, color: '#1F2630', metalness: 0.55, roughness: 0.34, clearcoat: 0.6 },
    ],
    placeholderNotice:
      'Multi-part procedural PBR development placeholder. Swap sourceMode to "glb" when production CAD GLB is placed in /public/assets/models/.',
  },
  biofuel: {
    id: 'biofuel',
    businessName: 'Apex Bio Fuel India Pvt. Ltd.',
    title: 'Biomass & Biofuel Energy Reactor Vessel',
    sourceMode: 'procedural-placeholder',
    glbPath: '/assets/models/apex-biofuel-vessel.glb',
    targetScaleHeight: 2.2,
    pivotMode: 'bottom-center',
    expectedNodes: ['reactor_vessel', 'cyclone_hopper', 'feed_manifold', 'return_manifold', 'pressure_gauge'],
    materialOverrides: [
      { nodePattern: /reactor_vessel/i, metalness: 0.88, roughness: 0.26 },
    ],
    placeholderNotice:
      'Multi-part procedural PBR development placeholder with animated biofuel sight tube. Ready for production GLB swap.',
  },
  drum: {
    id: 'drum',
    businessName: 'Pranar Oils & Chemicals',
    title: '208L Ribbed Industrial Steel Oil Drum',
    sourceMode: 'procedural-placeholder',
    glbPath: '/assets/models/pranar-oil-drum.glb',
    targetScaleHeight: 1.85,
    pivotMode: 'bottom-center',
    expectedNodes: ['drum_shell', 'rolling_hoop_lower', 'rolling_hoop_upper', 'top_clamp_ring', 'bung_plug_large', 'bung_plug_small'],
    materialOverrides: [
      { nodePattern: /drum_shell/i, metalness: 0.76, roughness: 0.3 },
    ],
    placeholderNotice:
      'Multi-part procedural PBR development placeholder accompanied by golden oil droplets effect. Ready for production GLB swap.',
  },
  canister: {
    id: 'canister',
    businessName: 'Apex Natural Lubes & Chemicals FZCO',
    title: 'Branded Engine Oil Lubricant Canister',
    sourceMode: 'procedural-placeholder',
    glbPath: '/assets/models/apex-lubricant-canister.glb',
    targetScaleHeight: 1.9,
    pivotMode: 'bottom-center',
    expectedNodes: ['canister_body', 'pour_neck', 'screw_cap', 'neck_seal', 'sight_strip', 'front_label', 'back_label'],
    materialOverrides: [
      { nodePattern: /canister_body/i, color: '#191E26', metalness: 0.14, roughness: 0.4, clearcoat: 0.34 },
      { nodePattern: /screw_cap/i, color: '#F28C28', metalness: 0.24, roughness: 0.34 },
    ],
    placeholderNotice:
      'Multi-part procedural PBR development placeholder paired with mechanical engine gear/piston visualization. Ready for production GLB swap.',
  },
  dispenser: {
    id: 'dispenser',
    businessName: 'JS Fuels',
    title: 'Forecourt Fuel Dispenser Column',
    sourceMode: 'procedural-placeholder',
    glbPath: '/assets/models/js-fuel-dispenser.glb',
    targetScaleHeight: 2.35,
    pivotMode: 'bottom-center',
    expectedNodes: ['column_housing', 'display_front', 'display_back', 'hose_left', 'hose_right', 'nozzle_left', 'nozzle_right'],
    materialOverrides: [
      { nodePattern: /column_housing/i, metalness: 0.64, roughness: 0.32 },
    ],
    placeholderNotice:
      'Multi-part procedural PBR development placeholder paired with architectural forecourt canopy reveal. Ready for production GLB swap.',
  },
};

export interface NormalizedAssetResult {
  root: THREE.Group;
  nodes: Record<string, THREE.Object3D>;
  boundingSize: THREE.Vector3;
}

const _box = new THREE.Box3();
const _size = new THREE.Vector3();
const _center = new THREE.Vector3();

export function normalizeAssetGroup(
  rawGroup: THREE.Object3D,
  descriptor: AssetDescriptor
): NormalizedAssetResult {
  const wrapper = new THREE.Group();
  wrapper.name = `asset_${descriptor.id}`;
  wrapper.add(rawGroup);

  rawGroup.updateMatrixWorld(true);
  _box.setFromObject(rawGroup);
  _box.getSize(_size);

  const currentHeight = Math.max(_size.y, 0.001);
  const uniformScale = descriptor.targetScaleHeight / currentHeight;
  rawGroup.scale.multiplyScalar(uniformScale);

  rawGroup.updateMatrixWorld(true);
  _box.setFromObject(rawGroup);
  _box.getCenter(_center);
  _box.getSize(_size);

  rawGroup.position.x -= _center.x;
  rawGroup.position.z -= _center.z;
  if (descriptor.pivotMode === 'bottom-center') {
    rawGroup.position.y -= _box.min.y;
  } else {
    rawGroup.position.y -= _center.y;
  }

  const nodes: Record<string, THREE.Object3D> = {};
  rawGroup.traverse((obj) => {
    if (obj.name) {
      nodes[obj.name] = obj;
    }
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      for (const override of descriptor.materialOverrides) {
        if (override.nodePattern.test(mesh.name) && mesh.material instanceof THREE.MeshStandardMaterial) {
          if (override.color) mesh.material.color.set(override.color);
          if (override.metalness !== undefined) mesh.material.metalness = override.metalness;
          if (override.roughness !== undefined) mesh.material.roughness = override.roughness;
          if (override.clearcoat !== undefined && mesh.material instanceof THREE.MeshPhysicalMaterial) {
            mesh.material.clearcoat = override.clearcoat;
          }
        }
      }
    }
  });

  return {
    root: wrapper,
    nodes,
    boundingSize: _size.clone(),
  };
}

let sharedGltfLoader: GLTFLoader | null = null;

export async function loadNormalizedGLBAsset(
  descriptor: AssetDescriptor
): Promise<NormalizedAssetResult> {
  if (!sharedGltfLoader) {
    sharedGltfLoader = new GLTFLoader();
  }
  const gltf: GLTF = await sharedGltfLoader.loadAsync(descriptor.glbPath);
  return normalizeAssetGroup(gltf.scene, descriptor);
}

export const ASSET_MANIFEST_LIST = Object.values(ASSET_REGISTRY);
