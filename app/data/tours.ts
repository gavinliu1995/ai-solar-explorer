import type { Language, Tour, TourId, TourStop } from "@/app/types/space";

const GRAND_TOUR_STOPS: TourStop[] = [
  {
    cameraMode: "close",
    description: "Begin at the system's energy and gravity anchor.",
    id: "grand-sun",
    objective: "观察太阳日冕与太阳风，理解太阳如何定义整个太阳系环境。",
    recommendedMissionIds: ["sun-corona", "sun-solar-wind"],
    requiredLayers: { labels: true, orbits: true },
    subtitle: "太阳系的能量与引力中心",
    target: "sun",
    title: "The Solar Engine",
    viewMode: "solar-system",
  },
  {
    cameraMode: "close",
    description: "Move into the innermost rocky orbit.",
    id: "grand-mercury",
    objective: "观察水星的高温差和撞击坑地貌。",
    recommendedMissionIds: ["mercury-inner-world", "mercury-day-night"],
    requiredLayers: { labels: true, orbits: true },
    subtitle: "最靠近太阳的小行星世界",
    target: "mercury",
    title: "The Scorched Messenger",
    viewMode: "solar-system",
  },
  {
    cameraMode: "close",
    description: "Study the cloud-wrapped terrestrial planet.",
    id: "grand-venus",
    objective: "观察金星云层，理解失控温室效应。",
    recommendedMissionIds: ["venus-greenhouse-world", "venus-cloud-deck"],
    requiredLayers: { labels: true, orbits: true },
    subtitle: "被厚重大气包裹的温室世界",
    target: "venus",
    title: "The Clouded Furnace",
    viewMode: "solar-system",
  },
  {
    cameraMode: "close",
    description: "Establish the Earth-Moon system as the mission reference.",
    id: "grand-earth",
    objective: "观察地球大气、海洋和月球轨道。",
    recommendedMissionIds: ["earth-moon-system", "earth-atmosphere"],
    requiredLayers: { labels: true, moons: true, orbits: true },
    subtitle: "已知唯一孕育生命的行星",
    target: "earth",
    title: "The Living World",
    viewMode: "solar-system",
  },
  {
    cameraMode: "close",
    description: "Visit the nearest world beyond Earth.",
    id: "grand-moon",
    objective: "观察月海、陨石坑和地月距离。",
    recommendedMissionIds: ["moon-maria", "moon-earth-distance"],
    requiredLayers: { labels: true, moons: true, orbits: true },
    subtitle: "人类踏足的第一个地外世界",
    target: "moon",
    title: "The First Frontier",
    viewMode: "solar-system",
  },
  {
    cameraMode: "close",
    description: "Scan major Martian terrain sites.",
    id: "grand-mars",
    objective: "扫描奥林帕斯山、水手峡谷、杰泽罗陨石坑和极冠。",
    recommendedMissionIds: ["mars-olympus", "mars-valles", "mars-jezero"],
    requiredLayers: { labels: true, orbits: true },
    subtitle: "人类未来深空探索的重要目标",
    target: "mars",
    title: "The Red Frontier",
    viewMode: "solar-system",
  },
  {
    cameraMode: "overview",
    description: "Cross the rocky material field between Mars and Jupiter.",
    id: "grand-asteroid-belt",
    objective: "观察小行星带结构，理解太阳系形成后的残余物。",
    recommendedMissionIds: ["asteroid-belt-map"],
    requiredLayers: { asteroidBelt: true, labels: true, orbits: true },
    subtitle: "火星与木星之间的岩石碎片带",
    target: "asteroid-belt",
    title: "The Rocky Debris Field",
    viewMode: "solar-system",
  },
  {
    cameraMode: "close",
    description: "Use Ceres as the belt's concrete dwarf-planet anchor.",
    id: "grand-ceres",
    objective: "观察谷神星作为矮行星和小行星带成员的双重身份。",
    recommendedMissionIds: ["ceres-visit", "ceres-bright-deposits"],
    requiredLayers: { asteroidBelt: true, labels: true, orbits: true },
    subtitle: "小行星带中最大的天体",
    target: "ceres",
    title: "The Dwarf World Within the Belt",
    viewMode: "solar-system",
  },
  {
    cameraMode: "close",
    description: "Enter the giant planet region.",
    id: "grand-jupiter",
    objective: "观察木星云带、巨大尺度和伽利略卫星系统。",
    recommendedMissionIds: ["jupiter-bands", "jupiter-scale"],
    requiredLayers: { labels: true, moons: true, orbits: true },
    subtitle: "太阳系最大的行星",
    target: "jupiter",
    title: "The Giant of Storms",
    viewMode: "solar-system",
  },
  {
    cameraMode: "close",
    description: "Survey the most recognizable ring system.",
    id: "grand-saturn",
    objective: "扫描土星环、Titan 和 Enceladus。",
    recommendedMissionIds: ["saturn-rings", "saturn-icy-moons"],
    requiredLayers: { labels: true, moons: true, orbits: true },
    subtitle: "拥有壮观环系统的气态巨行星",
    target: "saturn",
    title: "The Ringed World",
    viewMode: "solar-system",
  },
  {
    cameraMode: "close",
    description: "Observe the sideways ice giant.",
    id: "grand-uranus",
    objective: "观察天王星独特的轴倾角和淡环。",
    recommendedMissionIds: ["uranus-tilt", "uranus-rings"],
    requiredLayers: { labels: true, moons: true, orbits: true },
    subtitle: "倾斜旋转的冰巨星",
    target: "uranus",
    title: "The Tilted Ice Giant",
    viewMode: "solar-system",
  },
  {
    cameraMode: "close",
    description: "Reach the last major planet.",
    id: "grand-neptune",
    objective: "观察海王星深蓝大气、强风和 Triton。",
    recommendedMissionIds: ["neptune-blue-giant", "neptune-triton"],
    requiredLayers: { labels: true, moons: true, orbits: true },
    subtitle: "外太阳系的深蓝冰巨星",
    target: "neptune",
    title: "The Blue Wind World",
    viewMode: "solar-system",
  },
  {
    cameraMode: "close",
    description: "Frame Pluto as an outer-system dwarf world.",
    id: "grand-pluto",
    objective: "观察冥王星与外太阳系边界的关系。",
    recommendedMissionIds: ["pluto-kuiper-world", "pluto-charon-context"],
    requiredLayers: { kuiperBelt: true, labels: true, orbits: true },
    subtitle: "柯伊伯带中的矮行星世界",
    target: "pluto",
    title: "The Distant Dwarf Planet",
    viewMode: "solar-system",
  },
  {
    cameraMode: "overview",
    description: "Finish at the icy frontier beyond Neptune.",
    id: "grand-kuiper-belt",
    objective: "观察柯伊伯带点云，理解矮行星和短周期彗星的来源。",
    recommendedMissionIds: ["kuiper-belt-map", "kuiper-belt-comets"],
    requiredLayers: { kuiperBelt: true, labels: true, orbits: true },
    subtitle: "海王星外侧的冰体边疆",
    target: "kuiper-belt",
    title: "The Icy Frontier",
    viewMode: "solar-system",
  },
];

