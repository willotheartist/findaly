import "dotenv/config";
import { PrismaClient, PricingModel } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

// Local enum type to match Prisma ToolStatus values (works regardless of Prisma enum export style)

function slugify(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeTokens(arr: string[] | undefined) {
  return (arr ?? [])
    .map((x) => x.toLowerCase().trim())
    .filter(Boolean);
}

function normalizeToolStatus(input: unknown): "ACTIVE" | "DRAFT" | "DISCONTINUED" {
  const v = String(input ?? "").trim().toUpperCase();
  if (v === "ACTIVE" || v === "1") return "ACTIVE";
  if (v === "DRAFT") return "DRAFT";
  if (v === "DISCONTINUED" || v === "INACTIVE") return "DISCONTINUED";
  return "ACTIVE";
}

/**
 * A bigger MVP use-case library so /best pages actually scale.
 * Keep slugs stable – they become URLs.
 */
const useCaseDefs: Array<{ name: string; slug: string }> = [
  // General segments
  { name: "For startups", slug: "startups" },
  { name: "For freelancers", slug: "freelancers" },
  { name: "For agencies", slug: "agencies" },
  { name: "For creators", slug: "creators" },
  { name: "For small businesses", slug: "small-businesses" },
  { name: "For enterprises", slug: "enterprises" },
  { name: "For teams", slug: "teams" },
  { name: "For individuals", slug: "individuals" },

  // Workflow / intent
  { name: "Project planning", slug: "project-planning" },
  { name: "Task management", slug: "task-management" },
  { name: "Docs & knowledge base", slug: "docs-knowledge-base" },
  { name: "Note taking", slug: "note-taking" },
  { name: "Collaboration", slug: "collaboration" },

  // Design
  { name: "UI design", slug: "ui-design" },
  { name: "Prototyping", slug: "prototyping" },
  { name: "Website building", slug: "website-building" },
  { name: "Brand design", slug: "brand-design" },

  // Marketing / Growth
  { name: "Email marketing", slug: "email-marketing" },
  { name: "Marketing automation", slug: "marketing-automation" },
  { name: "SEO", slug: "seo" },
  { name: "Content marketing", slug: "content-marketing" },

  // Analytics
  { name: "Website analytics", slug: "website-analytics" },
  { name: "Product analytics", slug: "product-analytics" },

  // Sales
  { name: "CRM", slug: "crm" },
  { name: "Pipeline management", slug: "pipeline-management" },

  // Support
  { name: "Live chat", slug: "live-chat" },
  { name: "Help desk", slug: "help-desk" },

  // Engineering
  { name: "Code hosting", slug: "code-hosting" },
  { name: "CI/CD", slug: "ci-cd" },
  { name: "Frontend deployment", slug: "frontend-deployment" },
];

function inferUseCases(input: {
  primaryCategory: string;
  targetAudience?: string[];
  keyFeatures?: string[];
  integrations?: string[];
}): string[] {
  const cat = slugify(input.primaryCategory);
  const ta = normalizeTokens(input.targetAudience);
  const features = normalizeTokens(input.keyFeatures);
  const integrations = normalizeTokens(input.integrations);

  const out = new Set<string>();

  // ---- audience-based ----
  if (ta.some((x) => ["founders", "startup", "startups"].includes(x))) out.add("startups");
  if (ta.some((x) => ["freelancers", "freelancer"].includes(x))) out.add("freelancers");
  if (ta.some((x) => ["agencies", "agency"].includes(x))) out.add("agencies");
  if (ta.some((x) => ["creators", "creator"].includes(x))) out.add("creators");
  if (ta.some((x) => x.includes("enterprise") || x.includes("enterprises"))) out.add("enterprises");
  if (ta.some((x) => x.includes("team") || x.includes("teams"))) out.add("teams");
  if (ta.some((x) => x.includes("individual") || x.includes("individuals"))) out.add("individuals");
  if (ta.some((x) => x.includes("business") || x.includes("businesses"))) out.add("small-businesses");

  // ---- feature-based ----
  if (features.some((x) => x.includes("project") || x.includes("timeline") || x.includes("goals")))
    out.add("project-planning");

  if (features.some((x) => x.includes("task") || x.includes("tasks") || x.includes("priorit")))
    out.add("task-management");

  if (features.some((x) => x.includes("docs") || x.includes("wikis") || x.includes("knowledge")))
    out.add("docs-knowledge-base");

  if (features.some((x) => x.includes("note") || x.includes("notes") || x.includes("web clipper")))
    out.add("note-taking");

  if (features.some((x) => x.includes("collab") || x.includes("collaboration")))
    out.add("collaboration");

  if (features.some((x) => x.includes("ui") || x.includes("interface"))) out.add("ui-design");
  if (features.some((x) => x.includes("prototype") || x.includes("prototyping"))) out.add("prototyping");
  if (features.some((x) => x.includes("cms") || x.includes("hosting") || x.includes("website")))
    out.add("website-building");
  if (features.some((x) => x.includes("brand") || x.includes("brand kits"))) out.add("brand-design");

  if (features.some((x) => x.includes("email"))) out.add("email-marketing");
  if (features.some((x) => x.includes("automation"))) out.add("marketing-automation");
  if (features.some((x) => x.includes("seo") || x.includes("backlink") || x.includes("keyword")))
    out.add("seo");

  if (features.some((x) => x.includes("analytics") || x.includes("traffic") || x.includes("behavior")))
    out.add("website-analytics");

  if (features.some((x) => x.includes("funnels") || x.includes("cohorts")))
    out.add("product-analytics");

  if (features.some((x) => x.includes("crm"))) out.add("crm");
  if (features.some((x) => x.includes("pipeline") || x.includes("pipelines"))) out.add("pipeline-management");

  if (features.some((x) => x.includes("live chat") || x.includes("chat"))) out.add("live-chat");
  if (features.some((x) => x.includes("ticket") || x.includes("help desk"))) out.add("help-desk");

  if (features.some((x) => x.includes("repo") || x.includes("repositories"))) out.add("code-hosting");
  if (features.some((x) => x.includes("ci/cd") || x.includes("ci") || x.includes("cd"))) out.add("ci-cd");
  if (features.some((x) => x.includes("deployment") || x.includes("hosting"))) out.add("frontend-deployment");

  // ---- category fallback signals (ensures each category has SOME use-cases) ----
  if (cat === "productivity") {
    out.add("docs-knowledge-base");
    out.add("note-taking");
    out.add("task-management");
  }
  if (cat === "project-management") {
    out.add("project-planning");
    out.add("task-management");
    out.add("collaboration");
  }
  if (cat === "design") {
    out.add("ui-design");
    out.add("prototyping");
    out.add("website-building");
  }
  if (cat === "marketing") {
    out.add("email-marketing");
    out.add("marketing-automation");
    out.add("seo");
  }
  if (cat === "analytics") {
    out.add("website-analytics");
    out.add("product-analytics");
  }
  if (cat === "sales") {
    out.add("crm");
    out.add("pipeline-management");
  }
  if (cat === "customer-support") {
    out.add("live-chat");
    out.add("help-desk");
  }
  if (cat === "engineering") {
    out.add("code-hosting");
    out.add("ci-cd");
    out.add("frontend-deployment");
  }

  // ---- integration hints (lightweight) ----
  if (integrations.some((x) => x.includes("slack"))) out.add("collaboration");
  if (integrations.some((x) => x.includes("github"))) out.add("ci-cd");

  // Keep to a reasonable number per tool (helps relevance)
  return Array.from(out).slice(0, 8);
}

type SeedTool = {
  name: string;
  slug: string;
  shortDescription: string;
  longDescription?: string;
  websiteUrl?: string | null;
  logoUrl?: string | null;

  primaryCategory: string;

  pricingModel: PricingModel;
  startingPrice?: string;
  pricingNotes?: string;

  targetAudience?: string[];
  keyFeatures?: string[];
  integrations?: string[];

  isFeatured?: boolean;
  status?: string;
};

// ----------------------------
// Synthetic tool generation
// ----------------------------

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rnd: () => number, arr: T[]) {
  return arr[Math.floor(rnd() * arr.length)];
}

