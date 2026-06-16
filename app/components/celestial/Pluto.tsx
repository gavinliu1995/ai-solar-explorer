"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import SpaceLabel from "../scene/SpaceLabel";
import { createPlutoTexture } from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

type PlutoProps = {
  active?: boolean;
  position: [number, number, number];
};

export default function Pluto({ active = false, position }: PlutoProps) {
  const groupRef = useRef<Group>(null);
  const fallbackSurfaceTexture = useMemo(() => createPlutoTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/pluto.jpg");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.26, 44, 44]} />
        <meshStandardMaterial
          emissive={active ? "#2f2924" : "#15120f"}
          emissiveIntensity={active ? 0.05 : 0.02}
          map={surfaceTexture}
          roughness={0.92}
        />
      </mesh>

      {active ? (
        <group position={[0.62, 0.12, -0.34]}>
          <mesh>
            <sphereGeometry args={[0.075, 24, 24]} />
            <meshStandardMaterial
              color="#a4a8ae"
              emissive="#252b32"
              emissiveIntensity={0.08}
              roughness={0.94}
            />
          </mesh>
          <SpaceLabel muted position={[0, 0.26, 0]}>
            CHARON
          </SpaceLabel>
        </group>
      ) : null}
    </group>
  );
}
