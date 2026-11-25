import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  applyDissolveToGroup,
  type DissolveUniforms,
} from "../shaders/dissolveTransformShader";

const MODEL_URL = "/assets/models/apex-lubricant-canister.glb";
const TARGET_HEIGHT = 2.38;
const MODEL_ROTATION_Y = 0;

interface LubricantCanisterModelProps {
  dissolveUniforms?: DissolveUniforms;
}

export function LubricantCanisterModel({
  dissolveUniforms,
}: LubricantCanisterModelProps) {
  const { scene } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const cloned = scene.clone(true);
    const materials = new Map<THREE.Material, THREE.Material>();

    const cloneMaterial = (source: THREE.Material) => {
      const existing = materials.get(source);

      if (existing) return existing;

      const material = source.clone();

      if (material instanceof THREE.MeshStandardMaterial) {
        const name = material.name.toLowerCase();

        if (
          name.includes("steel") ||
          name.includes("chrome") ||
          name.includes("metal")
        ) {
          material.color.set("#929DA8");
          material.metalness = 1;
          material.roughness = 0.18;
          material.envMapIntensity = 1.8;
        } else if (
          name.includes("orange") ||
          name.includes("amber") ||
          name.includes("brass")
        ) {
          material.color.set("#F28C28");
          material.metalness = 0.45;
          material.roughness = 0.28;
          material.envMapIntensity = 1.2;
        } else {
          material.envMapIntensity = 1.2;
        }

        material.needsUpdate = true;
      }

      materials.set(source, material);

      return material;
    };

    cloned.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      if (Array.isArray(object.material)) {
        object.material = object.material.map(cloneMaterial);
      } else {
        object.material = cloneMaterial(object.material);
      }
    });

    cloned.rotation.y = MODEL_ROTATION_Y;
    cloned.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(cloned);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());

    const scale = TARGET_HEIGHT / Math.max(size.y, 0.001);

    const centeredGroup = new THREE.Group();

    centeredGroup.add(cloned);

    centeredGroup.position.set(-center.x, -bounds.min.y, -center.z);

    const root = new THREE.Group();

    root.name = "canister_root";
    root.scale.setScalar(scale);
    root.add(centeredGroup);

    if (dissolveUniforms) {
      applyDissolveToGroup(root, dissolveUniforms);
    }

    return {
      root,
      materials: Array.from(materials.values()),
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