function pickMany<T>(rnd: () => number, arr: T[], min: number, max: number) {
  const n = Math.max(min, Math.min(max, Math.floor(rnd() * (max - min + 1)) + min));
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    const idx = Math.floor(rnd() * copy.length);
    out.push(copy.splice(idx, 1)[0]!);
  }
  return out;
}

function uniqueSlug(base: string, used: Set<string>) {
  const s = slugify(base);
  if (!used.has(s)) {
    used.add(s);
    return s;
  }
  let i = 2;
  while (used.has(`${s}-${i}`)) i++;
  const out = `${s}-${i}`;
  used.add(out);
  return out;
}

const nameParts = {
  adjectives: [
    "Bright",
    "Swift",
    "Simple",
    "Modern",
    "Clear",
    "Nimbus",
    "Bold",
    "Atomic",
    "Prime",
    "Orbit",
    "Pulse",
    "Craft",
    "Focus",
    "Nimble",
    "Sage",
    "Crisp",
    "Zen",
    "Vertex",
  ],
  suffixes: ["HQ", "Cloud", "Pro", "Flow", "Desk", "Studio", "Suite", "OS", "Labs", "Stack"],
};

const catalogByCategory: Record<
  string,
  {
    nouns: string[];
    featurePool: string[];
    integrationPool: string[];
    audiencePool: string[];
    pricingBias: Array<PricingModel>;
  }
