import {
  CanvasTexture,
  ClampToEdgeWrapping,
  LinearFilter,
  SRGBColorSpace,
} from "three";

type BlobSpec = {
  color: string;
  height: number;
  opacity?: number;
  seed: number;
  width: number;
  x: number;
  y: number;
};

function createTexture(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2D context is unavailable.");
  }

  draw(context);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function drawNoise(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity: number,
  color = "255,255,255",
) {
  for (let index = 0; index < 3600; index += 1) {
    const x = seededUnit(index * 4 + 1) * width;
    const y = seededUnit(index * 4 + 2) * height;
    const size = 0.7 + seededUnit(index * 4 + 3) * 1.6;
    context.fillStyle = `rgba(${color},${opacity * seededUnit(index * 4 + 4)})`;
    context.fillRect(x, y, size, size);
  }
}

function drawBlob(context: CanvasRenderingContext2D, blob: BlobSpec) {
  context.save();
  context.globalAlpha = blob.opacity ?? 1;
  context.fillStyle = blob.color;
  context.beginPath();

  const points = 22;
  for (let index = 0; index <= points; index += 1) {
    const angle = (index / points) * Math.PI * 2;
    const wobble = 0.78 + seededUnit(blob.seed * 100 + index) * 0.42;
    const x = blob.x + Math.cos(angle) * blob.width * wobble;
    const y = blob.y + Math.sin(angle) * blob.height * wobble;

    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }

  context.closePath();
  context.fill();
  context.restore();
}

function drawBands(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: string[],
  opacity = 1,
) {
  context.save();
  context.globalAlpha = opacity;

  colors.forEach((color, index) => {
    const y = (index / colors.length) * height;
    const bandHeight = height / colors.length + 10;
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(0, y);

    for (let x = 0; x <= width; x += 24) {
      const wobble = Math.sin(x * 0.025 + index * 1.7) * 8;
      context.lineTo(x, y + wobble);
    }

    context.lineTo(width, y + bandHeight);
    context.lineTo(0, y + bandHeight);
    context.closePath();
    context.fill();
  });

  context.restore();
}

export function createEarthSurfaceTexture() {
  return createTexture(1024, 512, (context) => {
    const gradient = context.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, "#0d2f66");
    gradient.addColorStop(0.45, "#123f8b");
    gradient.addColorStop(1, "#071d43");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1024, 512);

    [
      { color: "#2f6f4e", x: 260, y: 165, width: 118, height: 76, seed: 1 },
      { color: "#7a6a3a", x: 360, y: 205, width: 74, height: 48, seed: 2 },
      { color: "#3f7a52", x: 540, y: 205, width: 132, height: 72, seed: 3 },
      { color: "#8a7444", x: 640, y: 250, width: 86, height: 56, seed: 4 },
      { color: "#315f43", x: 725, y: 178, width: 112, height: 66, seed: 5 },
      { color: "#2d5c43", x: 785, y: 318, width: 76, height: 48, seed: 6 },
      { color: "#6f7240", x: 175, y: 300, width: 64, height: 104, seed: 7 },
      { color: "#2f6f4e", x: 885, y: 190, width: 96, height: 56, seed: 8 },
    ].forEach((blob) => drawBlob(context, blob));

    drawNoise(context, 1024, 512, 0.05, "200,230,210");
  });
}

export function createEarthCloudTexture() {
  return createTexture(1024, 512, (context) => {
    context.clearRect(0, 0, 1024, 512);

    for (let index = 0; index < 64; index += 1) {
      drawBlob(context, {
        color: "#ffffff",
        height: 8 + seededUnit(index * 5 + 1) * 16,
        opacity: 0.16 + seededUnit(index * 5 + 2) * 0.18,
        seed: index,
        width: 40 + seededUnit(index * 5 + 3) * 95,
        x: seededUnit(index * 5 + 4) * 1024,
        y: 60 + seededUnit(index * 5 + 5) * 390,
      });
    }
  });
}

