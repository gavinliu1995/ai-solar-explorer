"use client";

import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
  type ComponentRef,
  type RefObject,
} from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Vector3,
} from "three";
import type { Camera } from "three";
import Ceres from "./celestial/Ceres";
import Earth from "./celestial/Earth";
import Jupiter from "./celestial/Jupiter";
import Mars from "./celestial/Mars";
import Mercury from "./celestial/Mercury";
import Moon from "./celestial/Moon";
import Neptune from "./celestial/Neptune";
import Pluto from "./celestial/Pluto";
import Saturn from "./celestial/Saturn";
import Sun from "./celestial/Sun";
import Uranus from "./celestial/Uranus";
import Venus from "./celestial/Venus";
import AsteroidBelt from "./scene/AsteroidBelt";
import ConstellationLayer from "./scene/ConstellationLayer";
import EclipticBand from "./scene/EclipticBand";
import KuiperBelt from "./scene/KuiperBelt";
import MissionRouteLayer from "./scene/MissionRouteLayer";
import MoonSystem from "./scene/MoonSystem";
import OrbitLine from "./scene/OrbitLine";
import ProbeMarker from "./scene/ProbeMarker";
import SpaceLabel from "./scene/SpaceLabel";
import ZodiacMarkers from "./scene/ZodiacMarkers";
import type {
  CameraCommand,
  CameraCommandType,
  CameraMode,
  ArchiveMission,
  ControlSensitivity,
  ExplorationPoint,
  Language,
  LockBehavior,
  SelectedTarget,
  ViewLayerState,
  ViewMode,
} from "@/app/types/space";
import {
  LOCKABLE_TARGETS,
  TARGET_LABELS_LOCALIZED,
  TARGET_POSITIONS,
} from "@/app/types/space";

type SolarSystemSceneProps = {
  cameraCommand: CameraCommand;
  cameraMode: CameraMode;
  controlSensitivity: ControlSensitivity;
  explorationPoint: ExplorationPoint;
  language: Language;
  lockBehavior: LockBehavior;
  onLockTarget: (target: SelectedTarget) => void;
  onNearestTargetChange: (target: SelectedTarget) => void;
  onSelectArchiveWaypoint: (index: number) => void;
  selectedTarget: SelectedTarget;
  selectedArchiveMission: ArchiveMission | null;
  currentArchiveWaypointIndex: number;
  setExplorationPoint: (point: ExplorationPoint) => void;
  viewLayers: ViewLayerState;
  viewMode: ViewMode;
};

type OrbitControlsHandle = ComponentRef<typeof OrbitControls>;

type OrbitSpec = {
  color: string;
  opacity: number;
  radiusX: number;
  radiusZ: number;
  rotationY?: number;
  target?: SelectedTarget;
};

const INITIAL_EARTH_CAMERA_POSITION: [number, number, number] = [7.25, 1.42, 4.18];

const ORBITS: OrbitSpec[] = [
  { color: "#8b8fa3", opacity: 0.052, radiusX: 4.0, radiusZ: 3.35, rotationY: 0.08, target: "mercury" },
  { color: "#eabf73", opacity: 0.058, radiusX: 6.1, radiusZ: 5.3, rotationY: -0.1, target: "venus" },
  { color: "#38bdf8", opacity: 0.082, radiusX: 8.85, radiusZ: 7.95, rotationY: 0.04, target: "earth" },
  { color: "#fb923c", opacity: 0.06, radiusX: 12.15, radiusZ: 10.85, rotationY: -0.16, target: "mars" },
  { color: "#a7a0a0", opacity: 0.042, radiusX: 15.65, radiusZ: 14.2, rotationY: 0.12, target: "ceres" },
  { color: "#94a3b8", opacity: 0.044, radiusX: 20.4, radiusZ: 18.55, rotationY: 0.16, target: "jupiter" },
  { color: "#7dd3fc", opacity: 0.04, radiusX: 28.8, radiusZ: 25.6, rotationY: -0.14, target: "saturn" },
  { color: "#67e8f9", opacity: 0.032, radiusX: 36.4, radiusZ: 32.4, rotationY: 0.22, target: "uranus" },
  { color: "#60a5fa", opacity: 0.03, radiusX: 44.5, radiusZ: 39.5, rotationY: -0.2, target: "neptune" },
  { color: "#cbd5e1", opacity: 0.028, radiusX: 55.4, radiusZ: 47.2, rotationY: 0.08, target: "pluto" },
];

