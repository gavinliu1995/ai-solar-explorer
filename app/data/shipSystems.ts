import type {
  Language,
  MissionBadgeId,
  PlayerProgress,
  ShipSystem,
} from "@/app/types/space";

export const SHIP_SYSTEMS: ShipSystem[] = [
  {
    description: {
      en: "Core scan suite for cockpit target recording.",
      zh: "用于驾驶舱目标记录的基础扫描套件。",
    },
    id: "basic-scanner",
    subtitle: { en: "Default science package", zh: "默认科学载荷" },
    title: { en: "Basic Scanner", zh: "基础扫描仪" },
    unlockRequirement: {},
  },
  {
    description: {
      en: "Reticle calibration for more confident scan alignment.",
      zh: "扫描框校准模块，让目标对准反馈更明确。",
    },
    id: "precision-reticle",
    subtitle: { en: "Alignment assistance calibrated", zh: "对准辅助已校准" },
    title: { en: "Precision Reticle", zh: "精密扫描框" },
    unlockRequirement: { minXp: 200 },
  },
  {
    description: {
      en: "Deep-space approach readouts for longer cockpit transfers.",
      zh: "用于远距离驾驶舱转移的深空接近读数。",
    },
    id: "deep-space-autopilot",
    subtitle: { en: "Approach vector telemetry", zh: "接近向量遥测" },
    title: { en: "Deep Space Autopilot", zh: "深空自动导航" },
    unlockRequirement: { minXp: 500 },
  },
  {
    description: {
      en: "Ring particle analysis package for Saturn-class surveys.",
      zh: "面向土星环系统巡测的环颗粒分析包。",
    },
    id: "ring-analyzer",
    subtitle: { en: "Ring system suite", zh: "环系统套件" },
    title: { en: "Ring Analyzer", zh: "环系统分析仪" },
    unlockRequirement: {
      badgeIds: ["ring-system-analyst"],
      completedMissionIds: ["scan-saturn-rings"],
    },
  },
  {
    description: {
      en: "Outer-atmosphere sensor tuning for Uranus and Neptune surveys.",
      zh: "面向天王星与海王星巡测的外层大气传感器调校。",
    },
    id: "ice-giant-sensor",
    subtitle: { en: "Ice giant profile sensor", zh: "冰巨星轮廓传感器" },
    title: { en: "Ice Giant Sensor", zh: "冰巨星传感器" },
    unlockRequirement: { badgeIds: ["ice-giant-surveyor"] },
  },
  {
    description: {
      en: "Navigation references for Pluto and Kuiper Belt frontier work.",
      zh: "用于冥王星和柯伊伯带边疆任务的导航参考。",
    },
    id: "frontier-navigation",
    subtitle: { en: "Outer frontier guidance", zh: "外侧边疆导航" },
    title: { en: "Frontier Navigation", zh: "边疆导航系统" },
    unlockRequirement: { badgeIds: ["outer-frontier-pilot"] },
  },
];

export function isShipSystemUnlocked(
  system: ShipSystem,
  progress: PlayerProgress,
) {
  if (system.id === "basic-scanner") return true;
  const requirement = system.unlockRequirement;
  const meetsXp = requirement.minXp
    ? progress.flightXp >= requirement.minXp
    : true;
  const hasBadgeRequirement = Boolean(requirement.badgeIds?.length);
  const hasMissionRequirement = Boolean(requirement.completedMissionIds?.length);
  const hasRequiredBadge = hasBadgeRequirement
    ? requirement.badgeIds?.some((badgeId: MissionBadgeId) =>
        progress.unlockedBadgeIds.includes(badgeId),
      ) ?? false
    : true;
  const hasRequiredMission = hasMissionRequirement
    ? requirement.completedMissionIds?.some((missionId) =>
        progress.completedFlightMissionIds.includes(missionId),
      ) ?? false
    : true;
  const meetsBadgeOrMission =
    hasBadgeRequirement && hasMissionRequirement
      ? hasRequiredBadge || hasRequiredMission
      : hasRequiredBadge && hasRequiredMission;

  return meetsXp && meetsBadgeOrMission;
}

export function getUnlockedShipSystems(progress: PlayerProgress) {
  return SHIP_SYSTEMS.filter((system) => isShipSystemUnlocked(system, progress));
}

export function formatShipSystemRequirement(
  system: ShipSystem,
  language: Language,
) {
  const requirement = system.unlockRequirement;
  const parts: string[] = [];

  if (requirement.minXp) {
    parts.push(
      language === "zh"
        ? `${requirement.minXp} XP`
        : `${requirement.minXp} XP`,
    );
  }
  if (requirement.badgeIds?.length) {
    parts.push(language === "zh" ? "对应徽章" : "required badge");
  }
  if (requirement.completedMissionIds?.length) {
    parts.push(language === "zh" ? "对应飞行任务" : "required mission");
  }

  if (!parts.length) return language === "zh" ? "默认解锁" : "Unlocked by default";

  return language === "zh" ? parts.join(" + ") : parts.join(" + ");
}
