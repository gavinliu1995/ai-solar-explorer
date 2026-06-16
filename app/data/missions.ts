import type { Mission, MissionStep, SpaceTarget } from "@/app/types/space";

export const MISSIONS: Mission[] = [
  {
    id: "earth-moon-system",
    target: "earth",
    title: "观察地月系统",
    description: "任务控制建议先建立地球与月球的空间关系。",
    objective: "锁定地球，观察月球轨道线和地月距离比例。",
    status: "locked",
    focusTarget: "earth",
    suggestedCameraMode: "orbit",
  },
  {
    id: "earth-atmosphere",
    target: "earth",
    title: "识别地球大气层",
    description: "通过地球边缘的蓝色辉光判断大气层视觉边界。",
    objective: "靠近地球，观察大气 glow 和云层运动。",
    status: "locked",
    focusTarget: "earth",
    suggestedCameraMode: "close",
  },
  {
    id: "earth-mars-compare",
    target: "earth",
    title: "对比地球和火星",
    description: "建立宜居星球与冷沙漠星球的视觉差异。",
    objective: "从地球切换到火星，对比海洋、大气和地貌颜色。",
    status: "locked",
    focusTarget: "mars",
    suggestedCameraMode: "overview",
  },
  {
    id: "moon-maria",
    target: "moon",
    title: "寻找月海",
    description: "月海是月球正面最容易识别的大型暗色平原。",
    objective: "靠近月球，观察表面暗色月海区域。",
    status: "locked",
    focusTarget: "moon",
    suggestedCameraMode: "close",
  },
  {
    id: "moon-tidal-lock",
    target: "moon",
    title: "理解潮汐锁定",
    description: "月球长期以近似同一面朝向地球。",
    objective: "观察月球相对地球的位置，理解同步自转关系。",
    status: "locked",
    focusTarget: "moon",
    suggestedCameraMode: "orbit",
  },
  {
    id: "moon-earth-distance",
    target: "moon",
    title: "观察月球与地球距离",
    description: "用地月系统作为深空导航尺度的第一把尺。",
    objective: "拉远视角，同时看到地球、月球和月球轨道。",
    status: "locked",
    focusTarget: "moon",
    suggestedCameraMode: "overview",
  },
  {
    id: "mars-olympus",
    target: "mars",
    title: "扫描奥林帕斯山",
    description: "奥林帕斯山是火星火山活动历史的关键地貌。",
    objective: "选择 Olympus Mons 探索点，启动高程扫描。",
    status: "locked",
    focusTarget: "mars",
    explorationPoint: "olympus",
    suggestedCameraMode: "close",
  },
  {
    id: "mars-valles",
    target: "mars",
    title: "探索水手峡谷",
    description: "水手峡谷提供了火星地壳拉伸和古环境线索。",
    objective: "选择 Valles Marineris 探索点，观察峡谷尺度。",
    status: "locked",
    focusTarget: "mars",
    explorationPoint: "valles",
    suggestedCameraMode: "close",
  },
  {
    id: "mars-jezero",
    target: "mars",
    title: "定位杰泽罗陨石坑",
    description: "杰泽罗陨石坑是古湖泊和三角洲研究的核心区域。",
    objective: "选择 Jezero Crater，记录可能的古水环境线索。",
    status: "locked",
    focusTarget: "mars",
    explorationPoint: "jezero",
    suggestedCameraMode: "close",
  },
  {
    id: "mars-polar",
    target: "mars",
    title: "观察火星极冠",
    description: "极冠冰层保存了火星气候长期变化的信息。",
    objective: "选择 Polar Caps，观察极地冰层视觉标记。",
    status: "locked",
    focusTarget: "mars",
    explorationPoint: "polar",
    suggestedCameraMode: "close",
  },
  {
    id: "jupiter-bands",
    target: "jupiter",
    title: "观察木星云带",
    description: "木星云带体现了气态巨行星高速大气环流。",
    objective: "靠近木星，观察条带纹理与行星尺度。",
    status: "locked",
    focusTarget: "jupiter",
    suggestedCameraMode: "close",
  },
  {
    id: "jupiter-red-spot",
    target: "jupiter",
    title: "寻找大红斑线索",
    description: "通过云带扰动寻找大型风暴系统的视觉线索。",
    objective: "保持木星锁定，扫描云层中的高对比风暴区域。",
    status: "locked",
    focusTarget: "jupiter",
    suggestedCameraMode: "orbit",
  },
  {
    id: "jupiter-scale",
    target: "jupiter",
    title: "理解气态巨行星尺度",
    description: "用木星和内太阳系行星对比，建立尺度感。",
    objective: "拉远视角，比较木星与地球、火星的大小差异。",
    status: "locked",
    focusTarget: "jupiter",
    suggestedCameraMode: "overview",
  },
  {
    id: "saturn-rings",
    target: "saturn",
    title: "扫描土星环",
    description: "土星环是太阳系最具辨识度的环系统。",
    objective: "靠近土星，观察环平面、透明度和行星本体关系。",
    status: "locked",
    focusTarget: "saturn",
    suggestedCameraMode: "close",
  },
  {
    id: "saturn-jupiter-scale",
    target: "saturn",
    title: "观察土星与木星尺度差异",
    description: "比较两颗气态巨行星的尺寸、颜色和外观结构。",
    objective: "在土星和木星之间切换，比较行星尺度与环系统差异。",
    status: "locked",
    focusTarget: "saturn",
    suggestedCameraMode: "overview",
  },
  {
    id: "saturn-icy-moons",
    target: "saturn",
    title: "了解 Titan / icy moons",
    description: "土星卫星系统是外太阳系探索的重要科学目标。",
    objective: "聚焦土星系统，记录 Titan 与冰质卫星的任务价值。",
    status: "locked",
    focusTarget: "saturn",
    suggestedCameraMode: "orbit",
  },
];

