import type { Language, SpaceTarget } from "@/app/types/space";

export type SpaceObjectStats = {
  diameter: string;
  distanceFromSun: string;
  notableFeatures: string[];
  orbitalPeriod: string;
};

export type SpaceObjectInfo = {
  detailDescription: Record<Language, string>;
  name: Record<Language, string>;
  related: Record<Language, string[]>;
  shortDescription: Record<Language, string>;
  stats: SpaceObjectStats;
  type: Record<Language, string>;
};

export const SPACE_OBJECTS: Record<SpaceTarget, SpaceObjectInfo> = {
  "asteroid-belt": {
    name: { en: "Asteroid Belt", zh: "小行星带" },
    type: { en: "Region", zh: "区域" },
    shortDescription: {
      en: "The asteroid belt is a broad region of rocky debris and minor planets between Mars and Jupiter.",
      zh: "小行星带位于火星和木星之间，是岩石碎片和小天体聚集的宽阔区域。",
    },
    detailDescription: {
      en: "The asteroid belt is a remnant-rich region between the orbits of Mars and Jupiter. In Argonaut it is represented as a sparse rocky particle band so you can read the transition from inner rocky planets to the giant-planet region.",
      zh: "小行星带位于火星与木星轨道之间，是太阳系形成后遗留物质较为集中的区域。在寰宇星舟中，它以稀疏岩石点云呈现，用来帮助理解内侧岩质行星与巨行星区域之间的过渡。",
    },
    stats: {
      diameter: "Region: roughly 2.1-3.3 AU",
      distanceFromSun: "Between Mars and Jupiter",
      orbitalPeriod: "Varies by object",
      notableFeatures: ["Rocky debris", "Minor planets", "Ceres"],
    },
    related: {
      en: ["Ceres", "Mars", "Jupiter", "Minor planets"],
      zh: ["谷神星", "火星", "木星", "小天体"],
    },
  },
  "kuiper-belt": {
    name: { en: "Kuiper Belt", zh: "柯伊伯带" },
    type: { en: "Region", zh: "区域" },
    shortDescription: {
      en: "The Kuiper Belt is a distant icy frontier beyond Neptune, home to dwarf planets and comet-like bodies.",
      zh: "柯伊伯带位于海王星外侧，是由冰质天体、矮行星和彗星源区构成的遥远边界。",
    },
    detailDescription: {
      en: "The Kuiper Belt is an outer solar system population of icy bodies. This prototype shows it as a cold, faint boundary layer beyond Neptune rather than a destination surface, reinforcing the difference between planetary targets and broad regions.",
      zh: "柯伊伯带是外太阳系冰质天体的集合区域。本原型将它表现为海王星外侧冷色、稀薄的边界层，而不是一个具体表面目标，以区分行星目标和广域结构。",
    },
    stats: {
      diameter: "Region: roughly 30-50+ AU",
      distanceFromSun: "Beyond Neptune",
      orbitalPeriod: "Varies by object",
      notableFeatures: ["Icy bodies", "Dwarf planets", "Comet reservoirs"],
    },
    related: {
      en: ["Pluto", "Neptune", "Icy bodies", "Comet origins"],
      zh: ["冥王星", "海王星", "冰质天体", "彗星源区"],
    },
  },
  ceres: {
    name: { en: "Ceres", zh: "谷神星" },
    type: { en: "Dwarf Planet", zh: "矮行星" },
    shortDescription: {
      en: "Ceres is the largest object in the asteroid belt and is classified as a dwarf planet.",
      zh: "谷神星是小行星带中最大的天体，也被归类为矮行星。",
    },
    detailDescription: {
      en: "Ceres anchors the asteroid belt as its largest body. It gives the belt a concrete lock target while still showing that the surrounding region is a distributed population of smaller rocky objects.",
      zh: "谷神星是小行星带中最大的天体，为小行星带提供了一个具体可锁定目标，同时也能帮助理解周围区域由大量较小岩石天体组成。",
    },
    stats: {
      diameter: "940 km",
      distanceFromSun: "2.77 AU",
      orbitalPeriod: "4.6 Earth years",
      notableFeatures: ["Largest asteroid belt object", "Dwarf planet", "Bright deposits"],
    },
    related: {
      en: ["Asteroid Belt", "Bright deposits", "Dwarf planets"],
      zh: ["小行星带", "亮斑沉积物", "矮行星"],
    },
  },
  earth: {
    name: { en: "Earth", zh: "地球" },
    type: { en: "Planet", zh: "行星" },
    shortDescription: {
      en: "Earth is our home world, the only known planet with life and liquid water on its surface.",
      zh: "地球是我们的家园，是目前已知唯一拥有生命并在表面存在液态水的行星。",
    },
    detailDescription: {
      en: "Earth combines oceans, atmosphere, active geology, and a large natural moon into a uniquely readable system. In this prototype, Earth is the default mission anchor for comparing habitability, atmosphere, and planetary scale.",
      zh: "地球拥有海洋、大气、活跃地质活动和大型天然卫星，是理解宜居性、行星尺度和地月系统的核心参考点。",
    },
    stats: {
      diameter: "12,742 km",
      distanceFromSun: "1 AU",
      orbitalPeriod: "365.25 days",
      notableFeatures: ["Liquid water", "Nitrogen-oxygen atmosphere", "Large Moon"],
    },
    related: {
      en: ["Moon", "ISS", "Near Earth Objects"],
      zh: ["月球", "国际空间站", "近地天体"],
    },
  },
  jupiter: {
    name: { en: "Jupiter", zh: "木星" },
    type: { en: "Gas Giant", zh: "气态巨行星" },
    shortDescription: {
      en: "Jupiter is the largest planet in the solar system, a giant world of storms, clouds, and powerful magnetic fields.",
      zh: "木星是太阳系中最大的行星，拥有巨大的风暴、云带和强磁场。",
    },
    detailDescription: {
      en: "Jupiter dominates the outer solar system by scale and gravity. Its cloud bands, long-lived storms, and major moon system make it a natural laboratory for gas giant dynamics.",
      zh: "木星以巨大的尺度和引力主导外太阳系。它的云带、长期风暴和主要卫星系统，是理解气态巨行星动力学的关键样本。",
    },
    stats: {
      diameter: "139,820 km",
      distanceFromSun: "5.2 AU",
      orbitalPeriod: "11.86 Earth years",
      notableFeatures: ["Cloud bands", "Great Red Spot", "Io / Europa / Ganymede / Callisto"],
    },
    related: {
      en: ["Io", "Europa", "Ganymede", "Callisto", "Juno"],
      zh: ["伊奥", "欧罗巴", "盖尼米德", "卡利斯托", "朱诺号"],
    },
  },
  mars: {
    name: { en: "Mars", zh: "火星" },
    type: { en: "Planet", zh: "行星" },
    shortDescription: {
      en: "Mars is a cold desert world and one of humanity's most important future exploration targets.",
      zh: "火星是一颗寒冷的沙漠行星，也是人类未来最重要的深空探索目标之一。",
    },
    detailDescription: {
      en: "Mars combines ancient river valleys, giant volcanoes, polar ice, and preserved crater basins. It is a strong comparison target for early planetary climate, water history, and future human exploration.",
      zh: "火星拥有古河道、巨型火山、极冠冰层和保存良好的撞击盆地，是研究早期气候、水历史和未来载人探索的重要目标。",
    },
    stats: {
      diameter: "6,779 km",
      distanceFromSun: "1.52 AU",
      orbitalPeriod: "687 Earth days",
      notableFeatures: ["Olympus Mons", "Valles Marineris", "Polar ice caps"],
    },
    related: {
      en: ["Olympus Mons", "Valles Marineris", "Jezero Crater", "Polar Caps"],
      zh: ["奥林帕斯山", "水手峡谷", "杰泽罗陨石坑", "火星极冠"],
    },
  },
  mercury: {
    name: { en: "Mercury", zh: "水星" },
    type: { en: "Planet", zh: "行星" },
    shortDescription: {
      en: "Mercury is the innermost and smallest planet.",
      zh: "水星是最靠近太阳且最小的行星。",
    },
    detailDescription: {
      en: "Mercury provides a compact reference for the inner solar system. Its cratered surface and proximity to the Sun make it useful for understanding illumination, scale, and orbital spacing.",
      zh: "水星是理解内太阳系的紧凑参考点。它的撞击坑表面和近太阳位置，有助于观察光照、尺度和内侧轨道间距。",
    },
    stats: {
      diameter: "4,879 km",
      distanceFromSun: "0.39 AU",
      orbitalPeriod: "88 Earth days",
      notableFeatures: ["Cratered surface", "Extreme temperature changes", "Innermost orbit"],
    },
    related: {
      en: ["Sun", "Caloris Basin", "Inner Solar System"],
      zh: ["太阳", "卡洛里斯盆地", "内太阳系"],
    },
  },
  moon: {
    name: { en: "Moon", zh: "月球" },
    type: { en: "Moon", zh: "卫星" },
    shortDescription: {
      en: "The Moon is Earth's natural satellite and the first world beyond Earth visited by humans.",
      zh: "月球是地球的天然卫星，也是人类首次到访的地外天体。",
    },
    detailDescription: {
      en: "The Moon preserves impact history, volcanic plains, and a stable reference point for studying the Earth-Moon system. Its near side and far side reveal very different terrain patterns.",
      zh: "月球保存了撞击历史、火山平原和地月系统的长期演化线索。它的正面与背面呈现出明显不同的地形特征。",
    },
    stats: {
      diameter: "3,474 km",
      distanceFromSun: "1 AU with Earth",
      orbitalPeriod: "27.3 days around Earth",
      notableFeatures: ["Lunar maria", "Impact craters", "Tidally locked rotation"],
    },
    related: {
      en: ["Apollo Site", "Mare Tranquillitatis", "Far Side"],
      zh: ["阿波罗登陆点", "静海", "月球背面"],
    },
  },
  neptune: {
    name: { en: "Neptune", zh: "海王星" },
    type: { en: "Ice Giant", zh: "冰巨星" },
    shortDescription: {
      en: "Neptune is a deep blue ice giant with extreme winds and a distant moon system.",
      zh: "海王星是一颗深蓝色冰巨星，拥有极端强风和遥远的卫星系统。",
    },
    detailDescription: {
      en: "Neptune marks the outer major-planet system. Its cold blue atmosphere, powerful winds, and moon Triton make it a useful endpoint before the Kuiper Belt boundary layer.",
      zh: "海王星标记了主要行星系统的外侧边界。它寒冷的蓝色大气、强风和海卫一，使其成为进入柯伊伯带前的重要参考点。",
    },
    stats: {
      diameter: "49,244 km",
      distanceFromSun: "30.1 AU",
      orbitalPeriod: "164.8 Earth years",
      notableFeatures: ["Deep blue atmosphere", "Extreme winds", "Triton"],
    },
    related: {
      en: ["Triton", "Great Dark Spot", "Kuiper Belt"],
      zh: ["海卫一", "大暗斑", "柯伊伯带"],
    },
  },
  pluto: {
    name: { en: "Pluto", zh: "冥王星" },
    type: { en: "Dwarf Planet", zh: "矮行星" },
    shortDescription: {
      en: "Pluto is a dwarf planet and Kuiper Belt world with a complex icy surface.",
      zh: "冥王星是一颗矮行星，也是柯伊伯带天体，表面由复杂冰质地貌构成。",
    },
    detailDescription: {
      en: "Pluto is best read as part of the Kuiper Belt population rather than as a classical major planet. Its icy surface and large moon Charon make it a compelling outer-system context target.",
      zh: "冥王星更适合作为柯伊伯带天体来理解，而不是传统主要行星。它的冰质表面和大型卫星卡戎，让它成为外太阳系语境中的重要目标。",
    },
    stats: {
      diameter: "2,377 km",
      distanceFromSun: "39.5 AU average",
      orbitalPeriod: "248 Earth years",
      notableFeatures: ["Kuiper Belt object", "Tombaugh Regio", "Charon"],
    },
    related: {
      en: ["Charon", "Tombaugh Regio", "Kuiper Belt"],
      zh: ["卡戎", "汤博区", "柯伊伯带"],
    },
  },
  saturn: {
    name: { en: "Saturn", zh: "土星" },
    type: { en: "Ringed Planet", zh: "环系行星" },
    shortDescription: {
      en: "Saturn is famous for its spectacular ring system and icy moons.",
      zh: "土星以壮观的环系统和众多冰质卫星而闻名。",
    },
    detailDescription: {
      en: "Saturn is a low-density gas giant surrounded by a complex ring system made mostly of ice particles. Its moons, including Titan and Enceladus, expand the scientific value of the Saturn system.",
      zh: "土星是一颗低密度气态巨行星，周围环绕着主要由冰粒组成的复杂环系统。包括泰坦和土卫二在内的卫星进一步提升了土星系统的科学价值。",
    },
    stats: {
      diameter: "116,460 km",
      distanceFromSun: "9.58 AU",
      orbitalPeriod: "29.45 Earth years",
      notableFeatures: ["Ring system", "Titan", "Enceladus"],
    },
    related: {
      en: ["Titan", "Enceladus", "Rings", "Cassini"],
      zh: ["泰坦", "土卫二", "土星环", "卡西尼号"],
    },
  },
  sun: {
    name: { en: "Sun", zh: "太阳" },
    type: { en: "Star", zh: "恒星" },
    shortDescription: {
      en: "The Sun is the central star of the solar system.",
      zh: "太阳是太阳系的中心恒星。",
    },
    detailDescription: {
      en: "The Sun provides the light, heat, solar wind, and gravity that shape the solar system. Locking it helps reveal the structure of inner orbits, the ecliptic reference plane, and the way planetary systems organize around a central star.",
      zh: "太阳提供塑造太阳系的光、热、太阳风和引力。锁定太阳可以观察内侧轨道结构、黄道参考面，以及行星系统如何围绕中心恒星组织。",
    },
    stats: {
      diameter: "1.39 million km",
      distanceFromSun: "0 AU",
      orbitalPeriod: "N/A",
      notableFeatures: ["Solar corona", "Solar wind", "Fusion core"],
    },
    related: {
      en: ["Mercury", "Venus", "Solar Corona", "Solar Wind"],
      zh: ["水星", "金星", "日冕", "太阳风"],
    },
  },
  uranus: {
    name: { en: "Uranus", zh: "天王星" },
    type: { en: "Ice Giant", zh: "冰巨星" },
    shortDescription: {
      en: "Uranus is a pale ice giant with a dramatically tilted rotation axis and faint rings.",
      zh: "天王星是一颗浅青色冰巨星，拥有极端倾斜的自转轴和微弱环系统。",
    },
    detailDescription: {
      en: "Uranus is visually defined by its subdued blue-green atmosphere and unusual axial tilt. In this map, it expands the outer solar system beyond Saturn while keeping the view restrained and readable.",
      zh: "天王星以浅蓝绿色大气和异常倾斜的自转轴著称。在本地图中，它将外太阳系结构扩展到土星之外，同时保持画面克制可读。",
    },
    stats: {
      diameter: "50,724 km",
      distanceFromSun: "19.2 AU",
      orbitalPeriod: "84 Earth years",
      notableFeatures: ["Tilted axis", "Faint rings", "Methane atmosphere"],
    },
    related: {
      en: ["Titania", "Oberon", "Faint rings", "Tilted axis"],
      zh: ["天卫三", "天卫四", "微弱环", "倾斜自转轴"],
    },
  },
  venus: {
    name: { en: "Venus", zh: "金星" },
    type: { en: "Planet", zh: "行星" },
    shortDescription: {
      en: "Venus is a cloud-covered terrestrial planet with a dense atmosphere.",
      zh: "金星是一颗被厚云层包裹的类地行星，拥有浓密大气。",
    },
    detailDescription: {
      en: "Venus is close to Earth in size but radically different in atmosphere and surface conditions. In this prototype, it helps compare terrestrial planets and read the bright inner solar system.",
      zh: "金星与地球尺寸接近，但大气和表面环境截然不同。在本原型中，它适合用于对比类地行星，并观察明亮的内太阳系区域。",
    },
    stats: {
      diameter: "12,104 km",
      distanceFromSun: "0.72 AU",
      orbitalPeriod: "225 Earth days",
      notableFeatures: ["Thick atmosphere", "Runaway greenhouse effect", "Volcanic plains"],
    },
    related: {
      en: ["Sun", "Cloud Deck", "Terrestrial Planets"],
      zh: ["太阳", "云层", "类地行星"],
    },
  },
};
