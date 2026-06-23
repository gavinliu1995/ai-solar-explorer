"use client";

import { getMissionById, getMissionCopy } from "@/app/data/missions";
import { getFlightMissionById } from "@/app/data/flightMissions";
import {
  getDiscoveryCardById,
  getScanDiscoveryCardCopy,
} from "@/app/data/discoveryCards";
import { getMissionBadgeById, getMissionBadgeCopy } from "@/app/data/missionBadges";
import { getCaptainRank } from "@/app/data/playerProgress";
import { SCAN_REWARDS } from "@/app/data/scanRewards";
import { SPACE_OBJECTS } from "@/app/data/spaceObjects";
import { LOCKABLE_TARGETS } from "@/app/types/space";
import type {
  ActiveFlightMissionState,
  ControlMode,
  FlightObjectiveState,
  FlightState,
  Language,
  PlayerProgress,
  SelectedTarget,
} from "@/app/types/space";
import CockpitFrame from "./CockpitFrame";

type CockpitOverlayProps = {
  controlMode: ControlMode;
  flightObjective: FlightObjectiveState | null;
  flightMission: ActiveFlightMissionState | null;
  flightState: FlightState;
  language: Language;
  playerProgress: PlayerProgress;
  scannedTargetIds: SelectedTarget[];
  selectedMissionId: string | null;
  selectedTarget: SelectedTarget;
  onAcceptFlightObjective: () => void;
  onCancelAutopilot: () => void;
  onCancelFlightMission: () => void;
  onEngageAutopilot: () => void;
  onExitCockpit: () => void;
  onFocusTarget: () => void;
  onScan: () => void;
};

const COPY = {
  en: {
    autopilot: "Auto Pilot",
    autopilotEngaged: "Autopilot Engaged",
    approachVector: "Approach Vector Locked",
    approachZone: "Approach Zone",
    alignTarget: "Align Target",
    boost: "Shift Boost",
    brake: "Space Brake",
    bearing: "Bearing",
    cancel: "Cancel",
    controlMode: "Control Mode",
    desktop: "Desktop recommended for cockpit mode",
    distance: "Distance",
    eta: "ETA",
    exit: "Exit Cockpit",
    focus: "Focus",
    focusKey: "F Focus",
    flightObjective: "Flight Objective",
    flightMission: "Flight Mission",
    flightMissionActive: "Flight Mission Active",
    objectiveComplete: "Objective Complete",
    objectiveProgress: "Objective Progress",
    acceptObjective: "Accept Objective",
    inRange: "In Range",
    lockedTarget: "Locked Target",
    missionCue: "Mission Cue",
    move: "WASD Move",
    navigation: "Target Navigation",
    outOfRange: "Out of Range",
    profile: "Profile",
    researchCredits: "Research Credits",
    proximity: "Proximity Warning",
    recorded: "Recorded to Captain's Log",
    reward: "Reward",
    scan: "Scan",
    scanAvailable: "Scan Available",
    scanComplete: "Scan Complete",
    scanned: "Scanned",
    scanning: "Scanning",
    scanResult: "Scan Result",
    scanStatus: "Scan Status",
    scanKey: "X Scan",
    scannedCount: "Scanned",
    speed: "Speed",
    status: "Status",
    rank: "Rank",
    targetCentered: "Target Centered",
    targetDirection: "Target Direction",
    title: "Cockpit Mode",
    throttle: "Throttle",
    unrecorded: "Unrecorded",
    xp: "Flight XP",
    upDown: "Q / E Vertical",
    escape: "Esc Exit Cockpit",
  },
  zh: {
    autopilot: "自动导航",
    autopilotEngaged: "自动导航中",
    approachVector: "接近向量已锁定",
    approachZone: "接近区",
    alignTarget: "对准目标",
    boost: "Shift 加速",
    brake: "Space 制动",
    bearing: "方位",
    cancel: "取消",
    controlMode: "控制模式",
    desktop: "驾驶舱模式建议使用桌面端",
    distance: "距离",
    eta: "预计抵达",
    exit: "退出驾驶舱",
    focus: "聚焦",
    focusKey: "F 聚焦",
    flightObjective: "飞行目标",
    flightMission: "飞行任务",
    flightMissionActive: "飞行任务进行中",
    objectiveComplete: "目标完成",
    objectiveProgress: "目标进度",
    acceptObjective: "接飞行任务",
    inRange: "范围内",
    lockedTarget: "锁定目标",
    missionCue: "任务提示",
    move: "WASD 移动",
    navigation: "目标导航",
    outOfRange: "超出扫描范围",
    profile: "轮廓",
    researchCredits: "研究点数",
    proximity: "接近警告",
    recorded: "已写入航行日志",
    reward: "奖励",
    scan: "扫描",
    scanAvailable: "可扫描",
    scanComplete: "扫描完成",
    scanned: "已扫描",
    scanning: "扫描中",
    scanResult: "扫描结果",
    scanStatus: "扫描状态",
    scanKey: "X 扫描",
    scannedCount: "已扫描",
    speed: "速度",
    status: "状态",
    rank: "等级",
    targetCentered: "目标居中",
    targetDirection: "目标方向",
    title: "驾驶舱模式",
    throttle: "推进",
    unrecorded: "未记录",
    xp: "飞行 XP",
    upDown: "Q / E 垂直",
    escape: "Esc 退出驾驶舱",
  },
} satisfies Record<Language, Record<string, string>>;

