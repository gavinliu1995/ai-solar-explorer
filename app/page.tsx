"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import CockpitOverlay from "./components/CockpitOverlay";
import Hud from "./components/Hud";
import {
  getMissionCopy,
  getMissionById,
  getMissionSteps,
  getRecommendedMission,
  MISSIONS,
} from "./data/missions";
import {
  getArchiveMissionById,
  getArchiveMissionCopy,
  getMissionWaypointCopy,
} from "./data/archiveMissions";
import {
  getDiscoveryCardById,
  getScanDiscoveryCardCopy,
} from "./data/discoveryCards";
import { getMissionBadgeById, getMissionBadgeCopy } from "./data/missionBadges";
import { getCaptainRank, getCaptainRankId } from "./data/playerProgress";
import {
  getFlightMissionById,
  getRecommendedFlightMissionForTarget,
} from "./data/flightMissions";
import { SCAN_REWARDS } from "./data/scanRewards";
import { SPACE_OBJECTS } from "./data/spaceObjects";
import { getTourById, getTourCopy, getTourStopCopy } from "./data/tours";
import type {
  ActivePanel,
  ActiveFlightMissionState,
  ArchiveExpeditionMode,
  ArchiveMission,
  ArchiveMissionId,
  CameraCommand,
  CameraCommandType,
  CameraMode,
  ControlMode,
  ControlSensitivity,
  ExperienceMode,
  ExplorationLogEntry,
  ExplorationPoint,
  FlightObjectiveState,
  FlightMission,
  FlightMissionId,
  FlightObjective,
  FlightState,
  HudMode,
  Language,
  LockBehavior,
  Mission,
  MissionBadgeId,
  MissionWaypoint,
  MarsExplorationPoint,
  DiscoveryCardId,
  PlayerProgress,
  SelectedTarget,
  SimMode,
  TourId,
  TourMode,
  TourStop,
  ViewLayerState,
  ViewMode,
} from "./types/space";
import { EXPLORATION_LABELS_LOCALIZED } from "./types/space";

const SolarSystemScene = dynamic(
  () => import("./components/SolarSystemScene"),
  {
    ssr: false,
  },
);

