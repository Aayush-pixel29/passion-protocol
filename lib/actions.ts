"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isOperatorRole, type ConnectState } from "@/lib/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CODENAME_RE = /^[A-Z0-9_]{2,32}$/;

function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function saveOnboarding(formData: FormData): Promise<{ error: string } | void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Session expired. Sign in again." };
  }

  const rawName = String(formData.get("codename") ?? "").trim();
  const codename = rawName.replace(/\s+/g, "_").toUpperCase();
  const role = String(formData.get("role") ?? "");
  const lookingFor = String(formData.get("lookingFor") ?? "");
  const bioRaw = String(formData.get("bio") ?? "").trim();
  const bio = bioRaw ? bioRaw.slice(0, 280) : null;
  const contactUrlRaw = String(formData.get("contactUrl") ?? "").trim();
  const contactUrl = contactUrlRaw ? contactUrlRaw.slice(0, 200) : null;

  if (!CODENAME_RE.test(codename)) {
    return { error: "Codename must be 2–32 letters, numbers, or underscores." };
  }
  if (!isOperatorRole(role) || !isOperatorRole(lookingFor)) {
    return { error: "Select both I AM and I NEED." };
  }

  const pace = Number(formData.get("pace"));
  const comms = Number(formData.get("comms"));
  const risk = Number(formData.get("risk"));
  const energy = Number(formData.get("energy"));

  if ([pace, comms, risk, energy].some((n) => !Number.isInteger(n) || n < 1 || n > 5)) {
    return { error: "Set every vibe slider." };
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    codename,
    role,
    looking_for: lookingFor,
    bio,
    onboarding_complete: true,
  });

  if (profileError) {
    if (profileError.code === "23505") {
      return { error: "That codename is taken." };
    }
    return { error: profileError.message };
  }

  const { error: vibeError } = await supabase.from("vibe_answers").upsert({
    user_id: user.id,
    pace,
    comms,
    risk,
    energy,
  });

  if (vibeError) {
    return { error: vibeError.message };
  }

  const { error: linkError } = await supabase.from("profile_links").upsert({
    user_id: user.id,
    contact_url: contactUrl,
  });

  if (linkError) {
    // If profile_links table doesn't exist yet, don't block onboarding
    console.warn("profile_links upsert:", linkError.message);
  }

  revalidatePath("/discover");
  revalidatePath("/profile");
  redirect("/discover");
}

export async function sendConnect(toId: string): Promise<{ error?: string; status?: ConnectState }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Session expired." };
  }
  if (!isUuid(toId) || user.id === toId) {
    return { error: "Invalid partner." };
  }

  const { data: outgoing } = await supabase
    .from("connect_requests")
    .select("id, from_id, to_id, status")
    .eq("from_id", user.id)
    .eq("to_id", toId)
    .maybeSingle();

  const { data: incoming } = await supabase
    .from("connect_requests")
    .select("id, from_id, to_id, status")
    .eq("from_id", toId)
    .eq("to_id", user.id)
    .maybeSingle();

  const existing = outgoing ?? incoming;

  if (existing) {
    if (existing.status === "accepted") {
      return { status: "accepted" };
    }
    if (existing.status === "declined") {
      return { status: "declined" };
    }
    if (existing.from_id === toId && existing.status === "pending") {
      const { error } = await supabase
        .from("connect_requests")
        .update({ status: "accepted" })
        .eq("id", existing.id);
      if (error) return { error: error.message };
      revalidatePath("/discover");
      revalidatePath("/profile");
      return { status: "accepted" };
    }
    return { status: "outgoing_pending" };
  }

  const { error } = await supabase.from("connect_requests").insert({
    from_id: user.id,
    to_id: toId,
    status: "pending",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/discover");
  revalidatePath("/profile");
  return { status: "outgoing_pending" };
}

export async function respondToConnect(
  fromId: string,
  decision: "accepted" | "declined"
): Promise<{ error?: string; status?: ConnectState }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Session expired." };
  if (!isUuid(fromId) || user.id === fromId) return { error: "Invalid partner." };

  const { data: existing } = await supabase
    .from("connect_requests")
    .select("id, status")
    .eq("from_id", fromId)
    .eq("to_id", user.id)
    .maybeSingle();

  if (!existing || existing.status !== "pending") {
    return { error: "No pending request from that operator." };
  }

  const { error } = await supabase
    .from("connect_requests")
    .update({ status: decision })
    .eq("id", existing.id);

  if (error) return { error: error.message };

  revalidatePath("/discover");
  revalidatePath("/profile");
  return { status: decision };
}
