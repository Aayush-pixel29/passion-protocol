import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { IndustryCategory } from "../lib/types";

type DemoUser = {
  email: string;
  codename: string;
  full_name: string;
  industry_category: IndustryCategory;
  professional_title: string;
  looking_for_category: IndustryCategory;
  looking_for_title: string;
  spoken_languages: string[];
  bio: string;
  contact_url: string;
  pace: number;
  comms: number;
  risk: number;
  energy: number;
};

const DEMOS: DemoUser[] = [
  {
    email: "riya.designs@example.com",
    codename: "RIYA_DESIGNS",
    full_name: "Riya Sharma",
    industry_category: "Creative & Design",
    professional_title: "UI/UX & Product Designer",
    looking_for_category: "Software & IT",
    looking_for_title: "Full-Stack Engineer",
    spoken_languages: ["English", "Hindi"],
    bio: "Interfaces that feel like a product, not a mock.",
    contact_url: "x.com/riya_designs",
    pace: 3,
    comms: 4,
    risk: 3,
    energy: 4,
  },
  {
    email: "dev.arjun@example.com",
    codename: "DEV_ARJUN",
    full_name: "Arjun Patel",
    industry_category: "Software & IT",
    professional_title: "Full-Stack Engineer",
    looking_for_category: "Creative & Design",
    looking_for_title: "Product Designer",
    spoken_languages: ["English", "Gujarati"],
    bio: "Full-stack, ships weekly, hates giant specs.",
    contact_url: "github.com/devarjun",
    pace: 4,
    comms: 3,
    risk: 4,
    energy: 3,
  },
  {
    email: "kai.scripts@example.com",
    codename: "KAI_SCRIPTS",
    full_name: "Kai Sterling",
    industry_category: "Marketing & Content",
    professional_title: "Technical Storyteller & Copywriter",
    looking_for_category: "Engineering & Hardware",
    looking_for_title: "Hardware Prototyper",
    spoken_languages: ["English", "Japanese"],
    bio: "Narrative and docs for weird tools.",
    contact_url: "kai.substack.com",
    pace: 2,
    comms: 5,
    risk: 2,
    energy: 4,
  },
  {
    email: "neo.maker@example.com",
    codename: "NEO_MAKER",
    full_name: "Neo Vance",
    industry_category: "Engineering & Hardware",
    professional_title: "Hardware & IoT Systems Maker",
    looking_for_category: "Marketing & Content",
    looking_for_title: "Growth Writer",
    spoken_languages: ["English", "German"],
    bio: "Hardware-ish prototypes and physical installs.",
    contact_url: "x.com/neo_maker",
    pace: 3,
    comms: 2,
    risk: 5,
    energy: 2,
  },
  {
    email: "luna.code@example.com",
    codename: "LUNA_CODE",
    full_name: "Luna Chen",
    industry_category: "Software & IT",
    professional_title: "AI/ML Systems Researcher",
    looking_for_category: "Engineering & Hardware",
    looking_for_title: "Robotics Maker",
    spoken_languages: ["English", "Mandarin"],
    bio: "ML tinkerer looking for someone who builds in the real world.",
    contact_url: "github.com/luna-code",
    pace: 5,
    comms: 2,
    risk: 4,
    energy: 1,
  },
  {
    email: "alex.growth@example.com",
    codename: "ALEX_GROWTH",
    full_name: "Alex Rivera",
    industry_category: "Business & Sales",
    professional_title: "Growth & GTM Strategist",
    looking_for_category: "Marketing & Content",
    looking_for_title: "Content Lead",
    spoken_languages: ["English", "Spanish"],
    bio: "Growth experiments with a design brain.",
    contact_url: "alexgrowth@example.com",
    pace: 4,
    comms: 5,
    risk: 3,
    energy: 5,
  },
];

const PASSWORD = "DemoPartner1!";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  try {
    const text = readFileSync(path, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // rely on process env
  }
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service || service.includes("your-service-role")) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  for (const demo of DEMOS) {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: demo.email,
      password: PASSWORD,
      email_confirm: true,
    });

    let userId = created.user?.id;

    if (createError) {
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list.users.find((u) => u.email === demo.email);
      if (!existing) {
        console.error(`Failed ${demo.email}:`, createError.message);
        continue;
      }
      userId = existing.id;
      console.log(`Exists ${demo.email}, updating profile`);
    } else {
      console.log(`Created ${demo.email}`);
    }

    if (!userId) continue;

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      codename: demo.codename,
      full_name: demo.full_name,
      industry_category: demo.industry_category,
      professional_title: demo.professional_title,
      looking_for_category: demo.looking_for_category,
      looking_for_title: demo.looking_for_title,
      spoken_languages: demo.spoken_languages,
      bio: demo.bio,
      onboarding_complete: true,
    });
    if (profileError) {
      console.error(`Profile ${demo.codename}:`, profileError.message);
      continue;
    }

    const { error: vibeError } = await supabase.from("vibe_answers").upsert({
      user_id: userId,
      pace: demo.pace,
      comms: demo.comms,
      risk: demo.risk,
      energy: demo.energy,
    });
    if (vibeError) {
      console.error(`Vibe ${demo.codename}:`, vibeError.message);
    }

    const { error: linkError } = await supabase.from("profile_links").upsert({
      user_id: userId,
      contact_url: demo.contact_url,
    });
    if (linkError) {
      console.error(`Link ${demo.codename}:`, linkError.message);
    }
  }

  console.log("Seed complete. Demo password:", PASSWORD);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
