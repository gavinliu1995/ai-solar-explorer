"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { createCeresTexture } from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

type CeresProps = {
  active?: boolean;
  position: [number, number, number];
};

export default function Ceres({ active = false, position }: CeresProps) {
  const groupRef = useRef<Group>(null);
  const fallbackSurfaceTexture = useMemo(() => createCeresTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/ceres.jpg");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.16;
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.24, 44, 44]} />
        <meshStandardMaterial
          emissive={active ? "#2c2925" : "#12100e"}
          emissiveIntensity={active ? 0.045 : 0.018}
          map={surfaceTexture}
          roughness={0.97}
        />
      </mesh>
    </group>
  );
}