export function getMissionsForTarget(target: SpaceTarget) {
  return MISSIONS.filter((mission) => mission.target === target);
}

export function getMissionById(missionId: string | null) {
  if (!missionId) return null;
  return MISSIONS.find((mission) => mission.id === missionId) ?? null;
}

export function getRecommendedMission(
  target: SpaceTarget,
  completedMissionIds: string[],
) {
  return (
    getMissionsForTarget(target).find(
      (mission) => !completedMissionIds.includes(mission.id),
    ) ??
    MISSIONS.find((mission) => !completedMissionIds.includes(mission.id)) ??
    MISSIONS[0]
  );
}

export function getMissionSteps(mission: Mission): MissionStep[] {
  if (mission.steps) return mission.steps;

  const focusTarget = mission.focusTarget ?? mission.target;

  return [
    {
      id: `${mission.id}-step-1`,
      title: "锁定任务目标",
      instruction: `建立 ${mission.title} 的导航锁定，并确认当前目标进入视野中心。`,
      actionLabel: "锁定目标",
      cameraCommand: "focus",
      target: focusTarget,
    },
    {
      id: `${mission.id}-step-2`,
      title: "执行近距观察",
      instruction: mission.explorationPoint
        ? "切入指定探索点，观察目标区域的地貌特征和空间关系。"
        : "切近当前目标，观察任务要求中的主要视觉线索。",
      actionLabel: "切入观察",
      cameraCommand:
        mission.suggestedCameraMode === "overview" ? "overview" : "close",
      target: focusTarget,
      explorationPoint: mission.explorationPoint,
    },
    {
      id: `${mission.id}-step-3`,
      title: "记录任务结论",
      instruction: "确认已完成观察，将本次探索写入 Exploration Log。",
      actionLabel: "完成任务",
      cameraCommand: "focus",
      target: focusTarget,
    },
  ];
}
