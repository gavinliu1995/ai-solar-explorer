import type {
  ArchiveMission,
  ArchiveMissionCategory,
  ArchiveMissionId,
  DiscoveryCard,
  SpaceTarget,
} from "@/app/types/space";

const ROUTE_DISCLAIMER =
  "Mission routes are simplified educational visualizations, not precise flight dynamics.";

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

export const DISCOVERY_CARDS: DiscoveryCard[] = [
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
