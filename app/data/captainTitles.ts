import { FLIGHT_MISSIONS } from "@/app/data/flightMissions";
import type {
  CaptainTitleId,
  Language,
  PlayerProgress,
} from "@/app/types/space";

type CaptainTitle = {
  id: CaptainTitleId;
  label: Record<Language, string>;
  description: Record<Language, string>;
};

export const CAPTAIN_TITLES: CaptainTitle[] = [
  {
    description: {
      en: "Unlocked by recording Earth's atmospheric scan profile.",
      zh: "记录地球大气扫描轮廓后解锁。",
    },
    id: "earth-observer",
    label: { en: "Earth Observer", zh: "地球观察员" },
  },
  {
    description: {
      en: "Unlocked by completing the Mars frontier flight mission.",
      zh: "完成火星边疆飞行任务后解锁。",
    },
    id: "mars-field-surveyor",
    label: { en: "Mars Field Surveyor", zh: "火星野外测绘员" },
  },
  {
    description: {
      en: "Unlocked by completing Saturn ring system analysis.",
      zh: "完成土星环系统分析后解锁。",
    },
    id: "ring-analyst",
    label: { en: "Ring Analyst", zh: "环系统分析员" },
  },
  {
    description: {
      en: "Unlocked by completing an ice giant survey.",
      zh: "完成冰巨星巡测后解锁。",
    },
    id: "ice-giant-surveyor",
    label: { en: "Ice Giant Surveyor", zh: "冰巨星巡测员" },
  },
  {
    description: {
      en: "Unlocked by completing an outer frontier flight mission.",
      zh: "完成外太阳系边疆飞行任务后解锁。",
    },
    id: "outer-frontier-pilot",
    label: { en: "Outer Frontier Pilot", zh: "外侧边疆驾驶员" },
  },
  {
    description: {
      en: "Unlocked by completing the Voyager 2 ice giant route.",
      zh: "完成旅行者 2 冰巨星路线后解锁。",
    },
    id: "voyager-route-observer",
    label: { en: "Voyager Route Observer", zh: "旅行者路线观察员" },
  },
  {
    description: {
      en: "Unlocked by completing every core flight mission.",
      zh: "完成全部核心飞行任务后解锁。",
    },
    id: "argonaut-commander",
    label: { en: "Argonaut Commander", zh: "星舟指挥官" },
  },
];

export function getCaptainTitleById(titleId: CaptainTitleId) {
  return CAPTAIN_TITLES.find((title) => title.id === titleId) ?? null;
}

export function getUnlockedCaptainTitleIds(
  progress: PlayerProgress,
): CaptainTitleId[] {
  const completed = progress.completedFlightMissionIds;
  const scanned = progress.scannedTargetIds;
  const titleIds: CaptainTitleId[] = [];

  if (scanned.includes("earth")) titleIds.push("earth-observer");
  if (completed.includes("scan-mars-frontier")) {
    titleIds.push("mars-field-surveyor");
  }
  if (completed.includes("scan-saturn-rings")) {
    titleIds.push("ring-analyst");
  }
  if (
    completed.includes("survey-uranus-tilted-axis") ||
    completed.includes("survey-neptune-atmosphere")
  ) {
    titleIds.push("ice-giant-surveyor");
  }
  if (
    completed.includes("survey-pluto-charon") ||
    completed.includes("cross-kuiper-frontier")
  ) {
    titleIds.push("outer-frontier-pilot");
  }
  if (completed.includes("voyager-2-ice-giant-route")) {
    titleIds.push("voyager-route-observer");
  }
  if (
    FLIGHT_MISSIONS.every((mission) =>
      progress.completedFlightMissionIds.includes(mission.id),
    )
  ) {
    titleIds.push("argonaut-commander");
  }

  return titleIds;
}
