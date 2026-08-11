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

export type OpportunityCategory =
  | "government-scholarship"
  | "eu-programme"
  | "leadership-fellowship"
  | "remote-employer";

export interface Opportunity {
  slug: string;
  name: string;
  category: OpportunityCategory;
  /** Who funds or runs it, e.g. "UK government". */
  host: string;
  /** Where it takes you, e.g. "United Kingdom" or "Distributed". */
  destination: string;
  level: string;
  summary: string;
  openTo: string;
  /**
   * Qualitative only. Award amounts and deadlines change every cycle, so we
   * never state them — the official page is the authority.
   */
  covers: string[];
  selection: string[];
  whatToPrepare: string[];
  officialUrl: string;
  relatedTestTypes?: string[];
  relatedGuides?: string[];
}

export interface Product {
  slug: string;
  title: string;
  badge: string;
  description: string;
  priceUsd: number;
  /**
   * Set by the business, not converted at runtime. A live FX conversion in the
   * client would drift from what the gateway actually settles at, and would
   * show a different price on every page load.
   */
  priceNgn: number;
  includes: string[];
  bestFor: string;
  /** What the buyer receives, listed on the product page before purchase. */
  deliverables: string[];
  format: string;
  /**
   * Paystack Storefront product link. Paste it from the Paystack dashboard
   * (Commerce -> Products -> Share). Paystack takes the payment and delivers
   * the file, so there is no checkout or backend on our side.
   * Empty string = not on sale yet; the product page says so instead of
   * rendering a dead button.
   */
  paystackUrl: string;
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
