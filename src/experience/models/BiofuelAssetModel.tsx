import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  applyDissolveToGroup,
  type DissolveUniforms,
} from "../shaders/dissolveTransformShader";

const MODEL_URL = `${import.meta.env.BASE_URL}assets/models/apex-biofuel-vessel.glb`;
const TARGET_HEIGHT = 1.92;
const MODEL_ROTATION_Y = 0;

interface BiofuelAssetModelProps {
  dissolveUniforms?: DissolveUniforms;
}

export function BiofuelAssetModel({
  dissolveUniforms,
}: BiofuelAssetModelProps) {
  const { scene, animations } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const clone = scene.clone(true);

    const materials = new Map<THREE.Material, THREE.Material>();

    const cloneMaterial = (source: THREE.Material) => {
      const cached = materials.get(source);

      if (cached) return cached;

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

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.material = Array.isArray(object.material)
        ? object.material.map(cloneMaterial)
        : cloneMaterial(object.material);

      object.castShadow = !object.name.includes("sight_glass");
      object.receiveShadow = true;
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

    root.name = "biofuel_root";

    root.scale.setScalar(TARGET_HEIGHT / Math.max(size.y, 0.001));

    root.add(centered);

    if (dissolveUniforms) {
      applyDissolveToGroup(root, dissolveUniforms);
    }

    return {
      root,
      clone,
      mixer: new THREE.AnimationMixer(clone),
      materials: [...materials.values()],
    };
  }, [scene, dissolveUniforms]);

  useEffect(() => {
    const clip = THREE.AnimationClip.findByName(
      animations,
      "Biofuel_Level_Cycle",
    );

    if (clip) {
      const action = model.mixer.clipAction(clip);

      action.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    }

    return () => {
      model.mixer.stopAllAction();
      model.mixer.uncacheRoot(model.clone);

      model.materials.forEach((material) => {
        material.dispose();
      });
    };
  }, [model, animations]);

  useFrame((_, delta) => {
    if (dissolveUniforms && dissolveUniforms.uVisibility.value <= 0.004) {
      return;
    }

    model.mixer.update(Math.min(delta, 0.05));
  });

  return <primitive object={model.root} dispose={null} />;
}

useGLTF.preload(MODEL_URL);