export default function Home() {
  const [selectedTarget, setSelectedTarget] =
    useState<SelectedTarget>("earth");
  const [explorationPoint, setExplorationPoint] =
    useState<ExplorationPoint>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>("locked");
  const [experienceMode, setExperienceMode] =
    useState<ExperienceMode>("mission-control");
  const [controlMode, setControlMode] = useState<ControlMode>("orbit");
  const [flightState, setFlightState] = useState<FlightState>({
    approachZone: false,
    autopilotProgress: 0,
    distanceToTarget: null,
    etaSeconds: null,
    isScanning: false,
    proximityWarning: false,
    scanAligned: false,
    scanAvailable: false,
    scanInRange: false,
    scanProgress: 0,
    speed: 0,
    targetBearingX: 0,
    targetBearingY: 0,
    targetCentered: false,
    throttle: 0,
  });
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>({
    captainTitles: [],
    completedFlightMissionIds: [],
    flightXp: 0,
    researchCredits: 0,
    scannedTargetIds: [],
    unlockedBadgeIds: [],
    unlockedDiscoveryCardIds: [],
  });
  const [activeFlightObjective, setActiveFlightObjective] =
    useState<FlightObjectiveState | null>(null);
  const [activeFlightMission, setActiveFlightMission] =
    useState<ActiveFlightMissionState | null>(null);
  const [language, setLanguage] = useState<Language>("zh");
  const [nearestTarget, setNearestTarget] = useState<SelectedTarget>("earth");
  const [lockBehavior, setLockBehavior] = useState<LockBehavior>("fly");
  const [controlSensitivity, setControlSensitivity] =
    useState<ControlSensitivity>("normal");
  const [hudMode, setHudMode] = useState<HudMode>("full");
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(
    null,
  );
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);
  const [activePanel, setActivePanel] = useState<ActivePanel>("info");
  const [detailOpen, setDetailOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [viewLayers, setViewLayers] = useState<ViewLayerState>({
    asteroidBelt: true,
    constellations: false,
    ecliptic: false,
    kuiperBelt: true,
    labels: true,
    missionRoutes: true,
    moons: true,
    orbits: true,
    probes: true,
    stars: true,
    zodiac: false,
  });
  const [viewMode, setViewMode] = useState<ViewMode>("solar-system");
  const [simMode, setSimMode] = useState<SimMode>("CRUISE MODE");
  const [cameraCommand, setCameraCommand] = useState<CameraCommand>(null);
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const [missionStepIndex, setMissionStepIndex] = useState(0);
  const [explorationLog, setExplorationLog] = useState<ExplorationLogEntry[]>(
    [],
  );
  const [activeTourId, setActiveTourId] = useState<TourId | null>(null);
  const [activeTourStopIndex, setActiveTourStopIndex] = useState(0);
  const [completedTourStopIds, setCompletedTourStopIds] = useState<string[]>(
    [],
  );
  const [tourPanelOpen, setTourPanelOpen] = useState(false);
  const [tourMode, setTourMode] = useState<TourMode>("idle");
  const [selectedArchiveMissionId, setSelectedArchiveMissionId] =
    useState<ArchiveMissionId | null>(null);
  const [currentArchiveWaypointIndex, setCurrentArchiveWaypointIndex] =
    useState(0);
  const [archivePanelOpen, setArchivePanelOpen] = useState(false);
  const [archiveExpeditionMode, setArchiveExpeditionMode] =
    useState<ArchiveExpeditionMode>("idle");
  const cameraCommandNonceRef = useRef(0);
  const lastLoggedTargetRef = useRef<SelectedTarget>("earth");
  const exitCockpitHandlerRef = useRef<() => void>(() => undefined);
  const startScanHandlerRef = useRef<() => void>(() => undefined);
  const scanIntervalRef = useRef<number | null>(null);
  const scanTimeoutRef = useRef<number | null>(null);
  const playerProgressRef = useRef<PlayerProgress>(playerProgress);
  const activeFlightObjectiveRef = useRef<FlightObjectiveState | null>(
    activeFlightObjective,
  );
  const activeFlightMissionRef = useRef<ActiveFlightMissionState | null>(
    activeFlightMission,
  );
  const flightObjectiveActivatedAtRef = useRef(Date.now());
  const flightMissionProgressTickRef = useRef(Date.now());
  const activeTour = getTourById(activeTourId);
  const currentTourStop = activeTour?.stops[activeTourStopIndex] ?? null;
  const selectedArchiveMission = getArchiveMissionById(selectedArchiveMissionId);
  const currentArchiveWaypoint =
    selectedArchiveMission?.waypoints[currentArchiveWaypointIndex] ?? null;

  const clearScanTimers = useCallback(() => {
    if (scanIntervalRef.current !== null) {
      window.clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (scanTimeoutRef.current !== null) {
      window.clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const hasSeenWelcome = window.localStorage.getItem(
      "argonaut-v02-welcome-seen",
    );
    if (hasSeenWelcome === "true") {
      const timeout = window.setTimeout(() => setWelcomeOpen(false), 0);
      return () => window.clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    if (!shareToast) return;

    const timeout = window.setTimeout(() => {
      setShareToast(null);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [shareToast]);

  useEffect(() => {
    return () => {
      clearScanTimers();
    };
  }, [clearScanTimers]);

  useEffect(() => {
    exitCockpitHandlerRef.current = handleExitCockpit;
    startScanHandlerRef.current = handleStartScan;
  });

  useEffect(() => {
    playerProgressRef.current = playerProgress;
  }, [playerProgress]);

  useEffect(() => {
    activeFlightObjectiveRef.current = activeFlightObjective;
  }, [activeFlightObjective]);

  useEffect(() => {
    activeFlightMissionRef.current = activeFlightMission;
  }, [activeFlightMission]);

  useEffect(() => {
    if (experienceMode !== "cockpit") return;

    function isEditableTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;

      return (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      );
    }

    function handleCockpitKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target) || searchOpen || menuOpen) return;

      if (event.code === "Escape") {
        event.preventDefault();
        exitCockpitHandlerRef.current();
        return;
      }

      if (event.code === "KeyF") {
        event.preventDefault();
        issueCameraCommand("close");
        return;
      }

      if (event.code === "KeyX") {
        event.preventDefault();
        startScanHandlerRef.current();
      }
    }

    window.addEventListener("keydown", handleCockpitKeyDown);
    return () => window.removeEventListener("keydown", handleCockpitKeyDown);
  }, [experienceMode, menuOpen, searchOpen]);

  function issueCameraCommand(type: CameraCommandType) {
    cameraCommandNonceRef.current += 1;
    setCameraCommand({ type, nonce: cameraCommandNonceRef.current });
  }

  function showToast(message: string) {
    setShareToast(message);
  }

  function addCaptainLog(
    refId: string,
    message: string,
    type: ExplorationLogEntry["type"],
  ) {
    const timestamp = new Date().toLocaleTimeString(
      language === "zh" ? "zh-CN" : "en-US",
      {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      },
    );

    setExplorationLog((currentLog) => [
      {
        id: `${refId}-${type}-${Date.now()}`,
        message,
        refId,
        timestamp,
        type,
      },
      ...currentLog,
    ]);
  }

  function mergeUnique<T extends string>(currentItems: T[], nextItems: T[]) {
    return Array.from(new Set([...currentItems, ...nextItems]));
  }

  function getRewardToast(
    target: SelectedTarget,
    cardIds: DiscoveryCardId[],
    badgeIds: MissionBadgeId[],
    xp: number,
    credits: number,
  ) {
    const firstCard = cardIds
      .map((cardId) => getDiscoveryCardById(cardId))
      .find((card) => card !== null);
    const firstBadge = badgeIds
      .map((badgeId) => getMissionBadgeById(badgeId))
      .find((badge) => badge !== null);
    const targetName = SPACE_OBJECTS[target].name[language];
    const cardCopy = firstCard
      ? getScanDiscoveryCardCopy(firstCard, language)
      : null;
    const badgeCopy = firstBadge
      ? getMissionBadgeCopy(firstBadge, language)
      : null;

    if (language === "zh") {
      return [
        `扫描完成：${targetName}`,
        cardCopy ? `发现解锁：${cardCopy.title}` : null,
        `+${xp} Flight XP`,
        `+${credits} 研究点数`,
        badgeCopy ? `徽章解锁：${badgeCopy.title}` : null,
      ]
        .filter(Boolean)
        .join(" · ");
    }

    return [
      `Scan complete: ${targetName}`,
      cardCopy ? `Discovery unlocked: ${cardCopy.title}` : null,
      `+${xp} Flight XP`,
      `+${credits} Research Credits`,
      badgeCopy ? `Badge unlocked: ${badgeCopy.title}` : null,
    ]
      .filter(Boolean)
      .join(" · ");
  }

  function grantScanReward(target: SelectedTarget) {
    const currentProgress = playerProgressRef.current;

    if (currentProgress.scannedTargetIds.includes(target)) {
      completeFlightObjective(target);
      completeActiveFlightMissionObjective("scan", target);
      showToast(
        language === "zh"
          ? `${SPACE_OBJECTS[target].name.zh} 已扫描，奖励不会重复发放`
          : `${SPACE_OBJECTS[target].name.en} already scanned. Rewards are not repeated.`,
      );
      return;
    }

    const reward = SCAN_REWARDS[target];
    const xp = reward.xp ?? 0;
    const credits = reward.researchCredits ?? 0;
    const discoveryCardIds = reward.discoveryCardIds ?? [];
    const badgeIds = reward.badgeIds ?? [];
    const newDiscoveryCardIds = discoveryCardIds.filter(
      (cardId) => !currentProgress.unlockedDiscoveryCardIds.includes(cardId),
    );
    const newBadgeIds = badgeIds.filter(
      (badgeId) => !currentProgress.unlockedBadgeIds.includes(badgeId),
    );
    const previousRankId = getCaptainRankId(currentProgress.flightXp);
    const nextFlightXp = currentProgress.flightXp + xp;
    const nextRankId = getCaptainRankId(nextFlightXp);
    const nextCaptainTitles =
      previousRankId === nextRankId
        ? currentProgress.captainTitles
        : mergeUnique(currentProgress.captainTitles, [nextRankId]);
    const nextProgress: PlayerProgress = {
      ...currentProgress,
      captainTitles: nextCaptainTitles,
      flightXp: nextFlightXp,
      researchCredits: currentProgress.researchCredits + credits,
      scannedTargetIds: [...currentProgress.scannedTargetIds, target],
      selectedCaptainTitle:
        previousRankId === nextRankId
          ? currentProgress.selectedCaptainTitle
          : nextRankId,
      unlockedBadgeIds: mergeUnique(
        currentProgress.unlockedBadgeIds,
        badgeIds,
      ),
      unlockedDiscoveryCardIds: mergeUnique(
        currentProgress.unlockedDiscoveryCardIds,
        discoveryCardIds,
      ),
    };

    playerProgressRef.current = nextProgress;
    setPlayerProgress(nextProgress);

    newDiscoveryCardIds.forEach((cardId) => {
      const card = getDiscoveryCardById(cardId);
      if (!card) return;

      addCaptainLog(
        cardId,
        language === "zh"
          ? `发现解锁 — ${getScanDiscoveryCardCopy(card, language).title}。`
          : `DISCOVERY UNLOCKED — ${getScanDiscoveryCardCopy(card, language).title}.`,
        "discovery_unlocked",
      );
    });

    if (xp > 0 || credits > 0) {
      addCaptainLog(
        target,
        language === "zh"
          ? `奖励发放 — +${xp} XP，+${credits} 研究点数。`
          : `REWARD GRANTED — +${xp} XP, +${credits} Research Credits.`,
        "reward_granted",
      );
    }

    newBadgeIds.forEach((badgeId) => {
      const badge = getMissionBadgeById(badgeId);
      if (!badge) return;

      addCaptainLog(
        badgeId,
        language === "zh"
          ? `徽章解锁 — ${getMissionBadgeCopy(badge, language).title}。`
          : `BADGE UNLOCKED — ${getMissionBadgeCopy(badge, language).title}.`,
        "badge_unlocked",
      );
    });

    if (previousRankId !== nextRankId) {
      addCaptainLog(
        nextRankId,
        language === "zh"
          ? `等级更新 — ${getCaptainRank(nextFlightXp, language)}。`
          : `RANK UPDATED — ${getCaptainRank(nextFlightXp, language)}.`,
        "rank_updated",
      );
    }

    showToast(
      getRewardToast(target, newDiscoveryCardIds, newBadgeIds, xp, credits),
    );
    completeFlightObjective(target);
    completeActiveFlightMissionObjective("scan", target);
  }

  function getFlightObjectiveDescription(objective: FlightObjective) {
    return objective.instruction[language];
  }

  function createFlightObjectiveState(
    mission: FlightMission,
    objectiveIndex: number,
    progress = 0,
    completed = false,
  ): FlightObjectiveState {
    const objective = mission.objectives[objectiveIndex];
    const target = objective.target ?? mission.target;

    return {
      completed,
      description: getFlightObjectiveDescription(objective),
      id: `${mission.id}-${objective.id}`,
      progress,
      target,
      title: objective.title[language],
      type: objective.type,
    };
  }

  function applyFlightObjectiveTarget(mission: FlightMission, objectiveIndex: number) {
    const objective = mission.objectives[objectiveIndex];
    const target = objective.target ?? mission.target;

    setSelectedTarget(target);
    resetScanForTarget(target);
    setExplorationPoint(null);
    setCameraMode("free");
    setLockBehavior("fly");
    recordTargetLocked(target, `${mission.id}-${objective.id}`);
    if (objective.type !== "route-waypoint") {
      issueCameraCommand(objective.type === "fly-through" ? "focus" : "close");
    }
  }

  function startFlightMission(missionId: FlightMissionId) {
    const mission = getFlightMissionById(missionId);
    if (!mission) return;

    const firstObjective = mission.objectives[0];
    const firstTarget = firstObjective.target ?? mission.target;
    const initialFlightMission: ActiveFlightMissionState = {
      completedObjectiveIds: [],
      corridorSeconds: 0,
      missionId: mission.id,
      objectiveIndex: 0,
      objectiveProgress: 0,
    };

    setActiveFlightMission(initialFlightMission);
    const objectiveState = createFlightObjectiveState(mission, 0);
    activeFlightMissionRef.current = initialFlightMission;
    flightObjectiveActivatedAtRef.current = Date.now();
    activeFlightObjectiveRef.current = objectiveState;
    setActiveFlightObjective(objectiveState);
    setSelectedTarget(firstTarget);
    resetScanForTarget(firstTarget);
    setExplorationPoint(null);
    setSelectedMissionId(null);
    setMissionStepIndex(0);
    setExperienceMode("cockpit");
    setControlMode("free-flight");
    setCameraMode("free");
    setLockBehavior("fly");
    setHudMode("minimal");
    setActivePanel("missions");
    setMenuOpen(false);
    setSearchOpen(false);
    setDetailOpen(false);
    setWelcomeOpen(false);
    setViewLayers((currentLayers) => ({
      ...currentLayers,
      ...(mission.recommendedLayers ?? {}),
    }));
    if (firstObjective.type !== "route-waypoint") {
      issueCameraCommand("close");
    }
    recordTargetLocked(firstTarget, mission.id);
    addCaptainLog(
      mission.id,
      language === "zh"
        ? `飞行任务启动 — ${mission.title.zh}。`
        : `FLIGHT MISSION STARTED — ${mission.title.en}.`,
      "flight_mission_started",
    );
    showToast(
      language === "zh"
        ? `飞行任务已启动：${mission.title.zh}`
        : `Flight mission started: ${mission.title.en}`,
    );
  }

  function startRecommendedFlightMission() {
    const recommendedFlightMission =
      getRecommendedFlightMissionForTarget(selectedTarget);

    if (!recommendedFlightMission) {
      startFlightObjective(selectedTarget);
      return;
    }

    startFlightMission(recommendedFlightMission.id);
  }

  function cancelFlightMission() {
    const mission = getFlightMissionById(activeFlightMissionRef.current?.missionId ?? null);
    if (!mission) {
      setActiveFlightMission(null);
      setActiveFlightObjective(null);
      activeFlightMissionRef.current = null;
      activeFlightObjectiveRef.current = null;
      return;
    }

    setActiveFlightMission(null);
    setActiveFlightObjective(null);
    activeFlightMissionRef.current = null;
    activeFlightObjectiveRef.current = null;
    addCaptainLog(
      mission.id,
      language === "zh"
        ? `飞行任务取消 — ${mission.title.zh}。`
        : `FLIGHT MISSION CANCELLED — ${mission.title.en}.`,
      "flight_mission_cancelled",
    );
    showToast(
      language === "zh" ? "飞行任务已取消" : "Flight mission cancelled",
    );
  }

  function completeActiveFlightMissionObjective(
    expectedType?: FlightObjective["type"],
    expectedTarget?: SelectedTarget,
  ) {
    const state = activeFlightMissionRef.current;
    if (!state) return;

    const mission = getFlightMissionById(state.missionId);
    if (!mission) return;

    const objective = mission.objectives[state.objectiveIndex];
    if (!objective) return;

    const objectiveTarget = objective.target ?? mission.target;
    if (expectedType && objective.type !== expectedType) return;
    if (expectedTarget && objectiveTarget !== expectedTarget) return;
    if (state.completedObjectiveIds.includes(objective.id)) return;

    const nextCompletedObjectiveIds = [
      ...state.completedObjectiveIds,
      objective.id,
    ];
    addCaptainLog(
      `${mission.id}-${objective.id}`,
      language === "zh"
        ? `目标步骤完成 — ${objective.title.zh}。`
        : `OBJECTIVE COMPLETE — ${objective.title.en}.`,
      "flight_objective_completed",
    );

    const finalObjective = state.objectiveIndex >= mission.objectives.length - 1;
    if (finalObjective) {
      completeFlightMission(mission);
      return;
    }

    const nextState: ActiveFlightMissionState = {
      ...state,
      completedObjectiveIds: nextCompletedObjectiveIds,
      corridorSeconds: 0,
      objectiveIndex: state.objectiveIndex + 1,
      objectiveProgress: 0,
    };
    const nextObjective = mission.objectives[nextState.objectiveIndex];
    const nextObjectiveState = createFlightObjectiveState(
      mission,
      nextState.objectiveIndex,
    );

    activeFlightMissionRef.current = nextState;
    flightObjectiveActivatedAtRef.current = Date.now();
    activeFlightObjectiveRef.current = nextObjectiveState;
    setActiveFlightMission(nextState);
    setActiveFlightObjective(nextObjectiveState);
    if (nextObjective?.type === "route-waypoint") {
      setControlMode("free-flight");
    }
    applyFlightObjectiveTarget(mission, nextState.objectiveIndex);
    showToast(
      language === "zh"
        ? `下一目标步骤：${nextObjectiveState.title}`
        : `Next objective: ${nextObjectiveState.title}`,
    );
  }

  function completeFlightMission(mission: FlightMission) {
    const currentProgress = playerProgressRef.current;
    const alreadyCompleted =
      currentProgress.completedFlightMissionIds.includes(mission.id);

    if (!alreadyCompleted) {
      grantFlightMissionReward(mission);
    } else {
      showToast(
        language === "zh"
          ? `${mission.title.zh} 已完成，任务奖励不会重复发放`
          : `${mission.title.en} already completed. Mission rewards are not repeated.`,
      );
    }

    const completedObjectiveState = createFlightObjectiveState(
      mission,
      mission.objectives.length - 1,
      100,
      true,
    );

    activeFlightMissionRef.current = null;
    activeFlightObjectiveRef.current = completedObjectiveState;
    setActiveFlightMission(null);
    setActiveFlightObjective(completedObjectiveState);
    addCaptainLog(
      mission.id,
      language === "zh"
        ? `飞行任务完成 — ${mission.title.zh}。`
        : `FLIGHT MISSION COMPLETE — ${mission.title.en}.`,
      "flight_mission_completed",
    );
  }

  function grantFlightMissionReward(mission: FlightMission) {
    const currentProgress = playerProgressRef.current;
    const reward = mission.reward;
    const xp = reward.xp ?? 0;
    const credits = reward.researchCredits ?? 0;
    const discoveryCardIds = reward.discoveryCardIds ?? [];
    const badgeIds = reward.badgeIds ?? [];
    const newDiscoveryCardIds = discoveryCardIds.filter(
      (cardId) => !currentProgress.unlockedDiscoveryCardIds.includes(cardId),
    );
    const newBadgeIds = badgeIds.filter(
      (badgeId) => !currentProgress.unlockedBadgeIds.includes(badgeId),
    );
    const previousRankId = getCaptainRankId(currentProgress.flightXp);
    const nextFlightXp = currentProgress.flightXp + xp;
    const nextRankId = getCaptainRankId(nextFlightXp);
    const nextCaptainTitles =
      previousRankId === nextRankId
        ? currentProgress.captainTitles
        : mergeUnique(currentProgress.captainTitles, [nextRankId]);
    const nextProgress: PlayerProgress = {
      ...currentProgress,
      captainTitles: nextCaptainTitles,
      completedFlightMissionIds: mergeUnique(
        currentProgress.completedFlightMissionIds,
        [mission.id],
      ),
      flightXp: nextFlightXp,
      researchCredits: currentProgress.researchCredits + credits,
      selectedCaptainTitle:
        previousRankId === nextRankId
          ? currentProgress.selectedCaptainTitle
          : nextRankId,
      unlockedBadgeIds: mergeUnique(
        currentProgress.unlockedBadgeIds,
        badgeIds,
      ),
      unlockedDiscoveryCardIds: mergeUnique(
        currentProgress.unlockedDiscoveryCardIds,
        discoveryCardIds,
      ),
    };

    playerProgressRef.current = nextProgress;
    setPlayerProgress(nextProgress);

    newDiscoveryCardIds.forEach((cardId) => {
      const card = getDiscoveryCardById(cardId);
      if (!card) return;

      addCaptainLog(
        cardId,
        language === "zh"
          ? `发现解锁 — ${getScanDiscoveryCardCopy(card, language).title}。`
          : `DISCOVERY UNLOCKED — ${getScanDiscoveryCardCopy(card, language).title}.`,
        "discovery_unlocked",
      );
    });

    if (xp > 0 || credits > 0) {
      addCaptainLog(
        mission.id,
        language === "zh"
          ? `任务奖励发放 — +${xp} XP，+${credits} 研究点数。`
          : `MISSION REWARD GRANTED — +${xp} XP, +${credits} Research Credits.`,
        "reward_granted",
      );
    }

    newBadgeIds.forEach((badgeId) => {
      const badge = getMissionBadgeById(badgeId);
      if (!badge) return;

      addCaptainLog(
        badgeId,
        language === "zh"
          ? `徽章解锁 — ${getMissionBadgeCopy(badge, language).title}。`
          : `BADGE UNLOCKED — ${getMissionBadgeCopy(badge, language).title}.`,
        "badge_unlocked",
      );
    });

    if (previousRankId !== nextRankId) {
      addCaptainLog(
        nextRankId,
        language === "zh"
          ? `等级更新 — ${getCaptainRank(nextFlightXp, language)}。`
          : `RANK UPDATED — ${getCaptainRank(nextFlightXp, language)}.`,
        "rank_updated",
      );
    }

    showToast(
      language === "zh"
        ? `飞行任务完成：${mission.title.zh} · +${xp} XP · +${credits} 研究点数`
        : `Flight mission complete: ${mission.title.en} · +${xp} XP · +${credits} Research Credits`,
    );
  }

  function getFlightObjectiveCopy(target: SelectedTarget) {
    const targetName = SPACE_OBJECTS[target].name[language];

    if (language === "zh") {
      return {
        title: `${targetName} 扫描航段`,
        description:
          "自动导航至目标附近，然后手动靠近、对准扫描框并完成一次科学扫描。",
      };
    }

    return {
      title: `${targetName} Scan Approach`,
      description:
        "Autopilot near the target, then manually approach, align the reticle, and complete one science scan.",
    };
  }

  function startFlightObjective(target: SelectedTarget = selectedTarget) {
    const existingObjective = activeFlightObjectiveRef.current;
    const alreadyScanned = playerProgressRef.current.scannedTargetIds.includes(target);
    const objectiveCopy = getFlightObjectiveCopy(target);
    const nextObjective: FlightObjectiveState =
      existingObjective?.target === target && !existingObjective.completed
        ? existingObjective
        : {
            completed: alreadyScanned,
            description: objectiveCopy.description,
            id: `scan-${target}`,
            progress: alreadyScanned ? 100 : 0,
            target,
            title: objectiveCopy.title,
            type: "scan",
          };

    activeFlightObjectiveRef.current = nextObjective;
    setActiveFlightObjective(nextObjective);
    setSelectedTarget(target);
    resetScanForTarget(target);
    setExperienceMode("cockpit");
    setControlMode("free-flight");
    setCameraMode("free");
    setLockBehavior("fly");
    setHudMode("minimal");
    setMenuOpen(false);
    setSearchOpen(false);
    setDetailOpen(false);
    setWelcomeOpen(false);
    issueCameraCommand("close");
    recordTargetLocked(target, nextObjective.id);

    if (!existingObjective || existingObjective.target !== target) {
      addCaptainLog(
        nextObjective.id,
        language === "zh"
          ? `飞行目标启动 — ${objectiveCopy.title}。`
          : `FLIGHT OBJECTIVE STARTED — ${objectiveCopy.title}.`,
        "flight_objective_started",
      );
    }

    showToast(
      language === "zh"
        ? `飞行目标已接入：${objectiveCopy.title}`
        : `Flight objective accepted: ${objectiveCopy.title}`,
    );
  }

  function completeFlightObjective(target: SelectedTarget) {
    const objective = activeFlightObjectiveRef.current;
    if (!objective || objective.target !== target || objective.completed) return;

    const completedObjective: FlightObjectiveState = {
      ...objective,
      completed: true,
      progress: 100,
    };

    activeFlightObjectiveRef.current = completedObjective;
    setActiveFlightObjective(completedObjective);
    addCaptainLog(
      objective.id,
      language === "zh"
        ? `飞行目标完成 — ${objective.title}。`
        : `FLIGHT OBJECTIVE COMPLETE — ${objective.title}.`,
      "flight_objective_completed",
    );
    showToast(
      language === "zh"
        ? "飞行目标完成，奖励与发现已写入收藏"
        : "Flight objective complete. Rewards and discoveries recorded.",
    );
  }

  function clearFlightObjectiveIfTargetChanges(target: SelectedTarget) {
    if (activeFlightMissionRef.current) return;
    const objective = activeFlightObjectiveRef.current;
    if (!objective || objective.target === target) return;

    activeFlightObjectiveRef.current = null;
    setActiveFlightObjective(null);
  }

  function estimateFlightObjectiveProgress(
    objective: FlightObjectiveState,
    nextFlightState: Pick<
      FlightState,
      | "approachZone"
      | "distanceToTarget"
      | "scanAligned"
      | "scanAvailable"
      | "scanInRange"
      | "scanProgress"
      | "targetCentered"
    >,
  ) {
    if (objective.completed) return 100;

    if (objective.type === "approach") {
      return nextFlightState.approachZone ? 100 : nextFlightState.scanInRange ? 70 : 20;
    }

    if (objective.type === "align") {
      return nextFlightState.targetCentered ? 100 : nextFlightState.scanAligned ? 70 : 25;
    }

    if (objective.type === "fly-through") {
      return nextFlightState.approachZone ? 80 : nextFlightState.scanInRange ? 45 : 15;
    }

    const scanProgress = nextFlightState.scanProgress ?? 0;
    const approachProgress = nextFlightState.approachZone
      ? 35
      : nextFlightState.scanInRange
        ? 25
        : nextFlightState.distanceToTarget !== null
          ? 12
          : 0;
    const alignProgress = nextFlightState.scanAvailable
      ? 70
      : nextFlightState.scanAligned || nextFlightState.targetCentered
        ? 55
        : 0;

    return Math.min(96, Math.max(scanProgress, approachProgress, alignProgress));
  }

  function updateActiveFlightMissionProgress(nextFlightState: FlightState) {
    const state = activeFlightMissionRef.current;
    if (!state) return;

    const mission = getFlightMissionById(state.missionId);
    if (!mission) return;

    const objective = mission.objectives[state.objectiveIndex];
    if (!objective) return;

    const objectiveTarget = objective.target ?? mission.target;
    if (objectiveTarget !== selectedTarget) return;

    let progress = state.objectiveProgress;
    let shouldComplete = false;
    const now = Date.now();
    const objectiveAgeSeconds =
      (now - flightObjectiveActivatedAtRef.current) / 1000;
    const elapsedSeconds = Math.min(
      0.5,
      Math.max(0, (now - flightMissionProgressTickRef.current) / 1000),
    );
    flightMissionProgressTickRef.current = now;

    if (objective.type === "approach") {
      const requiredDistance = objective.requiredDistance ?? 8;
      const distance = nextFlightState.distanceToTarget;
      if (nextFlightState.scanInRange || nextFlightState.approachZone) {
        progress = 100;
      } else if (distance !== null) {
        progress = Math.max(
          progress,
          Math.min(95, Math.max(8, (1 - distance / (requiredDistance * 4)) * 100)),
        );
      }
      shouldComplete = progress >= 100;
    } else if (objective.type === "align") {
      progress = nextFlightState.scanAligned || nextFlightState.targetCentered
        ? 100
        : nextFlightState.scanInRange
          ? Math.max(progress, 55)
          : Math.max(progress, 20);
      shouldComplete = progress >= 100;
    } else if (objective.type === "fly-through") {
      const requiredDuration = objective.requiredDurationSeconds ?? 5;
      const insideCorridor =
        nextFlightState.scanInRange || nextFlightState.approachZone;
      const corridorSeconds = insideCorridor
        ? Math.min(requiredDuration, state.corridorSeconds + elapsedSeconds)
        : Math.max(0, state.corridorSeconds - elapsedSeconds * 0.75);
      progress = Math.min(100, (corridorSeconds / requiredDuration) * 100);
      shouldComplete = corridorSeconds >= requiredDuration;

      if (
        Math.abs(corridorSeconds - state.corridorSeconds) > 0.15 ||
        shouldComplete
      ) {
        const nextState = {
          ...state,
          corridorSeconds,
          objectiveProgress: progress,
        };
        activeFlightMissionRef.current = nextState;
        setActiveFlightMission(nextState);
      }
    } else if (objective.type === "route-waypoint") {
      const distance = nextFlightState.distanceToTarget;
      if (nextFlightState.approachZone || nextFlightState.scanInRange) {
        progress = 100;
      } else if (distance !== null) {
        progress = Math.max(
          progress,
          Math.min(95, Math.max(12, (1 - distance / 48) * 100)),
        );
      }
      shouldComplete = progress >= 100 && objectiveAgeSeconds >= 2.5;
    } else if (objective.type === "scan") {
      if (playerProgressRef.current.scannedTargetIds.includes(objectiveTarget)) {
        progress = 100;
      } else if (nextFlightState.scanAvailable) {
        progress = Math.max(progress, 70);
      } else if (nextFlightState.scanInRange) {
        progress = Math.max(progress, 45);
      } else {
        progress = Math.max(progress, 15);
      }
      shouldComplete = progress >= 100;
    }

    if (shouldComplete) {
      completeActiveFlightMissionObjective(objective.type, objectiveTarget);
      return;
    }

    if (progress > state.objectiveProgress + 4 && objective.type !== "fly-through") {
      const nextState = {
        ...state,
        objectiveProgress: progress,
      };
      const nextObjective = activeFlightObjectiveRef.current
        ? {
            ...activeFlightObjectiveRef.current,
            progress,
          }
        : createFlightObjectiveState(mission, state.objectiveIndex, progress);

      activeFlightMissionRef.current = nextState;
      activeFlightObjectiveRef.current = nextObjective;
      setActiveFlightMission(nextState);
      setActiveFlightObjective(nextObjective);
    }
  }

  function dismissWelcome() {
    window.localStorage.setItem("argonaut-v02-welcome-seen", "true");
    setWelcomeOpen(false);
  }

  function handleSetViewMode(mode: ViewMode) {
    setViewMode(mode);

    if (mode === "celestial-sphere") {
      setViewLayers((currentLayers) => ({
        ...currentLayers,
        constellations: true,
        ecliptic: true,
        zodiac: true,
      }));
      issueCameraCommand("overview");
      return;
    }

    issueCameraCommand("focus");
  }

  function applyMissionViewContext(mission: Mission) {
    if (mission.requiresViewMode) {
      setViewMode(mission.requiresViewMode);
    }

    if (mission.requiredLayers) {
      setViewLayers((currentLayers) => ({
        ...currentLayers,
        ...mission.requiredLayers,
      }));
    }
  }

  function recordTargetLocked(target: SelectedTarget, refId: string = target) {
    if (lastLoggedTargetRef.current === target) return;

    lastLoggedTargetRef.current = target;
    addCaptainLog(
      refId,
      language === "zh"
        ? `目标锁定 — ${SPACE_OBJECTS[target].name.zh}。`
        : `TARGET LOCKED — ${SPACE_OBJECTS[target].name.en}.`,
      "target_locked",
    );
  }

  function applyTourStop(stop: TourStop) {
    const stopCopy = getTourStopCopy(stop, language);

    clearFlightObjectiveIfTargetChanges(stop.target);
    setSelectedTarget(stop.target);
    resetScanForTarget(stop.target);
    setExplorationPoint(null);
    setSelectedMissionId(null);
    setMissionStepIndex(0);
    setCameraMode("locked");
    setLockBehavior("fly");
    setViewMode(stop.viewMode ?? "solar-system");
    setViewLayers((currentLayers) => ({
      ...currentLayers,
      labels: true,
      orbits: true,
      ...(stop.requiredLayers ?? {}),
    }));
    issueCameraCommand(stop.cameraMode ?? "focus");
    recordTargetLocked(stop.target, stop.id);
    addCaptainLog(
      stop.id,
      language === "zh"
        ? `站点聚焦 — ${stopCopy.title}。`
        : `STOP FOCUSED — ${stopCopy.title}.`,
      "tour_stop_focused",
    );
  }

  function cameraCommandForWaypoint(waypoint: MissionWaypoint): CameraCommandType {
    if (waypoint.cameraMode === "overview") return "overview";
    if (waypoint.cameraMode === "close") return "close";
    return "focus";
  }

  function applyArchiveWaypoint(
    mission: ArchiveMission,
    waypointIndex: number,
    options: { log?: boolean } = {},
  ) {
    const waypoint = mission.waypoints[waypointIndex];
    if (!waypoint) return;

    clearFlightObjectiveIfTargetChanges(waypoint.target);
    setCurrentArchiveWaypointIndex(waypointIndex);
    setSelectedTarget(waypoint.target);
    resetScanForTarget(waypoint.target);
    setExplorationPoint(null);
    setCameraMode("locked");
    setLockBehavior("fly");
    setViewMode("solar-system");
    setViewLayers((currentLayers) => ({
      ...currentLayers,
      labels: true,
      missionRoutes: true,
      orbits: true,
      ...(waypoint.requiredLayers ?? {}),
    }));
    issueCameraCommand(cameraCommandForWaypoint(waypoint));
    recordTargetLocked(waypoint.target, waypoint.id);

    if (options.log !== false) {
      const waypointCopy = getMissionWaypointCopy(waypoint, language);

      addCaptainLog(
        waypoint.id,
        language === "zh"
          ? `航点锁定 — ${waypointCopy.label}。`
          : `WAYPOINT LOCKED — ${waypointCopy.label}.`,
        "archive_waypoint_locked",
      );
    }
  }

  function handleViewArchiveRoute(missionId: ArchiveMissionId) {
    const mission = getArchiveMissionById(missionId);
    if (!mission) return;
    const missionCopy = getArchiveMissionCopy(mission, language);

    setSelectedArchiveMissionId(mission.id);
    setArchiveExpeditionMode("idle");
    setArchivePanelOpen(true);
    setHudMode("full");
    setActivePanel("archives");
    setViewLayers((currentLayers) => ({
      ...currentLayers,
      labels: true,
      missionRoutes: true,
      orbits: true,
    }));
    addCaptainLog(
      mission.id,
      language === "zh"
        ? `路线载入 — ${mission.name}：${missionCopy.subtitle}。`
        : `ROUTE LOADED — ${mission.name} trajectory profile.`,
      "archive_route_loaded",
    );
    applyArchiveWaypoint(mission, 0, { log: false });
    showToast(
      language === "zh"
        ? `${mission.name} 路线已载入`
        : `${mission.name} route loaded`,
    );
  }

  function handleSelectArchiveWaypoint(index: number) {
    if (!selectedArchiveMission?.waypoints[index]) return;
    applyArchiveWaypoint(selectedArchiveMission, index);
  }

  function handleNextArchiveWaypoint() {
    if (!selectedArchiveMission) return;

    const nextIndex = currentArchiveWaypointIndex + 1;
    if (nextIndex >= selectedArchiveMission.waypoints.length) {
      if (archiveExpeditionMode === "active") {
        handleCompleteArchiveExpedition();
      }
      return;
    }

    applyArchiveWaypoint(selectedArchiveMission, nextIndex);
  }

  function handlePreviousArchiveWaypoint() {
    if (!selectedArchiveMission) return;
    applyArchiveWaypoint(
      selectedArchiveMission,
      Math.max(currentArchiveWaypointIndex - 1, 0),
    );
  }

  function handleFocusArchiveWaypoint() {
    if (!selectedArchiveMission || !currentArchiveWaypoint) return;
    applyArchiveWaypoint(selectedArchiveMission, currentArchiveWaypointIndex, {
      log: false,
    });
  }

  function handleStartArchiveExpedition(missionId?: ArchiveMissionId) {
    const mission =
      getArchiveMissionById(missionId ?? selectedArchiveMissionId) ??
      selectedArchiveMission;
    if (!mission) return;

    if (activeTourId) {
      showToast(
        language === "zh"
          ? "档案远征已启动，当前路线进度会保留"
          : "Archive expedition started. Grand Tour progress is preserved.",
      );
    }

    setSelectedArchiveMissionId(mission.id);
    setArchiveExpeditionMode("active");
    setArchivePanelOpen(true);
    setHudMode("full");
    setActivePanel("archives");
    dismissWelcome();
    addCaptainLog(
      mission.id,
      language === "zh"
        ? `远征启动 — ${mission.name}。`
        : `EXPEDITION STARTED — ${mission.name}.`,
      "archive_expedition_started",
    );
    applyArchiveWaypoint(mission, 0, { log: false });
  }

  function handleCompleteArchiveExpedition() {
    if (!selectedArchiveMission) return;

    setArchiveExpeditionMode("completed");
    addCaptainLog(
      selectedArchiveMission.id,
      language === "zh"
        ? `远征完成 — ${selectedArchiveMission.name} 档案路线已完成。`
        : `EXPEDITION COMPLETE — ${selectedArchiveMission.name} profile completed.`,
      "archive_expedition_completed",
    );
    showToast(
      language === "zh"
        ? `${selectedArchiveMission.name} 远征完成`
        : `${selectedArchiveMission.name} expedition complete`,
    );
  }

  function handleClearArchiveRoute() {
    if (selectedArchiveMission) {
      addCaptainLog(
        selectedArchiveMission.id,
        language === "zh"
          ? `路线清除 — ${selectedArchiveMission.name}。`
          : `ROUTE CLEARED — ${selectedArchiveMission.name}.`,
        "archive_route_cleared",
      );
    }
    setSelectedArchiveMissionId(null);
    setCurrentArchiveWaypointIndex(0);
    setArchiveExpeditionMode("idle");
    setArchivePanelOpen(false);
    showToast(language === "zh" ? "档案路线已清除" : "Archive route cleared");
  }

  function handleOpenArchivesPanel() {
    setHudMode("full");
    setActivePanel("archives");
    setArchivePanelOpen(true);
    showToast(language === "zh" ? "任务档案馆已打开" : "Mission Archives opened");
  }

  function handleSelectTarget(target: SelectedTarget) {
    setLockBehavior("fly");
    clearFlightObjectiveIfTargetChanges(target);
    setSelectedTarget(target);
    resetScanForTarget(target);
    setExplorationPoint(null);
    setSelectedMissionId(null);
    setMissionStepIndex(0);
    setCameraMode("locked");
    issueCameraCommand("focus");
    recordTargetLocked(target);
  }

  function handleLockTarget(target: SelectedTarget) {
    setLockBehavior("preserve");
    clearFlightObjectiveIfTargetChanges(target);
    setSelectedTarget(target);
    resetScanForTarget(target);
    setExplorationPoint(null);
    setSelectedMissionId(null);
    setMissionStepIndex(0);
    setCameraMode("locked");
    recordTargetLocked(target);
  }

  function handleToggleCameraMode() {
    if (cameraMode === "locked") {
      setCameraMode("free");
      return;
    }

    handleLockTarget(nearestTarget);
  }

  function handleExplorationPointChange(point: ExplorationPoint) {
    setExplorationPoint(point);

    if (!point) return;

    const matchingMission = MISSIONS.find(
      (mission) =>
        mission.target === "mars" && mission.explorationPoint === point,
    );

    if (matchingMission) {
      setSelectedMissionId(matchingMission.id);
      setMissionStepIndex(1);
      setActivePanel("missions");
    }
  }

  function handleStartMission(mission: Mission) {
    const focusTarget = mission.focusTarget ?? mission.target;
    const missionCopy = getMissionCopy(mission, language);

    clearFlightObjectiveIfTargetChanges(focusTarget);
    setSelectedMissionId(mission.id);
    setMissionStepIndex(0);
    setSelectedTarget(focusTarget);
    resetScanForTarget(focusTarget);
    recordTargetLocked(focusTarget, mission.id);
    setExplorationPoint(mission.explorationPoint ?? null);
    setCameraMode("locked");
    setLockBehavior("fly");
    setActivePanel("missions");
    applyMissionViewContext(mission);
    dismissWelcome();
    addCaptainLog(
      mission.id,
      language === "zh"
        ? `任务启动 — ${missionCopy.title}。`
        : `MISSION STARTED — ${missionCopy.title}.`,
      "mission_started",
    );

    if (mission.suggestedCameraMode === "overview") {
      issueCameraCommand("overview");
    } else if (mission.suggestedCameraMode === "close") {
      issueCameraCommand("close");
    } else {
      issueCameraCommand("focus");
    }
  }

  function handleCompleteMission(missionId: string) {
    const mission = getMissionById(missionId);
    const missionCopy = mission ? getMissionCopy(mission, language) : null;
    const alreadyCompleted = completedMissionIds.includes(missionId);

    setSelectedMissionId(missionId);
    setMissionStepIndex(2);
    setCompletedMissionIds((currentMissionIds) =>
      currentMissionIds.includes(missionId)
        ? currentMissionIds
        : [...currentMissionIds, missionId],
    );
    if (mission && !alreadyCompleted) {
      addCaptainLog(
        missionId,
        language === "zh"
          ? `任务完成 — ${missionCopy?.title ?? mission.title}。`
          : `MISSION COMPLETE — ${missionCopy?.title ?? mission.title}.`,
        "mission_completed",
      );
    }
    if (currentTourStop?.recommendedMissionIds.includes(missionId)) {
      showToast(
        language === "zh"
          ? "推荐任务已完成，可以标记本站完成"
          : "Recommended mission complete. You can mark this stop complete.",
      );
    } else {
      showToast(
        language === "zh"
          ? "任务完成，已写入航行日志"
          : "Mission complete. Written to Captain's Log.",
      );
    }
  }

  function handleAdvanceMissionStep() {
    const mission = getMissionById(selectedMissionId);
    if (!mission) return;

    const steps = getMissionSteps(mission, language);
    const currentStep = steps[missionStepIndex] ?? steps[0];

    if (currentStep.target) {
      clearFlightObjectiveIfTargetChanges(currentStep.target);
      setSelectedTarget(currentStep.target);
      resetScanForTarget(currentStep.target);
      recordTargetLocked(currentStep.target, mission.id);
    }

    if (currentStep.viewMode) {
      setViewMode(currentStep.viewMode);
    }

    if (currentStep.requiredLayers) {
      setViewLayers((currentLayers) => ({
        ...currentLayers,
        ...currentStep.requiredLayers,
      }));
    }

    setExplorationPoint(currentStep.explorationPoint ?? null);
    setCameraMode("locked");
    setLockBehavior("fly");

    if (currentStep.cameraCommand) {
      issueCameraCommand(currentStep.cameraCommand);
    }

    addCaptainLog(
      mission.id,
      language === "zh"
        ? `任务步骤 — ${currentStep.title}：${currentStep.instruction}`
        : `MISSION STEP — ${currentStep.title}: ${currentStep.instruction}`,
      "mission_step",
    );

    if (missionStepIndex >= steps.length - 1) {
      handleCompleteMission(mission.id);
      return;
    }

    setMissionStepIndex((currentIndex) =>
      Math.min(currentIndex + 1, steps.length - 1),
    );
  }

  function handleStartRecommendedMission() {
    handleStartMission(
      getRecommendedMission(selectedTarget, completedMissionIds),
    );
  }

  function handleStartTour(tourId: TourId) {
    const tour = getTourById(tourId);
    const firstStop = tour?.stops[0];
    if (!tour || !firstStop) return;
    const tourCopy = getTourCopy(tour, language);

    setActiveTourId(tour.id);
    setActiveTourStopIndex(0);
    setCompletedTourStopIds([]);
    setTourMode("active");
    setTourPanelOpen(true);
    setHudMode("full");
    setActivePanel("tour");
    dismissWelcome();
    addCaptainLog(
      tour.id,
      language === "zh"
        ? `路线启动 — ${tourCopy.title} 已初始化。`
        : `TOUR STARTED — ${tourCopy.title} initialized.`,
      "tour_started",
    );
    applyTourStop(firstStop);
    showToast(
      language === "zh"
        ? `${tourCopy.title} 已启动`
        : `${tourCopy.title} started`,
    );
  }

  function handleFocusTourStop() {
    if (!currentTourStop) return;
    applyTourStop(currentTourStop);
  }

  function handleCompleteTourStop() {
    if (!activeTour || !currentTourStop) return;
    const activeTourCopy = getTourCopy(activeTour, language);
    const currentStopCopy = getTourStopCopy(currentTourStop, language);

    const isFinalStop = activeTourStopIndex >= activeTour.stops.length - 1;
    setCompletedTourStopIds((currentIds) =>
      currentIds.includes(currentTourStop.id)
        ? currentIds
        : [...currentIds, currentTourStop.id],
    );
    addCaptainLog(
      currentTourStop.id,
      language === "zh"
        ? `站点完成 — ${currentStopCopy.title}。`
        : `STOP COMPLETE — ${currentStopCopy.title}.`,
      "tour_stop_completed",
    );

    if (isFinalStop) {
      setTourMode("completed");
      addCaptainLog(
        activeTour.id,
        language === "zh"
          ? `路线完成 — ${activeTourCopy.title}。`
          : `TOUR COMPLETE — ${activeTourCopy.title}.`,
        "tour_completed",
      );
      showToast(
        language === "zh"
          ? `${activeTourCopy.title} 已完成`
          : `${activeTourCopy.title} complete`,
      );
      return;
    }

    const nextStop = activeTour.stops[activeTourStopIndex + 1];
    const nextStopCopy = getTourStopCopy(nextStop, language);
    showToast(
      language === "zh"
        ? `本站已记录，建议前往下一站：${nextStopCopy.title}`
        : `Stop recorded. Next recommended stop: ${nextStopCopy.title}`,
    );
  }

  function handleNextTourStop() {
    if (!activeTour || !currentTourStop) return;

    if (!completedTourStopIds.includes(currentTourStop.id)) {
      showToast(
        language === "zh"
          ? "当前站点尚未完成"
          : "Current stop not completed",
      );
    }

    const nextIndex = activeTourStopIndex + 1;
    if (nextIndex >= activeTour.stops.length) {
      handleCompleteTourStop();
      return;
    }

    setActiveTourStopIndex(nextIndex);
    applyTourStop(activeTour.stops[nextIndex]);
  }

  function handleJumpToTourStop(stopIndex: number) {
    if (!activeTour?.stops[stopIndex]) return;

    setActiveTourStopIndex(stopIndex);
    setTourMode("active");
    setTourPanelOpen(true);
    applyTourStop(activeTour.stops[stopIndex]);
    showToast(
      language === "zh"
        ? `已跳转到第 ${stopIndex + 1} 站`
        : `Jumped to stop ${stopIndex + 1}`,
    );
  }

  function handleExitTour() {
    setActiveTourId(null);
    setActiveTourStopIndex(0);
    setTourMode("idle");
    setTourPanelOpen(false);
    showToast(language === "zh" ? "已退出路线" : "Tour exited");
  }

  function handleRestartTour() {
    if (!activeTourId) return;
    handleStartTour(activeTourId);
  }

  function handleStartTourRecommendedMission() {
    if (!currentTourStop) {
      handleStartRecommendedMission();
      return;
    }

    const mission =
      currentTourStop.recommendedMissionIds
        .map((missionId) => getMissionById(missionId))
        .find(
          (candidateMission) =>
            candidateMission &&
            !completedMissionIds.includes(candidateMission.id),
        ) ??
      getRecommendedMission(currentTourStop.target, completedMissionIds);

    if (mission) handleStartMission(mission);
  }

  function handleSelectSearchTarget(target: SelectedTarget) {
    setSearchOpen(false);
    handleSelectTarget(target);
  }

  function handleSelectSearchArchive(missionId: ArchiveMissionId) {
    setSearchOpen(false);
    handleViewArchiveRoute(missionId);
  }

  async function handleShareView() {
    const brandName = language === "zh" ? "寰宇星舟" : "Argonaut";
    const targetName = SPACE_OBJECTS[selectedTarget].name[language];
    const activeTourCopy = activeTour ? getTourCopy(activeTour, language) : null;
    const archiveContext = selectedArchiveMission
      ? language === "zh"
        ? `任务档案：${selectedArchiveMission.name}`
        : `Archive route: ${selectedArchiveMission.name}`
      : null;
    const tourContext = activeTour
      ? language === "zh"
        ? `路线：${activeTourCopy?.title} ${activeTourStopIndex + 1}/${activeTour.stops.length}`
        : `Tour: ${activeTourCopy?.title} ${activeTourStopIndex + 1}/${activeTour.stops.length}`
      : null;
    const context = archiveContext ?? tourContext;
    const shareText =
      language === "zh"
        ? `${brandName} - 当前目标：${targetName}${context ? ` - ${context}` : ""}`
        : `${brandName} - Current target: ${targetName}${context ? ` - ${context}` : ""}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        showToast(
          language === "zh"
            ? "当前探索视图已复制"
            : "Current exploration view copied",
        );
        return;
      }
    } catch {
      // Browser clipboard permissions can fail silently in local prototypes.
    }

    showToast(
      language === "zh" ? "分享信息已准备好" : "Share information is ready",
    );
  }

  function handleToggleHudMode() {
    setHudMode((currentMode) =>
      currentMode === "full"
        ? "minimal"
        : currentMode === "minimal"
          ? "hidden"
          : "full",
    );
  }

  function handleOpenViewPanel() {
    setHudMode("full");
    setActivePanel("view");
  }

  async function handleToggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        showToast(language === "zh" ? "已退出全屏" : "Exited fullscreen");
      } else {
        await document.documentElement.requestFullscreen();
        showToast(language === "zh" ? "已进入全屏" : "Entered fullscreen");
      }
    } catch {
      showToast(
        language === "zh"
          ? "当前浏览器暂不支持全屏切换"
          : "Fullscreen is not available in this browser",
      );
    }
  }

  function handleFlightStateChange(
    nextFlightState: Pick<
      FlightState,
      | "approachZone"
      | "autopilotProgress"
      | "distanceToTarget"
      | "etaSeconds"
      | "proximityWarning"
      | "scanAligned"
      | "scanAvailable"
      | "scanInRange"
      | "speed"
      | "targetBearingX"
      | "targetBearingY"
      | "targetCentered"
      | "throttle"
    >,
  ) {
    const mergedFlightState = {
      ...flightState,
      ...nextFlightState,
    };
    const objective = activeFlightObjectiveRef.current;

    if (
      objective &&
      !objective.completed &&
      objective.target === selectedTarget
    ) {
      const nextProgress = estimateFlightObjectiveProgress(
        objective,
        mergedFlightState,
      );

      if (nextProgress > objective.progress + 4) {
        const nextObjective = {
          ...objective,
          progress: nextProgress,
        };
        activeFlightObjectiveRef.current = nextObjective;
        setActiveFlightObjective(nextObjective);
      }
    }
    updateActiveFlightMissionProgress(mergedFlightState);

    setFlightState((currentState) => ({
      ...currentState,
      ...nextFlightState,
    }));
  }

  function resetScanForTarget(target: SelectedTarget) {
    clearScanTimers();
    setFlightState((currentState) => ({
      ...currentState,
      isScanning: false,
      scanProgress: playerProgressRef.current.scannedTargetIds.includes(target)
        ? 100
        : 0,
    }));
  }

  function handleEnterCockpit() {
    setExperienceMode("cockpit");
    setControlMode("free-flight");
    setCameraMode("free");
    setHudMode("minimal");
    setMenuOpen(false);
    setSearchOpen(false);
    setDetailOpen(false);
    setWelcomeOpen(false);
    issueCameraCommand("close");
    addCaptainLog(
      "cockpit",
      language === "zh"
        ? "驾驶舱进入 — 手动飞行界面已上线。"
        : "COCKPIT ENTERED — Manual flight interface online.",
      "cockpit_entered",
    );
    showToast(language === "zh" ? "驾驶舱模式已启动" : "Cockpit mode online");
  }

  function handleExitCockpit() {
    clearScanTimers();
    setExperienceMode("mission-control");
    setControlMode("orbit");
    setCameraMode("locked");
    setLockBehavior("fly");
    setHudMode("full");
    setFlightState((currentState) => ({
      ...currentState,
      isScanning: false,
      scanAligned: false,
      scanAvailable: false,
      scanInRange: false,
      scanProgress: currentState.scanProgress >= 100 ? 100 : 0,
      speed: 0,
      throttle: 0,
      autopilotProgress: 0,
      etaSeconds: null,
    }));
    issueCameraCommand("focus");
    addCaptainLog(
      "cockpit",
      language === "zh"
        ? "驾驶舱退出 — 已返回任务控制视角。"
        : "COCKPIT EXITED — Mission control view restored.",
      "cockpit_exited",
    );
    showToast(
      language === "zh"
        ? "已返回任务控制视角"
        : "Mission control view restored",
    );
  }

  function handleEngageAutopilot() {
    setExperienceMode("cockpit");
    setControlMode("autopilot");
    setCameraMode("free");
    setLockBehavior("fly");
    setFlightState((currentState) => ({
      ...currentState,
      autopilotProgress: 0,
      etaSeconds: null,
      speed: Math.max(currentState.speed, 14),
      throttle: 1,
    }));
    addCaptainLog(
      selectedTarget,
      language === "zh"
        ? `自动导航启动 — ${SPACE_OBJECTS[selectedTarget].name.zh} 接近向量已锁定。`
        : `AUTOPILOT ENGAGED — ${SPACE_OBJECTS[selectedTarget].name.en} approach vector locked.`,
      "autopilot_engaged",
    );
    showToast(language === "zh" ? "自动导航已启动" : "Autopilot engaged");
  }

  function handleCancelAutopilot() {
    setControlMode("free-flight");
    setFlightState((currentState) => ({
      ...currentState,
      autopilotProgress: 0,
      etaSeconds: null,
      throttle: 0,
    }));
    showToast(language === "zh" ? "自动导航已取消" : "Autopilot cancelled");
  }

  function handleAutopilotComplete() {
    setControlMode("free-flight");
    setFlightState((currentState) => ({
      ...currentState,
      autopilotProgress: 1,
      etaSeconds: 0,
      throttle: 0,
    }));
    addCaptainLog(
      selectedTarget,
      language === "zh"
        ? `自动导航完成 — 已抵达 ${SPACE_OBJECTS[selectedTarget].name.zh} 附近。`
        : `AUTOPILOT COMPLETE — Arrived near ${SPACE_OBJECTS[selectedTarget].name.en}.`,
      "autopilot_complete",
    );
    showToast(language === "zh" ? "自动导航完成" : "Autopilot complete");
  }

  function handleStartScan() {
    if (experienceMode !== "cockpit") return;

    if (flightState.isScanning) return;

    if (playerProgressRef.current.scannedTargetIds.includes(selectedTarget)) {
      completeFlightObjective(selectedTarget);
      completeActiveFlightMissionObjective("scan", selectedTarget);
      showToast(
        language === "zh"
          ? `${SPACE_OBJECTS[selectedTarget].name.zh} 已扫描，奖励不会重复发放`
          : `${SPACE_OBJECTS[selectedTarget].name.en} already scanned. Rewards are not repeated.`,
      );
      return;
    }

    if (!flightState.scanAvailable) {
      showToast(
        language === "zh"
          ? flightState.scanInRange
            ? "请先将目标对准扫描框"
            : "距离过远，无法扫描当前目标"
          : flightState.scanInRange
            ? "Align target before scanning"
            : "Target is out of scan range",
      );
      return;
    }

    const scannedTarget = selectedTarget;

    clearScanTimers();
    setFlightState((currentState) => ({
      ...currentState,
      isScanning: true,
      scanProgress: 0,
    }));
    addCaptainLog(
      scannedTarget,
      language === "zh"
        ? `扫描启动 — ${SPACE_OBJECTS[scannedTarget].name.zh}。`
        : `SCAN STARTED — ${SPACE_OBJECTS[scannedTarget].name.en}.`,
      "scan_started",
    );

    scanIntervalRef.current = window.setInterval(() => {
      setFlightState((currentState) => ({
        ...currentState,
        scanProgress: Math.min(currentState.scanProgress + 8, 96),
      }));
    }, 120);

    scanTimeoutRef.current = window.setTimeout(() => {
      clearScanTimers();
      setFlightState((currentState) => ({
        ...currentState,
        isScanning: false,
        scanProgress: 100,
      }));
      addCaptainLog(
        scannedTarget,
        language === "zh"
          ? `扫描完成 — ${SPACE_OBJECTS[scannedTarget].name.zh} 轮廓已记录。`
          : `SCAN COMPLETE — ${SPACE_OBJECTS[scannedTarget].name.en} profile recorded.`,
        "scan_complete",
      );
      grantScanReward(scannedTarget);
    }, 1650);
  }

  function handleRelatedItem(item: string) {
    const normalizedItem = item.toLowerCase();
    const explorationMatch = (
      Object.entries(EXPLORATION_LABELS_LOCALIZED.zh) as Array<
        [MarsExplorationPoint, string]
      >
    ).find(([, label]) => label === item) ??
      (
        Object.entries(EXPLORATION_LABELS_LOCALIZED.en) as Array<
          [MarsExplorationPoint, string]
        >
      ).find(([, label]) => label.toLowerCase() === normalizedItem);

    if (explorationMatch) {
      clearFlightObjectiveIfTargetChanges("mars");
      setSelectedTarget("mars");
      resetScanForTarget("mars");
      setExplorationPoint(explorationMatch[0]);
      setSelectedMissionId(null);
      setMissionStepIndex(0);
      setCameraMode("locked");
      setLockBehavior("fly");
      setActivePanel("info");
      issueCameraCommand("close");
      recordTargetLocked("mars", explorationMatch[0]);
      showToast(
        language === "zh"
          ? `已选定火星探索点：${item}`
          : `Mars exploration site selected: ${item}`,
      );
      return;
    }

    const lockableTargets = Object.keys(SPACE_OBJECTS) as SelectedTarget[];
    const relatedTarget = lockableTargets.find((target) =>
      normalizedItem.includes(target),
    );
    const localizedRelatedTarget = lockableTargets.find(
      (target) =>
        SPACE_OBJECTS[target].name.zh === item ||
        SPACE_OBJECTS[target].name.en.toLowerCase() === normalizedItem,
    );

    if (relatedTarget ?? localizedRelatedTarget) {
      handleSelectTarget(relatedTarget ?? localizedRelatedTarget ?? "earth");
      return;
    }

    showToast(
      language === "zh"
        ? `已标记相关对象：${item}`
        : `Related object marked: ${item}`,
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-sky-100">
      <SolarSystemScene
        cameraCommand={cameraCommand}
        cameraMode={cameraMode}
        controlMode={controlMode}
        controlSensitivity={controlSensitivity}
        experienceMode={experienceMode}
        explorationPoint={explorationPoint}
        language={language}
        lockBehavior={lockBehavior}
        onAutopilotComplete={handleAutopilotComplete}
        onFlightStateChange={handleFlightStateChange}
        onLockTarget={handleLockTarget}
        onNearestTargetChange={setNearestTarget}
        onSelectArchiveWaypoint={handleSelectArchiveWaypoint}
        selectedTarget={selectedTarget}
        selectedArchiveMission={selectedArchiveMission}
        currentArchiveWaypointIndex={currentArchiveWaypointIndex}
        setExplorationPoint={handleExplorationPointChange}
        viewLayers={viewLayers}
        viewMode={viewMode}
      />
      <Hud
        activePanel={activePanel}
        cameraMode={cameraMode}
        controlMode={controlMode}
        controlSensitivity={controlSensitivity}
        completedMissionIds={completedMissionIds}
        detailOpen={detailOpen}
        experienceMode={experienceMode}
        explorationPoint={explorationPoint}
        explorationLog={explorationLog}
        hudMode={hudMode}
        language={language}
        menuOpen={menuOpen}
        missionStepIndex={missionStepIndex}
        nearestTarget={nearestTarget}
        selectedTarget={selectedTarget}
        selectedMissionId={selectedMissionId}
        searchOpen={searchOpen}
        shareToast={shareToast}
        simMode={simMode}
        activeTourId={activeTourId}
        activeTourStopIndex={activeTourStopIndex}
        completedTourStopIds={completedTourStopIds}
        tourMode={tourMode}
        tourPanelOpen={tourPanelOpen}
        selectedArchiveMissionId={selectedArchiveMissionId}
        currentArchiveWaypointIndex={currentArchiveWaypointIndex}
        archiveExpeditionMode={archiveExpeditionMode}
        archivePanelOpen={archivePanelOpen}
        activeFlightObjective={activeFlightObjective}
        activeFlightMission={activeFlightMission}
        playerProgress={playerProgress}
        viewLayers={viewLayers}
        viewMode={viewMode}
        welcomeOpen={welcomeOpen}
        onAdvanceMissionStep={handleAdvanceMissionStep}
        onCameraCommand={issueCameraCommand}
        onCompleteMission={handleCompleteMission}
        onCompleteTourStop={handleCompleteTourStop}
        onDismissWelcome={dismissWelcome}
        onEnterCockpit={handleEnterCockpit}
        onAcceptFlightObjective={startRecommendedFlightMission}
        onCancelFlightMission={cancelFlightMission}
        onExitTour={handleExitTour}
        onExitCockpit={handleExitCockpit}
        onFocusTourStop={handleFocusTourStop}
        onJumpToTourStop={handleJumpToTourStop}
        onNextTourStop={handleNextTourStop}
        onClearArchiveRoute={handleClearArchiveRoute}
        onCompleteArchiveExpedition={handleCompleteArchiveExpedition}
        onFocusArchiveWaypoint={handleFocusArchiveWaypoint}
        onNextArchiveWaypoint={handleNextArchiveWaypoint}
        onOpenViewPanel={handleOpenViewPanel}
        onOpenArchivesPanel={handleOpenArchivesPanel}
        onPreviousArchiveWaypoint={handlePreviousArchiveWaypoint}
        onRelatedItem={handleRelatedItem}
        onRestartTour={handleRestartTour}
        onSelectArchiveWaypoint={handleSelectArchiveWaypoint}
        onSelectSearchArchive={handleSelectSearchArchive}
        onSelectSearchTarget={handleSelectSearchTarget}
        onShareView={handleShareView}
        onStartArchiveExpedition={handleStartArchiveExpedition}
        onViewArchiveRoute={handleViewArchiveRoute}
        onStartMission={handleStartMission}
        onStartFlightMission={startFlightMission}
        onStartRecommendedMission={handleStartRecommendedMission}
        onStartTour={handleStartTour}
        onStartTourRecommendedMission={handleStartTourRecommendedMission}
        onToast={showToast}
        onToggleCameraMode={handleToggleCameraMode}
        onToggleFullscreen={handleToggleFullscreen}
        onToggleHudMode={handleToggleHudMode}
        setActivePanel={setActivePanel}
        setControlSensitivity={setControlSensitivity}
        setDetailOpen={setDetailOpen}
        setHudMode={setHudMode}
        setLanguage={setLanguage}
        setMenuOpen={setMenuOpen}
        setSearchOpen={setSearchOpen}
        setSelectedTarget={handleSelectTarget}
        setSimMode={setSimMode}
        setViewLayers={setViewLayers}
        setViewMode={handleSetViewMode}
      />
      {experienceMode === "cockpit" ? (
        <CockpitOverlay
          controlMode={controlMode}
          flightState={flightState}
          flightObjective={activeFlightObjective}
          flightMission={activeFlightMission}
          language={language}
          playerProgress={playerProgress}
          scannedTargetIds={playerProgress.scannedTargetIds}
          selectedMissionId={selectedMissionId}
          selectedTarget={selectedTarget}
          onCancelAutopilot={handleCancelAutopilot}
          onCancelFlightMission={cancelFlightMission}
          onAcceptFlightObjective={startRecommendedFlightMission}
          onEngageAutopilot={handleEngageAutopilot}
          onExitCockpit={handleExitCockpit}
          onFocusTarget={() => issueCameraCommand("close")}
          onScan={handleStartScan}
        />
      ) : null}
    </main>
  );
}
