export type Pillar = "assessments" | "remote-jobs" | "study-abroad" | "work-from-home";

export interface Author {
  slug: string;
  name: string;
  role: string;
  credentials: string[];
  bio: string;
  focus: string[];
  initials: string;
}

export interface TestType {
  slug: string;
  name: string;
  shortName: string;
  /** One-line answer to "what is this test?" — used in cards and meta descriptions. */
  summary: string;
  /** Long-form explanation rendered on the test-type page. */
  description: string[];
  measures: string;
  /** Typical time pressure candidates face, e.g. "60–75 seconds per question". */
  pace: string;
  publishers: string[];
  industries: string[];
  employers: string[];
  tips: string[];
  commonMistakes: string[];
}

export interface Question {
  id: string;
  testType: string;
  topic: string;
  difficulty: "foundation" | "standard" | "advanced";
  /** Shared context (a passage, table, or scenario) rendered above the stem. */
  stimulus?: string;
  stem: string;
  options: string[];
  answerIndex: number;
  /** Step-by-step reasoning shown after the test is submitted. */
  workedSolution: string[];
  /** Seconds a well-prepared candidate should need. Drives the pacing report. */
  targetSeconds: number;
}

export interface GuideSection {
  heading: string;
  body: string[];
  list?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  pillar: Pillar;
  /** Meta description and card summary. */
  summary: string;
  authorSlug: string;
  publishedAt: string;
  reviewedAt: string;
  readMinutes: number;
  keyTakeaways: string[];
  sections: GuideSection[];
  sources?: { label: string; url: string }[];
  relatedTestTypes?: string[];
}

export interface Product {
  slug: string;
  title: string;
  badge: string;
  description: string;
  priceUsd: number;
  includes: string[];
  bestFor: string;
}

export interface PricingTier {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export interface Faq {
  question: string;
  answer: string;
}
