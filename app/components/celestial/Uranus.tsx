"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide, DoubleSide } from "three";
import type { Group } from "three";
import { createUranusTexture } from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

type UranusProps = {
  active?: boolean;
  position: [number, number, number];
};

export default function Uranus({ active = false, position }: UranusProps) {
  const groupRef = useRef<Group>(null);
  const fallbackSurfaceTexture = useMemo(() => createUranusTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/uranus.jpg");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={groupRef} position={position} rotation={[0.08, 0, -0.74]}>
      <mesh>
        <sphereGeometry args={[0.86, 56, 56]} />
        <meshStandardMaterial
          emissive={active ? "#123f4a" : "#07181d"}
          emissiveIntensity={active ? 0.14 : 0.04}
          map={surfaceTexture}
          roughness={0.68}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.08, 1.34, 144]} />
        <meshBasicMaterial
          color="#b8f4ff"
          depthWrite={false}
          opacity={active ? 0.18 : 0.08}
          side={DoubleSide}
          transparent
        />
      </mesh>

      <mesh scale={active ? 1.08 : 1.03}>
        <sphereGeometry args={[0.86, 40, 40]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#9ff2ff"
          depthWrite={false}
          opacity={active ? 0.08 : 0.03}
          side={BackSide}
          transparent
        />
      </mesh>
    </group>
  );
}
