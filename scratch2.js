const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://sohchlkqbhsjobmamblq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvaGNobGtxYmhzam9ibWFtYmxxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzIyODE5OSwiZXhwIjoyMTAyODA0MTk5fQ.FAsJCAzjfpbBMC4y95SyiCwUvUIkzDCH5V8yEeOg8N4"
);
async function main() { 
  const { data } = await supabase.from("vibe_answers").select("*"); 
  console.log(JSON.stringify(data, null, 2)); 
} 
main();
