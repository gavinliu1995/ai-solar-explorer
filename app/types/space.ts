export type SpaceTarget = "earth" | "moon" | "mars" | "jupiter" | "saturn";

export type SelectedTarget = SpaceTarget;

export type MarsExplorationPoint = "olympus" | "valles" | "jezero" | "polar";

export type ExplorationPoint = MarsExplorationPoint | null;

export type HudMode = "full" | "minimal" | "hidden";

export type CameraMode = "locked" | "free";

export type Language = "zh" | "en";

export type LockBehavior = "fly" | "preserve";

export type ControlSensitivity = "low" | "normal" | "high";

export type ActivePanel = "info" | "missions" | "view";

export type ViewLayerState = {
  labels: boolean;
  orbits: boolean;
  probes: boolean;
  stars: boolean;
};

export type MissionStatus = "locked" | "active" | "completed";

export type MissionStep = {
  id: string;
  title: string;
  instruction: string;
  actionLabel: string;
  cameraCommand?: CameraCommandType;
  target?: SpaceTarget;
  explorationPoint?: MarsExplorationPoint;
};

export type Mission = {
  id: string;
  target: SpaceTarget;
  title: string;
  description: string;
  objective: string;
  status: MissionStatus;
  focusTarget?: SpaceTarget;
  explorationPoint?: MarsExplorationPoint;
  suggestedCameraMode?: "overview" | "close" | "orbit";
  steps?: MissionStep[];
};

export type ExplorationLogEntry = {
  id: string;
  missionId: string;
  message: string;
  timestamp: string;
  type: "started" | "step" | "completed";
};

export type SimMode = "REAL RATE" | "CRUISE MODE" | "PAUSED";

export type CameraCommandType =
  | "focus"
  | "zoomIn"
  | "zoomOut"
  | "overview"
  | "close";

export type CameraCommand = {
  type: CameraCommandType;
  nonce: number;
} | null;

export type TargetMetadata = {
  assistant: string;
  description: string;
  label: string;
  related: string[];
  type: "Planet" | "Moon" | "Gas Giant" | "Ringed Planet";
};

export const TARGET_LABELS: Record<SelectedTarget, string> = {
  earth: "Earth",
  moon: "Moon",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
};

export const TARGET_LABELS_LOCALIZED: Record<
  Language,
  Record<SelectedTarget, string>
> = {
  en: TARGET_LABELS,
  zh: {
    earth: "地球",
    moon: "月球",
    mars: "火星",
    jupiter: "木星",
    saturn: "土星",
  },
};

export const TARGET_TYPE_LABELS_LOCALIZED: Record<
  Language,
  Record<TargetMetadata["type"], string>
> = {
  en: {
    Planet: "Planet",
    Moon: "Moon",
    "Gas Giant": "Gas Giant",
    "Ringed Planet": "Ringed Planet",
  },
  zh: {
    Planet: "行星",
    Moon: "卫星",
    "Gas Giant": "气态巨行星",
    "Ringed Planet": "环系行星",
  },
};

export const TARGET_DESCRIPTIONS_LOCALIZED: Record<
  Language,
  Record<SelectedTarget, string>
> = {
  en: {
    earth:
      "Earth is our home world, the only known planet with life and liquid water on its surface.",
    moon:
      "The Moon is Earth's natural satellite and the first world beyond Earth visited by humans.",
    mars:
      "Mars is a cold desert world and one of humanity's most important future exploration targets.",
    jupiter:
      "Jupiter is the largest planet in the solar system, a giant world of storms, clouds, and powerful magnetic fields.",
    saturn: "Saturn is famous for its spectacular ring system and icy moons.",
  },
  zh: {
    earth: "地球是我们的家园，是目前已知唯一拥有生命并在表面存在液态水的行星。",
    moon: "月球是地球的天然卫星，也是人类首次到访的地外天体。",
    mars: "火星是一颗寒冷的沙漠行星，也是人类未来最重要的深空探索目标之一。",
    jupiter: "木星是太阳系中最大的行星，拥有巨大的风暴、云带和强磁场。",
    saturn: "土星以壮观的环系统和众多冰质卫星而闻名。",
  },
};

export const TARGET_RELATED_LOCALIZED: Record<
  Language,
  Record<SelectedTarget, string[]>
> = {
  en: {
    earth: ["Moon", "ISS", "Near Earth Objects"],
    moon: ["Apollo Site", "Mare Tranquillitatis", "Far Side"],
    mars: ["Olympus Mons", "Valles Marineris", "Jezero Crater", "Polar Caps"],
    jupiter: ["Juno", "Europa Clipper", "Great Red Spot"],
    saturn: ["Ring System", "Titan", "Icy Moons"],
  },
  zh: {
    earth: ["月球", "国际空间站", "近地天体"],
    moon: ["阿波罗登陆点", "静海", "月球背面"],
    mars: ["奥林帕斯山", "水手峡谷", "杰泽罗陨石坑", "火星极冠"],
    jupiter: ["朱诺号", "欧罗巴快船", "大红斑"],
    saturn: ["土星环系统", "泰坦", "冰质卫星"],
  },
};

