import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

const MODEL_URL = `${import.meta.env.BASE_URL}assets/models/js-fuel-station.glb`;
const MODEL_SCALE = 1;
const MODEL_ROTATION_Y = 0;

interface FuelStationModelProps {
  revealProgressRef: MutableRefObject<number>;
  themeFactorRef: MutableRefObject<number>;
  anchorRef: MutableRefObject<[number, number, number]>;
}

export function FuelStationModel({
  revealProgressRef,
  themeFactorRef,
  anchorRef,
}: FuelStationModelProps) {
  const { scene } = useGLTF(MODEL_URL);
  const rootRef = useRef<THREE.Group>(null);
  const canopyLightRef = useRef<THREE.PointLight>(null);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const materials = new Map<THREE.Material, THREE.Material>();
    const ledMaterials = new Set<THREE.MeshStandardMaterial>();
    const fasciaMaterials = new Set<THREE.MeshStandardMaterial>();

    const cloneMaterial = (source: THREE.Material) => {
      const cached = materials.get(source);
      if (cached) return cached;
      const material = source.clone();
      if (material instanceof THREE.MeshStandardMaterial) {
        const name = material.name.toLowerCase();

        if (/fascia|brand|label|signage/.test(name) && material.map) {
          material.color.set("#FFFFFF");

          material.metalness = 0;
          material.roughness = 0.85;
          material.envMapIntensity = 0;

          material.emissive.set("#FFFFFF");
          material.emissiveMap = material.map;
          material.emissiveIntensity = 0.15;

          material.toneMapped = false;
          material.fog = false;

          material.map.anisotropy = 8;

          material.needsUpdate = true;
        }
      }
      materials.set(source, material);
      return material;
    };

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.material = Array.isArray(object.material)
        ? object.material.map(cloneMaterial)
        : cloneMaterial(object.material);
      const isPanel = /^(fascia_|canopy_led_)/.test(object.name);
      object.castShadow = !isPanel && !object.name.includes("asphalt");
      object.receiveShadow = !isPanel;
    });

    clone.rotation.y = MODEL_ROTATION_Y;
    clone.scale.setScalar(MODEL_SCALE);

    return {
      clone,
      materials: [...materials.values()],
      ledMaterials: [...ledMaterials],
      fasciaMaterials: [...fasciaMaterials],
    };
  }, [scene]);

  useEffect(() => {
    return () => {
      model.materials.forEach((material) => material.dispose());
    };
  }, [model]);

  useFrame(() => {
    const root = rootRef.current;
    if (!root) return;
    const p = THREE.MathUtils.clamp(revealProgressRef.current, 0, 1);
    root.visible = p > 0.02;
    if (!root.visible) return;

    const [x, y, z] = anchorRef.current;
    root.position.set(x, y - 0.02, z);
    root.scale.set(0.55 + 0.45 * p, 0.25 + 0.75 * p, 0.55 + 0.45 * p);

    const night = 1 - THREE.MathUtils.clamp(themeFactorRef.current, 0, 1);

    for (const material of model.ledMaterials) {
      material.emissiveIntensity = (0.25 + night * 2.1) * p;
    }
    for (const material of model.fasciaMaterials) {
      material.emissiveIntensity = (0.08 + night * 0.45) * p;
    }
    if (canopyLightRef.current) {
      canopyLightRef.current.intensity = (0.4 + night * 3.8) * p;
    }
  });

  return (
    <group ref={rootRef} name="js_fuels_station_canopy" visible={false}>
      <primitive object={model.clone} dispose={null} />
      <pointLight
        ref={canopyLightRef}
        position={[0, 3.2, 0]}
        color="#fff2dc"
        intensity={0}
        distance={12}
        decay={2}
      />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
