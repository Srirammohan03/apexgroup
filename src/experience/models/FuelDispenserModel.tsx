import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  applyDissolveToGroup,
  type DissolveUniforms,
} from '../shaders/dissolveTransformShader';
import { createDispenserDisplayTexture } from './proceduralTextures';

interface FuelDispenserModelProps {
  dissolveUniforms?: DissolveUniforms;
}

export function FuelDispenserModel({ dissolveUniforms }: FuelDispenserModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  const assets = useMemo(() => {
    const displayTex = createDispenserDisplayTexture();

    const colShape = new THREE.Shape();
    colShape.moveTo(-0.46, 0.14);
    colShape.lineTo(0.46, 0.14);
    colShape.lineTo(0.46, 2.08);
    colShape.quadraticCurveTo(0.46, 2.22, 0.32, 2.24);
    colShape.lineTo(-0.32, 2.24);
    colShape.quadraticCurveTo(-0.46, 2.22, -0.46, 2.08);
    colShape.closePath();

    const housingGeo = new THREE.ExtrudeGeometry(colShape, {
      depth: 0.46,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.035,
      bevelSegments: 4,
    });
    housingGeo.translate(0, 0, -0.23);

    const hoseCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.48, 1.82, 0),
      new THREE.Vector3(-0.74, 1.32, 0.06),
      new THREE.Vector3(-0.68, 0.68, 0.14),
      new THREE.Vector3(-0.54, 1.15, 0.08),
    ]);
    const hoseGeoL = new THREE.TubeGeometry(hoseCurveL, 28, 0.028, 10, false);

    const hoseCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.48, 1.82, 0),
      new THREE.Vector3(0.74, 1.32, -0.06),
      new THREE.Vector3(0.68, 0.68, -0.14),
      new THREE.Vector3(0.54, 1.15, -0.08),
    ]);
    const hoseGeoR = new THREE.TubeGeometry(hoseCurveR, 28, 0.028, 10, false);

    const housingMat = new THREE.MeshStandardMaterial({
      color: '#1C222B',
      metalness: 0.64,
      roughness: 0.32,
    });

    const steelTrimMat = new THREE.MeshStandardMaterial({
      color: '#D2D9E0',
      metalness: 0.92,
      roughness: 0.18,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: '#F28C28',
      emissive: '#F28C28',
      emissiveIntensity: 0.38,
      metalness: 0.25,
      roughness: 0.3,
    });

    const rubberMat = new THREE.MeshStandardMaterial({
      color: '#121417',
      metalness: 0.05,
      roughness: 0.88,
    });

    const displayMat = new THREE.MeshStandardMaterial({
      map: displayTex,
      emissiveMap: displayTex,
      emissive: '#FFFFFF',
      emissiveIntensity: 0.5,
      roughness: 0.12,
      metalness: 0.1,
    });

    return {
      displayTex,
      housingGeo,
      hoseGeoL,
      hoseGeoR,
      housingMat,
      steelTrimMat,
      accentMat,
      rubberMat,
      displayMat,
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
      assets.displayTex.dispose();
      assets.housingGeo.dispose();
      assets.hoseGeoL.dispose();
      assets.hoseGeoR.dispose();
      assets.housingMat.dispose();
      assets.steelTrimMat.dispose();
      assets.accentMat.dispose();
      assets.rubberMat.dispose();
      assets.displayMat.dispose();
    };
  }, [assets]);

  return (
    <group ref={groupRef} name="dispenser_root" scale={0.9}>
      <mesh position={[0, 0.07, 0]} material={assets.steelTrimMat} castShadow receiveShadow>
        <boxGeometry args={[1.08, 0.14, 0.66]} />
      </mesh>

      <mesh
        name="column_housing"
        geometry={assets.housingGeo}
        material={assets.housingMat}
        castShadow
        receiveShadow
      />

      <mesh position={[0, 2.28, 0]} material={assets.accentMat}>
        <boxGeometry args={[0.92, 0.09, 0.48]} />
      </mesh>

      <mesh name="display_front" position={[0, 1.66, 0.275]} material={assets.displayMat}>
        <planeGeometry args={[0.68, 0.36]} />
      </mesh>
      <mesh
        name="display_back"
        position={[0, 1.66, -0.275]}
        rotation={[0, Math.PI, 0]}
        material={assets.displayMat}
      >
        <planeGeometry args={[0.68, 0.36]} />
      </mesh>

      {/* Keypad & 4-fuel grade selector buttons on front & back */}
      {[-0.24, -0.08, 0.08, 0.24].map((xPos, idx) => (
        <group key={`grade-btn-${idx}`}>
          <mesh position={[xPos, 1.32, 0.276]} material={assets.accentMat}>
            <boxGeometry args={[0.11, 0.06, 0.025]} />
          </mesh>
          <mesh position={[xPos, 1.32, -0.276]} material={assets.accentMat}>
            <boxGeometry args={[0.11, 0.06, 0.025]} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.68, 0.27]} material={assets.steelTrimMat}>
        <boxGeometry args={[0.74, 0.86, 0.02]} />
      </mesh>
      <mesh position={[0, 0.68, -0.27]} material={assets.steelTrimMat}>
        <boxGeometry args={[0.74, 0.86, 0.02]} />
      </mesh>

      <mesh name="hose_left" geometry={assets.hoseGeoL} material={assets.rubberMat} castShadow />
      <mesh name="hose_right" geometry={assets.hoseGeoR} material={assets.rubberMat} castShadow />
      <mesh
        name="nozzle_left"
        position={[-0.53, 1.24, 0.08]}
        rotation={[0, 0, -0.25]}
        material={assets.steelTrimMat}
        castShadow
      >
        <boxGeometry args={[0.07, 0.24, 0.08]} />
      </mesh>
      <mesh
        name="nozzle_right"
        position={[0.53, 1.24, -0.08]}
        rotation={[0, 0, 0.25]}
        material={assets.steelTrimMat}
        castShadow
      >
        <boxGeometry args={[0.07, 0.24, 0.08]} />
      </mesh>
    </group>
  );
}
