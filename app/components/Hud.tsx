"use client";

import { useState } from "react";
import {
  getMissionById,
  getMissionSteps,
  getMissionsForTarget,
  getRecommendedMission,
} from "@/app/data/missions";
import { SPACE_OBJECTS } from "@/app/data/spaceObjects";
import type {
  ActivePanel,
  CameraCommandType,
  CameraMode,
  ControlSensitivity,
  ExplorationLogEntry,
  ExplorationPoint,
  HudMode,
  Language,
  Mission,
  MissionStep,
  MissionStatus,
  SelectedTarget,
  SimMode,
  ViewLayerState,
} from "@/app/types/space";
import {
  EXPLORATION_DETAILS_LOCALIZED,
  EXPLORATION_LABELS_LOCALIZED,
  TARGET_LABELS_LOCALIZED,
} from "@/app/types/space";

type HudProps = {
  activePanel: ActivePanel;
  cameraMode: CameraMode;
  completedMissionIds: string[];
  controlSensitivity: ControlSensitivity;
  detailOpen: boolean;
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
  viewLayers: ViewLayerState;
  welcomeOpen: boolean;
  onAdvanceMissionStep: () => void;
  onCameraCommand: (command: CameraCommandType) => void;
  onCompleteMission: (missionId: string) => void;
  onDismissWelcome: () => void;
  onOpenViewPanel: () => void;
  onRelatedItem: (item: string) => void;
  onSelectSearchTarget: (target: SelectedTarget) => void;
  onShareView: () => void;
  onStartMission: (mission: Mission) => void;
  onStartRecommendedMission: () => void;
  onToast: (message: string) => void;
  onToggleCameraMode: () => void;
  onToggleFullscreen: () => void;
  onToggleHudMode: () => void;
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
};

const TARGET_OPTIONS: SelectedTarget[] = [
  "earth",
  "moon",
  "mars",
  "jupiter",
  "saturn",
];

const BRAND_NAME: Record<Language, string> = {
  en: "ARGONAUT",
  zh: "寰宇星舟",
};

