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
          emissive={active ? "#102a67" : "#061331"}
          emissiveIntensity={active ? 0.16 : 0.05}
          map={surfaceTexture}
          roughness={0.66}
        />
      </mesh>

      <mesh scale={active ? 1.09 : 1.035}>
        <sphereGeometry args={[0.88, 40, 40]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#5ca8ff"
          depthWrite={false}
          opacity={active ? 0.09 : 0.035}
          side={BackSide}
          transparent
        />
      </mesh>
    </group>
  );
}
