"use client";

import { Html } from "@react-three/drei";

const ZODIAC_MARKERS = [
  "ARIES",
  "TAURUS",
  "GEMINI",
  "CANCER",
  "LEO",
  "VIRGO",
  "LIBRA",
  "SCORPIUS",
  "SAGITTARIUS",
  "CAPRICORN",
  "AQUARIUS",
  "PISCES",
];

const ZODIAC_RADIUS = 61;

export default function ZodiacMarkers() {
  return (
    <group>
      {ZODIAC_MARKERS.map((label, index) => {
        const angle = (index / ZODIAC_MARKERS.length) * Math.PI * 2 - 0.42;
        const position: [number, number, number] = [
          Math.cos(angle) * ZODIAC_RADIUS,
          0.35,
          Math.sin(angle) * ZODIAC_RADIUS,
        ];

        return (
          <group key={label} position={position}>
            <mesh>
              <sphereGeometry args={[0.08, 10, 10]} />
              <meshBasicMaterial color="#fef3c7" opacity={0.36} transparent />
            </mesh>
            <Html center distanceFactor={18} position={[0, 0.52, 0]}>
              <div className="pointer-events-none whitespace-nowrap border border-amber-100/10 bg-black/24 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.22em] text-amber-100/48 backdrop-blur-sm">
                {label}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
