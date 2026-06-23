export type SpaceTarget =
  | "sun"
  | "mercury"
  | "venus"
  | "earth"
  | "moon"
  | "mars"
  | "asteroid-belt"
  | "ceres"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto"
  | "kuiper-belt";

export type SelectedTarget = SpaceTarget;

export type MarsExplorationPoint = "olympus" | "valles" | "jezero" | "polar";

export type ExplorationPoint = MarsExplorationPoint | null;

export type HudMode = "full" | "minimal" | "hidden";

export type CameraMode = "locked" | "free";

export type ExperienceMode = "mission-control" | "cockpit";

export type ControlMode = "orbit" | "free-flight" | "autopilot";

export type FlightState = {
  speed: number;
  throttle: number;
  distanceToTarget: number | null;
  scanAvailable: boolean;
  scanAligned: boolean;
  scanInRange: boolean;
  scanProgress: number;
  isScanning: boolean;
  targetBearingX: number;
  targetBearingY: number;
  targetCentered: boolean;
  approachZone: boolean;
  proximityWarning: boolean;
  autopilotProgress: number;
  etaSeconds: number | null;
};

export type FlightObjectiveType =
  | "approach"
  | "scan"
  | "align"
  | "fly-through";

export type FlightObjectiveState = {
  id: string;
  title: string;
  description: string;
  target: SpaceTarget;
  type: FlightObjectiveType | "route-waypoint";
  progress: number;
  completed: boolean;
};

export type FlightMissionId =
  | "approach-earth-orbit"
  | "scan-mars-frontier"
  | "fly-through-asteroid-belt"
  | "scan-saturn-rings"
  | "survey-uranus-tilted-axis"
  | "survey-neptune-atmosphere"
  | "survey-pluto-charon"
  | "cross-kuiper-frontier"
  | "voyager-2-ice-giant-route";

export type FlightMissionDifficulty = "easy" | "medium" | "hard";

export type FlightObjective = {
  id: string;
  type: FlightObjectiveType | "route-waypoint";
  title: Record<Language, string>;
  instruction: Record<Language, string>;
  target?: SpaceTarget;
  requiredDistance?: number;
  requiredAlignment?: number;
  requiredDurationSeconds?: number;
};

export type FlightMission = {
  id: FlightMissionId;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  description: Record<Language, string>;
  target: SpaceTarget;
  difficulty: FlightMissionDifficulty;
  estimatedDuration: Record<Language, string>;
  objectives: FlightObjective[];
  reward: RewardGrant;
  recommendedLayers?: Partial<ViewLayerState>;
};

export type ActiveFlightMissionState = {
  missionId: FlightMissionId;
  objectiveIndex: number;
  objectiveProgress: number;
  completedObjectiveIds: string[];
  corridorSeconds: number;
};

export type Language = "zh" | "en";

export type LockBehavior = "fly" | "preserve";

export type ControlSensitivity = "low" | "normal" | "high";

export type ActivePanel =
  | "info"
  | "missions"
  | "tour"
  | "archives"
  | "collection"
  | "view";

export type ViewMode = "solar-system" | "celestial-sphere";

export const LOCKABLE_TARGETS: SpaceTarget[] = [
  "sun",
  "mercury",
  "venus",
  "earth",
  "moon",
  "mars",
  "asteroid-belt",
  "ceres",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "kuiper-belt",
];

export const MISSION_TARGETS: SpaceTarget[] = LOCKABLE_TARGETS;

export const MISSION_TARGET_GROUPS = [
  {
    id: "inner-system",
    label: { en: "Inner System", zh: "内太阳系" },
    targets: ["sun", "mercury", "venus", "earth", "moon", "mars"],
  },
  {
    id: "belt-giants",
    label: { en: "Belt & Giants", zh: "小行星带与巨行星" },
    targets: ["asteroid-belt", "ceres", "jupiter", "saturn"],
  },
  {
    id: "outer-system",
    label: { en: "Outer System", zh: "外太阳系" },
    targets: ["uranus", "neptune", "pluto", "kuiper-belt"],
  },
] satisfies {
  id: string;
  label: Record<Language, string>;
  targets: SpaceTarget[];
}[];

