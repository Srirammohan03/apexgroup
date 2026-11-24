import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  applyDissolveToGroup,
  type DissolveUniforms,
} from '../shaders/dissolveTransformShader';
import {
  createBrushedMetalRoughnessMap,
  createDrumStencilTexture,
} from './proceduralTextures';

interface OilDrumModelProps {
  dissolveUniforms?: DissolveUniforms;
}

export function OilDrumModel({ dissolveUniforms }: OilDrumModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  const assets = useMemo(() => {
    const stencilTex = createDrumStencilTexture();
    const roughTex = createBrushedMetalRoughnessMap();

    const profile: THREE.Vector2[] = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.56, 0.0),
      new THREE.Vector2(0.58, 0.05),
      new THREE.Vector2(0.56, 0.1),
      new THREE.Vector2(0.56, 0.56),
      new THREE.Vector2(0.608, 0.6),
      new THREE.Vector2(0.56, 0.64),
      new THREE.Vector2(0.56, 1.16),
      new THREE.Vector2(0.608, 1.2),
      new THREE.Vector2(0.56, 1.24),
      new THREE.Vector2(0.56, 1.72),
      new THREE.Vector2(0.585, 1.78),
      new THREE.Vector2(0.55, 1.82),
      new THREE.Vector2(0.0, 1.82),
    ];
    const shellGeo = new THREE.LatheGeometry(profile, 48);
    const hoopGeo = new THREE.TorusGeometry(0.592, 0.026, 12, 42);
    hoopGeo.rotateX(Math.PI / 2);

    const shellMat = new THREE.MeshStandardMaterial({
      map: stencilTex,
      roughnessMap: roughTex,
      metalness: 0.76,
      roughness: 0.3,
      envMapIntensity: 1.32,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: '#D6DCE4',
      metalness: 0.96,
      roughness: 0.15,
      envMapIntensity: 1.35,
    });

    const brassBungMat = new THREE.MeshStandardMaterial({
      color: '#D49A3A',
      metalness: 0.9,
      roughness: 0.22,
    });

    return { stencilTex, roughTex, shellGeo, hoopGeo, shellMat, chromeMat, brassBungMat };
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
      assets.stencilTex.dispose();
      assets.roughTex.dispose();
      assets.shellGeo.dispose();
      assets.hoopGeo.dispose();
      assets.shellMat.dispose();
      assets.chromeMat.dispose();
      assets.brassBungMat.dispose();
    };
  }, [assets]);

  return (
    <group ref={groupRef} name="drum_root" scale={0.95}>
      <mesh
        name="drum_shell"
        geometry={assets.shellGeo}
        material={assets.shellMat}
        castShadow
        receiveShadow
      />
      <mesh
        name="rolling_hoop_lower"
        geometry={assets.hoopGeo}
        material={assets.chromeMat}
        position={[0, 0.6, 0]}
      />
      <mesh
        name="rolling_hoop_upper"
        geometry={assets.hoopGeo}
        material={assets.chromeMat}
        position={[0, 1.2, 0]}
      />
      <mesh
        name="top_clamp_ring"
        geometry={assets.hoopGeo}
        material={assets.chromeMat}
        position={[0, 1.79, 0]}
        scale={0.97}
      />
      <mesh
        name="ring_clamp_latch"
        position={[0.57, 1.79, 0]}
        material={assets.brassBungMat}
      >
        <boxGeometry args={[0.07, 0.045, 0.14]} />
      </mesh>
      <mesh
        name="bung_plug_large"
        position={[0.28, 1.835, 0.1]}
        material={assets.brassBungMat}
        castShadow
      >
        <cylinderGeometry args={[0.072, 0.072, 0.042, 6]} />
      </mesh>
      <mesh
        name="bung_plug_small"
        position={[-0.28, 1.835, -0.1]}
        material={assets.brassBungMat}
        castShadow
      >
        <cylinderGeometry args={[0.046, 0.046, 0.042, 6]} />
      </mesh>
    </group>
  );
}