export const TOURS: Tour[] = [
  {
    description:
      "A complete route from the Sun through the outer icy frontier.",
    estimatedDuration: "14 stops",
    id: "grand-tour",
    stops: GRAND_TOUR_STOPS,
    subtitle: "太阳系大巡航",
    title: "Grand Tour",
  },
  {
    description:
      "A compact chapter through the Sun, rocky planets, Earth-Moon system, and Mars.",
    estimatedDuration: "6 stops",
    id: "inner-worlds",
    stops: GRAND_TOUR_STOPS.slice(0, 6),
    subtitle: "内太阳系路线",
    title: "Inner Worlds",
  },
  {
    description:
      "A focused route through the giant planets and their moon systems.",
    estimatedDuration: "4 stops",
    id: "giant-planets",
    stops: GRAND_TOUR_STOPS.slice(8, 12),
    subtitle: "巨行星路线",
    title: "Giant Planets",
  },
  {
    description:
      "A route through belts, dwarf worlds, Neptune, and the outer icy boundary.",
    estimatedDuration: "5 stops",
    id: "outer-frontier",
    stops: [
      GRAND_TOUR_STOPS[6],
      GRAND_TOUR_STOPS[7],
      GRAND_TOUR_STOPS[11],
      GRAND_TOUR_STOPS[12],
      GRAND_TOUR_STOPS[13],
    ],
    subtitle: "外太阳系边疆路线",
    title: "Outer Frontier",
  },
];

export function getTourById(tourId: TourId | null) {
  if (!tourId) return null;
  return TOURS.find((tour) => tour.id === tourId) ?? null;
}

type TourCopy = Pick<Tour, "description" | "estimatedDuration" | "subtitle" | "title">;
type TourStopCopy = Pick<TourStop, "description" | "objective" | "subtitle" | "title">;

