import type {
  ArchiveDiscoveryCard,
  ArchiveMission,
  ArchiveMissionCategory,
  ArchiveMissionId,
  Language,
  MissionWaypoint,
  SpaceTarget,
} from "@/app/types/space";

const ROUTE_DISCLAIMER =
  "Mission routes are simplified educational visualizations, not precise flight dynamics.";
const ROUTE_DISCLAIMER_ZH =
  "任务路线是简化教育可视化，不代表精确飞行动力学或真实轨道。";

export const ARCHIVE_CATEGORY_LABELS: Record<
  ArchiveMissionCategory | "all",
  { en: string; zh: string }
> = {
  all: { en: "All", zh: "全部" },
  asteroids: { en: "Asteroids", zh: "小天体" },
  future: { en: "Future / Concepts", zh: "未来 / 概念" },
  "giant-planets": { en: "Giant Planets", zh: "巨行星" },
  "inner-solar-system": { en: "Inner Solar System", zh: "内太阳系" },
  mars: { en: "Mars", zh: "火星" },
  "outer-solar-system": { en: "Outer Solar System", zh: "外太阳系" },
};

export const ARCHIVE_MISSIONS: ArchiveMission[] = [
  {
    agencyLabel: "NASA / JPL profile",
    category: "outer-solar-system",
    disclaimer: ROUTE_DISCLAIMER,
    id: "voyager-1",
    keyDiscoveries: [
      "Giant planet flyby perspective",
      "Outer solar system scale",
      "Interstellar trajectory context",
    ],
    longDescription:
      "Voyager 1 is represented here as a simplified educational route from Earth through the giant planet region and toward the outer frontier. The profile emphasizes scale, flyby sequencing, and how a spacecraft can use planetary encounters to build an exploration archive.",
    name: "Voyager 1",
    primaryTargets: ["jupiter", "saturn", "kuiper-belt"],
    relatedTourIds: ["grand-tour", "outer-frontier"],
    shortDescription:
      "A historic outer solar system route profile through Jupiter, Saturn, and the deep frontier.",
    statusLabel: "Historic Mission Profile",
    subtitle: "Outer frontier trajectory archive",
    waypoints: [
      waypoint("voyager-1-earth", "earth", "Earth Departure", "Launch context and inner solar system departure.", "overview"),
      waypoint("voyager-1-jupiter", "jupiter", "Jupiter Flyby", "Giant planet flyby perspective and moon-system context.", "focus", { moons: true }),
      waypoint("voyager-1-saturn", "saturn", "Saturn Flyby", "Ringed planet encounter and outer planet transition.", "focus", { moons: true }),
      waypoint("voyager-1-kuiper", "kuiper-belt", "Outer Frontier", "Use the Kuiper Belt layer as a scale reference for the route leaving the planetary region.", "overview", { kuiperBelt: true }),
    ],
  },
  {
    agencyLabel: "NASA / JPL profile",
    category: "outer-solar-system",
    disclaimer: ROUTE_DISCLAIMER,
    id: "voyager-2",
    keyDiscoveries: [
      "Only spacecraft profile in this app to connect all four giant planets",
      "Ice giant flyby context",
      "Outer planet comparison",
    ],
    longDescription:
      "Voyager 2 is modeled as the complete giant-planet archive route. This simplified path links Jupiter, Saturn, Uranus, and Neptune to help compare gas giants, ice giants, rings, and moon systems.",
    name: "Voyager 2",
    primaryTargets: ["jupiter", "saturn", "uranus", "neptune"],
    relatedTourIds: ["grand-tour", "giant-planets", "outer-frontier"],
    shortDescription:
      "A giant-planet expedition profile connecting all four outer planets.",
    statusLabel: "Historic Mission Profile",
    subtitle: "The four-giant-planet route",
    waypoints: [
      waypoint("voyager-2-earth", "earth", "Earth Departure", "Launch reference and route origin.", "overview"),
      waypoint("voyager-2-jupiter", "jupiter", "Jupiter Encounter", "First giant planet comparison point.", "focus", { moons: true }),
      waypoint("voyager-2-saturn", "saturn", "Saturn Encounter", "Ring system and icy moon context.", "focus", { moons: true }),
      waypoint("voyager-2-uranus", "uranus", "Uranus Flyby", "Tilted ice giant and faint ring context.", "focus", { moons: true }),
      waypoint("voyager-2-neptune", "neptune", "Neptune Flyby", "Deep blue ice giant and Triton context.", "focus", { moons: true }),
    ],
  },
  {
    agencyLabel: "NASA / ESA / ASI profile",
    category: "giant-planets",
    disclaimer: ROUTE_DISCLAIMER,
    id: "cassini",
    keyDiscoveries: [
      "Saturn ring system",
      "Titan atmosphere context",
      "Enceladus icy moon context",
    ],
    longDescription:
      "Cassini is presented as a Saturn system archive. The route uses Earth, Jupiter, and Saturn waypoints to frame the long cruise and the science focus on rings, Titan, and icy moons.",
    name: "Cassini",
    primaryTargets: ["saturn"],
    relatedTourIds: ["grand-tour", "giant-planets"],
    shortDescription:
      "A Saturn system expedition profile focused on rings and icy moons.",
    statusLabel: "Historic Mission Profile",
    subtitle: "Saturn system archive",
    waypoints: [
      waypoint("cassini-earth", "earth", "Earth Departure", "Inner solar system departure context.", "overview"),
      waypoint("cassini-jupiter", "jupiter", "Jupiter Assist Context", "Use Jupiter as a cruise-scale reference point.", "overview", { moons: true }),
      waypoint("cassini-saturn", "saturn", "Saturn System", "Rings, Titan, and Enceladus become the primary archive focus.", "close", { moons: true }),
    ],
  },
  {
    agencyLabel: "NASA / JPL profile",
    category: "giant-planets",
    disclaimer: ROUTE_DISCLAIMER,
    id: "juno",
    keyDiscoveries: [
      "Jupiter cloud bands",
      "Magnetic environment",
      "Giant planet interior questions",
    ],
    longDescription:
      "Juno is modeled as a Jupiter-focused mission profile. The archive route moves from Earth to Jupiter and emphasizes clouds, magnetic environment, and interior questions.",
    name: "Juno",
    primaryTargets: ["jupiter"],
    relatedTourIds: ["grand-tour", "giant-planets"],
    shortDescription: "A Jupiter-focused route profile for clouds and magnetosphere context.",
    statusLabel: "Mission Profile",
    subtitle: "Jupiter polar science archive",
    waypoints: [
      waypoint("juno-earth", "earth", "Earth Departure", "Departure and cruise reference.", "overview"),
      waypoint("juno-jupiter", "jupiter", "Jupiter Orbit Context", "Cloud bands, scale, and moon-system environment.", "close", { moons: true }),
    ],
  },
  {
    agencyLabel: "NASA / JHUAPL / SwRI profile",
    category: "outer-solar-system",
    disclaimer: ROUTE_DISCLAIMER,
    id: "new-horizons",
    keyDiscoveries: [
      "Pluto as a complex dwarf planet",
      "Kuiper Belt frontier",
      "Outer solar system scale",
    ],
    longDescription:
      "New Horizons is represented as a fast outer-system profile from Earth to Jupiter, Pluto, and the Kuiper Belt frontier. The simplified route highlights Pluto as a complex dwarf world rather than a classical major planet.",
    name: "New Horizons",
    primaryTargets: ["jupiter", "pluto", "kuiper-belt"],
    relatedTourIds: ["grand-tour", "outer-frontier"],
    shortDescription:
      "A Pluto and Kuiper Belt route profile for the outer frontier.",
    statusLabel: "Historic Mission Profile",
    subtitle: "Pluto and Kuiper Belt archive",
    waypoints: [
      waypoint("new-horizons-earth", "earth", "Earth Departure", "Launch reference and rapid outbound trajectory context.", "overview"),
      waypoint("new-horizons-jupiter", "jupiter", "Jupiter Flyby", "Scale-building waypoint before the far outer system.", "overview", { moons: true }),
      waypoint("new-horizons-pluto", "pluto", "Pluto Encounter", "Complex dwarf planet and Charon context.", "close", { kuiperBelt: true }),
      waypoint("new-horizons-kuiper", "kuiper-belt", "Kuiper Belt Frontier", "Outer icy body region and frontier perspective.", "overview", { kuiperBelt: true }),
    ],
  },
  {
    agencyLabel: "NASA profile",
    category: "inner-solar-system",
    disclaimer: ROUTE_DISCLAIMER,
    id: "parker-solar-probe",
    keyDiscoveries: ["Solar corona", "Solar wind", "Inner solar system gravity assists"],
    longDescription:
      "Parker Solar Probe is represented as an inner solar system profile using Earth, Venus, and the Sun. The route emphasizes the solar corona and how close solar missions use inner-planet geometry.",
    name: "Parker Solar Probe",
    primaryTargets: ["sun"],
    relatedTourIds: ["grand-tour", "inner-worlds"],
    shortDescription:
      "A solar corona expedition profile through the inner solar system.",
    statusLabel: "Mission Profile",
    subtitle: "Solar corona archive",
    waypoints: [
      waypoint("parker-earth", "earth", "Earth Departure", "Inner solar system route origin.", "overview"),
      waypoint("parker-venus", "venus", "Venus Geometry", "Venus acts as the inner-system reference for the solar approach.", "overview"),
      waypoint("parker-sun", "sun", "Solar Corona", "Focus the Sun and inspect the corona visual layer.", "close"),
    ],
  },
  {
    agencyLabel: "NASA / JPL profile",
    category: "mars",
    disclaimer: ROUTE_DISCLAIMER,
    id: "perseverance",
    keyDiscoveries: [
      "Jezero Crater",
      "Ancient lake delta context",
      "Mars sample caching context",
    ],
    longDescription:
      "Perseverance is represented as a Mars surface exploration archive focused on Jezero Crater and ancient environment context. This route is a simplified Earth-to-Mars profile, not a landing trajectory.",
    name: "Perseverance",
    primaryTargets: ["mars"],
    relatedTourIds: ["grand-tour", "inner-worlds"],
    shortDescription:
      "A Mars exploration profile centered on Jezero Crater and ancient water clues.",
    statusLabel: "Mission Profile",
    subtitle: "Mars Jezero archive",
    waypoints: [
      waypoint("perseverance-earth", "earth", "Earth Departure", "Mars transfer origin reference.", "overview"),
      waypoint("perseverance-mars", "mars", "Jezero Context", "Mars terrain and Jezero Crater exploration context.", "close", { labels: true }),
    ],
  },
  {
    agencyLabel: "CNSA profile",
    category: "mars",
    disclaimer: ROUTE_DISCLAIMER,
    id: "tianwen-1",
    keyDiscoveries: [
      "Mars orbiter / lander / rover profile",
      "Mars surface exploration context",
      "Independent Mars mission perspective",
    ],
    longDescription:
      "Tianwen-1 is represented as a Mars mission profile that combines orbital and surface exploration context. The route keeps the focus on Mars as a multi-layer exploration target.",
    name: "Tianwen-1",
    primaryTargets: ["mars"],
    relatedTourIds: ["grand-tour", "inner-worlds"],
    shortDescription: "A Mars profile connecting orbital and surface exploration context.",
    statusLabel: "Mission Profile",
    subtitle: "Mars orbiter / lander / rover archive",
    waypoints: [
      waypoint("tianwen-earth", "earth", "Earth Departure", "Mars route origin reference.", "overview"),
      waypoint("tianwen-mars", "mars", "Mars System", "Orbital and surface exploration context around Mars.", "close"),
    ],
  },
  {
    agencyLabel: "NASA / JPL profile",
    category: "giant-planets",
    disclaimer: ROUTE_DISCLAIMER,
    id: "galileo",
    keyDiscoveries: ["Jupiter system", "Galilean moons", "Europa / Io context"],
    longDescription:
      "Galileo is represented as a Jupiter system archive with inner solar system flyby context. The route highlights Jupiter and the Galilean moons as a compact system of worlds.",
    name: "Galileo",
    primaryTargets: ["jupiter"],
    relatedTourIds: ["grand-tour", "giant-planets"],
    shortDescription:
      "A Jupiter system archive for Galilean moons and giant planet science.",
    statusLabel: "Historic Mission Profile",
    subtitle: "Jupiter system archive",
    waypoints: [
      waypoint("galileo-earth-1", "earth", "Earth Departure", "Launch and inner-system route origin.", "overview"),
      waypoint("galileo-venus", "venus", "Venus Flyby Context", "Inner solar system geometry reference.", "overview"),
      waypoint("galileo-earth-2", "earth", "Earth Return Context", "Gravity-assist route context, simplified for education.", "overview"),
      waypoint("galileo-jupiter", "jupiter", "Jupiter System", "Galilean moon and giant planet environment.", "close", { moons: true }),
    ],
  },
  {
    agencyLabel: "NASA / JPL profile",
    category: "asteroids",
    disclaimer: ROUTE_DISCLAIMER,
    id: "dawn",
    keyDiscoveries: [
      "Protoplanet / dwarf planet context",
      "Asteroid belt diversity",
      "Ceres bright deposits context",
    ],
    longDescription:
      "Dawn is modeled as an asteroid belt archive that moves from Earth into the rocky debris field and then to Ceres. The route emphasizes diversity inside the belt rather than a single planet-like destination.",
    name: "Dawn",
    primaryTargets: ["asteroid-belt", "ceres"],
    relatedTourIds: ["grand-tour", "outer-frontier"],
    shortDescription: "An asteroid belt and Ceres profile for small-world science.",
    statusLabel: "Historic Mission Profile",
    subtitle: "Asteroid belt archive",
    waypoints: [
      waypoint("dawn-earth", "earth", "Earth Departure", "Small-body route origin.", "overview"),
      waypoint("dawn-belt", "asteroid-belt", "Asteroid Belt", "Rocky debris field and minor planet context.", "overview", { asteroidBelt: true }),
      waypoint("dawn-ceres", "ceres", "Ceres", "Largest asteroid belt object and dwarf planet anchor.", "close", { asteroidBelt: true }),
    ],
  },
  {
    agencyLabel: "NASA profile",
    category: "future",
    disclaimer: ROUTE_DISCLAIMER,
    id: "europa-clipper",
    keyDiscoveries: [
      "Europa ocean world context",
      "Habitability questions",
      "Icy moon reconnaissance",
    ],
    longDescription:
      "Europa Clipper is represented as a future-facing mission profile focused on the Jupiter system and Europa context. This app uses a simplified route to frame icy moon reconnaissance and habitability questions.",
    name: "Europa Clipper",
    primaryTargets: ["jupiter"],
    relatedTourIds: ["grand-tour", "giant-planets"],
    shortDescription:
      "A Jupiter icy-moon reconnaissance profile focused on Europa context.",
    statusLabel: "Mission Concept Profile",
    subtitle: "Europa ocean-world archive",
    waypoints: [
      waypoint("europa-clipper-earth", "earth", "Earth Departure", "Route origin for a Jupiter system expedition.", "overview"),
      waypoint("europa-clipper-jupiter", "jupiter", "Jupiter System", "Europa context within the Galilean moon system.", "close", { moons: true }),
    ],
  },
];

