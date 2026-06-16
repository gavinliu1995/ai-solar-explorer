"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide } from "three";
import type { Mesh } from "three";
import { createVenusTexture } from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

type VenusProps = {
  position: [number, number, number];
};

export default function Venus({ position }: VenusProps) {
  const meshRef = useRef<Mesh>(null);
  const fallbackSurfaceTexture = useMemo(() => createVenusTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/venus.jpg");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshStandardMaterial
          emissive="#2f2114"
          emissiveIntensity={0.05}
          map={surfaceTexture}
          roughness={0.88}
        />
      </mesh>

      <mesh scale={1.055}>
        <sphereGeometry args={[0.55, 40, 40]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#f6d58d"
          depthWrite={false}
          opacity={0.035}
          side={BackSide}
          transparent
        />
      </mesh>
    </group>
  );
}
