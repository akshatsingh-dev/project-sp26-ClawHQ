import { BizTool, Mode, OnboardingState } from "@/lib/types";

export const DEFAULT_MODEL = "claude-sonnet-4-6";

export const MODE_LABELS: Record<Mode, string> = {
  easy: "EasyClaw",
  nano: "NanoClaw"
};

export const PERSONAL_CHANNELS = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "slack", label: "Slack" },
  { id: "discord", label: "Discord" },
  { id: "imessage", label: "iMessage" },
  { id: "signal", label: "Signal" },
  { id: "google-chat", label: "Google Chat" }
] as const;

export const BUSINESS_CHANNELS = [
  { id: "slack", label: "Slack" },
  { id: "microsoft-teams", label: "Microsoft Teams" },
  { id: "whatsapp-business", label: "WhatsApp Business" },
  { id: "discord", label: "Discord" },
  { id: "google-chat", label: "Google Chat" }
] as const;

export const BUSINESS_TOOLS: { id: BizTool; label: string; category: string }[] = [
  { id: "hubspot", label: "HubSpot", category: "CRM" },
  { id: "salesforce", label: "Salesforce", category: "CRM" },
  { id: "google-calendar", label: "Google Calendar", category: "Calendar" },
  { id: "outlook-calendar", label: "Outlook Calendar", category: "Calendar" },
  { id: "gmail", label: "Gmail", category: "Email" },
  { id: "outlook-email", label: "Outlook Email", category: "Email" },
  { id: "google-drive", label: "Google Drive", category: "Docs" },
  { id: "notion", label: "Notion", category: "Docs" },
  { id: "linear", label: "Linear", category: "Projects" },
  { id: "jira", label: "Jira", category: "Projects" },
  { id: "stripe", label: "Stripe", category: "Billing" },
  { id: "quickbooks", label: "QuickBooks", category: "Billing" }
];

export const MODEL_OPTIONS = ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5"];

export const STORAGE_KEY = "easyclaw-onboarding-state";

export const DEFAULT_STATE: OnboardingState = {
  mode: "easy",
  channels: ["whatsapp"],
  tools: [],
  apiKey: "",
  model: DEFAULT_MODEL,
  teamInvites: [],
  demoMode: true,
  currentStep: 0
};