export const DISCOVERY_CARDS: ArchiveDiscoveryCard[] = [
  discovery("voyager-1-scale", "voyager-1", "Outer Scale", "A flyby route turns the giant planets into distance markers for deep-space context.", "saturn"),
  discovery("voyager-2-ice", "voyager-2", "Ice Giant Contrast", "Uranus and Neptune become comparable worlds inside one archive route.", "uranus"),
  discovery("cassini-rings", "cassini", "Ring System Archive", "Saturn's rings are treated as a structured system, not a decorative halo.", "saturn"),
  discovery("juno-clouds", "juno", "Cloud Band Questions", "Jupiter's visible bands act as the entry point into deeper interior questions.", "jupiter"),
  discovery("new-horizons-pluto", "new-horizons", "Complex Pluto", "Pluto is shown as a detailed dwarf world embedded in the outer frontier.", "pluto"),
  discovery("parker-corona", "parker-solar-probe", "Corona Context", "The solar corona becomes the mission's primary environment.", "sun"),
  discovery("perseverance-jezero", "perseverance", "Jezero Context", "A crater becomes a record of ancient water and exploration planning.", "mars"),
  discovery("tianwen-mars", "tianwen-1", "Mars System Profile", "Mars exploration can combine orbital and surface perspectives.", "mars"),
  discovery("galileo-moons", "galileo", "Galilean Worlds", "The Jupiter system reads like a compact set of worlds around one giant planet.", "jupiter"),
  discovery("dawn-ceres", "dawn", "Belt Diversity", "Ceres anchors the asteroid belt as a region with dwarf-world complexity.", "ceres"),
  discovery("europa-clipper-ocean", "europa-clipper", "Ocean World Questions", "Europa is framed as an icy moon with habitability questions.", "jupiter"),
];

