"use client";

import { Html } from "@react-three/drei";
import { useMemo } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  Vector3,
} from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type {
  ArchiveMission,
  ArchiveMissionCategory,
  Language,
  SpaceTarget,
} from "@/app/types/space";
import { getMissionWaypointCopy } from "@/app/data/archiveMissions";

type MissionRouteLayerProps = {
  currentWaypointIndex: number;
  language: Language;
  mission: ArchiveMission | null;
  onSelectWaypoint?: (index: number) => void;
  showLabels: boolean;
  targetPositions: Record<SpaceTarget, Vector3>;
};

const CATEGORY_COLORS: Record<ArchiveMissionCategory, string> = {
  asteroids: "#d6b48a",
  future: "#a7f3d0",
  "giant-planets": "#93c5fd",
  "inner-solar-system": "#fcd34d",
  mars: "#fb923c",
  "outer-solar-system": "#67e8f9",
};

export default function MissionRouteLayer({
  currentWaypointIndex,
  language,
  mission,
  onSelectWaypoint,
  showLabels,
  targetPositions,
}: MissionRouteLayerProps) {
  const routeColor = mission ? CATEGORY_COLORS[mission.category] : "#67e8f9";
  const routeGeometry = useMemo(() => {
    if (!mission) return null;

    const points: number[] = [];
    mission.waypoints.forEach((waypoint, index) => {
      const position = targetPositions[waypoint.target];
      const previous = index > 0 ? targetPositions[mission.waypoints[index - 1].target] : null;

      if (!previous) {
        points.push(position.x, position.y + 0.3, position.z);
        return;
      }

      const segmentPoints = createArcSegment(previous, position, index);
      segmentPoints.forEach((point) => {
        points.push(point.x, point.y, point.z);
      });
    });

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
    return geometry;
  }, [mission, targetPositions]);
  const routeLine = useMemo(() => {
    if (!routeGeometry) return null;

    return new Line(
      routeGeometry,
      new LineBasicMaterial({
        blending: AdditiveBlending,
        color: routeColor,
        opacity: 0.34,
        transparent: true,
      }),
    );
  }, [routeColor, routeGeometry]);

  if (!mission || !routeLine) return null;

  return (
    <group>
      <primitive object={routeLine} />

      {mission.waypoints.map((waypoint, index) => {
        const position = targetPositions[waypoint.target];
        const active = index === currentWaypointIndex;
        const markerScale = active ? 1.55 : 1;
        const waypointCopy = getMissionWaypointCopy(waypoint, language);

        return (
          <group
            key={waypoint.id}
            position={[position.x, position.y + 0.34, position.z]}
          >
            <mesh
              onClick={(event: ThreeEvent<MouseEvent>) => {
                event.stopPropagation();
                onSelectWaypoint?.(index);
              }}
              scale={markerScale}
            >
              <sphereGeometry args={[active ? 0.16 : 0.11, 20, 20]} />
              <meshBasicMaterial
                blending={AdditiveBlending}
                color={active ? "#e0fbff" : routeColor}
                depthWrite={false}
                opacity={active ? 0.92 : 0.56}
                transparent
              />
            </mesh>
            <mesh scale={active ? 2.7 : 1.8}>
              <sphereGeometry args={[0.15, 18, 18]} />
              <meshBasicMaterial
                blending={AdditiveBlending}
                color={routeColor}
                depthWrite={false}
                opacity={active ? 0.13 : 0.045}
                transparent
              />
            </mesh>
            {showLabels ? (
              <Html center distanceFactor={10} position={[0, active ? 0.52 : 0.38, 0]}>
                <button
                  className={[
                    "pointer-events-auto whitespace-nowrap border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.28em] backdrop-blur-md transition",
                    active
                      ? "border-cyan-200/80 bg-cyan-950/55 text-cyan-50 shadow-[0_0_18px_rgba(103,232,249,0.36)]"
                      : "border-slate-400/20 bg-black/45 text-slate-300/70 hover:border-cyan-300/50 hover:text-cyan-100",
                  ].join(" ")}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectWaypoint?.(index);
                  }}
                  type="button"
                >
                  {waypointCopy.label}
                </button>
              </Html>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

function createArcSegment(from: Vector3, to: Vector3, segmentIndex: number) {
  const points: Vector3[] = [];
  const distance = from.distanceTo(to);
  const lift = Math.min(Math.max(distance * 0.1, 1.2), 7.5);
  const steps = 28;

  for (let step = 1; step <= steps; step += 1) {
    const t = step / steps;
    const point = new Vector3().lerpVectors(from, to, t);
    point.y += Math.sin(t * Math.PI) * lift + 0.3 + segmentIndex * 0.03;
    points.push(point);
  }

  return points;
}
