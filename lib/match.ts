import type { Profile, VibeAnswers } from "@/lib/types";

export type RankedMatch = {
  profile: Profile;
  vibe: VibeAnswers;
  project: import("@/lib/types").Project | null;
  score: number;
  intentMatch: boolean;
  reciprocalMatch: boolean;
};

const VIBE_KEYS = ["pace", "comms", "risk", "energy"] as const;
const MAX_DISTANCE = VIBE_KEYS.length * 4;

export function vibeScore(a: VibeAnswers, b: VibeAnswers): number {
  const total = VIBE_KEYS.reduce((sum, key) => sum + Math.abs(a[key] - b[key]), 0);
  return Math.round(100 - (total / MAX_DISTANCE) * 100);
}

/**
 * rankMatches — returns ALL users ranked by synergy.
 * Reciprocal category matches get a bonus, but everyone is included.
 * Client-side filters (category, etc.) narrow down the results.
 */
export function rankMatches(
  me: { industry_category: string; looking_for_category: string; spoken_languages: string[]; intent_filter: string | null; vibe: VibeAnswers; id: string },
  others: Array<{ profile: Profile; vibe: VibeAnswers; project: import("@/lib/types").Project | null }>
): RankedMatch[] {
  return others
    .filter((row) => {
      if (row.profile.id === me.id || !row.profile.onboarding_complete) return false;
      return true;
    })
    .map((row) => {
      const baseScore = vibeScore(me.vibe, row.vibe);
      
      // Reciprocal match bonus: they offer what I need AND need what I offer
      const reciprocalMatch = Boolean(
        row.profile.industry_category === me.looking_for_category &&
        row.profile.looking_for_category === me.industry_category
      );
      
      // Intent match bonus
      const intentMatch = Boolean(
        me.intent_filter &&
        row.profile.intent_filter &&
        me.intent_filter === row.profile.intent_filter
      );
      
      let adjustedScore = baseScore;
      if (reciprocalMatch) adjustedScore = Math.min(100, adjustedScore + 10);
      if (intentMatch) adjustedScore = Math.min(100, adjustedScore + 5);

      return {
        profile: row.profile,
        vibe: row.vibe,
        project: row.project,
        score: adjustedScore,
        intentMatch,
        reciprocalMatch,
      };
    })
    .sort((a, b) => {
      // Reciprocal matches first, then intent matches, then by score
      if (a.reciprocalMatch !== b.reciprocalMatch) return a.reciprocalMatch ? -1 : 1;
      if (a.intentMatch !== b.intentMatch) return a.intentMatch ? -1 : 1;
      return b.score - a.score;
    });
}
