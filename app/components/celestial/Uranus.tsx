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
          emissive={active ? "#164f5d" : "#07181d"}
          emissiveIntensity={active ? 0.16 : 0.035}
          map={surfaceTexture}
          roughness={0.62}
        />
      </mesh>

      {[
        { color: "#e7ffff", inner: 1.04, opacity: 0.12, outer: 1.08 },
        { color: "#9de8f1", inner: 1.17, opacity: 0.15, outer: 1.21 },
        { color: "#d6fbff", inner: 1.32, opacity: 0.08, outer: 1.36 },
      ].map((ring) => (
        <mesh key={ring.inner} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ring.inner, ring.outer, 160]} />
          <meshBasicMaterial
            color={ring.color}
            depthWrite={false}
            opacity={active ? ring.opacity : ring.opacity * 0.42}
            side={DoubleSide}
            transparent
          />
        </mesh>
      ))}

      <mesh scale={active ? 1.08 : 1.03}>
        <sphereGeometry args={[0.86, 40, 40]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#9ff2ff"
          depthWrite={false}
          opacity={active ? 0.095 : 0.028}
          side={BackSide}
          transparent
        />
      </mesh>
    </group>
  );
}
