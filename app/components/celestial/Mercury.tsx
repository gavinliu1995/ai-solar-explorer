"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { createMercuryTexture } from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

type MercuryProps = {
  position: [number, number, number];
};

export default function Mercury({ position }: MercuryProps) {
  const meshRef = useRef<Mesh>(null);
  const fallbackSurfaceTexture = useMemo(() => createMercuryTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/mercury.jpg");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.18;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.22, 40, 40]} />
      <meshStandardMaterial
        emissive="#171923"
        emissiveIntensity={0.08}
        map={surfaceTexture}
        roughness={0.92}
      />
    </mesh>
  );
}
