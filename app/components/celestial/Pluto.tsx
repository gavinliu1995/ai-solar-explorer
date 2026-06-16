"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { createPlutoTexture } from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

type PlutoProps = {
  active?: boolean;
  position: [number, number, number];
};

export default function Pluto({ active = false, position }: PlutoProps) {
  const meshRef = useRef<Mesh>(null);
  const fallbackSurfaceTexture = useMemo(() => createPlutoTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/pluto.jpg");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.12;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.26, 40, 40]} />
      <meshStandardMaterial
        emissive={active ? "#3f352b" : "#15120f"}
        emissiveIntensity={active ? 0.1 : 0.03}
        map={surfaceTexture}
        roughness={0.9}
      />
    </mesh>
  );
}
