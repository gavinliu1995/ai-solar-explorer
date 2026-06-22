import type { Language, Mission, MissionStep, SpaceTarget } from "@/app/types/space";

export const MISSIONS: Mission[] = [
  {
    id: "sun-corona",
    target: "sun",
    title: "Observe the Solar Corona",
    description: "以太阳作为光源锚点，观察日冕与内太阳系轨道关系。",
    objective: "锁定太阳，观察发光主体、薄日冕和内侧行星轨道。",
    status: "locked",
    focusTarget: "sun",
    suggestedCameraMode: "close",
  },
  {
    id: "sun-solar-wind",
    target: "sun",
    title: "Understand Solar Wind",
    description: "理解太阳如何通过光照、粒子流和引力塑造太阳系环境。",
    objective: "拉远到总览视角，以太阳为中心读取各行星轨道层级。",
    status: "locked",
    focusTarget: "sun",
    suggestedCameraMode: "overview",
  },
  {
    id: "mercury-inner-world",
    target: "mercury",
    title: "Explore the Innermost Planet",
    description: "观察水星近太阳位置和撞击坑地貌。",
    objective: "锁定水星，比较它与太阳之间的距离和内侧轨道尺度。",
    status: "locked",
    focusTarget: "mercury",
    suggestedCameraMode: "close",
  },
  {
    id: "mercury-day-night",
    target: "mercury",
    title: "Compare Day-Night Extremes",
    description: "用水星作为极端温度变化的内太阳系样本。",
    objective: "靠近水星，观察粗糙表面与强光照方向。",
    status: "locked",
    focusTarget: "mercury",
    suggestedCameraMode: "orbit",
  },
  {
    id: "venus-greenhouse-world",
    target: "venus",
    title: "Study the Greenhouse World",
    description: "对比金星和地球，理解厚大气与温室效应。",
    objective: "锁定金星，观察云层外观并与地球视觉差异建立联系。",
    status: "locked",
    focusTarget: "venus",
    suggestedCameraMode: "close",
  },
  {
    id: "venus-cloud-deck",
    target: "venus",
    title: "Observe the Cloud Deck",
    description: "金星的可见外观主要由厚云层主导。",
    objective: "靠近金星，观察暖色云层和内太阳系光照环境。",
    status: "locked",
    focusTarget: "venus",
    suggestedCameraMode: "orbit",
  },
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
    category: "celestial",
    id: "earth-locate-ecliptic",
    target: "earth",
    title: "Locate the Ecliptic Plane",
    description: "使用天球参考层观察太阳系轨道与黄道面的关系。",
    objective: "切换到 Celestial Sphere 模式，观察太阳系轨道与黄道面的关系。",
    status: "locked",
    focusTarget: "earth",
    requiresViewMode: "celestial-sphere",
    requiredLayers: {
      constellations: true,
      ecliptic: true,
      zodiac: true,
    },
    suggestedCameraMode: "overview",
  },
  {
    category: "celestial",
    id: "earth-identify-orion",
    target: "earth",
    title: "Identify Orion",
    description: "在天球背景中定位 Orion，建立深空方向参考。",
    objective: "在天球背景中找到 Orion，并观察它如何作为深空方向参考。",
    status: "locked",
    focusTarget: "earth",
    requiresViewMode: "celestial-sphere",
    requiredLayers: {
      constellations: true,
      ecliptic: true,
      zodiac: true,
    },
    suggestedCameraMode: "overview",
  },
  {
    category: "celestial",
    id: "earth-trace-zodiac",
    target: "earth",
    title: "Trace the Zodiac Path",
    description: "沿黄道带观察十二个黄道星座标签。",
    objective: "观察黄道带上的星座标签，理解为什么行星通常出现在黄道附近。",
    status: "locked",
    focusTarget: "earth",
    requiresViewMode: "celestial-sphere",
    requiredLayers: {
      constellations: true,
      ecliptic: true,
      zodiac: true,
    },
    suggestedCameraMode: "overview",
  },
  {
    category: "celestial",
    id: "earth-find-ursa-major",
    target: "earth",
    title: "Find Ursa Major",
    description: "在星空参考层中找到 Ursa Major，理解星座的观测方向属性。",
    objective: "在星空参考层中找到 Ursa Major，理解星座是从地球视角形成的图案。",
    status: "locked",
    focusTarget: "earth",
    requiresViewMode: "celestial-sphere",
    requiredLayers: {
      constellations: true,
      ecliptic: true,
      zodiac: true,
    },
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
    id: "asteroid-belt-map",
    target: "asteroid-belt",
    title: "Map the Asteroid Belt",
    description: "观察火星与木星之间的岩石碎片带。",
    objective: "锁定小行星带，观察点云环带与相邻行星轨道关系。",
    status: "locked",
    focusTarget: "asteroid-belt",
    requiredLayers: { asteroidBelt: true },
    suggestedCameraMode: "overview",
  },
  {
    id: "asteroid-belt-ceres",
    target: "asteroid-belt",
    title: "Identify Ceres as a Dwarf Planet",
    description: "在小行星带中定位谷神星这个最大天体。",
    objective: "从小行星带切换到谷神星，理解区域目标和具体天体的区别。",
    status: "locked",
    focusTarget: "ceres",
    requiredLayers: { asteroidBelt: true },
    suggestedCameraMode: "close",
  },
  {
    id: "ceres-visit",
    target: "ceres",
    title: "Visit the Largest Asteroid Belt Object",
    description: "谷神星是小行星带中最清晰的锁定锚点。",
    objective: "锁定谷神星，观察它与小行星带点云的空间关系。",
    status: "locked",
    focusTarget: "ceres",
    requiredLayers: { asteroidBelt: true },
    suggestedCameraMode: "close",
  },
  {
    id: "ceres-bright-deposits",
    target: "ceres",
    title: "Look for Bright Deposits",
    description: "谷神星的亮斑沉积物是理解其表面演化的重要线索。",
    objective: "靠近谷神星，观察表面明暗斑块并记录任务线索。",
    status: "locked",
    focusTarget: "ceres",
    requiredLayers: { asteroidBelt: true },
    suggestedCameraMode: "orbit",
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
    requiredLayers: { moons: true },
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
    requiredLayers: { moons: true },
    suggestedCameraMode: "orbit",
  },
  {
    id: "uranus-tilt",
    target: "uranus",
    title: "Observe the Tilted Ice Giant",
    description: "天王星最独特的特征之一是极端倾斜的自转轴。",
    objective: "锁定天王星，观察倾斜轴视觉和冷色冰巨星外观。",
    status: "locked",
    focusTarget: "uranus",
    suggestedCameraMode: "close",
  },
  {
    id: "uranus-rings",
    target: "uranus",
    title: "Identify Uranus' Faint Rings",
    description: "天王星也拥有非常微弱的环系统。",
    objective: "靠近天王星，观察淡环和行星本体的空间关系。",
    status: "locked",
    focusTarget: "uranus",
    requiredLayers: { moons: true },
    suggestedCameraMode: "orbit",
  },
  {
    id: "uranus-neptune-compare",
    target: "uranus",
    title: "Compare Uranus and Neptune",
    description: "对比两颗冰巨星的颜色、距离和外太阳系位置。",
    objective: "从天王星切换到海王星，比较冰巨星尺度与颜色。",
    status: "locked",
    focusTarget: "neptune",
    suggestedCameraMode: "overview",
  },
  {
    id: "neptune-blue-giant",
    target: "neptune",
    title: "Observe the Deep Blue Ice Giant",
    description: "海王星的深蓝色大气是外太阳系的重要视觉锚点。",
    objective: "锁定海王星，观察深蓝色大气和远日距离感。",
    status: "locked",
    focusTarget: "neptune",
    suggestedCameraMode: "close",
  },
  {
    id: "neptune-triton",
    target: "neptune",
    title: "Locate Triton",
    description: "Triton 是海王星系统最重要的卫星目标。",
    objective: "打开主要卫星层，观察 Triton 与海王星的空间关系。",
    status: "locked",
    focusTarget: "neptune",
    requiredLayers: { moons: true },
    suggestedCameraMode: "orbit",
  },
  {
    id: "neptune-winds",
    target: "neptune",
    title: "Study Extreme Winds",
    description: "海王星大气中存在极端高速风。",
    objective: "靠近海王星，观察风暴斑和大气层视觉线索。",
    status: "locked",
    focusTarget: "neptune",
    suggestedCameraMode: "close",
  },
  {
    id: "pluto-kuiper-world",
    target: "pluto",
    title: "Visit a Kuiper Belt World",
    description: "把冥王星作为柯伊伯带矮行星观察。",
    objective: "锁定冥王星，观察它与柯伊伯带边界的关系。",
    status: "locked",
    focusTarget: "pluto",
    requiredLayers: { kuiperBelt: true },
    suggestedCameraMode: "close",
  },
  {
    id: "pluto-charon-context",
    target: "pluto",
    title: "Observe Pluto and Charon Context",
    description: "冥王星系统适合作为外太阳系矮行星语境目标。",
    objective: "拉远视角，理解冥王星不是传统主要行星，而是柯伊伯带天体。",
    status: "locked",
    focusTarget: "pluto",
    requiredLayers: { kuiperBelt: true },
    suggestedCameraMode: "overview",
  },
  {
    id: "kuiper-belt-map",
    target: "kuiper-belt",
    title: "Map the Outer Icy Frontier",
    description: "观察海王星外侧的冷色冰体带。",
    objective: "锁定柯伊伯带，观察冰体点云如何形成太阳系外侧边界。",
    status: "locked",
    focusTarget: "kuiper-belt",
    requiredLayers: { kuiperBelt: true },
    suggestedCameraMode: "overview",
  },
  {
    id: "kuiper-belt-comets",
    target: "kuiper-belt",
    title: "Understand Short-Period Comet Origins",
    description: "柯伊伯带是许多短周期彗星的重要源区。",
    objective: "在总览视角下观察柯伊伯带与海王星、冥王星的位置关系。",
    status: "locked",
    focusTarget: "kuiper-belt",
    requiredLayers: { kuiperBelt: true },
    suggestedCameraMode: "overview",
  },
];

