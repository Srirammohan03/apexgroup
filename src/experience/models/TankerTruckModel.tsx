import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  applyDissolveToGroup,
  type DissolveUniforms,
} from '../shaders/dissolveTransformShader';
import {
  createBrushedMetalRoughnessMap,
  createTankerLiveryTexture,
} from './proceduralTextures';

export interface TankerLightState {
  headlights: number;
  taillights: number;
  brakelights: number;
  indicators: number;
  wheelAngle: number;
}

interface TankerTruckModelProps {
  dissolveUniforms?: DissolveUniforms;
  lightStateRef?: React.MutableRefObject<TankerLightState>;
}

export function TankerTruckModel({
  dissolveUniforms,
  lightStateRef,
}: TankerTruckModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<(THREE.Group | null)[]>([]);
  const headlightMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const taillightMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const brakelightMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const indicatorMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const assets = useMemo(() => {
    const liveryTex = createTankerLiveryTexture();
    const metalRoughTex = createBrushedMetalRoughnessMap();

    const cabShape = new THREE.Shape();
    cabShape.moveTo(-0.7, 0);
    cabShape.lineTo(0.85, 0);
    cabShape.lineTo(0.85, 0.74);
    cabShape.lineTo(0.45, 0.9);
    cabShape.lineTo(0.28, 1.54);
    cabShape.lineTo(-0.62, 1.54);
    cabShape.lineTo(-0.7, 1.4);
    cabShape.closePath();

    const cabGeo = new THREE.ExtrudeGeometry(cabShape, {
      depth: 1.32,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 4,
    });
    cabGeo.translate(0, 0, -0.66);

    const tankProfile: THREE.Vector2[] = [];
    const radius = 0.77;
    const halfLen = 1.9;
    const capSteps = 12;
    for (let i = 0; i <= capSteps; i++) {
      const a = (i / capSteps) * (Math.PI / 2);
      tankProfile.push(
        new THREE.Vector2(Math.sin(a) * radius, -halfLen - Math.cos(a) * 0.35)
      );
    }
    tankProfile.push(new THREE.Vector2(radius, halfLen));
    for (let i = 0; i <= capSteps; i++) {
      const a = (i / capSteps) * (Math.PI / 2);
      tankProfile.push(
        new THREE.Vector2(Math.cos(a) * radius, halfLen + Math.sin(a) * 0.35)
      );
    }
    const tankGeo = new THREE.LatheGeometry(tankProfile, 44);
    tankGeo.rotateZ(Math.PI / 2);

    const exhaustCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.55, 0.4, 0.56),
      new THREE.Vector3(-0.66, 0.9, 0.68),
      new THREE.Vector3(-0.68, 2.02, 0.68),
      new THREE.Vector3(-0.76, 2.18, 0.68),
    ]);
    const exhaustGeoL = new THREE.TubeGeometry(exhaustCurveL, 20, 0.044, 12, false);

    const exhaustCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.55, 0.4, -0.56),
      new THREE.Vector3(-0.66, 0.9, -0.68),
      new THREE.Vector3(-0.68, 2.02, -0.68),
      new THREE.Vector3(-0.76, 2.18, -0.68),
    ]);
    const exhaustGeoR = new THREE.TubeGeometry(exhaustCurveR, 20, 0.044, 12, false);

    const manifoldCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.9, 0.54, 0.72),
      new THREE.Vector3(-1.35, 0.44, 0.78),
      new THREE.Vector3(-2.15, 0.44, 0.78),
      new THREE.Vector3(-2.55, 0.56, 0.72),
    ]);
    const manifoldGeo = new THREE.TubeGeometry(manifoldCurve, 24, 0.04, 10, false);

    const tireGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.27, 28);
    tireGeo.rotateX(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.29, 20);
    rimGeo.rotateX(Math.PI / 2);
    const hubGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.32, 14);
    hubGeo.rotateX(Math.PI / 2);

    const cabMat = new THREE.MeshPhysicalMaterial({
      color: '#1B212A',
      metalness: 0.58,
      roughness: 0.34,
      clearcoat: 0.65,
      clearcoatRoughness: 0.16,
    });

    const tankMat = new THREE.MeshStandardMaterial({
      map: liveryTex,
      roughnessMap: metalRoughTex,
      metalness: 0.88,
      roughness: 0.23,
      envMapIntensity: 1.25,
    });

    const chassisMat = new THREE.MeshStandardMaterial({
      color: '#12151A',
      metalness: 0.45,
      roughness: 0.72,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: '#D5DCE4',
      metalness: 0.96,
      roughness: 0.14,
      envMapIntensity: 1.35,
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: '#16181C',
      metalness: 0.04,
      roughness: 0.88,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#0D141C',
      metalness: 0.1,
      roughness: 0.08,
      clearcoat: 1.0,
      opacity: 0.88,
      transparent: true,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: '#F28C28',
      metalness: 0.25,
      roughness: 0.38,
    });

    const headlightMat = new THREE.MeshStandardMaterial({
      color: '#FFF6E5',
      emissive: '#FFF0C2',
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.1,
    });

    const taillightMat = new THREE.MeshStandardMaterial({
      color: '#991B1B',
      emissive: '#DC2626',
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.1,
    });

    const brakelightMat = new THREE.MeshStandardMaterial({
      color: '#B91C1C',
      emissive: '#FF2A2A',
      emissiveIntensity: 0.2,
      roughness: 0.18,
      metalness: 0.1,
    });

    const indicatorMat = new THREE.MeshStandardMaterial({
      color: '#F28C28',
      emissive: '#F28C28',
      emissiveIntensity: 0.2,
      roughness: 0.2,
      metalness: 0.1,
    });

    headlightMatRef.current = headlightMat;
    taillightMatRef.current = taillightMat;
    brakelightMatRef.current = brakelightMat;
    indicatorMatRef.current = indicatorMat;

    return {
      liveryTex,
      metalRoughTex,
      cabGeo,
      tankGeo,
      exhaustGeoL,
      exhaustGeoR,
      manifoldGeo,
      tireGeo,
      rimGeo,
      hubGeo,
      cabMat,
      tankMat,
      chassisMat,
      chromeMat,
      tireMat,
      glassMat,
      accentMat,
      headlightMat,
      taillightMat,
      brakelightMat,
      indicatorMat,
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
      assets.liveryTex.dispose();
      assets.metalRoughTex.dispose();
      assets.cabGeo.dispose();
      assets.tankGeo.dispose();
      assets.exhaustGeoL.dispose();
      assets.exhaustGeoR.dispose();
      assets.manifoldGeo.dispose();
      assets.tireGeo.dispose();
      assets.rimGeo.dispose();
      assets.hubGeo.dispose();
      assets.cabMat.dispose();
      assets.tankMat.dispose();
      assets.chassisMat.dispose();
      assets.chromeMat.dispose();
      assets.tireMat.dispose();
      assets.glassMat.dispose();
      assets.accentMat.dispose();
      assets.headlightMat.dispose();
      assets.taillightMat.dispose();
      assets.brakelightMat.dispose();
      assets.indicatorMat.dispose();
    };
  }, [assets]);

  useFrame(() => {
    const state = lightStateRef?.current;
    if (!state) return;
    for (let i = 0; i < wheelRefs.current.length; i++) {
      const wheel = wheelRefs.current[i];
      if (wheel) wheel.rotation.z = state.wheelAngle;
    }
    if (headlightMatRef.current) {
      headlightMatRef.current.emissiveIntensity = state.headlights;
    }
    if (taillightMatRef.current) {
      taillightMatRef.current.emissiveIntensity = state.taillights;
    }
    if (brakelightMatRef.current) {
      brakelightMatRef.current.emissiveIntensity = state.brakelights;
    }
    if (indicatorMatRef.current) {
      indicatorMatRef.current.emissiveIntensity = state.indicators;
    }
  });

  const wheelPositions: [number, number, number][] = [
    [1.62, 0.42, 0.72],
    [1.62, 0.42, -0.72],
    [-0.95, 0.42, 0.72],
    [-0.95, 0.42, -0.72],
    [-2.05, 0.42, 0.72],
    [-2.05, 0.42, -0.72],
  ];

  return (
    <group ref={groupRef} name="tanker_root" scale={0.78}>
      <mesh
        name="chassis_frame"
        position={[-0.25, 0.56, 0]}
        material={assets.chassisMat}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[5.4, 0.18, 0.92]} />
      </mesh>

      {/* Diesel saddle tanks on chassis sides */}
      <mesh
        name="diesel_tank_l"
        position={[0.45, 0.52, 0.66]}
        rotation={[0, 0, Math.PI / 2]}
        material={assets.chromeMat}
        castShadow
      >
        <cylinderGeometry args={[0.17, 0.17, 0.88, 16]} />
      </mesh>
      <mesh
        name="diesel_tank_r"
        position={[0.45, 0.52, -0.66]}
        rotation={[0, 0, Math.PI / 2]}
        material={assets.chromeMat}
        castShadow
      >
        <cylinderGeometry args={[0.17, 0.17, 0.88, 16]} />
      </mesh>

      <mesh
        name="front_bumper"
        position={[2.56, 0.52, 0]}
        material={assets.chromeMat}
        castShadow
      >
        <boxGeometry args={[0.22, 0.24, 1.48]} />
      </mesh>
      <mesh
        name="front_grille"
        position={[2.53, 0.98, 0]}
        material={assets.chromeMat}
        castShadow
      >
        <boxGeometry args={[0.08, 0.54, 0.96]} />
      </mesh>

      <mesh
        name="cab_body"
        geometry={assets.cabGeo}
        material={assets.cabMat}
        position={[1.65, 0.62, 0]}
        castShadow
        receiveShadow
      />

      {/* Side mirrors */}
      {[0.76, -0.76].map((zPos, idx) => (
        <group key={`mirror-${idx}`} position={[1.92, 1.72, zPos]}>
          <mesh material={assets.chromeMat}>
            <boxGeometry args={[0.04, 0.28, 0.08]} />
          </mesh>
          <mesh position={[-0.02, 0, zPos > 0 ? -0.05 : 0.05]} material={assets.chassisMat}>
            <boxGeometry args={[0.02, 0.03, 0.12]} />
          </mesh>
        </group>
      ))}

      <mesh
        name="cab_accent"
        position={[1.92, 2.04, 0]}
        material={assets.accentMat}
        castShadow
      >
        <boxGeometry args={[0.36, 0.08, 1.38]} />
      </mesh>

      <mesh
        name="windshield"
        position={[2.06, 1.74, 0]}
        rotation={[0, 0, -0.26]}
        material={assets.glassMat}
      >
        <boxGeometry args={[0.06, 0.52, 1.24]} />
      </mesh>

      <mesh
        name="tank_barrel"
        geometry={assets.tankGeo}
        material={assets.tankMat}
        position={[-0.95, 1.54, 0]}
        castShadow
        receiveShadow
      />

      {[-2.2, -0.95, 0.3].map((xPos, i) => (
        <mesh
          key={`saddle-${i}`}
          position={[xPos, 0.78, 0]}
          material={assets.chassisMat}
          castShadow
        >
          <boxGeometry args={[0.24, 0.32, 1.16]} />
        </mesh>
      ))}

      {/* Top walkway & safety rail */}
      <mesh
        name="top_walkway"
        position={[-0.95, 2.33, 0]}
        material={assets.chassisMat}
        castShadow
      >
        <boxGeometry args={[3.1, 0.05, 0.44]} />
      </mesh>
      {[0.2, -0.2].map((zPos, i) => (
        <mesh
          key={`rail-${i}`}
          position={[-0.95, 2.48, zPos]}
          material={assets.chromeMat}
        >
          <boxGeometry args={[3.0, 0.024, 0.024]} />
        </mesh>
      ))}
      {[-1.85, -0.95, -0.05].map((xPos, i) => (
        <mesh
          key={`dome-${i}`}
          position={[xPos, 2.39, 0]}
          material={assets.chromeMat}
          castShadow
        >
          <cylinderGeometry args={[0.16, 0.18, 0.1, 20]} />
        </mesh>
      ))}

      {/* Rear discharge valve cabinet & access ladder */}
      <mesh
        name="rear_valve_box"
        position={[-2.95, 0.85, 0]}
        material={assets.chassisMat}
        castShadow
      >
        <boxGeometry args={[0.38, 0.42, 0.96]} />
      </mesh>
      {[-0.14, 0.14].map((zPos, i) => (
        <mesh
          key={`ladder-rail-${i}`}
          position={[-3.2, 1.65, zPos]}
          material={assets.chromeMat}
        >
          <boxGeometry args={[0.03, 1.45, 0.03]} />
        </mesh>
      ))}

      <mesh
        name="exhaust_left"
        geometry={assets.exhaustGeoL}
        material={assets.chromeMat}
        position={[1.65, 0.62, 0]}
        castShadow
      />
      <mesh
        name="exhaust_right"
        geometry={assets.exhaustGeoR}
        material={assets.chromeMat}
        position={[1.65, 0.62, 0]}
        castShadow
      />
      <mesh
        name="fuel_manifold"
        geometry={assets.manifoldGeo}
        material={assets.chromeMat}
        castShadow
      />

      <mesh
        name="rear_bumper"
        position={[-3.08, 0.52, 0]}
        material={assets.chromeMat}
        castShadow
      >
        <boxGeometry args={[0.16, 0.2, 1.44]} />
      </mesh>

      <group name="headlights" position={[2.62, 0.74, 0]}>
        <mesh position={[0, 0, 0.52]} material={assets.headlightMat}>
          <boxGeometry args={[0.06, 0.13, 0.22]} />
        </mesh>
        <mesh position={[0, 0, -0.52]} material={assets.headlightMat}>
          <boxGeometry args={[0.06, 0.13, 0.22]} />
        </mesh>
      </group>

      <group name="taillights" position={[-3.15, 0.54, 0]}>
        <mesh position={[0, 0, 0.5]} material={assets.taillightMat}>
          <boxGeometry args={[0.05, 0.11, 0.18]} />
        </mesh>
        <mesh position={[0, 0, -0.5]} material={assets.taillightMat}>
          <boxGeometry args={[0.05, 0.11, 0.18]} />
        </mesh>
      </group>

      <group name="brakelights" position={[-3.15, 0.54, 0]}>
        <mesh position={[0, 0, 0.31]} material={assets.brakelightMat}>
          <boxGeometry args={[0.055, 0.12, 0.14]} />
        </mesh>
        <mesh position={[0, 0, -0.31]} material={assets.brakelightMat}>
          <boxGeometry args={[0.055, 0.12, 0.14]} />
        </mesh>
      </group>

      <group name="indicators">
        <mesh position={[2.62, 0.74, 0.68]} material={assets.indicatorMat}>
          <boxGeometry args={[0.07, 0.11, 0.08]} />
        </mesh>
        <mesh position={[2.62, 0.74, -0.68]} material={assets.indicatorMat}>
          <boxGeometry args={[0.07, 0.11, 0.08]} />
        </mesh>
        <mesh position={[-3.15, 0.54, 0.66]} material={assets.indicatorMat}>
          <boxGeometry args={[0.05, 0.11, 0.08]} />
        </mesh>
        <mesh position={[-3.15, 0.54, -0.66]} material={assets.indicatorMat}>
          <boxGeometry args={[0.05, 0.11, 0.08]} />
        </mesh>
        {[-1.7, -0.4, 0.8].map((xPos, i) => (
          <group key={`side-ind-${i}`}>
            <mesh position={[xPos, 0.62, 0.72]} material={assets.indicatorMat}>
              <boxGeometry args={[0.12, 0.05, 0.03]} />
            </mesh>
            <mesh position={[xPos, 0.62, -0.72]} material={assets.indicatorMat}>
              <boxGeometry args={[0.12, 0.05, 0.03]} />
            </mesh>
          </group>
        ))}
      </group>

      {wheelPositions.map((pos, idx) => (
        <group
          key={`wheel-${idx}`}
          name={`wheel_${idx}`}
          position={pos}
          ref={(el) => {
            wheelRefs.current[idx] = el;
          }}
        >
          <mesh geometry={assets.tireGeo} material={assets.tireMat} castShadow />
          <mesh geometry={assets.rimGeo} material={assets.chromeMat} />
          <mesh geometry={assets.hubGeo} material={assets.accentMat} />
        </group>
      ))}
    </group>
  );
}
