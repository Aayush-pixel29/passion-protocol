export const INDUSTRY_CATEGORIES = [
  "Software & IT",
  "Engineering & Hardware",
  "Creative & Design",
  "Business & Sales",
  "Marketing & Content",
  "Other"
] as const;

export type IndustryCategory = (typeof INDUSTRY_CATEGORIES)[number];

export const CATEGORY_ICONS: Record<string, string> = {
  "Software & IT": "💻",
  "Engineering & Hardware": "⚙️",
  "Creative & Design": "🎨",
  "Business & Sales": "📈",
  "Marketing & Content": "✍️",
  "Other": "🛠️",
};

// Intent Filters — what kind of collaboration are you looking for?
export const INTENT_FILTERS = [
  "Hackathon",
  "Side Project",
  "VC Startup",
  "Open Source",
  "Freelance",
] as const;

export type IntentFilter = (typeof INTENT_FILTERS)[number];

export const INTENT_ICONS: Record<string, string> = {
  "Hackathon": "🏆",
  "Side Project": "🛠️",
  "VC Startup": "🚀",
  "Open Source": "🌍",
  "Freelance": "💼",
};

// Micro-Contract Templates
export const CONTRACT_TEMPLATES = [
  { key: "5050_revenue", label: "50/50 Revenue Split", splitA: 50, splitB: 50, platformFee: 20, description: "Equal revenue split after 20% platform fee" },
  { key: "6040_revenue", label: "60/40 Revenue Split", splitA: 60, splitB: 40, platformFee: 20, description: "Lead partner gets 60%, contributor 40% after platform fee" },
  { key: "prize_share", label: "Prize Share Agreement", splitA: 50, splitB: 50, platformFee: 20, description: "For hackathon/competition winnings — equal split after fee" },
  { key: "portfolio_only", label: "Portfolio Only (Zero-Earning)", splitA: 0, splitB: 0, platformFee: 0, description: "$0 revenue — both parties retain portfolio rights only" },
  { key: "custom", label: "Custom Terms", splitA: 50, splitB: 50, platformFee: 20, description: "Define your own split and terms" },
] as const;

export type ContractTemplateKey = (typeof CONTRACT_TEMPLATES)[number]["key"];

export type VibeAnswers = {
  pace: number;
  comms: number;
  risk: number;
  energy: number;
};

export type ConnectState =
  | "none"
  | "outgoing_pending"
  | "incoming_pending"
  | "accepted"
  | "declined";

export type Profile = {
  id: string;
  codename: string;
  full_name: string | null;
  location: string | null;
  phone_number: string | null;
  linkedin_url: string | null;
  spoken_languages: string[];
  industry_category: string | null;
  professional_title: string | null;
  looking_for_category: string | null;
  looking_for_title: string | null;
  intent_filter: string | null;
  bio: string | null;
  contact_url?: string | null;
  onboarding_complete: boolean;
};

export function isValidCategory(value: string): boolean {
  return (INDUSTRY_CATEGORIES as readonly string[]).includes(value);
}

export function isValidIntent(value: string): boolean {
  return (INTENT_FILTERS as readonly string[]).includes(value);
}

export function formatRoleWithIcon(category: string | null | undefined, title: string | null | undefined): string {
  if (!category || !title) return "UNSET";
  const icon = CATEGORY_ICONS[category] || "🧑‍💻";
  return `${icon} ${title}`;
}

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  budget_range: string | null;
  created_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read_status: boolean;
  created_at: string;
};

export type PartnershipStatus = "pending" | "accepted" | "declined" | "paid";

export type PartnershipContract = {
  id: string;
  connect_request_id: string;
  proposed_by: string;
  proposed_to: string;
  price_amount: number;
  deliverables: string;
  contract_type: string;
  revenue_split_a: number;
  revenue_split_b: number;
  platform_fee_pct: number;
  status: PartnershipStatus;
  payment_status?: string;
  created_at: string;
};

export type WorkspaceFile = {
  id: string;
  contract_id: string;
  uploaded_by: string;
  path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

export type WorkspaceEmbed = {
  id: string;
  contract_id: string;
  added_by: string;
  embed_type: "figma" | "github" | "notion" | "other";
  url: string;
  title: string | null;
  created_at: string;
};
