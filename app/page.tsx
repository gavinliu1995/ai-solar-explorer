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
    constellations: false,
    ecliptic: false,
    labels: true,
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
  const cameraCommandNonceRef = useRef(0);

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

  function addExplorationLog(
    missionId: string,
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
        id: `${missionId}-${type}-${Date.now()}`,
        missionId,
        message,
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

  function handleSelectTarget(target: SelectedTarget) {
    setLockBehavior("fly");
    setSelectedTarget(target);
    setExplorationPoint(null);
    setSelectedMissionId(null);
    setMissionStepIndex(0);
    setCameraMode("locked");
    issueCameraCommand("focus");
  }

  function handleLockTarget(target: SelectedTarget) {
    setLockBehavior("preserve");
    setSelectedTarget(target);
    setExplorationPoint(null);
    setSelectedMissionId(null);
    setMissionStepIndex(0);
    setCameraMode("locked");
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
    setExplorationPoint(mission.explorationPoint ?? null);
    setCameraMode("locked");
    setLockBehavior("fly");
    setActivePanel("missions");
    applyMissionViewContext(mission);
    dismissWelcome();
    addExplorationLog(
      mission.id,
      `任务已启动：${mission.title}`,
      "started",
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
      addExplorationLog(
        missionId,
        `任务完成：${mission.title}`,
        "completed",
      );
    }
    showToast("任务完成，已写入 Exploration Log");
  }

  function handleAdvanceMissionStep() {
    const mission = getMissionById(selectedMissionId);
    if (!mission) return;

    const steps = getMissionSteps(mission);
    const currentStep = steps[missionStepIndex] ?? steps[0];

    if (currentStep.target) {
      setSelectedTarget(currentStep.target);
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

    addExplorationLog(
      mission.id,
      `${currentStep.title}：${currentStep.instruction}`,
      "step",
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
        viewLayers={viewLayers}
        viewMode={viewMode}
        welcomeOpen={welcomeOpen}
        onAdvanceMissionStep={handleAdvanceMissionStep}
        onCameraCommand={issueCameraCommand}
        onCompleteMission={handleCompleteMission}
        onDismissWelcome={dismissWelcome}
        onOpenViewPanel={handleOpenViewPanel}
        onRelatedItem={handleRelatedItem}
        onSelectSearchTarget={handleSelectSearchTarget}
        onShareView={handleShareView}
        onStartMission={handleStartMission}
        onStartRecommendedMission={handleStartRecommendedMission}
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