export type ViewLayerState = {
  asteroidBelt: boolean;
  constellations: boolean;
  ecliptic: boolean;
  kuiperBelt: boolean;
  labels: boolean;
  missionRoutes: boolean;
  moons: boolean;
  orbits: boolean;
  probes: boolean;
  stars: boolean;
  zodiac: boolean;
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
  viewMode?: ViewMode;
  requiredLayers?: Partial<ViewLayerState>;
};

export type Mission = {
  category?: "planetary" | "celestial";
  id: string;
  target: SpaceTarget;
  title: string;
  description: string;
  objective: string;
  status: MissionStatus;
  focusTarget?: SpaceTarget;
  explorationPoint?: MarsExplorationPoint;
  requiredLayers?: Partial<ViewLayerState>;
  requiresViewMode?: ViewMode;
  suggestedCameraMode?: "overview" | "close" | "orbit";
  steps?: MissionStep[];
};

export type TourId =
  | "grand-tour"
  | "inner-worlds"
  | "giant-planets"
  | "outer-frontier";

export type TourStop = {
  id: string;
  target: SpaceTarget;
  title: string;
  subtitle: string;
  description: string;
  objective: string;
  recommendedMissionIds: string[];
  requiredLayers?: Partial<ViewLayerState>;
  viewMode?: ViewMode;
  cameraMode?: "overview" | "close" | "focus";
};

export type Tour = {
  id: TourId;
  title: string;
  subtitle: string;
  description: string;
  estimatedDuration: string;
  stops: TourStop[];
};

export type TourMode = "idle" | "active" | "completed";

export type ArchiveMissionId =
  | "voyager-1"
  | "voyager-2"
  | "cassini"
  | "juno"
  | "new-horizons"
  | "parker-solar-probe"
  | "perseverance"
  | "tianwen-1"
  | "galileo"
  | "dawn"
  | "europa-clipper";

export type ArchiveMissionCategory =
  | "outer-solar-system"
  | "giant-planets"
  | "mars"
  | "inner-solar-system"
  | "asteroids"
  | "future";

export type MissionWaypoint = {
  id: string;
  target: SpaceTarget;
  label: string;
  description: string;
  cameraMode?: "overview" | "focus" | "close";
  requiredLayers?: Partial<ViewLayerState>;
};

export type ArchiveMission = {
  id: ArchiveMissionId;
  name: string;
  subtitle: string;
  category: ArchiveMissionCategory;
  agencyLabel: string;
  statusLabel: string;
  shortDescription: string;
  longDescription: string;
  primaryTargets: SpaceTarget[];
  waypoints: MissionWaypoint[];
  keyDiscoveries: string[];
  relatedTourIds?: TourId[];
  disclaimer?: string;
};

export type ArchiveExpeditionMode = "idle" | "active" | "completed";

export type ArchiveDiscoveryCard = {
  id: string;
  missionId: ArchiveMissionId;
  title: string;
  body: string;
  relatedTarget: SpaceTarget;
};

export type RewardType =
  | "flight-xp"
  | "research-credit"
  | "discovery-card"
  | "mission-badge"
  | "captain-title";

export type DiscoveryRarity = "common" | "uncommon" | "rare" | "epic";

export type DiscoveryCardId =
  | "earth-atmosphere-profile"
  | "moon-crater-survey"
  | "mars-ancient-water-signature"
  | "asteroid-belt-density-map"
  | "ceres-bright-deposits"
  | "jupiter-storm-band-profile"
  | "saturn-ring-particle-profile"
  | "uranus-tilted-axis-profile"
  | "neptune-wind-profile"
  | "pluto-charon-context"
  | "kuiper-belt-icy-frontier"
  | "sun-corona-profile"
  | "venus-cloud-deck-profile"
  | "mercury-crater-profile";

export type MissionBadgeId =
  | "inner-worlds-observer"
  | "mars-field-surveyor"
  | "giant-planet-navigator"
  | "ring-system-analyst"
  | "ice-giant-surveyor"
  | "outer-frontier-pilot"
  | "grand-tour-cadet"
  | "voyager-route-observer";

export type DiscoveryCard = {
  id: DiscoveryCardId;
  title: string;
  subtitle: string;
  relatedTarget: SpaceTarget;
  rarity: DiscoveryRarity;
  description: string;
  observationPrompt: string;
  unlockedBy: string;
};