> = {
  productivity: {
    nouns: ["Notes", "Workspace", "Planner", "Inbox", "Docs", "Journal", "Board", "Tasks"],
    featurePool: ["Notes", "Docs", "Wikis", "Databases", "Tasks", "Templates", "Web clipper", "Search", "Sharing"],
    integrationPool: ["Slack", "Google Drive", "Google Calendar", "Zapier", "Notion", "Dropbox"],
    audiencePool: ["individuals", "teams", "creators", "founders", "professionals"],
    pricingBias: [PricingModel.FREEMIUM, PricingModel.FREEMIUM, PricingModel.PAID, PricingModel.FREE],
  },
  "project-management": {
    nouns: ["Boards", "Sprints", "Roadmaps", "Projects", "Tasks", "Backlog", "Planner"],
    featurePool: ["Tasks", "Boards", "Timelines", "Dashboards", "Goals", "Automation", "Docs", "Permissions"],
    integrationPool: ["Slack", "Google Calendar", "GitHub", "Jira", "Zapier", "Zoom"],
    audiencePool: ["teams", "agencies", "product teams", "enterprises", "small teams"],
    pricingBias: [PricingModel.FREEMIUM, PricingModel.FREEMIUM, PricingModel.PAID, PricingModel.PAID],
  },
  design: {
    nouns: ["Canvas", "Studio", "Builder", "Designer", "Kit", "Library", "Prototype", "Layouts"],
    featurePool: ["UI design", "Prototyping", "Templates", "Brand kits", "Collaboration", "Components", "Export"],
    integrationPool: ["Slack", "Jira", "Zapier", "Google Drive", "GitHub"],
    audiencePool: ["designers", "product teams", "agencies", "freelancers", "marketers"],
    pricingBias: [PricingModel.FREEMIUM, PricingModel.PAID, PricingModel.PAID],
  },
  marketing: {
    nouns: ["Campaigns", "Mailer", "Growth", "Automation", "Studio", "Outreach", "Funnels", "Engage"],
    featurePool: ["Email marketing", "Automation", "CRM", "Landing pages", "Segmentation", "A/B testing"],
    integrationPool: ["Shopify", "Slack", "Salesforce", "Zapier", "Google Analytics"],
    audiencePool: ["small businesses", "marketing teams", "sales teams", "creators", "agencies"],
    pricingBias: [PricingModel.FREEMIUM, PricingModel.PAID, PricingModel.PAID],
  },
  analytics: {
    nouns: ["Insights", "Metrics", "Signals", "Dashboards", "Pulse", "Tracker", "Cohorts", "Funnels"],
    featurePool: ["Analytics", "Traffic analysis", "User behavior", "Funnels", "Cohorts", "Dashboards", "Reporting"],
    integrationPool: ["Google Ads", "Segment", "Zapier", "Slack", "BigQuery"],
    audiencePool: ["product teams", "marketers", "analysts", "founders"],
    pricingBias: [PricingModel.FREE, PricingModel.FREEMIUM, PricingModel.PAID],
  },
  sales: {
    nouns: ["Pipeline", "CRM", "Leads", "Deals", "Revenue", "Prospect", "Closer"],
    featurePool: ["CRM", "Pipelines", "Reporting", "Automation", "Sequences", "Lead scoring"],
    integrationPool: ["Slack", "Zapier", "Google Calendar", "Salesforce", "HubSpot"],
    audiencePool: ["sales teams", "small businesses", "enterprises", "agencies"],
    pricingBias: [PricingModel.PAID, PricingModel.PAID, PricingModel.ENTERPRISE],
  },
  "customer-support": {
    nouns: ["Helpdesk", "Inbox", "Support", "Chat", "Tickets", "Service", "Assist"],
    featurePool: ["Live chat", "Ticketing", "Help desk", "Automation", "Knowledge base", "SLAs"],
    integrationPool: ["Slack", "Zapier", "Shopify", "HubSpot", "Salesforce"],
    audiencePool: ["support teams", "customer success", "small businesses", "enterprises"],
    pricingBias: [PricingModel.PAID, PricingModel.PAID, PricingModel.ENTERPRISE],
  },
  engineering: {
    nouns: ["Deploy", "Build", "CI", "Repo", "Cloud", "Stack", "Ship", "Pipeline"],
    featurePool: ["Repositories", "CI/CD", "Hosting", "Deployment", "Environments", "Logs", "Monitoring"],
    integrationPool: ["GitHub", "Slack", "Jira", "Zapier"],
    audiencePool: ["developers", "frontend teams", "platform teams", "startups"],
    pricingBias: [PricingModel.FREEMIUM, PricingModel.FREEMIUM, PricingModel.PAID],
  },
};

