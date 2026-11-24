import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  applyDissolveToGroup,
  type DissolveUniforms,
} from '../shaders/dissolveTransformShader';
import { createPressureGaugeTexture } from './proceduralTextures';

interface BiofuelAssetModelProps {
  dissolveUniforms?: DissolveUniforms;
}

export function BiofuelAssetModel({ dissolveUniforms }: BiofuelAssetModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const liquidCoreRef = useRef<THREE.Mesh>(null);

  const assets = useMemo(() => {
    const gaugeTex = createPressureGaugeTexture();

    const vesselProfile = [
      new THREE.Vector2(0, 0.22),
      new THREE.Vector2(0.45, 0.28),
      new THREE.Vector2(0.56, 0.42),
      new THREE.Vector2(0.56, 1.48),
      new THREE.Vector2(0.48, 1.72),
      new THREE.Vector2(0.24, 1.88),
      new THREE.Vector2(0.24, 2.02),
      new THREE.Vector2(0, 2.02),
    ];
    const vesselGeo = new THREE.LatheGeometry(vesselProfile, 40);

    const hopperProfile = [
      new THREE.Vector2(0.06, 0.38),
      new THREE.Vector2(0.28, 1.05),
      new THREE.Vector2(0.28, 1.45),
      new THREE.Vector2(0, 1.45),
    ];
    const hopperGeo = new THREE.LatheGeometry(hopperProfile, 30);

    const pipeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.68, 1.32, 0),
      new THREE.Vector3(0.48, 1.68, 0.14),
      new THREE.Vector3(0.18, 1.82, 0.08),
    ]);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 22, 0.045, 12, false);

    const returnCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.56, 0.56, 0.12),
      new THREE.Vector3(-0.74, 0.85, 0.24),
      new THREE.Vector3(-0.62, 1.24, 0.16),
      new THREE.Vector3(-0.5, 1.34, 0.05),
    ]);
    const returnPipeGeo = new THREE.TubeGeometry(returnCurve, 22, 0.034, 10, false);

    const steelMat = new THREE.MeshStandardMaterial({
      color: '#C2CBD4',
      metalness: 0.88,
      roughness: 0.24,
      envMapIntensity: 1.28,
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: '#192028',
      metalness: 0.45,
      roughness: 0.65,
    });

    const amberRingMat = new THREE.MeshStandardMaterial({
      color: '#F28C28',
      metalness: 0.35,
      roughness: 0.3,
    });

    const gaugeMat = new THREE.MeshStandardMaterial({
      map: gaugeTex,
      roughness: 0.2,
      metalness: 0.1,
    });

    const sightGlassOuterMat = new THREE.MeshPhysicalMaterial({
      color: '#DCE6F0',
      metalness: 0.05,
      roughness: 0.08,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.36,
    });

    const liquidCoreMat = new THREE.MeshStandardMaterial({
      color: '#E59A2B',
      emissive: '#D97B18',
      emissiveIntensity: 0.55,
      metalness: 0.15,
      roughness: 0.18,
    });

    return {
      gaugeTex,
      vesselGeo,
      hopperGeo,
      pipeGeo,
      returnPipeGeo,
      steelMat,
      frameMat,
      amberRingMat,
      gaugeMat,
      sightGlassOuterMat,
      liquidCoreMat,
    };
  }, []);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    if (dissolveUniforms) {
      applyDissolveToGroup(group, dissolveUniforms);
    }
  }, [dissolveUniforms]);

  useEffect(() => {
    return () => {
      assets.gaugeTex.dispose();
      assets.vesselGeo.dispose();
      assets.hopperGeo.dispose();
      assets.pipeGeo.dispose();
      assets.returnPipeGeo.dispose();
      assets.steelMat.dispose();
      assets.frameMat.dispose();
      assets.amberRingMat.dispose();
      assets.gaugeMat.dispose();
      assets.sightGlassOuterMat.dispose();
      assets.liquidCoreMat.dispose();
    };
  }, [assets]);

  useFrame((state) => {
    if (liquidCoreRef.current) {
      const t = state.clock.getElapsedTime();
      liquidCoreRef.current.scale.y = 0.84 + Math.sin(t * 2.2) * 0.12;
      liquidCoreRef.current.position.y = -0.04 + Math.sin(t * 2.2) * 0.035;
    }
  });

  return (
    <group ref={groupRef} name="biofuel_root" scale={0.95}>
      <mesh position={[0, 0.06, 0]} material={assets.frameMat} receiveShadow castShadow>
        <cylinderGeometry args={[0.72, 0.76, 0.12, 32]} />
      </mesh>
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
        <mesh
          key={`leg-${idx}`}
          position={[Math.cos(angle) * 0.5, 0.24, Math.sin(angle) * 0.5]}
          material={assets.frameMat}
          castShadow
        >
          <boxGeometry args={[0.1, 0.36, 0.1]} />
        </mesh>
      ))}

      <mesh
        name="reactor_vessel"
        geometry={assets.vesselGeo}
        material={assets.steelMat}
        castShadow
        receiveShadow
      />

      {[0.65, 1.38].map((yPos, idx) => (
        <mesh
          key={`collar-${idx}`}
          position={[0, yPos, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          material={assets.amberRingMat}
        >
          <torusGeometry args={[0.57, 0.032, 12, 36]} />
        </mesh>
      ))}

      <mesh
        name="cyclone_hopper"
        geometry={assets.hopperGeo}
        material={assets.steelMat}
        position={[0.74, 0.0, 0]}
        castShadow
      />

      <mesh
        name="feed_manifold"
        geometry={assets.pipeGeo}
        material={assets.amberRingMat}
        castShadow
      />
      <mesh
        name="return_manifold"
        geometry={assets.returnPipeGeo}
        material={assets.steelMat}
        castShadow
      />

      {/* Front inspection porthole & surging biofuel column */}
      <group position={[0, 1.02, 0.56]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={assets.frameMat}>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 24]} />
        </mesh>
        <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]} material={assets.sightGlassOuterMat}>
          <cylinderGeometry args={[0.13, 0.13, 0.04, 24]} />
        </mesh>
      </group>

      {/* External glass sight tube with pulsing liquid motion */}
      <group position={[-0.36, 1.02, 0.49]} rotation={[0, -0.58, 0]}>
        <mesh material={assets.sightGlassOuterMat}>
          <cylinderGeometry args={[0.055, 0.055, 0.58, 18]} />
        </mesh>
        <mesh ref={liquidCoreRef} material={assets.liquidCoreMat}>
          <cylinderGeometry args={[0.042, 0.042, 0.44, 16]} />
        </mesh>
      </group>

      <mesh
        name="pressure_gauge"
        position={[-0.44, 1.5, 0.42]}
        rotation={[0, -0.5, 0]}
        material={assets.gaugeMat}
      >
        <circleGeometry args={[0.12, 24]} />
      </mesh>
    </group>
  );
}
