import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type DemoUser = {
  email: string;
  codename: string;
  role: "coder" | "designer" | "writer" | "maker";
  looking_for: "coder" | "designer" | "writer" | "maker";
  bio: string;
  pace: number;
  comms: number;
  risk: number;
  energy: number;
};

const DEMOS: DemoUser[] = [
  {
    email: "riya.designs@example.com",
    codename: "RIYA_DESIGNS",
    role: "designer",
    looking_for: "coder",
    bio: "Interfaces that feel like a product, not a mock.",
    pace: 3,
    comms: 4,
    risk: 3,
    energy: 4,
  },
  {
    email: "dev.arjun@example.com",
    codename: "DEV_ARJUN",
    role: "coder",
    looking_for: "designer",
    bio: "Full-stack, ships weekly, hates giant specs.",
    pace: 4,
    comms: 3,
    risk: 4,
    energy: 3,
  },
  {
    email: "kai.scripts@example.com",
    codename: "KAI_SCRIPTS",
    role: "writer",
    looking_for: "maker",
    bio: "Narrative and docs for weird tools.",
    pace: 2,
    comms: 5,
    risk: 2,
    energy: 4,
  },
  {
    email: "neo.maker@example.com",
    codename: "NEO_MAKER",
    role: "maker",
    looking_for: "writer",
    bio: "Hardware-ish prototypes and physical installs.",
    pace: 3,
    comms: 2,
    risk: 5,
    energy: 2,
  },
  {
    email: "luna.code@example.com",
    codename: "LUNA_CODE",
    role: "coder",
    looking_for: "maker",
    bio: "ML tinkerer looking for someone who builds in the real world.",
    pace: 5,
    comms: 2,
    risk: 4,
    energy: 1,
  },
  {
    email: "alex.growth@example.com",
    codename: "ALEX_GROWTH",
    role: "designer",
    looking_for: "writer",
    bio: "Growth experiments with a design brain.",
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
      role: demo.role,
      looking_for: demo.looking_for,
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
  }

  console.log("Seed complete. Demo password:", PASSWORD);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