function categoryKeyFromName(primaryCategoryName: string) {
  return slugify(primaryCategoryName);
}

function makeStartingPrice(rnd: () => number, pricingModel: PricingModel) {
  if (pricingModel === PricingModel.FREE) return "Free";
  if (pricingModel === PricingModel.FREEMIUM) {
    const paid = [7, 9, 10, 12, 15, 19];
    return `Free / from $${pick(rnd, paid)}/month`;
  }
  if (pricingModel === PricingModel.PAID) {
    const paid = [9, 12, 15, 19, 29, 39, 49, 79, 99];
    return `From $${pick(rnd, paid)}/month`;
  }
  // ENTERPRISE
  return "Contact sales";
}

function generateSyntheticTools(opts: {
  targetCount: number;
  seed: number;
  existingTools: SeedTool[];
}): SeedTool[] {
  const rnd = mulberry32(opts.seed);

  const usedSlugs = new Set<string>(opts.existingTools.map((t) => t.slug));
  const out: SeedTool[] = [];

  const categoryNames = Array.from(new Set(opts.existingTools.map((t) => t.primaryCategory)));

  while (out.length < opts.targetCount) {
    const primaryCategory = pick(rnd, categoryNames);
    const catKey = categoryKeyFromName(primaryCategory);
    const cat = catalogByCategory[catKey] ?? catalogByCategory["productivity"];

    const name = `${pick(rnd, nameParts.adjectives)} ${pick(rnd, cat.nouns)} ${pick(
      rnd,
      nameParts.suffixes,
    )}`.trim();

    const slug = uniqueSlug(name, usedSlugs);

    const pricingModel = pick(rnd, cat.pricingBias);
    const startingPrice = makeStartingPrice(rnd, pricingModel);

    const keyFeatures = pickMany(rnd, cat.featurePool, 3, 6);
    const integrations = pickMany(rnd, cat.integrationPool, 2, 5);
    const targetAudience = pickMany(rnd, cat.audiencePool, 1, 3);

    const isFeatured = rnd() < 0.08; // ~8% featured
    const status = "active";

    out.push({
      name,
      slug,
      shortDescription: `${pick(rnd, keyFeatures)} and ${pick(rnd, cat.featurePool)} for ${pick(
        rnd,
        targetAudience,
      )}.`,
      longDescription:
        `A ${primaryCategory.toLowerCase()} tool designed for ${targetAudience.join(", ")}.\n\n` +
        `Common workflows: ${keyFeatures.slice(0, 4).join(", ")}.\n` +
        `Integrations: ${integrations.slice(0, 4).join(", ")}.`,
      websiteUrl: null,
      logoUrl: null,

      primaryCategory,

      pricingModel,
      startingPrice,

      targetAudience,
      keyFeatures,
      integrations,

      isFeatured,
      status,
    });
  }

  return out;
}

