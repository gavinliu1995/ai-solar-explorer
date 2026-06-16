"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Hud from "./components/Hud";
import {
  getMissionById,
  getMissionSteps,
  getRecommendedMission,
  MISSIONS,
} from "./data/missions";
import { SPACE_OBJECTS } from "./data/spaceObjects";
import { getTourById } from "./data/tours";
import type {
  ActivePanel,
  CameraCommand,
  CameraCommandType,
  CameraMode,
  ControlSensitivity,
  ExplorationLogEntry,
  ExplorationPoint,
  HudMode,
  Language,
  LockBehavior,
  Mission,
  SelectedTarget,
  SimMode,
  TourId,
  TourMode,
  TourStop,
  ViewLayerState,
  ViewMode,
} from "./types/space";

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
  const cameraCommandNonceRef = useRef(0);
  const lastLoggedTargetRef = useRef<SelectedTarget>("earth");
  const activeTour = getTourById(activeTourId);
  const currentTourStop = activeTour?.stops[activeTourStopIndex] ?? null;

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
    const timestamp = new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

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
      `TARGET LOCKED — ${SPACE_OBJECTS[target].name.en}.`,
      "target_locked",
    );
  }

  function applyTourStop(stop: TourStop) {
    setSelectedTarget(stop.target);
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
      `STOP FOCUSED — ${stop.title}.`,
      "tour_stop_focused",
    );
  }

  function handleSelectTarget(target: SelectedTarget) {
    setLockBehavior("fly");
    setSelectedTarget(target);
    setExplorationPoint(null);
    setSelectedMissionId(null);
    setMissionStepIndex(0);
    setCameraMode("locked");
    issueCameraCommand("focus");
    recordTargetLocked(target);
  }

  function handleLockTarget(target: SelectedTarget) {
    setLockBehavior("preserve");
    setSelectedTarget(target);
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

    setSelectedMissionId(mission.id);
    setMissionStepIndex(0);
    setSelectedTarget(focusTarget);
    recordTargetLocked(focusTarget, mission.id);
    setExplorationPoint(mission.explorationPoint ?? null);
    setCameraMode("locked");
    setLockBehavior("fly");
    setActivePanel("missions");
    applyMissionViewContext(mission);
    dismissWelcome();
    addCaptainLog(
      mission.id,
      `MISSION STARTED — ${mission.title}.`,
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
        `MISSION COMPLETE — ${mission.title}.`,
        "mission_completed",
      );
    }
    if (currentTourStop?.recommendedMissionIds.includes(missionId)) {
      showToast("推荐任务已完成，可以标记本站完成");
    } else {
      showToast("任务完成，已写入 Captain's Log");
    }
  }

  function handleAdvanceMissionStep() {
    const mission = getMissionById(selectedMissionId);
    if (!mission) return;

    const steps = getMissionSteps(mission);
    const currentStep = steps[missionStepIndex] ?? steps[0];

    if (currentStep.target) {
      setSelectedTarget(currentStep.target);
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
      `MISSION STEP — ${currentStep.title}：${currentStep.instruction}`,
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
      `TOUR STARTED — ${tour.title} initialized.`,
      "tour_started",
    );
    applyTourStop(firstStop);
    showToast(`${tour.title} 已启动`);
  }

  function handleFocusTourStop() {
    if (!currentTourStop) return;
    applyTourStop(currentTourStop);
  }

  function handleCompleteTourStop() {
    if (!activeTour || !currentTourStop) return;

    const isFinalStop = activeTourStopIndex >= activeTour.stops.length - 1;
    setCompletedTourStopIds((currentIds) =>
      currentIds.includes(currentTourStop.id)
        ? currentIds
        : [...currentIds, currentTourStop.id],
    );
    addCaptainLog(
      currentTourStop.id,
      `STOP COMPLETE — ${currentTourStop.title}.`,
      "tour_stop_completed",
    );

    if (isFinalStop) {
      setTourMode("completed");
      addCaptainLog(
        activeTour.id,
        `TOUR COMPLETE — ${activeTour.title}.`,
        "tour_completed",
      );
      showToast(`${activeTour.title} complete`);
      return;
    }

    const nextStop = activeTour.stops[activeTourStopIndex + 1];
    showToast(`本站已记录，建议前往下一站：${nextStop.title}`);
  }

  function handleNextTourStop() {
    if (!activeTour || !currentTourStop) return;

    if (!completedTourStopIds.includes(currentTourStop.id)) {
      showToast("Current stop not completed");
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
    showToast(`Jumped to stop ${stopIndex + 1}`);
  }

  function handleExitTour() {
    setActiveTourId(null);
    setActiveTourStopIndex(0);
    setTourMode("idle");
    setTourPanelOpen(false);
    showToast("Tour exited");
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

  async function handleShareView() {
    const brandName = language === "zh" ? "寰宇星舟" : "Argonaut";
    const targetName = SPACE_OBJECTS[selectedTarget].name[language];
    const shareText =
      language === "zh"
        ? `${brandName} - 当前目标：${targetName}`
        : `${brandName} - Current target: ${targetName}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        showToast("当前探索视图已复制");
        return;
      }
    } catch {
      // Browser clipboard permissions can fail silently in local prototypes.
    }

    showToast("分享信息已准备好");
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
        showToast("已退出全屏");
      } else {
        await document.documentElement.requestFullscreen();
        showToast("已进入全屏");
      }
    } catch {
      showToast("当前浏览器暂不支持全屏切换");
    }
  }

  function handleRelatedItem(item: string) {
    const normalizedItem = item.toLowerCase();
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

    showToast(`已标记相关对象：${item}`);
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-sky-100">
      <SolarSystemScene
        cameraCommand={cameraCommand}
        cameraMode={cameraMode}
        controlSensitivity={controlSensitivity}
        explorationPoint={explorationPoint}
        language={language}
        lockBehavior={lockBehavior}
        onLockTarget={handleLockTarget}
        onNearestTargetChange={setNearestTarget}
        selectedTarget={selectedTarget}
        setExplorationPoint={handleExplorationPointChange}
        viewLayers={viewLayers}
        viewMode={viewMode}
      />
      <Hud
        activePanel={activePanel}
        cameraMode={cameraMode}
        controlSensitivity={controlSensitivity}
        completedMissionIds={completedMissionIds}
        detailOpen={detailOpen}
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
        viewLayers={viewLayers}
        viewMode={viewMode}
        welcomeOpen={welcomeOpen}
        onAdvanceMissionStep={handleAdvanceMissionStep}
        onCameraCommand={issueCameraCommand}
        onCompleteMission={handleCompleteMission}
        onCompleteTourStop={handleCompleteTourStop}
        onDismissWelcome={dismissWelcome}
        onExitTour={handleExitTour}
        onFocusTourStop={handleFocusTourStop}
        onJumpToTourStop={handleJumpToTourStop}
        onNextTourStop={handleNextTourStop}
        onOpenViewPanel={handleOpenViewPanel}
        onRelatedItem={handleRelatedItem}
        onRestartTour={handleRestartTour}
        onSelectSearchTarget={handleSelectSearchTarget}
        onShareView={handleShareView}
        onStartMission={handleStartMission}
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
    </main>
  );
}
