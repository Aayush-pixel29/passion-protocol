import type { Profile, VibeAnswers } from "@/lib/types";

export type RankedMatch = {
  profile: Profile;
  vibe: VibeAnswers;
  project: import("@/lib/types").Project | null;
  score: number;
  intentMatch: boolean;
};

const VIBE_KEYS = ["pace", "comms", "risk", "energy"] as const;
const MAX_DISTANCE = VIBE_KEYS.length * 4;

export function vibeScore(a: VibeAnswers, b: VibeAnswers): number {
  const total = VIBE_KEYS.reduce((sum, key) => sum + Math.abs(a[key] - b[key]), 0);
  return Math.round(100 - (total / MAX_DISTANCE) * 100);
}

export function rankMatches(
  me: { industry_category: string; looking_for_category: string; spoken_languages: string[]; intent_filter: string | null; vibe: VibeAnswers; id: string },
  others: Array<{ profile: Profile; vibe: VibeAnswers; project: import("@/lib/types").Project | null }>
): RankedMatch[] {
  return others
    .filter((row) => {
      if (row.profile.id === me.id || !row.profile.onboarding_complete) return false;
      
      // Category match
      if (row.profile.industry_category !== me.looking_for_category || row.profile.looking_for_category !== me.industry_category) {
        return false;
      }
      
      // Language match: if both have languages specified, they must overlap.
      // If either has no languages specified, assume they are open.
      const myLangs = me.spoken_languages.map(l => l.toLowerCase());
      const theirLangs = row.profile.spoken_languages.map(l => l.toLowerCase());
      if (myLangs.length > 0 && theirLangs.length > 0) {
        const intersection = myLangs.filter(l => theirLangs.includes(l));
        if (intersection.length === 0) return false;
      }
      
      return true;
    })
    .map((row) => {
      const baseScore = vibeScore(me.vibe, row.vibe);
      
      // Intent match bonus: if both specify intent and they match, +5 score (capped at 100)
      const intentMatch = Boolean(
        me.intent_filter &&
        row.profile.intent_filter &&
        me.intent_filter === row.profile.intent_filter
      );
      const adjustedScore = intentMatch ? Math.min(100, baseScore + 5) : baseScore;

      return {
        profile: row.profile,
        vibe: row.vibe,
        project: row.project,
        score: adjustedScore,
        intentMatch,
      };
    })
    .sort((a, b) => {
      // Intent-matched profiles bubble up first, then by score
      if (a.intentMatch !== b.intentMatch) return a.intentMatch ? -1 : 1;
      return b.score - a.score;
    });
}
