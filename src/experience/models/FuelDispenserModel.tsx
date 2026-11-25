import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  applyDissolveToGroup,
  type DissolveUniforms,
} from "../shaders/dissolveTransformShader";

const MODEL_URL = `${import.meta.env.BASE_URL}assets/models/js-fuel-dispenser.glb`;
const TARGET_HEIGHT = 2.1;
const MODEL_ROTATION_Y = 0;
const METER_SPEED = 0.65;

interface FuelDispenserModelProps {
  dissolveUniforms?: DissolveUniforms;
}

export function FuelDispenserModel({
  dissolveUniforms,
}: FuelDispenserModelProps) {
  const { scene, animations } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const clone = scene.clone(true);

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

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.material = Array.isArray(object.material)
        ? object.material.map(cloneMaterial)
        : cloneMaterial(object.material);

      const isPanel = /^(meter_|branding_|crown_brand_)/.test(object.name);

      object.castShadow = !isPanel;
      object.receiveShadow = !isPanel;
    });

    const oriented = new THREE.Group();

    oriented.rotation.y = MODEL_ROTATION_Y;
    oriented.add(clone);
    oriented.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(oriented);

    const size = bounds.getSize(new THREE.Vector3());

    const center = bounds.getCenter(new THREE.Vector3());

    const centered = new THREE.Group();

    centered.position.set(-center.x, -bounds.min.y, -center.z);

    centered.add(oriented);

    const root = new THREE.Group();

    root.name = "dispenser_root";

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
      "JS_Fuel_Meter_Cycle",
    );

    if (!clip) return;

    const action = model.mixer.clipAction(clip);

    action.reset().setLoop(THREE.LoopRepeat, Infinity);

    action.timeScale = METER_SPEED;
    action.play();

    model.mixer.update(0);

    return () => {
      action.stop();
      model.mixer.stopAllAction();
      model.mixer.uncacheRoot(model.clone);
    };
  }, [model, animations]);

  useEffect(() => {
    return () => {
      model.materials.forEach((material) => {
        material.dispose();
      });
    };
  }, [model]);

  useFrame((_, delta) => {
    if (dissolveUniforms && dissolveUniforms.uVisibility.value <= 0.004) {
      return;
    }

    model.mixer.update(Math.min(delta, 0.05));
  });

  return <primitive object={model.root} dispose={null} />;
}

useGLTF.preload(MODEL_URL);