const CAMERA_OFFSETS: Record<SelectedTarget, Vector3> = {
  "asteroid-belt": new Vector3(7.5, 5.2, 13.5),
  "kuiper-belt": new Vector3(18, 10, 24),
  ceres: new Vector3(1.05, 1.42, 3.1),
  sun: new Vector3(2.2, 2.6, 6.4),
  mercury: new Vector3(0.55, 0.72, 1.58),
  venus: new Vector3(0.72, 1.0, 2.15),
  earth: new Vector3(-1.55, 1.42, 3.58),
  moon: new Vector3(1.05, 1.04, 2.3),
  mars: new Vector3(1.05, 2.2, 4.5),
  jupiter: new Vector3(1.2, 6.8, 10.4),
  saturn: new Vector3(1.6, 7.4, 12.2),
  uranus: new Vector3(1.2, 4.8, 7.8),
  neptune: new Vector3(1.2, 4.8, 8.2),
  pluto: new Vector3(1.08, 1.5, 3.35),
};

const TARGET_RADII: Record<SelectedTarget, number> = {
  "asteroid-belt": 15.6,
  "kuiper-belt": 56,
  ceres: 0.24,
  sun: 1.45,
  mercury: 0.24,
  venus: 0.42,
  earth: 1.2,
  moon: 0.31,
  mars: 0.72,
  jupiter: 1.28,
  saturn: 2.5,
  uranus: 0.86,
  neptune: 0.88,
  pluto: 0.26,
};

const MAX_CAMERA_DISTANCE = 190;
const MAX_FREE_CAMERA_DISTANCE = 230;
const FREE_KEYBOARD_MOVE_SPEED = 6.8;
const SENSITIVITY_MULTIPLIERS: Record<ControlSensitivity, number> = {
  low: 0.68,
  normal: 1,
  high: 1.35,
};
const KEYBOARD_NAVIGATION_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ShiftLeft",
  "ShiftRight",
  "AltLeft",
  "AltRight",
]);

const JUPITER_MOONS = [
  { angle: 0.25, color: "#e0b36b", distance: 1.75, name: "Io", radius: 0.08 },
  { angle: 1.45, color: "#d8d8c8", distance: 2.1, name: "Europa", radius: 0.07 },
  { angle: 2.65, color: "#a78f74", distance: 2.45, name: "Ganymede", radius: 0.09 },
  { angle: 4.1, color: "#8b8279", distance: 2.78, name: "Callisto", radius: 0.08 },
];

const SATURN_MOONS = [
  { angle: 0.72, color: "#d7b36e", distance: 2.95, name: "Titan", radius: 0.09 },
  { angle: 3.42, color: "#dbeafe", distance: 3.42, name: "Enceladus", radius: 0.055 },
];

const URANUS_MOONS = [
  { angle: 1.1, color: "#cbd5e1", distance: 1.55, name: "Titania", radius: 0.055 },
  { angle: 3.8, color: "#94a3b8", distance: 1.88, name: "Oberon", radius: 0.055 },
];

const NEPTUNE_MOONS = [
  { angle: 2.2, color: "#c7d2fe", distance: 1.62, name: "Triton", radius: 0.06 },
];

