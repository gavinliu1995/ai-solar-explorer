"use client";

import { useEffect, useRef, useState } from "react";
import {
  ARCHIVE_CATEGORY_LABELS,
  ARCHIVE_MISSIONS,
  ARCHIVE_SEARCH_ALIASES,
  getArchiveMissionById,
  getArchiveMissionCopy,
  getArchiveMissionsForTarget,
  getDiscoveryCardCopy,
  getDiscoveryCardsForMission,
  getMissionWaypointCopy,
} from "@/app/data/archiveMissions";
import {
  MISSIONS,
  getMissionCopy,
  getMissionById,
  getMissionSteps,
  getMissionsForTarget,
  getRecommendedMission,
} from "@/app/data/missions";
import { SPACE_OBJECTS } from "@/app/data/spaceObjects";
import { TOURS, getTourById, getTourCopy, getTourStopCopy } from "@/app/data/tours";
import type {
  ActivePanel,
  ArchiveExpeditionMode,
  ArchiveMission,
  ArchiveMissionCategory,
  ArchiveMissionId,
  CameraCommandType,
  CameraMode,
  ControlMode,
  ControlSensitivity,
  ExperienceMode,
  ExplorationLogEntry,
  ExplorationPoint,
  HudMode,
  Language,
  Mission,
  MissionStep,
  MissionStatus,
  SelectedTarget,
  SimMode,
  Tour,
  TourId,
  TourMode,
  TourStop,
  ViewLayerState,
  ViewMode,
} from "@/app/types/space";
import {
  EXPLORATION_DETAILS_LOCALIZED,
  EXPLORATION_LABELS_LOCALIZED,
  LOCKABLE_TARGETS,
  MISSION_TARGETS,
  MISSION_TARGET_GROUPS,
  TARGET_LABELS_LOCALIZED,
} from "@/app/types/space";

type HudProps = {
  activePanel: ActivePanel;
  cameraMode: CameraMode;
  completedMissionIds: string[];
  controlMode: ControlMode;
  controlSensitivity: ControlSensitivity;
  detailOpen: boolean;
  experienceMode: ExperienceMode;
  explorationLog: ExplorationLogEntry[];
  explorationPoint: ExplorationPoint;
  hudMode: HudMode;
  language: Language;
  menuOpen: boolean;
  missionStepIndex: number;
  nearestTarget: SelectedTarget;
  searchOpen: boolean;
  selectedMissionId: string | null;
  selectedTarget: SelectedTarget;
  shareToast: string | null;
  simMode: SimMode;
  activeTourId: TourId | null;
  activeTourStopIndex: number;
  archiveExpeditionMode: ArchiveExpeditionMode;
  archivePanelOpen: boolean;
  completedTourStopIds: string[];
  currentArchiveWaypointIndex: number;
  selectedArchiveMissionId: ArchiveMissionId | null;
  tourMode: TourMode;
  tourPanelOpen: boolean;
  viewLayers: ViewLayerState;
  viewMode: ViewMode;
  welcomeOpen: boolean;
  onAdvanceMissionStep: () => void;
  onCameraCommand: (command: CameraCommandType) => void;
  onCompleteMission: (missionId: string) => void;
  onClearArchiveRoute: () => void;
  onCompleteArchiveExpedition: () => void;
  onCompleteTourStop: () => void;
  onDismissWelcome: () => void;
  onEnterCockpit: () => void;
  onExitTour: () => void;
  onExitCockpit: () => void;
  onFocusArchiveWaypoint: () => void;
  onFocusTourStop: () => void;
  onJumpToTourStop: (stopIndex: number) => void;
  onNextArchiveWaypoint: () => void;
  onNextTourStop: () => void;
  onOpenArchivesPanel: () => void;
  onOpenViewPanel: () => void;
  onPreviousArchiveWaypoint: () => void;
  onRelatedItem: (item: string) => void;
  onRestartTour: () => void;
  onSelectArchiveWaypoint: (index: number) => void;
  onSelectSearchArchive: (missionId: ArchiveMissionId) => void;
  onSelectSearchTarget: (target: SelectedTarget) => void;
  onShareView: () => void;
  onStartMission: (mission: Mission) => void;
  onStartArchiveExpedition: (missionId?: ArchiveMissionId) => void;
  onStartRecommendedMission: () => void;
  onStartTour: (tourId: TourId) => void;
  onStartTourRecommendedMission: () => void;
  onToast: (message: string) => void;
  onToggleCameraMode: () => void;
  onToggleFullscreen: () => void;
  onToggleHudMode: () => void;
  onViewArchiveRoute: (missionId: ArchiveMissionId) => void;
  setActivePanel: (panel: ActivePanel) => void;
  setControlSensitivity: (sensitivity: ControlSensitivity) => void;
  setDetailOpen: (open: boolean) => void;
  setHudMode: (mode: HudMode) => void;
  setLanguage: (language: Language) => void;
  setMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setSelectedTarget: (target: SelectedTarget) => void;
  setSimMode: (mode: SimMode) => void;
  setViewLayers: (layers: ViewLayerState) => void;
  setViewMode: (mode: ViewMode) => void;
};

const BRAND_NAME: Record<Language, string> = {
  en: "ARGONAUT",
  zh: "寰宇星舟",
};

const COPY = {
  en: {
    about:
      "Argonaut is an independent educational prototype for mission-guided solar system exploration. It is not affiliated with or endorsed by NASA.",
    active: "active",
    aiSubtitle: "Guidance channel",
    aiTitle: "Mission Control",
    autoCruise: "Auto Cruise",
    allTargets: "Targets",
    close: "Close",
    clear: "Clear",
    collapseTargets: "Collapse",
    complete: "Complete",
    completed: "completed",
    completeStop: "Complete Stop",
    celestialContext: "Celestial Context",
    celestialContextBody:
      "Celestial Sphere mode shows constellations, the ecliptic, and observation-direction references. It helps connect solar system orbits with the night-sky background.",
    celestialSphere: "Celestial Sphere",
    celestialModeMessage:
      "Celestial reference mode is active. Constellation lines show direction patterns seen from near Earth; they do not mean those stars are physically close together.",
    cockpit: "Cockpit",
    cockpitActive: "Cockpit mode active",
    currentTarget: "Current Target",
    currentTourHint:
      "Current tour is active. Complete a recommended stop mission first for the cleanest route log.",
    detail: "Detail",
    distance: "Distance",
    focusLock: "Focus Lock",
    focus: "Focus",
    freeExplore: "Free Explore",
    freeInstruction:
      "Mission control: free exploration is enabled. Use mouse, trackpad, or WASD / arrow keys. Lock the nearest target when ready.",
    hiddenHudButton: "HUD",
    hidePanel: "Hide Panel",
    expandTargets: "Show Lock Targets",
    enterCockpit: "Enter Cockpit",
    info: "Info",
    keyboard:
      "Keyboard: WASD or arrow keys move in free mode. Shift accelerates, Option slows movement. Double-click a visible body to lock it.",
    layersOpened: "Layer controls opened",
    live: "LIVE",
    lockNearest: "Lock",
    locked: "locked",
    manualNav: "Manual Nav",
    menu: "Menu",
    missionActiveInstruction:
      "Adjust the view and inspect the target region. When finished, mark the mission complete in Mission Board.",
    missionBoard: "Mission Board",
    missionBoardSubtitle:
      "Mission Control has prepared a guided exploration sequence for this target.",
    missionComplete: "Mission complete",
    missionProgress: "Mission Progress",
    missionTargets: "Lock Targets",
    missions: "Missions",
    nextMission: "Next Recommended Mission",
    objectBrowser: "Object Browser",
    openPanel: "Open Panel",
    paused: "Paused",
    readMore: "Read More",
    related: "Related",
    resetDone: "Overview restored",
    search: "Search",
    searchPlaceholder: "Search Neptune, Pluto, Kuiper Belt...",
    searchTargets: "Targets",
    settings: "Settings",
    settingsOpened: "Settings opened",
    share: "Share",
    shortcuts: "Keyboard Shortcuts",
    showLabels: "Show Labels",
    showAsteroidBelt: "Show Asteroid Belt",
    showConstellations: "Show Constellations",
    showEcliptic: "Show Ecliptic Plane",
    showKuiperBelt: "Show Kuiper Belt",
    showMoons: "Show Major Moons",
    showOrbits: "Show Orbits",
    showProbes: "Show Probes",
    showStars: "Show Stars",
    showZodiac: "Show Zodiac Markers",
    simMode: "Simulation Mode",
    solarSystemMode: "Solar System",
    sourceBody:
      "Visual references may use public NASA/JPL resources or local educational textures. Argonaut is an independent educational prototype and is not affiliated with or endorsed by NASA.",
    sources: "Sources / Credits",
    speed: "Speed",
    standard: "Standard",
    start: "Start Mission",
    startRecommended: "Start Recommended Mission",
    status: "Status",
    stats: "Stats",
    step: "Step",
    targetTrayHint: "Horizontal scroll",
    type: "Type",
    view: "View",
    viewMode: "View Mode",
    visualMode: "Visual Mode",
    visualModeBody: "Local textures when available / procedural fallback",
    welcomeBody:
      "Begin with one guided mission. Mission Control will give you three steps, track progress, and write your observations into the Captain's Log.",
    welcomeSkip: "Explore Freely",
    welcomeTitle: "Welcome aboard",
    explorationLog: "Captain's Log",
    captainLog: "Captain's Log",
    archives: "Archives",
    archiveCatalog: "Mission Archives",
    archiveDisclaimer:
      "Mission routes are simplified educational visualizations, not precise flight dynamics.",
    archiveExpeditionActive: "Expedition Active",
    archiveExpeditionComplete: "Expedition Complete",
    archiveRouteLoaded: "Mission Route Loaded",
    aboutPrototype: "About Prototype",
    clearRoute: "Clear Route",
    completeExpedition: "Complete Expedition",
    discoveryCards: "Discovery Cards",
    focusWaypoint: "Focus Waypoint",
    keyDiscoveries: "Key Discoveries",
    missionArchives: "Mission Archives",
    nextWaypoint: "Next Waypoint",
    previousWaypoint: "Previous Waypoint",
    primaryTargets: "Primary Targets",
    relatedArchives: "Related Archives",
    routes: "Routes",
    resetView: "Reset View",
    showMissionRoutes: "Show Mission Routes",
    startExpedition: "Start Expedition",
    toggleHud: "Toggle HUD",
    viewRoute: "View Route",
    waypoint: "Waypoint",
    previous: "Previous",
    next: "Next",
    exitTour: "Exit Tour",
    exitCockpit: "Exit Cockpit",
    focusStop: "Focus Current Stop",
    jumpToStop: "Jump to Stop",
    journeyProgress: "Journey Progress",
    nextStop: "Next Stop",
    noLog: "No mission events yet.",
    recommendedForTour: "Recommended for current tour stop",
    restartTour: "Restart Tour",
    solarSystemOverview: "Overview",
    startTour: "Start Tour",
    stopComplete: "Stop complete",
    stopCount: "stops",
    stopLabel: "Stop",
    tour: "Tour",
    tourActive: "Tour Active",
    tourActiveLabel: "TOUR ACTIVE",
    tourCatalog: "Tour Catalog",
    tourCatalogBody: "Route-based exploration chapters for the solar system.",
    tourComplete:
      "Grand Tour complete. You have completed a full solar system journey.",
    tourCompleteLabel: "TOUR COMPLETE",
    tourInstruction:
      "Lock the current stop and complete at least one recommended mission, or mark the stop complete and continue.",
    upcoming: "upcoming",
    controlSensitivity: "Control Sensitivity",
    low: "Low",
    high: "High",
    diameter: "Diameter",
    orbitalPeriod: "Orbital Period",
    notableFeatures: "Notable Features",
  },
  zh: {
    about:
      "寰宇星舟是一个独立教育原型，用于任务引导式太阳系探索，不隶属于 NASA，也不代表 NASA 背书。",
    active: "进行中",
    aiSubtitle: "引导频道",
    aiTitle: "任务控制",
    autoCruise: "自动巡航",
    allTargets: "目标",
    close: "关闭",
    clear: "清除",
    collapseTargets: "收起",
    complete: "完成",
    completed: "已完成",
    completeStop: "完成本站",
    celestialContext: "天球参考",
    celestialContextBody:
      "天球模式用于显示星座、黄道和观测方向参考。它帮助你理解太阳系轨道与夜空背景之间的关系。",
    celestialSphere: "天球模式",
    celestialModeMessage:
      "已进入天球参考模式。星座线展示的是从地球附近观察到的方向图案，并不代表恒星之间真实距离相近。",
    cockpit: "驾驶舱",
    cockpitActive: "驾驶舱模式已启动",
    currentTarget: "当前目标",
    currentTourHint: "当前正在进行路线探索。建议先完成本站推荐任务，再记录本站完成。",
    detail: "详情",
    distance: "距离",
    focusLock: "目标锁定",
    focus: "聚焦",
    freeExplore: "自由探索",
    freeInstruction:
      "任务控制：自由探索模式已启用。可使用鼠标、触控板或 WASD / 方向键移动，靠近目标后锁定最近星体。",
    hiddenHudButton: "HUD",
    hidePanel: "隐藏面板",
    expandTargets: "展开锁定目标",
    enterCockpit: "进入驾驶舱",
    info: "信息",
    keyboard:
      "快捷键：自由模式下使用 WASD 或方向键移动，Shift 加速，Option 减速。双击可见天体可直接锁定。",
    layersOpened: "图层控制已打开",
    live: "实时",
    lockNearest: "锁定",
    locked: "锁定",
    manualNav: "手动导航",
    menu: "菜单",
    missionActiveInstruction:
      "请调整视角并观察目标区域。完成后在任务板中点击“完成”标记任务完成。",
    missionBoard: "任务板",
    missionBoardSubtitle: "任务控制已为当前目标准备任务引导序列。",
    missionComplete: "任务完成",
    missionProgress: "任务进度",
    missionTargets: "锁定目标",
    missions: "任务",
    nextMission: "推荐下一任务",
    objectBrowser: "目标浏览器",
    openPanel: "打开面板",
    paused: "暂停",
    readMore: "查看详情",
    related: "相关对象",
    resetDone: "总览视角已恢复",
    search: "搜索",
    searchPlaceholder: "搜索 海王星、冥王星、柯伊伯带...",
    searchTargets: "目标",
    settings: "设置",
    settingsOpened: "设置面板已打开",
    share: "分享",
    shortcuts: "键盘快捷键",
    showLabels: "显示标签",
    showAsteroidBelt: "显示小行星带",
    showConstellations: "显示星座线",
    showEcliptic: "显示黄道面",
    showKuiperBelt: "显示柯伊伯带",
    showMoons: "显示主要卫星",
    showOrbits: "显示轨道",
    showProbes: "显示探测器",
    showStars: "显示星空",
    showZodiac: "显示黄道星座",
    simMode: "模拟模式",
    solarSystemMode: "太阳系",
    sourceBody:
      "视觉贴图可使用公开 NASA/JPL 资源或本地教育用途贴图。寰宇星舟是独立教育原型，不隶属于 NASA，也不代表 NASA 背书。",
    sources: "来源 / 署名",
    speed: "速度",
    standard: "标准",
    start: "开始任务",
    startRecommended: "开始推荐任务",
    status: "状态",
    stats: "参数",
    step: "步骤",
    targetTrayHint: "可横向滑动",
    type: "类型",
    view: "视图",
    viewMode: "视图模式",
    visualMode: "视觉模式",
    visualModeBody: "本地贴图优先 / 缺失时程序化回退",
    welcomeBody:
      "先完成一个引导任务。任务控制会给你 3 个步骤，记录进度，并把观察结果写入航行日志。",
    welcomeSkip: "先自由探索",
    welcomeTitle: "欢迎登舰",
    explorationLog: "航行日志",
    captainLog: "航行日志",
    archives: "档案",
    archiveCatalog: "任务档案馆",
    archiveDisclaimer:
      "任务路线是简化教育可视化，不代表精确飞行动力学或真实轨道。",
    archiveExpeditionActive: "远征进行中",
    archiveExpeditionComplete: "远征完成",
    archiveRouteLoaded: "任务路线已载入",
    aboutPrototype: "关于原型",
    clearRoute: "清除路线",
    completeExpedition: "完成远征",
    discoveryCards: "发现卡片",
    focusWaypoint: "聚焦航点",
    keyDiscoveries: "关键发现",
    missionArchives: "任务档案馆",
    nextWaypoint: "下一航点",
    previousWaypoint: "上一航点",
    primaryTargets: "主要目标",
    relatedArchives: "相关任务档案",
    routes: "航线",
    resetView: "太阳系总览",
    showMissionRoutes: "显示任务路线",
    startExpedition: "启动远征",
    toggleHud: "切换界面",
    viewRoute: "查看路线",
    waypoint: "航点",
    previous: "上一项",
    next: "下一项",
    exitTour: "退出路线",
    exitCockpit: "退出驾驶舱",
    focusStop: "聚焦本站",
    jumpToStop: "跳转站点",
    journeyProgress: "旅程进度",
    nextStop: "下一站",
    noLog: "暂无任务记录。",
    recommendedForTour: "当前路线本站推荐",
    restartTour: "重新开始",
    solarSystemOverview: "总览",
    startTour: "启动路线",
    stopComplete: "本站已记录",
    tour: "路线",
    tourActive: "路线进行中",
    tourCatalog: "路线目录",
    stopCount: "站",
    stopLabel: "站点",
    tourActiveLabel: "路线进行中",
    tourCatalogBody: "按章节组织的太阳系探索路线。",
    tourComplete: "太阳系大巡航完成。你已经完成一次完整太阳系路线。",
    tourCompleteLabel: "路线完成",
    tourInstruction:
      "请锁定当前目标并完成至少一个推荐任务，或直接标记本站完成后前往下一站。",
    upcoming: "未到达",
    controlSensitivity: "控制灵敏度",
    low: "低",
    high: "高",
    diameter: "直径",
    orbitalPeriod: "轨道周期",
    notableFeatures: "主要特征",
  },
} satisfies Record<Language, Record<string, string>>;