// ----------------------------
// Your curated seed tools
// ----------------------------

const toolsSeed: SeedTool[] = [
  /* =======================
     PRODUCTIVITY
  ======================= */
  {
    name: "Notion",
    slug: "notion",
    shortDescription: "Docs, wikis, and projects in one workspace.",
    websiteUrl: "https://www.notion.so",
    primaryCategory: "Productivity",
    pricingModel: PricingModel.FREEMIUM,
    startingPrice: "Free / from $10 per user",
    keyFeatures: ["Docs", "Wikis", "Databases", "Projects"],
    integrations: ["Slack", "Google Drive", "Zapier"],
    targetAudience: ["teams", "founders", "creators"],
    isFeatured: true,
  },
  {
    name: "Evernote",
    slug: "evernote",
    shortDescription: "Note-taking app for organizing ideas and tasks.",
    websiteUrl: "https://evernote.com",
    primaryCategory: "Productivity",
    pricingModel: PricingModel.FREEMIUM,
    startingPrice: "Free / from $14.99/month",
    keyFeatures: ["Notes", "Tasks", "Web Clipper"],
    integrations: ["Google Calendar"],
    targetAudience: ["individuals", "professionals"],
  },
  {
    name: "Todoist",
    slug: "todoist",
    shortDescription: "Simple yet powerful task manager.",
    websiteUrl: "https://todoist.com",
    primaryCategory: "Productivity",
    pricingModel: PricingModel.FREEMIUM,
    startingPrice: "Free / from $4/month",
    keyFeatures: ["Tasks", "Recurring reminders", "Priorities"],
    integrations: ["Slack", "Google Calendar"],
    targetAudience: ["individuals", "teams"],
  },

  /* =======================
     PROJECT MANAGEMENT
  ======================= */
  {
    name: "ClickUp",
    slug: "clickup",
    shortDescription: "All-in-one project management platform.",
    websiteUrl: "https://clickup.com",
    primaryCategory: "Project Management",
    pricingModel: PricingModel.FREEMIUM,
    startingPrice: "Free / from $10 per user",
    keyFeatures: ["Tasks", "Docs", "Dashboards"],
    integrations: ["Slack", "GitHub", "Google Calendar"],
    targetAudience: ["teams", "agencies"],
    isFeatured: true,
  },
  {
    name: "Asana",
    slug: "asana",
    shortDescription: "Work management for cross-functional teams.",
    websiteUrl: "https://asana.com",
    primaryCategory: "Project Management",
    pricingModel: PricingModel.FREEMIUM,
    startingPrice: "Free / from $10.99 per user",
    keyFeatures: ["Task tracking", "Timelines", "Goals"],
    integrations: ["Slack", "Zoom"],
    targetAudience: ["teams", "enterprises"],
  },
  {
    name: "Trello",
    slug: "trello",
    shortDescription: "Visual Kanban-style project boards.",
    websiteUrl: "https://trello.com",
    primaryCategory: "Project Management",
    pricingModel: PricingModel.FREEMIUM,
    startingPrice: "Free / from $5 per user",
    keyFeatures: ["Boards", "Cards", "Automation"],
    integrations: ["Slack", "Jira"],
    targetAudience: ["small teams", "individuals"],
  },

  /* =======================
     DESIGN
  ======================= */
  {
    name: "Figma",
    slug: "figma",
    shortDescription: "Collaborative interface design tool.",
    websiteUrl: "https://figma.com",
    primaryCategory: "Design",
    pricingModel: PricingModel.FREEMIUM,
    startingPrice: "Free / from $12 per editor",
    keyFeatures: ["UI design", "Prototyping", "Collaboration"],
    integrations: ["Slack", "Jira"],
    targetAudience: ["designers", "product teams"],
    isFeatured: true,
  },
  {
    name: "Webflow",
    slug: "webflow",
    shortDescription: "Visual website builder with CMS.",
    websiteUrl: "https://webflow.com",
    primaryCategory: "Design",
    pricingModel: PricingModel.PAID,
    startingPrice: "From $14/month",
    keyFeatures: ["Visual builder", "CMS", "Hosting"],
    integrations: ["Zapier"],
    targetAudience: ["freelancers", "agencies"],
    isFeatured: true,
  },
  {
    name: "Canva",
    slug: "canva",
    shortDescription: "Easy-to-use graphic design platform.",
    websiteUrl: "https://canva.com",
    primaryCategory: "Design",
    pricingModel: PricingModel.FREEMIUM,
    startingPrice: "Free / from $12.99/month",
    keyFeatures: ["Templates", "Brand kits"],
    integrations: ["Google Drive"],
    targetAudience: ["marketers", "creators"],
  },

  /* =======================
     MARKETING
  ======================= */
  {
    name: "HubSpot",
    slug: "hubspot",
    shortDescription: "CRM and marketing automation platform.",
    websiteUrl: "https://hubspot.com",
    primaryCategory: "Marketing",
    pricingModel: PricingModel.FREEMIUM,
    startingPrice: "Free / paid plans available",
    keyFeatures: ["CRM", "Email marketing", "Automation"],
    integrations: ["Salesforce", "Slack"],
    targetAudience: ["marketing teams", "sales teams"],
    isFeatured: true,
  },
  {
    name: "Mailchimp",
    slug: "mailchimp",
    shortDescription: "Email marketing and automation tool.",
    websiteUrl: "https://mailchimp.com",
    primaryCategory: "Marketing",
    pricingModel: PricingModel.FREEMIUM,
    startingPrice: "Free / from $13/month",
    keyFeatures: ["Email campaigns", "Automation"],
    integrations: ["Shopify"],
    targetAudience: ["small businesses"],
  },
  {
    name: "Ahrefs",
    slug: "ahrefs",
    shortDescription: "SEO and backlink analysis tool.",
    websiteUrl: "https://ahrefs.com",
    primaryCategory: "Marketing",
    pricingModel: PricingModel.PAID,
    startingPrice: "From $99/month",
    keyFeatures: ["Backlinks", "Keyword research"],
    integrations: [],
    targetAudience: ["SEO professionals"],
  },

  /* =======================
     ANALYTICS
  ======================= */
  {
    name: "Google Analytics",
    slug: "google-analytics",
    shortDescription: "Website traffic and behavior analytics.",
    websiteUrl: "https://analytics.google.com",
    primaryCategory: "Analytics",
    pricingModel: PricingModel.FREE,
    keyFeatures: ["Traffic analysis", "User behavior", "Analytics"],
    integrations: ["Google Ads"],
    targetAudience: ["marketers", "product teams"],
    isFeatured: true,
  },
  {
    name: "Mixpanel",
    slug: "mixpanel",
    shortDescription: "Product analytics for user behavior.",
    websiteUrl: "https://mixpanel.com",
    primaryCategory: "Analytics",
    pricingModel: PricingModel.FREEMIUM,
    startingPrice: "Free / paid plans available",
    keyFeatures: ["Funnels", "Cohorts", "Analytics"],
    integrations: ["Segment"],
    targetAudience: ["product teams"],
  },

  /* =======================
     SALES
  ======================= */
  {
    name: "Salesforce",
    slug: "salesforce",
    shortDescription: "Enterprise CRM platform.",
    websiteUrl: "https://salesforce.com",
    primaryCategory: "Sales",
    pricingModel: PricingModel.ENTERPRISE,
    startingPrice: "From $25/user/month",
    keyFeatures: ["CRM", "Automation"],
    integrations: ["Slack"],
    targetAudience: ["enterprises"],
    isFeatured: true,
  },
  {
    name: "Pipedrive",
    slug: "pipedrive",
    shortDescription: "Sales pipeline management tool.",
    websiteUrl: "https://pipedrive.com",
    primaryCategory: "Sales",
    pricingModel: PricingModel.PAID,
    startingPrice: "From $14.90/user/month",
    keyFeatures: ["Pipelines", "Reporting", "Pipeline"],
    integrations: ["Zapier"],
    targetAudience: ["sales teams"],
  },

  /* =======================
     CUSTOMER SUPPORT
  ======================= */
  {
    name: "Intercom",
    slug: "intercom",
    shortDescription: "Customer messaging platform.",
    websiteUrl: "https://intercom.com",
    primaryCategory: "Customer Support",
    pricingModel: PricingModel.PAID,
    startingPrice: "From $39/month",
    keyFeatures: ["Live chat", "Automation"],
    integrations: ["Slack"],
    targetAudience: ["support teams"],
    isFeatured: true,
  },
  {
    name: "Zendesk",
    slug: "zendesk",
    shortDescription: "Customer service and support ticketing.",
    websiteUrl: "https://zendesk.com",
    primaryCategory: "Customer Support",
    pricingModel: PricingModel.PAID,
    startingPrice: "From $49/agent/month",
    keyFeatures: ["Ticketing", "Help desk"],
    integrations: ["Slack"],
    targetAudience: ["support teams"],
  },

  /* =======================
     ENGINEERING
  ======================= */
  {
    name: "GitHub",
    slug: "github",
    shortDescription: "Code hosting and collaboration.",
    websiteUrl: "https://github.com",
    primaryCategory: "Engineering",
    pricingModel: PricingModel.FREEMIUM,
    startingPrice: "Free / from $4/user",
    keyFeatures: ["Repositories", "CI/CD"],
    integrations: ["Slack"],
    targetAudience: ["developers"],
    isFeatured: true,
  },
  {
    name: "Vercel",
    slug: "vercel",
    shortDescription: "Frontend deployment platform.",
    websiteUrl: "https://vercel.com",
    primaryCategory: "Engineering",
    pricingModel: PricingModel.FREEMIUM,
    startingPrice: "Free / from $20/month",
    keyFeatures: ["Hosting", "CI/CD", "Deployment"],
    integrations: ["GitHub"],
    targetAudience: ["frontend teams"],
  },
];

