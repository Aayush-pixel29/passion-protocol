export const ROLES = ["coder", "designer", "writer", "maker"] as const;

export type OperatorRole = (typeof ROLES)[number];

export const ROLE_ICONS: Record<OperatorRole, string> = {
  coder: "💻",
  designer: "🎨",
  writer: "✍️",
  maker: "🛠️",
};

export const ROLE_LABELS: Record<OperatorRole, string> = {
  coder: "Coder",
  designer: "Designer",
  writer: "Writer",
  maker: "Maker",
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
  role: OperatorRole | null;
  looking_for: OperatorRole | null;
  bio: string | null;
  contact_url?: string | null;
  onboarding_complete: boolean;
};

export function isOperatorRole(value: string): value is OperatorRole {
  return (ROLES as readonly string[]).includes(value);
}

export function formatRole(role: OperatorRole | null | undefined): string {
  if (!role) return "UNSET";
  return role.toUpperCase();
}

export function formatRoleWithIcon(role: OperatorRole | null | undefined): string {
  if (!role || !isOperatorRole(role)) return "UNSET";
  return `${ROLE_ICONS[role]} ${ROLE_LABELS[role]}`;
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