type MissionCopy = Pick<Mission, "description" | "objective" | "title">;

const MISSION_COPY: Record<string, Record<Language, MissionCopy>> = {
  "sun-corona": {
    en: {
      title: "Observe the Solar Corona",
      description: "Use the Sun as the light-source anchor and inspect its corona against the inner-planet orbits.",
      objective: "Lock the Sun and observe the glowing surface, thin corona, and nearby inner-orbit structure.",
    },
    zh: {
      title: "观察太阳日冕",
      description: "以太阳作为光源锚点，观察日冕与内太阳系轨道关系。",
      objective: "锁定太阳，观察发光主体、薄日冕和内侧行星轨道。",
    },
  },
  "sun-solar-wind": {
    en: {
      title: "Understand Solar Wind",
      description: "Understand how sunlight, particle flow, and gravity shape the solar system environment.",
      objective: "Pull back to overview and read the orbital hierarchy around the Sun.",
    },
    zh: {
      title: "理解太阳风",
      description: "理解太阳如何通过光照、粒子流和引力塑造太阳系环境。",
      objective: "拉远到总览视角，以太阳为中心读取各行星轨道层级。",
    },
  },
  "mercury-inner-world": {
    en: {
      title: "Explore the Innermost Planet",
      description: "Observe Mercury's near-Sun position and cratered terrain.",
      objective: "Lock Mercury and compare its distance from the Sun with the inner orbit scale.",
    },
    zh: {
      title: "探索最内侧行星",
      description: "观察水星近太阳位置和撞击坑地貌。",
      objective: "锁定水星，比较它与太阳之间的距离和内侧轨道尺度。",
    },
  },
  "mercury-day-night": {
    en: {
      title: "Compare Day-Night Extremes",
      description: "Use Mercury as an inner-system sample for extreme temperature contrast.",
      objective: "Move closer to Mercury and observe its rough surface under harsh solar illumination.",
    },
    zh: {
      title: "对比昼夜极端环境",
      description: "用水星作为极端温度变化的内太阳系样本。",
      objective: "靠近水星，观察粗糙表面与强光照方向。",
    },
  },
  "venus-greenhouse-world": {
    en: {
      title: "Study the Greenhouse World",
      description: "Compare Venus and Earth to understand dense atmosphere and greenhouse context.",
      objective: "Lock Venus, inspect its cloud deck, and compare it with Earth's visible character.",
    },
    zh: {
      title: "研究温室世界",
      description: "对比金星和地球，理解厚大气与温室效应。",
      objective: "锁定金星，观察云层外观并与地球视觉差异建立联系。",
    },
  },
  "venus-cloud-deck": {
    en: {
      title: "Observe the Cloud Deck",
      description: "Venus' visible appearance is dominated by its thick cloud layer.",
      objective: "Approach Venus and observe its warm cloud layer in the inner solar system light.",
    },
    zh: {
      title: "观察金星云层",
      description: "金星的可见外观主要由厚云层主导。",
      objective: "靠近金星，观察暖色云层和内太阳系光照环境。",
    },
  },
  "earth-moon-system": {
    en: {
      title: "Observe the Earth-Moon System",
      description: "Mission Control recommends establishing the spatial relationship between Earth and the Moon first.",
      objective: "Lock Earth and observe the Moon orbit line plus Earth-Moon distance scale.",
    },
    zh: {
      title: "观察地月系统",
      description: "任务控制建议先建立地球与月球的空间关系。",
      objective: "锁定地球，观察月球轨道线和地月距离比例。",
    },
  },
  "earth-atmosphere": {
    en: {
      title: "Identify Earth's Atmosphere",
      description: "Use the blue rim glow at Earth's edge to identify the atmospheric boundary.",
      objective: "Approach Earth and observe atmospheric glow plus cloud motion.",
    },
    zh: {
      title: "识别地球大气层",
      description: "通过地球边缘的蓝色辉光判断大气层视觉边界。",
      objective: "靠近地球，观察大气辉光和云层运动。",
    },
  },
  "earth-mars-compare": {
    en: {
      title: "Compare Earth and Mars",
      description: "Build a visual comparison between a living world and a cold desert planet.",
      objective: "Switch from Earth to Mars and compare oceans, atmosphere, and terrain color.",
    },
    zh: {
      title: "对比地球和火星",
      description: "建立宜居星球与冷沙漠星球的视觉差异。",
      objective: "从地球切换到火星，对比海洋、大气和地貌颜色。",
    },
  },
  "earth-locate-ecliptic": {
    en: {
      title: "Locate the Ecliptic Plane",
      description: "Use the celestial reference layer to inspect the relationship between solar system orbits and the ecliptic.",
      objective: "Switch to Celestial Sphere mode and observe how the orbital plane relates to the ecliptic reference.",
    },
    zh: {
      title: "定位黄道面",
      description: "使用天球参考层观察太阳系轨道与黄道面的关系。",
      objective: "切换到天球模式，观察太阳系轨道与黄道面的关系。",
    },
  },
  "earth-identify-orion": {
    en: {
      title: "Identify Orion",
      description: "Locate Orion in the celestial background as a deep-space direction reference.",
      objective: "Find Orion in the celestial layer and observe how it works as a direction marker.",
    },
    zh: {
      title: "识别猎户座",
      description: "在天球背景中定位猎户座，建立深空方向参考。",
      objective: "在天球背景中找到猎户座，并观察它如何作为深空方向参考。",
    },
  },
  "earth-trace-zodiac": {
    en: {
      title: "Trace the Zodiac Path",
      description: "Follow the twelve zodiac markers along the ecliptic band.",
      objective: "Observe the zodiac labels along the ecliptic and understand why planets usually appear near this path.",
    },
    zh: {
      title: "追踪黄道星座路径",
      description: "沿黄道带观察十二个黄道星座标签。",
      objective: "观察黄道带上的星座标签，理解为什么行星通常出现在黄道附近。",
    },
  },
  "earth-find-ursa-major": {
    en: {
      title: "Find Ursa Major",
      description: "Find Ursa Major in the sky reference layer and understand constellation direction patterns.",
      objective: "Locate Ursa Major and recognize that constellations are patterns seen from Earth's perspective.",
    },
    zh: {
      title: "寻找大熊座",
      description: "在星空参考层中找到大熊座，理解星座的观测方向属性。",
      objective: "在星空参考层中找到大熊座，理解星座是从地球视角形成的图案。",
    },
  },
  "moon-maria": {
    en: {
      title: "Find Lunar Maria",
      description: "Lunar maria are among the easiest dark plains to identify on the near side of the Moon.",
      objective: "Approach the Moon and observe its darker maria regions.",
    },
    zh: {
      title: "寻找月海",
      description: "月海是月球正面最容易识别的大型暗色平原。",
      objective: "靠近月球，观察表面暗色月海区域。",
    },
  },
  "moon-tidal-lock": {
    en: {
      title: "Understand Tidal Locking",
      description: "The Moon keeps roughly the same face pointed toward Earth.",
      objective: "Observe the Moon's position relative to Earth and understand synchronous rotation.",
    },
    zh: {
      title: "理解潮汐锁定",
      description: "月球长期以近似同一面朝向地球。",
      objective: "观察月球相对地球的位置，理解同步自转关系。",
    },
  },
  "moon-earth-distance": {
    en: {
      title: "Observe Earth-Moon Distance",
      description: "Use the Earth-Moon system as the first scale reference for deep-space navigation.",
      objective: "Pull back until Earth, the Moon, and the lunar orbit are visible together.",
    },
    zh: {
      title: "观察月球与地球距离",
      description: "用地月系统作为深空导航尺度的第一把尺。",
      objective: "拉远视角，同时看到地球、月球和月球轨道。",
    },
  },
  "mars-olympus": {
    en: {
      title: "Scan Olympus Mons",
      description: "Olympus Mons is key evidence of Mars' volcanic history.",
      objective: "Select the Olympus Mons exploration point and begin elevation scanning.",
    },
    zh: {
      title: "扫描奥林帕斯山",
      description: "奥林帕斯山是火星火山活动历史的关键地貌。",
      objective: "选择奥林帕斯山探索点，启动高程扫描。",
    },
  },
  "mars-valles": {
    en: {
      title: "Explore Valles Marineris",
      description: "Valles Marineris provides clues about crustal extension and ancient Martian environments.",
      objective: "Select the Valles Marineris exploration point and observe the canyon scale.",
    },
    zh: {
      title: "探索水手峡谷",
      description: "水手峡谷提供了火星地壳拉伸和古环境线索。",
      objective: "选择水手峡谷探索点，观察峡谷尺度。",
    },
  },
  "mars-jezero": {
    en: {
      title: "Locate Jezero Crater",
      description: "Jezero Crater is a key region for ancient lake and delta context.",
      objective: "Select Jezero Crater and record possible ancient-water clues.",
    },
    zh: {
      title: "定位杰泽罗陨石坑",
      description: "杰泽罗陨石坑是古湖泊和三角洲研究的核心区域。",
      objective: "选择杰泽罗陨石坑，记录可能的古水环境线索。",
    },
  },
  "mars-polar": {
    en: {
      title: "Observe the Polar Caps",
      description: "Polar ice preserves information about long-term Martian climate change.",
      objective: "Select Polar Caps and observe the visual markers of polar ice.",
    },
    zh: {
      title: "观察火星极冠",
      description: "极冠冰层保存了火星气候长期变化的信息。",
      objective: "选择火星极冠，观察极地冰层视觉标记。",
    },
  },
  "asteroid-belt-map": {
    en: {
      title: "Map the Asteroid Belt",
      description: "Observe the rocky debris field between Mars and Jupiter.",
      objective: "Lock the Asteroid Belt and inspect the particle band against neighboring planetary orbits.",
    },
    zh: {
      title: "测绘小行星带",
      description: "观察火星与木星之间的岩石碎片带。",
      objective: "锁定小行星带，观察点云环带与相邻行星轨道关系。",
    },
  },
  "asteroid-belt-ceres": {
    en: {
      title: "Identify Ceres as a Dwarf Planet",
      description: "Locate Ceres as the largest body embedded in the asteroid belt.",
      objective: "Switch from the belt to Ceres and understand the difference between a region target and a concrete body.",
    },
    zh: {
      title: "识别谷神星矮行星身份",
      description: "在小行星带中定位谷神星这个最大天体。",
      objective: "从小行星带切换到谷神星，理解区域目标和具体天体的区别。",
    },
  },
  "ceres-visit": {
    en: {
      title: "Visit the Largest Asteroid Belt Object",
      description: "Ceres is the clearest lock target inside the asteroid belt.",
      objective: "Lock Ceres and observe its spatial relationship to the surrounding belt particles.",
    },
    zh: {
      title: "拜访小行星带最大天体",
      description: "谷神星是小行星带中最清晰的锁定锚点。",
      objective: "锁定谷神星，观察它与小行星带点云的空间关系。",
    },
  },
  "ceres-bright-deposits": {
    en: {
      title: "Look for Bright Deposits",
      description: "Ceres' bright deposits are useful clues for understanding surface evolution.",
      objective: "Approach Ceres and record bright and dark surface patterns.",
    },
    zh: {
      title: "寻找亮斑沉积物",
      description: "谷神星的亮斑沉积物是理解其表面演化的重要线索。",
      objective: "靠近谷神星，观察表面明暗斑块并记录任务线索。",
    },
  },
  "jupiter-bands": {
    en: {
      title: "Observe Jupiter's Cloud Bands",
      description: "Jupiter's cloud bands reveal high-speed atmospheric circulation on a gas giant.",
      objective: "Approach Jupiter and observe banded texture plus planetary scale.",
    },
    zh: {
      title: "观察木星云带",
      description: "木星云带体现了气态巨行星高速大气环流。",
      objective: "靠近木星，观察条带纹理与行星尺度。",
    },
  },
  "jupiter-red-spot": {
    en: {
      title: "Look for Great Red Spot Clues",
      description: "Use cloud-band disturbance to identify clues of large storm systems.",
      objective: "Keep Jupiter locked and scan high-contrast storm regions in the clouds.",
    },
    zh: {
      title: "寻找大红斑线索",
      description: "通过云带扰动寻找大型风暴系统的视觉线索。",
      objective: "保持木星锁定，扫描云层中的高对比风暴区域。",
    },
  },
  "jupiter-scale": {
    en: {
      title: "Understand Gas Giant Scale",
      description: "Compare Jupiter with inner rocky planets to build a sense of scale.",
      objective: "Pull back and compare Jupiter with Earth and Mars.",
    },
    zh: {
      title: "理解气态巨行星尺度",
      description: "用木星和内太阳系行星对比，建立尺度感。",
      objective: "拉远视角，比较木星与地球、火星的大小差异。",
    },
  },
  "saturn-rings": {
    en: {
      title: "Scan Saturn's Rings",
      description: "Saturn's rings are the most recognizable ring system in the solar system.",
      objective: "Approach Saturn and observe the ring plane, transparency, and planet relationship.",
    },
    zh: {
      title: "扫描土星环",
      description: "土星环是太阳系最具辨识度的环系统。",
      objective: "靠近土星，观察环平面、透明度和行星本体关系。",
    },
  },
  "saturn-jupiter-scale": {
    en: {
      title: "Compare Saturn and Jupiter Scale",
      description: "Compare the size, color, and visible structure of two gas giants.",
      objective: "Switch between Saturn and Jupiter to compare planetary scale and ring systems.",
    },
    zh: {
      title: "观察土星与木星尺度差异",
      description: "比较两颗气态巨行星的尺寸、颜色和外观结构。",
      objective: "在土星和木星之间切换，比较行星尺度与环系统差异。",
    },
  },
  "saturn-icy-moons": {
    en: {
      title: "Understand Titan and Icy Moons",
      description: "Saturn's moon system is an important science target in the outer solar system.",
      objective: "Focus the Saturn system and record the mission value of Titan and icy moons.",
    },
    zh: {
      title: "了解泰坦与冰质卫星",
      description: "土星卫星系统是外太阳系探索的重要科学目标。",
      objective: "聚焦土星系统，记录泰坦与冰质卫星的任务价值。",
    },
  },
  "uranus-tilt": {
    en: {
      title: "Observe the Tilted Ice Giant",
      description: "One of Uranus' most distinctive features is its extreme axial tilt.",
      objective: "Lock Uranus and observe the tilted-axis presentation plus cold ice-giant appearance.",
    },
    zh: {
      title: "观察倾斜冰巨星",
      description: "天王星最独特的特征之一是极端倾斜的自转轴。",
      objective: "锁定天王星，观察倾斜轴视觉和冷色冰巨星外观。",
    },
  },
  "uranus-rings": {
    en: {
      title: "Identify Uranus' Faint Rings",
      description: "Uranus also has a very faint ring system.",
      objective: "Approach Uranus and observe the spatial relationship between its faint rings and planet body.",
    },
    zh: {
      title: "识别天王星微弱环",
      description: "天王星也拥有非常微弱的环系统。",
      objective: "靠近天王星，观察淡环和行星本体的空间关系。",
    },
  },
  "uranus-neptune-compare": {
    en: {
      title: "Compare Uranus and Neptune",
      description: "Compare the colors, distances, and outer-system positions of the two ice giants.",
      objective: "Switch from Uranus to Neptune and compare ice-giant scale and color.",
    },
    zh: {
      title: "对比天王星和海王星",
      description: "对比两颗冰巨星的颜色、距离和外太阳系位置。",
      objective: "从天王星切换到海王星，比较冰巨星尺度与颜色。",
    },
  },
  "neptune-blue-giant": {
    en: {
      title: "Observe the Deep Blue Ice Giant",
      description: "Neptune's deep blue atmosphere is an important visual anchor for the outer solar system.",
      objective: "Lock Neptune and observe its deep blue atmosphere and far-Sun context.",
    },
    zh: {
      title: "观察深蓝冰巨星",
      description: "海王星的深蓝色大气是外太阳系的重要视觉锚点。",
      objective: "锁定海王星，观察深蓝色大气和远日距离感。",
    },
  },
  "neptune-triton": {
    en: {
      title: "Locate Triton",
      description: "Triton is the most important moon target in the Neptune system.",
      objective: "Enable the major moons layer and observe Triton's spatial relationship to Neptune.",
    },
    zh: {
      title: "定位海卫一",
      description: "海卫一是海王星系统最重要的卫星目标。",
      objective: "打开主要卫星层，观察海卫一与海王星的空间关系。",
    },
  },
  "neptune-winds": {
    en: {
      title: "Study Extreme Winds",
      description: "Neptune's atmosphere hosts extremely fast winds.",
      objective: "Approach Neptune and observe storm patches plus atmospheric visual clues.",
    },
    zh: {
      title: "研究极端强风",
      description: "海王星大气中存在极端高速风。",
      objective: "靠近海王星，观察风暴斑和大气层视觉线索。",
    },
  },
  "pluto-kuiper-world": {
    en: {
      title: "Visit a Kuiper Belt World",
      description: "Treat Pluto as a dwarf planet in the Kuiper Belt context.",
      objective: "Lock Pluto and observe its relationship to the Kuiper Belt boundary.",
    },
    zh: {
      title: "拜访柯伊伯带世界",
      description: "把冥王星作为柯伊伯带矮行星观察。",
      objective: "锁定冥王星，观察它与柯伊伯带边界的关系。",
    },
  },
  "pluto-charon-context": {
    en: {
      title: "Observe Pluto and Charon Context",
      description: "The Pluto system is useful as an outer-system dwarf-planet context target.",
      objective: "Pull back and understand Pluto as a Kuiper Belt body rather than a classical major planet.",
    },
    zh: {
      title: "观察冥王星与卡戎语境",
      description: "冥王星系统适合作为外太阳系矮行星语境目标。",
      objective: "拉远视角，理解冥王星不是传统主要行星，而是柯伊伯带天体。",
    },
  },
  "kuiper-belt-map": {
    en: {
      title: "Map the Outer Icy Frontier",
      description: "Observe the cold icy body band beyond Neptune.",
      objective: "Lock the Kuiper Belt and observe how the icy particle cloud forms the outer solar system boundary.",
    },
    zh: {
      title: "测绘外侧冰体边疆",
      description: "观察海王星外侧的冷色冰体带。",
      objective: "锁定柯伊伯带，观察冰体点云如何形成太阳系外侧边界。",
    },
  },
  "kuiper-belt-comets": {
    en: {
      title: "Understand Short-Period Comet Origins",
      description: "The Kuiper Belt is an important source region for many short-period comets.",
      objective: "From overview, observe the relationship between the Kuiper Belt, Neptune, and Pluto.",
    },
    zh: {
      title: "理解短周期彗星来源",
      description: "柯伊伯带是许多短周期彗星的重要源区。",
      objective: "在总览视角下观察柯伊伯带与海王星、冥王星的位置关系。",
    },
  },
};

