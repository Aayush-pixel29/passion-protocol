"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type ConnectState } from "@/lib/types";

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

export async function deleteAccount(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Session expired." };
  }

  // Calls the RPC created in 003_delete_user.sql
  const { error } = await supabase.rpc("delete_user");
  
  if (error) {
    return { error: error.message };
  }
  
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
  
  // New fields
  const full_name = String(formData.get("full_name") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const phone_number = String(formData.get("phone_number") ?? "").trim() || null;
  const linkedin_url = String(formData.get("linkedin_url") ?? "").trim() || null;
  
  const rawLangs = String(formData.get("spoken_languages") ?? "").trim();
  const spoken_languages = rawLangs ? rawLangs.split(",").map(l => l.trim()).filter(Boolean) : [];
  
  const industry_category = String(formData.get("industry_category") ?? "");
  const professional_title = String(formData.get("professional_title") ?? "").trim();
  const looking_for_category = String(formData.get("looking_for_category") ?? "");
  const looking_for_title = String(formData.get("looking_for_title") ?? "").trim();

  const bioRaw = String(formData.get("bio") ?? "").trim();
  const bio = bioRaw ? bioRaw.slice(0, 280) : null;
  const contactUrlRaw = String(formData.get("contactUrl") ?? "").trim();
  const contactUrl = contactUrlRaw ? contactUrlRaw.slice(0, 200) : null;

  if (!CODENAME_RE.test(codename)) {
    return { error: "Codename must be 2–32 letters, numbers, or underscores." };
  }
  if (!industry_category || !professional_title || !looking_for_category || !looking_for_title) {
    return { error: "Professional details are required." };
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
    full_name,
    location,
    phone_number,
    linkedin_url,
    spoken_languages,
    industry_category,
    professional_title,
    looking_for_category,
    looking_for_title,
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

  // Rate limiting: count outgoing requests in last 24h
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from("connect_requests")
    .select("*", { count: "exact", head: true })
    .eq("from_id", user.id)
    .gte("created_at", oneDayAgo);

  if (countError) {
    return { error: "Failed to verify rate limits." };
  }
  if (count !== null && count >= 30) {
    return { error: "Daily connect limit reached. You can only send 30 requests per 24 hours." };
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

export async function saveProject(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Session expired." };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const budget_range = String(formData.get("budget_range") ?? "").trim();

  if (title.length < 3 || title.length > 100) return { error: "Title must be 3-100 characters." };
  if (description.length < 10 || description.length > 1000) return { error: "Description must be 10-1000 characters." };

  const { error } = await supabase.from("projects").upsert({
    user_id: user.id,
    title,
    description,
    budget_range: budget_range || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/profile");
  revalidatePath("/discover");
  return {};
}

export async function sendMessage(receiverId: string, content: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Session expired." };
  
  if (!content.trim()) return { error: "Message cannot be empty." };

  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    receiver_id: receiverId,
    content: content.trim(),
  });

  if (error) return { error: error.message };
  revalidatePath("/messages");
  return {};
}

export async function proposePartnership(
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Session expired." };

  const connectRequestId = String(formData.get("connect_request_id"));
  const proposedTo = String(formData.get("proposed_to"));
  const priceAmount = Number(formData.get("price_amount"));
  const deliverables = String(formData.get("deliverables")).trim();

  if (priceAmount < 0) return { error: "Price cannot be negative." };
  if (!deliverables) return { error: "Deliverables are required." };

  const { error } = await supabase.from("partnership_contracts").insert({
    connect_request_id: connectRequestId,
    proposed_by: user.id,
    proposed_to: proposedTo,
    price_amount: priceAmount,
    deliverables,
  });

  if (error) return { error: error.message };
  revalidatePath("/messages");
  return {};
}
