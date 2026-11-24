import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface EngineAssemblyModelProps {
  visibleProgressRef: React.MutableRefObject<number>;
  anchorRef: React.MutableRefObject<[number, number, number]>;
}

export function EngineAssemblyModel({
  visibleProgressRef,
  anchorRef,
}: EngineAssemblyModelProps) {
  const rootRef = useRef<THREE.Group>(null);
  const mainGearRef = useRef<THREE.Group>(null);
  const pinionGearRef = useRef<THREE.Group>(null);
  const pistonRef = useRef<THREE.Group>(null);
  const conRodRef = useRef<THREE.Mesh>(null);

  const assets = useMemo(() => {
    const steelMat = new THREE.MeshStandardMaterial({
      color: '#CDD5DE',
      metalness: 0.92,
      roughness: 0.19,
      envMapIntensity: 1.35,
    });
    const darkAlloyMat = new THREE.MeshStandardMaterial({
      color: '#1E252E',
      metalness: 0.72,
      roughness: 0.34,
    });
    const oilFilmMat = new THREE.MeshPhysicalMaterial({
      color: '#F28C28',
      metalness: 0.45,
      roughness: 0.14,
      clearcoat: 1.0,
    });

    const gearHubGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.14, 32);
    gearHubGeo.rotateX(Math.PI / 2);
    const toothGeo = new THREE.BoxGeometry(0.08, 0.14, 0.13);

    const pinionHubGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 24);
    pinionHubGeo.rotateX(Math.PI / 2);
    const pinionToothGeo = new THREE.BoxGeometry(0.06, 0.11, 0.13);

    const pistonHeadGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.34, 28);
    const ringGeo = new THREE.TorusGeometry(0.285, 0.014, 8, 28);
    ringGeo.rotateX(Math.PI / 2);

    const rodGeo = new THREE.BoxGeometry(0.09, 0.62, 0.08);
    const crankGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.18, 24);
    crankGeo.rotateX(Math.PI / 2);

    return {
      steelMat,
      darkAlloyMat,
      oilFilmMat,
      gearHubGeo,
      toothGeo,
      pinionHubGeo,
      pinionToothGeo,
      pistonHeadGeo,
      ringGeo,
      rodGeo,
      crankGeo,
    };
  }, []);

  useEffect(() => {
    return () => {
      assets.steelMat.dispose();
      assets.darkAlloyMat.dispose();
      assets.oilFilmMat.dispose();
      assets.gearHubGeo.dispose();
      assets.toothGeo.dispose();
      assets.pinionHubGeo.dispose();
      assets.pinionToothGeo.dispose();
      assets.pistonHeadGeo.dispose();
      assets.ringGeo.dispose();
      assets.rodGeo.dispose();
      assets.crankGeo.dispose();
    };
  }, [assets]);

  const mainTeethAngles = useMemo(
    () => Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2),
    []
  );
  const pinionTeethAngles = useMemo(
    () => Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2),
    []
  );

  useFrame((state) => {
    const p = visibleProgressRef.current;
    const grp = rootRef.current;
    if (!grp) return;

    if (p <= 0.02) {
      grp.visible = false;
      return;
    }
    grp.visible = true;

    const [ax, ay, az] = anchorRef.current;
    grp.position.set(ax + 1.55, ay + 0.55, az - 0.35);
    grp.scale.setScalar(0.3 + 0.7 * p);

    const t = state.clock.getElapsedTime();
    if (mainGearRef.current) {
      mainGearRef.current.rotation.z = t * 0.9;
    }
    if (pinionGearRef.current) {
      pinionGearRef.current.rotation.z = -t * 1.44 + 0.2;
    }

    const stroke = Math.sin(t * 3.1) * 0.18;
    if (pistonRef.current) {
      pistonRef.current.position.y = 0.72 + stroke;
    }
    if (conRodRef.current) {
      conRodRef.current.position.y = 0.34 + stroke * 0.6;
      conRodRef.current.rotation.z = Math.cos(t * 3.1) * 0.14;
    }
  });

  return (
    <group ref={rootRef} name="engine_mechanical_assembly" visible={false}>
      {/* Main helical spur gear */}
      <group ref={mainGearRef} position={[-0.35, 0.25, 0]}>
        <mesh geometry={assets.gearHubGeo} material={assets.steelMat} castShadow />
        <mesh geometry={assets.crankGeo} material={assets.oilFilmMat} position={[0, 0, 0.02]} />
        {mainTeethAngles.map((ang, i) => (
          <mesh
            key={`mt-${i}`}
            geometry={assets.toothGeo}
            material={assets.steelMat}
            position={[Math.cos(ang) * 0.45, Math.sin(ang) * 0.45, 0]}
            rotation={[0, 0, ang - Math.PI / 2]}
          />
        ))}
      </group>

      {/* Meshing pinion gear */}
      <group ref={pinionGearRef} position={[0.38, -0.04, 0]}>
        <mesh geometry={assets.pinionHubGeo} material={assets.darkAlloyMat} castShadow />
        <mesh geometry={assets.crankGeo} material={assets.oilFilmMat} scale={0.6} />
        {pinionTeethAngles.map((ang, i) => (
          <mesh
            key={`pt-${i}`}
            geometry={assets.pinionToothGeo}
            material={assets.darkAlloyMat}
            position={[Math.cos(ang) * 0.27, Math.sin(ang) * 0.27, 0]}
            rotation={[0, 0, ang - Math.PI / 2]}
          />
        ))}
      </group>

      {/* Piston + compression rings + connecting rod */}
      <group position={[0.42, 0.35, -0.22]}>
        <group ref={pistonRef} position={[0, 0.72, 0]}>
          <mesh geometry={assets.pistonHeadGeo} material={assets.steelMat} castShadow />
          {[0.1, 0.03, -0.04].map((ry, i) => (
            <mesh
              key={`comp-ring-${i}`}
              geometry={assets.ringGeo}
              material={assets.oilFilmMat}
              position={[0, ry, 0]}
            />
          ))}
        </group>
        <mesh
          ref={conRodRef}
          geometry={assets.rodGeo}
          material={assets.darkAlloyMat}
          position={[0, 0.34, 0]}
          castShadow
        />
        <mesh
          geometry={assets.crankGeo}
          material={assets.steelMat}
          position={[0, -0.02, 0]}
        />
      </group>
    </group>
  );
}
