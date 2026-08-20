"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isOperatorRole } from "@/lib/types";

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
  const bio = String(formData.get("bio") ?? "").trim() || null;

  const pace = Number(formData.get("pace"));
  const comms = Number(formData.get("comms"));
  const risk = Number(formData.get("risk"));
  const energy = Number(formData.get("energy"));

  if (codename.length < 2) {
    return { error: "Codename required (at least 2 characters)." };
  }
  if (!isOperatorRole(role) || !isOperatorRole(lookingFor)) {
    return { error: "Select both I AM and I NEED." };
  }
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

  revalidatePath("/discover");
  revalidatePath("/profile");
  redirect("/discover");
}

export async function sendConnect(toId: string): Promise<{ error?: string; status?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Session expired." };
  }
  if (user.id === toId) {
    return { error: "Cannot connect to yourself." };
  }

  const { data: existing } = await supabase
    .from("connect_requests")
    .select("id, from_id, to_id, status")
    .or(
      `and(from_id.eq.${user.id},to_id.eq.${toId}),and(from_id.eq.${toId},to_id.eq.${user.id})`
    )
    .maybeSingle();

  if (existing) {
    if (existing.status === "accepted") {
      return { status: "accepted" };
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
    return { status: existing.status };
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
  return { status: "pending" };
}