export default function SolarSystemScene({
  cameraCommand,
  cameraMode,
  controlSensitivity,
  explorationPoint,
  language,
  lockBehavior,
  onLockTarget,
  onNearestTargetChange,
  onSelectArchiveWaypoint,
  selectedTarget,
  selectedArchiveMission,
  currentArchiveWaypointIndex,
  setExplorationPoint,
  viewLayers,
  viewMode,
}: SolarSystemSceneProps) {
  const controlsRef = useRef<OrbitControlsHandle | null>(null);
  const userControlVersionRef = useRef(0);
  const targetPositionVectors = useMemo(
    () =>
      LOCKABLE_TARGETS.reduce(
        (positions, target) => {
          const [x, y, z] = TARGET_POSITIONS[target];
          positions[target] = new Vector3(x, y, z);
          return positions;
        },
        {} as Record<SelectedTarget, Vector3>,
      ),
    [],
  );

  return (
    <Canvas
      className="h-full w-full"
      camera={{
        far: 1400,
        fov: 46,
        near: 0.08,
        position: INITIAL_EARTH_CAMERA_POSITION,
      }}
      dpr={[1, 2]}
      onCreated={({ camera }) => {
        camera.lookAt(...TARGET_POSITIONS.earth);
      }}
    >
      <color attach="background" args={["#02040a"]} />
      <fog attach="fog" args={["#02040a", 24, 168]} />
      <ambientLight intensity={0.2} />
      <pointLight
        color="#ffe7a3"
        distance={190}
        intensity={760}
        position={[0, 0, 0]}
      />

      {viewLayers.stars ? (
        <>
          <Stars
            radius={260}
            depth={120}
            count={6200}
            factor={3.6}
            saturation={0}
            fade
            speed={0.08}
          />
          <Stars
            radius={96}
            depth={48}
            count={620}
            factor={6.2}
            saturation={0.1}
            fade
            speed={0.16}
          />
          <DeepSpaceDust />
        </>
      ) : null}

      {viewLayers.constellations ? (
        <ConstellationLayer viewMode={viewMode} />
      ) : null}
      {viewLayers.ecliptic ? <EclipticBand viewMode={viewMode} /> : null}
      {viewMode === "celestial-sphere" && viewLayers.zodiac ? (
        <ZodiacMarkers />
      ) : null}

      <SolarMap
        explorationPoint={explorationPoint}
        language={language}
        onLockTarget={onLockTarget}
        selectedTarget={selectedTarget}
        setExplorationPoint={setExplorationPoint}
        viewLayers={viewLayers}
        viewMode={viewMode}
      />
      {viewLayers.missionRoutes ? (
        <MissionRouteLayer
          currentWaypointIndex={currentArchiveWaypointIndex}
          language={language}
          mission={selectedArchiveMission}
          onSelectWaypoint={onSelectArchiveWaypoint}
          showLabels={viewLayers.labels}
          targetPositions={targetPositionVectors}
        />
      ) : null}
      {viewLayers.probes ? <ProbeLayer /> : null}
      <CameraRig
        cameraCommand={cameraCommand}
        controlsRef={controlsRef}
        cameraMode={cameraMode}
        controlSensitivity={controlSensitivity}
        lockBehavior={lockBehavior}
        onNearestTargetChange={onNearestTargetChange}
        selectedTarget={selectedTarget}
        userControlVersionRef={userControlVersionRef}
        viewMode={viewMode}
      />
      <OrbitControls
        ref={controlsRef}
        dampingFactor={0.055}
        enableDamping
        enablePan={cameraMode === "free"}
        maxDistance={
          cameraMode === "free" ? MAX_FREE_CAMERA_DISTANCE : MAX_CAMERA_DISTANCE
        }
        minDistance={
          cameraMode === "free" ? 0.28 : getMinCameraDistance(selectedTarget)
        }
        onStart={() => {
          userControlVersionRef.current += 1;
        }}
        panSpeed={0.65}
        rotateSpeed={0.55}
        screenSpacePanning={cameraMode === "free"}
        zoomSpeed={2.05}
      />
    </Canvas>
  );
}