const TOUR_COPY: Record<TourId, Record<Language, TourCopy>> = {
  "grand-tour": {
    en: {
      title: "Grand Tour",
      subtitle: "Complete solar system cruise",
      description: "A complete route from the Sun through the outer icy frontier.",
      estimatedDuration: "14 stops",
    },
    zh: {
      title: "太阳系大巡航",
      subtitle: "完整太阳系路线",
      description: "从太阳出发，一路穿越到外侧冰体边疆的完整路线。",
      estimatedDuration: "14 站",
    },
  },
  "inner-worlds": {
    en: {
      title: "Inner Worlds",
      subtitle: "Inner solar system route",
      description: "A compact chapter through the Sun, rocky planets, Earth-Moon system, and Mars.",
      estimatedDuration: "6 stops",
    },
    zh: {
      title: "内太阳系",
      subtitle: "岩质行星路线",
      description: "穿过太阳、岩质行星、地月系统和火星的紧凑章节。",
      estimatedDuration: "6 站",
    },
  },
  "giant-planets": {
    en: {
      title: "Giant Planets",
      subtitle: "Giant planet route",
      description: "A focused route through the giant planets and their moon systems.",
      estimatedDuration: "4 stops",
    },
    zh: {
      title: "巨行星巡航",
      subtitle: "巨行星路线",
      description: "聚焦木星、土星、天王星、海王星及其卫星系统的路线。",
      estimatedDuration: "4 站",
    },
  },
  "outer-frontier": {
    en: {
      title: "Outer Frontier",
      subtitle: "Outer solar system frontier route",
      description: "A route through belts, dwarf worlds, Neptune, and the outer icy boundary.",
      estimatedDuration: "5 stops",
    },
    zh: {
      title: "外太阳系边疆",
      subtitle: "冰体边界路线",
      description: "穿过小行星带、矮行星、海王星和外侧冰体边界的路线。",
      estimatedDuration: "5 站",
    },
  },
};

