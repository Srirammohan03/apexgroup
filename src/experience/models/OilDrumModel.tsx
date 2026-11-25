import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect } from "react";
import * as THREE from "three";
import {
  applyDissolveToGroup,
  type DissolveUniforms,
} from "../shaders/dissolveTransformShader";
const MODEL_URL = `${import.meta.env.BASE_URL}assets/models/apex-oil-drum.glb`;
const TARGET_HEIGHT = 1.77;
const MODEL_ROTATION_Y = 0;

interface OilDrumModelProps {
  dissolveUniforms?: DissolveUniforms;
}

export function OilDrumModel({ dissolveUniforms }: OilDrumModelProps) {
  const { scene } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const clone = scene.clone(true);

    const materials = new Map<THREE.Material, THREE.Material>();

    const cloneMaterial = (source: THREE.Material) => {
      const existing = materials.get(source);

      if (existing) return existing;

      const material = source.clone();

      if (material instanceof THREE.MeshStandardMaterial) {
        material.envMapIntensity = 1.25;
      }

      materials.set(source, material);

      return material;
    };

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      object.material = Array.isArray(object.material)
        ? object.material.map(cloneMaterial)
        : cloneMaterial(object.material);
    });

    clone.rotation.y = MODEL_ROTATION_Y;
    clone.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clone);

    const size = bounds.getSize(new THREE.Vector3());

    const center = bounds.getCenter(new THREE.Vector3());

    const centered = new THREE.Group();

    centered.add(clone);

    centered.position.set(-center.x, -bounds.min.y, -center.z);

    const root = new THREE.Group();

    root.name = "drum_root";

    root.scale.setScalar(TARGET_HEIGHT / Math.max(size.y, 0.001));

    root.add(centered);

    if (dissolveUniforms) {
      applyDissolveToGroup(root, dissolveUniforms);
    }

    return {
      root,
      materials: [...materials.values()],
    };
  }, [scene, dissolveUniforms]);

  useEffect(() => {
    return () => {
      model.materials.forEach((material) => {
        material.dispose();
      });
    };
  }, [model]);

  return <primitive object={model.root} dispose={null} />;
}

useGLTF.preload(MODEL_URL);
