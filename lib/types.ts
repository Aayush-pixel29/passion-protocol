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
  bio: string | null;
  contact_url?: string | null;
  onboarding_complete: boolean;
};

export function isValidCategory(value: string): boolean {
  return (INDUSTRY_CATEGORIES as readonly string[]).includes(value);
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
  status: PartnershipStatus;
  created_at: string;
};