const TARGET_SUGGESTIONS: Record<Language, Record<SelectedTarget, string>> = {
  en: {
    "asteroid-belt":
      "Recommendation: map the rocky debris band between Mars and Jupiter and use Ceres as the concrete reference point.",
    "kuiper-belt":
      "Recommendation: inspect the icy frontier beyond Neptune as the home region for dwarf planets and comet-like bodies.",
    ceres:
      "Recommendation: lock Ceres to understand the largest object embedded inside the asteroid belt.",
    sun:
      "Recommendation: use the Sun as a light-source anchor, then compare the inner planet orbits around it.",
    mercury:
      "Recommendation: inspect Mercury as the innermost rocky reference point near the solar light source.",
    venus:
      "Recommendation: observe Venus' cloud deck and compare it with Earth as another terrestrial planet.",
    earth:
      "Recommendation: begin with the Earth-Moon system and inspect the Moon orbit plus atmospheric glow.",
    moon:
      "Recommendation: inspect lunar maria and keep Earth direction as the navigation reference.",
    mars: "Recommendation: start a Mars terrain scan mission.",
    jupiter:
      "Recommendation: observe Jupiter's cloud bands and immense gas giant scale.",
    neptune:
      "Recommendation: observe Neptune's deep blue atmosphere and Triton direction to understand the outer ice giants.",
    pluto:
      "Recommendation: treat Pluto as a Kuiper Belt object rather than a classical major planet.",
    saturn:
      "Recommendation: approach Saturn's rings and start a ring-system scan.",
    uranus:
      "Recommendation: observe Uranus' tilted rotation axis, one of its most distinctive features.",
  },
  zh: {
    "asteroid-belt":
      "建议观察火星与木星之间的小行星带，理解太阳系形成后留下的岩石碎片。",
    "kuiper-belt":
      "建议观察海王星外侧的冰体带，它是许多矮行星和彗星的家园。",
    ceres: "建议锁定谷神星，理解小行星带中最大天体与区域点云的关系。",
    sun: "建议把太阳作为光源锚点，观察内侧行星轨道围绕它展开的关系。",
    mercury: "建议观察水星作为最内侧岩质行星的尺度和近太阳光照环境。",
    venus: "建议观察金星云层，并把它与地球作为类地行星进行对比。",
    earth: "建议从地月系统开始，观察月球轨道和地球大气层。",
    moon: "建议观察月海，并以地球方向作为导航参考。",
    mars: "建议启动火星地貌扫描任务。",
    jupiter: "建议观察木星云带和巨大尺度。",
    neptune: "建议观察海王星深蓝色大气和 Triton 方向，理解外太阳系冰巨星。",
    pluto: "建议把冥王星作为柯伊伯带天体观察，而不是传统九大行星。",
    saturn: "建议靠近土星环，启动环系统扫描。",
    uranus: "建议观察天王星倾斜的自转轴，这是它最独特的特征之一。",
  },
};

export default function Hud({
  activePanel,
  cameraMode,
  completedMissionIds,
  controlSensitivity,
  detailOpen,
  experienceMode,
  explorationLog,
  explorationPoint,
  hudMode,
  language,
  menuOpen,
  missionStepIndex,
  nearestTarget,
  searchOpen,
  selectedMissionId,
  selectedTarget,
  shareToast,
  simMode,
  activeTourId,
  activeTourStopIndex,
  archiveExpeditionMode,
  completedTourStopIds,
  currentArchiveWaypointIndex,
  selectedArchiveMissionId,
  tourMode,
  tourPanelOpen,
  viewLayers,
  viewMode,
  welcomeOpen,
  onAdvanceMissionStep,
  onCameraCommand,
  onClearArchiveRoute,
  onCompleteArchiveExpedition,
  onCompleteMission,
  onCompleteTourStop,
  onDismissWelcome,
  onEnterCockpit,
  onExitTour,
  onExitCockpit,
  onFocusArchiveWaypoint,
  onFocusTourStop,
  onJumpToTourStop,
  onNextArchiveWaypoint,
  onNextTourStop,
  onOpenArchivesPanel,
  onOpenViewPanel,
  onPreviousArchiveWaypoint,
  onRelatedItem,
  onRestartTour,
  onSelectArchiveWaypoint,
  onSelectSearchArchive,
  onSelectSearchTarget,
  onShareView,
  onStartArchiveExpedition,
  onStartMission,
  onStartRecommendedMission,
  onStartTour,
  onStartTourRecommendedMission,
  onToast,
  onToggleCameraMode,
  onToggleFullscreen,
  onToggleHudMode,
  onViewArchiveRoute,
  setActivePanel,
  setControlSensitivity,
  setDetailOpen,
  setHudMode,
  setLanguage,
  setMenuOpen,
  setSearchOpen,
  setSelectedTarget,
  setSimMode,
  setViewLayers,
  setViewMode,
}: HudProps) {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuNotice, setMenuNotice] = useState<string | null>(null);
  const copy = COPY[language];
  const targetInfo = SPACE_OBJECTS[selectedTarget];
  const targetLabel = targetInfo.name[language];
  const nearestTargetLabel = SPACE_OBJECTS[nearestTarget].name[language];
  const recommendedMission = getRecommendedMission(
    selectedTarget,
    completedMissionIds,
  );
  const activeTour = getTourById(activeTourId);
  const selectedArchiveMission = getArchiveMissionById(selectedArchiveMissionId);
  const cockpitActive = experienceMode === "cockpit";
  const cameraModeTargetLabel = cockpitActive ? targetLabel : nearestTargetLabel;

  function openViewPanelWithFeedback(message: string) {
    setHudMode("full");
    setLeftPanelCollapsed(false);
    onOpenViewPanel();
    onToast(message);
  }

  function cycleSimMode() {
    const nextMode =
      simMode === "REAL RATE"
        ? "CRUISE MODE"
        : simMode === "CRUISE MODE"
          ? "PAUSED"
          : "REAL RATE";
    setSimMode(nextMode);
    onToast(`${copy.simMode}: ${formatSimMode(nextMode, language)}`);
  }

  if (hudMode === "hidden") {
    return (
      <div className="pointer-events-none fixed inset-0 z-20">
        <button
          type="button"
          onClick={onToggleHudMode}
          className="pointer-events-auto absolute right-4 top-4 border border-cyan-300/40 bg-black/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.22)] backdrop-blur-md transition hover:border-cyan-200"
        >
          {copy.hiddenHudButton}
        </button>
        <button
          type="button"
          onClick={
            experienceMode === "cockpit" ? onExitCockpit : onEnterCockpit
          }
          className="pointer-events-auto absolute right-4 top-16 border border-cyan-300/30 bg-black/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.18)] backdrop-blur-md transition hover:border-cyan-200"
        >
          {experienceMode === "cockpit" ? copy.exitCockpit : copy.cockpit}
        </button>
        <Toast message={shareToast} />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-20 text-slate-100">
      {hudMode === "full" ? (
        <TopNavigation
          cameraMode={cameraMode}
          copy={copy}
          currentTargetLabel={targetLabel}
          hudMode={hudMode}
          language={language}
          menuOpen={menuOpen}
          menuNotice={menuNotice}
          nearestTargetLabel={cameraModeTargetLabel}
          onCameraCommand={onCameraCommand}
          onMenuNotice={setMenuNotice}
          onOpenLog={() => {
            setHudMode("full");
            setLeftPanelCollapsed(false);
            setActivePanel("missions");
            onToast(copy.captainLog);
          }}
          onSearch={() => {
            setSearchOpen(!searchOpen);
            setMenuOpen(false);
          }}
          onShareView={onShareView}
          onToggleCameraMode={onToggleCameraMode}
          onToggleHudMode={onToggleHudMode}
          onToggleLanguage={() => setLanguage(language === "zh" ? "en" : "zh")}
          setMenuOpen={setMenuOpen}
        />
      ) : (
        <MinimalNavigation
          cameraMode={cameraMode}
          copy={copy}
          currentTargetLabel={targetLabel}
          hudMode={hudMode}
          language={language}
          nearestTargetLabel={cameraModeTargetLabel}
          onToggleCameraMode={onToggleCameraMode}
          onToggleHudMode={onToggleHudMode}
          onToggleLanguage={() => setLanguage(language === "zh" ? "en" : "zh")}
        />
      )}

      {searchOpen ? (
        <SearchOverlay
          copy={copy}
          language={language}
          query={searchQuery}
          setQuery={setSearchQuery}
          onClose={() => setSearchOpen(false)}
          onSelectArchive={onSelectSearchArchive}
          onSelectTarget={onSelectSearchTarget}
        />
      ) : null}

      {welcomeOpen ? (
        <WelcomeOverlay
          copy={copy}
          language={language}
          recommendedMission={recommendedMission}
          onDismiss={onDismissWelcome}
          onStartRecommendedMission={onStartRecommendedMission}
        />
      ) : null}

      {hudMode === "full" && !cockpitActive ? (
        <>
          <LeftPanel
            activePanel={activePanel}
            activeTour={activeTour}
            activeTourStopIndex={activeTourStopIndex}
            collapsed={leftPanelCollapsed}
            completedMissionIds={completedMissionIds}
            completedTourStopIds={completedTourStopIds}
            controlSensitivity={controlSensitivity}
            copy={copy}
            detailOpen={detailOpen}
            explorationLog={explorationLog}
            explorationPoint={explorationPoint}
            language={language}
            missionStepIndex={missionStepIndex}
            recommendedMission={recommendedMission}
            selectedArchiveMission={selectedArchiveMission}
            archiveExpeditionMode={archiveExpeditionMode}
            currentArchiveWaypointIndex={currentArchiveWaypointIndex}
            selectedMissionId={selectedMissionId}
            selectedTarget={selectedTarget}
            simMode={simMode}
            tourMode={tourMode}
            viewLayers={viewLayers}
            viewMode={viewMode}
            onAdvanceMissionStep={onAdvanceMissionStep}
            onClearArchiveRoute={onClearArchiveRoute}
            onCompleteArchiveExpedition={onCompleteArchiveExpedition}
            onCompleteMission={onCompleteMission}
            onCompleteTourStop={onCompleteTourStop}
            onExitTour={onExitTour}
            onFocusArchiveWaypoint={onFocusArchiveWaypoint}
            onFocusTourStop={onFocusTourStop}
            onJumpToTourStop={onJumpToTourStop}
            onNextArchiveWaypoint={onNextArchiveWaypoint}
            onNextTourStop={onNextTourStop}
            onPreviousArchiveWaypoint={onPreviousArchiveWaypoint}
            onRelatedItem={onRelatedItem}
            onRestartTour={onRestartTour}
            onSelectArchiveWaypoint={onSelectArchiveWaypoint}
            onStartMission={onStartMission}
            onStartArchiveExpedition={onStartArchiveExpedition}
            onStartTour={onStartTour}
            onStartTourRecommendedMission={onStartTourRecommendedMission}
            onSelectTarget={setSelectedTarget}
            onViewArchiveRoute={onViewArchiveRoute}
            setActivePanel={setActivePanel}
            setCollapsed={setLeftPanelCollapsed}
            setControlSensitivity={setControlSensitivity}
            setDetailOpen={setDetailOpen}
            setSimMode={setSimMode}
            setViewLayers={setViewLayers}
            setViewMode={setViewMode}
          />
          <RightToolbar
            copy={copy}
            experienceMode={experienceMode}
            language={language}
            onEnterCockpit={onEnterCockpit}
            onExitCockpit={onExitCockpit}
            onFullscreen={onToggleFullscreen}
            onOpenLayers={() => openViewPanelWithFeedback(copy.layersOpened)}
            onOpenRoutes={() => {
              setLeftPanelCollapsed(false);
              onOpenArchivesPanel();
            }}
            onOpenSettings={() => openViewPanelWithFeedback(copy.settingsOpened)}
            onTriggerCommand={(command) => {
              onCameraCommand(command);
              onToast(commandToToast(command, language));
            }}
          />
          <AssistantPanel
            cameraMode={cameraMode}
            experienceMode={experienceMode}
            activeTour={activeTour}
            activeTourStopIndex={activeTourStopIndex}
            completedMissionIds={completedMissionIds}
            completedTourStopIds={completedTourStopIds}
            copy={copy}
            currentArchiveWaypointIndex={currentArchiveWaypointIndex}
            explorationPoint={explorationPoint}
            language={language}
            missionStepIndex={missionStepIndex}
            archiveExpeditionMode={archiveExpeditionMode}
            selectedArchiveMission={selectedArchiveMission}
            onClearArchiveRoute={onClearArchiveRoute}
            onCompleteArchiveExpedition={onCompleteArchiveExpedition}
            onFocusArchiveWaypoint={onFocusArchiveWaypoint}
            onNextArchiveWaypoint={onNextArchiveWaypoint}
            onPreviousArchiveWaypoint={onPreviousArchiveWaypoint}
            onStartArchiveExpedition={onStartArchiveExpedition}
            onEnterCockpit={onEnterCockpit}
            onExitCockpit={onExitCockpit}
            onCompleteTourStop={onCompleteTourStop}
            onFocusTourStop={onFocusTourStop}
            onNextTourStop={onNextTourStop}
            selectedMissionId={selectedMissionId}
            selectedTarget={selectedTarget}
            tourMode={tourMode}
            viewMode={viewMode}
          />
          <SubtleCrosshair />
          {detailOpen ? (
            <DetailDrawer
              copy={copy}
              language={language}
              selectedTarget={selectedTarget}
              onClose={() => setDetailOpen(false)}
            />
          ) : null}
        </>
      ) : null}

      {hudMode === "full" && cockpitActive ? (
        <RightToolbar
          copy={copy}
          experienceMode={experienceMode}
          language={language}
          onEnterCockpit={onEnterCockpit}
          onExitCockpit={onExitCockpit}
          onFullscreen={onToggleFullscreen}
          onOpenLayers={() => openViewPanelWithFeedback(copy.layersOpened)}
          onOpenRoutes={() => {
            setLeftPanelCollapsed(false);
            onOpenArchivesPanel();
          }}
          onOpenSettings={() => openViewPanelWithFeedback(copy.settingsOpened)}
          onTriggerCommand={(command) => {
            onCameraCommand(command);
            onToast(commandToToast(command, language));
          }}
        />
      ) : null}

      {!cockpitActive ? (
        <MissionTargets
          cameraMode={cameraMode}
          copy={copy}
          hudMode={hudMode}
          language={language}
          selectedTarget={selectedTarget}
          simMode={simMode}
          setSelectedTarget={setSelectedTarget}
        />
      ) : null}

      {hudMode === "full" && !cockpitActive ? (
        activeTour && tourPanelOpen ? (
          <JourneyProgressBar
            activeTour={activeTour}
            activeTourStopIndex={activeTourStopIndex}
            completedTourStopIds={completedTourStopIds}
            copy={copy}
            language={language}
          />
        ) : null
      ) : null}

      {hudMode === "minimal" && activeTour && !cockpitActive ? (
        <MinimalJourneyStatus
          activeTour={activeTour}
          activeTourStopIndex={activeTourStopIndex}
          language={language}
        />
      ) : null}

      {!cockpitActive ? (
        hudMode === "full" ? (
          <BottomTimeline
            cameraMode={cameraMode}
            copy={copy}
            language={language}
            selectedTarget={selectedTarget}
            simMode={simMode}
            viewMode={viewMode}
            onCycleSimMode={cycleSimMode}
          />
        ) : (
          <MinimalStatus
            cameraMode={cameraMode}
            copy={copy}
            language={language}
            selectedTarget={selectedTarget}
            simMode={simMode}
            viewMode={viewMode}
          />
        )
      ) : null}

      <Toast message={shareToast} />
    </div>
  );
}

