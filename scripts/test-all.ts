import { createClient } from '@supabase/supabase-js';
import { vibeScore, rankMatches } from '../lib/match';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function testAll() {
  console.log('=== 1. Testing Vibe Score & Ranking Logic ===');
  const v1 = { pace: 4, comms: 4, risk: 2, energy: 5 };
  const v2 = { pace: 4, comms: 4, risk: 2, energy: 5 };
  const v3 = { pace: 1, comms: 1, risk: 5, energy: 1 };
  
  const scoreIdentical = vibeScore(v1, v2);
  console.log('Score for identical vibes (expected 100):', scoreIdentical);
  if (scoreIdentical !== 100) throw new Error('Identical vibe score fail');

  const scoreDiff = vibeScore(v1, v3);
  console.log('Score for opposite vibes (expected < 50):', scoreDiff);

  const me = {
    id: 'user-1',
    looking_for: 'coder' as const,
    vibe: v1,
  };
  const others = [
    {
      profile: { id: 'u2', codename: 'ARJUN', role: 'coder' as const, looking_for: 'designer' as const, bio: null, onboarding_complete: true },
      vibe: v2,
    },
    {
      profile: { id: 'u3', codename: 'LUNA', role: 'coder' as const, looking_for: 'maker' as const, bio: null, onboarding_complete: true },
      vibe: v3,
    },
    {
      profile: { id: 'u4', codename: 'ALEX', role: 'designer' as const, looking_for: 'writer' as const, bio: null, onboarding_complete: true },
      vibe: v2,
    },
  ];

  const ranked = rankMatches(me, others);
  console.log('Ranked matches count (expected 2 coders, designer filtered out):', ranked.length);
  if (ranked.length !== 2) throw new Error('Role filtering fail');
  if (ranked[0].profile.codename !== 'ARJUN') throw new Error('Ranking order fail');
  console.log('Top match:', ranked[0].profile.codename, 'Score:', ranked[0].score);

  console.log('\n=== 2. Testing Supabase Auth & Database Flows ===');
  const supabaseRiya = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: riyaAuth, error: riyaErr } = await supabaseRiya.auth.signInWithPassword({
    email: 'riya.designs@example.com',
    password: 'DemoPartner1!',
  });
  if (riyaErr || !riyaAuth.user) throw new Error(`Riya sign-in failed: ${riyaErr?.message}`);
  console.log('Riya signed in successfully. User ID:', riyaAuth.user.id);

  // Fetch Riya profile
  const { data: riyaProfile } = await supabaseRiya
    .from('profiles')
    .select('*')
    .eq('id', riyaAuth.user.id)
    .single();
  console.log('Riya profile fetched:', riyaProfile.codename, '| Role:', riyaProfile.role, '| Looking for:', riyaProfile.looking_for);

  // Fetch completed operators as Riya
  const { data: allProfiles } = await supabaseRiya.from('profiles').select('*').eq('onboarding_complete', true);
  const { data: allVibes } = await supabaseRiya.from('vibe_answers').select('*');
  console.log(`Fetched ${allProfiles?.length} profiles and ${allVibes?.length} vibe answers from DB.`);

  // Test Connect Request: Riya connects with dev.arjun
  const { data: arjunProfile } = await supabaseRiya.from('profiles').select('*').eq('codename', 'DEV_ARJUN').single();
  console.log('Found Dev Arjun ID:', arjunProfile.id);

  // Clear existing connect request between them if any to ensure clean test
  const { data: existingConnect } = await supabaseRiya
    .from('connect_requests')
    .select('*')
    .or(`and(from_id.eq.${riyaAuth.user.id},to_id.eq.${arjunProfile.id}),and(from_id.eq.${arjunProfile.id},to_id.eq.${riyaAuth.user.id})`);
  
  if (existingConnect && existingConnect.length > 0) {
    await supabaseRiya.from('connect_requests').delete().eq('id', existingConnect[0].id);
  }

  // Riya sends connect to Arjun
  const { data: conn1, error: connErr1 } = await supabaseRiya.from('connect_requests').insert({
    from_id: riyaAuth.user.id,
    to_id: arjunProfile.id,
    status: 'pending',
  }).select().single();
  if (connErr1) throw new Error(`Connect request insertion failed: ${connErr1.message}`);
  console.log('Riya -> Arjun connect request status:', conn1.status);

  // Sign in as Dev Arjun and accept (mutual connect)
  const supabaseArjun = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: arjunAuth } = await supabaseArjun.auth.signInWithPassword({
    email: 'dev.arjun@example.com',
    password: 'DemoPartner1!',
  });
  if (!arjunAuth.user) throw new Error('Arjun sign-in failed');
  console.log('Arjun signed in successfully.');

  // Arjun accepts Riya's request
  const { data: conn2, error: connErr2 } = await supabaseArjun
    .from('connect_requests')
    .update({ status: 'accepted' })
    .eq('id', conn1.id)
    .select()
    .single();
  if (connErr2) throw new Error(`Arjun acceptance failed: ${connErr2.message}`);
  console.log('Arjun accepted connect request status:', conn2.status);
  if (conn2.status !== 'accepted') throw new Error('Mutual connection test failed');

  console.log('\n=== 3. Testing HTTP Pages on Local Server ===');
  const urls = ['http://localhost:3000/', 'http://localhost:3000/login', 'http://localhost:3000/discover', 'http://localhost:3000/profile', 'http://localhost:3000/onboarding'];
  for (const url of urls) {
    const res = await fetch(url, { redirect: 'manual' });
    console.log(`HTTP ${res.status} for ${url}`);
    if (res.status !== 200 && res.status !== 307 && res.status !== 302 && res.status !== 308) {
      throw new Error(`Unexpected status ${res.status} for ${url}`);
    }
  }

  console.log('\n✅ ALL TESTS PASSED SUCCESSFULLY!');
}

testAll().catch((err) => {
  console.error('❌ TEST FAILED:', err);
  process.exit(1);
});
