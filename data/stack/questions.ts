export type StackQuestionOption = {
  label: string;
  value: string;
};

export type StackQuestion = {
  id: string;
  title: string;
  hint?: string;
  options: StackQuestionOption[];
};

export const questions: StackQuestion[] = [
  {
    id: "product",
    title: "What are you building?",
    hint: "Pick the closest match — you can change this later.",
    options: [
      { label: "SaaS product", value: "saas" },
      { label: "Marketplace", value: "marketplace" },
      { label: "Marketing / content site", value: "content" },
      { label: "Internal tool", value: "internal" },
      { label: "Not sure yet", value: "unsure" }
    ]
  },
  {
    id: "priority",
    title: "What matters most right now?",
    hint: "This helps us balance speed vs flexibility in your stack.",
    options: [
      { label: "Ship as fast as possible", value: "speed" },
      { label: "Balance speed and flexibility", value: "balanced" },
      { label: "Long-term control & scalability", value: "control" }
    ]
  },
  {
    id: "tech",
    title: "How hands-on do you want to be?",
    hint: "Choose based on your team today — not where you want to be later.",
    options: [
      { label: "Mostly visual / no-code", value: "nocode" },
      { label: "Some code, some tools", value: "hybrid" },
      { label: "Comfortable coding", value: "coder" },
      { label: "Team of developers", value: "team" }
    ]
  },
  {
    id: "complexity",
    title: "How complex do you expect this to get?",
    hint: "More complexity usually means stronger infrastructure and tooling.",
    options: [
      { label: "Simple CRUD app", value: "simple" },
      { label: "Realtime / collaborative", value: "realtime" },
      { label: "Data-heavy or logic-heavy", value: "complex" },
      { label: "I’m not sure yet", value: "unsure" }
    ]
  },
  {
    id: "monetisation",
    title: "How will this make money?",
    hint: "Monetization affects billing, analytics, and growth tooling.",
    options: [
      { label: "Subscriptions", value: "subscriptions" },
      { label: "One-time payments", value: "one_time" },
      { label: "Usage-based", value: "usage" },
      { label: "Free for now", value: "free" }
    ]
  }
];