export const TARGET_METADATA: Record<SelectedTarget, TargetMetadata> = {
  earth: {
    assistant: "任务控制：地球轨道锁定。当前视图显示地月系统、近地空间层和主要导航参考线。",
    description:
      "Earth is our home world, the only known planet with life and liquid water on its surface.",
    label: "Earth",
    related: ["Moon", "ISS", "Near Earth Objects"],
    type: "Planet",
  },
  moon: {
    assistant: "任务控制：月球目标已同步。建议关注月海区域、背面地形与早期载人登陆参考点。",
    description:
      "The Moon is Earth's natural satellite and the first world beyond Earth visited by humans.",
    label: "Moon",
    related: ["Apollo Site", "Mare Tranquillitatis", "Far Side"],
    type: "Moon",
  },
  mars: {
    assistant:
      "任务控制：火星轨道已锁定。当前视图显示主要探索点，可选择奥林帕斯山、水手峡谷、杰泽罗陨石坑或极冠区域。",
    description:
      "Mars is a cold desert world and one of humanity's most important future exploration targets.",
    label: "Mars",
    related: ["Olympus Mons", "Valles Marineris", "Jezero Crater", "Polar Caps"],
    type: "Planet",
  },
  jupiter: {
    assistant: "任务控制：木星主视图已建立。巨行星云带、磁层参考和外侧任务航迹已标记。",
    description:
      "Jupiter is the largest planet in the solar system, a giant world of storms, clouds, and powerful magnetic fields.",
    label: "Jupiter",
    related: ["Juno", "Europa Clipper", "Great Red Spot"],
    type: "Gas Giant",
  },
  saturn: {
    assistant: "任务控制：土星轨道已锁定。环系统、冰卫星区域和外侧深空航迹正在稳定跟踪。",
    description:
      "Saturn is famous for its spectacular ring system and icy moons.",
    label: "Saturn",
    related: ["Ring System", "Titan", "Icy Moons"],
    type: "Ringed Planet",
  },
};

export const EXPLORATION_LABELS: Record<MarsExplorationPoint, string> = {
  olympus: "Olympus Mons",
  valles: "Valles Marineris",
  jezero: "Jezero Crater",
  polar: "Polar Caps",
};

export const EXPLORATION_LABELS_LOCALIZED: Record<
  Language,
  Record<Exclude<ExplorationPoint, null>, string>
> = {
  en: EXPLORATION_LABELS,
  zh: {
    olympus: "奥林帕斯山",
    valles: "水手峡谷",
    jezero: "杰泽罗陨石坑",
    polar: "火星极冠",
  },
};

export const EXPLORATION_DETAILS: Record<MarsExplorationPoint, string> = {
  olympus:
    "Olympus Mons is one of the tallest volcanoes in the solar system, rising about 21.9 kilometers above the surrounding plains.",
  valles:
    "Valles Marineris is a massive canyon system stretching more than 4,000 kilometers across Mars.",
  jezero:
    "Jezero Crater may have once hosted a lake and river delta, making it a key target in the search for ancient life.",
  polar:
    "Mars' polar caps are made of water ice and carbon dioxide ice, preserving clues about the planet's climate history.",
};

export const EXPLORATION_DETAILS_LOCALIZED: Record<
  Language,
  Record<Exclude<ExplorationPoint, null>, string>
> = {
  en: EXPLORATION_DETAILS,
  zh: {
    olympus:
      "奥林帕斯山是太阳系中已知最高的火山之一，高度约 21.9 公里，是火星火山活动历史的重要证据。",
    valles:
      "水手峡谷是火星上巨大的峡谷系统，长度超过 4000 公里，规模远超地球大峡谷。",
    jezero:
      "杰泽罗陨石坑曾经可能存在湖泊和河流三角洲，是毅力号火星车的重要探索区域。",
    polar:
      "火星极冠由水冰和二氧化碳冰组成，记录了火星气候变化的重要线索。",
  },
};

export const EXPLORATION_ASSISTANT: Record<MarsExplorationPoint, string> = {
  olympus:
    "任务控制：奥林帕斯山已选定。该区域是火星火山活动历史的关键证据，建议保持高分辨率地形扫描。",
  valles:
    "任务控制：水手峡谷已选定。峡谷尺度极大，当前视图适合对比断崖、峡谷层理与古环境痕迹。",
  jezero:
    "任务控制：杰泽罗陨石坑已选定。这里曾可能存在湖泊和三角洲，是古生命线索搜索的重点区域。",
  polar:
    "任务控制：火星极冠已选定。冰层记录了火星气候变化，建议开启长期气候剖面观测。",
};

export const TARGET_POSITIONS: Record<SelectedTarget, [number, number, number]> = {
  earth: [8.8, 0, 0.6],
  moon: [10.55, 0.18, -0.2],
  mars: [15.2, -0.08, -3.35],
  jupiter: [21.2, 0.2, 4.2],
  saturn: [29.4, 0, -6.4],
};
