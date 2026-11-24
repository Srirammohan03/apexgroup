import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { LiveExperienceState } from '../animations/sceneConfig';
import type { AssetId } from '../data/businesses';
import type { DissolveUniforms } from './shaders/dissolveTransformShader';

interface TransformRigProps {
  stateRef: React.MutableRefObject<LiveExperienceState>;
  uniformMap: Record<AssetId, DissolveUniforms>;
}

const DROPLET_COUNT = 44;
const _dummy = new THREE.Object3D();

export function TransformRig({ stateRef, uniformMap }: TransformRigProps) {
  const dropletsRef = useRef<THREE.InstancedMesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const dropletSeeds = useMemo(() => {
    return Array.from({ length: DROPLET_COUNT }, (_, i) => ({
      angle: (i / DROPLET_COUNT) * Math.PI * 2,
      radius: 0.45 + ((i * 7) % 11) * 0.09,
      heightOffset: ((i * 13) % 19) * 0.11 - 0.15,
      speed: 1.2 + ((i * 5) % 9) * 0.2,
      baseScale: 0.026 + ((i * 3) % 5) * 0.011,
    }));
  }, []);

  const dropletGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const dropletMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#F28C28',
        emissive: '#F28C28',
        emissiveIntensity: 1.35,
        metalness: 0.4,
        roughness: 0.2,
      }),
    []
  );

  useEffect(() => {
    return () => {
      dropletGeo.dispose();
      dropletMat.dispose();
    };
  }, [dropletGeo, dropletMat]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const { transform, objects } = stateRef.current.interpolated;

    (['tanker', 'biofuel', 'drum', 'canister', 'dispenser'] as AssetId[]).forEach((id) => {
      const uniforms = uniformMap[id];
      uniforms.uTime.value = t;
      uniforms.uVisibility.value = objects[id].visibilityAlpha;
    });

    const p = transform.progress;
    const bell = transform.active ? Math.sin(p * Math.PI) : 0;

    const mesh = dropletsRef.current;
    if (mesh) {
      const isActive = bell > 0.02;
      mesh.visible = isActive;

      if (isActive) {
        const [ax, ay, az] = transform.anchorPosition;
        for (let i = 0; i < DROPLET_COUNT; i++) {
          const seed = dropletSeeds[i];
          const theta = seed.angle + t * seed.speed + p * 4.2;
          const r = seed.radius * (0.4 + 0.75 * bell);
          const y = ay + 0.65 + seed.heightOffset + Math.sin(t * 2.2 + i) * 0.22 * bell;

          _dummy.position.set(
            ax + Math.cos(theta) * r,
            y,
            az + Math.sin(theta) * r
          );
          _dummy.rotation.set(theta, t, 0);
          _dummy.scale.setScalar(seed.baseScale * bell);
          _dummy.updateMatrix();
          mesh.setMatrixAt(i, _dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }
    }

    if (ringRef.current) {
      const [ax, ay, az] = transform.anchorPosition;
      ringRef.current.visible = bell > 0.02;
      ringRef.current.position.set(ax, ay + 0.04, az);
      ringRef.current.scale.setScalar(0.8 + bell * 0.65);
    }
  });

  return (
    <group name="transform_rig">
      <instancedMesh
        ref={dropletsRef}
        args={[dropletGeo, dropletMat, DROPLET_COUNT]}
        frustumCulled={false}
        visible={false}
      />
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[1.05, 1.14, 48]} />
        <meshBasicMaterial
          color="#F28C28"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