export function createMoonTexture() {
  return createTexture(768, 384, (context) => {
    context.fillStyle = "#aeb3ba";
    context.fillRect(0, 0, 768, 384);
    drawNoise(context, 768, 384, 0.16, "50,55,64");
    drawNoise(context, 768, 384, 0.12, "255,255,255");

    [
      { x: 205, y: 160, width: 72, height: 48, seed: 21 },
      { x: 365, y: 190, width: 110, height: 64, seed: 22 },
      { x: 515, y: 130, width: 84, height: 54, seed: 23 },
      { x: 610, y: 238, width: 54, height: 38, seed: 24 },
    ].forEach((blob) =>
      drawBlob(context, {
        ...blob,
        color: "#626974",
        opacity: 0.58,
      }),
    );

    for (let index = 0; index < 62; index += 1) {
      const x = seededUnit(index * 6 + 1) * 768;
      const y = seededUnit(index * 6 + 2) * 384;
      const radius = 5 + seededUnit(index * 6 + 3) * 18;
      context.strokeStyle = `rgba(54,61,72,${0.18 + seededUnit(index * 6 + 4) * 0.22})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.stroke();
    }
  });
}

export function createMercuryTexture() {
  return createTexture(768, 384, (context) => {
    context.fillStyle = "#8f939b";
    context.fillRect(0, 0, 768, 384);
    drawNoise(context, 768, 384, 0.18, "40,43,49");
    drawNoise(context, 768, 384, 0.09, "225,229,234");

    for (let index = 0; index < 78; index += 1) {
      const x = seededUnit(index * 7 + 1) * 768;
      const y = seededUnit(index * 7 + 2) * 384;
      const radius = 3 + seededUnit(index * 7 + 3) * 15;
      context.strokeStyle = `rgba(44,48,56,${0.16 + seededUnit(index * 7 + 4) * 0.22})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.stroke();
    }
  });
}

export function createMarsTexture() {
  return createTexture(768, 384, (context) => {
    const gradient = context.createLinearGradient(0, 0, 0, 384);
    gradient.addColorStop(0, "#b85e39");
    gradient.addColorStop(0.5, "#c5683f");
    gradient.addColorStop(1, "#7f3826");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 768, 384);
    drawNoise(context, 768, 384, 0.14, "80,32,20");
    drawNoise(context, 768, 384, 0.08, "255,190,130");

    [
      { color: "#5f2c1e", x: 185, y: 168, width: 125, height: 34, seed: 31 },
      { color: "#73351f", x: 405, y: 210, width: 165, height: 26, seed: 32 },
      { color: "#8b3d22", x: 560, y: 145, width: 80, height: 42, seed: 33 },
      { color: "#4c241b", x: 320, y: 260, width: 78, height: 24, seed: 34 },
    ].forEach((blob) => drawBlob(context, { ...blob, opacity: 0.56 }));

    context.fillStyle = "rgba(245,248,255,0.9)";
    context.fillRect(0, 0, 768, 22);
    context.fillRect(0, 362, 768, 22);
  });
}

export function createVenusTexture() {
  return createTexture(768, 384, (context) => {
    context.fillStyle = "#c89f61";
    context.fillRect(0, 0, 768, 384);
    drawBands(context, 768, 384, [
      "#d7b16f",
      "#b7854e",
      "#e2c48a",
      "#a97446",
      "#d6ad6c",
      "#b8814b",
      "#ecc98a",
    ], 0.72);
    drawNoise(context, 768, 384, 0.09, "80,55,35");
  });
}

export function createJupiterTexture() {
  return createTexture(1024, 512, (context) => {
    context.fillStyle = "#d9b06e";
    context.fillRect(0, 0, 1024, 512);
    drawBands(context, 1024, 512, [
      "#efd9aa",
      "#b97a45",
      "#e5bd7d",
      "#8b4d32",
      "#f1d4a0",
      "#a45f38",
      "#d9a665",
      "#70412d",
      "#f4ddb8",
    ], 0.92);
    drawNoise(context, 1024, 512, 0.11, "90,48,28");
    drawNoise(context, 1024, 512, 0.08, "255,230,190");

    drawBlob(context, {
      color: "#9d4429",
      height: 34,
      opacity: 0.72,
      seed: 52,
      width: 82,
      x: 710,
      y: 286,
    });
  });
}

export function createSaturnTexture() {
  return createTexture(1024, 512, (context) => {
    context.fillStyle = "#d7bf82";
    context.fillRect(0, 0, 1024, 512);
    drawBands(context, 1024, 512, [
      "#ecd99f",
      "#c8a76d",
      "#e5cf93",
      "#b8925d",
      "#dcc28a",
      "#c6a16b",
      "#f0dfb0",
    ], 0.5);
    drawNoise(context, 1024, 512, 0.08, "95,70,38");
  });
}

export function createSaturnRingTexture() {
  return createTexture(1024, 128, (context) => {
    context.clearRect(0, 0, 1024, 128);

    const bands = [
      { color: "rgba(238,224,184,0.08)", width: 70 },
      { color: "rgba(221,205,160,0.22)", width: 128 },
      { color: "rgba(145,161,176,0.12)", width: 46 },
      { color: "rgba(237,218,170,0.3)", width: 164 },
      { color: "rgba(72,83,96,0.12)", width: 16 },
      { color: "rgba(227,208,161,0.24)", width: 132 },
      { color: "rgba(160,178,196,0.1)", width: 82 },
    ];

    let x = 0;
    while (x < 1024) {
      bands.forEach((band) => {
        context.fillStyle = band.color;
        context.fillRect(x, 0, band.width, 128);
        x += band.width;
      });
    }
  });
}

