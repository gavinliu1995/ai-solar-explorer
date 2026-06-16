"use client";

import { Html } from "@react-three/drei";
import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
import type { ViewMode } from "@/app/types/space";

type ConstellationLayerProps = {
  viewMode: ViewMode;
};

type ConstellationSpec = {
  label: string;
  points: Array<[number, number, number]>;
  segments: Array<[number, number]>;
};

const SKY_RADIUS = 66;

// These constellations are simplified sky reference patterns, not true 3D stellar positions.
const CONSTELLATIONS: ConstellationSpec[] = [
  {
    label: "ORION",
    points: [
      skyPoint(222, -14),
      skyPoint(226, -4),
      skyPoint(230, 5),
      skyPoint(237, 12),
      skyPoint(242, 2),
      skyPoint(235, -7),
      skyPoint(229, -10),
    ],
    segments: [
      [0, 1],
      [1, 2],
      [2, 3],
      [2, 4],
      [1, 5],
      [5, 6],
      [4, 5],
    ],
  },
  {
    label: "URSA MAJOR",
    points: [
      skyPoint(315, 35),
      skyPoint(323, 39),
      skyPoint(333, 42),
      skyPoint(344, 38),
      skyPoint(354, 43),
      skyPoint(5, 47),
      skyPoint(18, 45),
    ],
    segments: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    label: "CASSIOPEIA",
    points: [
      skyPoint(38, 47),
      skyPoint(48, 55),
      skyPoint(60, 49),
      skyPoint(72, 57),
      skyPoint(84, 51),
    ],
    segments: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    label: "SCORPIUS",
    points: [
      skyPoint(156, -12),
      skyPoint(163, -18),
      skyPoint(171, -22),
      skyPoint(181, -20),
      skyPoint(190, -27),
      skyPoint(199, -34),
      skyPoint(209, -30),
    ],
    segments: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    label: "CYGNUS",
    points: [
      skyPoint(96, 28),
      skyPoint(104, 35),
      skyPoint(112, 42),
      skyPoint(121, 35),
      skyPoint(129, 28),
      skyPoint(112, 24),
    ],
    segments: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [2, 5],
    ],
  },
];

export default function ConstellationLayer({
  viewMode,
}: ConstellationLayerProps) {
  const active = viewMode === "celestial-sphere";
  const lineOpacity = active ? 0.34 : 0.035;
  const pointOpacity = active ? 0.58 : 0.05;

  return (
    <group>
      {CONSTELLATIONS.map((constellation) => (
        <Constellation
          constellation={constellation}
          key={constellation.label}
          lineOpacity={lineOpacity}
          pointOpacity={pointOpacity}
          showLabel={active}
        />
      ))}
    </group>
  );
}

function Constellation({
  constellation,
  lineOpacity,
  pointOpacity,
  showLabel,
}: {
  constellation: ConstellationSpec;
  lineOpacity: number;
  pointOpacity: number;
  showLabel: boolean;
}) {
  const lineGeometry = useMemo(() => {
    const vertices: number[] = [];

    constellation.segments.forEach(([startIndex, endIndex]) => {
      vertices.push(...constellation.points[startIndex]);
      vertices.push(...constellation.points[endIndex]);
    });

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    return geometry;
  }, [constellation]);
  const labelPosition = getLabelPosition(constellation.points);

  return (
    <group>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#dbeafe"
          opacity={lineOpacity}
          transparent
        />
      </lineSegments>
      {constellation.points.map((point, index) => (
        <mesh key={`${constellation.label}-${index}`} position={point}>
          <sphereGeometry args={[0.075, 10, 10]} />
          <meshBasicMaterial
            color="#bfdbfe"
            opacity={pointOpacity}
            transparent
          />
        </mesh>
      ))}
      {showLabel ? (
        <Html center distanceFactor={18} position={labelPosition}>
          <div className="pointer-events-none whitespace-nowrap border border-cyan-200/15 bg-black/28 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-slate-200/70 backdrop-blur-sm [text-shadow:0_0_12px_rgba(191,219,254,0.45)]">
            {constellation.label}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function skyPoint(
  azimuthDeg: number,
  elevationDeg: number,
): [number, number, number] {
  const azimuth = (azimuthDeg / 180) * Math.PI;
  const elevation = (elevationDeg / 180) * Math.PI;
  const horizontalRadius = Math.cos(elevation) * SKY_RADIUS;

  return [
    Math.cos(azimuth) * horizontalRadius,
    Math.sin(elevation) * SKY_RADIUS,
    Math.sin(azimuth) * horizontalRadius,
  ];
}

function getLabelPosition(points: Array<[number, number, number]>) {
  const center = points.reduce(
    (sum, point) =>
      [sum[0] + point[0], sum[1] + point[1], sum[2] + point[2]] as [
        number,
        number,
        number,
      ],
    [0, 0, 0] as [number, number, number],
  );

  return center.map((value) => (value / points.length) * 1.02) as [
    number,
    number,
    number,
  ];
}
