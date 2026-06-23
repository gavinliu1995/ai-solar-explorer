import { FLIGHT_MISSIONS, getFlightMissionById } from "@/app/data/flightMissions";
import type {
  CareerChapter,
  FlightMission,
  FlightMissionId,
  PlayerProgress,
  SelectedTarget,
} from "@/app/types/space";

export const CAREER_CHAPTERS: CareerChapter[] = [
  {
    description: {
      en: "Learn the cockpit loop with nearby planetary targets.",
      zh: "通过近距离行星目标熟悉驾驶舱任务闭环。",
    },
    id: "cadet-training",
    requiredMissionIds: ["approach-earth-orbit", "scan-mars-frontier"],
    subtitle: { en: "Core cockpit training", zh: "基础驾驶舱训练" },
    title: { en: "Cadet Training", zh: "见习训练" },
  },
  {
    description: {
      en: "Build confidence around the living world and the red frontier.",
      zh: "围绕地球与火星建立内太阳系飞行信心。",
    },
    id: "inner-worlds",
    requiredMissionIds: ["approach-earth-orbit", "scan-mars-frontier"],
    subtitle: { en: "Inner solar system cruise", zh: "内太阳系巡航" },
    title: { en: "Inner Worlds", zh: "内太阳系巡航" },
    unlockRequirement: {
      completedMissionIds: ["approach-earth-orbit"],
    },
  },
  {
    description: {
      en: "Cross the rocky debris field between Mars and Jupiter.",
      zh: "穿越火星与木星之间的岩石碎片带。",
    },
    id: "belt-crossing",
    requiredMissionIds: ["fly-through-asteroid-belt"],
    subtitle: { en: "Rocky corridor operations", zh: "岩石走廊行动" },
    title: { en: "Belt Crossing", zh: "小行星带穿越" },
    unlockRequirement: {
      completedMissionIds: ["scan-mars-frontier"],
    },
  },
  {
    description: {
      en: "Survey ring systems and the outer ice giants.",
      zh: "巡测环系统与外太阳系冰巨星。",
    },
    id: "giant-planets",
    requiredMissionIds: [
      "scan-saturn-rings",
      "survey-uranus-tilted-axis",
      "survey-neptune-atmosphere",
    ],
    subtitle: { en: "Gas and ice giant operations", zh: "巨行星任务" },
    title: { en: "Giant Planets", zh: "巨行星任务" },
    unlockRequirement: {
      completedMissionIds: ["fly-through-asteroid-belt"],
    },
  },
  {
    description: {
      en: "Push toward dwarf worlds and the Kuiper frontier.",
      zh: "前往矮行星与柯伊伯带边疆。",
    },
    id: "outer-frontier",
    requiredMissionIds: ["survey-pluto-charon", "cross-kuiper-frontier"],
    subtitle: { en: "Dwarf worlds and icy frontier", zh: "矮行星与冰体边疆" },
    title: { en: "Outer Frontier", zh: "外太阳系边疆" },
    unlockRequirement: {
      completedMissionIds: ["survey-neptune-atmosphere"],
    },
  },
  {
    description: {
      en: "Follow a historic outer-planet route through the ice giants.",
      zh: "沿历史外行星路线重走冰巨星航段。",
    },
    id: "voyager-legacy",
    requiredMissionIds: ["voyager-2-ice-giant-route"],
    subtitle: { en: "Archive route challenge", zh: "档案路线挑战" },
    title: { en: "Voyager Legacy", zh: "旅行者遗产路线" },
    unlockRequirement: {
      completedMissionIds: ["cross-kuiper-frontier"],
    },
  },
];

export function isCareerChapterUnlocked(
  chapter: CareerChapter,
  progress: PlayerProgress,
) {
  const requirement = chapter.unlockRequirement;
  if (!requirement) return true;

  const meetsXp = requirement.minXp
    ? progress.flightXp >= requirement.minXp
    : true;
  const completedRequiredMissions = requirement.completedMissionIds?.length
    ? requirement.completedMissionIds.every((missionId) =>
        progress.completedFlightMissionIds.includes(missionId),
      )
    : true;
  const scannedRequiredTargets = requirement.scannedTargets?.length
    ? requirement.scannedTargets.every((target) =>
        progress.scannedTargetIds.includes(target),
      )
    : true;

  return meetsXp && completedRequiredMissions && scannedRequiredTargets;
}

export function getCareerChapterProgress(
  chapter: CareerChapter,
  progress: PlayerProgress,
) {
  const completedCount = chapter.requiredMissionIds.filter((missionId) =>
    progress.completedFlightMissionIds.includes(missionId),
  ).length;

  return {
    completedCount,
    totalCount: chapter.requiredMissionIds.length,
    complete: completedCount === chapter.requiredMissionIds.length,
  };
}

export function getCurrentCareerChapter(progress: PlayerProgress) {
  return (
    CAREER_CHAPTERS.find((chapter) => {
      const unlocked = isCareerChapterUnlocked(chapter, progress);
      const chapterProgress = getCareerChapterProgress(chapter, progress);
      return unlocked && !chapterProgress.complete;
    }) ?? CAREER_CHAPTERS[CAREER_CHAPTERS.length - 1]
  );
}

export function getRecommendedNextFlightMission(
  progress: PlayerProgress,
  selectedTarget?: SelectedTarget,
): FlightMission | null {
  const currentChapter = getCurrentCareerChapter(progress);
  const unfinishedChapterMissionId = currentChapter.requiredMissionIds.find(
    (missionId) => !progress.completedFlightMissionIds.includes(missionId),
  );

  if (unfinishedChapterMissionId) {
    return getFlightMissionById(unfinishedChapterMissionId);
  }

  if (selectedTarget) {
    const targetMission = FLIGHT_MISSIONS.find(
      (mission) =>
        mission.target === selectedTarget &&
        !progress.completedFlightMissionIds.includes(mission.id),
    );
    if (targetMission) return targetMission;
  }

  return (
    FLIGHT_MISSIONS.find(
      (mission) =>
        mission.difficulty === "easy" &&
        !progress.completedFlightMissionIds.includes(mission.id),
    ) ??
    FLIGHT_MISSIONS.find(
      (mission) =>
        mission.difficulty === "medium" &&
        !progress.completedFlightMissionIds.includes(mission.id),
    ) ??
    FLIGHT_MISSIONS.find(
      (mission) =>
        mission.difficulty === "hard" &&
        !progress.completedFlightMissionIds.includes(mission.id),
    ) ??
    null
  );
}

export function getCareerChapterForMission(missionId: FlightMissionId) {
  return CAREER_CHAPTERS.find((chapter) =>
    chapter.requiredMissionIds.includes(missionId),
  );
}
