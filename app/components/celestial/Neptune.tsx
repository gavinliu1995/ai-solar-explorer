"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide } from "three";
import type { Group } from "three";
import { createNeptuneTexture } from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

type NeptuneProps = {
  active?: boolean;
  position: [number, number, number];
};

export default function Neptune({ active = false, position }: NeptuneProps) {
  const groupRef = useRef<Group>(null);
  const fallbackSurfaceTexture = useMemo(() => createNeptuneTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/neptune.jpg");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.13;
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.88, 56, 56]} />
        <meshStandardMaterial
          emissive={active ? "#12337e" : "#061331"}
          emissiveIntensity={active ? 0.18 : 0.045}
          map={surfaceTexture}
          roughness={0.62}
        />
      </mesh>

      <mesh scale={active ? 1.09 : 1.035}>
        <sphereGeometry args={[0.88, 40, 40]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#5ca8ff"
          depthWrite={false}
          opacity={active ? 0.105 : 0.032}
          side={BackSide}
          transparent
        />
      </mesh>

      <mesh position={[0.38, 0.18, 0.78]} scale={[1.7, 0.54, 0.42]}>
        <sphereGeometry args={[0.08, 24, 12]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#b9d7ff"
          depthWrite={false}
          opacity={active ? 0.14 : 0.04}
          transparent
        />
      </mesh>
    </group>
  );
}
