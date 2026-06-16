"use client";

import { useMemo } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";
import SpaceLabel from "./SpaceLabel";

type AsteroidBeltProps = {
  active?: boolean;
  showLabel?: boolean;
};

export default function AsteroidBelt({
  active = false,
  showLabel = true,
}: AsteroidBeltProps) {
  const geometry = useMemo(() => {
    const points: number[] = [];
    const count = 260;

    for (let index = 0; index < count; index += 1) {
      const angle = seededUnit(index * 9 + 1) * Math.PI * 2;
      const radius = 13.6 + seededUnit(index * 9 + 2) * 3.1;
      const ellipseScale = 0.9 + seededUnit(index * 9 + 3) * 0.18;
      const y = -0.22 + seededUnit(index * 9 + 4) * 0.44;
      points.push(
        Math.cos(angle) * radius * ellipseScale,
        y,
        Math.sin(angle) * radius,
      );
    }

    const beltGeometry = new BufferGeometry();
    beltGeometry.setAttribute("position", new Float32BufferAttribute(points, 3));
    return beltGeometry;
  }, []);

  return (
    <group>
      <points geometry={geometry}>
        <pointsMaterial
          blending={AdditiveBlending}
          color={active ? "#f6c28a" : "#8b8174"}
          opacity={active ? 0.62 : 0.26}
          size={active ? 0.07 : 0.046}
          transparent
        />
      </points>
      {showLabel ? (
        <SpaceLabel
          active={active}
          muted={!active}
          position={[0, active ? 1.12 : 0.82, 15.35]}
        >
          ASTEROID BELT
        </SpaceLabel>
      ) : null}
    </group>
  );
}

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}
