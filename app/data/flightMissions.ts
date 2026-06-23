import type {
  FlightMission,
  FlightMissionDifficulty,
  FlightMissionId,
  Language,
  SpaceTarget,
} from "@/app/types/space";

export const FLIGHT_MISSIONS: FlightMission[] = [
  {
    description: {
      en: "A short atmospheric approach that teaches cockpit alignment, scan range, and discovery recording around Earth.",
      zh: "围绕地球的短程大气接近任务，用于熟悉驾驶舱对准、扫描范围与发现记录。",
    },
    difficulty: "easy",
    estimatedDuration: { en: "2 min", zh: "约 2 分钟" },
    id: "approach-earth-orbit",
    objectives: [
      {
        id: "earth-approach",
        instruction: {
          en: "Use Auto Pilot or manual flight to enter Earth scan range.",
          zh: "使用自动导航或手动飞行进入地球扫描范围。",
        },
        requiredDistance: 7,
        target: "earth",
        title: { en: "Approach Earth Orbit", zh: "接近地球轨道" },
        type: "approach",
      },
      {
        id: "earth-align",
        instruction: {
          en: "Center Earth inside the cockpit reticle.",
          zh: "将地球对准驾驶舱中央扫描框。",
        },
        requiredAlignment: 0.82,
        target: "earth",
        title: { en: "Align Earth Reticle", zh: "对准地球扫描框" },
        type: "align",
      },
      {
        id: "earth-scan",
        instruction: {
          en: "Run a cockpit scan of Earth's atmosphere profile.",
          zh: "执行一次地球大气轮廓扫描。",
        },
        target: "earth",
        title: { en: "Scan Earth Atmosphere", zh: "扫描地球大气" },
        type: "scan",
      },
    ],
    recommendedLayers: { labels: true, moons: true, orbits: true },
    reward: {
      discoveryCardIds: ["earth-atmosphere-profile"],
      researchCredits: 50,
      xp: 100,
    },
    subtitle: {
      en: "Atmospheric scan training",
      zh: "大气扫描训练",
    },
    target: "earth",
    title: { en: "Approach Earth Orbit", zh: "接近地球轨道" },
  },
  {
    description: {
      en: "A red-world survey focused on cockpit approach, terrain alignment, and frontier scan recording.",
      zh: "面向红色星球的飞行巡测，重点练习接近、地貌对准和边疆扫描记录。",
    },
    difficulty: "medium",
    estimatedDuration: { en: "3 min", zh: "约 3 分钟" },
    id: "scan-mars-frontier",
    objectives: [
      {
        id: "mars-approach",
        instruction: {
          en: "Approach Mars until the cockpit reports scan range.",
          zh: "接近火星，直到驾驶舱进入扫描范围。",
        },
        requiredDistance: 7,
        target: "mars",
        title: { en: "Approach Mars", zh: "接近火星" },
        type: "approach",
      },
      {
        id: "mars-align",
        instruction: {
          en: "Align the red planet in the scan reticle.",
          zh: "将火星对准扫描框中心。",
        },
        requiredAlignment: 0.82,
        target: "mars",
        title: { en: "Align Mars", zh: "对准火星" },
        type: "align",
      },
      {
        id: "mars-scan",
        instruction: {
          en: "Scan the Mars frontier profile.",
          zh: "扫描火星边疆地貌轮廓。",
        },
        target: "mars",
        title: { en: "Scan Mars Frontier", zh: "扫描火星边疆" },
        type: "scan",
      },
    ],
    recommendedLayers: { labels: true, orbits: true },
    reward: {
      badgeIds: ["mars-field-surveyor"],
      discoveryCardIds: ["mars-ancient-water-signature"],
      researchCredits: 70,
      xp: 140,
    },
    subtitle: { en: "Red planet field survey", zh: "红色星球野外巡测" },
    target: "mars",
    title: { en: "Scan Mars Frontier", zh: "扫描火星边疆" },
  },
  {
    description: {
      en: "A corridor flight through the rocky debris field between Mars and Jupiter.",
      zh: "穿越火星与木星之间岩石碎片带的区域飞行任务。",
    },
    difficulty: "medium",
    estimatedDuration: { en: "4 min", zh: "约 4 分钟" },
    id: "fly-through-asteroid-belt",
    objectives: [
      {
        id: "belt-approach",
        instruction: {
          en: "Approach the asteroid belt region from above the orbital plane.",
          zh: "从轨道面上方接近小行星带区域。",
        },
        requiredDistance: 18,
        target: "asteroid-belt",
        title: { en: "Approach Belt Region", zh: "接近小行星带区域" },
        type: "approach",
      },
      {
        id: "belt-corridor",
        instruction: {
          en: "Remain inside the belt corridor for five seconds.",
          zh: "在小行星带走廊内保持 5 秒。",
        },
        requiredDurationSeconds: 5,
        target: "asteroid-belt",
        title: { en: "Hold Belt Corridor", zh: "保持小行星带走廊" },
        type: "fly-through",
      },
      {
        id: "belt-scan",
        instruction: {
          en: "Scan the belt density profile.",
          zh: "扫描小行星带密度轮廓。",
        },
        target: "asteroid-belt",
        title: { en: "Scan Belt Density", zh: "扫描小行星带密度" },
        type: "scan",
      },
    ],
    recommendedLayers: { asteroidBelt: true, labels: true, orbits: true },
    reward: {
      discoveryCardIds: ["asteroid-belt-density-map"],
      researchCredits: 90,
      xp: 180,
    },
    subtitle: { en: "Rocky corridor navigation", zh: "岩石走廊导航" },
    target: "asteroid-belt",
    title: { en: "Fly Through Asteroid Belt", zh: "穿越小行星带" },
  },
  {
    description: {
      en: "A measured approach to Saturn's ring plane for particle-structure recording.",
      zh: "以克制角度接近土星环平面，记录环系统颗粒结构。",
    },
    difficulty: "medium",
    estimatedDuration: { en: "4 min", zh: "约 4 分钟" },
    id: "scan-saturn-rings",
    objectives: [
      {
        id: "saturn-approach",
        instruction: {
          en: "Approach Saturn without crossing the safe ring distance.",
          zh: "接近土星，并保持安全环系统距离。",
        },
        requiredDistance: 12,
        target: "saturn",
        title: { en: "Approach Ring Zone", zh: "接近土星环区域" },
        type: "approach",
      },
      {
        id: "saturn-align",
        instruction: {
          en: "Align Saturn and its ring system in the cockpit reticle.",
          zh: "将土星及环系统对准驾驶舱扫描框。",
        },
        requiredAlignment: 0.82,
        target: "saturn",
        title: { en: "Align Ring System", zh: "对准环系统" },
        type: "align",
      },
      {
        id: "saturn-scan",
        instruction: {
          en: "Scan Saturn's ring particle profile.",
          zh: "扫描土星环颗粒轮廓。",
        },
        target: "saturn",
        title: { en: "Scan Ring Particles", zh: "扫描环颗粒" },
        type: "scan",
      },
    ],
    recommendedLayers: { labels: true, moons: true, orbits: true },
    reward: {
      badgeIds: ["ring-system-analyst"],
      discoveryCardIds: ["saturn-ring-particle-profile"],
      researchCredits: 100,
      xp: 200,
    },
    subtitle: { en: "Ring system analysis", zh: "环系统分析" },
    target: "saturn",
    title: { en: "Scan Saturn Rings", zh: "扫描土星环" },
  },
  {
    description: {
      en: "An outer-system ice giant survey centered on Uranus' quiet disk, faint rings, and extreme axial tilt.",
      zh: "外太阳系冰巨星巡测，聚焦天王星冷静盘面、淡环与极端轴倾角。",
    },
    difficulty: "hard",
    estimatedDuration: { en: "5 min", zh: "约 5 分钟" },
    id: "survey-uranus-tilted-axis",
    objectives: [
      {
        id: "uranus-approach",
        instruction: {
          en: "Approach Uranus and hold outside the ice giant safety envelope.",
          zh: "接近天王星，并保持在冰巨星安全距离外。",
        },
        requiredDistance: 10,
        target: "uranus",
        title: { en: "Approach Uranus", zh: "接近天王星" },
        type: "approach",
      },
      {
        id: "uranus-align",
        instruction: {
          en: "Align the ice giant profile and faint rings.",
          zh: "对准冰巨星轮廓与淡环结构。",
        },
        requiredAlignment: 0.82,
        target: "uranus",
        title: { en: "Align Tilted Axis", zh: "对准倾斜轴" },
        type: "align",
      },
      {
        id: "uranus-scan",
        instruction: {
          en: "Scan Uranus' tilted-axis profile.",
          zh: "扫描天王星倾斜轴轮廓。",
        },
        target: "uranus",
        title: { en: "Scan Tilted Axis", zh: "扫描倾斜轴" },
        type: "scan",
      },
    ],
    recommendedLayers: { labels: true, moons: true, orbits: true },
    reward: {
      badgeIds: ["ice-giant-surveyor"],
      discoveryCardIds: ["uranus-tilted-axis-profile"],
      researchCredits: 120,
      xp: 220,
    },
    subtitle: { en: "Tilted ice giant survey", zh: "倾斜冰巨星巡测" },
    target: "uranus",
    title: { en: "Survey Uranus Tilted Axis", zh: "巡测天王星倾斜轴" },
  },
  {
    description: {
      en: "A deep-blue atmospheric survey around Neptune and its outer-system context.",
      zh: "围绕海王星深蓝大气与外太阳系语境的巡测任务。",
    },
    difficulty: "hard",
    estimatedDuration: { en: "5 min", zh: "约 5 分钟" },
    id: "survey-neptune-atmosphere",
    objectives: [
      {
        id: "neptune-approach",
        instruction: {
          en: "Approach Neptune from the outer-system overview vector.",
          zh: "从外太阳系总览向量接近海王星。",
        },
        requiredDistance: 10,
        target: "neptune",
        title: { en: "Approach Neptune", zh: "接近海王星" },
        type: "approach",
      },
      {
        id: "neptune-align",
        instruction: {
          en: "Align the deep-blue atmosphere in the reticle.",
          zh: "将深蓝大气轮廓对准扫描框。",
        },
        requiredAlignment: 0.82,
        target: "neptune",
        title: { en: "Align Atmosphere", zh: "对准大气轮廓" },
        type: "align",
      },
      {
        id: "neptune-scan",
        instruction: {
          en: "Scan Neptune's wind profile.",
          zh: "扫描海王星风场轮廓。",
        },
        target: "neptune",
        title: { en: "Scan Wind Profile", zh: "扫描风场轮廓" },
        type: "scan",
      },
    ],
    recommendedLayers: { labels: true, moons: true, orbits: true },
    reward: {
      badgeIds: ["ice-giant-surveyor"],
      discoveryCardIds: ["neptune-wind-profile"],
      researchCredits: 130,
      xp: 240,
    },
    subtitle: { en: "Ice giant atmosphere survey", zh: "冰巨星大气巡测" },
    target: "neptune",
    title: { en: "Survey Neptune Atmosphere", zh: "巡测海王星大气" },
  },
  {
    description: {
      en: "A distant dwarf-world survey connecting Pluto with Charon and the Kuiper Belt frontier.",
      zh: "连接冥王星、卡戎与柯伊伯带边疆的遥远矮行星巡测。",
    },
    difficulty: "hard",
    estimatedDuration: { en: "5 min", zh: "约 5 分钟" },
    id: "survey-pluto-charon",
    objectives: [
      {
        id: "pluto-approach",
        instruction: {
          en: "Approach Pluto without losing Charon context.",
          zh: "接近冥王星，同时保留卡戎语境。",
        },
        requiredDistance: 6,
        target: "pluto",
        title: { en: "Approach Pluto", zh: "接近冥王星" },
        type: "approach",
      },
      {
        id: "pluto-align",
        instruction: {
          en: "Align the Pluto-Charon context.",
          zh: "对准冥王星-卡戎语境。",
        },
        requiredAlignment: 0.82,
        target: "pluto",
        title: { en: "Align Pluto-Charon", zh: "对准冥王星-卡戎" },
        type: "align",
      },
      {
        id: "pluto-scan",
        instruction: {
          en: "Scan the outer dwarf planet profile.",
          zh: "扫描外侧矮行星轮廓。",
        },
        target: "pluto",
        title: { en: "Scan Dwarf Planet", zh: "扫描矮行星" },
        type: "scan",
      },
    ],
    recommendedLayers: { kuiperBelt: true, labels: true, orbits: true },
    reward: {
      badgeIds: ["outer-frontier-pilot"],
      discoveryCardIds: ["pluto-charon-context"],
      researchCredits: 140,
      xp: 260,
    },
    subtitle: { en: "Dwarf-world context survey", zh: "矮行星语境巡测" },
    target: "pluto",
    title: { en: "Survey Pluto and Charon", zh: "巡测冥王星与卡戎" },
  },
  {
    description: {
      en: "A long-range corridor mission through the sparse icy frontier beyond Neptune.",
      zh: "穿越海王星外侧稀疏冰体边疆的远距走廊任务。",
    },
    difficulty: "hard",
    estimatedDuration: { en: "6 min", zh: "约 6 分钟" },
    id: "cross-kuiper-frontier",
    objectives: [
      {
        id: "kuiper-approach",
        instruction: {
          en: "Approach the Kuiper Belt region from the outer-system plane.",
          zh: "从外太阳系轨道面接近柯伊伯带区域。",
        },
        requiredDistance: 22,
        target: "kuiper-belt",
        title: { en: "Approach Kuiper Belt", zh: "接近柯伊伯带" },
        type: "approach",
      },
      {
        id: "kuiper-corridor",
        instruction: {
          en: "Remain inside the outer frontier corridor for five seconds.",
          zh: "在外侧边疆走廊内保持 5 秒。",
        },
        requiredDurationSeconds: 5,
        target: "kuiper-belt",
        title: { en: "Hold Frontier Corridor", zh: "保持边疆走廊" },
        type: "fly-through",
      },
      {
        id: "kuiper-scan",
        instruction: {
          en: "Scan the icy frontier profile.",
          zh: "扫描冰体边疆轮廓。",
        },
        target: "kuiper-belt",
        title: { en: "Scan Icy Frontier", zh: "扫描冰体边疆" },
        type: "scan",
      },
    ],
    recommendedLayers: { kuiperBelt: true, labels: true, orbits: true },
    reward: {
      badgeIds: ["outer-frontier-pilot"],
      discoveryCardIds: ["kuiper-belt-icy-frontier"],
      researchCredits: 160,
      xp: 300,
    },
    subtitle: { en: "Outer frontier corridor", zh: "外侧边疆走廊" },
    target: "kuiper-belt",
    title: { en: "Cross Kuiper Frontier", zh: "穿越柯伊伯边疆" },
  },
  {
    description: {
      en: "A simplified educational route profile following the giant-planet arc associated with Voyager 2.",
      zh: "沿旅行者 2 号巨行星弧线组织的简化教育路线档案任务。",
    },
    difficulty: "hard",
    estimatedDuration: { en: "8 min", zh: "约 8 分钟" },
    id: "voyager-2-ice-giant-route",
    objectives: [
      {
        id: "voyager-jupiter",
        instruction: {
          en: "Lock Jupiter as the first route waypoint.",
          zh: "锁定木星作为第一个路线航点。",
        },
        target: "jupiter",
        title: { en: "Waypoint Jupiter", zh: "航点：木星" },
        type: "route-waypoint",
      },
      {
        id: "voyager-saturn",
        instruction: {
          en: "Lock Saturn as the second route waypoint.",
          zh: "锁定土星作为第二个路线航点。",
        },
        target: "saturn",
        title: { en: "Waypoint Saturn", zh: "航点：土星" },
        type: "route-waypoint",
      },
      {
        id: "voyager-uranus",
        instruction: {
          en: "Lock Uranus and observe the ice giant context.",
          zh: "锁定天王星并观察冰巨星语境。",
        },
        target: "uranus",
        title: { en: "Waypoint Uranus", zh: "航点：天王星" },
        type: "route-waypoint",
      },
      {
        id: "voyager-neptune",
        instruction: {
          en: "Lock Neptune as the final ice giant waypoint.",
          zh: "锁定海王星作为最终冰巨星航点。",
        },
        target: "neptune",
        title: { en: "Waypoint Neptune", zh: "航点：海王星" },
        type: "route-waypoint",
      },
      {
        id: "voyager-neptune-scan",
        instruction: {
          en: "Scan Neptune's wind profile to archive the route endpoint.",
          zh: "扫描海王星风场轮廓，归档路线终点。",
        },
        target: "neptune",
        title: { en: "Scan Neptune Endpoint", zh: "扫描海王星终点" },
        type: "scan",
      },
    ],
    recommendedLayers: { labels: true, missionRoutes: true, moons: true, orbits: true },
    reward: {
      badgeIds: ["voyager-route-observer"],
      discoveryCardIds: ["neptune-wind-profile"],
      researchCredits: 180,
      xp: 360,
    },
    subtitle: { en: "Giant planet route profile", zh: "巨行星路线档案" },
    target: "neptune",
    title: { en: "Voyager 2 Ice Giant Route", zh: "旅行者 2 号冰巨星路线" },
  },
];

