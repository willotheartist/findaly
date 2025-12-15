export type MockTool = {
  slug: string;
  name: string;
  primaryCategory: string;
  shortDescription: string;
  pricingModel: "FREE" | "FREEMIUM" | "PAID" | "ENTERPRISE";
  startingPrice?: string;
  keyFeatures?: string[];
  targetAudience?: string[];
  integrations?: string[];
  websiteUrl?: string;
};

export const mockTools: MockTool[] = [
  {
    slug: "notion",
    name: "Notion",
    primaryCategory: "Productivity",
    shortDescription: "Docs, wikis, and project management in one workspace.",
    pricingModel: "FREEMIUM",
    startingPrice: "Free / from $10 per user",
    keyFeatures: ["Docs", "Wikis", "Databases", "Projects"],
    targetAudience: ["founders", "teams", "creators"],
    integrations: ["Slack", "Google Drive", "Zapier"],
    websiteUrl: "https://www.notion.so",
  },
  {
    slug: "clickup",
    name: "ClickUp",
    primaryCategory: "Productivity",
    shortDescription: "All-in-one project management with tasks, docs, and goals.",
    pricingModel: "FREEMIUM",
    startingPrice: "Free / from $10 per user",
    keyFeatures: ["Tasks", "Docs", "Dashboards"],
    targetAudience: ["teams", "agencies"],
    integrations: ["Slack", "GitHub", "Google Calendar"],
    websiteUrl: "https://clickup.com",
  },
];
