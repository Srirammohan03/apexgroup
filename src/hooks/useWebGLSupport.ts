import { useMemo } from 'react';

export interface WebGLCapabilitiesInfo {
  supported: boolean;
  isSoftwareGl: boolean;
  rendererName: string;
}

export function detectWebGLCapabilities(): WebGLCapabilitiesInfo {
  if (typeof document === 'undefined') {
    return { supported: true, isSoftwareGl: false, rendererName: 'SSR' };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null);

    if (!gl) {
      return { supported: false, isSoftwareGl: false, rendererName: 'Unavailable' };
    }

    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();

    const isSoftwareGl =
      /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);

    return {
      supported: true,
      isSoftwareGl,
      rendererName: gpu,
    };
  } catch {
    return { supported: false, isSoftwareGl: false, rendererName: 'Error' };
  }
}

export function useWebGLSupport(): WebGLCapabilitiesInfo {
  return useMemo(() => detectWebGLCapabilities(), []);
}
