import { CAPTAIN_TITLES } from "@/app/data/captainTitles";
import { DISCOVERY_CARDS } from "@/app/data/discoveryCards";
import { FLIGHT_MISSIONS } from "@/app/data/flightMissions";
import { MISSION_BADGES } from "@/app/data/missionBadges";
import type {
  CaptainTitleId,
  DiscoveryCardId,
  FlightMissionId,
  MissionBadgeId,
  PlayerProgress,
  SpaceTarget,
} from "@/app/types/space";
import { LOCKABLE_TARGETS } from "@/app/types/space";

const SAVE_KEY = "argonaut-player-progress-v1";
const SAVE_VERSION = 1;

const validMissionIds = new Set<FlightMissionId>(
  FLIGHT_MISSIONS.map((mission) => mission.id),
);
const validDiscoveryIds = new Set<DiscoveryCardId>(
  DISCOVERY_CARDS.map((card) => card.id),
);
const validBadgeIds = new Set<MissionBadgeId>(
  MISSION_BADGES.map((badge) => badge.id),
);
const validTargetIds = new Set<SpaceTarget>(LOCKABLE_TARGETS);
const validTitleIds = new Set<CaptainTitleId>(
  CAPTAIN_TITLES.map((title) => title.id),
);

export function createDefaultPlayerProgress(): PlayerProgress {
  return {
    captainTitles: [],
    completedFlightMissionIds: [],
    flightXp: 0,
    lastSavedAt: undefined,
    researchCredits: 0,
    saveVersion: SAVE_VERSION,
    scannedTargetIds: [],
    selectedCaptainTitle: undefined,
    unlockedBadgeIds: [],
    unlockedDiscoveryCardIds: [],
  };
}

function filterValid<T extends string>(items: unknown, validIds: Set<T>): T[] {
  if (!Array.isArray(items)) return [];
  return Array.from(
    new Set(items.filter((item): item is T => validIds.has(item as T))),
  );
}

function sanitizeProgress(rawProgress: unknown): PlayerProgress {
  const fallback = createDefaultPlayerProgress();
  if (!rawProgress || typeof rawProgress !== "object") return fallback;

  const value = rawProgress as Partial<PlayerProgress>;
  const captainTitles = filterValid(value.captainTitles, validTitleIds);
  const selectedCaptainTitle =
    value.selectedCaptainTitle &&
    validTitleIds.has(value.selectedCaptainTitle)
      ? value.selectedCaptainTitle
      : captainTitles[0];

  return {
    captainTitles,
    completedFlightMissionIds: filterValid(
      value.completedFlightMissionIds,
      validMissionIds,
    ),
    flightXp:
      typeof value.flightXp === "number" && Number.isFinite(value.flightXp)
        ? Math.max(0, value.flightXp)
        : 0,
    lastSavedAt:
      typeof value.lastSavedAt === "string" ? value.lastSavedAt : undefined,
    researchCredits:
      typeof value.researchCredits === "number" &&
      Number.isFinite(value.researchCredits)
        ? Math.max(0, value.researchCredits)
        : 0,
    saveVersion: SAVE_VERSION,
    scannedTargetIds: filterValid(value.scannedTargetIds, validTargetIds),
    selectedCaptainTitle,
    unlockedBadgeIds: filterValid(value.unlockedBadgeIds, validBadgeIds),
    unlockedDiscoveryCardIds: filterValid(
      value.unlockedDiscoveryCardIds,
      validDiscoveryIds,
    ),
  };
}

export function loadPlayerProgress(): PlayerProgress {
  if (typeof window === "undefined") return createDefaultPlayerProgress();

  try {
    const serializedProgress = window.localStorage.getItem(SAVE_KEY);
    if (!serializedProgress) return createDefaultPlayerProgress();

    const parsedProgress = JSON.parse(serializedProgress) as unknown;
    return sanitizeProgress(parsedProgress);
  } catch {
    return createDefaultPlayerProgress();
  }
}

export function savePlayerProgress(progress: PlayerProgress): PlayerProgress {
  const nextProgress = sanitizeProgress({
    ...progress,
    lastSavedAt: new Date().toISOString(),
    saveVersion: SAVE_VERSION,
  });

  if (typeof window === "undefined") return nextProgress;

  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(nextProgress));
  } catch {
    // Local save is intentionally non-fatal for restricted browser contexts.
  }

  return nextProgress;
}

export function resetPlayerProgress(): PlayerProgress {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(SAVE_KEY);
    } catch {
      // Reset should not fail the app if storage is unavailable.
    }
  }

  return createDefaultPlayerProgress();
}
