const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://sohchlkqbhsjobmamblq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvaGNobGtxYmhzam9ibWFtYmxxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzIyODE5OSwiZXhwIjoyMTAyODA0MTk5fQ.FAsJCAzjfpbBMC4y95SyiCwUvUIkzDCH5V8yEeOg8N4"
);

async function main() {
  const { data: profiles } = await supabase.from("profiles").select("*").eq("onboarding_complete", true);
  const { data: vibes } = await supabase.from("vibe_answers").select("*");

  const vibeByUser = new Map();
  for (const row of vibes || []) {
    vibeByUser.set(row.user_id, row);
  }

  const validProfiles = (profiles || []).filter(p => {
    return Boolean(p.industry_category && p.professional_title && p.looking_for_category && p.looking_for_title);
  });

  const finalPool = validProfiles.flatMap(profile => {
    const vibe = vibeByUser.get(profile.id);
    return vibe ? [{ profile, vibe }] : [];
  });

  console.log("Total valid profiles with vibe:", finalPool.length);
  finalPool.forEach(p => console.log(p.profile.codename, p.profile.id));
}

main();