export type MissionBadge = {
  id: MissionBadgeId;
  title: string;
  subtitle: string;
  description: string;
};

export type RewardGrant = {
  xp?: number;
  researchCredits?: number;
  discoveryCardIds?: DiscoveryCardId[];
  badgeIds?: MissionBadgeId[];
  captainTitle?: string;
};

export type CaptainTitleId =
  | "earth-observer"
  | "mars-field-surveyor"
  | "ring-analyst"
  | "ice-giant-surveyor"
  | "outer-frontier-pilot"
  | "voyager-route-observer"
  | "argonaut-commander";

export type PlayerProgress = {
  saveVersion: number;
  lastSavedAt?: string;
  flightXp: number;
  researchCredits: number;
  completedFlightMissionIds: FlightMissionId[];
  unlockedDiscoveryCardIds: DiscoveryCardId[];
  unlockedBadgeIds: MissionBadgeId[];
  captainTitles: CaptainTitleId[];
  selectedCaptainTitle?: CaptainTitleId;
  scannedTargetIds: SpaceTarget[];
};

export type CareerChapterId =
  | "cadet-training"
  | "inner-worlds"
  | "belt-crossing"
  | "giant-planets"
  | "outer-frontier"
  | "voyager-legacy";

export type CareerChapter = {
  id: CareerChapterId;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  description: Record<Language, string>;
  requiredMissionIds: FlightMissionId[];
  unlockRequirement?: {
    minXp?: number;
    completedMissionIds?: FlightMissionId[];
    scannedTargets?: SpaceTarget[];
  };
};

export type ShipSystemId =
  | "basic-scanner"
  | "precision-reticle"
  | "deep-space-autopilot"
  | "ring-analyzer"
  | "ice-giant-sensor"
  | "frontier-navigation";

export type ShipSystem = {
  id: ShipSystemId;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  description: Record<Language, string>;
  unlockRequirement: {
    minXp?: number;
    badgeIds?: MissionBadgeId[];
    completedMissionIds?: FlightMissionId[];
  };
};

export type MissionCompleteSummary = {
  missionId: FlightMissionId;
  xp: number;
  researchCredits: number;
  discoveryCardIds: DiscoveryCardId[];
  badgeIds: MissionBadgeId[];
  captainTitleIds: CaptainTitleId[];
  nextMissionId: FlightMissionId | null;
};

export type ExplorationLogEventType =
  | "archive_route_loaded"
  | "archive_expedition_started"
  | "archive_waypoint_locked"
  | "archive_expedition_completed"
  | "archive_route_cleared"
  | "tour_started"
  | "tour_stop_focused"
  | "tour_stop_completed"
  | "tour_completed"
  | "mission_started"
  | "mission_step"
  | "mission_completed"
  | "target_locked"
  | "cockpit_entered"
  | "cockpit_exited"
  | "autopilot_engaged"
  | "autopilot_complete"
  | "scan_started"
  | "scan_complete"
  | "flight_objective_started"
  | "flight_objective_completed"
  | "flight_mission_started"
  | "flight_mission_completed"
  | "flight_mission_cancelled"
  | "reward_granted"
  | "discovery_unlocked"
  | "badge_unlocked"
  | "rank_updated"
  | "captain_title_unlocked";

export type ExplorationLogEntry = {
  id: string;
  message: string;
  refId?: string;
  timestamp: string;
  type: ExplorationLogEventType;
};

export type SimMode = "REAL RATE" | "CRUISE MODE" | "PAUSED";

export type CameraCommandType =
  | "focus"
  | "zoomIn"
  | "zoomOut"
  | "overview"
  | "close"
  | "solarSystemOverview";

export type CameraCommand = {
  type: CameraCommandType;
  nonce: number;
} | null;

export type TargetType =
  | "Star"
  | "Planet"
  | "Moon"
  | "Gas Giant"
  | "Ringed Planet"
  | "Ice Giant"
  | "Dwarf Planet"
  | "Region";

export type TargetMetadata = {
  assistant: string;
  description: string;
  label: string;
  related: string[];
  type: TargetType;
};