async function main() {
  // wipe in dependency order
  await prisma.tool.deleteMany();
  await prisma.category.deleteMany();
  await prisma.useCase.deleteMany();

  // categories from tool seed
  const categoryNames = Array.from(new Set(toolsSeed.map((t) => t.primaryCategory))).sort();
  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) },
    });
  }

  // use cases (expanded list)
  for (const uc of useCaseDefs) {
    await prisma.useCase.upsert({
      where: { slug: uc.slug },
      update: { name: uc.name },
      create: { name: uc.name, slug: uc.slug },
    });
  }

  // Create synthetic expansion so /best pages scale
  const target = Number(process.env.SEED_TOOL_TARGET ?? "300"); // try 200–500
  const syntheticCount = Math.max(0, target - toolsSeed.length);
  const synthetic = generateSyntheticTools({
    targetCount: syntheticCount,
    seed: Number(process.env.SEED_RANDOM_SEED ?? "1337"),
    existingTools: toolsSeed,
  });
  const allTools = [...toolsSeed, ...synthetic];

  // create tools (relations require create/upsert, not createMany)
  for (const t of allTools) {
    const categorySlug = slugify(t.primaryCategory);
    const useCaseSlugs = inferUseCases({
      primaryCategory: t.primaryCategory,
      targetAudience: t.targetAudience,
      keyFeatures: t.keyFeatures,
      integrations: t.integrations,
    });

    await prisma.tool.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        shortDescription: t.shortDescription,
        longDescription: t.longDescription ?? null,
        websiteUrl: t.websiteUrl ?? null,
        logoUrl: t.logoUrl ?? null,

        pricingModel: t.pricingModel,
        startingPrice: t.startingPrice ?? null,
        pricingNotes: t.pricingNotes ?? null,

        targetAudience: t.targetAudience ?? [],
        keyFeatures: t.keyFeatures ?? [],
        integrations: t.integrations ?? [],

        status: normalizeToolStatus(t.status),
        isFeatured: t.isFeatured ?? false,

        primaryCategory: { connect: { slug: categorySlug } },
        useCases: { set: useCaseSlugs.map((slug) => ({ slug })) },
      },
      create: {
        name: t.name,
        slug: t.slug,
        shortDescription: t.shortDescription,
        longDescription: t.longDescription ?? null,
        websiteUrl: t.websiteUrl ?? null,
        logoUrl: t.logoUrl ?? null,

        pricingModel: t.pricingModel,
        startingPrice: t.startingPrice ?? null,
        pricingNotes: t.pricingNotes ?? null,

        targetAudience: t.targetAudience ?? [],
        keyFeatures: t.keyFeatures ?? [],
        integrations: t.integrations ?? [],

        status: normalizeToolStatus(t.status),
        isFeatured: t.isFeatured ?? false,

        primaryCategory: { connect: { slug: categorySlug } },
        useCases: { connect: useCaseSlugs.map((slug) => ({ slug })) },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
