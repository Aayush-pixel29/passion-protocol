import type { OperatorRole, Profile, VibeAnswers } from "@/lib/types";

export type RankedMatch = {
  profile: Profile;
  vibe: VibeAnswers;
  score: number;
};

const VIBE_KEYS = ["pace", "comms", "risk", "energy"] as const;
const MAX_DISTANCE = VIBE_KEYS.length * 4;

export function vibeScore(a: VibeAnswers, b: VibeAnswers): number {
  const total = VIBE_KEYS.reduce((sum, key) => sum + Math.abs(a[key] - b[key]), 0);
  return Math.round(100 - (total / MAX_DISTANCE) * 100);
}

export function rankMatches(
  me: { looking_for: OperatorRole; vibe: VibeAnswers; id: string },
  others: Array<{ profile: Profile; vibe: VibeAnswers }>
): RankedMatch[] {
  return others
    .filter(
      (row) =>
        row.profile.id !== me.id &&
        row.profile.onboarding_complete &&
        row.profile.role === me.looking_for
    )
    .map((row) => ({
      profile: row.profile,
      vibe: row.vibe,
      score: vibeScore(me.vibe, row.vibe),
    }))
    .sort((a, b) => b.score - a.score);
}