export const TARGET_LABELS: Record<SelectedTarget, string> = {
  "asteroid-belt": "Asteroid Belt",
  "kuiper-belt": "Kuiper Belt",
  ceres: "Ceres",
  earth: "Earth",
  jupiter: "Jupiter",
  mars: "Mars",
  mercury: "Mercury",
  moon: "Moon",
  neptune: "Neptune",
  pluto: "Pluto",
  saturn: "Saturn",
  sun: "Sun",
  uranus: "Uranus",
  venus: "Venus",
};

export const TARGET_LABELS_LOCALIZED: Record<
  Language,
  Record<SelectedTarget, string>
> = {
  en: TARGET_LABELS,
  zh: {
    "asteroid-belt": "小行星带",
    "kuiper-belt": "柯伊伯带",
    ceres: "谷神星",
    earth: "地球",
    jupiter: "木星",
    mars: "火星",
    mercury: "水星",
    moon: "月球",
    neptune: "海王星",
    pluto: "冥王星",
    saturn: "土星",
    sun: "太阳",
    uranus: "天王星",
    venus: "金星",
  },
};

export const TARGET_TYPE_LABELS_LOCALIZED: Record<
  Language,
  Record<TargetType, string>
> = {
  en: {
    "Dwarf Planet": "Dwarf Planet",
    "Gas Giant": "Gas Giant",
    "Ice Giant": "Ice Giant",
    "Ringed Planet": "Ringed Planet",
    Moon: "Moon",
    Planet: "Planet",
    Region: "Region",
    Star: "Star",
  },
  zh: {
    "Dwarf Planet": "矮行星",
    "Gas Giant": "气态巨行星",
    "Ice Giant": "冰巨星",
    "Ringed Planet": "环系行星",
    Moon: "卫星",
    Planet: "行星",
    Region: "区域",
    Star: "恒星",
  },
};

export const TARGET_DESCRIPTIONS_LOCALIZED: Record<
  Language,
  Record<SelectedTarget, string>
> = {
  en: {
    "asteroid-belt":
      "The asteroid belt is a broad region of rocky debris and minor planets between Mars and Jupiter.",
    "kuiper-belt":
      "The Kuiper Belt is a distant icy frontier beyond Neptune, home to dwarf planets and comet-like bodies.",
    ceres:
      "Ceres is the largest object in the asteroid belt and is classified as a dwarf planet.",
    earth:
      "Earth is our home world, the only known planet with life and liquid water on its surface.",
    jupiter:
      "Jupiter is the largest planet in the solar system, a giant world of storms, clouds, and powerful magnetic fields.",
    mars:
      "Mars is a cold desert world and one of humanity's most important future exploration targets.",
    mercury:
      "Mercury is the innermost planet, a small cratered world exposed to extreme solar heating.",
    moon:
      "The Moon is Earth's natural satellite and the first world beyond Earth visited by humans.",
    neptune:
      "Neptune is a deep blue ice giant with extreme winds and a distant moon system.",
    pluto:
      "Pluto is a dwarf planet and Kuiper Belt world with a complex icy surface.",
    saturn: "Saturn is famous for its spectacular ring system and icy moons.",
    sun:
      "The Sun is the central star of the solar system and the primary light source for every planetary view.",
    uranus:
      "Uranus is a pale ice giant with a dramatically tilted rotation axis and faint rings.",
    venus:
      "Venus is a cloud-covered terrestrial planet with a dense atmosphere and intense greenhouse conditions.",
  },
  zh: {
    "asteroid-belt": "小行星带位于火星和木星之间，是岩石碎片和小天体聚集的宽阔区域。",
    "kuiper-belt": "柯伊伯带位于海王星外侧，是由冰质天体、矮行星和彗星源区构成的遥远边界。",
    ceres: "谷神星是小行星带中最大的天体，也被归类为矮行星。",
    earth: "地球是我们的家园，是目前已知唯一拥有生命并在表面存在液态水的行星。",
    jupiter: "木星是太阳系中最大的行星，拥有巨大的风暴、云带和强磁场。",
    mars: "火星是一颗寒冷的沙漠行星，也是人类未来最重要的深空探索目标之一。",
    mercury: "水星是最靠近太阳的行星，体积较小，表面布满撞击坑并承受强烈太阳辐照。",
    moon: "月球是地球的天然卫星，也是人类首次到访的地外天体。",
    neptune: "海王星是一颗深蓝色冰巨星，拥有极端强风和遥远的卫星系统。",
    pluto: "冥王星是一颗矮行星，也是柯伊伯带天体，表面由复杂冰质地貌构成。",
    saturn: "土星以壮观的环系统和众多冰质卫星而闻名。",
    sun: "太阳是太阳系中心恒星，也是所有行星视图中的主要光源。",
    uranus: "天王星是一颗浅青色冰巨星，拥有极端倾斜的自转轴和微弱环系统。",
    venus: "金星是一颗被厚云层包裹的类地行星，拥有浓密大气和强烈温室效应。",
  },
};

