"use client";

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
              opacity={0.12}
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
                emissive={moon.color}
                emissiveIntensity={isActive ? 0.08 : 0.02}
                roughness={0.9}
              />
            </mesh>
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