function SolarMap({
  explorationPoint,
  language,
  onLockTarget,
  selectedTarget,
  setExplorationPoint,
  viewLayers,
  viewMode,
}: {
  explorationPoint: ExplorationPoint;
  language: Language;
  onLockTarget: (target: SelectedTarget) => void;
  selectedTarget: SelectedTarget;
  setExplorationPoint: (point: ExplorationPoint) => void;
  viewLayers: ViewLayerState;
  viewMode: ViewMode;
}) {
  const labels = TARGET_LABELS_LOCALIZED[language];
  const orbitOpacityScale = viewMode === "celestial-sphere" ? 0.56 : 1;
  const targetDoubleClickHandlers = useMemo(
    () =>
      LOCKABLE_TARGETS.reduce(
        (handlers, target) => {
          handlers[target] = (event: ThreeEvent<MouseEvent>) => {
            event.stopPropagation();
            onLockTarget(target);
          };
          return handlers;
        },
        {} as Record<SelectedTarget, (event: ThreeEvent<MouseEvent>) => void>,
      ),
    [onLockTarget],
  );

  return (
    <group>
      {viewLayers.orbits
        ? ORBITS.map((orbit) => (
            <OrbitLine
              active={orbit.target === selectedTarget}
              color={orbit.color}
              key={`${orbit.color}-${orbit.radiusX}`}
              opacity={orbit.opacity * orbitOpacityScale}
              radiusX={orbit.radiusX}
              radiusZ={orbit.radiusZ}
              rotationY={orbit.rotationY}
            />
          ))
        : null}

      {viewLayers.orbits ? (
        <group position={TARGET_POSITIONS.earth}>
          <OrbitLine
            active={selectedTarget === "moon"}
            color="#cbd5e1"
            opacity={0.05 * orbitOpacityScale}
            radiusX={1.75}
            radiusZ={1.05}
            rotationY={0.22}
            y={0.02}
          />
        </group>
      ) : null}

      {viewLayers.asteroidBelt ? (
        <group onDoubleClick={targetDoubleClickHandlers["asteroid-belt"]}>
          <AsteroidBelt
            active={selectedTarget === "asteroid-belt"}
            showLabel={viewLayers.labels}
          />
        </group>
      ) : null}

      {viewLayers.kuiperBelt ? (
        <group onDoubleClick={targetDoubleClickHandlers["kuiper-belt"]}>
          <KuiperBelt
            active={selectedTarget === "kuiper-belt"}
            showLabel={viewLayers.labels}
          />
        </group>
      ) : null}

      <group
        onDoubleClick={targetDoubleClickHandlers.sun}
        scale={selectedTarget === "sun" ? 0.82 : 0.72}
      >
        <Sun />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel
          active={selectedTarget === "sun"}
          muted={selectedTarget !== "sun"}
          position={[0, 2.85, 0]}
        >
          {labels.sun}
        </SpaceLabel>
      ) : null}

      <group
        onDoubleClick={targetDoubleClickHandlers.mercury}
        position={TARGET_POSITIONS.mercury}
        scale={selectedTarget === "mercury" ? 1.22 : 1}
      >
        <Mercury position={[0, 0, 0]} />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel
          active={selectedTarget === "mercury"}
          muted={selectedTarget !== "mercury"}
          position={[
            TARGET_POSITIONS.mercury[0],
            0.82,
            TARGET_POSITIONS.mercury[2],
          ]}
        >
          {labels.mercury}
        </SpaceLabel>
      ) : null}

      <group
        onDoubleClick={targetDoubleClickHandlers.venus}
        position={TARGET_POSITIONS.venus}
        scale={selectedTarget === "venus" ? 0.9 : 0.72}
      >
        <Venus position={[0, 0, 0]} />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel
          active={selectedTarget === "venus"}
          muted={selectedTarget !== "venus"}
          position={[
            TARGET_POSITIONS.venus[0],
            1.05,
            TARGET_POSITIONS.venus[2],
          ]}
        >
          {labels.venus}
        </SpaceLabel>
      ) : null}

      <group
        onDoubleClick={targetDoubleClickHandlers.earth}
        position={TARGET_POSITIONS.earth}
        scale={selectedTarget === "earth" ? 1.4 : 1.06}
      >
        <Earth active={selectedTarget === "earth"} position={[0, 0, 0]} />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel
          active={selectedTarget === "earth"}
          muted={selectedTarget !== "earth"}
          position={[TARGET_POSITIONS.earth[0], 1.82, TARGET_POSITIONS.earth[2]]}
        >
          {labels.earth}
        </SpaceLabel>
      ) : null}

      <group onDoubleClick={targetDoubleClickHandlers.moon}>
        <Moon active={selectedTarget === "moon"} position={TARGET_POSITIONS.moon} />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel
          active={selectedTarget === "moon"}
          muted={selectedTarget !== "moon"}
          position={[TARGET_POSITIONS.moon[0], 0.76, TARGET_POSITIONS.moon[2]]}
        >
          {labels.moon}
        </SpaceLabel>
      ) : null}

      <group
        onDoubleClick={targetDoubleClickHandlers.mars}
        position={TARGET_POSITIONS.mars}
        scale={selectedTarget === "mars" ? 1 : 0.56}
      >
        <Mars
          active={selectedTarget === "mars"}
          explorationPoint={explorationPoint}
          language={language}
          position={[0, 0, 0]}
          setExplorationPoint={setExplorationPoint}
          showExplorationPoints={selectedTarget === "mars"}
        />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel
          active={selectedTarget === "mars"}
          muted={selectedTarget !== "mars"}
          position={[TARGET_POSITIONS.mars[0], 1.28, TARGET_POSITIONS.mars[2]]}
        >
          {labels.mars}
        </SpaceLabel>
      ) : null}

      <group
        onDoubleClick={targetDoubleClickHandlers.ceres}
        position={TARGET_POSITIONS.ceres}
        scale={selectedTarget === "ceres" ? 1.12 : 0.92}
      >
        <Ceres active={selectedTarget === "ceres"} position={[0, 0, 0]} />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel
          active={selectedTarget === "ceres"}
          muted={selectedTarget !== "ceres"}
          position={[TARGET_POSITIONS.ceres[0], 0.72, TARGET_POSITIONS.ceres[2]]}
        >
          {labels.ceres}
        </SpaceLabel>
      ) : null}

      <group
        onDoubleClick={targetDoubleClickHandlers.jupiter}
        position={TARGET_POSITIONS.jupiter}
        scale={selectedTarget === "jupiter" ? 1 : 0.68}
      >
        <Jupiter
          active={selectedTarget === "jupiter"}
          position={[0, 0, 0]}
        />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel
          active={selectedTarget === "jupiter"}
          muted={selectedTarget !== "jupiter"}
          position={[TARGET_POSITIONS.jupiter[0], 1.95, TARGET_POSITIONS.jupiter[2]]}
        >
          {labels.jupiter}
        </SpaceLabel>
      ) : null}

      {viewLayers.moons ? (
        <MoonSystem
          isActive={selectedTarget === "jupiter"}
          moons={JUPITER_MOONS}
          parentPosition={TARGET_POSITIONS.jupiter}
          showLabels={viewLayers.labels}
        />
      ) : null}

      <group
        onDoubleClick={targetDoubleClickHandlers.saturn}
        position={TARGET_POSITIONS.saturn}
        scale={selectedTarget === "saturn" ? 1 : 0.64}
      >
        <Saturn
          active={selectedTarget === "saturn"}
          position={[0, 0, 0]}
        />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel
          active={selectedTarget === "saturn"}
          muted={selectedTarget !== "saturn"}
          position={[TARGET_POSITIONS.saturn[0], 1.86, TARGET_POSITIONS.saturn[2]]}
        >
          {labels.saturn}
        </SpaceLabel>
      ) : null}

      {viewLayers.moons ? (
        <MoonSystem
          isActive={selectedTarget === "saturn"}
          moons={SATURN_MOONS}
          parentPosition={TARGET_POSITIONS.saturn}
          showLabels={viewLayers.labels}
        />
      ) : null}

      <group
        onDoubleClick={targetDoubleClickHandlers.uranus}
        position={TARGET_POSITIONS.uranus}
        scale={selectedTarget === "uranus" ? 1 : 0.68}
      >
        <Uranus
          active={selectedTarget === "uranus"}
          position={[0, 0, 0]}
        />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel
          active={selectedTarget === "uranus"}
          muted={selectedTarget !== "uranus"}
          position={[TARGET_POSITIONS.uranus[0], 1.42, TARGET_POSITIONS.uranus[2]]}
        >
          {labels.uranus}
        </SpaceLabel>
      ) : null}

      {viewLayers.moons ? (
        <MoonSystem
          isActive={selectedTarget === "uranus"}
          moons={URANUS_MOONS}
          parentPosition={TARGET_POSITIONS.uranus}
          showLabels={viewLayers.labels}
        />
      ) : null}

      <group
        onDoubleClick={targetDoubleClickHandlers.neptune}
        position={TARGET_POSITIONS.neptune}
        scale={selectedTarget === "neptune" ? 1 : 0.7}
      >
        <Neptune
          active={selectedTarget === "neptune"}
          position={[0, 0, 0]}
        />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel
          active={selectedTarget === "neptune"}
          muted={selectedTarget !== "neptune"}
          position={[
            TARGET_POSITIONS.neptune[0],
            1.46,
            TARGET_POSITIONS.neptune[2],
          ]}
        >
          {labels.neptune}
        </SpaceLabel>
      ) : null}

      {viewLayers.moons ? (
        <MoonSystem
          isActive={selectedTarget === "neptune"}
          moons={NEPTUNE_MOONS}
          parentPosition={TARGET_POSITIONS.neptune}
          showLabels={viewLayers.labels}
        />
      ) : null}

      <group
        onDoubleClick={targetDoubleClickHandlers.pluto}
        position={TARGET_POSITIONS.pluto}
        scale={selectedTarget === "pluto" ? 1.12 : 0.92}
      >
        <Pluto active={selectedTarget === "pluto"} position={[0, 0, 0]} />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel
          active={selectedTarget === "pluto"}
          muted={selectedTarget !== "pluto"}
          position={[TARGET_POSITIONS.pluto[0], 0.78, TARGET_POSITIONS.pluto[2]]}
        >
          {labels.pluto}
        </SpaceLabel>
      ) : null}
    </group>
  );
}