type ArchiveMissionCopy = Pick<
  ArchiveMission,
  | "agencyLabel"
  | "disclaimer"
  | "keyDiscoveries"
  | "longDescription"
  | "shortDescription"
  | "statusLabel"
  | "subtitle"
>;
type WaypointCopy = Pick<MissionWaypoint, "description" | "label">;
type DiscoveryCopy = Pick<ArchiveDiscoveryCard, "body" | "title">;

const ARCHIVE_MISSION_ZH: Record<ArchiveMissionId, ArchiveMissionCopy> = {
  "voyager-1": {
    agencyLabel: "NASA / JPL 档案",
    keyDiscoveries: ["巨行星飞掠视角", "外太阳系尺度", "星际轨迹语境"],
    longDescription:
      "在寰宇星舟中，Voyager 1 被表现为从地球出发、穿过巨行星区域并指向外侧边疆的简化教育路线。该档案强调尺度、飞掠顺序，以及探测器如何通过行星遭遇建立深空探索记录。",
    shortDescription: "穿过木星、土星并指向深空边疆的历史外太阳系路线档案。",
    statusLabel: "历史任务档案",
    subtitle: "外侧边疆航迹档案",
  },
  "voyager-2": {
    agencyLabel: "NASA / JPL 档案",
    keyDiscoveries: ["本应用中唯一连接四大巨行星的探测器路线", "冰巨星飞掠语境", "外行星对比"],
    longDescription:
      "Voyager 2 在这里被建模为完整的巨行星档案路线。这条简化路径连接木星、土星、天王星和海王星，帮助比较气态巨行星、冰巨星、环系统和卫星系统。",
    shortDescription: "连接四颗外侧巨行星的巨行星远征档案。",
    statusLabel: "历史任务档案",
    subtitle: "四大巨行星路线",
  },
  cassini: {
    agencyLabel: "NASA / ESA / ASI 档案",
    keyDiscoveries: ["土星环系统", "泰坦大气语境", "土卫二冰质卫星语境"],
    longDescription:
      "Cassini 被呈现为土星系统档案。路线使用地球、木星和土星航点来构建漫长巡航背景，并聚焦土星环、泰坦和冰质卫星的科学主题。",
    shortDescription: "聚焦土星环和冰质卫星的土星系统远征档案。",
    statusLabel: "历史任务档案",
    subtitle: "土星系统档案",
  },
  juno: {
    agencyLabel: "NASA / JPL 档案",
    keyDiscoveries: ["木星云带", "磁场环境", "巨行星内部结构问题"],
    longDescription:
      "Juno 被建模为聚焦木星的任务档案。路线从地球移动到木星，并强调云层、磁场环境和木星内部结构问题。",
    shortDescription: "用于观察木星云层和磁层语境的木星任务路线。",
    statusLabel: "任务档案",
    subtitle: "木星极区科学档案",
  },
  "new-horizons": {
    agencyLabel: "NASA / JHUAPL / SwRI 档案",
    keyDiscoveries: ["冥王星作为复杂矮行星", "柯伊伯带边疆", "外太阳系尺度"],
    longDescription:
      "New Horizons 被表现为快速外太阳系档案路线，从地球经木星抵达冥王星和柯伊伯带边疆。这条简化路线强调冥王星是复杂矮行星，而不是传统主要行星。",
    shortDescription: "面向冥王星和柯伊伯带边疆的外太阳系路线档案。",
    statusLabel: "历史任务档案",
    subtitle: "冥王星与柯伊伯带档案",
  },
  "parker-solar-probe": {
    agencyLabel: "NASA 档案",
    keyDiscoveries: ["太阳日冕", "太阳风", "内太阳系引力辅助"],
    longDescription:
      "Parker Solar Probe 被表现为以内太阳系为主的任务档案，使用地球、金星和太阳构成路线。该档案强调太阳日冕，以及近太阳任务如何利用内侧行星几何关系。",
    shortDescription: "穿过内太阳系并聚焦太阳日冕的任务档案。",
    statusLabel: "任务档案",
    subtitle: "太阳日冕档案",
  },
  perseverance: {
    agencyLabel: "NASA / JPL 档案",
    keyDiscoveries: ["杰泽罗陨石坑", "古湖泊三角洲语境", "火星样本缓存语境"],
    longDescription:
      "Perseverance 被表现为聚焦杰泽罗陨石坑和古环境语境的火星表面探索档案。这是一条简化的地球到火星路线，不代表真实着陆轨迹。",
    shortDescription: "围绕杰泽罗陨石坑和古水环境线索的火星探索档案。",
    statusLabel: "任务档案",
    subtitle: "火星杰泽罗档案",
  },
  "tianwen-1": {
    agencyLabel: "CNSA 档案",
    keyDiscoveries: ["火星环绕器 / 着陆器 / 巡视器组合", "火星表面探索语境", "独立火星任务视角"],
    longDescription:
      "天问一号被表现为结合火星轨道和表面探索语境的任务档案。路线保持聚焦火星这一多层次探索目标。",
    shortDescription: "连接火星轨道与表面探索语境的火星任务档案。",
    statusLabel: "任务档案",
    subtitle: "火星环绕 / 着陆 / 巡视档案",
  },
  galileo: {
    agencyLabel: "NASA / JPL 档案",
    keyDiscoveries: ["木星系统", "伽利略卫星", "欧罗巴 / 伊奥语境"],
    longDescription:
      "Galileo 被表现为带有内太阳系飞掠语境的木星系统档案。路线强调木星和伽利略卫星组成的一组紧凑世界。",
    shortDescription: "面向伽利略卫星和巨行星科学的木星系统档案。",
    statusLabel: "历史任务档案",
    subtitle: "木星系统档案",
  },
  dawn: {
    agencyLabel: "NASA / JPL 档案",
    keyDiscoveries: ["原行星 / 矮行星语境", "小行星带多样性", "谷神星亮斑沉积物语境"],
    longDescription:
      "Dawn 被建模为小行星带档案路线，从地球进入岩石碎片带并抵达谷神星。该路线强调小行星带内部的多样性，而不是单一行星式目的地。",
    shortDescription: "面向小天体科学的小行星带与谷神星档案。",
    statusLabel: "历史任务档案",
    subtitle: "小行星带档案",
  },
  "europa-clipper": {
    agencyLabel: "NASA 档案",
    keyDiscoveries: ["欧罗巴海洋世界语境", "宜居性问题", "冰质卫星侦察"],
    longDescription:
      "Europa Clipper 被表现为面向未来的任务档案，聚焦木星系统和欧罗巴语境。本应用使用简化路线来组织冰质卫星侦察和宜居性问题。",
    shortDescription: "聚焦欧罗巴语境的木星冰质卫星侦察档案。",
    statusLabel: "任务概念档案",
    subtitle: "欧罗巴海洋世界档案",
  },
};

