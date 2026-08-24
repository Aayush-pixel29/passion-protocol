import { createClient } from "@/lib/supabase/server";
import type { Profile, VibeAnswers } from "@/lib/types";
import { isValidCategory } from "@/lib/types";

function asProfile(
  row: {
    id: string;
    codename: string;
    full_name?: string | null;
    location?: string | null;
    phone_number?: string | null;
    linkedin_url?: string | null;
    spoken_languages?: string[];
    industry_category?: string | null;
    professional_title?: string | null;
    looking_for_category?: string | null;
    looking_for_title?: string | null;
    intent_filter?: string | null;
    bio?: string | null;
    stripe_account_id?: string | null;
    onboarding_complete: boolean;
  },
  contactUrl?: string | null
): Profile {
  return {
    id: row.id,
    codename: row.codename,
    full_name: row.full_name || null,
    location: row.location || null,
    phone_number: row.phone_number || null,
    linkedin_url: row.linkedin_url || null,
    spoken_languages: row.spoken_languages || [],
    industry_category: row.industry_category && isValidCategory(row.industry_category) ? row.industry_category : null,
    professional_title: row.professional_title || null,
    looking_for_category: row.looking_for_category && isValidCategory(row.looking_for_category) ? row.looking_for_category : null,
    looking_for_title: row.looking_for_title || null,
    intent_filter: row.intent_filter || null,
    bio: row.bio || null,
    contact_url: contactUrl ?? null,
    payment_link: row.stripe_account_id || null,
    onboarding_complete: row.onboarding_complete,
  };
}

const PROFILE_SELECT = "id, codename, bio, onboarding_complete, full_name, location, phone_number, linkedin_url, spoken_languages, industry_category, professional_title, looking_for_category, looking_for_title, intent_filter, stripe_account_id";
const PUBLIC_PROFILE_SELECT = "id, codename, bio, onboarding_complete, full_name, location, spoken_languages, industry_category, professional_title, looking_for_category, looking_for_title, intent_filter";

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
    .select(PROFILE_SELECT)
    .eq("id", user.id)
    .maybeSingle();

  const { data: vibeRow } = await supabase
    .from("vibe_answers")
    .select("pace, comms, risk, energy")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: linkRow } = await supabase
    .from("profile_links")
    .select("contact_url")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: projectRow } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    user,
    profile: profileRow ? asProfile(profileRow, linkRow?.contact_url) : null,
    vibe: (vibeRow as VibeAnswers | null) ?? null,
    project: (projectRow as import("@/lib/types").Project | null) ?? null,
    supabase,
  };
}

import { unstable_cache } from "next/cache";

import { createClient as createPlainClient } from "@supabase/supabase-js";

/**
 * loadCompletedOperators — fetches all onboarded profiles, vibes, and projects.
 * Cached for 60 seconds so we don't spam Supabase on every page load.
 * This is the key performance optimization: instead of querying the database
 * fresh on every single page navigation, we serve cached results.
 */
export const loadCompletedOperators = unstable_cache(
  async () => {
    const supabase = createPlainClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: profiles } = await supabase
      .from("profiles").select(PUBLIC_PROFILE_SELECT).eq("onboarding_complete", true);

    const { data: vibes } = await supabase.from("vibe_answers").select("user_id, pace, comms, risk, energy");
    const { data: projects } = await supabase.from("projects").select("id, user_id, title, description");

    const vibeByUser = new Map<string, VibeAnswers>();
    for (const row of vibes ?? []) {
      vibeByUser.set(row.user_id, {
        pace: row.pace,
        comms: row.comms,
        risk: row.risk,
        energy: row.energy,
      });
    }

    const projectByUser = new Map<string, import("@/lib/types").Project>();
    for (const row of projects ?? []) {
      projectByUser.set(row.user_id, row);
    }

    return (profiles ?? [])
      .map((p) => asProfile(p))
      .filter((p): p is Profile & { industry_category: string; professional_title: string; looking_for_category: string; looking_for_title: string } =>
        Boolean(p.industry_category && p.professional_title && p.looking_for_category && p.looking_for_title)
      )
      .flatMap((profile) => {
        const vibe = vibeByUser.get(profile.id);
        const project = projectByUser.get(profile.id) ?? null;
        return vibe ? [{ profile, vibe, project }] : [];
      });
  },
  ["completed-operators"],
  { revalidate: 60 } // Cache for 60 seconds
);

// Fetch a handful of completed profiles for the public sneak-peek marquee
export async function loadSneakPeekProfiles(): Promise<Array<{ codename: string; professional_title: string; industry_category: string; intent_filter: string | null }>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("codename, professional_title, industry_category, intent_filter")
    .eq("onboarding_complete", true)
    .not("professional_title", "is", null)
    .not("industry_category", "is", null)
    .limit(20);

  return (data ?? []).map((row) => ({
    codename: row.codename,
    professional_title: row.professional_title ?? "Builder",
    industry_category: row.industry_category ?? "Other",
    intent_filter: row.intent_filter ?? null,
  }));
}