export function getMissionCopy(mission: Mission, language: Language): MissionCopy {
  return MISSION_COPY[mission.id]?.[language] ?? mission;
}

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

export function getMissionSteps(
  mission: Mission,
  language: Language = "zh",
): MissionStep[] {
  if (mission.steps) return mission.steps;

  const focusTarget = mission.focusTarget ?? mission.target;
  const isCelestialMission = mission.category === "celestial";
  const missionCopy = getMissionCopy(mission, language);
  const zh = language === "zh";

  return [
    {
      id: `${mission.id}-step-1`,
      title: isCelestialMission
        ? zh
          ? "进入天球参考模式"
          : "Enter Celestial Reference Mode"
        : zh
          ? "锁定任务目标"
          : "Lock Mission Target",
      instruction: isCelestialMission
        ? zh
          ? "本任务使用天球参考层。星座是观测方向上的图案，不是可以像行星一样飞抵的地点。"
          : "This mission uses the celestial reference layer. Constellations are direction patterns, not destinations you can fly to like planets."
        : zh
          ? `建立“${missionCopy.title}”的导航锁定，并确认当前目标进入视野中心。`
          : `Establish navigation lock for “${missionCopy.title}” and confirm the target is centered in view.`,
      actionLabel: isCelestialMission
        ? zh
          ? "进入天球模式"
          : "Enter Celestial Mode"
        : zh
          ? "锁定目标"
          : "Lock Target",
      cameraCommand: isCelestialMission ? "overview" : "focus",
      target: focusTarget,
      viewMode: mission.requiresViewMode,
      requiredLayers: mission.requiredLayers,
    },
    {
      id: `${mission.id}-step-2`,
      title: isCelestialMission
        ? zh
          ? "观察参考层关系"
          : "Inspect Reference Layers"
        : zh
          ? "执行近距观察"
          : "Run Close Observation",
      instruction: isCelestialMission
        ? missionCopy.objective
        : mission.explorationPoint
          ? zh
            ? "切入指定探索点，观察目标区域的地貌特征和空间关系。"
            : "Move into the selected exploration point and inspect its terrain features and spatial context."
          : zh
            ? "切近当前目标，观察任务要求中的主要视觉线索。"
            : "Move close to the current target and inspect the main visual clues required by the mission.",
      actionLabel: isCelestialMission
        ? zh
          ? "观察天球层"
          : "Inspect Sky Layer"
        : zh
          ? "切入观察"
          : "Close Observation",
      cameraCommand:
        mission.suggestedCameraMode === "overview" ? "overview" : "close",
      target: focusTarget,
      explorationPoint: mission.explorationPoint,
      viewMode: mission.requiresViewMode,
      requiredLayers: mission.requiredLayers,
    },
    {
      id: `${mission.id}-step-3`,
      title: zh ? "记录任务结论" : "Record Mission Notes",
      instruction: isCelestialMission
        ? zh
          ? "记录本次天球参考观察：星座用于方向识别，黄道面用于连接太阳系轨道和夜空背景。"
          : "Record this celestial reference observation: constellations identify directions, while the ecliptic connects solar system orbits with the night-sky background."
        : zh
          ? "确认已完成观察，将本次探索写入航行日志。"
          : "Confirm the observation is complete and write this exploration into the Captain's Log.",
      actionLabel: zh ? "完成任务" : "Complete Mission",
      cameraCommand: "focus",
      target: focusTarget,
      viewMode: mission.requiresViewMode,
      requiredLayers: mission.requiredLayers,
    },
  ];
}
