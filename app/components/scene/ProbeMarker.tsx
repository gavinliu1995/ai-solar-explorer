"use client";

import { Html } from "@react-three/drei";
import { useMemo } from "react";

type ProbeMarkerProps = {
  color?: string;
  label: string;
  lineTo?: [number, number, number];
  position: [number, number, number];
};

export default function ProbeMarker({
  color = "#94a3b8",
  label,
  lineTo = [0.45, 0.18, 0],
  position,
}: ProbeMarkerProps) {
  const connector = useMemo(() => {
    const length = Math.hypot(lineTo[0], lineTo[1]);
    const angle = Math.atan2(lineTo[1], lineTo[0]);

    return {
      angle,
      length,
      position: [lineTo[0] / 2, lineTo[1] / 2, lineTo[2] / 2] as [
        number,
        number,
        number,
      ],
    };
  }, [lineTo]);

  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[0.08, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.46} />
      </mesh>
      <mesh position={connector.position} rotation={[0, 0, connector.angle]}>
        <boxGeometry args={[connector.length, 0.01, 0.01]} />
        <meshBasicMaterial color={color} opacity={0.18} transparent />
      </mesh>
      <Html center distanceFactor={5} position={lineTo}>
        <div className="pointer-events-none whitespace-nowrap border border-slate-400/10 bg-black/26 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-[0.16em] text-slate-400/42 backdrop-blur-sm">
          {label}
        </div>
      </Html>
    </group>
  );
}