const TOUR_STOP_COPY: Record<string, Record<Language, TourStopCopy>> = {
  "grand-sun": {
    en: {
      title: "The Solar Engine",
      subtitle: "Energy and gravity center of the solar system",
      description: "Begin at the system's energy and gravity anchor.",
      objective: "Observe the solar corona and solar wind to understand how the Sun defines the whole system environment.",
    },
    zh: {
      title: "太阳引擎",
      subtitle: "太阳系的能量与引力中心",
      description: "从整个系统的能量与引力锚点开始。",
      objective: "观察太阳日冕与太阳风，理解太阳如何定义整个太阳系环境。",
    },
  },
  "grand-mercury": {
    en: {
      title: "The Scorched Messenger",
      subtitle: "The small rocky world closest to the Sun",
      description: "Move into the innermost rocky orbit.",
      objective: "Observe Mercury's temperature extremes and cratered terrain.",
    },
    zh: {
      title: "炽热信使",
      subtitle: "最靠近太阳的小型岩质世界",
      description: "进入最内侧的岩质行星轨道。",
      objective: "观察水星的高温差和撞击坑地貌。",
    },
  },
  "grand-venus": {
    en: {
      title: "The Clouded Furnace",
      subtitle: "A greenhouse world wrapped in thick atmosphere",
      description: "Study the cloud-wrapped terrestrial planet.",
      objective: "Observe Venus' cloud layer and understand runaway greenhouse context.",
    },
    zh: {
      title: "云层熔炉",
      subtitle: "被厚重大气包裹的温室世界",
      description: "研究被云层包裹的类地行星。",
      objective: "观察金星云层，理解失控温室效应。",
    },
  },
  "grand-earth": {
    en: {
      title: "The Living World",
      subtitle: "The only known planet with life",
      description: "Establish the Earth-Moon system as the mission reference.",
      objective: "Observe Earth's atmosphere, oceans, and lunar orbit.",
    },
    zh: {
      title: "生命世界",
      subtitle: "已知唯一孕育生命的行星",
      description: "把地月系统建立为任务参考系。",
      objective: "观察地球大气、海洋和月球轨道。",
    },
  },
  "grand-moon": {
    en: {
      title: "The First Frontier",
      subtitle: "The first world beyond Earth visited by humans",
      description: "Visit the nearest world beyond Earth.",
      objective: "Observe lunar maria, craters, and Earth-Moon distance.",
    },
    zh: {
      title: "第一前哨",
      subtitle: "人类踏足的第一个地外世界",
      description: "拜访离地球最近的地外世界。",
      objective: "观察月海、陨石坑和地月距离。",
    },
  },
  "grand-mars": {
    en: {
      title: "The Red Frontier",
      subtitle: "A key future target for deep-space exploration",
      description: "Scan major Martian terrain sites.",
      objective: "Scan Olympus Mons, Valles Marineris, Jezero Crater, and the polar caps.",
    },
    zh: {
      title: "红色边疆",
      subtitle: "人类未来深空探索的重要目标",
      description: "扫描火星主要地貌站点。",
      objective: "扫描奥林帕斯山、水手峡谷、杰泽罗陨石坑和极冠。",
    },
  },
  "grand-asteroid-belt": {
    en: {
      title: "The Rocky Debris Field",
      subtitle: "Rocky remnants between Mars and Jupiter",
      description: "Cross the rocky material field between Mars and Jupiter.",
      objective: "Observe the asteroid belt structure and understand leftover material from solar system formation.",
    },
    zh: {
      title: "岩石碎片带",
      subtitle: "火星与木星之间的岩石碎片带",
      description: "穿过火星与木星之间的岩石物质场。",
      objective: "观察小行星带结构，理解太阳系形成后的残余物。",
    },
  },
  "grand-ceres": {
    en: {
      title: "The Dwarf World Within the Belt",
      subtitle: "The largest body in the asteroid belt",
      description: "Use Ceres as the belt's concrete dwarf-planet anchor.",
      objective: "Observe Ceres as both a dwarf planet and a member of the asteroid belt.",
    },
    zh: {
      title: "带内矮行星",
      subtitle: "小行星带中最大的天体",
      description: "用谷神星作为小行星带中的具体矮行星锚点。",
      objective: "观察谷神星作为矮行星和小行星带成员的双重身份。",
    },
  },
  "grand-jupiter": {
    en: {
      title: "The Giant of Storms",
      subtitle: "The largest planet in the solar system",
      description: "Enter the giant planet region.",
      objective: "Observe Jupiter's cloud bands, immense scale, and Galilean moon system.",
    },
    zh: {
      title: "风暴巨行星",
      subtitle: "太阳系最大的行星",
      description: "进入巨行星区域。",
      objective: "观察木星云带、巨大尺度和伽利略卫星系统。",
    },
  },
  "grand-saturn": {
    en: {
      title: "The Ringed World",
      subtitle: "A gas giant with a spectacular ring system",
      description: "Survey the most recognizable ring system.",
      objective: "Scan Saturn's rings, Titan, and Enceladus.",
    },
    zh: {
      title: "环之世界",
      subtitle: "拥有壮观环系统的气态巨行星",
      description: "勘察最具辨识度的环系统。",
      objective: "扫描土星环、泰坦和土卫二。",
    },
  },
  "grand-uranus": {
    en: {
      title: "The Tilted Ice Giant",
      subtitle: "An ice giant rotating on its side",
      description: "Observe the sideways ice giant.",
      objective: "Observe Uranus' unusual axial tilt and faint rings.",
    },
    zh: {
      title: "倾斜冰巨星",
      subtitle: "倾斜旋转的冰巨星",
      description: "观察侧向旋转的冰巨星。",
      objective: "观察天王星独特的轴倾角和淡环。",
    },
  },
  "grand-neptune": {
    en: {
      title: "The Blue Wind World",
      subtitle: "The deep blue ice giant of the outer solar system",
      description: "Reach the last major planet.",
      objective: "Observe Neptune's deep blue atmosphere, extreme winds, and Triton.",
    },
    zh: {
      title: "蓝色风暴世界",
      subtitle: "外太阳系的深蓝冰巨星",
      description: "抵达最后一颗主要行星。",
      objective: "观察海王星深蓝大气、强风和海卫一。",
    },
  },
  "grand-pluto": {
    en: {
      title: "The Distant Dwarf Planet",
      subtitle: "A dwarf world in the Kuiper Belt",
      description: "Frame Pluto as an outer-system dwarf world.",
      objective: "Observe Pluto's relationship to the outer solar system boundary.",
    },
    zh: {
      title: "遥远矮行星",
      subtitle: "柯伊伯带中的矮行星世界",
      description: "把冥王星作为外太阳系矮行星来观察。",
      objective: "观察冥王星与外太阳系边界的关系。",
    },
  },
  "grand-kuiper-belt": {
    en: {
      title: "The Icy Frontier",
      subtitle: "The icy frontier beyond Neptune",
      description: "Finish at the icy frontier beyond Neptune.",
      objective: "Observe the Kuiper Belt point cloud and understand the source region for dwarf planets and short-period comets.",
    },
    zh: {
      title: "冰体边疆",
      subtitle: "海王星外侧的冰体边疆",
      description: "在海王星外侧的冰体边疆完成路线。",
      objective: "观察柯伊伯带点云，理解矮行星和短周期彗星的来源。",
    },
  },
};

export function getTourCopy(tour: Tour, language: Language): TourCopy {
  return TOUR_COPY[tour.id]?.[language] ?? tour;
}

export function getTourStopCopy(
  stop: TourStop,
  language: Language,
): TourStopCopy {
  return TOUR_STOP_COPY[stop.id]?.[language] ?? stop;
}
