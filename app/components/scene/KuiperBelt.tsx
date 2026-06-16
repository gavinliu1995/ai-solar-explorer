"use client";

import { useMemo } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";
import SpaceLabel from "./SpaceLabel";

type KuiperBeltProps = {
  active?: boolean;
  showLabel?: boolean;
};

export default function KuiperBelt({
  active = false,
  showLabel = true,
}: KuiperBeltProps) {
  const geometry = useMemo(() => {
    const points: number[] = [];
    const count = 320;

    for (let index = 0; index < count; index += 1) {
      const angle = seededUnit(index * 11 + 1) * Math.PI * 2;
      const radius = 49.5 + seededUnit(index * 11 + 2) * 9.2;
      const y = -0.44 + seededUnit(index * 11 + 3) * 0.88;
      const ellipseScale = 0.92 + seededUnit(index * 11 + 4) * 0.14;
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
          color={active ? "#a5f3fc" : "#6f8ca8"}
          opacity={active ? 0.46 : 0.16}
          size={active ? 0.08 : 0.05}
          transparent
        />
      </points>
      {showLabel ? (
        <SpaceLabel
          active={active}
          muted={!active}
          position={[0, active ? 1.4 : 1.0, 54]}
        >
          KUIPER BELT
        </SpaceLabel>
      ) : null}
    </group>
  );
}

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}
