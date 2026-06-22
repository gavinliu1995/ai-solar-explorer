import type {
  DiscoveryCard,
  DiscoveryCardId,
  Language,
} from "@/app/types/space";

type DiscoveryCardCopy = Pick<
  DiscoveryCard,
  "description" | "observationPrompt" | "subtitle" | "title" | "unlockedBy"
>;

export const DISCOVERY_CARDS: DiscoveryCard[] = [
  {
    description:
      "The corona is the Sun's outer atmosphere, where magnetic activity and plasma shape the solar wind that fills the heliosphere.",
    id: "sun-corona-profile",
    observationPrompt:
      "Observe the thin corona glow and consider how solar wind defines the space environment around every planet.",
    rarity: "rare",
    relatedTarget: "sun",
    subtitle: "Solar wind and corona structure",
    title: "Solar Corona Profile",
    unlockedBy: "Scan the Sun in Cockpit mode.",
  },
  {
    description:
      "Mercury's battered surface records intense early impact history and extreme temperature contrast near the Sun.",
    id: "mercury-crater-profile",
    observationPrompt:
      "Approach Mercury and compare its cratered surface with the Moon and Ceres.",
    rarity: "uncommon",
    relatedTarget: "mercury",
    subtitle: "Cratered inner world survey",
    title: "Mercury Crater Profile",
    unlockedBy: "Scan Mercury in Cockpit mode.",
  },
  {
    description:
      "Venus is wrapped in a thick cloud deck and dense atmosphere, making it a key reference for runaway greenhouse conditions.",
    id: "venus-cloud-deck-profile",
    observationPrompt:
      "Use the bright cloud layer as a cue for studying atmosphere-first planetary observation.",
    rarity: "rare",
    relatedTarget: "venus",
    subtitle: "Runaway greenhouse atmosphere",
    title: "Venus Cloud Deck Profile",
    unlockedBy: "Scan Venus in Cockpit mode.",
  },
  {
    description:
      "Earth's atmosphere, oceans, and cloud systems make it the only known world with stable surface life.",
    id: "earth-atmosphere-profile",
    observationPrompt:
      "Align with Earth and inspect the atmosphere shell, cloud layer, and Moon context.",
    rarity: "common",
    relatedTarget: "earth",
    subtitle: "Ocean world and living atmosphere",
    title: "Earth Atmosphere Profile",
    unlockedBy: "Scan Earth in Cockpit mode.",
  },
  {
    description:
      "The Moon's maria and crater fields preserve a visible record of impact history across the inner solar system.",
    id: "moon-crater-survey",
    observationPrompt:
      "Compare bright highlands, darker maria, and crater patterns near Earth.",
    rarity: "common",
    relatedTarget: "moon",
    subtitle: "Lunar surface archive",
    title: "Lunar Crater Survey",
    unlockedBy: "Scan the Moon in Cockpit mode.",
  },
  {
    description:
      "Mars preserves evidence of ancient water activity in valleys, crater basins, and lake-delta environments such as Jezero.",
    id: "mars-ancient-water-signature",
    observationPrompt:
      "Use Mars exploration labels to connect terrain sites with ancient water context.",
    rarity: "uncommon",
    relatedTarget: "mars",
    subtitle: "Ancient water context",
    title: "Ancient Water Signature",
    unlockedBy: "Scan Mars in Cockpit mode.",
  },
  {
    description:
      "The asteroid belt is a broad debris region between Mars and Jupiter, filled with rocky bodies and minor planets.",
    id: "asteroid-belt-density-map",
    observationPrompt:
      "Observe the belt as a region rather than a single destination and note the density variation.",
    rarity: "uncommon",
    relatedTarget: "asteroid-belt",
    subtitle: "Rocky debris field map",
    title: "Belt Density Map",
    unlockedBy: "Scan the Asteroid Belt in Cockpit mode.",
  },
  {
    description:
      "Ceres anchors the asteroid belt as a dwarf planet, with bright deposits that hint at more complex interior chemistry.",
    id: "ceres-bright-deposits",
    observationPrompt:
      "Approach Ceres and compare its dwarf-world character with the surrounding asteroid belt.",
    rarity: "rare",
    relatedTarget: "ceres",
    subtitle: "Dwarf planet within the belt",
    title: "Ceres Bright Deposits",
    unlockedBy: "Scan Ceres in Cockpit mode.",
  },
  {
    description:
      "Jupiter's cloud bands and storm systems reveal a massive, layered atmosphere driven by powerful circulation.",
    id: "jupiter-storm-band-profile",
    observationPrompt:
      "Inspect Jupiter's cloud bands and then compare its scale with the Galilean moon system.",
    rarity: "rare",
    relatedTarget: "jupiter",
    subtitle: "Giant planet atmosphere",
    title: "Storm Band Profile",
    unlockedBy: "Scan Jupiter in Cockpit mode.",
  },
  {
    description:
      "Saturn's ring system is made of countless icy particles, creating a thin, structured disk around the planet.",
    id: "saturn-ring-particle-profile",
    observationPrompt:
      "Approach at a shallow angle and inspect ring thickness, gaps, and moon context.",
    rarity: "rare",
    relatedTarget: "saturn",
    subtitle: "Ring system structure",
    title: "Ring Particle Profile",
    unlockedBy: "Scan Saturn in Cockpit mode.",
  },
  {
    description:
      "Uranus is an ice giant with an extreme axial tilt, giving it a uniquely sideways orientation in the outer solar system.",
    id: "uranus-tilted-axis-profile",
    observationPrompt:
      "Observe Uranus' quiet cyan disk, faint rings, and tilted orientation.",
    rarity: "rare",
    relatedTarget: "uranus",
    subtitle: "Tilted ice giant profile",
    title: "Tilted Axis Profile",
    unlockedBy: "Scan Uranus in Cockpit mode.",
  },
  {
    description:
      "Neptune's deep-blue atmosphere and powerful winds make it one of the most dynamic ice giants in the solar system.",
    id: "neptune-wind-profile",
    observationPrompt:
      "Align with Neptune and note the contrast between its deep color and distant moon context.",
    rarity: "epic",
    relatedTarget: "neptune",
    subtitle: "Extreme wind system",
    title: "Neptune Wind Profile",
    unlockedBy: "Scan Neptune in Cockpit mode.",
  },
  {
    description:
      "Pluto and Charon form a distant dwarf-world context inside the Kuiper Belt frontier.",
    id: "pluto-charon-context",
    observationPrompt:
      "Use Pluto's small scale and Charon marker to understand it as part of the outer frontier.",
    rarity: "epic",
    relatedTarget: "pluto",
    subtitle: "Distant binary-world context",
    title: "Pluto-Charon Context",
    unlockedBy: "Scan Pluto in Cockpit mode.",
  },
  {
    description:
      "The Kuiper Belt is a cold outer region beyond Neptune, home to icy bodies, dwarf planets, and comet source populations.",
    id: "kuiper-belt-icy-frontier",
    observationPrompt:
      "Pull back and view the Kuiper Belt as a sparse frontier rather than a solid ring.",
    rarity: "epic",
    relatedTarget: "kuiper-belt",
    subtitle: "Outer icy frontier map",
    title: "Icy Frontier Map",
    unlockedBy: "Scan the Kuiper Belt in Cockpit mode.",
  },
];

