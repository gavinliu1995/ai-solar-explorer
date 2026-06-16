"use client";

import { useMemo } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";
import { createSoftParticleTexture } from "./particleTexture";
import OrbitLine from "./OrbitLine";
import SpaceLabel from "./SpaceLabel";

type KuiperBeltProps = {
  active?: boolean;
  showLabel?: boolean;
};

export default function KuiperBelt({
  active = false,
  showLabel = true,
}: KuiperBeltProps) {
  const particleTexture = useMemo(() => createSoftParticleTexture(), []);
  const particleFields = useMemo(
    () => [
      {
        color: "#7da8bd",
        geometry: createBeltGeometry(300, 40, 49.2, 10.4, 1.26, 0.9, 0.18),
        opacity: active ? 0.44 : 0.08,
        size: active ? 0.092 : 0.038,
      },
      {
        color: "#c6d7e2",
        geometry: createBeltGeometry(170, 480, 50.4, 9.4, 1.7, 0.89, 0.2),
        opacity: active ? 0.34 : 0.06,
        size: active ? 0.064 : 0.03,
      },
      {
        color: "#4f7488",
        geometry: createBeltGeometry(130, 900, 48.6, 11.8, 2.1, 0.87, 0.22),
        opacity: active ? 0.28 : 0.05,
        size: active ? 0.112 : 0.052,
      },
    ],
    [active],
  );
  const selectedSectorFields = useMemo(
    () => [
      {
        color: "#d9f7ff",
        geometry: createSectorGeometry(260, 1400, Math.PI / 2, 0.78, 49.4, 10.8, 2.3, 0.9, 0.18),
        opacity: active ? 0.58 : 0,
        size: 0.16,
      },
      {
        color: "#74d8f2",
        geometry: createSectorGeometry(210, 1900, Math.PI / 2, 0.92, 50.2, 9.5, 3.1, 0.88, 0.2),
        opacity: active ? 0.42 : 0,
        size: 0.2,
      },
      {
        color: "#f0fbff",
        geometry: createSectorGeometry(84, 2500, Math.PI / 2, 0.64, 51.0, 7.8, 1.5, 0.92, 0.12),
        opacity: active ? 0.7 : 0,
        size: 0.095,
      },
    ],
    [active],
  );

  return (
    <group>
      {active ? (
        <>
          <OrbitLine
            color="#6ee7f9"
            opacity={0.28}
            radiusX={49.4}
            radiusZ={42.9}
            rotationY={0.08}
            y={-0.035}
          />
          <OrbitLine
            color="#d7f7ff"
            opacity={0.34}
            radiusX={59.4}
            radiusZ={50.8}
            rotationY={0.08}
            y={0.045}
          />
        </>
      ) : null}
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
      {selectedSectorFields.map((field) => (
        <points geometry={field.geometry} key={`selected-${field.color}`}>
          <pointsMaterial
            alphaTest={0.025}
            blending={AdditiveBlending}
            color={field.color}
            depthTest
            depthWrite={false}
            map={particleTexture}
            opacity={field.opacity}
            size={field.size}
            sizeAttenuation
            transparent
          />
        </points>
      ))}
      {showLabel ? (
        <SpaceLabel
          active={active}
          muted={!active}
          position={[0, active ? 1.4 : 1.0, 54]}
        >
          KUIPER BELT
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
    const seed = seedBase + index * 11;
    const angle = seededUnit(seed + 1) * Math.PI * 2;
    const radius = radiusStart + seededUnit(seed + 2) * radiusRange;
    const y = -ySpread / 2 + seededUnit(seed + 3) * ySpread;
    const ellipseScale = ellipseStart + seededUnit(seed + 4) * ellipseRange;
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

function createSectorGeometry(
  count: number,
  seedBase: number,
  centerAngle: number,
  angleSpread: number,
  radiusStart: number,
  radiusRange: number,
  ySpread: number,
  ellipseStart: number,
  ellipseRange: number,
) {
  const points: number[] = [];

  for (let index = 0; index < count; index += 1) {
    const seed = seedBase + index * 13;
    const angle = centerAngle + (seededUnit(seed + 1) - 0.5) * angleSpread;
    const radius = radiusStart + seededUnit(seed + 2) * radiusRange;
    const y = -ySpread / 2 + seededUnit(seed + 3) * ySpread;
    const ellipseScale = ellipseStart + seededUnit(seed + 4) * ellipseRange;
    points.push(
      Math.cos(angle) * radius * ellipseScale,
      y,
      Math.sin(angle) * radius,
    );
  }

  const sectorGeometry = new BufferGeometry();
  sectorGeometry.setAttribute("position", new Float32BufferAttribute(points, 3));
  return sectorGeometry;
}

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}
