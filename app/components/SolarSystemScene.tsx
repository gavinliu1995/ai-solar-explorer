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
import type { Camera, Mesh, Texture } from "three";
import Earth from "./celestial/Earth";
import Jupiter from "./celestial/Jupiter";
import Mars from "./celestial/Mars";
import Moon from "./celestial/Moon";
import Saturn from "./celestial/Saturn";
import Sun from "./celestial/Sun";
import Venus from "./celestial/Venus";
import { createMercuryTexture } from "./celestial/textureUtils";
import { useOptionalTexture } from "./celestial/useOptionalTexture";
import OrbitLine from "./scene/OrbitLine";
import ProbeMarker from "./scene/ProbeMarker";
import SpaceLabel from "./scene/SpaceLabel";
import type {
  CameraCommand,
  CameraCommandType,
  CameraMode,
  ControlSensitivity,
  ExplorationPoint,
  Language,
  LockBehavior,
  SelectedTarget,
  ViewLayerState,
} from "@/app/types/space";
import { TARGET_LABELS_LOCALIZED, TARGET_POSITIONS } from "@/app/types/space";

type SolarSystemSceneProps = {
  cameraCommand: CameraCommand;
  cameraMode: CameraMode;
  controlSensitivity: ControlSensitivity;
  explorationPoint: ExplorationPoint;
  language: Language;
  lockBehavior: LockBehavior;
  onLockTarget: (target: SelectedTarget) => void;
  onNearestTargetChange: (target: SelectedTarget) => void;
  selectedTarget: SelectedTarget;
  setExplorationPoint: (point: ExplorationPoint) => void;
  viewLayers: ViewLayerState;
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

const SELECTABLE_TARGETS: SelectedTarget[] = [
  "earth",
  "moon",
  "mars",
  "jupiter",
  "saturn",
];

const MERCURY_POSITION: [number, number, number] = [3.6, 0, 0.62];
const VENUS_POSITION: [number, number, number] = [5.8, 0, -0.92];
const INITIAL_EARTH_CAMERA_POSITION: [number, number, number] = [7.25, 1.42, 4.18];

const ORBITS: OrbitSpec[] = [
  { color: "#8b8fa3", opacity: 0.052, radiusX: 3.7, radiusZ: 3.25, rotationY: 0.08 },
  { color: "#eabf73", opacity: 0.06, radiusX: 5.95, radiusZ: 5.25, rotationY: -0.1 },
  { color: "#38bdf8", opacity: 0.08, radiusX: 8.85, radiusZ: 7.95, rotationY: 0.04, target: "earth" },
  { color: "#fb923c", opacity: 0.06, radiusX: 15.55, radiusZ: 13.7, rotationY: -0.16, target: "mars" },
  { color: "#94a3b8", opacity: 0.052, radiusX: 21.65, radiusZ: 18.75, rotationY: 0.16, target: "jupiter" },
  { color: "#7dd3fc", opacity: 0.048, radiusX: 30.05, radiusZ: 25.8, rotationY: -0.14, target: "saturn" },
];

const CAMERA_OFFSETS: Record<SelectedTarget, Vector3> = {
  earth: new Vector3(-1.55, 1.42, 3.58),
  moon: new Vector3(1.05, 1.04, 2.3),
  mars: new Vector3(1.25, 2.8, 5.25),
  jupiter: new Vector3(1.2, 7.2, 11.5),
  saturn: new Vector3(1.6, 7.7, 12.8),
};

const TARGET_RADII: Record<SelectedTarget, number> = {
  earth: 1.2,
  moon: 0.31,
  mars: 0.72,
  jupiter: 1.28,
  saturn: 2.5,
};

const MAX_CAMERA_DISTANCE = 90;
const MAX_FREE_CAMERA_DISTANCE = 130;
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

export default function SolarSystemScene({
  cameraCommand,
  cameraMode,
  controlSensitivity,
  explorationPoint,
  language,
  lockBehavior,
  onLockTarget,
  onNearestTargetChange,
  selectedTarget,
  setExplorationPoint,
  viewLayers,
}: SolarSystemSceneProps) {
  const controlsRef = useRef<OrbitControlsHandle | null>(null);
  const userControlVersionRef = useRef(0);

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
      <fog attach="fog" args={["#02040a", 18, 92]} />
      <ambientLight intensity={0.2} />
      <pointLight
        color="#ffe7a3"
        distance={120}
        intensity={760}
        position={[0, 0, 0]}
      />

      {viewLayers.stars ? (
        <>
          <Stars
            radius={180}
            depth={80}
            count={5200}
            factor={3.6}
            saturation={0}
            fade
            speed={0.08}
          />
          <Stars
            radius={68}
            depth={34}
            count={620}
            factor={6.2}
            saturation={0.1}
            fade
            speed={0.16}
          />
          <DeepSpaceDust />
        </>
      ) : null}

      <SolarMap
        explorationPoint={explorationPoint}
        language={language}
        onLockTarget={onLockTarget}
        selectedTarget={selectedTarget}
        setExplorationPoint={setExplorationPoint}
        viewLayers={viewLayers}
      />
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
}: {
  explorationPoint: ExplorationPoint;
  language: Language;
  onLockTarget: (target: SelectedTarget) => void;
  selectedTarget: SelectedTarget;
  setExplorationPoint: (point: ExplorationPoint) => void;
  viewLayers: ViewLayerState;
}) {
  const labels = TARGET_LABELS_LOCALIZED[language];
  const targetDoubleClickHandlers = useMemo(
    () =>
      SELECTABLE_TARGETS.reduce(
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
              opacity={orbit.opacity}
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
            opacity={0.05}
            radiusX={1.75}
            radiusZ={1.05}
            rotationY={0.22}
            y={0.02}
          />
        </group>
      ) : null}

      <group scale={0.72}>
        <Sun />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel muted position={[0, 2.85, 0]}>
          {language === "zh" ? "太阳" : "SUN"}
        </SpaceLabel>
      ) : null}

      <SimplePlanet
        color="#8a8f9b"
        emissive="#171923"
        fallbackTextureFactory={createMercuryTexture}
        position={MERCURY_POSITION}
        radius={0.22}
        rotationSpeed={0.18}
        texturePath="/textures/planets/mercury.jpg"
      />
      {viewLayers.labels ? (
        <SpaceLabel muted position={[MERCURY_POSITION[0], 0.82, MERCURY_POSITION[2]]}>
          {language === "zh" ? "水星" : "MERCURY"}
        </SpaceLabel>
      ) : null}

      <group position={VENUS_POSITION} scale={0.72}>
        <Venus position={[0, 0, 0]} />
      </group>
      {viewLayers.labels ? (
        <SpaceLabel muted position={[VENUS_POSITION[0], 1.05, VENUS_POSITION[2]]}>
          {language === "zh" ? "金星" : "VENUS"}
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
    </group>
  );
}