const DISCOVERY_CARD_ZH: Record<DiscoveryCardId, DiscoveryCardCopy> = {
  "asteroid-belt-density-map": {
    description: "小行星带是火星与木星之间的宽阔碎片区域，由岩石小天体和小行星族群构成。",
    observationPrompt: "把它当作区域目标观察，而不是单颗行星，注意点云密度和分布宽度。",
    subtitle: "岩石碎片带地图",
    title: "小行星带密度图",
    unlockedBy: "在驾驶舱模式中扫描小行星带。",
  },
  "ceres-bright-deposits": {
    description: "谷神星是小行星带中的矮行星锚点，亮斑沉积让它比普通小天体更复杂。",
    observationPrompt: "靠近谷神星，并把它与周围小行星带环境作对比。",
    subtitle: "小行星带中的矮行星",
    title: "谷神星亮斑沉积",
    unlockedBy: "在驾驶舱模式中扫描谷神星。",
  },
  "earth-atmosphere-profile": {
    description: "地球的大气、海洋和云层系统共同构成已知唯一稳定孕育生命的世界。",
    observationPrompt: "对准地球，观察大气外壳、云层和月球空间关系。",
    subtitle: "海洋世界与宜居大气",
    title: "地球大气轮廓",
    unlockedBy: "在驾驶舱模式中扫描地球。",
  },
  "jupiter-storm-band-profile": {
    description: "木星云带和风暴系统展示了巨行星庞大、分层且高度动态的大气。",
    observationPrompt: "观察木星云带，再与伽利略卫星系统的尺度对比。",
    subtitle: "巨行星大气",
    title: "木星风暴云带轮廓",
    unlockedBy: "在驾驶舱模式中扫描木星。",
  },
  "kuiper-belt-icy-frontier": {
    description: "柯伊伯带是海王星外侧的寒冷区域，包含冰质天体、矮行星和彗星来源族群。",
    observationPrompt: "拉远观察，把柯伊伯带理解成稀疏边疆，而不是实心圆环。",
    subtitle: "外侧冰体边疆地图",
    title: "柯伊伯带冰体边疆",
    unlockedBy: "在驾驶舱模式中扫描柯伊伯带。",
  },
  "mars-ancient-water-signature": {
    description: "火星在峡谷、陨石坑盆地和杰泽罗等古湖泊三角洲环境中保留了古水活动线索。",
    observationPrompt: "结合火星探索点标签，理解不同地貌与古水环境的关系。",
    subtitle: "古水环境线索",
    title: "火星古水迹象",
    unlockedBy: "在驾驶舱模式中扫描火星。",
  },
  "mercury-crater-profile": {
    description: "水星布满撞击坑，记录了内太阳系早期撞击历史和极端昼夜温差。",
    observationPrompt: "靠近水星，将其撞击坑表面与月球、谷神星作对比。",
    subtitle: "内侧撞击世界巡测",
    title: "水星撞击坑轮廓",
    unlockedBy: "在驾驶舱模式中扫描水星。",
  },
  "moon-crater-survey": {
    description: "月海与陨石坑场保存了内太阳系撞击历史的可见档案。",
    observationPrompt: "比较明亮高地、暗色月海和近地空间关系。",
    subtitle: "月面地质档案",
    title: "月球陨石坑巡测",
    unlockedBy: "在驾驶舱模式中扫描月球。",
  },
  "neptune-wind-profile": {
    description: "海王星深蓝色大气和强风系统让它成为太阳系中最具动态感的冰巨星之一。",
    observationPrompt: "对准海王星，观察深蓝色大气与海卫一方向的空间关系。",
    subtitle: "极端风场系统",
    title: "海王星风场轮廓",
    unlockedBy: "在驾驶舱模式中扫描海王星。",
  },
  "pluto-charon-context": {
    description: "冥王星和卡戎共同构成柯伊伯带中的遥远矮行星系统语境。",
    observationPrompt: "利用冥王星的小尺度和卡戎标记，理解它属于外侧边疆。",
    subtitle: "遥远双世界语境",
    title: "冥王星-卡戎语境",
    unlockedBy: "在驾驶舱模式中扫描冥王星。",
  },
  "saturn-ring-particle-profile": {
    description: "土星环由无数冰质颗粒组成，在行星周围形成薄而有结构的圆盘。",
    observationPrompt: "以低角度靠近，观察环的厚度、缝隙和卫星语境。",
    subtitle: "环系统结构",
    title: "土星环颗粒轮廓",
    unlockedBy: "在驾驶舱模式中扫描土星。",
  },
  "sun-corona-profile": {
    description: "日冕是太阳外层大气，磁活动和等离子体共同塑造充满日球层的太阳风。",
    observationPrompt: "观察薄日冕光晕，思考太阳风如何定义所有行星周围的空间环境。",
    subtitle: "太阳风与日冕结构",
    title: "太阳日冕轮廓",
    unlockedBy: "在驾驶舱模式中扫描太阳。",
  },
  "uranus-tilted-axis-profile": {
    description: "天王星是拥有极端轴倾角的冰巨星，在外太阳系中呈现独特的侧向姿态。",
    observationPrompt: "观察天王星安静的青色盘面、淡环和倾斜姿态。",
    subtitle: "倾斜冰巨星轮廓",
    title: "天王星轴倾角轮廓",
    unlockedBy: "在驾驶舱模式中扫描天王星。",
  },
  "venus-cloud-deck-profile": {
    description: "金星被厚重云层和稠密大气包裹，是理解失控温室效应的重要参照。",
    observationPrompt: "把明亮云层作为入口，观察以大气为主的行星特征。",
    subtitle: "失控温室大气",
    title: "金星云层轮廓",
    unlockedBy: "在驾驶舱模式中扫描金星。",
  },
};

export function getDiscoveryCardById(cardId: DiscoveryCardId) {
  return DISCOVERY_CARDS.find((card) => card.id === cardId) ?? null;
}

export function getDiscoveryCardsForTarget(target: DiscoveryCard["relatedTarget"]) {
  return DISCOVERY_CARDS.filter((card) => card.relatedTarget === target);
}

export function getScanDiscoveryCardCopy(
  card: DiscoveryCard,
  language: Language,
): DiscoveryCardCopy {
  if (language === "zh") return DISCOVERY_CARD_ZH[card.id];

  return {
    description: card.description,
    observationPrompt: card.observationPrompt,
    subtitle: card.subtitle,
    title: card.title,
    unlockedBy: card.unlockedBy,
  };
}