function ProbeLayer() {
  return (
    <group>
      <ProbeMarker color="#fbbf24" label="Parker Solar Probe" position={[2.15, 0.5, -2.35]} />
      <ProbeMarker color="#60a5fa" label="Voyager 1" position={[40.2, 1.1, -24.2]} />
      <ProbeMarker color="#93c5fd" label="Europa Clipper" position={[-16.1, 0.8, 11.2]} />
      <ProbeMarker color="#f97316" label="Perseverance" position={[9.4, 0.68, -6.0]} />
      <ProbeMarker color="#fda4af" label="Tianwen-1" position={[10.85, 0.74, -7.8]} />
      <ProbeMarker color="#c4b5fd" label="Lucy" position={[14.6, 0.7, 3.5]} />
      <ProbeMarker color="#bfdbfe" label="Juno" position={[-15.9, 1.04, 8.2]} />
    </group>
  );
}

function CameraRig({
  cameraCommand,
  cameraMode,
  controlSensitivity,
  controlsRef,
  lockBehavior,
  onNearestTargetChange,
  selectedTarget,
  userControlVersionRef,
  viewMode,
}: {
  cameraCommand: CameraCommand;
  cameraMode: CameraMode;
  controlSensitivity: ControlSensitivity;
  controlsRef: RefObject<OrbitControlsHandle | null>;
  lockBehavior: LockBehavior;
  onNearestTargetChange: (target: SelectedTarget) => void;
  selectedTarget: SelectedTarget;
  userControlVersionRef: { current: number };
  viewMode: ViewMode;
}) {
  const { camera } = useThree();
  const autoFlightActiveRef = useRef(false);
  const commandFlightActiveRef = useRef(false);
  const initializedRef = useRef(false);
  const lastCameraCommandNonceRef = useRef<number | null>(null);
  const lastCameraModeRef = useRef<CameraMode>(cameraMode);
  const lastNearestTargetRef = useRef<SelectedTarget>(selectedTarget);
  const lastSelectedTargetRef = useRef<SelectedTarget>(selectedTarget);
  const lastUserControlVersionRef = useRef(0);
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const freeMovementVector = useMemo(() => new Vector3(), []);
  const freeForwardVector = useMemo(() => new Vector3(), []);
  const freeRightVector = useMemo(() => new Vector3(), []);
  const targetPlanetPosition = useMemo(() => new Vector3(), []);
  const commandTargetPosition = useMemo(() => new Vector3(), []);
  const targetCameraPosition = useMemo(() => new Vector3(), []);
  const commandCameraPosition = useMemo(() => new Vector3(), []);
  const overviewCameraPosition = useMemo(() => new Vector3(), []);

  useEffect(() => {
    const pressedKeys = pressedKeysRef.current;

    function isEditableTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;

      return (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      );
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (
        cameraMode === "free" &&
        KEYBOARD_NAVIGATION_KEYS.has(event.code) &&
        !isEditableTarget(event.target)
      ) {
        event.preventDefault();
        pressedKeys.add(event.code);
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      pressedKeys.delete(event.code);
    }

    function clearKeys() {
      pressedKeys.clear();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearKeys);

    return () => {
      pressedKeys.clear();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearKeys);
    };
  }, [cameraMode]);

  useFrame((_, delta) => {
    const [x, y, z] = TARGET_POSITIONS[selectedTarget];
    const targetLerpFactor = 1 - Math.exp(-delta * 5.8);
    const flightLerpFactor = 1 - Math.exp(-delta * 2.4);
    const sensitivityMultiplier = SENSITIVITY_MULTIPLIERS[controlSensitivity];

    targetPlanetPosition.set(x, y, z);
    const nearestTarget = getNearestTarget(camera.position);

    if (lastNearestTargetRef.current !== nearestTarget) {
      lastNearestTargetRef.current = nearestTarget;
      onNearestTargetChange(nearestTarget);
    }

    if (!initializedRef.current) {
      initializedRef.current = true;
      onNearestTargetChange(nearestTarget);
      camera.lookAt(targetPlanetPosition);

      if (controlsRef.current) {
        controlsRef.current.target.copy(targetPlanetPosition);
        controlsRef.current.update();
      }
    }

    if (lastSelectedTargetRef.current !== selectedTarget) {
      lastSelectedTargetRef.current = selectedTarget;
      lastUserControlVersionRef.current = userControlVersionRef.current;
      autoFlightActiveRef.current =
        cameraMode === "locked" && lockBehavior === "fly";
    }

    if (lastCameraModeRef.current !== cameraMode) {
      lastCameraModeRef.current = cameraMode;
      lastUserControlVersionRef.current = userControlVersionRef.current;
      autoFlightActiveRef.current =
        cameraMode === "locked" && lockBehavior === "fly";
    }

    if (lastUserControlVersionRef.current !== userControlVersionRef.current) {
      lastUserControlVersionRef.current = userControlVersionRef.current;
      autoFlightActiveRef.current = false;
      commandFlightActiveRef.current = false;
    }

    if (
      cameraCommand &&
      lastCameraCommandNonceRef.current !== cameraCommand.nonce
    ) {
      lastCameraCommandNonceRef.current = cameraCommand.nonce;
      lastUserControlVersionRef.current = userControlVersionRef.current;
      autoFlightActiveRef.current = false;

      if (cameraCommand.type === "zoomIn" || cameraCommand.type === "zoomOut") {
        applyZoomCommand({
          camera,
          controls: controlsRef.current,
          direction: cameraCommand.type,
          minDistance: getMinCameraDistance(selectedTarget),
          targetPosition: targetPlanetPosition,
        });
        commandFlightActiveRef.current = false;
      } else {
        const isSolarSystemOverview =
          cameraCommand.type === "solarSystemOverview";
        if (isSolarSystemOverview) {
          commandTargetPosition.set(0, 0, 0);
        } else {
          commandTargetPosition.copy(targetPlanetPosition);
        }

        if (controlsRef.current) {
          controlsRef.current.target.copy(commandTargetPosition);
          controlsRef.current.update();
        }
        if (isSolarSystemOverview) {
          overviewCameraPosition.set(58, 42, 92);
        } else {
          overviewCameraPosition.set(
            viewMode === "celestial-sphere" ? 58 : 42,
            viewMode === "celestial-sphere" ? 38 : 26,
            viewMode === "celestial-sphere" ? 92 : 70,
          );
        }
        commandCameraPosition.copy(
          getCameraCommandPosition({
            command: cameraCommand.type,
            selectedTarget,
            targetPosition: commandTargetPosition,
            overviewPosition: overviewCameraPosition,
          }),
        );
        commandFlightActiveRef.current = true;
      }
    }

    if (commandFlightActiveRef.current) {
      camera.position.lerp(commandCameraPosition, flightLerpFactor);

      if (camera.position.distanceTo(commandCameraPosition) < 0.08) {
        commandFlightActiveRef.current = false;
      }
    }

    if (
      cameraMode === "locked" &&
      autoFlightActiveRef.current &&
      !commandFlightActiveRef.current
    ) {
      targetCameraPosition
        .copy(targetPlanetPosition)
        .add(CAMERA_OFFSETS[selectedTarget]);
      camera.position.lerp(targetCameraPosition, flightLerpFactor);

      if (camera.position.distanceTo(targetCameraPosition) < 0.08) {
        autoFlightActiveRef.current = false;
      }
    }

    if (controlsRef.current) {
      controlsRef.current.dampingFactor = 0.055;

      if (cameraMode === "locked") {
        const distanceToTarget = camera.position.distanceTo(targetPlanetPosition);

        controlsRef.current.enablePan = false;
        controlsRef.current.maxDistance = MAX_CAMERA_DISTANCE;
        controlsRef.current.minDistance = getMinCameraDistance(selectedTarget);
        controlsRef.current.panSpeed = 0.65;
        controlsRef.current.rotateSpeed = 0.5 * sensitivityMultiplier;
        controlsRef.current.zoomSpeed =
          getDynamicZoomSpeed(distanceToTarget) * sensitivityMultiplier;
        controlsRef.current.target.lerp(targetPlanetPosition, targetLerpFactor);
      } else {
        const freeDistance = camera.position.distanceTo(controlsRef.current.target);
        const freeDistanceScale = clamp(freeDistance / 10, 0.12, 1.25);
        const freeRotateScale = clamp(freeDistance / 8, 0.34, 1);
        const freeZoomScale = clamp(freeDistance / 8, 0.42, 1.25);

        applyFreeKeyboardMovement({
          camera,
          controls: controlsRef.current,
          delta,
          forwardVector: freeForwardVector,
          movementScale: freeDistanceScale * sensitivityMultiplier,
          movementVector: freeMovementVector,
          pressedKeys: pressedKeysRef.current,
          rightVector: freeRightVector,
        });

        controlsRef.current.enablePan = true;
        controlsRef.current.maxDistance = MAX_FREE_CAMERA_DISTANCE;
        controlsRef.current.minDistance = 0.28;
        controlsRef.current.panSpeed =
          0.74 * freeDistanceScale * sensitivityMultiplier;
        controlsRef.current.rotateSpeed =
          0.48 * freeRotateScale * sensitivityMultiplier;
        controlsRef.current.zoomSpeed =
          1.7 * freeZoomScale * sensitivityMultiplier;
      }

      controlsRef.current.update();
    } else {
      camera.lookAt(targetPlanetPosition);
    }
  });

  return null;
}

