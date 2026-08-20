import { createClient } from "@/lib/supabase/server";
import type { OperatorRole, Profile, VibeAnswers } from "@/lib/types";
import { isOperatorRole } from "@/lib/types";

function asProfile(row: {
  id: string;
  codename: string;
  role: string | null;
  looking_for: string | null;
  bio: string | null;
  onboarding_complete: boolean;
}): Profile {
  return {
    id: row.id,
    codename: row.codename,
    role: row.role && isOperatorRole(row.role) ? row.role : null,
    looking_for: row.looking_for && isOperatorRole(row.looking_for) ? row.looking_for : null,
    bio: row.bio,
    onboarding_complete: row.onboarding_complete,
  };
}

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function getOwnProfile() {
  const { supabase, user } = await getSessionUser();
  if (!user) return { user: null, profile: null, vibe: null, supabase };

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id, codename, role, looking_for, bio, onboarding_complete")
    .eq("id", user.id)
    .maybeSingle();

  const { data: vibeRow } = await supabase
    .from("vibe_answers")
    .select("pace, comms, risk, energy")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    user,
    profile: profileRow ? asProfile(profileRow) : null,
    vibe: (vibeRow as VibeAnswers | null) ?? null,
    supabase,
  };
}

export async function loadCompletedOperators() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, codename, role, looking_for, bio, onboarding_complete")
    .eq("onboarding_complete", true);

  const { data: vibes } = await supabase.from("vibe_answers").select("user_id, pace, comms, risk, energy");

  const vibeByUser = new Map<string, VibeAnswers>();
  for (const row of vibes ?? []) {
    vibeByUser.set(row.user_id, {
      pace: row.pace,
      comms: row.comms,
      risk: row.risk,
      energy: row.energy,
    });
  }

  return (profiles ?? [])
    .map(asProfile)
    .filter((p): p is Profile & { role: OperatorRole; looking_for: OperatorRole } =>
      Boolean(p.role && p.looking_for)
    )
    .flatMap((profile) => {
      const vibe = vibeByUser.get(profile.id);
      return vibe ? [{ profile, vibe }] : [];
    });
}
