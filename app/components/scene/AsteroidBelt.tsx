"use client";

import { useMemo } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";
import { createSoftParticleTexture } from "./particleTexture";
import SpaceLabel from "./SpaceLabel";

type AsteroidBeltProps = {
  active?: boolean;
  showLabel?: boolean;
};

export default function AsteroidBelt({
  active = false,
  showLabel = true,
}: AsteroidBeltProps) {
  const particleTexture = useMemo(() => createSoftParticleTexture(), []);
  const particleFields = useMemo(
    () => [
      {
        color: "#8b8174",
        geometry: createBeltGeometry(155, 10, 13.55, 3.25, 0.42, 0.9, 0.18),
        opacity: active ? 0.42 : 0.18,
        size: active ? 0.058 : 0.038,
      },
      {
        color: "#b9966a",
        geometry: createBeltGeometry(82, 300, 13.85, 2.85, 0.34, 0.92, 0.14),
        opacity: active ? 0.5 : 0.16,
        size: active ? 0.072 : 0.046,
      },
      {
        color: "#56514c",
        geometry: createBeltGeometry(92, 620, 13.65, 3.1, 0.56, 0.88, 0.2),
        opacity: active ? 0.34 : 0.12,
        size: active ? 0.048 : 0.034,
      },
    ],
    [active],
  );

  const majorBodies = useMemo(
    () =>
      [0, 1, 2].map((index) => {
        const angle = [0.48, 2.72, 4.74][index];
        const radius = [14.4, 15.9, 14.9][index];
        const y = [-0.12, 0.2, 0.08][index];
        return {
          color: ["#a99b86", "#796f64", "#c2a576"][index],
          position: [
            Math.cos(angle) * radius * 0.98,
            y,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          radius: [0.09, 0.07, 0.08][index],
        };
      }),
    [],
  );

  return (
    <group>
      {particleFields.map((field) => (
        <points geometry={field.geometry} key={field.color}>
          <pointsMaterial
            alphaTest={0.03}
            blending={AdditiveBlending}
            color={field.color}
            depthTest
            depthWrite={false}
            map={particleTexture}
            opacity={field.opacity}
            sizeAttenuation
            size={field.size}
            transparent
          />
        </points>
      ))}
      {active
        ? majorBodies.map((body) => (
            <mesh key={body.color} position={body.position}>
              <sphereGeometry args={[body.radius, 14, 14]} />
              <meshStandardMaterial
                color={body.color}
                emissive="#3a2f23"
                emissiveIntensity={0.08}
                roughness={0.96}
              />
            </mesh>
          ))
        : null}
      {showLabel ? (
        <SpaceLabel
          active={active}
          muted={!active}
          position={[0, active ? 1.12 : 0.82, 15.35]}
        >
          ASTEROID BELT
        </SpaceLabel>
      ) : null}
    </group>
  );
}

function createBeltGeometry(
  count: number,
  seedBase: number,
  radiusStart: number,
  radiusRange: number,
  ySpread: number,
  ellipseStart: number,
  ellipseRange: number,
) {
  const points: number[] = [];

  for (let index = 0; index < count; index += 1) {
    const seed = seedBase + index * 9;
    const angle = seededUnit(seed + 1) * Math.PI * 2;
    const radius = radiusStart + seededUnit(seed + 2) * radiusRange;
    const ellipseScale = ellipseStart + seededUnit(seed + 3) * ellipseRange;
    const y = -ySpread / 2 + seededUnit(seed + 4) * ySpread;
    points.push(
      Math.cos(angle) * radius * ellipseScale,
      y,
      Math.sin(angle) * radius,
    );
  }

  const beltGeometry = new BufferGeometry();
  beltGeometry.setAttribute("position", new Float32BufferAttribute(points, 3));
  return beltGeometry;
}

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}