function TopNavigation({
  cameraMode,
  copy,
  currentTargetLabel,
  hudMode,
  language,
  menuOpen,
  menuNotice,
  nearestTargetLabel,
  onCameraCommand,
  onMenuNotice,
  onOpenLog,
  onSearch,
  onShareView,
  onToggleCameraMode,
  onToggleHudMode,
  onToggleLanguage,
  setMenuOpen,
}: {
  cameraMode: CameraMode;
  copy: (typeof COPY)[Language];
  currentTargetLabel: string;
  hudMode: HudMode;
  language: Language;
  menuOpen: boolean;
  menuNotice: string | null;
  nearestTargetLabel: string;
  onCameraCommand: (command: CameraCommandType) => void;
  onMenuNotice: (notice: string | null) => void;
  onOpenLog: () => void;
  onSearch: () => void;
  onShareView: () => void;
  onToggleCameraMode: () => void;
  onToggleHudMode: () => void;
  onToggleLanguage: () => void;
  setMenuOpen: (open: boolean) => void;
}) {
  return (
    <header className="pointer-events-auto absolute left-0 top-0 flex h-14 w-full items-center justify-between border-b border-white/10 bg-black/58 px-5 text-sm backdrop-blur-xl">
      <div className="flex items-center gap-6">
        <div className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-100">
          {BRAND_NAME[language]}
        </div>
        <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400 sm:flex">
          <span>{language === "zh" ? "太阳系" : "Solar System"}</span>
          <span className="text-slate-600">&gt;</span>
          <span className="text-emerald-200">{currentTargetLabel}</span>
        </div>
      </div>

      <div className="relative flex items-center gap-2">
        <HeaderButton label={copy.search} onClick={onSearch} />
        <HeaderButton label={copy.share} onClick={onShareView} />
        <HeaderButton
          label={copy.menu}
          onClick={() => {
            setMenuOpen(!menuOpen);
            onMenuNotice(null);
          }}
        />
        <LanguageButton language={language} onClick={onToggleLanguage} />
        <CameraModeButton
          cameraMode={cameraMode}
          copy={copy}
          nearestTargetLabel={nearestTargetLabel}
          onClick={onToggleCameraMode}
        />
        <HudModeButton
          hudMode={hudMode}
          language={language}
          onClick={onToggleHudMode}
        />

        {menuOpen ? (
          <MenuPopover
            copy={copy}
            menuNotice={menuNotice}
            onAbout={() => onMenuNotice(copy.about)}
            onKeyboard={() => onMenuNotice(copy.keyboard)}
            onOpenLog={onOpenLog}
            onReset={() => {
              onCameraCommand("solarSystemOverview");
              onMenuNotice(copy.resetDone);
            }}
            onToggleHud={onToggleHudMode}
          />
        ) : null}
      </div>
    </header>
  );
}

function MinimalNavigation({
  cameraMode,
  copy,
  currentTargetLabel,
  hudMode,
  language,
  nearestTargetLabel,
  onToggleCameraMode,
  onToggleHudMode,
  onToggleLanguage,
}: {
  cameraMode: CameraMode;
  copy: (typeof COPY)[Language];
  currentTargetLabel: string;
  hudMode: HudMode;
  language: Language;
  nearestTargetLabel: string;
  onToggleCameraMode: () => void;
  onToggleHudMode: () => void;
  onToggleLanguage: () => void;
}) {
  return (
    <header className="pointer-events-auto absolute left-1/2 top-4 flex h-11 w-[min(92vw,840px)] -translate-x-1/2 items-center justify-between border border-white/10 bg-black/58 px-4 text-xs backdrop-blur-xl">
      <div className="font-semibold uppercase tracking-[0.28em] text-cyan-100">
        {BRAND_NAME[language]}
      </div>
      <div className="hidden uppercase tracking-[0.2em] text-slate-400 sm:block">
        {language === "zh" ? "太阳系" : "Solar System"}{" "}
        <span className="text-slate-600">&gt;</span>{" "}
        <span className="text-emerald-200">{currentTargetLabel}</span>
      </div>
      <div className="flex items-center gap-2">
        <LanguageButton language={language} onClick={onToggleLanguage} />
        <CameraModeButton
          cameraMode={cameraMode}
          copy={copy}
          nearestTargetLabel={nearestTargetLabel}
          onClick={onToggleCameraMode}
        />
        <HudModeButton
          hudMode={hudMode}
          language={language}
          onClick={onToggleHudMode}
        />
      </div>
    </header>
  );
}

function HeaderButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-950/20 hover:text-cyan-100 active:scale-[0.98]"
    >
      {label}
    </button>
  );
}

function CameraModeButton({
  cameraMode,
  copy,
  nearestTargetLabel,
  onClick,
}: {
  cameraMode: CameraMode;
  copy: (typeof COPY)[Language];
  nearestTargetLabel: string;
  onClick: () => void;
}) {
  const isFree = cameraMode === "free";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition active:scale-[0.98]",
        isFree
          ? "border-emerald-300/45 bg-emerald-950/25 text-emerald-100 shadow-[0_0_18px_rgba(110,231,183,0.12)] hover:border-emerald-200"
          : "border-cyan-300/25 bg-white/[0.03] text-slate-300 hover:border-cyan-300/45 hover:text-cyan-100",
      ].join(" ")}
    >
      {isFree ? `${copy.lockNearest}: ${nearestTargetLabel}` : copy.focusLock}
    </button>
  );
}

function LanguageButton({
  language,
  onClick,
}: {
  language: Language;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300 transition hover:border-emerald-300/40 hover:text-emerald-100 active:scale-[0.98]"
    >
      {language === "zh" ? "EN" : "中文"}
    </button>
  );
}

function HudModeButton({
  hudMode,
  language,
  onClick,
}: {
  hudMode: HudMode;
  language: Language;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-cyan-300/35 bg-cyan-950/20 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-200 active:scale-[0.98]"
    >
      {language === "zh" ? "界面" : "HUD"}: {formatHudMode(hudMode, language)}
    </button>
  );
}

function MenuPopover({
  copy,
  menuNotice,
  onAbout,
  onKeyboard,
  onOpenLog,
  onReset,
  onToggleHud,
}: {
  copy: (typeof COPY)[Language];
  menuNotice: string | null;
  onAbout: () => void;
  onKeyboard: () => void;
  onOpenLog: () => void;
  onReset: () => void;
  onToggleHud: () => void;
}) {
  return (
    <div className="absolute right-0 top-12 w-72 border border-white/10 bg-black/82 p-3 shadow-[0_0_38px_rgba(2,6,23,0.8)] backdrop-blur-2xl">
      {[
        [copy.aboutPrototype, onAbout],
        [copy.shortcuts, onKeyboard],
        [copy.captainLog, onOpenLog],
        [copy.resetView, onReset],
        [copy.toggleHud, onToggleHud],
      ].map(([label, handler]) => (
        <button
          key={label as string}
          type="button"
          onClick={handler as () => void}
          className="mb-2 w-full border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300 transition last:mb-0 hover:border-cyan-300/40 hover:text-cyan-100"
        >
          {label as string}
        </button>
      ))}
      {menuNotice ? (
        <p className="mt-3 border border-cyan-300/20 bg-cyan-950/20 p-3 text-xs leading-5 text-slate-300">
          {menuNotice}
        </p>
      ) : null}
    </div>
  );
}