const WAYPOINT_ZH: Record<string, WaypointCopy> = {
  "voyager-1-earth": { label: "地球出发", description: "发射语境和离开内太阳系的起点。" },
  "voyager-1-jupiter": { label: "木星飞掠", description: "巨行星飞掠视角和卫星系统语境。" },
  "voyager-1-saturn": { label: "土星飞掠", description: "环系行星遭遇和外行星过渡。" },
  "voyager-1-kuiper": { label: "外侧边疆", description: "使用柯伊伯带图层作为离开行星区域的尺度参考。" },
  "voyager-2-earth": { label: "地球出发", description: "发射参考和路线起点。" },
  "voyager-2-jupiter": { label: "木星遭遇", description: "第一处巨行星对比航点。" },
  "voyager-2-saturn": { label: "土星遭遇", description: "环系统和冰质卫星语境。" },
  "voyager-2-uranus": { label: "天王星飞掠", description: "倾斜冰巨星和微弱环系统语境。" },
  "voyager-2-neptune": { label: "海王星飞掠", description: "深蓝冰巨星和海卫一语境。" },
  "cassini-earth": { label: "地球出发", description: "离开内太阳系的起点语境。" },
  "cassini-jupiter": { label: "木星辅助语境", description: "使用木星作为巡航尺度参考。" },
  "cassini-saturn": { label: "土星系统", description: "土星环、泰坦和土卫二成为主要档案焦点。" },
  "juno-earth": { label: "地球出发", description: "出发与巡航参考。" },
  "juno-jupiter": { label: "木星轨道语境", description: "云带、尺度和卫星系统环境。" },
  "new-horizons-earth": { label: "地球出发", description: "发射参考和快速外飞轨迹语境。" },
  "new-horizons-jupiter": { label: "木星飞掠", description: "进入遥远外太阳系前的尺度建立航点。" },
  "new-horizons-pluto": { label: "冥王星遭遇", description: "复杂矮行星和卡戎语境。" },
  "new-horizons-kuiper": { label: "柯伊伯带边疆", description: "外侧冰体区域和边疆视角。" },
  "parker-earth": { label: "地球出发", description: "内太阳系路线起点。" },
  "parker-venus": { label: "金星几何关系", description: "金星作为接近太阳过程中的内太阳系参考。" },
  "parker-sun": { label: "太阳日冕", description: "聚焦太阳并检查日冕视觉层。" },
  "perseverance-earth": { label: "地球出发", description: "火星转移路线起点参考。" },
  "perseverance-mars": { label: "杰泽罗语境", description: "火星地貌和杰泽罗陨石坑探索语境。" },
  "tianwen-earth": { label: "地球出发", description: "火星路线起点参考。" },
  "tianwen-mars": { label: "火星系统", description: "火星轨道和表面探索语境。" },
  "galileo-earth-1": { label: "地球出发", description: "发射和内太阳系路线起点。" },
  "galileo-venus": { label: "金星飞掠语境", description: "内太阳系几何关系参考。" },
  "galileo-earth-2": { label: "地球返回语境", description: "引力辅助路线语境，已为教育展示简化。" },
  "galileo-jupiter": { label: "木星系统", description: "伽利略卫星和巨行星环境。" },
  "dawn-earth": { label: "地球出发", description: "小天体路线起点。" },
  "dawn-belt": { label: "小行星带", description: "岩石碎片场和小天体语境。" },
  "dawn-ceres": { label: "谷神星", description: "小行星带最大天体和矮行星锚点。" },
  "europa-clipper-earth": { label: "地球出发", description: "木星系统远征路线起点。" },
  "europa-clipper-jupiter": { label: "木星系统", description: "伽利略卫星系统中的欧罗巴语境。" },
};

