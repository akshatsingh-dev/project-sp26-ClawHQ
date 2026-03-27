export type Mode = "easy" | "nano";

export type PersonalChannel =
  | "whatsapp"
  | "telegram"
  | "slack"
  | "discord"
  | "imessage"
  | "signal"
  | "google-chat";

export type BizChannel =
  | "slack"
  | "microsoft-teams"
  | "whatsapp-business"
  | "discord"
  | "google-chat";

export type BizTool =
  | "hubspot"
  | "salesforce"
  | "google-calendar"
  | "outlook-calendar"
  | "gmail"
  | "outlook-email"
  | "google-drive"
  | "notion"
  | "linear"
  | "jira"
  | "stripe"
  | "quickbooks";

export type TeamInvite = {
  email: string;
  role: "admin" | "member";
};

export type OnboardingState = {
  mode: Mode;
  channels: string[];
  tools: string[];
  apiKey: string;
  model: string;
  teamInvites: TeamInvite[];
  demoMode: boolean;
  currentStep: number;
};
