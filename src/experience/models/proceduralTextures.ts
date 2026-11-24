import * as THREE from 'three';

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export function createBrushedMetalRoughnessMap(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 2) {
    const shade = 112 + Math.floor(Math.sin(y * 0.45) * 16 + (Math.random() - 0.5) * 24);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(0, y, 512, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createTankerLiveryTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(1024, 512);
  ctx.fillStyle = '#E6EBF0';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.strokeStyle = 'rgba(20, 26, 34, 0.16)';
  ctx.lineWidth = 2;
  for (let x = 128; x < 1024; x += 256) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  ctx.fillStyle = '#171C22';
  ctx.fillRect(0, 210, 1024, 84);
  ctx.fillStyle = '#F28C28';
  ctx.fillRect(0, 198, 1024, 14);
  ctx.fillRect(0, 294, 1024, 8);

  ctx.fillStyle = '#F7F9FB';
  ctx.font = '700 40px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('APEX ROAD LINES', 512, 252);

  ctx.fillStyle = '#F28C28';
  ctx.fillRect(140, 234, 36, 36);
  ctx.fillStyle = '#0B0D10';
  ctx.font = '700 18px "IBM Plex Mono", monospace';
  ctx.fillText('AR', 158, 253);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function createCanisterLabelTexture(variant: 'front' | 'back' = 'front'): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 768);
  ctx.fillStyle = '#11161D';
  ctx.fillRect(0, 0, 512, 768);

  ctx.strokeStyle = '#333D4A';
  ctx.lineWidth = 5;
  ctx.strokeRect(16, 16, 480, 736);

  ctx.fillStyle = '#F28C28';
  ctx.fillRect(36, 44, 440, 12);

  if (variant === 'front') {
    ctx.fillStyle = '#F7F9FB';
    ctx.font = '700 54px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('APEX', 38, 134);

    ctx.fillStyle = '#F28C28';
    ctx.font = '600 25px "Space Grotesk", sans-serif';
    ctx.fillText('NATURAL LUBES', 38, 174);

    ctx.fillStyle = '#B8C0C8';
    ctx.font = '500 17px "IBM Plex Mono", monospace';
    ctx.fillText('ENGINEERED PROTECTION', 38, 218);

    ctx.strokeStyle = '#F28C28';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(38, 360);
    ctx.bezierCurveTo(160, 280, 320, 440, 474, 340);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(184, 192, 200, 0.32)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(38, 392);
    ctx.bezierCurveTo(170, 315, 330, 468, 474, 372);
    ctx.stroke();

    ctx.fillStyle = '#1B222B';
    ctx.fillRect(38, 520, 436, 168);
    ctx.fillStyle = '#F7F9FB';
    ctx.font = '600 22px "Manrope", sans-serif';
    ctx.fillText('SYNTHETIC & MINERAL BLENDS', 56, 578);
    ctx.fillStyle = '#F28C28';
    ctx.font = '500 16px "IBM Plex Mono", monospace';
    ctx.fillText('ENGINE · DIESEL · GEAR · HYDRAULIC', 56, 622);
    ctx.fillStyle = '#9AA4B0';
    ctx.font = '400 15px "IBM Plex Mono", monospace';
    ctx.fillText('APEX NATURAL LUBES & CHEMICALS FZCO', 56, 654);
  } else {
    ctx.fillStyle = '#F7F9FB';
    ctx.font = '700 28px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('FORMULATION RANGE', 38, 120);

    const lines = [
      'ENGINE OILS',
      'DIESEL ENGINE OILS',
      'GEAR OILS',
      'HYDRAULIC OILS',
      'TRANSMISSION FLUIDS',
    ];
    lines.forEach((line, idx) => {
      const y = 210 + idx * 72;
      ctx.fillStyle = '#1B222B';
      ctx.fillRect(38, y - 34, 436, 52);
      ctx.fillStyle = '#F28C28';
      ctx.fillRect(38, y - 34, 6, 52);
      ctx.fillStyle = '#F7F9FB';
      ctx.font = '600 20px "IBM Plex Mono", monospace';
      ctx.fillText(line, 62, y - 2);
    });

    ctx.fillStyle = '#9AA4B0';
    ctx.font = '500 15px "IBM Plex Mono", monospace';
    ctx.fillText('THERMAL STABILITY · WEAR PROTECTION', 38, 665);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function createDrumStencilTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(1024, 512);
  ctx.fillStyle = '#1E242D';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = '#C89B54';
  ctx.fillRect(0, 175, 1024, 162);

  ctx.fillStyle = '#11151B';
  ctx.font = '700 44px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PRANAR OILS & CHEMICALS', 512, 248);

  ctx.font = '500 20px "IBM Plex Mono", monospace';
  ctx.fillText('INDUSTRIAL OILS · SPECIALTY CHEMICALS', 512, 294);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function createDispenserDisplayTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 256);
  ctx.fillStyle = '#090D12';
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#2B3542';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 240);

  ctx.fillStyle = '#F28C28';
  ctx.font = '700 28px "Space Grotesk", sans-serif';
  ctx.fillText('JS FUELS', 32, 54);

  ctx.fillStyle = '#B8C0C8';
  ctx.font = '500 16px "IBM Plex Mono", monospace';
  ctx.fillText('PETROL · DIESEL · CNG · LPG', 32, 88);

  ctx.fillStyle = '#F7F9FB';
  ctx.font = '700 46px "IBM Plex Mono", monospace';
  ctx.fillText('000.00 L', 32, 170);

  ctx.fillStyle = '#F28C28';
  ctx.fillRect(32, 206, 448, 8);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function createForecourtCanopyTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(1024, 192);
  ctx.fillStyle = '#12171D';
  ctx.fillRect(0, 0, 1024, 192);

  ctx.fillStyle = '#F28C28';
  ctx.fillRect(0, 0, 1024, 20);
  ctx.fillRect(0, 172, 1024, 20);

  ctx.fillStyle = '#F7F9FB';
  ctx.font = '700 54px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('JS FUELS', 48, 98);

  const grades = ['PETROL', 'DIESEL', 'CNG', 'LPG'];
  grades.forEach((grade, idx) => {
    const x = 440 + idx * 140;
    ctx.fillStyle = '#1D242E';
    ctx.fillRect(x, 54, 122, 84);
    ctx.strokeStyle = '#F28C28';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, 54, 122, 84);
    ctx.fillStyle = '#F7F9FB';
    ctx.font = '700 22px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(grade, x + 61, 98);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function createPressureGaugeTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256, 256);
  ctx.fillStyle = '#F3F5F7';
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#171C22';
  ctx.lineWidth = 8;
  ctx.stroke();

  for (let i = 0; i <= 10; i++) {
    const angle = Math.PI * 0.75 + (i / 10) * Math.PI * 1.5;
    const x1 = 128 + Math.cos(angle) * 86;
    const y1 = 128 + Math.sin(angle) * 86;
    const x2 = 128 + Math.cos(angle) * 104;
    const y2 = 128 + Math.sin(angle) * 104;
    ctx.strokeStyle = i >= 8 ? '#F28C28' : '#171C22';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  ctx.strokeStyle = '#F28C28';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(128, 128);
  ctx.lineTo(188, 86);
  ctx.stroke();

  ctx.fillStyle = '#171C22';
  ctx.beginPath();
  ctx.arc(128, 128, 12, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256, 256);
  const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 124);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.34)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
