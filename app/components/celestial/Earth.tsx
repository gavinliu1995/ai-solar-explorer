"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide } from "three";
import type { Group } from "three";
import {
  createEarthCloudTexture,
  createEarthSurfaceTexture,
} from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

type EarthProps = {
  active?: boolean;
  position: [number, number, number];
};

export default function Earth({ active = false, position }: EarthProps) {
  const planetRef = useRef<Group>(null);
  const cloudRef = useRef<Group>(null);
  const fallbackSurfaceTexture = useMemo(() => createEarthSurfaceTexture(), []);
  const fallbackCloudTexture = useMemo(() => createEarthCloudTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/earth_day.jpg");
  const localCloudTexture = useOptionalTexture("/textures/planets/earth_clouds.png");
  const localNightTexture = useOptionalTexture("/textures/planets/earth_night.jpg");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;
  const cloudTexture = localCloudTexture ?? fallbackCloudTexture;

  useFrame((_, delta) => {
    if (planetRef.current) planetRef.current.rotation.y += delta * 0.34;
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group position={position}>
      <group ref={planetRef}>
        <mesh>
          <sphereGeometry args={[0.86, 64, 64]} />
          <meshStandardMaterial
            map={surfaceTexture}
            emissive="#082b67"
            emissiveIntensity={active ? 0.2 : 0.06}
            emissiveMap={localNightTexture ?? undefined}
            metalness={0.02}
            roughness={0.72}
          />
        </mesh>
      </group>

      <group ref={cloudRef}>
        <mesh>
          <sphereGeometry args={[0.905, 64, 64]} />
          <meshStandardMaterial
            alphaMap={cloudTexture}
            color="#ffffff"
            depthWrite={false}
            opacity={active ? 0.36 : 0.22}
            transparent
            roughness={0.22}
          />
        </mesh>
      </group>

      <mesh scale={active ? 1.045 : 1.025}>
        <sphereGeometry args={[0.88, 48, 48]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#7dd3fc"
          opacity={active ? 0.055 : 0.032}
          side={BackSide}
          transparent
        />
      </mesh>
    </group>
  );
}