const DISCOVERY_ZH: Record<string, DiscoveryCopy> = {
  "voyager-1-scale": { title: "外太阳系尺度", body: "飞掠路线把巨行星变成深空尺度标尺。" },
  "voyager-2-ice": { title: "冰巨星对比", body: "天王星和海王星在同一档案路线中成为可对比世界。" },
  "cassini-rings": { title: "环系统档案", body: "土星环被视为结构化系统，而不是装饰性光环。" },
  "juno-clouds": { title: "云带问题", body: "木星可见云带是进入更深内部结构问题的入口。" },
  "new-horizons-pluto": { title: "复杂冥王星", body: "冥王星被呈现为嵌入外侧边疆的细节丰富矮行星。" },
  "parker-corona": { title: "日冕语境", body: "太阳日冕成为该任务的主要环境。" },
  "perseverance-jezero": { title: "杰泽罗语境", body: "一个陨石坑成为古水环境和探索规划的记录。" },
  "tianwen-mars": { title: "火星系统档案", body: "火星探索可以结合轨道和表面两种视角。" },
  "galileo-moons": { title: "伽利略世界", body: "木星系统像围绕一颗巨行星排列的一组紧凑世界。" },
  "dawn-ceres": { title: "小行星带多样性", body: "谷神星让小行星带呈现出矮行星级复杂度。" },
  "europa-clipper-ocean": { title: "海洋世界问题", body: "欧罗巴被视为带有宜居性问题的冰质卫星。" },
};