function SearchOverlay({
  copy,
  language,
  query,
  setQuery,
  onClose,
  onSelectArchive,
  onSelectTarget,
}: {
  copy: (typeof COPY)[Language];
  language: Language;
  query: string;
  setQuery: (query: string) => void;
  onClose: () => void;
  onSelectArchive: (missionId: ArchiveMissionId) => void;
  onSelectTarget: (target: SelectedTarget) => void;
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const results = LOCKABLE_TARGETS.filter((target) => {
    const info = SPACE_OBJECTS[target];
    return (
      !normalizedQuery ||
      info.name.en.toLowerCase().includes(normalizedQuery) ||
      info.name.zh.includes(query.trim())
    );
  });
  const archiveResults = ARCHIVE_MISSIONS.filter((mission) => {
    const aliases = ARCHIVE_SEARCH_ALIASES[mission.id];
    const missionCopy = getArchiveMissionCopy(mission, language);

    return (
      !normalizedQuery ||
      mission.name.toLowerCase().includes(normalizedQuery) ||
      mission.subtitle.toLowerCase().includes(normalizedQuery) ||
      missionCopy.subtitle.toLowerCase().includes(normalizedQuery) ||
      aliases.some((alias) => alias.toLowerCase().includes(normalizedQuery))
    );
  });

  return (
    <div className="pointer-events-auto absolute right-5 top-16 w-[min(92vw,390px)] border border-cyan-300/20 bg-black/78 p-4 shadow-[0_0_36px_rgba(8,145,178,0.2)] backdrop-blur-2xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
          {copy.search}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-400 transition hover:border-cyan-300/40 hover:text-cyan-100"
        >
          {copy.close}
        </button>
      </div>
      <input
        autoFocus
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && results[0]) {
            onSelectTarget(results[0]);
          } else if (event.key === "Enter" && archiveResults[0]) {
            onSelectArchive(archiveResults[0].id);
          }
        }}
        placeholder={copy.searchPlaceholder}
        className="w-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/45"
      />
      <div className="mt-3 grid max-h-[52vh] gap-4 overflow-y-auto">
        <section>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {copy.searchTargets}
          </p>
          <div className="grid gap-2">
            {results.map((target) => (
              <button
                key={target}
                type="button"
                onClick={() => onSelectTarget(target)}
                className="border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs uppercase tracking-[0.18em] text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-950/25 hover:text-cyan-100"
              >
                {SPACE_OBJECTS[target].name[language]}
              </button>
            ))}
          </div>
        </section>
        <section>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {copy.missionArchives}
          </p>
          <div className="grid gap-2">
            {archiveResults.map((mission) => {
              const missionCopy = getArchiveMissionCopy(mission, language);

              return (
              <button
                key={mission.id}
                type="button"
                onClick={() => onSelectArchive(mission.id)}
                className="border border-white/10 bg-white/[0.03] px-3 py-2 text-left transition hover:border-emerald-300/40 hover:bg-emerald-950/18"
              >
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                  {mission.name}
                </span>
                <span className="mt-1 block text-[11px] leading-4 text-slate-500">
                  {missionCopy.subtitle}
                </span>
              </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function WelcomeOverlay({
  copy,
  language,
  recommendedMission,
  onDismiss,
  onStartRecommendedMission,
}: {
  copy: (typeof COPY)[Language];
  language: Language;
  recommendedMission: Mission;
  onDismiss: () => void;
  onStartRecommendedMission: () => void;
}) {
  const recommendedMissionCopy = getMissionCopy(recommendedMission, language);

  return (
    <section className="pointer-events-auto absolute left-1/2 top-24 w-[min(92vw,520px)] -translate-x-1/2 border border-cyan-300/25 bg-black/72 p-5 shadow-[0_0_44px_rgba(8,145,178,0.18)] backdrop-blur-2xl">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
        {BRAND_NAME[language]}
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-wide text-white">
        {copy.welcomeTitle}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        {copy.welcomeBody}
      </p>
      <div className="mt-4 border border-white/10 bg-white/[0.03] p-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">
          {copy.nextMission}
        </p>
        <h2 className="mt-2 text-base font-semibold text-slate-100">
          {recommendedMissionCopy.title}
        </h2>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          {recommendedMissionCopy.objective}
        </p>
      </div>
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onStartRecommendedMission}
          className="border border-cyan-300/45 bg-cyan-950/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100 transition hover:border-cyan-200 active:scale-[0.98]"
        >
          {copy.startRecommended}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 transition hover:border-slate-300/35 hover:text-slate-100 active:scale-[0.98]"
        >
          {copy.welcomeSkip}
        </button>
      </div>
    </section>
  );
}

function LeftPanel({
  activePanel,
  activeTour,
  activeTourStopIndex,
  collapsed,
  completedMissionIds,
  completedTourStopIds,
  controlSensitivity,
  copy,
  detailOpen,
  explorationLog,
  explorationPoint,
  language,
  missionStepIndex,
  recommendedMission,
  selectedArchiveMission,
  archiveExpeditionMode,
  currentArchiveWaypointIndex,
  selectedMissionId,
  selectedTarget,
  simMode,
  tourMode,
  viewLayers,
  viewMode,
  onAdvanceMissionStep,
  onClearArchiveRoute,
  onCompleteArchiveExpedition,
  onCompleteMission,
  onCompleteTourStop,
  onExitTour,
  onFocusArchiveWaypoint,
  onFocusTourStop,
  onJumpToTourStop,
  onNextArchiveWaypoint,
  onNextTourStop,
  onPreviousArchiveWaypoint,
  onRelatedItem,
  onRestartTour,
  onSelectArchiveWaypoint,
  onSelectTarget,
  onStartArchiveExpedition,
  onStartMission,
  onStartTour,
  onStartTourRecommendedMission,
  onViewArchiveRoute,
  setActivePanel,
  setCollapsed,
  setControlSensitivity,
  setDetailOpen,
  setSimMode,
  setViewLayers,
  setViewMode,
}: {
  activePanel: ActivePanel;
  activeTour: Tour | null;
  activeTourStopIndex: number;
  collapsed: boolean;
  completedMissionIds: string[];
  completedTourStopIds: string[];
  controlSensitivity: ControlSensitivity;
  copy: (typeof COPY)[Language];
  detailOpen: boolean;
  explorationLog: ExplorationLogEntry[];
  explorationPoint: ExplorationPoint;
  language: Language;
  missionStepIndex: number;
  recommendedMission: Mission;
  selectedArchiveMission: ArchiveMission | null;
  archiveExpeditionMode: ArchiveExpeditionMode;
  currentArchiveWaypointIndex: number;
  selectedMissionId: string | null;
  selectedTarget: SelectedTarget;
  simMode: SimMode;
  tourMode: TourMode;
  viewLayers: ViewLayerState;
  viewMode: ViewMode;
  onAdvanceMissionStep: () => void;
  onClearArchiveRoute: () => void;
  onCompleteArchiveExpedition: () => void;
  onCompleteMission: (missionId: string) => void;
  onCompleteTourStop: () => void;
  onExitTour: () => void;
  onFocusArchiveWaypoint: () => void;
  onFocusTourStop: () => void;
  onJumpToTourStop: (stopIndex: number) => void;
  onNextArchiveWaypoint: () => void;
  onNextTourStop: () => void;
  onPreviousArchiveWaypoint: () => void;
  onRelatedItem: (item: string) => void;
  onRestartTour: () => void;
  onSelectArchiveWaypoint: (index: number) => void;
  onSelectTarget: (target: SelectedTarget) => void;
  onStartArchiveExpedition: (missionId?: ArchiveMissionId) => void;
  onStartMission: (mission: Mission) => void;
  onStartTour: (tourId: TourId) => void;
  onStartTourRecommendedMission: () => void;
  onViewArchiveRoute: (missionId: ArchiveMissionId) => void;
  setActivePanel: (panel: ActivePanel) => void;
  setCollapsed: (collapsed: boolean) => void;
  setControlSensitivity: (sensitivity: ControlSensitivity) => void;
  setDetailOpen: (open: boolean) => void;
  setSimMode: (mode: SimMode) => void;
  setViewLayers: (layers: ViewLayerState) => void;
  setViewMode: (mode: ViewMode) => void;
}) {
  const tabScrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeTab =
      tabScrollerRef.current?.querySelector<HTMLButtonElement>(
        `[data-panel="${activePanel}"]`,
      );

    activeTab?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activePanel, collapsed]);

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="pointer-events-auto absolute left-4 top-20 border border-cyan-300/55 bg-black/65 px-3 py-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.18)] backdrop-blur-xl transition hover:border-cyan-200 hover:bg-cyan-950/35"
        style={{ writingMode: "vertical-rl" }}
      >
        {copy.openPanel}
      </button>
    );
  }

  return (
    <aside className="pointer-events-auto absolute left-4 top-16 flex max-h-[calc(100vh-150px)] w-[330px] flex-col border border-white/10 bg-black/68 shadow-[0_0_38px_rgba(15,23,42,0.72)] backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
          {copy.objectBrowser}
        </p>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="border border-cyan-300/25 bg-cyan-950/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-cyan-100 transition hover:border-cyan-200"
        >
          {copy.hidePanel}
        </button>
      </div>

      <div className="relative border-b border-white/10">
        <div
          ref={tabScrollerRef}
          className="flex overflow-x-auto overscroll-x-contain [scrollbar-color:rgba(34,211,238,0.45)_rgba(15,23,42,0.35)] [scrollbar-width:thin]"
        >
          {(
            ["info", "missions", "tour", "archives", "view"] as ActivePanel[]
          ).map((panel) => (
            <button
              key={panel}
              type="button"
              data-panel={panel}
              onClick={() => setActivePanel(panel)}
              className={[
                "min-w-[104px] shrink-0 whitespace-nowrap border-r border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition last:border-r-0",
                activePanel === panel
                  ? "bg-cyan-950/35 text-cyan-100"
                  : "text-slate-400 hover:text-slate-100",
              ].join(" ")}
            >
              {getPanelLabel(panel, copy)}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/80 to-transparent" />
      </div>

      <div className="overflow-y-auto p-4">
        {activePanel === "info" ? (
          <InfoTab
            copy={copy}
            detailOpen={detailOpen}
            explorationPoint={explorationPoint}
            language={language}
            selectedTarget={selectedTarget}
            viewMode={viewMode}
            onRelatedItem={onRelatedItem}
            onViewArchiveRoute={onViewArchiveRoute}
            setDetailOpen={setDetailOpen}
          />
        ) : activePanel === "missions" ? (
          <MissionsTab
            completedMissionIds={completedMissionIds}
            copy={copy}
            explorationLog={explorationLog}
            language={language}
            missionStepIndex={missionStepIndex}
            recommendedMission={recommendedMission}
            selectedMissionId={selectedMissionId}
            selectedTarget={selectedTarget}
            onAdvanceMissionStep={onAdvanceMissionStep}
            onCompleteMission={onCompleteMission}
            onStartMission={onStartMission}
            tourStop={activeTour?.stops[activeTourStopIndex] ?? null}
          />
        ) : activePanel === "tour" ? (
          <TourTab
            activeTour={activeTour}
            activeTourStopIndex={activeTourStopIndex}
            completedTourStopIds={completedTourStopIds}
            copy={copy}
            language={language}
            tourMode={tourMode}
            onCompleteTourStop={onCompleteTourStop}
            onExitTour={onExitTour}
            onFocusTourStop={onFocusTourStop}
            onJumpToTourStop={onJumpToTourStop}
            onNextTourStop={onNextTourStop}
            onRestartTour={onRestartTour}
            onStartTour={onStartTour}
            onStartTourRecommendedMission={onStartTourRecommendedMission}
          />
        ) : activePanel === "archives" ? (
          <ArchivesTab
            archiveExpeditionMode={archiveExpeditionMode}
            copy={copy}
            currentArchiveWaypointIndex={currentArchiveWaypointIndex}
            language={language}
            selectedArchiveMission={selectedArchiveMission}
            onClearArchiveRoute={onClearArchiveRoute}
            onCompleteArchiveExpedition={onCompleteArchiveExpedition}
            onFocusArchiveWaypoint={onFocusArchiveWaypoint}
            onNextArchiveWaypoint={onNextArchiveWaypoint}
            onPreviousArchiveWaypoint={onPreviousArchiveWaypoint}
            onSelectArchiveWaypoint={onSelectArchiveWaypoint}
            onSelectTarget={onSelectTarget}
            onStartArchiveExpedition={onStartArchiveExpedition}
            onViewArchiveRoute={onViewArchiveRoute}
          />
        ) : (
          <ViewTab
            controlSensitivity={controlSensitivity}
            copy={copy}
            language={language}
            simMode={simMode}
            viewLayers={viewLayers}
            viewMode={viewMode}
            setControlSensitivity={setControlSensitivity}
            setSimMode={setSimMode}
            setViewLayers={setViewLayers}
            setViewMode={setViewMode}
          />
        )}
      </div>
    </aside>
  );
}

function getPanelLabel(panel: ActivePanel, copy: (typeof COPY)[Language]) {
  if (panel === "info") return copy.info;
  if (panel === "missions") return copy.missions;
  if (panel === "tour") return copy.tour;
  if (panel === "archives") return copy.archives;
  return copy.view;
}

function InfoTab({
  copy,
  explorationPoint,
  language,
  selectedTarget,
  viewMode,
  onRelatedItem,
  onViewArchiveRoute,
  setDetailOpen,
}: {
  copy: (typeof COPY)[Language];
  detailOpen: boolean;
  explorationPoint: ExplorationPoint;
  language: Language;
  selectedTarget: SelectedTarget;
  viewMode: ViewMode;
  onRelatedItem: (item: string) => void;
  onViewArchiveRoute: (missionId: ArchiveMissionId) => void;
  setDetailOpen: (open: boolean) => void;
}) {
  const info = SPACE_OBJECTS[selectedTarget];
  const relatedArchives = getArchiveMissionsForTarget(selectedTarget);

  return (
    <div>
      <div className="border-b border-white/10 pb-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-emerald-200">
          {copy.currentTarget}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-wide text-white">
            {info.name[language]}
          </h1>
          <span className="border border-emerald-300/30 bg-emerald-950/20 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-100">
            {copy.locked}
          </span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
          {info.type[language]}
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          {info.shortDescription[language]}
        </p>
        <button
          type="button"
          onClick={() => setDetailOpen(true)}
          className="mt-4 border border-cyan-300/30 bg-cyan-950/20 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-200 active:scale-[0.98]"
        >
          {copy.readMore}
        </button>
      </div>

      {selectedTarget === "mars" && explorationPoint ? (
        <div className="mt-4 border border-red-300/25 bg-red-950/20 p-3">
          <p className="text-[10px] uppercase tracking-[0.24em] text-red-200">
            {language === "zh" ? "火星探索点" : "Mars Site"}
          </p>
          <h2 className="mt-2 text-base font-semibold text-cyan-100">
            {EXPLORATION_LABELS_LOCALIZED[language][explorationPoint]}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {EXPLORATION_DETAILS_LOCALIZED[language][explorationPoint]}
          </p>
        </div>
      ) : null}

      {viewMode === "celestial-sphere" ? (
        <div className="mt-4 border border-cyan-300/20 bg-cyan-950/15 p-3">
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-100">
            {copy.celestialContext}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {copy.celestialContextBody}
          </p>
        </div>
      ) : null}

      <div className="mt-5">
        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
          {copy.related}
        </p>
        <div className="mt-3 grid gap-2">
          {info.related[language].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onRelatedItem(item)}
              className="border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs uppercase tracking-[0.16em] text-slate-300 transition hover:border-cyan-300/35 hover:text-cyan-100"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 border border-white/10 bg-black/30 p-3 text-[11px] leading-5 text-slate-500">
        {relatedArchives.length > 0 ? (
          <span className="mb-5 block">
            <span className="mb-2 block font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.relatedArchives}
            </span>
            <span className="grid gap-2">
              {relatedArchives.slice(0, 6).map((mission) => (
                <button
                  key={mission.id}
                  type="button"
                  onClick={() => onViewArchiveRoute(mission.id)}
                  className="w-full border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-[10px] uppercase tracking-[0.14em] text-slate-300 transition hover:border-emerald-300/40 hover:text-emerald-100"
                >
                  {mission.name}
                </button>
              ))}
            </span>
          </span>
        ) : null}
        <span className="mb-1 block font-semibold uppercase tracking-[0.18em] text-slate-400">
          {copy.sources}
        </span>
        {copy.sourceBody}
      </div>
    </div>
  );
}

function MissionsTab({
  completedMissionIds,
  copy,
  explorationLog,
  language,
  missionStepIndex,
  recommendedMission,
  selectedMissionId,
  selectedTarget,
  tourStop,
  onAdvanceMissionStep,
  onCompleteMission,
  onStartMission,
}: {
  completedMissionIds: string[];
  copy: (typeof COPY)[Language];
  explorationLog: ExplorationLogEntry[];
  language: Language;
  missionStepIndex: number;
  recommendedMission: Mission;
  selectedMissionId: string | null;
  selectedTarget: SelectedTarget;
  tourStop: TourStop | null;
  onAdvanceMissionStep: () => void;
  onCompleteMission: (missionId: string) => void;
  onStartMission: (mission: Mission) => void;
}) {
  const missions = getMissionsForTarget(selectedTarget);
  const selectedMission = getMissionById(selectedMissionId);
  const selectedMissionSteps = selectedMission
    ? getMissionSteps(selectedMission, language)
    : [];
  const selectedMissionCompleted = selectedMission
    ? completedMissionIds.includes(selectedMission.id)
    : false;
  const completedCount = completedMissionIds.length;
  const totalCount = MISSIONS.length;

  return (
    <div className="grid gap-3">
      <div className="border border-cyan-300/20 bg-cyan-950/15 p-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
          {copy.missionBoard}
        </h2>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          {copy.missionBoardSubtitle}
        </p>
      </div>

      <MissionProgress
        completedCount={completedCount}
        copy={copy}
        totalCount={totalCount}
      />

      {tourStop ? (
        <div className="border border-emerald-300/20 bg-emerald-950/12 p-3 text-xs leading-5 text-emerald-100/80">
          {copy.currentTourHint}
        </div>
      ) : null}

      {selectedMission ? (
        <ActiveMissionStepCard
          completed={completedMissionIds.includes(selectedMission.id)}
          copy={copy}
          language={language}
          mission={selectedMission}
          missionStepIndex={missionStepIndex}
          steps={selectedMissionSteps}
          onAdvanceMissionStep={onAdvanceMissionStep}
          onCompleteMission={onCompleteMission}
        />
      ) : (
        <RecommendedMissionCard
          copy={copy}
          language={language}
          mission={recommendedMission}
          onStartMission={onStartMission}
        />
      )}

      {selectedMission && selectedMissionCompleted ? (
        <RecommendedMissionCard
          copy={copy}
          language={language}
          mission={recommendedMission}
          onStartMission={onStartMission}
        />
      ) : null}

      {missions.map((mission) => {
        const missionCopy = getMissionCopy(mission, language);
        const status = getMissionStatus(
          mission.id,
          selectedMissionId,
          completedMissionIds,
        );
        const recommendedForTour =
          tourStop?.recommendedMissionIds.includes(mission.id) ?? false;

        return (
          <article
            key={mission.id}
            className={[
              "border p-3 transition",
              recommendedForTour
                ? "border-emerald-300/35 bg-emerald-950/14"
                : status === "active"
                ? "border-cyan-300/45 bg-cyan-950/22 shadow-[0_0_22px_rgba(34,211,238,0.12)]"
                : status === "completed"
                  ? "border-emerald-300/35 bg-emerald-950/14"
                  : "border-white/10 bg-white/[0.03]",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-100">
                {missionCopy.title}
              </h3>
              <span
                className={[
                  "border px-2 py-1 text-[9px] uppercase tracking-[0.14em]",
                  status === "active"
                    ? "border-cyan-300/45 text-cyan-100"
                    : status === "completed"
                      ? "border-emerald-300/45 text-emerald-100"
                      : "border-white/10 text-slate-500",
                ].join(" ")}
              >
                {status === "active"
                  ? copy.active
                  : status === "completed"
                    ? copy.completed
                    : copy.locked}
              </span>
            </div>
            {recommendedForTour ? (
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                {copy.recommendedForTour}
              </p>
            ) : null}
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {missionCopy.description}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              {missionCopy.objective}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => onStartMission(mission)}
                className="border border-cyan-300/30 bg-cyan-950/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-200 active:scale-[0.98]"
              >
                {copy.start}
              </button>
              <button
                type="button"
                onClick={() => onCompleteMission(mission.id)}
                disabled={status === "locked"}
                className={[
                  "border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition",
                  status === "locked"
                    ? "cursor-not-allowed border-white/10 bg-white/[0.02] text-slate-600"
                    : "border-emerald-300/30 bg-emerald-950/18 text-emerald-100 hover:border-emerald-200 active:scale-[0.98]",
                ].join(" ")}
              >
                {copy.complete}
              </button>
            </div>
          </article>
        );
      })}

      <ExplorationLogPanel
        copy={copy}
        explorationLog={explorationLog}
        language={language}
      />
    </div>
  );
}

function MissionProgress({
  completedCount,
  copy,
  totalCount,
}: {
  completedCount: number;
  copy: (typeof COPY)[Language];
  totalCount: number;
}) {
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {copy.missionProgress}
        </p>
        <span className="text-[10px] uppercase tracking-[0.16em] text-emerald-200">
          {completedCount}/{totalCount}
        </span>
      </div>
      <div className="mt-3 h-1.5 border border-white/10 bg-black/40">
        <div
          className="h-full bg-cyan-300/70 shadow-[0_0_14px_rgba(34,211,238,0.35)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

function RecommendedMissionCard({
  copy,
  language,
  mission,
  onStartMission,
}: {
  copy: (typeof COPY)[Language];
  language: Language;
  mission: Mission;
  onStartMission: (mission: Mission) => void;
}) {
  const missionCopy = getMissionCopy(mission, language);

  return (
    <article className="border border-emerald-300/20 bg-emerald-950/12 p-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">
        {copy.nextMission}
      </p>
      <h3 className="mt-2 text-sm font-semibold text-slate-100">
        {missionCopy.title}
      </h3>
      <p className="mt-2 text-xs leading-5 text-slate-400">
        {missionCopy.objective}
      </p>
      <button
        type="button"
        onClick={() => onStartMission(mission)}
        className="mt-3 border border-emerald-300/35 bg-emerald-950/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100 transition hover:border-emerald-200 active:scale-[0.98]"
      >
        {copy.startRecommended}
      </button>
    </article>
  );
}

function ActiveMissionStepCard({
  completed,
  copy,
  language,
  mission,
  missionStepIndex,
  steps,
  onAdvanceMissionStep,
  onCompleteMission,
}: {
  completed: boolean;
  copy: (typeof COPY)[Language];
  language: Language;
  mission: Mission;
  missionStepIndex: number;
  steps: MissionStep[];
  onAdvanceMissionStep: () => void;
  onCompleteMission: (missionId: string) => void;
}) {
  const boundedStepIndex = Math.min(missionStepIndex, steps.length - 1);
  const currentStep = steps[boundedStepIndex];
  const stepNumber = boundedStepIndex + 1;
  const missionCopy = getMissionCopy(mission, language);

  return (
    <article className="border border-cyan-300/35 bg-cyan-950/18 p-3 shadow-[0_0_22px_rgba(34,211,238,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-100">
            {copy.step} {stepNumber}/3
          </p>
          <h3 className="mt-2 text-sm font-semibold text-slate-100">
            {missionCopy.title}
          </h3>
        </div>
        <span className="border border-cyan-300/35 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-cyan-100">
          {completed ? copy.completed : copy.active}
        </span>
      </div>
      <div className="mt-3 flex gap-1">
        {steps.map((step, index) => (
          <span
            key={step.id}
            className={[
              "h-1.5 flex-1 border border-white/10",
              index <= boundedStepIndex
                ? "bg-cyan-300/70"
                : "bg-white/[0.04]",
            ].join(" ")}
          />
        ))}
      </div>
      <h4 className="mt-3 text-sm font-semibold text-cyan-50">
        {currentStep.title}
      </h4>
      <p className="mt-2 text-xs leading-5 text-slate-300">
        {currentStep.instruction}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onAdvanceMissionStep}
          disabled={completed}
          className={[
            "border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition",
            completed
              ? "cursor-not-allowed border-white/10 text-slate-600"
              : "border-cyan-300/35 bg-cyan-950/25 text-cyan-100 hover:border-cyan-200 active:scale-[0.98]",
          ].join(" ")}
        >
          {completed ? copy.completed : currentStep.actionLabel}
        </button>
        <button
          type="button"
          onClick={() => onCompleteMission(mission.id)}
          disabled={completed}
          className={[
            "border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition",
            completed
              ? "cursor-not-allowed border-white/10 text-slate-600"
              : "border-emerald-300/30 bg-emerald-950/18 text-emerald-100 hover:border-emerald-200 active:scale-[0.98]",
          ].join(" ")}
        >
          {copy.complete}
        </button>
      </div>
    </article>
  );
}

function ExplorationLogPanel({
  copy,
  explorationLog,
  language,
}: {
  copy: (typeof COPY)[Language];
  explorationLog: ExplorationLogEntry[];
  language: Language;
}) {
  return (
    <section className="border border-white/10 bg-black/28 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {copy.captainLog}
      </p>
      <div className="mt-3 grid max-h-36 gap-2 overflow-y-auto">
        {explorationLog.length === 0 ? (
          <p className="text-xs text-slate-600">{copy.noLog}</p>
        ) : (
          explorationLog.slice(0, 8).map((entry, index) => (
            <div
              key={entry.id}
              className="border border-white/10 bg-white/[0.03] p-2 text-xs"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="uppercase tracking-[0.14em] text-slate-500">
                  [{String(index + 1).padStart(3, "0")}]{" "}
                  {formatLogEvent(entry.type, language)}
                </span>
                <span className="font-mono text-[10px] text-slate-600">
                  {entry.timestamp}
                </span>
              </div>
              <p className="leading-5 text-slate-300">{entry.message}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function TourTab({
  activeTour,
  activeTourStopIndex,
  completedTourStopIds,
  copy,
  language,
  tourMode,
  onCompleteTourStop,
  onExitTour,
  onFocusTourStop,
  onJumpToTourStop,
  onNextTourStop,
  onRestartTour,
  onStartTour,
  onStartTourRecommendedMission,
}: {
  activeTour: Tour | null;
  activeTourStopIndex: number;
  completedTourStopIds: string[];
  copy: (typeof COPY)[Language];
  language: Language;
  tourMode: TourMode;
  onCompleteTourStop: () => void;
  onExitTour: () => void;
  onFocusTourStop: () => void;
  onJumpToTourStop: (stopIndex: number) => void;
  onNextTourStop: () => void;
  onRestartTour: () => void;
  onStartTour: (tourId: TourId) => void;
  onStartTourRecommendedMission: () => void;
}) {
  if (!activeTour) {
    return (
      <div className="grid gap-3">
        <div className="border border-cyan-300/20 bg-cyan-950/15 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
            {copy.tourCatalog}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            {copy.tourCatalogBody}
          </p>
        </div>
        {TOURS.map((tour) => {
          const tourCopy = getTourCopy(tour, language);

          return (
            <article
              key={tour.id}
              className="border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">
                    {tourCopy.title}
                  </h2>
                  <p className="mt-1 text-xs text-cyan-100/75">
                    {tourCopy.subtitle}
                  </p>
                </div>
                <span className="border border-white/10 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-slate-500">
                  {tour.stops.length} {copy.stopCount}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {tourCopy.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  {tourCopy.estimatedDuration}
                </span>
                <button
                  type="button"
                  onClick={() => onStartTour(tour.id)}
                  className="border border-cyan-300/35 bg-cyan-950/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-200 active:scale-[0.98]"
                >
                  {copy.startTour}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  const currentStop = activeTour.stops[activeTourStopIndex];
  const activeTourCopy = getTourCopy(activeTour, language);
  const currentStopCopy = getTourStopCopy(currentStop, language);
  const progressPercent =
    activeTour.stops.length > 0
      ? ((activeTourStopIndex + 1) / activeTour.stops.length) * 100
      : 0;

  return (
    <div className="grid gap-3">
      <div className="border border-cyan-300/25 bg-cyan-950/16 p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
              {copy.tourActive}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-white">
              {activeTourCopy.title}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {copy.stopLabel} {activeTourStopIndex + 1}/{activeTour.stops.length}
            </p>
          </div>
          <span className="border border-emerald-300/30 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-emerald-100">
            {formatTourMode(tourMode, language)}
          </span>
        </div>
        <div className="mt-3 h-1.5 border border-white/10 bg-black/40">
          <div
            className="h-full bg-cyan-300/75 shadow-[0_0_14px_rgba(34,211,238,0.35)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <article className="border border-white/10 bg-white/[0.035] p-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">
          {SPACE_OBJECTS[currentStop.target].name[language]}
        </p>
        <h3 className="mt-2 text-base font-semibold text-slate-100">
          {currentStopCopy.title}
        </h3>
        <p className="mt-1 text-xs text-cyan-100/75">
          {currentStopCopy.subtitle}
        </p>
        <p className="mt-3 text-xs leading-5 text-slate-300">
          {currentStopCopy.objective}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onFocusTourStop}
            className="border border-cyan-300/30 bg-cyan-950/20 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-200"
          >
            {copy.focusStop}
          </button>
          <button
            type="button"
            onClick={onStartTourRecommendedMission}
            className="border border-emerald-300/30 bg-emerald-950/18 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-100 transition hover:border-emerald-200"
          >
            {copy.startRecommended}
          </button>
          <button
            type="button"
            onClick={onCompleteTourStop}
            className="border border-emerald-300/30 bg-emerald-950/18 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-100 transition hover:border-emerald-200"
          >
            {copy.completeStop}
          </button>
          <button
            type="button"
            onClick={onNextTourStop}
            className="border border-cyan-300/30 bg-cyan-950/20 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-200"
          >
            {copy.nextStop}
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onRestartTour}
            className="flex-1 border border-white/10 bg-white/[0.03] px-2 py-2 text-[10px] uppercase tracking-[0.12em] text-slate-400 transition hover:border-cyan-300/35 hover:text-cyan-100"
          >
            {copy.restartTour}
          </button>
          <button
            type="button"
            onClick={onExitTour}
            className="flex-1 border border-white/10 bg-white/[0.03] px-2 py-2 text-[10px] uppercase tracking-[0.12em] text-slate-400 transition hover:border-red-300/35 hover:text-red-100"
          >
            {copy.exitTour}
          </button>
        </div>
      </article>

      <div className="grid max-h-64 gap-2 overflow-y-auto">
        {activeTour.stops.map((stop, index) => {
          const completed = completedTourStopIds.includes(stop.id);
          const active = index === activeTourStopIndex;
          const stopCopy = getTourStopCopy(stop, language);

          return (
            <button
              key={stop.id}
              type="button"
              onClick={() => onJumpToTourStop(index)}
              className={[
                "border p-2 text-left transition",
                active
                  ? "border-cyan-300/45 bg-cyan-950/20"
                  : completed
                    ? "border-emerald-300/30 bg-emerald-950/12"
                    : "border-white/10 bg-white/[0.025] hover:border-cyan-300/30",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200">
                  {index + 1}. {stopCopy.title}
                </span>
                <span className="text-[9px] uppercase tracking-[0.14em] text-slate-500">
                  {completed
                    ? copy.completed
                    : active
                      ? copy.active
                      : copy.upcoming}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {SPACE_OBJECTS[stop.target].name[language]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ArchivesTab({
  archiveExpeditionMode,
  copy,
  currentArchiveWaypointIndex,
  language,
  selectedArchiveMission,
  onClearArchiveRoute,
  onCompleteArchiveExpedition,
  onFocusArchiveWaypoint,
  onNextArchiveWaypoint,
  onPreviousArchiveWaypoint,
  onSelectArchiveWaypoint,
  onSelectTarget,
  onStartArchiveExpedition,
  onViewArchiveRoute,
}: {
  archiveExpeditionMode: ArchiveExpeditionMode;
  copy: (typeof COPY)[Language];
  currentArchiveWaypointIndex: number;
  language: Language;
  selectedArchiveMission: ArchiveMission | null;
  onClearArchiveRoute: () => void;
  onCompleteArchiveExpedition: () => void;
  onFocusArchiveWaypoint: () => void;
  onNextArchiveWaypoint: () => void;
  onPreviousArchiveWaypoint: () => void;
  onSelectArchiveWaypoint: (index: number) => void;
  onSelectTarget: (target: SelectedTarget) => void;
  onStartArchiveExpedition: (missionId?: ArchiveMissionId) => void;
  onViewArchiveRoute: (missionId: ArchiveMissionId) => void;
}) {
  const [categoryFilter, setCategoryFilter] = useState<
    ArchiveMissionCategory | "all"
  >("all");

  if (!selectedArchiveMission) {
    const missions =
      categoryFilter === "all"
        ? ARCHIVE_MISSIONS
        : ARCHIVE_MISSIONS.filter(
            (mission) => mission.category === categoryFilter,
          );

    return (
      <div className="grid gap-3">
        <div className="border border-cyan-300/20 bg-cyan-950/15 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
            {copy.archiveCatalog}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            {copy.archiveDisclaimer}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              "all",
              "outer-solar-system",
              "giant-planets",
              "mars",
              "inner-solar-system",
              "asteroids",
              "future",
            ] as Array<ArchiveMissionCategory | "all">
          ).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setCategoryFilter(category)}
              className={[
                "border px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] transition",
                categoryFilter === category
                  ? "border-cyan-300/60 bg-cyan-950/35 text-cyan-100"
                  : "border-white/10 bg-white/[0.03] text-slate-500 hover:border-cyan-300/35 hover:text-slate-200",
              ].join(" ")}
            >
              {ARCHIVE_CATEGORY_LABELS[category][language]}
            </button>
          ))}
        </div>
        <div className="grid max-h-[62vh] gap-3 overflow-y-auto pr-1">
          {missions.map((mission) => {
            const missionCopy = getArchiveMissionCopy(mission, language);

            return (
              <article
                key={mission.id}
                className="border border-white/10 bg-white/[0.03] p-3 transition hover:border-cyan-300/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-100">
                      {mission.name}
                    </h2>
                    <p className="mt-1 text-xs text-cyan-100/70">
                      {missionCopy.subtitle}
                    </p>
                  </div>
                  <span className="border border-white/10 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-slate-500">
                    {ARCHIVE_CATEGORY_LABELS[mission.category][language]}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {missionCopy.shortDescription}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {mission.primaryTargets.map((target) => (
                    <span
                      key={target}
                      className="border border-cyan-300/15 bg-cyan-950/15 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-cyan-100/75"
                    >
                      {SPACE_OBJECTS[target].name[language]}
                    </span>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onViewArchiveRoute(mission.id)}
                    className="border border-cyan-300/30 bg-cyan-950/20 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-200"
                  >
                    {copy.viewRoute}
                  </button>
                  <button
                    type="button"
                    onClick={() => onStartArchiveExpedition(mission.id)}
                    className="border border-emerald-300/30 bg-emerald-950/18 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-100 transition hover:border-emerald-200"
                  >
                    {copy.startExpedition}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  const currentWaypoint =
    selectedArchiveMission.waypoints[currentArchiveWaypointIndex] ??
    selectedArchiveMission.waypoints[0];
  const archiveCopy = getArchiveMissionCopy(selectedArchiveMission, language);
  const currentWaypointCopy = getMissionWaypointCopy(currentWaypoint, language);
  const discoveries = getDiscoveryCardsForMission(selectedArchiveMission.id);
  const finalWaypoint =
    currentArchiveWaypointIndex >= selectedArchiveMission.waypoints.length - 1;

  return (
    <div className="grid gap-3">
      <div className="border border-cyan-300/25 bg-cyan-950/16 p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
              {copy.archiveRouteLoaded}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-white">
              {selectedArchiveMission.name}
            </h2>
            <p className="mt-1 text-xs text-cyan-100/70">
              {archiveCopy.subtitle}
            </p>
          </div>
          <span className="border border-emerald-300/30 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-emerald-100">
            {formatArchiveExpeditionMode(archiveExpeditionMode, language)}
          </span>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-300">
          {archiveCopy.longDescription}
        </p>
        <p className="mt-2 text-[11px] leading-5 text-slate-500">
          {archiveCopy.disclaimer ?? copy.archiveDisclaimer}
        </p>
      </div>

      <section className="border border-white/10 bg-white/[0.03] p-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {archiveCopy.agencyLabel} · {archiveCopy.statusLabel}
        </p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-cyan-100">
          {copy.primaryTargets}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedArchiveMission.primaryTargets.map((target) => (
            <button
              key={target}
              type="button"
              onClick={() => onSelectTarget(target)}
              className="border border-cyan-300/20 bg-cyan-950/16 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-200"
            >
              {SPACE_OBJECTS[target].name[language]}
            </button>
          ))}
        </div>
      </section>

      <section className="border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">
              {copy.waypoint} {currentArchiveWaypointIndex + 1}/
              {selectedArchiveMission.waypoints.length}
            </p>
            <h3 className="mt-2 text-sm font-semibold text-slate-100">
              {currentWaypointCopy.label}
            </h3>
          </div>
          <span className="border border-white/10 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">
            {SPACE_OBJECTS[currentWaypoint.target].name[language]}
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-300">
          {currentWaypointCopy.description}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onFocusArchiveWaypoint}
            className="border border-cyan-300/30 bg-cyan-950/20 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-cyan-100 transition hover:border-cyan-200"
          >
            {copy.focusWaypoint}
          </button>
          <button
            type="button"
            onClick={() => onStartArchiveExpedition(selectedArchiveMission.id)}
            className="border border-emerald-300/30 bg-emerald-950/18 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-100 transition hover:border-emerald-200"
          >
            {copy.startExpedition}
          </button>
          <button
            type="button"
            onClick={onPreviousArchiveWaypoint}
            disabled={currentArchiveWaypointIndex === 0}
            className="border border-white/10 bg-white/[0.03] px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 transition hover:border-cyan-300/35 hover:text-cyan-100 disabled:cursor-not-allowed disabled:text-slate-700"
          >
            {copy.previousWaypoint}
          </button>
          <button
            type="button"
            onClick={
              finalWaypoint ? onCompleteArchiveExpedition : onNextArchiveWaypoint
            }
            className="border border-cyan-300/30 bg-cyan-950/20 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-cyan-100 transition hover:border-cyan-200"
          >
            {finalWaypoint ? copy.completeExpedition : copy.nextWaypoint}
          </button>
          <button
            type="button"
            onClick={onClearArchiveRoute}
            className="col-span-2 border border-white/10 bg-white/[0.03] px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 transition hover:border-red-300/35 hover:text-red-100"
          >
            {copy.clearRoute}
          </button>
        </div>
      </section>

      <section className="grid max-h-52 gap-2 overflow-y-auto">
        {selectedArchiveMission.waypoints.map((waypoint, index) => {
          const active = index === currentArchiveWaypointIndex;
          const waypointCopy = getMissionWaypointCopy(waypoint, language);

          return (
            <button
              key={waypoint.id}
              type="button"
              onClick={() => onSelectArchiveWaypoint(index)}
              className={[
                "border p-2 text-left transition",
                active
                  ? "border-cyan-300/45 bg-cyan-950/22"
                  : "border-white/10 bg-white/[0.025] hover:border-cyan-300/30",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200">
                  {index + 1}. {waypointCopy.label}
                </span>
                <span className="text-[9px] uppercase tracking-[0.14em] text-slate-500">
                  {SPACE_OBJECTS[waypoint.target].name[language]}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-4 text-slate-500">
                {waypointCopy.description}
              </p>
            </button>
          );
        })}
      </section>

      <section className="border border-white/10 bg-white/[0.03] p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {copy.keyDiscoveries}
        </p>
        <ul className="mt-3 grid gap-2 text-xs leading-5 text-slate-300">
          {archiveCopy.keyDiscoveries.map((item) => (
            <li key={item} className="border-l border-cyan-300/30 pl-3">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {copy.discoveryCards}
        </p>
        {discoveries.map((card) => {
          const cardCopy = getDiscoveryCardCopy(card, language);

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectTarget(card.relatedTarget)}
              className="border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-emerald-300/35"
            >
              <span className="block text-sm font-semibold text-slate-100">
                {cardCopy.title}
              </span>
              <span className="mt-2 block text-xs leading-5 text-slate-400">
                {cardCopy.body}
              </span>
              <span className="mt-2 block text-[9px] uppercase tracking-[0.14em] text-emerald-200">
                {SPACE_OBJECTS[card.relatedTarget].name[language]}
              </span>
            </button>
          );
        })}
      </section>
    </div>
  );
}

function ViewTab({
  controlSensitivity,
  copy,
  language,
  simMode,
  viewLayers,
  viewMode,
  setControlSensitivity,
  setSimMode,
  setViewLayers,
  setViewMode,
}: {
  controlSensitivity: ControlSensitivity;
  copy: (typeof COPY)[Language];
  language: Language;
  simMode: SimMode;
  viewLayers: ViewLayerState;
  viewMode: ViewMode;
  setControlSensitivity: (sensitivity: ControlSensitivity) => void;
  setSimMode: (mode: SimMode) => void;
  setViewLayers: (layers: ViewLayerState) => void;
  setViewMode: (mode: ViewMode) => void;
}) {
  return (
    <div className="grid gap-3 text-sm text-slate-300">
      <div className="border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {copy.viewMode}
        </p>
        <div className="grid grid-cols-2 gap-1">
          {(
            [
              ["solar-system", copy.solarSystemMode],
              ["celestial-sphere", copy.celestialSphere],
            ] as Array<[ViewMode, string]>
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={[
                "border px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] transition",
                viewMode === mode
                  ? "border-cyan-300/60 bg-cyan-950/40 text-cyan-100"
                  : "border-white/10 bg-black/20 text-slate-500 hover:border-cyan-300/35 hover:text-slate-200",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="border border-white/10 bg-white/[0.03] p-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {copy.visualMode}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.12em] text-cyan-100/80">
          {copy.visualModeBody}
        </p>
      </div>
      {(
        [
          ["orbits", copy.showOrbits],
          ["labels", copy.showLabels],
          ["probes", copy.showProbes],
          ["stars", copy.showStars],
          ["asteroidBelt", copy.showAsteroidBelt],
          ["kuiperBelt", copy.showKuiperBelt],
          ["moons", copy.showMoons],
          ["missionRoutes", copy.showMissionRoutes],
          ["constellations", copy.showConstellations],
          ["ecliptic", copy.showEcliptic],
          ["zodiac", copy.showZodiac],
        ] as Array<[keyof ViewLayerState, string]>
      ).map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setViewLayers({ ...viewLayers, [key]: !viewLayers[key] })}
          className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-3 py-3 transition hover:border-cyan-300/35"
        >
          <span className="uppercase tracking-[0.14em]">{label}</span>
          <span
            className={[
              "h-5 w-9 border transition",
              viewLayers[key]
                ? "border-emerald-300/30 bg-emerald-400/20"
                : "border-slate-500/25 bg-slate-700/10",
            ].join(" ")}
          >
            <span
              className={[
                "block h-full w-1/2 transition",
                viewLayers[key]
                  ? "ml-auto bg-emerald-300/70"
                  : "ml-0 bg-slate-500/45",
              ].join(" ")}
            />
          </span>
        </button>
      ))}

      <div className="border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {copy.simMode}
        </p>
        <div className="grid grid-cols-3 gap-1">
          {(["REAL RATE", "CRUISE MODE", "PAUSED"] as SimMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSimMode(mode)}
              className={[
                "border px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] transition",
                simMode === mode
                  ? "border-cyan-300/60 bg-cyan-950/40 text-cyan-100"
                  : "border-white/10 bg-black/20 text-slate-500 hover:border-cyan-300/35 hover:text-slate-200",
              ].join(" ")}
            >
              {formatSimMode(mode, language)}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {copy.controlSensitivity}
        </p>
        <div className="grid grid-cols-3 gap-1">
          {(
            [
              ["low", copy.low],
              ["normal", copy.standard],
              ["high", copy.high],
            ] as Array<[ControlSensitivity, string]>
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setControlSensitivity(value)}
              className={[
                "border px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition",
                controlSensitivity === value
                  ? "border-cyan-300/60 bg-cyan-950/40 text-cyan-100"
                  : "border-white/10 bg-black/20 text-slate-500 hover:border-cyan-300/35 hover:text-slate-200",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RightToolbar({
  copy,
  experienceMode,
  language,
  onEnterCockpit,
  onExitCockpit,
  onFullscreen,
  onOpenLayers,
  onOpenRoutes,
  onOpenSettings,
  onTriggerCommand,
}: {
  copy: (typeof COPY)[Language];
  experienceMode: ExperienceMode;
  language: Language;
  onEnterCockpit: () => void;
  onExitCockpit: () => void;
  onFullscreen: () => void;
  onOpenLayers: () => void;
  onOpenRoutes: () => void;
  onOpenSettings: () => void;
  onTriggerCommand: (command: CameraCommandType) => void;
}) {
  const tools: Array<{
    label: string;
    onClick: () => void;
    title: string;
  }> = [
    { label: language === "zh" ? "视图" : "View", onClick: onOpenLayers, title: "Layers" },
    {
      label: experienceMode === "cockpit" ? copy.exitCockpit : copy.cockpit,
      onClick: experienceMode === "cockpit" ? onExitCockpit : onEnterCockpit,
      title: experienceMode === "cockpit" ? copy.exitCockpit : copy.enterCockpit,
    },
    { label: copy.routes, onClick: onOpenRoutes, title: "Mission Routes" },
    { label: copy.solarSystemOverview, onClick: () => onTriggerCommand("solarSystemOverview"), title: "Solar System Overview" },
    { label: "+", onClick: () => onTriggerCommand("zoomIn"), title: "Zoom +" },
    { label: "-", onClick: () => onTriggerCommand("zoomOut"), title: "Zoom -" },
    { label: language === "zh" ? "聚焦" : "Focus", onClick: () => onTriggerCommand("focus"), title: "Focus" },
    { label: copy.settings, onClick: onOpenSettings, title: "Settings" },
    { label: language === "zh" ? "全屏" : "Full", onClick: onFullscreen, title: "Fullscreen" },
  ];

  return (
    <nav className="pointer-events-auto absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-2">
      {tools.map((tool) => (
        <button
          key={tool.title}
          type="button"
          onClick={tool.onClick}
          className="flex h-11 w-20 items-center justify-center border border-white/10 bg-black/55 px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-300 shadow-[0_0_18px_rgba(2,6,23,0.35)] backdrop-blur-xl transition hover:border-cyan-300/40 hover:bg-cyan-950/30 hover:text-cyan-100 active:scale-[0.97]"
          title={tool.title}
        >
          {tool.label}
        </button>
      ))}
    </nav>
  );
}

function AssistantPanel({
  cameraMode,
  experienceMode,
  activeTour,
  activeTourStopIndex,
  archiveExpeditionMode,
  completedMissionIds,
  completedTourStopIds,
  copy,
  currentArchiveWaypointIndex,
  explorationPoint,
  language,
  missionStepIndex,
  onClearArchiveRoute,
  onCompleteArchiveExpedition,
  onFocusArchiveWaypoint,
  onNextArchiveWaypoint,
  onPreviousArchiveWaypoint,
  onStartArchiveExpedition,
  onEnterCockpit,
  onExitCockpit,
  onCompleteTourStop,
  onFocusTourStop,
  onNextTourStop,
  selectedArchiveMission,
  selectedMissionId,
  selectedTarget,
  tourMode,
  viewMode,
}: {
  cameraMode: CameraMode;
  experienceMode: ExperienceMode;
  activeTour: Tour | null;
  activeTourStopIndex: number;
  archiveExpeditionMode: ArchiveExpeditionMode;
  completedMissionIds: string[];
  completedTourStopIds: string[];
  copy: (typeof COPY)[Language];
  currentArchiveWaypointIndex: number;
  explorationPoint: ExplorationPoint;
  language: Language;
  missionStepIndex: number;
  onClearArchiveRoute: () => void;
  onCompleteArchiveExpedition: () => void;
  onFocusArchiveWaypoint: () => void;
  onNextArchiveWaypoint: () => void;
  onPreviousArchiveWaypoint: () => void;
  onStartArchiveExpedition: (missionId?: ArchiveMissionId) => void;
  onEnterCockpit: () => void;
  onExitCockpit: () => void;
  onCompleteTourStop: () => void;
  onFocusTourStop: () => void;
  onNextTourStop: () => void;
  selectedArchiveMission: ArchiveMission | null;
  selectedMissionId: string | null;
  selectedTarget: SelectedTarget;
  tourMode: TourMode;
  viewMode: ViewMode;
}) {
  const mission = getMissionById(selectedMissionId);
  const currentTourStop = activeTour?.stops[activeTourStopIndex] ?? null;
  const currentArchiveWaypoint =
    selectedArchiveMission?.waypoints[currentArchiveWaypointIndex] ?? null;
  const missionCopy = mission ? getMissionCopy(mission, language) : null;
  const activeTourCopy = activeTour ? getTourCopy(activeTour, language) : null;
  const currentTourStopCopy = currentTourStop
    ? getTourStopCopy(currentTourStop, language)
    : null;
  const archiveCopy = selectedArchiveMission
    ? getArchiveMissionCopy(selectedArchiveMission, language)
    : null;
  const currentArchiveWaypointCopy = currentArchiveWaypoint
    ? getMissionWaypointCopy(currentArchiveWaypoint, language)
    : null;
  const missionCompleted = mission
    ? completedMissionIds.includes(mission.id)
    : false;
  const message = getAssistantMessage({
    cameraMode,
    completed: missionCompleted,
    copy,
    explorationPoint,
    language,
    mission,
    missionStepIndex,
    selectedTarget,
    viewMode,
  });
  const tourStopCompleted = currentTourStop
    ? completedTourStopIds.includes(currentTourStop.id)
    : false;
  const nextTourStop =
    activeTour && activeTourStopIndex + 1 < activeTour.stops.length
      ? activeTour.stops[activeTourStopIndex + 1]
      : null;
  const nextTourStopCopy = nextTourStop
    ? getTourStopCopy(nextTourStop, language)
    : null;

  return (
    <aside className="pointer-events-auto absolute bottom-24 right-24 w-[min(31vw,350px)] border border-white/10 bg-black/48 p-4 shadow-[0_0_28px_rgba(8,145,178,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-300">
            {copy.aiTitle}
          </h2>
          <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-slate-600">
            {archiveExpeditionMode === "active" && selectedArchiveMission
              ? selectedArchiveMission.name
              : currentTourStop
              ? `${activeTourCopy?.title} ${activeTourStopIndex + 1}/${activeTour?.stops.length}`
              : mission
                ? missionCopy?.title
                : copy.aiSubtitle}
          </p>
        </div>
        <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.85)]" />
      </div>
      {selectedArchiveMission &&
      currentArchiveWaypoint &&
      archiveCopy &&
      currentArchiveWaypointCopy &&
      (archiveExpeditionMode !== "idle" || !currentTourStop) ? (
        <div className="mt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
            {archiveExpeditionMode === "active"
              ? copy.archiveExpeditionActive
              : archiveExpeditionMode === "completed"
                ? copy.archiveExpeditionComplete
                : copy.archiveRouteLoaded}
          </p>
          <h3 className="mt-2 text-sm font-semibold text-slate-100">
            {selectedArchiveMission.name}
          </h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
            {copy.waypoint} {currentArchiveWaypointIndex + 1}/
            {selectedArchiveMission.waypoints.length} ·{" "}
            {currentArchiveWaypointCopy.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {archiveExpeditionMode === "completed"
              ? `${copy.archiveExpeditionComplete}：${selectedArchiveMission.name}。`
              : currentArchiveWaypointCopy.description}
          </p>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            {archiveCopy.disclaimer ?? copy.archiveDisclaimer}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={onFocusArchiveWaypoint}
              className="border border-cyan-300/30 bg-cyan-950/20 px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-cyan-100 transition hover:border-cyan-200"
            >
              {copy.focus}
            </button>
            <button
              type="button"
              onClick={onPreviousArchiveWaypoint}
              disabled={currentArchiveWaypointIndex === 0}
              className="border border-white/10 bg-white/[0.03] px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 transition hover:border-cyan-300/35 hover:text-cyan-100 disabled:cursor-not-allowed disabled:text-slate-700"
            >
              {copy.previous}
            </button>
            <button
              type="button"
              onClick={onNextArchiveWaypoint}
              className="border border-cyan-300/30 bg-cyan-950/20 px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-cyan-100 transition hover:border-cyan-200"
            >
              {copy.next}
            </button>
            {archiveExpeditionMode === "idle" ? (
              <button
                type="button"
                onClick={() => onStartArchiveExpedition(selectedArchiveMission.id)}
                className="col-span-2 border border-emerald-300/30 bg-emerald-950/18 px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-emerald-100 transition hover:border-emerald-200"
              >
                {copy.startExpedition}
              </button>
            ) : null}
            {archiveExpeditionMode === "active" &&
            currentArchiveWaypointIndex >=
              selectedArchiveMission.waypoints.length - 1 ? (
              <button
                type="button"
                onClick={onCompleteArchiveExpedition}
                className="col-span-2 border border-emerald-300/30 bg-emerald-950/18 px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-emerald-100 transition hover:border-emerald-200"
              >
                {copy.complete}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClearArchiveRoute}
              className="border border-white/10 bg-white/[0.03] px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 transition hover:border-red-300/35 hover:text-red-100"
            >
              {copy.clear}
            </button>
          </div>
        </div>
      ) : currentTourStop && currentTourStopCopy ? (
        <div className="mt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
            {tourMode === "completed"
              ? copy.tourCompleteLabel
              : copy.tourActiveLabel}
          </p>
          <h3 className="mt-2 text-sm font-semibold text-slate-100">
            {currentTourStopCopy.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {tourMode === "completed"
              ? copy.tourComplete
              : tourStopCompleted
                ? `${copy.stopComplete}。${
                    nextTourStopCopy
                      ? `${copy.nextStop}: ${nextTourStopCopy.title}`
                      : copy.tourComplete
                  }`
                : `${currentTourStopCopy.objective} ${copy.tourInstruction}`}
          </p>
          {tourMode !== "completed" ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={onFocusTourStop}
                className="border border-cyan-300/30 bg-cyan-950/20 px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-cyan-100 transition hover:border-cyan-200"
              >
                {copy.focus}
              </button>
              <button
                type="button"
                onClick={onCompleteTourStop}
                className="border border-emerald-300/30 bg-emerald-950/18 px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-emerald-100 transition hover:border-emerald-200"
              >
                {copy.complete}
              </button>
              <button
                type="button"
                onClick={onNextTourStop}
                className="border border-cyan-300/30 bg-cyan-950/20 px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-cyan-100 transition hover:border-cyan-200"
              >
                {copy.next}
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-slate-300">{message}</p>
      )}
      <button
        type="button"
        onClick={
          experienceMode === "cockpit" ? onExitCockpit : onEnterCockpit
        }
        className="mt-4 w-full border border-cyan-300/30 bg-cyan-950/18 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100 transition hover:border-cyan-200 active:scale-[0.98]"
      >
        {experienceMode === "cockpit" ? copy.exitCockpit : copy.enterCockpit}
      </button>
    </aside>
  );
}

function getAssistantMessage({
  cameraMode,
  completed,
  copy,
  explorationPoint,
  language,
  mission,
  missionStepIndex,
  selectedTarget,
  viewMode,
}: {
  cameraMode: CameraMode;
  completed: boolean;
  copy: (typeof COPY)[Language];
  explorationPoint: ExplorationPoint;
  language: Language;
  mission: Mission | null;
  missionStepIndex: number;
  selectedTarget: SelectedTarget;
  viewMode: ViewMode;
}) {
  if (cameraMode === "free") return copy.freeInstruction;

  if (mission) {
    const missionCopy = getMissionCopy(mission, language);
    const steps = getMissionSteps(mission, language);
    const currentStep = steps[Math.min(missionStepIndex, steps.length - 1)];

    if (completed) {
      return language === "zh"
        ? `${copy.missionComplete}：${missionCopy.title}。${copy.nextMission} 已在${copy.missionBoard}中准备好。`
        : `${copy.missionComplete}: ${missionCopy.title}. ${copy.nextMission} is ready in ${copy.missionBoard}.`;
    }

    const celestialPrefix =
      mission.category === "celestial" &&
      !currentStep.instruction.includes("天球参考层") &&
      !currentStep.instruction.includes("Celestial")
        ? language === "zh"
          ? "本任务使用天球参考层。请注意：星座是观测方向上的图案，不是可以像行星一样飞抵的地点。"
          : "This mission uses the celestial reference layer. Constellations are observed direction patterns, not destinations like planets. "
        : "";

    return `${copy.step} ${Math.min(missionStepIndex + 1, steps.length)}/3: ${celestialPrefix}${currentStep.instruction}`;
  }

  if (explorationPoint) {
    return EXPLORATION_DETAILS_LOCALIZED[language][explorationPoint];
  }

  if (viewMode === "celestial-sphere") {
    return copy.celestialModeMessage;
  }

  return TARGET_SUGGESTIONS[language][selectedTarget];
}

function JourneyProgressBar({
  activeTour,
  activeTourStopIndex,
  completedTourStopIds,
  copy,
  language,
}: {
  activeTour: Tour;
  activeTourStopIndex: number;
  completedTourStopIds: string[];
  copy: (typeof COPY)[Language];
  language: Language;
}) {
  const currentStop = activeTour.stops[activeTourStopIndex];
  const currentTarget = SPACE_OBJECTS[currentStop.target].name[language];
  const activeTourCopy = getTourCopy(activeTour, language);
  const currentStopCopy = getTourStopCopy(currentStop, language);

  return (
    <section className="pointer-events-auto absolute left-1/2 top-16 w-[min(62vw,720px)] -translate-x-1/2 border border-white/10 bg-black/52 px-4 py-3 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
            {copy.journeyProgress}
          </p>
          <p className="mt-1 text-xs text-slate-300">
            {activeTourCopy.title} · {copy.stopLabel} {activeTourStopIndex + 1}/
            {activeTour.stops.length} · {currentTarget}
          </p>
        </div>
        <span className="hidden text-[10px] uppercase tracking-[0.18em] text-slate-500 sm:block">
          {currentStopCopy.title}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {activeTour.stops.map((stop, index) => {
          const complete = completedTourStopIds.includes(stop.id);
          const active = index === activeTourStopIndex;

          return (
            <span
              key={stop.id}
              className={[
                "h-1.5 flex-1 border border-white/10",
                active
                  ? "bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                  : complete
                    ? "bg-emerald-300/75"
                    : "bg-white/[0.05]",
              ].join(" ")}
              title={getTourStopCopy(stop, language).title}
            />
          );
        })}
      </div>
    </section>
  );
}

function MinimalJourneyStatus({
  activeTour,
  activeTourStopIndex,
  language,
}: {
  activeTour: Tour;
  activeTourStopIndex: number;
  language: Language;
}) {
  const currentStop = activeTour.stops[activeTourStopIndex];
  const targetLabel = SPACE_OBJECTS[currentStop.target].name[language];
  const activeTourCopy = getTourCopy(activeTour, language);

  return (
    <div className="pointer-events-auto absolute left-1/2 top-16 -translate-x-1/2 border border-cyan-300/25 bg-black/55 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100 backdrop-blur-xl">
      {activeTourCopy.title} {activeTourStopIndex + 1}/{activeTour.stops.length} ·{" "}
      {targetLabel}
    </div>
  );
}

function MissionTargets({
  cameraMode,
  copy,
  hudMode,
  language,
  selectedTarget,
  simMode,
  setSelectedTarget,
}: {
  cameraMode: CameraMode;
  copy: (typeof COPY)[Language];
  hudMode: HudMode;
  language: Language;
  selectedTarget: SelectedTarget;
  simMode: SimMode;
  setSelectedTarget: (target: SelectedTarget) => void;
}) {
  const labels = TARGET_LABELS_LOCALIZED[language];
  const [collapsed, setCollapsed] = useState(true);
  const minimalTargets: SelectedTarget[] = [
    "earth",
    "mars",
    "jupiter",
    "saturn",
    "neptune",
  ];
  const groups =
    hudMode === "minimal"
      ? [
          {
            id: "minimal",
            label: { en: "Quick Targets", zh: "快捷目标" },
            targets: minimalTargets,
          },
        ]
      : MISSION_TARGET_GROUPS;

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="pointer-events-auto absolute bottom-28 left-4 flex items-center gap-3 border border-cyan-300/35 bg-black/62 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.16)] backdrop-blur-xl transition hover:border-cyan-200 active:scale-[0.98]"
      >
        <span>{copy.expandTargets}</span>
        <span className="border-l border-white/10 pl-3 text-slate-400">
          {labels[selectedTarget]}
        </span>
      </button>
    );
  }

  return (
    <nav
      className={[
        "pointer-events-auto absolute left-4 border border-white/10 bg-black/56 p-3 backdrop-blur-xl",
        hudMode === "minimal"
          ? "bottom-20 w-[min(92vw,760px)]"
          : "bottom-28 max-h-[260px] w-[min(92vw,820px)] overflow-y-auto",
      ].join(" ")}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            {copy.missionTargets}
          </p>
          <span className="hidden text-[9px] uppercase tracking-[0.18em] text-slate-600 sm:inline">
            {copy.targetTrayHint}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">
            {cameraMode === "free" ? copy.manualNav : formatSimMode(simMode, language)}
          </span>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 transition hover:border-cyan-300/35 hover:text-cyan-100 active:scale-[0.98]"
          >
            {copy.collapseTargets}
          </button>
        </div>
      </div>
      <div className="grid gap-3">
        {groups.map((group) => (
          <section key={group.id}>
            {hudMode === "full" ? (
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {group.label[language]}
              </p>
            ) : null}
            <div
              className={[
                "grid gap-2",
                hudMode === "minimal"
                  ? "grid-cols-5"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
              ].join(" ")}
            >
              {group.targets.map((target) => {
                const isActive = selectedTarget === target;
                const hasMissions = MISSION_TARGETS.includes(target);

                return (
                  <button
                    key={target}
                    type="button"
                    onClick={() => setSelectedTarget(target)}
                    className={[
                      "min-h-11 border px-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition active:scale-[0.98]",
                      isActive
                        ? "border-cyan-300 bg-cyan-950/40 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.22)]"
                        : hasMissions
                          ? "border-white/10 bg-white/[0.03] text-slate-400 hover:border-cyan-300/35 hover:text-slate-100"
                          : "border-white/10 bg-white/[0.02] text-slate-500 hover:border-cyan-300/30 hover:text-slate-200",
                    ].join(" ")}
                  >
                    {labels[target]}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </nav>
  );
}

function BottomTimeline({
  cameraMode,
  copy,
  language,
  selectedTarget,
  simMode,
  viewMode,
  onCycleSimMode,
}: {
  cameraMode: CameraMode;
  copy: (typeof COPY)[Language];
  language: Language;
  selectedTarget: SelectedTarget;
  simMode: SimMode;
  viewMode: ViewMode;
  onCycleSimMode: () => void;
}) {
  const targetLabel = TARGET_LABELS_LOCALIZED[language][selectedTarget];
  const viewModeLabel =
    viewMode === "celestial-sphere" ? copy.celestialSphere : copy.solarSystemMode;

  return (
    <footer className="pointer-events-auto absolute bottom-4 left-1/2 flex w-[min(72vw,760px)] -translate-x-1/2 items-center justify-between border border-white/10 bg-black/62 px-4 py-3 text-xs backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
        <span className="font-semibold uppercase tracking-[0.18em] text-emerald-200">
          {simMode === "PAUSED" ? copy.paused : copy.live}
        </span>
        <span className="hidden text-slate-500 sm:inline">
          {language === "zh" ? "2026年6月15日" : "JUN 15, 2026"}
        </span>
      </div>

      <div className="flex items-center gap-4 text-slate-300">
        <span className="hidden uppercase tracking-[0.16em] sm:inline">
          {cameraMode === "free" ? copy.freeExplore : formatSimMode(simMode, language)}
        </span>
        <span className="hidden uppercase tracking-[0.16em] text-cyan-100/70 lg:inline">
          {viewModeLabel}
        </span>
        <button
          type="button"
          onClick={onCycleSimMode}
          className="h-8 w-8 rounded-full border border-cyan-300/35 bg-cyan-950/25 shadow-[0_0_18px_rgba(34,211,238,0.18)] transition hover:border-cyan-200 active:scale-[0.96]"
          title={copy.simMode}
        />
        <span className="font-mono text-slate-200">
          {language === "zh" ? "14:33:02" : "02:33:02 PM"}
        </span>
      </div>

      <div className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-slate-500 md:flex">
        <span>
          {copy.speed} 0.8c
        </span>
        <span>
          {copy.distance} {targetLabel}
        </span>
        <span className="text-cyan-100">
          {cameraMode === "free" ? copy.manualNav : copy.autoCruise}
        </span>
      </div>
    </footer>
  );
}

function MinimalStatus({
  cameraMode,
  copy,
  language,
  selectedTarget,
  simMode,
  viewMode,
}: {
  cameraMode: CameraMode;
  copy: (typeof COPY)[Language];
  language: Language;
  selectedTarget: SelectedTarget;
  simMode: SimMode;
  viewMode: ViewMode;
}) {
  const targetLabel = TARGET_LABELS_LOCALIZED[language][selectedTarget];
  const viewModeLabel =
    viewMode === "celestial-sphere" ? copy.celestialSphere : copy.solarSystemMode;

  return (
    <footer className="pointer-events-auto absolute bottom-4 left-1/2 flex w-[min(82vw,620px)] -translate-x-1/2 items-center justify-between border border-white/10 bg-black/50 px-4 py-2 text-[11px] backdrop-blur-xl">
      <div className="flex items-center gap-2 uppercase tracking-[0.16em] text-emerald-200">
        <span className="h-2 w-2 rounded-full bg-emerald-300" />
        {simMode === "PAUSED" ? copy.paused : copy.live}
      </div>
      <span className="uppercase tracking-[0.16em] text-slate-300">
        {targetLabel} /{" "}
        {cameraMode === "free" ? copy.freeExplore : formatSimMode(simMode, language)}
      </span>
      <span className="hidden uppercase tracking-[0.16em] text-cyan-100/70 sm:inline">
        {viewModeLabel}
      </span>
      <span className="font-mono text-slate-400">
        {language === "zh" ? "14:33:02" : "02:33:02 PM"}
      </span>
    </footer>
  );
}

function DetailDrawer({
  copy,
  language,
  selectedTarget,
  onClose,
}: {
  copy: (typeof COPY)[Language];
  language: Language;
  selectedTarget: SelectedTarget;
  onClose: () => void;
}) {
  const info = SPACE_OBJECTS[selectedTarget];

  return (
    <aside className="pointer-events-auto absolute right-28 top-20 w-[min(88vw,390px)] border border-cyan-300/20 bg-black/78 p-4 shadow-[0_0_36px_rgba(8,145,178,0.18)] backdrop-blur-2xl">
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-100">
            {copy.detail}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            {info.name[language]}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-400 transition hover:border-cyan-300/40 hover:text-cyan-100"
        >
          {copy.close}
        </button>
      </div>
      <p className="text-sm leading-6 text-slate-300">
        {info.detailDescription[language]}
      </p>
      <div className="mt-4 border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {copy.stats}
        </p>
        {[
          [copy.diameter, info.stats.diameter],
          [copy.distance, info.stats.distanceFromSun],
          [copy.orbitalPeriod, info.stats.orbitalPeriod],
        ].map(([label, value]) => (
          <div
            key={label}
            className="mb-2 flex items-center justify-between gap-4 text-xs last:mb-0"
          >
            <span className="uppercase tracking-[0.14em] text-slate-500">
              {label}
            </span>
            <span className="text-slate-200">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {copy.notableFeatures}
        </p>
        <div className="flex flex-wrap gap-2">
          {info.stats.notableFeatures.map((feature) => (
            <span
              key={feature}
              className="border border-cyan-300/20 bg-cyan-950/20 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-cyan-100"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Toast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="pointer-events-none absolute right-5 top-20 border border-emerald-300/30 bg-emerald-950/35 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100 shadow-[0_0_24px_rgba(16,185,129,0.18)] backdrop-blur-xl">
      {message}
    </div>
  );
}

function SubtleCrosshair() {
  return (
    <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 opacity-12">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cyan-200/45" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-cyan-200/45" />
      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 border border-cyan-200/50" />
    </div>
  );
}

function getMissionStatus(
  missionId: string,
  selectedMissionId: string | null,
  completedMissionIds: string[],
): MissionStatus {
  if (completedMissionIds.includes(missionId)) return "completed";
  if (selectedMissionId === missionId) return "active";
  return "locked";
}

function commandToToast(command: CameraCommandType, language: Language) {
  const zh: Record<CameraCommandType, string> = {
    close: "相机已切近目标",
    focus: "目标已重新聚焦",
    overview: "总览视角已恢复",
    solarSystemOverview: "完整太阳系总览已打开",
    zoomIn: "相机拉近",
    zoomOut: "相机拉远",
  };
  const en: Record<CameraCommandType, string> = {
    close: "Close camera command sent",
    focus: "Target refocused",
    overview: "Overview restored",
    solarSystemOverview: "Solar system overview restored",
    zoomIn: "Camera moved closer",
    zoomOut: "Camera moved outward",
  };

  return language === "zh" ? zh[command] : en[command];
}

function formatSimMode(mode: SimMode, language: Language) {
  const labels: Record<Language, Record<SimMode, string>> = {
    en: {
      "CRUISE MODE": "CRUISE MODE",
      "PAUSED": "PAUSED",
      "REAL RATE": "REAL RATE",
    },
    zh: {
      "CRUISE MODE": "巡航模式",
      "PAUSED": "已暂停",
      "REAL RATE": "实时速率",
    },
  };

  return labels[language][mode];
}

function formatTourMode(mode: TourMode, language: Language) {
  const labels: Record<Language, Record<TourMode, string>> = {
    en: {
      active: "active",
      completed: "completed",
      idle: "idle",
    },
    zh: {
      active: "进行中",
      completed: "已完成",
      idle: "未启动",
    },
  };

  return labels[language][mode];
}

function formatArchiveExpeditionMode(
  mode: ArchiveExpeditionMode,
  language: Language,
) {
  const labels: Record<Language, Record<ArchiveExpeditionMode, string>> = {
    en: {
      active: "active",
      completed: "completed",
      idle: "idle",
    },
    zh: {
      active: "进行中",
      completed: "已完成",
      idle: "未启动",
    },
  };

  return labels[language][mode];
}

function formatHudMode(mode: HudMode, language: Language) {
  const labels: Record<Language, Record<HudMode, string>> = {
    en: {
      full: "FULL",
      hidden: "HIDDEN",
      minimal: "MINIMAL",
    },
    zh: {
      full: "完整",
      hidden: "隐藏",
      minimal: "精简",
    },
  };

  return labels[language][mode];
}

function formatLogEvent(type: ExplorationLogEntry["type"], language: Language) {
  const en: Record<ExplorationLogEntry["type"], string> = {
    archive_expedition_completed: "EXPEDITION COMPLETE",
    archive_expedition_started: "EXPEDITION STARTED",
    archive_route_cleared: "ROUTE CLEARED",
    archive_route_loaded: "ROUTE LOADED",
    archive_waypoint_locked: "WAYPOINT LOCKED",
    autopilot_complete: "AUTOPILOT COMPLETE",
    autopilot_engaged: "AUTOPILOT ENGAGED",
    cockpit_entered: "COCKPIT ENTERED",
    cockpit_exited: "COCKPIT EXITED",
    mission_completed: "MISSION COMPLETE",
    mission_started: "MISSION STARTED",
    mission_step: "MISSION STEP",
    scan_complete: "SCAN COMPLETE",
    scan_started: "SCAN STARTED",
    target_locked: "TARGET LOCKED",
    tour_completed: "TOUR COMPLETE",
    tour_started: "TOUR STARTED",
    tour_stop_completed: "STOP COMPLETE",
    tour_stop_focused: "STOP FOCUSED",
  };
  const zh: Record<ExplorationLogEntry["type"], string> = {
    archive_expedition_completed: "远征完成",
    archive_expedition_started: "远征启动",
    archive_route_cleared: "路线清除",
    archive_route_loaded: "路线载入",
    archive_waypoint_locked: "航点锁定",
    autopilot_complete: "自动导航完成",
    autopilot_engaged: "自动导航启动",
    cockpit_entered: "驾驶舱进入",
    cockpit_exited: "驾驶舱退出",
    mission_completed: "任务完成",
    mission_started: "任务启动",
    mission_step: "任务步骤",
    scan_complete: "扫描完成",
    scan_started: "扫描启动",
    target_locked: "目标锁定",
    tour_completed: "路线完成",
    tour_started: "路线启动",
    tour_stop_completed: "站点完成",
    tour_stop_focused: "站点聚焦",
  };

  return language === "zh" ? zh[type] : en[type];
}
