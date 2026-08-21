-- 006: Intent Filters & Micro-Contract Templates
-- Adds intent_filter to profiles for matching by purpose (Hackathon, Side Project, etc.)
-- Adds contract_type, revenue split fields to partnership_contracts

-- 1. Intent filter on profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS intent_filter text DEFAULT NULL;

-- 2. Expand partnership_contracts with template types and revenue splits
ALTER TABLE partnership_contracts
  ADD COLUMN IF NOT EXISTS contract_type text DEFAULT 'custom',
  ADD COLUMN IF NOT EXISTS revenue_split_a integer DEFAULT 50,
  ADD COLUMN IF NOT EXISTS revenue_split_b integer DEFAULT 50,
  ADD COLUMN IF NOT EXISTS platform_fee_pct integer DEFAULT 20;
