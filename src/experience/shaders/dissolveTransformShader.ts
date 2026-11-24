import * as THREE from 'three';

export interface DissolveUniforms {
  uVisibility: { value: number };
  uTime: { value: number };
  uEdgeColor: { value: THREE.Color };
  uLiquidAmp: { value: number };
}

export function createDissolveUniforms(
  initialVisibility = 1,
  edgeColorHex = '#F28C28',
  liquidAmp = 0.065
): DissolveUniforms {
  return {
    uVisibility: { value: initialVisibility },
    uTime: { value: 0 },
    uEdgeColor: { value: new THREE.Color(edgeColorHex) },
    uLiquidAmp: { value: liquidAmp },
  };
}

const NOISE_GLSL = /* glsl */ `
float apexHash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

float apexNoise3D(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(
      mix(apexHash31(i + vec3(0.0, 0.0, 0.0)), apexHash31(i + vec3(1.0, 0.0, 0.0)), f.x),
      mix(apexHash31(i + vec3(0.0, 1.0, 0.0)), apexHash31(i + vec3(1.0, 1.0, 0.0)), f.x),
      f.y
    ),
    mix(
      mix(apexHash31(i + vec3(0.0, 0.0, 1.0)), apexHash31(i + vec3(1.0, 0.0, 1.0)), f.x),
      mix(apexHash31(i + vec3(0.0, 1.0, 1.0)), apexHash31(i + vec3(1.0, 1.0, 1.0)), f.x),
      f.y
    ),
    f.z
  );
}
`;

export function enhanceMaterialWithDissolve<T extends THREE.Material>(
  material: T,
  uniforms: DissolveUniforms
): T {
  const previousCacheKey = material.customProgramCacheKey?.bind(material);
  material.customProgramCacheKey = () =>
    `${previousCacheKey ? previousCacheKey() : ''}_apex_vis_dissolve_v2`;

  const prevOnBeforeCompile = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    if (prevOnBeforeCompile) {
      prevOnBeforeCompile(shader, renderer);
    }

    shader.uniforms.uVisibility = uniforms.uVisibility;
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uEdgeColor = uniforms.uEdgeColor;
    shader.uniforms.uLiquidAmp = uniforms.uLiquidAmp;

    shader.vertexShader =
      /* glsl */ `
uniform float uVisibility;
uniform float uTime;
uniform float uLiquidAmp;
varying vec3 vDissolveLocalPos;
` + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      /* glsl */ `
#include <begin_vertex>
vDissolveLocalPos = position;
float apexTransitionBell = sin(clamp(uVisibility, 0.0, 1.0) * 3.14159265);
if (apexTransitionBell > 0.015) {
  float ripple = sin(position.y * 4.5 + uTime * 4.0) * cos(position.x * 3.8 - uTime * 3.0);
  transformed += normal * (ripple * uLiquidAmp * apexTransitionBell);
  transformed.y += sin(position.z * 3.2 + uTime * 3.4) * (uLiquidAmp * 0.45 * apexTransitionBell);
}
`
    );

    shader.fragmentShader =
      /* glsl */ `
uniform float uVisibility;
uniform float uTime;
uniform vec3 uEdgeColor;
varying vec3 vDissolveLocalPos;
${NOISE_GLSL}
` + shader.fragmentShader;

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <clipping_planes_fragment>',
      /* glsl */ `
#include <clipping_planes_fragment>
float apexVis = clamp(uVisibility, 0.0, 1.0);
float apexCutoff = 1.0 - apexVis;
float apexEdgeGlow = 0.0;
if (apexVis < 0.996) {
  if (apexVis <= 0.004) {
    discard;
  }
  float n1 = apexNoise3D(vDissolveLocalPos * 2.2 + vec3(0.0, uTime * 0.35, 0.0));
  float n2 = apexNoise3D(vDissolveLocalPos * 5.0 - vec3(uTime * 0.25, 0.0, 0.0));
  float heightGrad = clamp((vDissolveLocalPos.y + 1.2) / 3.2, 0.0, 1.0);
  float dissolveField = clamp(n1 * 0.52 + n2 * 0.23 + heightGrad * 0.25, 0.0, 1.0);
  if (dissolveField < apexCutoff) {
    discard;
  }
  apexEdgeGlow = 1.0 - smoothstep(apexCutoff, apexCutoff + 0.095, dissolveField);
}
`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      /* glsl */ `
#include <emissivemap_fragment>
totalEmissiveRadiance += uEdgeColor * apexEdgeGlow * 2.75;
`
    );
  };

  material.needsUpdate = true;
  return material;
}

export function applyDissolveToGroup(
  root: THREE.Object3D,
  uniforms: DissolveUniforms
): void {
  const seen = new Set<THREE.Material>();
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        if (mat && !seen.has(mat)) {
          seen.add(mat);
          enhanceMaterialWithDissolve(mat, uniforms);
        }
      });
    }
  });
}
