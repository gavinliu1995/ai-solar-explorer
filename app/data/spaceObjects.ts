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
  jupiter: {
    name: { en: "Jupiter", zh: "木星" },
    type: { en: "Gas Giant", zh: "气态巨行星" },
    shortDescription: {
      en: "Jupiter is the largest planet in the solar system, a giant world of storms, clouds, and powerful magnetic fields.",
      zh: "木星是太阳系中最大的行星，拥有巨大的风暴、云带和强磁场。",
    },
    detailDescription: {
      en: "Jupiter dominates the outer solar system by scale and gravity. Its cloud bands, long-lived storms, and moon system make it a natural laboratory for gas giant dynamics.",
      zh: "木星以巨大的尺度和引力主导外太阳系。它的云带、长期风暴和卫星系统，是理解气态巨行星动力学的关键样本。",
    },
    stats: {
      diameter: "139,820 km",
      distanceFromSun: "5.2 AU",
      orbitalPeriod: "11.86 Earth years",
      notableFeatures: ["Cloud bands", "Great Red Spot", "Strong magnetosphere"],
    },
    related: {
      en: ["Juno", "Europa Clipper", "Great Red Spot"],
      zh: ["朱诺号", "欧罗巴快船", "大红斑"],
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
      en: "Saturn is a low-density gas giant surrounded by a complex ring system made mostly of ice particles. Its moons, including Titan, expand the scientific value of the Saturn system.",
      zh: "土星是一颗低密度气态巨行星，周围环绕着主要由冰粒组成的复杂环系统。包括泰坦在内的卫星进一步提升了土星系统的科学价值。",
    },
    stats: {
      diameter: "116,460 km",
      distanceFromSun: "9.58 AU",
      orbitalPeriod: "29.45 Earth years",
      notableFeatures: ["Ring system", "Titan", "Icy moons"],
    },
    related: {
      en: ["Ring System", "Titan", "Icy Moons"],
      zh: ["土星环系统", "泰坦", "冰质卫星"],
    },
  },
};
