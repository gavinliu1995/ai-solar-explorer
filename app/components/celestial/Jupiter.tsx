"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide } from "three";
import type { Group } from "three";
import { createJupiterTexture } from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

type JupiterProps = {
  active?: boolean;
  position: [number, number, number];
};

export default function Jupiter({ active = false, position }: JupiterProps) {
  const groupRef = useRef<Group>(null);
  const fallbackSurfaceTexture = useMemo(() => createJupiterTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/jupiter.jpg");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[1.28, 72, 72]} />
        <meshStandardMaterial
          map={surfaceTexture}
          emissive={active ? "#5c351d" : "#2a160b"}
          emissiveIntensity={active ? 0.14 : 0.04}
          roughness={0.72}
        />
      </mesh>

      <mesh scale={active ? 1.08 : 1.03}>
        <sphereGeometry args={[1.28, 48, 48]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#f8d49a"
          opacity={active ? 0.1 : 0.045}
          side={BackSide}
          transparent
        />
      </mesh>
    </group>
  );
}