export const ARCHIVE_SEARCH_ALIASES: Record<ArchiveMissionId, string[]> = {
  cassini: ["cassini", "卡西尼"],
  dawn: ["dawn", "黎明号", "黎明"],
  "europa-clipper": ["europa clipper", "europa", "欧罗巴快船", "欧罗巴"],
  galileo: ["galileo", "伽利略号", "伽利略"],
  juno: ["juno", "朱诺", "朱诺号"],
  "new-horizons": ["new horizons", "new-horizons", "新视野", "新视野号"],
  "parker-solar-probe": ["parker", "parker solar probe", "帕克", "帕克太阳探测器"],
  perseverance: ["perseverance", "毅力号", "毅力"],
  "tianwen-1": ["tianwen", "tianwen-1", "天问一号", "天问1号", "天问"],
  "voyager-1": ["voyager 1", "voyager-1", "旅行者1号", "旅行者 1", "旅行者"],
  "voyager-2": ["voyager 2", "voyager-2", "旅行者2号", "旅行者 2", "旅行者"],
};

export function getArchiveMissionById(missionId: ArchiveMissionId | null) {
  if (!missionId) return null;
  return ARCHIVE_MISSIONS.find((mission) => mission.id === missionId) ?? null;
}

export function getDiscoveryCardsForMission(missionId: ArchiveMissionId | null) {
  if (!missionId) return [];
  return DISCOVERY_CARDS.filter((card) => card.missionId === missionId);
}

