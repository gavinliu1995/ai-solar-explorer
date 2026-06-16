"use client";

import { AdditiveBlending, BackSide } from "three";
import OrbitLine from "./OrbitLine";
import SpaceLabel from "./SpaceLabel";

type MoonSpec = {
  angle: number;
  color: string;
  distance: number;
  name: string;
  radius: number;
};

type MoonSystemProps = {
  isActive?: boolean;
  moons: MoonSpec[];
  parentPosition: [number, number, number];
  showLabels?: boolean;
};

export default function MoonSystem({
  isActive = false,
  moons,
  parentPosition,
  showLabels = true,
}: MoonSystemProps) {
  return (
    <group position={parentPosition}>
      {isActive
        ? moons.map((moon) => (
            <OrbitLine
              color="#94a3b8"
              key={`${moon.name}-orbit`}
              opacity={0.07}
              radiusX={moon.distance}
              radiusZ={moon.distance * 0.78}
              rotationY={0.18}
              y={0.015}
            />
          ))
        : null}
      {moons.map((moon) => {
        const x = Math.cos(moon.angle) * moon.distance;
        const z = Math.sin(moon.angle) * moon.distance * 0.78;
        const y = Math.sin(moon.angle * 0.7) * 0.16;

        return (
          <group key={moon.name} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[moon.radius, 18, 18]} />
              <meshStandardMaterial
                color={moon.color}
                depthWrite={isActive}
                emissive={moon.color}
                emissiveIntensity={isActive ? 0.09 : 0.012}
                opacity={isActive ? 0.96 : 0.2}
                roughness={0.92}
                transparent
              />
            </mesh>
            {isActive ? (
              <mesh scale={1.9}>
                <sphereGeometry args={[moon.radius, 14, 14]} />
                <meshBasicMaterial
                  blending={AdditiveBlending}
                  color={moon.color}
                  depthWrite={false}
                  opacity={0.055}
                  side={BackSide}
                  transparent
                />
              </mesh>
            ) : null}
            {showLabels && isActive ? (
              <SpaceLabel position={[0, moon.radius + 0.22, 0]}>
                {moon.name.toUpperCase()}
              </SpaceLabel>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}
