"use client";

import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";

type OrbitLineProps = {
  active?: boolean;
  color: string;
  opacity?: number;
  radiusX: number;
  radiusZ: number;
  rotationY?: number;
  y?: number;
};

export default function OrbitLine({
  active = false,
  color,
  opacity = 0.26,
  radiusX,
  radiusZ,
  rotationY = 0,
  y = 0,
}: OrbitLineProps) {
  const geometry = useMemo(() => {
    const points: number[] = [];
    const segments = 256;

    for (let index = 0; index < segments; index += 1) {
      const angle = (index / segments) * Math.PI * 2;
      points.push(Math.cos(angle) * radiusX, y, Math.sin(angle) * radiusZ);
    }

    const orbitGeometry = new BufferGeometry();
    orbitGeometry.setAttribute("position", new Float32BufferAttribute(points, 3));
    return orbitGeometry;
  }, [radiusX, radiusZ, y]);

  return (
    <lineLoop geometry={geometry} rotation={[0, rotationY, 0]}>
      <lineBasicMaterial
        color={color}
        opacity={active ? 0.58 : opacity}
        transparent
      />
    </lineLoop>
  );
}
