"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide, DoubleSide } from "three";
import type { Group } from "three";
import {
  createSaturnRingTexture,
  createSaturnTexture,
} from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

type SaturnProps = {
  active?: boolean;
  position: [number, number, number];
};

export default function Saturn({ active = false, position }: SaturnProps) {
  const groupRef = useRef<Group>(null);
  const fallbackSurfaceTexture = useMemo(() => createSaturnTexture(), []);
  const fallbackRingTexture = useMemo(() => createSaturnRingTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/saturn.jpg");
  const localRingTexture = useOptionalTexture("/textures/planets/saturn_ring.png");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;
  const ringTexture = localRingTexture ?? fallbackRingTexture;

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={groupRef} position={position} rotation={[0.12, 0, -0.22]}>
      <mesh>
        <sphereGeometry args={[1.06, 64, 64]} />
        <meshStandardMaterial
          map={surfaceTexture}
          emissive={active ? "#56411f" : "#22180c"}
          emissiveIntensity={active ? 0.14 : 0.04}
          roughness={0.76}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.34, 2.42, 192]} />
        <meshBasicMaterial
          alphaMap={ringTexture}
          color="#e7d7a4"
          depthWrite={false}
          map={ringTexture}
          opacity={active ? 0.55 : 0.32}
          side={DoubleSide}
          transparent
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.78, 1.88, 192]} />
        <meshBasicMaterial
          color="#02040a"
          depthWrite={false}
          opacity={active ? 0.34 : 0.18}
          side={DoubleSide}
          transparent
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.48, 2.62, 192]} />
        <meshBasicMaterial
          color="#a7b6c8"
          depthWrite={false}
          opacity={active ? 0.18 : 0.1}
          side={DoubleSide}
          transparent
        />
      </mesh>

      <mesh scale={active ? 1.09 : 1.03}>
        <sphereGeometry args={[1.06, 48, 48]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#f6e6b7"
          depthWrite={false}
          opacity={active ? 0.09 : 0.035}
          side={BackSide}
          transparent
        />
      </mesh>
    </group>
  );
}