export default function CockpitOverlay({
  controlMode,
  flightObjective,
  flightMission,
  flightState,
  language,
  playerProgress,
  scannedTargetIds,
  selectedMissionId,
  selectedTarget,
  onAcceptFlightObjective,
  onCancelAutopilot,
  onCancelFlightMission,
  onEngageAutopilot,
  onExitCockpit,
  onFocusTarget,
  onScan,
}: CockpitOverlayProps) {
  const copy = COPY[language];
  const target = SPACE_OBJECTS[selectedTarget];
  const targetLabel = target.name[language];
  const mission = getMissionById(selectedMissionId);
  const activeCatalogMission = getFlightMissionById(
    flightMission?.missionId ?? null,
  );
  const activeCatalogObjective =
    activeCatalogMission && flightMission
      ? activeCatalogMission.objectives[flightMission.objectiveIndex]
      : null;
  const missionCopy = mission ? getMissionCopy(mission, language) : null;
  const isScanned = scannedTargetIds.includes(selectedTarget);
  const scanStatus = getScanStatus({
    copy,
    flightState,
    isScanned,
  });
  const navigationStatus = flightState.targetCentered
    ? copy.targetCentered
    : flightState.approachZone
      ? copy.approachZone
      : flightState.scanInRange
        ? copy.inRange
        : copy.outOfRange;
  const arrowX = 50 + flightState.targetBearingX * 36;
  const arrowY = 50 - flightState.targetBearingY * 36;
  const arrowRotation =
    Math.atan2(flightState.targetBearingY, flightState.targetBearingX) *
      (180 / Math.PI) +
    90;
  const scanProfile = getScanProfile(selectedTarget, language);
  const reward = SCAN_REWARDS[selectedTarget];
  const scanCard = (reward.discoveryCardIds ?? [])
    .map((cardId) => getDiscoveryCardById(cardId))
    .find((card) => card !== null);
  const scanBadge = (reward.badgeIds ?? [])
    .map((badgeId) => getMissionBadgeById(badgeId))
    .find((badge) => badge !== null);
  const scanCardCopy = scanCard
    ? getScanDiscoveryCardCopy(scanCard, language)
    : null;
  const scanBadgeCopy = scanBadge
    ? getMissionBadgeCopy(scanBadge, language)
    : null;
  const objectiveProgress = flightObjective
    ? Math.max(
        flightObjective.progress,
        flightObjective.completed ? 100 : 0,
        flightState.isScanning ? flightState.scanProgress : 0,
      )
    : 0;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 text-cyan-50">
      <CockpitFrame />
      <button
        type="button"
        onClick={onExitCockpit}
        className="pointer-events-auto absolute right-4 top-20 hidden border border-red-300/35 bg-black/60 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-100 shadow-[0_0_18px_rgba(248,113,113,0.16)] backdrop-blur-xl transition hover:border-red-200 max-[900px]:block"
      >
        {copy.exit}
      </button>
      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cyan-100/18 shadow-[0_0_14px_rgba(103,232,249,0.28)]" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-cyan-100/18 shadow-[0_0_14px_rgba(103,232,249,0.28)]" />
        <div
          className={[
            "absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 border",
            flightState.targetCentered
              ? "border-emerald-200/55 shadow-[0_0_22px_rgba(110,231,183,0.35)]"
              : "border-cyan-100/20",
          ].join(" ")}
        />
        <div
          className={[
            "absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border",
            flightState.isScanning
              ? "border-cyan-100/45 shadow-[0_0_30px_rgba(103,232,249,0.24)]"
              : "border-cyan-100/12",
          ].join(" ")}
        >
          <div
            className="absolute left-1/2 top-0 h-full w-px origin-bottom bg-cyan-100/30 transition-transform duration-100"
            style={{ transform: `translateX(-50%) rotate(${flightState.scanProgress * 3.6}deg)` }}
          />
        </div>
        <div
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 border-l border-t border-emerald-200/70 shadow-[0_0_18px_rgba(110,231,183,0.38)] transition-all duration-100"
          style={{
            left: `${arrowX}%`,
            top: `${arrowY}%`,
            transform: `translate(-50%, -50%) rotate(${arrowRotation}deg)`,
          }}
        />
      </div>

      <section className="absolute left-8 top-24 w-[min(28vw,330px)] border border-cyan-200/18 bg-black/38 p-4 shadow-[0_0_32px_rgba(8,145,178,0.12)] backdrop-blur-xl max-[900px]:left-4 max-[900px]:w-[calc(100vw-2rem)]">
        <div className="mb-4 flex items-center justify-between border-b border-cyan-100/10 pb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
            {copy.title}
          </p>
          <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.88)]" />
        </div>

        <TelemetryRow label={copy.lockedTarget} value={targetLabel} />
        <TelemetryRow
          label={copy.distance}
          value={formatDistance(flightState.distanceToTarget)}
        />
        <TelemetryRow label={copy.speed} value={`${flightState.speed.toFixed(1)} u/s`} />
        <TelemetryRow
          label={copy.throttle}
          value={`${Math.round(flightState.throttle * 100)}%`}
        />
        <TelemetryRow label={copy.xp} value={playerProgress.flightXp.toString()} />
        <TelemetryRow
          label={copy.researchCredits}
          value={playerProgress.researchCredits.toString()}
        />
        <TelemetryRow
          label={copy.scannedCount}
          value={`${playerProgress.scannedTargetIds.length}/${LOCKABLE_TARGETS.length}`}
        />
        <TelemetryRow
          label={copy.status}
          value={isScanned ? copy.scanned : copy.unrecorded}
        />
        <TelemetryRow
          label={copy.flightObjective}
          value={
            activeCatalogMission && flightMission
              ? `${flightMission.objectiveIndex + 1}/${activeCatalogMission.objectives.length}`
              : flightObjective
                ? flightObjective.completed
                  ? copy.objectiveComplete
                  : `${Math.round(objectiveProgress)}%`
              : "--"
          }
        />
        <TelemetryRow
          label={copy.rank}
          value={getCaptainRank(playerProgress.flightXp, language)}
        />
        <TelemetryRow
          label={copy.controlMode}
          value={
            controlMode === "autopilot"
              ? language === "zh"
                ? "自动导航"
                : "AUTOPILOT"
              : language === "zh"
                ? "自由飞行"
                : "FREE FLIGHT"
          }
        />
        <TelemetryRow label={copy.navigation} value={navigationStatus} />
        <TelemetryRow
          label={copy.bearing}
          value={`${formatSigned(flightState.targetBearingX)} / ${formatSigned(
            flightState.targetBearingY,
          )}`}
        />
        {flightState.proximityWarning ? (
          <div className="mb-3 border border-red-300/30 bg-red-950/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-100 shadow-[0_0_18px_rgba(248,113,113,0.18)]">
            {copy.proximity}
          </div>
        ) : null}

        {controlMode === "autopilot" ? (
          <div className="mb-4 border border-emerald-300/20 bg-emerald-950/10 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-emerald-100">
                {copy.autopilotEngaged}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {copy.eta}: {formatEta(flightState.etaSeconds)}
              </p>
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
              {copy.approachVector}
            </p>
            <div className="mt-3 h-1 border border-white/10 bg-white/[0.03]">
              <div
                className="h-full bg-emerald-200 shadow-[0_0_16px_rgba(110,231,183,0.42)] transition-[width]"
                style={{ width: `${Math.round(flightState.autopilotProgress * 100)}%` }}
              />
            </div>
          </div>
        ) : null}

        {activeCatalogMission && flightMission && activeCatalogObjective ? (
          <div className="mt-4 border border-emerald-300/25 bg-emerald-950/12 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
                {copy.flightMissionActive}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {flightMission.objectiveIndex + 1}/
                {activeCatalogMission.objectives.length}
              </p>
            </div>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-100">
              {activeCatalogMission.title[language]}
            </p>
            <p className="mt-2 text-xs font-semibold leading-5 text-cyan-50">
              {activeCatalogObjective.title[language]}
            </p>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              {activeCatalogObjective.instruction[language]}
            </p>
            <div className="mt-3 h-1 border border-white/10 bg-white/[0.03]">
              <div
                className="h-full bg-emerald-200 shadow-[0_0_16px_rgba(110,231,183,0.42)] transition-[width]"
                style={{
                  width: `${Math.round(
                    Math.min(100, Math.max(0, flightMission.objectiveProgress)),
                  )}%`,
                }}
              />
            </div>
            <button
              type="button"
              onClick={onCancelFlightMission}
              className="pointer-events-auto mt-3 w-full border border-red-300/25 bg-red-950/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-red-100 transition hover:border-red-200/60"
            >
              {copy.cancel}
            </button>
          </div>
        ) : flightObjective ? (
          <div className="mt-4 border border-emerald-300/20 bg-emerald-950/10 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
                {copy.flightObjective}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {flightObjective.completed
                  ? copy.objectiveComplete
                  : `${Math.round(objectiveProgress)}%`}
              </p>
            </div>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-200">
              {flightObjective.title}
            </p>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              {flightObjective.description}
            </p>
            <div className="mt-3 h-1 border border-white/10 bg-white/[0.03]">
              <div
                className="h-full bg-emerald-200 shadow-[0_0_16px_rgba(110,231,183,0.42)] transition-[width]"
                style={{ width: `${Math.round(objectiveProgress)}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAcceptFlightObjective}
            className="pointer-events-auto mt-4 w-full border border-emerald-300/30 bg-emerald-950/16 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100 transition hover:border-emerald-200"
          >
            {copy.acceptObjective}
          </button>
        )}

        {missionCopy ? (
          <div className="mt-4 border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              {copy.missionCue}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              {missionCopy.objective}
            </p>
          </div>
        ) : null}
      </section>

      <section className="absolute right-8 top-24 w-[min(24vw,300px)] border border-cyan-200/18 bg-black/38 p-4 shadow-[0_0_32px_rgba(8,145,178,0.12)] backdrop-blur-xl max-[900px]:hidden">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
          {copy.scanStatus}
        </p>
        <div
          className={[
            "relative mt-4 h-20 overflow-hidden border bg-white/[0.025]",
            flightState.scanAvailable || flightState.isScanning
              ? "border-cyan-300/32"
              : "border-white/10",
          ].join(" ")}
        >
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cyan-100/12" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-cyan-100/12" />
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 border border-cyan-100/16" />
          {flightState.isScanning ? (
            <div
              className="absolute top-0 h-full w-px bg-cyan-100/50 shadow-[0_0_16px_rgba(103,232,249,0.38)] transition-[left] duration-100"
              style={{ left: `${flightState.scanProgress}%` }}
            />
          ) : null}
          <div
            className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200 shadow-[0_0_16px_rgba(110,231,183,0.45)] transition-all duration-100"
            style={{
              left: `${50 + flightState.targetBearingX * 32}%`,
              top: `${50 - flightState.targetBearingY * 32}%`,
            }}
          />
        </div>
        <div className="mt-4 h-2 border border-white/10 bg-white/[0.03]">
          <div
            className="h-full bg-cyan-200 shadow-[0_0_16px_rgba(103,232,249,0.5)] transition-[width]"
            style={{ width: `${flightState.scanProgress}%` }}
          />
        </div>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-200">
          {scanStatus}
        </p>
        {isScanned ? (
          <div className="mt-4 border border-emerald-300/20 bg-emerald-950/12 p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-emerald-100">
              {copy.scanResult}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              {copy.lockedTarget}: {targetLabel}
            </p>
            <p className="text-xs leading-5 text-slate-300">
              {copy.profile}: {scanProfile}
            </p>
            {scanCardCopy ? (
              <p className="mt-2 text-xs leading-5 text-cyan-100">
                {copy.scanResult}: {scanCardCopy.title}
              </p>
            ) : null}
            <p className="mt-2 text-xs leading-5 text-slate-300">
              {copy.reward}: +{reward.xp ?? 0} XP / +
              {reward.researchCredits ?? 0}{" "}
              {language === "zh" ? "研究点数" : "Research Credits"}
            </p>
            {scanBadgeCopy ? (
              <p className="mt-1 text-xs leading-5 text-emerald-100">
                {language === "zh" ? "徽章" : "Badge"}: {scanBadgeCopy.title}
              </p>
            ) : null}
            <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-slate-500">
              {copy.recorded}
            </p>
          </div>
        ) : null}
        <div className="pointer-events-auto mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onScan}
            disabled={
              (!flightState.scanAvailable && !isScanned) ||
              flightState.isScanning
            }
            className="border border-cyan-300/35 bg-cyan-950/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-200 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-600"
          >
            {copy.scan}
          </button>
          <button
            type="button"
            onClick={onFocusTarget}
            className="border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-100"
          >
            {copy.focus}
          </button>
          <button
            type="button"
            onClick={
              controlMode === "autopilot" ? onCancelAutopilot : onEngageAutopilot
            }
            className="col-span-2 border border-emerald-300/30 bg-emerald-950/18 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100 transition hover:border-emerald-200"
          >
            {controlMode === "autopilot" ? copy.cancel : copy.autopilot}
          </button>
          <button
            type="button"
            onClick={onExitCockpit}
            className="col-span-2 border border-red-300/25 bg-red-950/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-red-100 transition hover:border-red-200/60"
          >
            {copy.exit}
          </button>
        </div>
      </section>

      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-2 px-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400 max-[900px]:bottom-24">
        {[copy.move, copy.boost, copy.brake, copy.upDown, copy.scanKey, copy.focusKey, copy.escape].map(
          (shortcut) => (
            <span
              key={shortcut}
              className="border border-cyan-100/10 bg-black/32 px-3 py-2 backdrop-blur-md"
            >
              {shortcut}
            </span>
          ),
        )}
      </div>

      <p className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-[10px] uppercase tracking-[0.16em] text-slate-500 max-[900px]:block">
        {copy.desktop}
      </p>
    </div>
  );
}

function TelemetryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-2 last:mb-0">
      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <span className="text-right text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
        {value}
      </span>
    </div>
  );
}

function formatDistance(distance: number | null) {
  if (distance === null) return "--";
  if (distance > 100) return `${distance.toFixed(0)} u`;
  if (distance > 10) return `${distance.toFixed(1)} u`;
  return `${distance.toFixed(2)} u`;
}

function formatSigned(value: number) {
  const normalized = Math.round(value * 100);
  return normalized > 0 ? `+${normalized}` : `${normalized}`;
}

function formatEta(seconds: number | null) {
  if (seconds === null) return "--";
  if (seconds > 60) return `${Math.ceil(seconds / 60)}m`;
  return `${Math.ceil(seconds)}s`;
}

function getScanStatus({
  copy,
  flightState,
  isScanned,
}: {
  copy: (typeof COPY)[Language];
  flightState: FlightState;
  isScanned: boolean;
}) {
  if (flightState.isScanning) {
    return `${copy.scanning} ${Math.round(flightState.scanProgress)}%`;
  }

  if (isScanned) return copy.scanned;
  if (flightState.scanInRange && !flightState.scanAligned) {
    return copy.alignTarget;
  }
  if (flightState.scanAvailable) return copy.scanAvailable;
  return copy.outOfRange;
}

function getScanProfile(target: SelectedTarget, language: Language) {
  const profiles: Record<SelectedTarget, Record<Language, string>> = {
    "asteroid-belt": {
      en: "Distributed rocky debris field",
      zh: "岩石碎片带结构",
    },
    "kuiper-belt": {
      en: "Outer icy body frontier",
      zh: "外太阳系冰质边疆",
    },
    ceres: { en: "Dwarf planet surface profile", zh: "矮行星表面轮廓" },
    earth: { en: "Atmosphere and ocean world", zh: "大气与海洋世界" },
    jupiter: { en: "Gas giant cloud system", zh: "气态巨行星云带系统" },
    mars: { en: "Cold desert terrain", zh: "寒冷荒漠地貌" },
    mercury: { en: "Cratered inner world", zh: "内太阳系撞击坑世界" },
    moon: { en: "Airless cratered satellite", zh: "无大气撞击坑卫星" },
    neptune: { en: "Ice giant atmosphere", zh: "冰巨星大气轮廓" },
    pluto: { en: "Kuiper Belt dwarf planet", zh: "柯伊伯带矮行星" },
    saturn: { en: "Ringed giant profile", zh: "环系统巨行星轮廓" },
    sun: { en: "Corona and solar wind source", zh: "日冕与太阳风源区" },
    uranus: { en: "Tilted ice giant profile", zh: "倾斜冰巨星轮廓" },
    venus: { en: "Dense cloud greenhouse world", zh: "厚云层温室世界" },
  };

  return profiles[target][language];
}
