import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { createForecourtCanopyTexture } from './proceduralTextures';

interface FuelStationModelProps {
  revealProgressRef: React.MutableRefObject<number>;
  themeFactorRef: React.MutableRefObject<number>;
  anchorRef: React.MutableRefObject<[number, number, number]>;
}

export function FuelStationModel({
  revealProgressRef,
  themeFactorRef,
  anchorRef,
}: FuelStationModelProps) {
  const rootRef = useRef<THREE.Group>(null);
  const canopyLightMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const canopySpotRef = useRef<THREE.PointLight>(null);

  const assets = useMemo(() => {
    const fasciaTex = createForecourtCanopyTexture();

    const plinthMat = new THREE.MeshStandardMaterial({
      color: '#222933',
      metalness: 0.25,
      roughness: 0.8,
    });
    const kerbMat = new THREE.MeshStandardMaterial({
      color: '#F28C28',
      metalness: 0.2,
      roughness: 0.45,
    });
    const steelColumnMat = new THREE.MeshStandardMaterial({
      color: '#C8D1DA',
      metalness: 0.85,
      roughness: 0.22,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: '#171C22',
      metalness: 0.55,
      roughness: 0.4,
    });
    const fasciaMat = new THREE.MeshStandardMaterial({
      map: fasciaTex,
      emissiveMap: fasciaTex,
      emissive: '#FFFFFF',
      emissiveIntensity: 0.45,
      metalness: 0.2,
      roughness: 0.28,
    });
    const canopyLightMat = new THREE.MeshStandardMaterial({
      color: '#FFF6E8',
      emissive: '#FFE8C8',
      emissiveIntensity: 1.6,
      roughness: 0.15,
    });

    canopyLightMatRef.current = canopyLightMat;

    return {
      fasciaTex,
      plinthMat,
      kerbMat,
      steelColumnMat,
      roofMat,
      fasciaMat,
      canopyLightMat,
    };
  }, []);

  useEffect(() => {
    return () => {
      assets.fasciaTex.dispose();
      assets.plinthMat.dispose();
      assets.kerbMat.dispose();
      assets.steelColumnMat.dispose();
      assets.roofMat.dispose();
      assets.fasciaMat.dispose();
      assets.canopyLightMat.dispose();
    };
  }, [assets]);

  useFrame(() => {
    const p = revealProgressRef.current;
    const grp = rootRef.current;
    if (!grp) return;

    if (p <= 0.02) {
      grp.visible = false;
      return;
    }
    grp.visible = true;

    const [ax, ay, az] = anchorRef.current;
    grp.position.set(ax, ay - 0.02, az);
    const scaleY = 0.25 + 0.75 * p;
    grp.scale.set(0.55 + 0.45 * p, scaleY, 0.55 + 0.45 * p);

    // Theme-responsive lighting: night emits bright canopy illumination; day lowers emissive intensity cleanly
    const nightWeight = 1 - themeFactorRef.current;
    if (canopyLightMatRef.current) {
      canopyLightMatRef.current.emissiveIntensity = (0.25 + nightWeight * 1.9) * p;
    }
    if (canopySpotRef.current) {
      canopySpotRef.current.intensity = (0.4 + nightWeight * 3.8) * p;
    }
  });

  return (
    <group ref={rootRef} name="js_fuels_station_canopy" visible={false}>
      {/* Forecourt asphalt apron pad */}
      <mesh position={[0, -0.02, 0]} receiveShadow material={assets.roofMat}>
        <boxGeometry args={[6.4, 0.04, 4.4]} />
      </mesh>

      {/* Primary pump island around dispenser */}
      <mesh position={[0, 0.06, 0]} receiveShadow castShadow material={assets.plinthMat}>
        <boxGeometry args={[2.1, 0.12, 1.05]} />
      </mesh>
      <mesh position={[0, 0.06, 0.54]} material={assets.kerbMat}>
        <boxGeometry args={[2.12, 0.06, 0.04]} />
      </mesh>
      <mesh position={[0, 0.06, -0.54]} material={assets.kerbMat}>
        <boxGeometry args={[2.12, 0.06, 0.04]} />
      </mesh>

      {/* Twin structural steel canopy pillars */}
      {[-1.95, 1.95].map((xPos, idx) => (
        <group key={`canopy-col-${idx}`} position={[xPos, 0, 0]}>
          <mesh position={[0, 0.08, 0]} material={assets.kerbMat} castShadow>
            <boxGeometry args={[0.36, 0.16, 0.36]} />
          </mesh>
          <mesh position={[0, 1.82, 0]} material={assets.steelColumnMat} castShadow>
            <boxGeometry args={[0.24, 3.45, 0.24]} />
          </mesh>
        </group>
      ))}

      {/* Architectural cantilevered forecourt canopy roof */}
      <group position={[0, 3.65, 0]}>
        <mesh material={assets.roofMat} castShadow receiveShadow>
          <boxGeometry args={[5.9, 0.42, 3.5]} />
        </mesh>

        {/* Front & back illuminated JS FUELS · PETROL · DIESEL · CNG · LPG fascia */}
        <mesh position={[0, 0, 1.76]} material={assets.fasciaMat}>
          <planeGeometry args={[5.82, 0.4]} />
        </mesh>
        <mesh
          position={[0, 0, -1.76]}
          rotation={[0, Math.PI, 0]}
          material={assets.fasciaMat}
        >
          <planeGeometry args={[5.82, 0.4]} />
        </mesh>

        {/* Underside architectural LED light troughs */}
        {[-1.4, 0, 1.4].map((xPos, idx) => (
          <mesh
            key={`led-strip-${idx}`}
            position={[xPos, -0.215, 0]}
            material={assets.canopyLightMat}
          >
            <boxGeometry args={[0.75, 0.025, 2.3]} />
          </mesh>
        ))}

        <pointLight
          ref={canopySpotRef}
          position={[0, -0.45, 0]}
          color="#FFF2DC"
          intensity={3.5}
          distance={12}
          decay={2}
        />
      </group>
    </group>
  );
}
