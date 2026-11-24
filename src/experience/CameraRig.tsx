import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { LiveExperienceState } from '../animations/sceneConfig';

interface CameraRigProps {
  stateRef: React.MutableRefObject<LiveExperienceState>;
  reducedMotion: boolean;
}

const _desiredPos = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();

export function CameraRig({ stateRef, reducedMotion }: CameraRigProps) {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0.35, 0.35, 0));
  const smoothMouse = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const { interpolated, mouseNorm } = stateRef.current;

    const parallaxScale = reducedMotion ? 0 : 1;
    smoothMouse.current.x = THREE.MathUtils.damp(
      smoothMouse.current.x,
      mouseNorm.x * parallaxScale,
      4.5,
      dt
    );
    smoothMouse.current.y = THREE.MathUtils.damp(
      smoothMouse.current.y,
      mouseNorm.y * parallaxScale,
      4.5,
      dt
    );

    _desiredPos.set(
      interpolated.cameraPosition[0] + smoothMouse.current.x * 0.42,
      interpolated.cameraPosition[1] + smoothMouse.current.y * 0.24,
      interpolated.cameraPosition[2]
    );

    _desiredTarget.set(
      interpolated.cameraTarget[0] + smoothMouse.current.x * 0.14,
      interpolated.cameraTarget[1] + smoothMouse.current.y * 0.08,
      interpolated.cameraTarget[2]
    );

    const dampFactor = reducedMotion ? 14 : 5.5;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, _desiredPos.x, dampFactor, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, _desiredPos.y, dampFactor, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, _desiredPos.z, dampFactor, dt);

    currentTarget.current.x = THREE.MathUtils.damp(
      currentTarget.current.x,
      _desiredTarget.x,
      dampFactor,
      dt
    );
    currentTarget.current.y = THREE.MathUtils.damp(
      currentTarget.current.y,
      _desiredTarget.y,
      dampFactor,
      dt
    );
    currentTarget.current.z = THREE.MathUtils.damp(
      currentTarget.current.z,
      _desiredTarget.z,
      dampFactor,
      dt
    );

    camera.lookAt(currentTarget.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      const nextFov = THREE.MathUtils.damp(camera.fov, interpolated.cameraFov, 5.5, dt);
      if (Math.abs(nextFov - camera.fov) > 0.01) {
        camera.fov = nextFov;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
