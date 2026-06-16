"use client";

import { Html } from "@react-three/drei";
import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
import type { ViewMode } from "@/app/types/space";

type EclipticBandProps = {
  viewMode: ViewMode;
};

const ECLIPTIC_RADIUS = 58;

export default function EclipticBand({ viewMode }: EclipticBandProps) {
  const active = viewMode === "celestial-sphere";
  const opacity = active ? 0.34 : 0.055;
  const outerGeometry = useCircleGeometry(ECLIPTIC_RADIUS);
  const innerGeometry = useCircleGeometry(ECLIPTIC_RADIUS * 0.985);
  const pointGeometry = useDottedCircleGeometry(ECLIPTIC_RADIUS, 96);

  return (
    <group rotation={[0, 0.015, 0]}>
      <lineLoop geometry={outerGeometry}>
        <lineBasicMaterial color="#facc15" opacity={opacity} transparent />
      </lineLoop>
      <lineLoop geometry={innerGeometry}>
        <lineBasicMaterial
          color="#fde68a"
          opacity={active ? 0.16 : 0.035}
          transparent
        />
      </lineLoop>
      <points geometry={pointGeometry}>
        <pointsMaterial
          color="#fef3c7"
          opacity={active ? 0.38 : 0.055}
          size={0.09}
          transparent
        />
      </points>
      {active ? (
        <Html center distanceFactor={16} position={[0, 0.65, -ECLIPTIC_RADIUS]}>
          <div className="pointer-events-none whitespace-nowrap border border-amber-200/20 bg-black/30 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-amber-100/75 backdrop-blur-sm">
            ECLIPTIC PLANE
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function useCircleGeometry(radius: number) {
  return useMemo(() => {
    const points: number[] = [];
    const segments = 320;

    for (let index = 0; index < segments; index += 1) {
      const angle = (index / segments) * Math.PI * 2;
      points.push(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
    return geometry;
  }, [radius]);
}

function useDottedCircleGeometry(radius: number, count: number) {
  return useMemo(() => {
    const points: number[] = [];

    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2;
      points.push(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
    return geometry;
  }, [count, radius]);
}
