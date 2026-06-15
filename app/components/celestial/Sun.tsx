"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide } from "three";
import type { Group, Mesh } from "three";
import { createSunTexture } from "./textureUtils";
import { useOptionalTexture } from "./useOptionalTexture";

export default function Sun() {
  const groupRef = useRef<Group>(null);
  const surfaceRef = useRef<Mesh>(null);
  const elapsedRef = useRef(0);
  const fallbackSurfaceTexture = useMemo(() => createSunTexture(), []);
  const localSurfaceTexture = useOptionalTexture("/textures/planets/sun.jpg");
  const surfaceTexture = localSurfaceTexture ?? fallbackSurfaceTexture;

  useFrame((_, delta) => {
    elapsedRef.current += delta;

    if (surfaceRef.current) surfaceRef.current.rotation.y += delta * 0.08;
    if (groupRef.current) {
      const pulse = 1 + Math.sin(elapsedRef.current * 1.35) * 0.035;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh ref={surfaceRef}>
        <sphereGeometry args={[1.9, 72, 72]} />
        <meshStandardMaterial
          map={surfaceTexture}
          emissive="#ff9f1c"
          emissiveIntensity={3.25}
          emissiveMap={surfaceTexture}
          roughness={0.52}
        />
      </mesh>

      {[0.62, 1.1, 1.7, 2.35, 2.92].map((angle, index) => (
        <mesh
          key={angle}
          position={[
            Math.cos(angle) * 0.55,
            Math.sin(angle * 1.7) * 0.38,
            Math.sin(angle) * 0.55,
          ]}
          scale={[1.25 + index * 0.06, 0.76, 0.94]}
        >
          <sphereGeometry args={[0.72, 24, 24]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={index % 2 === 0 ? "#ffb703" : "#ff7b00"}
            opacity={0.12}
            transparent
          />
        </mesh>
      ))}

      <mesh scale={1.12}>
        <sphereGeometry args={[1.9, 64, 64]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#ffd166"
          opacity={0.13}
          side={BackSide}
          transparent
        />
      </mesh>

      <mesh scale={1.36}>
        <sphereGeometry args={[1.9, 64, 64]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#ff9f1c"
          opacity={0.07}
          side={BackSide}
          transparent
        />
      </mesh>

      <mesh scale={1.74}>
        <sphereGeometry args={[1.9, 64, 64]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#ff8f00"
          opacity={0.032}
          side={BackSide}
          transparent
        />
      </mesh>

      {Array.from({ length: 18 }).map((_, index) => {
        const angle = (index / 18) * Math.PI * 2;
        const length = 1.05 + (index % 4) * 0.16;

        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * 2.1,
              Math.sin(angle * 1.7) * 0.2,
              Math.sin(angle) * 2.1,
            ]}
            rotation={[0, -angle, 0]}
            scale={[0.025, 0.025, length]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial
              blending={AdditiveBlending}
              color="#ffcf70"
              opacity={0.08}
              transparent
            />
          </mesh>
        );
      })}
    </group>
  );
}