const COPY = {
  en: {
    about:
      "Argonaut is an independent educational prototype for mission-guided solar system exploration.",
    active: "active",
    aiSubtitle: "Guidance channel",
    aiTitle: "Mission Control",
    autoCruise: "Auto Cruise",
    close: "Close",
    completed: "completed",
    currentTarget: "Current Target",
    detail: "Detail",
    distance: "Distance",
    focusLock: "Focus Lock",
    freeExplore: "Free Explore",
    freeInstruction:
      "Mission control: free exploration is enabled. Use mouse, trackpad, or WASD / arrow keys. Lock the nearest target when ready.",
    hiddenHudButton: "HUD",
    hidePanel: "Hide Panel",
    info: "Info",
    keyboard:
      "Keyboard: WASD or arrow keys move in free mode. Shift accelerates, Option slows movement. Double-click a planet to lock it.",
    layersOpened: "Layer controls opened",
    live: "LIVE",
    lockNearest: "Lock",
    manualNav: "Manual Nav",
    menu: "Menu",
    missionActiveInstruction:
      "Adjust the view and inspect the target region. When finished, mark the mission complete in Mission Board.",
    missionBoard: "Mission Board",
    missionBoardSubtitle:
      "Mission Control has prepared a guided exploration sequence for this target.",
    missionComplete: "Mission complete",
    missionProgress: "Mission Progress",
    missionTargets: "Mission Targets",
    missions: "Missions",
    nextMission: "Next Recommended Mission",
    objectBrowser: "Object Browser",
    paused: "Paused",
    readMore: "Read More",
    related: "Related",
    resetDone: "Overview restored",
    search: "Search",
    searchPlaceholder: "Search Earth, Mars, Saturn...",
    settings: "Settings",
    settingsOpened: "Settings opened",
    share: "Share",
    shortcuts: "Keyboard Shortcuts",
    showLabels: "Show Labels",
    showOrbits: "Show Orbits",
    showProbes: "Show Probes",
    showStars: "Show Stars",
    simMode: "Simulation Mode",
    sourceBody:
      "Visual references may use public NASA/JPL resources or local educational textures. This prototype is not affiliated with or endorsed by NASA.",
    sources: "Sources / Credits",
    speed: "Speed",
    standard: "Standard",
    start: "Start Mission",
    startRecommended: "Start Recommended Mission",
    status: "Status",
    stats: "Stats",
    type: "Type",
    view: "View",
    welcomeBody:
      "Begin with one guided mission. Mission Control will give you three steps, track progress, and write your observations into the Exploration Log.",
    welcomeSkip: "Explore Freely",
    welcomeTitle: "Welcome aboard",
    explorationLog: "Exploration Log",
    noLog: "No mission events yet.",
  },
  zh: {
    about:
      "寰宇星舟是一个独立教育原型，用于任务引导式太阳系探索，不代表 NASA 背书。",
    active: "进行中",
    aiSubtitle: "引导频道",
    aiTitle: "Mission Control",
    autoCruise: "自动巡航",
    close: "关闭",
    completed: "已完成",
    currentTarget: "当前目标",
    detail: "详情",
    distance: "距离",
    focusLock: "目标锁定",
    freeExplore: "自由探索",
    freeInstruction:
      "任务控制：自由探索模式已启用。可使用鼠标、触控板或 WASD / 方向键移动，靠近目标后锁定最近星体。",
    hiddenHudButton: "HUD",
    hidePanel: "隐藏面板",
    info: "信息",
    keyboard:
      "快捷键：自由模式下使用 WASD 或方向键移动，Shift 加速，Option 减速。双击星球可直接锁定。",
    layersOpened: "图层控制已打开",
    live: "实时",
    lockNearest: "锁定",
    manualNav: "手动导航",
    menu: "菜单",
    missionActiveInstruction:
      "请调整视角并观察目标区域。完成后在 Mission Board 中点击 Complete 标记任务完成。",
    missionBoard: "Mission Board",
    missionBoardSubtitle: "Mission Control 已为当前目标准备任务引导序列。",
    missionComplete: "任务完成",
    missionProgress: "任务进度",
    missionTargets: "任务目标",
    missions: "任务",
    nextMission: "推荐下一任务",
    objectBrowser: "目标浏览器",
    paused: "暂停",
    readMore: "查看详情",
    related: "相关对象",
    resetDone: "总览视角已恢复",
    search: "搜索",
    searchPlaceholder: "搜索 地球、火星、土星...",
    settings: "设置",
    settingsOpened: "设置面板已打开",
    share: "分享",
    shortcuts: "键盘快捷键",
    showLabels: "显示标签",
    showOrbits: "显示轨道",
    showProbes: "显示探测器",
    showStars: "显示星空",
    simMode: "模拟模式",
    sourceBody:
      "视觉参考可能使用 NASA/JPL 公开资源或本地教育纹理。本项目与 NASA 无隶属关系，也不代表 NASA 背书。",
    sources: "来源 / 署名",
    speed: "速度",
    standard: "标准",
    start: "Start Mission",
    startRecommended: "开始推荐任务",
    status: "状态",
    stats: "参数",
    type: "类型",
    view: "视图",
    welcomeBody:
      "先完成一个引导任务。Mission Control 会给你 3 个步骤，记录进度，并把观察结果写入 Exploration Log。",
    welcomeSkip: "先自由探索",
    welcomeTitle: "欢迎登舰",
    explorationLog: "Exploration Log",
    noLog: "暂无任务记录。",
  },
} satisfies Record<Language, Record<string, string>>;