export const RECOMMENDED_FLIGHT_MISSIONS: Partial<
  Record<SpaceTarget, FlightMissionId>
> = {
  "asteroid-belt": "fly-through-asteroid-belt",
  "kuiper-belt": "cross-kuiper-frontier",
  earth: "approach-earth-orbit",
  mars: "scan-mars-frontier",
  neptune: "survey-neptune-atmosphere",
  pluto: "survey-pluto-charon",
  saturn: "scan-saturn-rings",
  uranus: "survey-uranus-tilted-axis",
};

export const FLIGHT_DIFFICULTY_LABELS: Record<
  FlightMissionDifficulty | "all",
  Record<Language, string>
> = {
  all: { en: "All", zh: "全部" },
  easy: { en: "Easy", zh: "简单" },
  hard: { en: "Hard", zh: "困难" },
  medium: { en: "Medium", zh: "中等" },
};

export function getFlightMissionById(missionId: FlightMissionId | null) {
  if (!missionId) return null;
  return FLIGHT_MISSIONS.find((mission) => mission.id === missionId) ?? null;
}

export function getRecommendedFlightMissionForTarget(target: SpaceTarget) {
  const missionId = RECOMMENDED_FLIGHT_MISSIONS[target];
  return getFlightMissionById(missionId ?? null);
}
