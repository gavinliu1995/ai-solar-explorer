"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { createMoonTexture } from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

type MoonProps = {
  active?: boolean;
  position: [number, number, number];
};

export default function Moon({ active = false, position }: MoonProps) {
  const groupRef = useRef<Group>(null);
  const fallbackSurfaceTexture = useMemo(() => createMoonTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/moon.jpg");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.31, 40, 40]} />
        <meshStandardMaterial
          map={surfaceTexture}
          emissive={active ? "#334155" : "#111827"}
          emissiveIntensity={active ? 0.15 : 0.045}
          roughness={0.95}
        />
      </mesh>
    </group>
  );
}