export const TARGET_RELATED_LOCALIZED: Record<
  Language,
  Record<SelectedTarget, string[]>
> = {
  en: {
    "asteroid-belt": ["Ceres", "Mars", "Jupiter", "Minor planets"],
    "kuiper-belt": ["Pluto", "Neptune", "Icy bodies", "Comet origins"],
    ceres: ["Asteroid Belt", "Bright deposits", "Dwarf planets"],
    earth: ["Moon", "ISS", "Near Earth Objects"],
    jupiter: ["Io", "Europa", "Ganymede", "Callisto", "Juno"],
    mars: ["Olympus Mons", "Valles Marineris", "Jezero Crater", "Polar Caps"],
    mercury: ["Sun", "Caloris Basin", "Inner Solar System"],
    moon: ["Apollo Site", "Mare Tranquillitatis", "Far Side"],
    neptune: ["Triton", "Great Dark Spot", "Kuiper Belt"],
    pluto: ["Charon", "Tombaugh Regio", "Kuiper Belt"],
    saturn: ["Titan", "Enceladus", "Rings", "Cassini"],
    sun: ["Mercury", "Venus", "Solar Corona", "Solar Wind"],
    uranus: ["Titania", "Oberon", "Faint rings", "Tilted axis"],
    venus: ["Sun", "Cloud Deck", "Terrestrial Planets"],
  },
  zh: {
    "asteroid-belt": ["谷神星", "火星", "木星", "小天体"],
    "kuiper-belt": ["冥王星", "海王星", "冰质天体", "彗星源区"],
    ceres: ["小行星带", "亮斑沉积物", "矮行星"],
    earth: ["月球", "国际空间站", "近地天体"],
    jupiter: ["伊奥", "欧罗巴", "盖尼米德", "卡利斯托", "朱诺号"],
    mars: ["奥林帕斯山", "水手峡谷", "杰泽罗陨石坑", "火星极冠"],
    mercury: ["太阳", "卡洛里斯盆地", "内太阳系"],
    moon: ["阿波罗登陆点", "静海", "月球背面"],
    neptune: ["海卫一", "大暗斑", "柯伊伯带"],
    pluto: ["卡戎", "汤博区", "柯伊伯带"],
    saturn: ["泰坦", "土卫二", "土星环", "卡西尼号"],
    sun: ["水星", "金星", "日冕", "太阳风"],
    uranus: ["天卫三", "天卫四", "微弱环", "倾斜自转轴"],
    venus: ["太阳", "云层", "类地行星"],
  },
};

