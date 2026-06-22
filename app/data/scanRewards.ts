import type { RewardGrant, SpaceTarget } from "@/app/types/space";

export const SCAN_REWARDS: Record<SpaceTarget, RewardGrant> = {
  "asteroid-belt": {
    discoveryCardIds: ["asteroid-belt-density-map"],
    researchCredits: 65,
    xp: 130,
  },
  "kuiper-belt": {
    badgeIds: ["outer-frontier-pilot"],
    discoveryCardIds: ["kuiper-belt-icy-frontier"],
    researchCredits: 120,
    xp: 220,
  },
  ceres: {
    discoveryCardIds: ["ceres-bright-deposits"],
    researchCredits: 70,
    xp: 135,
  },
  earth: {
    badgeIds: ["inner-worlds-observer"],
    discoveryCardIds: ["earth-atmosphere-profile"],
    researchCredits: 40,
    xp: 80,
  },
  jupiter: {
    badgeIds: ["giant-planet-navigator"],
    discoveryCardIds: ["jupiter-storm-band-profile"],
    researchCredits: 75,
    xp: 150,
  },
  mars: {
    badgeIds: ["mars-field-surveyor"],
    discoveryCardIds: ["mars-ancient-water-signature"],
    researchCredits: 60,
    xp: 120,
  },
  mercury: {
    discoveryCardIds: ["mercury-crater-profile"],
    researchCredits: 45,
    xp: 90,
  },
  moon: {
    discoveryCardIds: ["moon-crater-survey"],
    researchCredits: 35,
    xp: 75,
  },
  neptune: {
    badgeIds: ["ice-giant-surveyor"],
    discoveryCardIds: ["neptune-wind-profile"],
    researchCredits: 100,
    xp: 180,
  },
  pluto: {
    discoveryCardIds: ["pluto-charon-context"],
    researchCredits: 95,
    xp: 175,
  },
  saturn: {
    badgeIds: ["ring-system-analyst"],
    discoveryCardIds: ["saturn-ring-particle-profile"],
    researchCredits: 80,
    xp: 150,
  },
  sun: {
    discoveryCardIds: ["sun-corona-profile"],
    researchCredits: 90,
    xp: 160,
  },
  uranus: {
    badgeIds: ["ice-giant-surveyor"],
    discoveryCardIds: ["uranus-tilted-axis-profile"],
    researchCredits: 90,
    xp: 165,
  },
  venus: {
    discoveryCardIds: ["venus-cloud-deck-profile"],
    researchCredits: 70,
    xp: 130,
  },
};