function ProbeLayer() {
  return (
    <group>
      <ProbeMarker color="#fbbf24" label="Parker Solar Probe" position={[2.15, 0.5, -2.35]} />
      <ProbeMarker color="#60a5fa" label="Voyager 1" position={[29.2, 0.9, -8.1]} />
      <ProbeMarker color="#93c5fd" label="Europa Clipper" position={[20.2, 0.8, 4.7]} />
      <ProbeMarker color="#f97316" label="Perseverance" position={[14.1, 0.68, -1.25]} />
      <ProbeMarker color="#fda4af" label="Tianwen-1" position={[12.25, 0.74, -3.12]} />
      <ProbeMarker color="#c4b5fd" label="Lucy" position={[16.4, 0.7, -5.5]} />
      <ProbeMarker color="#bfdbfe" label="Juno" position={[18.15, 1.04, 2.1]} />
    </group>
  );
}

function SimplePlanet({
  color,
  emissive,
  fallbackTextureFactory,
  position,
  radius,
  rotationSpeed,
  texturePath,
}: {
  color: string;
  emissive: string;
  fallbackTextureFactory?: () => Texture;
  position: [number, number, number];
  radius: number;
  rotationSpeed: number;
  texturePath?: string;
}) {
  const meshRef = useRef<Mesh>(null);
  const fallbackTexture = useMemo(
    () => (fallbackTextureFactory ? fallbackTextureFactory() : null),
    [fallbackTextureFactory],
  );
  const localTexture = useOptionalTexture(texturePath ?? "");
  const surfaceTexture = localTexture ?? fallbackTexture;

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 40, 40]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.1}
        map={surfaceTexture ?? undefined}
        roughness={0.82}
      />
    </mesh>
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
}: {
  cameraCommand: CameraCommand;
  cameraMode: CameraMode;
  controlSensitivity: ControlSensitivity;
  controlsRef: RefObject<OrbitControlsHandle | null>;
  lockBehavior: LockBehavior;
  onNearestTargetChange: (target: SelectedTarget) => void;
  selectedTarget: SelectedTarget;
  userControlVersionRef: { current: number };
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
  const targetCameraPosition = useMemo(() => new Vector3(), []);
  const commandCameraPosition = useMemo(() => new Vector3(), []);
  const overviewCameraPosition = useMemo(() => new Vector3(20, 10, 24), []);

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
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetPlanetPosition);
          controlsRef.current.update();
        }
        commandCameraPosition.copy(
          getCameraCommandPosition({
            command: cameraCommand.type,
            selectedTarget,
            targetPosition: targetPlanetPosition,
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

  SELECTABLE_TARGETS.forEach((target) => {
    const [x, y, z] = TARGET_POSITIONS[target];
    const distance = position.distanceTo(new Vector3(x, y, z));

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
  if (command === "overview") {
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
  if (target === "moon") return 0.58;
  if (target === "jupiter") return 0.62;
  if (target === "saturn") return 0.7;
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

  if (target === "moon") return Math.max(radiusDistance, 0.82);
  if (target === "saturn") return Math.max(radiusDistance, 5.4);

  return Math.max(radiusDistance, 1.35);
}

function getDynamicZoomSpeed(distanceToTarget: number) {
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
