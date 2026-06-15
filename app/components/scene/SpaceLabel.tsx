"use client";

import { Html } from "@react-three/drei";

type SpaceLabelProps = {
  active?: boolean;
  children: string;
  muted?: boolean;
  position: [number, number, number];
};

export default function SpaceLabel({
  active = false,
  children,
  muted = false,
  position,
}: SpaceLabelProps) {
  return (
    <Html center distanceFactor={9} position={position}>
      <div
        className={[
          "pointer-events-none whitespace-nowrap border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.36em] backdrop-blur-sm [text-shadow:0_0_12px_rgba(226,232,240,0.55)]",
          active
            ? "border-cyan-300/70 bg-cyan-950/45 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.42)]"
            : "border-white/10 bg-black/40 text-slate-200/65 shadow-[0_0_12px_rgba(2,6,23,0.52)]",
          muted ? "opacity-48" : "opacity-78",
        ].join(" ")}
      >
        {children}
      </div>
    </Html>
  );
}
