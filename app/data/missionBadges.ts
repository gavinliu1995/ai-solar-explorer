import type {
  Language,
  MissionBadge,
  MissionBadgeId,
} from "@/app/types/space";

type MissionBadgeCopy = Pick<
  MissionBadge,
  "description" | "subtitle" | "title"
>;

export const MISSION_BADGES: MissionBadge[] = [
  {
    description:
      "Awarded for recording scan data across the inner solar system.",
    id: "inner-worlds-observer",
    subtitle: "Inner system survey patch",
    title: "Inner Worlds Observer",
  },
  {
    description:
      "Awarded for completing a Mars cockpit scan and recording red planet terrain context.",
    id: "mars-field-surveyor",
    subtitle: "Mars surface context patch",
    title: "Mars Field Surveyor",
  },
  {
    description:
      "Awarded for recording a gas giant atmosphere profile.",
    id: "giant-planet-navigator",
    subtitle: "Giant planet navigation patch",
    title: "Giant Planet Navigator",
  },
  {
    description:
      "Awarded for recording Saturn ring system scan data.",
    id: "ring-system-analyst",
    subtitle: "Ring system analysis patch",
    title: "Ring System Analyst",
  },
  {
    description:
      "Awarded for scanning one of the outer ice giants.",
    id: "ice-giant-surveyor",
    subtitle: "Ice giant survey patch",
    title: "Ice Giant Surveyor",
  },
  {
    description:
      "Awarded for reaching and scanning the outer icy frontier.",
    id: "outer-frontier-pilot",
    subtitle: "Outer frontier navigation patch",
    title: "Outer Frontier Pilot",
  },
  {
    description:
      "Awarded for beginning a structured route through the complete solar system.",
    id: "grand-tour-cadet",
    subtitle: "Route-based exploration patch",
    title: "Grand Tour Cadet",
  },
  {
    description:
      "Awarded for following a historic spacecraft route profile.",
    id: "voyager-route-observer",
    subtitle: "Mission archives route patch",
    title: "Voyager Route Observer",
  },
];

const MISSION_BADGE_ZH: Record<MissionBadgeId, MissionBadgeCopy> = {
  "giant-planet-navigator": {
    description: "记录气态巨行星大气轮廓后授予。",
    subtitle: "巨行星导航章",
    title: "巨行星领航员",
  },
  "grand-tour-cadet": {
    description: "开始完整太阳系路线探索后授予。",
    subtitle: "路线探索章",
    title: "大巡航见习员",
  },
  "ice-giant-surveyor": {
    description: "扫描外太阳系冰巨星后授予。",
    subtitle: "冰巨星巡测章",
    title: "冰巨星测绘员",
  },
  "inner-worlds-observer": {
    description: "记录内太阳系扫描资料后授予。",
    subtitle: "内太阳系巡测章",
    title: "内侧世界观察员",
  },
  "mars-field-surveyor": {
    description: "完成火星驾驶舱扫描并记录红色星球地貌语境后授予。",
    subtitle: "火星地貌章",
    title: "火星野外测绘员",
  },
  "outer-frontier-pilot": {
    description: "抵达并扫描外侧冰体边疆后授予。",
    subtitle: "外侧边疆导航章",
    title: "外侧边疆驾驶员",
  },
  "ring-system-analyst": {
    description: "记录土星环系统扫描资料后授予。",
    subtitle: "环系统分析章",
    title: "环系统分析员",
  },
  "voyager-route-observer": {
    description: "跟随历史探测器路线档案后授予。",
    subtitle: "任务档案路线章",
    title: "旅行者路线观察员",
  },
};

export function getMissionBadgeById(badgeId: MissionBadgeId) {
  return MISSION_BADGES.find((badge) => badge.id === badgeId) ?? null;
}

export function getMissionBadgeCopy(
  badge: MissionBadge,
  language: Language,
): MissionBadgeCopy {
  if (language === "zh") return MISSION_BADGE_ZH[badge.id];

  return {
    description: badge.description,
    subtitle: badge.subtitle,
    title: badge.title,
  };
}