export const TARGET_METADATA: Record<SelectedTarget, TargetMetadata> = {
  "asteroid-belt": {
    assistant:
      "任务控制：小行星带区域已锁定。建议观察火星与木星之间的岩石碎片带，理解太阳系形成后遗留物质。",
    description:
      "The asteroid belt is a broad region of rocky debris and minor planets between Mars and Jupiter.",
    label: "Asteroid Belt",
    related: ["Ceres", "Mars", "Jupiter", "Minor planets"],
    type: "Region",
  },
  "kuiper-belt": {
    assistant:
      "任务控制：柯伊伯带边界已锁定。建议观察海王星外侧的冰体带，它是许多矮行星和彗星的家园。",
    description:
      "The Kuiper Belt is a distant icy frontier beyond Neptune, home to dwarf planets and comet-like bodies.",
    label: "Kuiper Belt",
    related: ["Pluto", "Neptune", "Icy bodies", "Comet origins"],
    type: "Region",
  },
  ceres: {
    assistant:
      "任务控制：谷神星已锁定。它是小行星带中最大的天体，适合观察矮行星和岩石碎片带之间的关系。",
    description:
      "Ceres is the largest object in the asteroid belt and is classified as a dwarf planet.",
    label: "Ceres",
    related: ["Asteroid Belt", "Bright deposits", "Dwarf planets"],
    type: "Dwarf Planet",
  },
  earth: {
    assistant: "任务控制：地球轨道锁定。当前视图显示地月系统、近地空间层和主要导航参考线。",
    description:
      "Earth is our home world, the only known planet with life and liquid water on its surface.",
    label: "Earth",
    related: ["Moon", "ISS", "Near Earth Objects"],
    type: "Planet",
  },
  jupiter: {
    assistant: "任务控制：木星主视图已建立。巨行星云带、磁层参考和外侧任务航迹已标记。",
    description:
      "Jupiter is the largest planet in the solar system, a giant world of storms, clouds, and powerful magnetic fields.",
    label: "Jupiter",
    related: ["Io", "Europa", "Ganymede", "Callisto", "Juno"],
    type: "Gas Giant",
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
  mercury: {
    assistant: "任务控制：水星已锁定。该目标适合观察内太阳系尺度、强光照环境和类月球撞击地貌。",
    description:
      "Mercury is the innermost planet, a small cratered world exposed to extreme solar heating.",
    label: "Mercury",
    related: ["Sun", "Caloris Basin", "Inner Solar System"],
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
  neptune: {
    assistant:
      "任务控制：海王星已锁定。建议观察深蓝色大气和 Triton 方向，理解外太阳系冰巨星。",
    description:
      "Neptune is a deep blue ice giant with extreme winds and a distant moon system.",
    label: "Neptune",
    related: ["Triton", "Great Dark Spot", "Kuiper Belt"],
    type: "Ice Giant",
  },
  pluto: {
    assistant:
      "任务控制：冥王星已锁定。请将它作为柯伊伯带矮行星观察，而不是传统九大行星。",
    description:
      "Pluto is a dwarf planet and Kuiper Belt world with a complex icy surface.",
    label: "Pluto",
    related: ["Charon", "Tombaugh Regio", "Kuiper Belt"],
    type: "Dwarf Planet",
  },
  saturn: {
    assistant: "任务控制：土星轨道已锁定。环系统、冰卫星区域和外侧深空航迹正在稳定跟踪。",
    description:
      "Saturn is famous for its spectacular ring system and icy moons.",
    label: "Saturn",
    related: ["Titan", "Enceladus", "Rings", "Cassini"],
    type: "Ringed Planet",
  },
  sun: {
    assistant: "任务控制：太阳已锁定。请注意当前目标是恒星光源，适合观察日冕、光照方向和内太阳系尺度。",
    description:
      "The Sun is the central star of the solar system and the primary light source for every planetary view.",
    label: "Sun",
    related: ["Mercury", "Venus", "Solar Corona", "Solar Wind"],
    type: "Star",
  },
  uranus: {
    assistant:
      "任务控制：天王星已锁定。建议观察它极端倾斜的自转轴，这是该冰巨星最独特的特征之一。",
    description:
      "Uranus is a pale ice giant with a dramatically tilted rotation axis and faint rings.",
    label: "Uranus",
    related: ["Titania", "Oberon", "Faint rings", "Tilted axis"],
    type: "Ice Giant",
  },
  venus: {
    assistant: "任务控制：金星已锁定。当前视图适合观察厚云层、类地行星尺度和内太阳系轨道关系。",
    description:
      "Venus is a cloud-covered terrestrial planet with a dense atmosphere and intense greenhouse conditions.",
    label: "Venus",
    related: ["Sun", "Cloud Deck", "Terrestrial Planets"],
    type: "Planet",
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

export const TARGET_POSITIONS: Record<SelectedTarget, [number, number, number]> =
  {
    "asteroid-belt": [0, 0.05, 15.1],
    "kuiper-belt": [0, 0.05, 54],
    ceres: [2.69, 0.02, 15.27],
    earth: [8.8, 0, 0.6],
    jupiter: [-17.32, 0.2, 10],
    mars: [9.83, -0.08, -6.88],
    mercury: [3.06, 0, 2.57],
    moon: [10.55, 0.18, -0.2],
    neptune: [22, 0, -38.1],
    pluto: [51.68, 0.08, 18.81],
    saturn: [-14, 0, -24.25],
    sun: [0, 0, 0],
    uranus: [-31.18, 0, -18],
    venus: [-2.05, 0, 5.64],
  };
