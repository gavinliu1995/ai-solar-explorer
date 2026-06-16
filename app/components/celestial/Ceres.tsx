"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { createCeresTexture } from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

type CeresProps = {
  active?: boolean;
  position: [number, number, number];
};

export default function Ceres({ active = false, position }: CeresProps) {
  const meshRef = useRef<Mesh>(null);
  const fallbackSurfaceTexture = useMemo(() => createCeresTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/ceres.jpg");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.16;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.24, 40, 40]} />
      <meshStandardMaterial
        emissive={active ? "#4a3d32" : "#17130f"}
        emissiveIntensity={active ? 0.12 : 0.04}
        map={surfaceTexture}
        roughness={0.94}
      />
    </mesh>
  );
}
