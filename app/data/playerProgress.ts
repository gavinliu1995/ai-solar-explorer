import type { Language } from "@/app/types/space";

export type CaptainRankId =
  | "cadet"
  | "junior-pilot"
  | "flight-specialist"
  | "deep-space-navigator"
  | "argonaut-commander";

type CaptainRank = {
  id: CaptainRankId;
  minXp: number;
  label: Record<Language, string>;
};

export const CAPTAIN_RANKS: CaptainRank[] = [
  {
    id: "cadet",
    label: { en: "Cadet", zh: "见习船员" },
    minXp: 0,
  },
  {
    id: "junior-pilot",
    label: { en: "Junior Pilot", zh: "初级驾驶员" },
    minXp: 200,
  },
  {
    id: "flight-specialist",
    label: { en: "Flight Specialist", zh: "飞行专家" },
    minXp: 500,
  },
  {
    id: "deep-space-navigator",
    label: { en: "Deep Space Navigator", zh: "深空领航员" },
    minXp: 1000,
  },
  {
    id: "argonaut-commander",
    label: { en: "Argonaut Commander", zh: "星舟指挥官" },
    minXp: 2000,
  },
];

export function getCaptainRankId(flightXp: number): CaptainRankId {
  return CAPTAIN_RANKS.reduce<CaptainRankId>((currentRankId, rank) => {
    if (flightXp >= rank.minXp) return rank.id;
    return currentRankId;
  }, "cadet");
}

export function getCaptainRank(flightXp: number, language: Language) {
  const rankId = getCaptainRankId(flightXp);
  const rank = CAPTAIN_RANKS.find((item) => item.id === rankId);

  return rank?.label[language] ?? CAPTAIN_RANKS[0].label[language];
}
