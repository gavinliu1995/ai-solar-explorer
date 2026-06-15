"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide } from "three";
import type { Group } from "three";
import type { ExplorationPoint, Language } from "@/app/types/space";
import { EXPLORATION_LABELS_LOCALIZED } from "@/app/types/space";
import { createMarsTexture } from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

type MarsProps = {
  active?: boolean;
  explorationPoint: ExplorationPoint;
  language: Language;
  position: [number, number, number];
  showExplorationPoints: boolean;
  setExplorationPoint: (point: ExplorationPoint) => void;
};

const EXPLORATION_POINTS: Array<{
  id: Exclude<ExplorationPoint, null>;
  position: [number, number, number];
}> = [
  { id: "olympus", position: [-0.64, 0.62, 0.18] },
  { id: "valles", position: [0.74, 0.02, 0.22] },
  { id: "jezero", position: [-0.34, -0.48, 0.34] },
  { id: "polar", position: [0.02, 0.87, 0.04] },
];

export default function Mars({
  active = false,
  explorationPoint,
  language,
  position,
  setExplorationPoint,
  showExplorationPoints,
}: MarsProps) {
  const planetRef = useRef<Group>(null);
  const fallbackSurfaceTexture = useMemo(() => createMarsTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/mars.jpg");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;

  useFrame((_, delta) => {
    if (planetRef.current) planetRef.current.rotation.y += delta * 0.24;
  });

  return (
    <group position={position}>
      <group ref={planetRef}>
        <mesh>
          <sphereGeometry args={[0.72, 56, 56]} />
          <meshStandardMaterial
            map={surfaceTexture}
            emissive="#4a1d13"
            emissiveIntensity={active ? 0.16 : 0.045}
            roughness={0.94}
          />
        </mesh>
      </group>

      <mesh scale={active ? 1.18 : 1.08}>
        <sphereGeometry args={[0.72, 48, 48]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#fb7185"
          opacity={active ? 0.16 : 0.035}
          side={BackSide}
          transparent
        />
      </mesh>

      {showExplorationPoints
        ? EXPLORATION_POINTS.map((point) => {
            const isActive = explorationPoint === point.id;

            return (
              <Html
                center
                distanceFactor={6}
                key={point.id}
                position={point.position}
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setExplorationPoint(point.id);
                  }}
                  className={[
                    "pointer-events-auto whitespace-nowrap border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md transition",
                    isActive
                      ? "border-cyan-300 bg-cyan-950/70 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.42)]"
                      : "border-red-300/55 bg-black/65 text-red-50/85 shadow-[0_0_16px_rgba(248,113,113,0.2)] hover:border-cyan-300 hover:text-cyan-100",
                  ].join(" ")}
                >
                  {EXPLORATION_LABELS_LOCALIZED[language][point.id]}
                </button>
              </Html>
            );
          })
        : null}
    </group>
  );
}