const TARGET_SUGGESTIONS: Record<Language, Record<SelectedTarget, string>> = {
  en: {
    earth:
      "Recommendation: begin with the Earth-Moon system and inspect the Moon orbit plus atmospheric glow.",
    moon:
      "Recommendation: inspect lunar maria and keep Earth direction as the navigation reference.",
    mars: "Recommendation: start a Mars terrain scan mission.",
    jupiter:
      "Recommendation: observe Jupiter's cloud bands and immense gas giant scale.",
    saturn:
      "Recommendation: approach Saturn's rings and start a ring-system scan.",
  },
  zh: {
    earth: "建议从地月系统开始，观察月球轨道和地球大气层。",
    moon: "建议观察月海，并以地球方向作为导航参考。",
    mars: "建议启动火星地貌扫描任务。",
    jupiter: "建议观察木星云带和巨大尺度。",
    saturn: "建议靠近土星环，启动环系统扫描。",
  },
};

export default function Hud({
  activePanel,
  cameraMode,
  completedMissionIds,
  controlSensitivity,
  detailOpen,
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
  viewLayers,
  welcomeOpen,
  onAdvanceMissionStep,
  onCameraCommand,
  onCompleteMission,
  onDismissWelcome,
  onOpenViewPanel,
  onRelatedItem,
  onSelectSearchTarget,
  onShareView,
  onStartMission,
  onStartRecommendedMission,
  onToast,
  onToggleCameraMode,
  onToggleFullscreen,
  onToggleHudMode,
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
    onToast(`模拟模式：${nextMode}`);
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
          nearestTargetLabel={nearestTargetLabel}
          onCameraCommand={onCameraCommand}
          onMenuNotice={setMenuNotice}
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
          nearestTargetLabel={nearestTargetLabel}
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

      {hudMode === "full" ? (
        <>
          <LeftPanel
            activePanel={activePanel}
            collapsed={leftPanelCollapsed}
            completedMissionIds={completedMissionIds}
            controlSensitivity={controlSensitivity}
            copy={copy}
            detailOpen={detailOpen}
            explorationLog={explorationLog}
            explorationPoint={explorationPoint}
            language={language}
            missionStepIndex={missionStepIndex}
            recommendedMission={recommendedMission}
            selectedMissionId={selectedMissionId}
            selectedTarget={selectedTarget}
            simMode={simMode}
            viewLayers={viewLayers}
            onAdvanceMissionStep={onAdvanceMissionStep}
            onCompleteMission={onCompleteMission}
            onRelatedItem={onRelatedItem}
            onStartMission={onStartMission}
            setActivePanel={setActivePanel}
            setCollapsed={setLeftPanelCollapsed}
            setControlSensitivity={setControlSensitivity}
            setDetailOpen={setDetailOpen}
            setSimMode={setSimMode}
            setViewLayers={setViewLayers}
          />
          <RightToolbar
            copy={copy}
            language={language}
            onFullscreen={onToggleFullscreen}
            onOpenLayers={() => openViewPanelWithFeedback(copy.layersOpened)}
            onOpenSettings={() => openViewPanelWithFeedback(copy.settingsOpened)}
            onTriggerCommand={(command) => {
              onCameraCommand(command);
              onToast(commandToToast(command, language));
            }}
          />
          <AssistantPanel
            cameraMode={cameraMode}
            completedMissionIds={completedMissionIds}
            copy={copy}
            explorationPoint={explorationPoint}
            language={language}
            missionStepIndex={missionStepIndex}
            selectedMissionId={selectedMissionId}
            selectedTarget={selectedTarget}
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

      <MissionTargets
        cameraMode={cameraMode}
        copy={copy}
        language={language}
        selectedTarget={selectedTarget}
        simMode={simMode}
        setSelectedTarget={setSelectedTarget}
      />

      {hudMode === "full" ? (
        <BottomTimeline
          cameraMode={cameraMode}
          copy={copy}
          language={language}
          selectedTarget={selectedTarget}
          simMode={simMode}
          onCycleSimMode={cycleSimMode}
        />
      ) : (
        <MinimalStatus
          cameraMode={cameraMode}
          copy={copy}
          language={language}
          selectedTarget={selectedTarget}
          simMode={simMode}
        />
      )}

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
        <HudModeButton hudMode={hudMode} onClick={onToggleHudMode} />

        {menuOpen ? (
          <MenuPopover
            copy={copy}
            menuNotice={menuNotice}
            onAbout={() => onMenuNotice(copy.about)}
            onKeyboard={() => onMenuNotice(copy.keyboard)}
            onReset={() => {
              onCameraCommand("overview");
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
        <HudModeButton hudMode={hudMode} onClick={onToggleHudMode} />
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
      {language === "zh" ? "中文 / EN" : "EN / 中文"}
    </button>
  );
}

function HudModeButton({
  hudMode,
  onClick,
}: {
  hudMode: HudMode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-cyan-300/35 bg-cyan-950/20 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-200 active:scale-[0.98]"
    >
      HUD: {hudMode}
    </button>
  );
}

function MenuPopover({
  copy,
  menuNotice,
  onAbout,
  onKeyboard,
  onReset,
  onToggleHud,
}: {
  copy: (typeof COPY)[Language];
  menuNotice: string | null;
  onAbout: () => void;
  onKeyboard: () => void;
  onReset: () => void;
  onToggleHud: () => void;
}) {
  return (
    <div className="absolute right-0 top-12 w-72 border border-white/10 bg-black/82 p-3 shadow-[0_0_38px_rgba(2,6,23,0.8)] backdrop-blur-2xl">
      {[
        ["About Prototype", onAbout],
        [copy.shortcuts, onKeyboard],
        ["Reset View", onReset],
        ["Toggle HUD", onToggleHud],
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
  onSelectTarget,
}: {
  copy: (typeof COPY)[Language];
  language: Language;
  query: string;
  setQuery: (query: string) => void;
  onClose: () => void;
  onSelectTarget: (target: SelectedTarget) => void;
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const results = TARGET_OPTIONS.filter((target) => {
    const info = SPACE_OBJECTS[target];
    return (
      !normalizedQuery ||
      info.name.en.toLowerCase().includes(normalizedQuery) ||
      info.name.zh.includes(query.trim())
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
          }
        }}
        placeholder={copy.searchPlaceholder}
        className="w-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/45"
      />
      <div className="mt-3 grid gap-2">
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
          {recommendedMission.title}
        </h2>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          {recommendedMission.objective}
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
  collapsed,
  completedMissionIds,
  controlSensitivity,
  copy,
  detailOpen,
  explorationLog,
  explorationPoint,
  language,
  missionStepIndex,
  recommendedMission,
  selectedMissionId,
  selectedTarget,
  simMode,
  viewLayers,
  onAdvanceMissionStep,
  onCompleteMission,
  onRelatedItem,
  onStartMission,
  setActivePanel,
  setCollapsed,
  setControlSensitivity,
  setDetailOpen,
  setSimMode,
  setViewLayers,
}: {
  activePanel: ActivePanel;
  collapsed: boolean;
  completedMissionIds: string[];
  controlSensitivity: ControlSensitivity;
  copy: (typeof COPY)[Language];
  detailOpen: boolean;
  explorationLog: ExplorationLogEntry[];
  explorationPoint: ExplorationPoint;
  language: Language;
  missionStepIndex: number;
  recommendedMission: Mission;
  selectedMissionId: string | null;
  selectedTarget: SelectedTarget;
  simMode: SimMode;
  viewLayers: ViewLayerState;
  onAdvanceMissionStep: () => void;
  onCompleteMission: (missionId: string) => void;
  onRelatedItem: (item: string) => void;
  onStartMission: (mission: Mission) => void;
  setActivePanel: (panel: ActivePanel) => void;
  setCollapsed: (collapsed: boolean) => void;
  setControlSensitivity: (sensitivity: ControlSensitivity) => void;
  setDetailOpen: (open: boolean) => void;
  setSimMode: (mode: SimMode) => void;
  setViewLayers: (layers: ViewLayerState) => void;
}) {
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="pointer-events-auto absolute left-4 top-20 border border-cyan-300/55 bg-black/65 px-3 py-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.18)] backdrop-blur-xl transition hover:border-cyan-200 hover:bg-cyan-950/35"
        style={{ writingMode: "vertical-rl" }}
      >
        {copy.objectBrowser}
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

      <div className="flex border-b border-white/10">
        {(["info", "missions", "view"] as ActivePanel[]).map((panel) => (
          <button
            key={panel}
            type="button"
            onClick={() => setActivePanel(panel)}
            className={[
              "flex-1 border-r border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition last:border-r-0",
              activePanel === panel
                ? "bg-cyan-950/35 text-cyan-100"
                : "text-slate-400 hover:text-slate-100",
            ].join(" ")}
          >
            {getPanelLabel(panel, copy)}
          </button>
        ))}
      </div>

      <div className="overflow-y-auto p-4">
        {activePanel === "info" ? (
          <InfoTab
            copy={copy}
            detailOpen={detailOpen}
            explorationPoint={explorationPoint}
            language={language}
            selectedTarget={selectedTarget}
            onRelatedItem={onRelatedItem}
            setDetailOpen={setDetailOpen}
          />
        ) : activePanel === "missions" ? (
          <MissionsTab
            completedMissionIds={completedMissionIds}
            copy={copy}
            explorationLog={explorationLog}
            missionStepIndex={missionStepIndex}
            recommendedMission={recommendedMission}
            selectedMissionId={selectedMissionId}
            selectedTarget={selectedTarget}
            onAdvanceMissionStep={onAdvanceMissionStep}
            onCompleteMission={onCompleteMission}
            onStartMission={onStartMission}
          />
        ) : (
          <ViewTab
            controlSensitivity={controlSensitivity}
            copy={copy}
            simMode={simMode}
            viewLayers={viewLayers}
            setControlSensitivity={setControlSensitivity}
            setSimMode={setSimMode}
            setViewLayers={setViewLayers}
          />
        )}
      </div>
    </aside>
  );
}

function getPanelLabel(panel: ActivePanel, copy: (typeof COPY)[Language]) {
  if (panel === "info") return copy.info;
  if (panel === "missions") return copy.missions;
  return copy.view;
}

function InfoTab({
  copy,
  explorationPoint,
  language,
  selectedTarget,
  onRelatedItem,
  setDetailOpen,
}: {
  copy: (typeof COPY)[Language];
  detailOpen: boolean;
  explorationPoint: ExplorationPoint;
  language: Language;
  selectedTarget: SelectedTarget;
  onRelatedItem: (item: string) => void;
  setDetailOpen: (open: boolean) => void;
}) {
  const info = SPACE_OBJECTS[selectedTarget];

  return (
    <div>
      <div className="border-b border-white/10 pb-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-emerald-200">
          {copy.currentTarget}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-wide text-white">
          {info.name[language]}
        </h1>
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

      <p className="mt-5 border border-white/10 bg-black/30 p-3 text-[11px] leading-5 text-slate-500">
        <span className="mb-1 block font-semibold uppercase tracking-[0.18em] text-slate-400">
          {copy.sources}
        </span>
        {copy.sourceBody}
      </p>
    </div>
  );
}

function MissionsTab({
  completedMissionIds,
  copy,
  explorationLog,
  missionStepIndex,
  recommendedMission,
  selectedMissionId,
  selectedTarget,
  onAdvanceMissionStep,
  onCompleteMission,
  onStartMission,
}: {
  completedMissionIds: string[];
  copy: (typeof COPY)[Language];
  explorationLog: ExplorationLogEntry[];
  missionStepIndex: number;
  recommendedMission: Mission;
  selectedMissionId: string | null;
  selectedTarget: SelectedTarget;
  onAdvanceMissionStep: () => void;
  onCompleteMission: (missionId: string) => void;
  onStartMission: (mission: Mission) => void;
}) {
  const missions = getMissionsForTarget(selectedTarget);
  const selectedMission = getMissionById(selectedMissionId);
  const selectedMissionSteps = selectedMission
    ? getMissionSteps(selectedMission)
    : [];
  const selectedMissionCompleted = selectedMission
    ? completedMissionIds.includes(selectedMission.id)
    : false;
  const completedCount = completedMissionIds.length;
  const totalCount = getMissionsForTarget("earth").length +
    getMissionsForTarget("moon").length +
    getMissionsForTarget("mars").length +
    getMissionsForTarget("jupiter").length +
    getMissionsForTarget("saturn").length;

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

      {selectedMission ? (
        <ActiveMissionStepCard
          completed={completedMissionIds.includes(selectedMission.id)}
          copy={copy}
          mission={selectedMission}
          missionStepIndex={missionStepIndex}
          steps={selectedMissionSteps}
          onAdvanceMissionStep={onAdvanceMissionStep}
          onCompleteMission={onCompleteMission}
        />
      ) : (
        <RecommendedMissionCard
          copy={copy}
          mission={recommendedMission}
          onStartMission={onStartMission}
        />
      )}

      {selectedMission && selectedMissionCompleted ? (
        <RecommendedMissionCard
          copy={copy}
          mission={recommendedMission}
          onStartMission={onStartMission}
        />
      ) : null}

      {missions.map((mission) => {
        const status = getMissionStatus(
          mission.id,
          selectedMissionId,
          completedMissionIds,
        );

        return (
          <article
            key={mission.id}
            className={[
              "border p-3 transition",
              status === "active"
                ? "border-cyan-300/45 bg-cyan-950/22 shadow-[0_0_22px_rgba(34,211,238,0.12)]"
                : status === "completed"
                  ? "border-emerald-300/35 bg-emerald-950/14"
                  : "border-white/10 bg-white/[0.03]",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-100">
                {mission.title}
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
                    : "locked"}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {mission.description}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              {mission.objective}
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
                Complete
              </button>
            </div>
          </article>
        );
      })}

      <ExplorationLogPanel
        copy={copy}
        explorationLog={explorationLog}
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
  mission,
  onStartMission,
}: {
  copy: (typeof COPY)[Language];
  mission: Mission;
  onStartMission: (mission: Mission) => void;
}) {
  return (
    <article className="border border-emerald-300/20 bg-emerald-950/12 p-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">
        {copy.nextMission}
      </p>
      <h3 className="mt-2 text-sm font-semibold text-slate-100">
        {mission.title}
      </h3>
      <p className="mt-2 text-xs leading-5 text-slate-400">
        {mission.objective}
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
  mission,
  missionStepIndex,
  steps,
  onAdvanceMissionStep,
  onCompleteMission,
}: {
  completed: boolean;
  copy: (typeof COPY)[Language];
  mission: Mission;
  missionStepIndex: number;
  steps: MissionStep[];
  onAdvanceMissionStep: () => void;
  onCompleteMission: (missionId: string) => void;
}) {
  const boundedStepIndex = Math.min(missionStepIndex, steps.length - 1);
  const currentStep = steps[boundedStepIndex];
  const stepNumber = boundedStepIndex + 1;

  return (
    <article className="border border-cyan-300/35 bg-cyan-950/18 p-3 shadow-[0_0_22px_rgba(34,211,238,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-100">
            Active Mission Step {stepNumber}/3
          </p>
          <h3 className="mt-2 text-sm font-semibold text-slate-100">
            {mission.title}
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
          Complete
        </button>
      </div>
    </article>
  );
}

function ExplorationLogPanel({
  copy,
  explorationLog,
}: {
  copy: (typeof COPY)[Language];
  explorationLog: ExplorationLogEntry[];
}) {
  return (
    <section className="border border-white/10 bg-black/28 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {copy.explorationLog}
      </p>
      <div className="mt-3 grid max-h-36 gap-2 overflow-y-auto">
        {explorationLog.length === 0 ? (
          <p className="text-xs text-slate-600">{copy.noLog}</p>
        ) : (
          explorationLog.slice(0, 6).map((entry) => (
            <div
              key={entry.id}
              className="border border-white/10 bg-white/[0.03] p-2 text-xs"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="uppercase tracking-[0.14em] text-slate-500">
                  {entry.type}
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

function ViewTab({
  controlSensitivity,
  copy,
  simMode,
  viewLayers,
  setControlSensitivity,
  setSimMode,
  setViewLayers,
}: {
  controlSensitivity: ControlSensitivity;
  copy: (typeof COPY)[Language];
  simMode: SimMode;
  viewLayers: ViewLayerState;
  setControlSensitivity: (sensitivity: ControlSensitivity) => void;
  setSimMode: (mode: SimMode) => void;
  setViewLayers: (layers: ViewLayerState) => void;
}) {
  return (
    <div className="grid gap-3 text-sm text-slate-300">
      {(
        [
          ["orbits", copy.showOrbits],
          ["labels", copy.showLabels],
          ["probes", copy.showProbes],
          ["stars", copy.showStars],
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
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-white/10 bg-white/[0.03] p-3">
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
          控制灵敏度
        </p>
        <div className="grid grid-cols-3 gap-1">
          {(
            [
              ["low", "低"],
              ["normal", copy.standard],
              ["high", "高"],
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
  language,
  onFullscreen,
  onOpenLayers,
  onOpenSettings,
  onTriggerCommand,
}: {
  copy: (typeof COPY)[Language];
  language: Language;
  onFullscreen: () => void;
  onOpenLayers: () => void;
  onOpenSettings: () => void;
  onTriggerCommand: (command: CameraCommandType) => void;
}) {
  const tools: Array<{
    label: string;
    onClick: () => void;
    title: string;
  }> = [
    { label: language === "zh" ? "图层" : "Layers", onClick: onOpenLayers, title: "Layers" },
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
  completedMissionIds,
  copy,
  explorationPoint,
  language,
  missionStepIndex,
  selectedMissionId,
  selectedTarget,
}: {
  cameraMode: CameraMode;
  completedMissionIds: string[];
  copy: (typeof COPY)[Language];
  explorationPoint: ExplorationPoint;
  language: Language;
  missionStepIndex: number;
  selectedMissionId: string | null;
  selectedTarget: SelectedTarget;
}) {
  const mission = getMissionById(selectedMissionId);
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
  });

  return (
    <aside className="pointer-events-auto absolute bottom-24 right-24 w-[min(31vw,350px)] border border-white/10 bg-black/48 p-4 shadow-[0_0_28px_rgba(8,145,178,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-300">
            {copy.aiTitle}
          </h2>
          <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-slate-600">
            {mission ? mission.title : copy.aiSubtitle}
          </p>
        </div>
        <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.85)]" />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{message}</p>
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
}: {
  cameraMode: CameraMode;
  completed: boolean;
  copy: (typeof COPY)[Language];
  explorationPoint: ExplorationPoint;
  language: Language;
  mission: Mission | null;
  missionStepIndex: number;
  selectedTarget: SelectedTarget;
}) {
  if (cameraMode === "free") return copy.freeInstruction;

  if (mission) {
    const steps = getMissionSteps(mission);
    const currentStep = steps[Math.min(missionStepIndex, steps.length - 1)];

    if (completed) {
      return `${copy.missionComplete}：${mission.title}。${copy.nextMission} 已在 Mission Board 中准备好。`;
    }

    return `Step ${Math.min(missionStepIndex + 1, steps.length)}/3：${currentStep.instruction}`;
  }

  if (explorationPoint) {
    return EXPLORATION_DETAILS_LOCALIZED[language][explorationPoint];
  }

  return TARGET_SUGGESTIONS[language][selectedTarget];
}

function MissionTargets({
  cameraMode,
  copy,
  language,
  selectedTarget,
  simMode,
  setSelectedTarget,
}: {
  cameraMode: CameraMode;
  copy: (typeof COPY)[Language];
  language: Language;
  selectedTarget: SelectedTarget;
  simMode: SimMode;
  setSelectedTarget: (target: SelectedTarget) => void;
}) {
  const labels = TARGET_LABELS_LOCALIZED[language];

  return (
    <nav className="pointer-events-auto absolute bottom-28 left-4 w-[min(90vw,540px)] border border-white/10 bg-black/56 p-3 backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          {copy.missionTargets}
        </p>
        <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">
          {cameraMode === "free" ? copy.manualNav : simMode}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {TARGET_OPTIONS.map((target) => {
          const isActive = selectedTarget === target;

          return (
            <button
              key={target}
              type="button"
              onClick={() => setSelectedTarget(target)}
              className={[
                "border px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition active:scale-[0.98]",
                isActive
                  ? "border-cyan-300 bg-cyan-950/40 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.22)]"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-cyan-300/35 hover:text-slate-100",
              ].join(" ")}
            >
              {labels[target]}
            </button>
          );
        })}
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
  onCycleSimMode,
}: {
  cameraMode: CameraMode;
  copy: (typeof COPY)[Language];
  language: Language;
  selectedTarget: SelectedTarget;
  simMode: SimMode;
  onCycleSimMode: () => void;
}) {
  const targetLabel = TARGET_LABELS_LOCALIZED[language][selectedTarget];

  return (
    <footer className="pointer-events-auto absolute bottom-4 left-1/2 flex w-[min(72vw,760px)] -translate-x-1/2 items-center justify-between border border-white/10 bg-black/62 px-4 py-3 text-xs backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
        <span className="font-semibold uppercase tracking-[0.18em] text-emerald-200">
          {simMode === "PAUSED" ? copy.paused : copy.live}
        </span>
        <span className="hidden text-slate-500 sm:inline">JUN 15, 2026</span>
      </div>

      <div className="flex items-center gap-4 text-slate-300">
        <span className="hidden uppercase tracking-[0.16em] sm:inline">
          {cameraMode === "free" ? copy.freeExplore : simMode}
        </span>
        <button
          type="button"
          onClick={onCycleSimMode}
          className="h-8 w-8 rounded-full border border-cyan-300/35 bg-cyan-950/25 shadow-[0_0_18px_rgba(34,211,238,0.18)] transition hover:border-cyan-200 active:scale-[0.96]"
          title={copy.simMode}
        />
        <span className="font-mono text-slate-200">02:33:02 PM</span>
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
}: {
  cameraMode: CameraMode;
  copy: (typeof COPY)[Language];
  language: Language;
  selectedTarget: SelectedTarget;
  simMode: SimMode;
}) {
  const targetLabel = TARGET_LABELS_LOCALIZED[language][selectedTarget];

  return (
    <footer className="pointer-events-auto absolute bottom-4 left-1/2 flex w-[min(82vw,620px)] -translate-x-1/2 items-center justify-between border border-white/10 bg-black/50 px-4 py-2 text-[11px] backdrop-blur-xl">
      <div className="flex items-center gap-2 uppercase tracking-[0.16em] text-emerald-200">
        <span className="h-2 w-2 rounded-full bg-emerald-300" />
        {simMode === "PAUSED" ? copy.paused : copy.live}
      </div>
      <span className="uppercase tracking-[0.16em] text-slate-300">
        {targetLabel} / {cameraMode === "free" ? copy.freeExplore : simMode}
      </span>
      <span className="font-mono text-slate-400">02:33:02 PM</span>
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
          ["Diameter", info.stats.diameter],
          ["Distance", info.stats.distanceFromSun],
          ["Orbital Period", info.stats.orbitalPeriod],
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
          Notable Features
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
    zoomIn: "相机拉近",
    zoomOut: "相机拉远",
  };
  const en: Record<CameraCommandType, string> = {
    close: "Close camera command sent",
    focus: "Target refocused",
    overview: "Overview restored",
    zoomIn: "Camera moved closer",
    zoomOut: "Camera moved outward",
  };

  return language === "zh" ? zh[command] : en[command];
}