function getNearestTarget(position: Vector3) {
  let nearestTarget: SelectedTarget = "earth";
  let nearestDistance = Number.POSITIVE_INFINITY;

  LOCKABLE_TARGETS.forEach((target) => {
    const [x, y, z] = TARGET_POSITIONS[target];
    const deltaX = position.x - x;
    const deltaY = position.y - y;
    const deltaZ = position.z - z;
    const distance =
      deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestTarget = target;
    }
  });

  return nearestTarget;
}

function getCameraCommandPosition({
  command,
  overviewPosition,
  selectedTarget,
  targetPosition,
}: {
  command: Exclude<CameraCommandType, "zoomIn" | "zoomOut">;
  overviewPosition: Vector3;
  selectedTarget: SelectedTarget;
  targetPosition: Vector3;
}) {
  if (command === "overview" || command === "solarSystemOverview") {
    return overviewPosition;
  }

  const offset = CAMERA_OFFSETS[selectedTarget];
  const scale = command === "close" ? getCloseCameraScale(selectedTarget) : 1;

  return new Vector3()
    .copy(targetPosition)
    .addScaledVector(offset, scale);
}

function applyZoomCommand({
  camera,
  controls,
  direction,
  minDistance,
  targetPosition,
}: {
  camera: Camera;
  controls: OrbitControlsHandle | null;
  direction: "zoomIn" | "zoomOut";
  minDistance: number;
  targetPosition: Vector3;
}) {
  const focusPoint = controls?.target ?? targetPosition;
  const distance = camera.position.distanceTo(focusPoint);
  const nextDistance =
    direction === "zoomIn"
      ? Math.max(distance * 0.68, minDistance)
      : Math.min(distance * 1.46, MAX_FREE_CAMERA_DISTANCE);
  const directionVector = new Vector3().subVectors(camera.position, focusPoint);

  if (directionVector.lengthSq() === 0) {
    directionVector.set(0, 0.4, 1);
  }

  directionVector.normalize();
  camera.position.copy(focusPoint).addScaledVector(directionVector, nextDistance);
  controls?.update();
}