export function createSunTexture() {
  return createTexture(768, 384, (context) => {
    const gradient = context.createRadialGradient(384, 192, 25, 384, 192, 390);
    gradient.addColorStop(0, "#fff0a8");
    gradient.addColorStop(0.4, "#ffb703");
    gradient.addColorStop(1, "#c84c0c");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 768, 384);

    drawBands(context, 768, 384, [
      "rgba(255,210,74,0.18)",
      "rgba(255,127,0,0.18)",
      "rgba(255,235,150,0.14)",
      "rgba(190,58,20,0.18)",
    ], 1);
    drawNoise(context, 768, 384, 0.22, "255,245,190");
    drawNoise(context, 768, 384, 0.18, "180,50,0");
  });
}

export function createCeresTexture() {
  return createTexture(768, 384, (context) => {
    context.fillStyle = "#8b8377";
    context.fillRect(0, 0, 768, 384);
    drawNoise(context, 768, 384, 0.18, "45,40,36");
    drawNoise(context, 768, 384, 0.1, "220,210,190");

    [
      { color: "#5f574f", x: 205, y: 155, width: 70, height: 42, seed: 81 },
      { color: "#b8ac99", x: 420, y: 212, width: 32, height: 20, seed: 82 },
      { color: "#6b6258", x: 560, y: 118, width: 54, height: 34, seed: 83 },
    ].forEach((blob) => drawBlob(context, { ...blob, opacity: 0.58 }));

    for (let index = 0; index < 48; index += 1) {
      const x = seededUnit(index * 8 + 1) * 768;
      const y = seededUnit(index * 8 + 2) * 384;
      const radius = 4 + seededUnit(index * 8 + 3) * 12;
      context.strokeStyle = `rgba(42,38,34,${0.15 + seededUnit(index * 8 + 4) * 0.18})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.stroke();
    }
  });
}

export function createUranusTexture() {
  return createTexture(768, 384, (context) => {
    const gradient = context.createLinearGradient(0, 0, 0, 384);
    gradient.addColorStop(0, "#b9f2f2");
    gradient.addColorStop(0.5, "#8bd7dd");
    gradient.addColorStop(1, "#5ca9b9");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 768, 384);
    drawBands(
      context,
      768,
      384,
      ["#bff5f2", "#90dbe1", "#a9e9ea", "#74bfcc", "#a2e0e2"],
      0.22,
    );
    drawNoise(context, 768, 384, 0.035, "230,255,255");
  });
}

export function createNeptuneTexture() {
  return createTexture(768, 384, (context) => {
    const gradient = context.createLinearGradient(0, 0, 0, 384);
    gradient.addColorStop(0, "#2b68ce");
    gradient.addColorStop(0.46, "#183c9a");
    gradient.addColorStop(1, "#091e55");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 768, 384);
    drawBands(
      context,
      768,
      384,
      ["#315fbd", "#17377e", "#2b5cb6", "#0d2868", "#3b70d4"],
      0.24,
    );
    drawNoise(context, 768, 384, 0.05, "180,210,255");
    drawBlob(context, {
      color: "#1b2f62",
      height: 22,
      opacity: 0.46,
      seed: 91,
      width: 58,
      x: 490,
      y: 218,
    });
    drawBlob(context, {
      color: "#d3e5ff",
      height: 9,
      opacity: 0.22,
      seed: 92,
      width: 78,
      x: 310,
      y: 126,
    });
  });
}

export function createPlutoTexture() {
  return createTexture(768, 384, (context) => {
    context.fillStyle = "#9b8873";
    context.fillRect(0, 0, 768, 384);
    drawNoise(context, 768, 384, 0.12, "55,45,38");
    drawNoise(context, 768, 384, 0.08, "240,230,210");

    [
      { color: "#d7cfc1", x: 340, y: 170, width: 74, height: 52, seed: 101 },
      { color: "#6f5748", x: 212, y: 236, width: 96, height: 38, seed: 102 },
      { color: "#bfa98f", x: 560, y: 120, width: 86, height: 34, seed: 103 },
      { color: "#efe5d1", x: 438, y: 214, width: 32, height: 22, seed: 104 },
    ].forEach((blob) => drawBlob(context, { ...blob, opacity: 0.58 }));
  });
}