export function getArchiveMissionsForTarget(target: SpaceTarget) {
  return ARCHIVE_MISSIONS.filter((mission) =>
    mission.primaryTargets.includes(target) ||
    mission.waypoints.some((waypoint) => waypoint.target === target),
  );
}

export function getArchiveMissionCopy(
  mission: ArchiveMission,
  language: Language,
): ArchiveMissionCopy {
  if (language === "zh") {
    return {
      ...ARCHIVE_MISSION_ZH[mission.id],
      disclaimer: ROUTE_DISCLAIMER_ZH,
    };
  }

  return {
    agencyLabel: mission.agencyLabel,
    disclaimer: mission.disclaimer ?? ROUTE_DISCLAIMER,
    keyDiscoveries: mission.keyDiscoveries,
    longDescription: mission.longDescription,
    shortDescription: mission.shortDescription,
    statusLabel: mission.statusLabel,
    subtitle: mission.subtitle,
  };
}

export function getMissionWaypointCopy(
  waypoint: MissionWaypoint,
  language: Language,
): WaypointCopy {
  if (language === "zh") return WAYPOINT_ZH[waypoint.id] ?? waypoint;
  return waypoint;
}

export function getDiscoveryCardCopy(
  card: ArchiveDiscoveryCard,
  language: Language,
): DiscoveryCopy {
  if (language === "zh") return DISCOVERY_ZH[card.id] ?? card;
  return card;
}

function waypoint(
  id: string,
  target: SpaceTarget,
  label: string,
  description: string,
  cameraMode: "overview" | "focus" | "close" = "focus",
  requiredLayers?: ArchiveMission["waypoints"][number]["requiredLayers"],
) {
  return { cameraMode, description, id, label, requiredLayers, target };
}

function discovery(
  id: string,
  missionId: ArchiveMissionId,
  title: string,
  body: string,
  relatedTarget: SpaceTarget,
) {
  return { body, id, missionId, relatedTarget, title };
}