function getCloseCameraScale(target: SelectedTarget) {
  if (target === "asteroid-belt") return 0.62;
  if (target === "kuiper-belt") return 0.74;
  if (target === "sun") return 0.72;
  if (target === "mercury") return 0.52;
  if (target === "venus") return 0.58;
  if (target === "moon") return 0.58;
  if (target === "ceres") return 0.72;
  if (target === "jupiter") return 0.62;
  if (target === "saturn") return 0.7;
  if (target === "uranus") return 0.66;
  if (target === "neptune") return 0.66;
  if (target === "pluto") return 0.74;
  return 0.55;
}

function applyFreeKeyboardMovement({
  camera,
  controls,
  delta,
  forwardVector,
  movementScale,
  movementVector,
  pressedKeys,
  rightVector,
}: {
  camera: Camera;
  controls: OrbitControlsHandle;
  delta: number;
  forwardVector: Vector3;
  movementScale: number;
  movementVector: Vector3;
  pressedKeys: Set<string>;
  rightVector: Vector3;
}) {
  const forwardIntent =
    (pressedKeys.has("ArrowUp") || pressedKeys.has("KeyW") ? 1 : 0) -
    (pressedKeys.has("ArrowDown") || pressedKeys.has("KeyS") ? 1 : 0);
  const strafeIntent =
    (pressedKeys.has("ArrowRight") || pressedKeys.has("KeyD") ? 1 : 0) -
    (pressedKeys.has("ArrowLeft") || pressedKeys.has("KeyA") ? 1 : 0);

  if (forwardIntent === 0 && strafeIntent === 0) return;

  camera.getWorldDirection(forwardVector);
  rightVector.crossVectors(forwardVector, camera.up).normalize();
  movementVector.set(0, 0, 0);
  movementVector.addScaledVector(forwardVector, forwardIntent);
  movementVector.addScaledVector(rightVector, strafeIntent);

  if (movementVector.lengthSq() === 0) return;

  const speedMultiplier =
    pressedKeys.has("ShiftLeft") || pressedKeys.has("ShiftRight")
      ? 2.1
      : pressedKeys.has("AltLeft") || pressedKeys.has("AltRight")
        ? 0.4
        : 1;

  movementVector
    .normalize()
    .multiplyScalar(
      FREE_KEYBOARD_MOVE_SPEED * movementScale * speedMultiplier * delta,
    );
  camera.position.add(movementVector);
  controls.target.add(movementVector);
}

