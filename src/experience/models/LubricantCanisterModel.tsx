import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  applyDissolveToGroup,
  type DissolveUniforms,
} from '../shaders/dissolveTransformShader';
import { createCanisterLabelTexture } from './proceduralTextures';

interface LubricantCanisterModelProps {
  dissolveUniforms?: DissolveUniforms;
}

export function LubricantCanisterModel({
  dissolveUniforms,
}: LubricantCanisterModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  const assets = useMemo(() => {
    const frontLabelTex = createCanisterLabelTexture('front');
    const backLabelTex = createCanisterLabelTexture('back');

    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(-0.56, 0.06);
    bodyShape.lineTo(0.56, 0.06);
    bodyShape.quadraticCurveTo(0.64, 0.06, 0.64, 0.18);
    bodyShape.lineTo(0.64, 1.36);
    bodyShape.quadraticCurveTo(0.64, 1.58, 0.42, 1.72);
    bodyShape.lineTo(-0.08, 1.82);
    bodyShape.lineTo(-0.34, 1.82);
    bodyShape.quadraticCurveTo(-0.56, 1.78, -0.62, 1.52);
    bodyShape.lineTo(-0.64, 0.18);
    bodyShape.quadraticCurveTo(-0.64, 0.06, -0.56, 0.06);

    // Ergonomic grip cutout placed strictly in right quadrant (x >= 0.26)
    // leaving left & center pocket (x: -0.50..+0.14) completely flat and clear
    const handleHole = new THREE.Path();
    handleHole.moveTo(0.30, 0.94);
    handleHole.lineTo(0.45, 0.94);
    handleHole.quadraticCurveTo(0.50, 0.94, 0.50, 1.04);
    handleHole.lineTo(0.47, 1.44);
    handleHole.quadraticCurveTo(0.45, 1.54, 0.35, 1.55);
    handleHole.lineTo(0.30, 1.55);
    handleHole.quadraticCurveTo(0.26, 1.53, 0.26, 1.43);
    handleHole.lineTo(0.26, 1.04);
    handleHole.quadraticCurveTo(0.26, 0.94, 0.30, 0.94);
    bodyShape.holes.push(handleHole);

    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
      depth: 0.44,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.04,
      bevelSegments: 5,
    });
    bodyGeo.translate(0, 0, -0.22);

    const capProfile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.18, 0),
      new THREE.Vector2(0.18, 0.05),
      new THREE.Vector2(0.16, 0.06),
      new THREE.Vector2(0.16, 0.22),
      new THREE.Vector2(0.135, 0.25),
      new THREE.Vector2(0, 0.25),
    ];
    const capGeo = new THREE.LatheGeometry(capProfile, 28);

    const neckGeo = new THREE.CylinderGeometry(0.13, 0.145, 0.22, 24);
    const sealGeo = new THREE.TorusGeometry(0.148, 0.018, 10, 24);
    sealGeo.rotateX(Math.PI / 2);

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: '#191E26',
      metalness: 0.14,
      roughness: 0.4,
      clearcoat: 0.34,
      clearcoatRoughness: 0.3,
    });

    const capMat = new THREE.MeshStandardMaterial({
      color: '#F28C28',
      metalness: 0.24,
      roughness: 0.34,
    });

    const chromeSealMat = new THREE.MeshStandardMaterial({
      color: '#D2D8E0',
      metalness: 0.94,
      roughness: 0.16,
    });

    const sightGlassMat = new THREE.MeshPhysicalMaterial({
      color: '#D9821E',
      metalness: 0.05,
      roughness: 0.12,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.88,
    });

    const frontLabelMat = new THREE.MeshStandardMaterial({
      map: frontLabelTex,
      metalness: 0.16,
      roughness: 0.28,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    const backLabelMat = new THREE.MeshStandardMaterial({
      map: backLabelTex,
      metalness: 0.16,
      roughness: 0.28,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    return {
      frontLabelTex,
      backLabelTex,
      bodyGeo,
      capGeo,
      neckGeo,
      sealGeo,
      bodyMat,
      capMat,
      chromeSealMat,
      sightGlassMat,
      frontLabelMat,
      backLabelMat,
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
      assets.frontLabelTex.dispose();
      assets.backLabelTex.dispose();
      assets.bodyGeo.dispose();
      assets.capGeo.dispose();
      assets.neckGeo.dispose();
      assets.sealGeo.dispose();
      assets.bodyMat.dispose();
      assets.capMat.dispose();
      assets.chromeSealMat.dispose();
      assets.sightGlassMat.dispose();
      assets.frontLabelMat.dispose();
      assets.backLabelMat.dispose();
    };
  }, [assets]);

  const knurlAngles = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (i / 8) * Math.PI * 2);

  return (
    <group ref={groupRef} name="canister_root" scale={1.08}>
      <mesh
        name="canister_body"
        geometry={assets.bodyGeo}
        material={assets.bodyMat}
        castShadow
        receiveShadow
      />

      <mesh
        name="pour_neck"
        geometry={assets.neckGeo}
        material={assets.bodyMat}
        position={[-0.22, 1.9, 0]}
        rotation={[0, 0, 0.12]}
        castShadow
      />

      <mesh
        name="neck_seal"
        geometry={assets.sealGeo}
        material={assets.chromeSealMat}
        position={[-0.21, 1.85, 0]}
        rotation={[0, 0, 0.12]}
      />

      <group position={[-0.23, 1.94, 0]} rotation={[0, 0, 0.12]}>
        <mesh
          name="screw_cap"
          geometry={assets.capGeo}
          material={assets.capMat}
          castShadow
        />
        {knurlAngles.map((ang, idx) => (
          <mesh
            key={`knurl-${idx}`}
            position={[Math.cos(ang) * 0.16, 0.14, Math.sin(ang) * 0.16]}
            rotation={[0, -ang, 0]}
            material={assets.capMat}
          >
            <boxGeometry args={[0.015, 0.13, 0.024]} />
          </mesh>
        ))}
      </group>

      <mesh
        name="sight_strip"
        position={[-0.67, 0.85, 0]}
        material={assets.sightGlassMat}
      >
        <boxGeometry args={[0.04, 1.05, 0.09]} />
      </mesh>

      {[0.32, 0.49, 0.66].map((yPos, i) => (
        <mesh
          key={`rib-${i}`}
          position={[0.675, yPos, 0]}
          material={assets.capMat}
        >
          <boxGeometry args={[0.024, 0.048, 0.25]} />
        </mesh>
      ))}

      {/* Cleanly recessed flat pocket label plates (x: -0.50..+0.14, well clear of grip bevel at +0.22) */}
      <mesh
        name="front_label"
        position={[-0.18, 0.72, 0.285]}
        material={assets.frontLabelMat}
      >
        <planeGeometry args={[0.64, 1.0]} />
      </mesh>

      <mesh
        name="back_label"
        position={[-0.18, 0.72, -0.285]}
        rotation={[0, Math.PI, 0]}
        material={assets.backLabelMat}
      >
        <planeGeometry args={[0.64, 1.0]} />
      </mesh>
    </group>
  );
}
