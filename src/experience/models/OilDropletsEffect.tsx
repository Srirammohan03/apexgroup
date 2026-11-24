import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface OilDropletsEffectProps {
  visibleProgressRef: React.MutableRefObject<number>;
  anchorRef: React.MutableRefObject<[number, number, number]>;
}

const DROPLET_COUNT = 34;
const _dummy = new THREE.Object3D();

export function OilDropletsEffect({
  visibleProgressRef,
  anchorRef,
}: OilDropletsEffectProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const seeds = useMemo(() => {
    return Array.from({ length: DROPLET_COUNT }, (_, i) => ({
      angle: (i / DROPLET_COUNT) * Math.PI * 2,
      radius: 0.76 + ((i * 5) % 9) * 0.085,
      yBase: ((i * 11) % 17) * 0.11,
      speed: 0.45 + ((i * 3) % 7) * 0.1,
      scale: 0.028 + ((i * 2) % 5) * 0.011,
    }));
  }, []);

  const dropletGeo = useMemo(() => new THREE.SphereGeometry(1, 14, 14), []);
  const dropletMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#E5A238',
        emissive: '#B87218',
        emissiveIntensity: 0.45,
        metalness: 0.32,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
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
    const p = visibleProgressRef.current;
    const mesh = meshRef.current;
    if (!mesh) return;

    if (p <= 0.02) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;

    const t = state.clock.getElapsedTime();
    const [ax, ay, az] = anchorRef.current;

    for (let i = 0; i < DROPLET_COUNT; i++) {
      const s = seeds[i];
      const theta = s.angle + t * s.speed * 0.55;
      const yCycle = ((s.yBase + t * s.speed * 0.35) % 2.15) - 0.1;

      _dummy.position.set(
        ax + Math.cos(theta) * s.radius,
        ay + 0.15 + yCycle,
        az + Math.sin(theta) * s.radius
      );
      _dummy.scale.set(
        s.scale * p,
        s.scale * 1.45 * p,
        s.scale * p
      );
      _dummy.updateMatrix();
      mesh.setMatrixAt(i, _dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      name="pranar_golden_droplets"
      args={[dropletGeo, dropletMat, DROPLET_COUNT]}
      frustumCulled={false}
      visible={false}
    />
  );
}