function getMinCameraDistance(target: SelectedTarget) {
  const radiusDistance = TARGET_RADII[target] * 2.2;

  if (target === "sun") return Math.max(radiusDistance, 3.2);
  if (target === "mercury") return Math.max(radiusDistance, 0.58);
  if (target === "venus") return Math.max(radiusDistance, 0.95);
  if (target === "moon") return Math.max(radiusDistance, 0.82);
  if (target === "ceres") return Math.max(radiusDistance, 1.28);
  if (target === "asteroid-belt") return 10;
  if (target === "kuiper-belt") return 32;
  if (target === "saturn") return Math.max(radiusDistance, 5.4);
  if (target === "uranus" || target === "neptune") {
    return Math.max(radiusDistance, 1.85);
  }
  if (target === "pluto") return Math.max(radiusDistance, 1.36);

  return Math.max(radiusDistance, 1.35);
}

function getDynamicZoomSpeed(distanceToTarget: number) {
  if (distanceToTarget > 80) return 2.7;
  if (distanceToTarget > 40) return 2.55;
  if (distanceToTarget > 28) return 2.45;
  if (distanceToTarget > 12) return 2.18;
  if (distanceToTarget > 5) return 1.95;
  return 1.68;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function DeepSpaceDust() {
  const geometry = useMemo(() => {
    const points: number[] = [];
    const count = 360;

    for (let index = 0; index < count; index += 1) {
      const radius = 18 + seededUnit(index * 3 + 1) * 58;
      const angle = seededUnit(index * 3 + 2) * Math.PI * 2;
      const height = -8 + seededUnit(index * 3 + 3) * 16;
      points.push(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
    }

    const dustGeometry = new BufferGeometry();
    dustGeometry.setAttribute("position", new Float32BufferAttribute(points, 3));
    return dustGeometry;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        blending={AdditiveBlending}
        color="#64748b"
        opacity={0.18}
        size={0.045}
        transparent
      />
    </points>
  );
}

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}
