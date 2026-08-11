import { guides } from "./guides";
import { opportunities } from "./opportunities";
import { questions } from "./questions";
import { testTypes } from "./testTypes";

export const site = {
  name: "Scholar Zone",
  shortName: "Scholar Zone",
  // Firebase Hosting default domain. Change this and SITE_URL in
  // scripts/generate-sitemap.mjs together when a custom domain is connected —
  // canonical tags and the sitemap both read from here.
  url: "https://scholar-zone.web.app",
  tagline: "Find the opportunity. Be ready to win it.",
  description:
    "Discover fully funded scholarships, fellowships and remote-first employers hiring globally — then get ready with free timed practice tests, worked solutions and preparation packs.",
  locale: "en",
  contactEmail: "hello@scholarzone.app",
  founded: "2026"
};

/**
 * Counts render from the content arrays rather than being written by hand, so a
 * headline figure can never drift away from what the site actually contains.
 */
export const stats = {
  get questionCount() {
    return questions.length;
  },
  get testTypeCount() {
    return testTypes.length;
  },
  get guideCount() {
    return guides.length;
  },
  get opportunityCount() {
    return opportunities.length;
  },
  get destinationCount() {
    return new Set(opportunities.map((opportunity) => opportunity.destination)).size;
  },
  get workedSolutionCount() {
    return questions.filter((question) => question.workedSolution.length > 0).length;
  },
  get publisherCount() {
    return new Set(testTypes.flatMap((type) => type.publishers)).size;
  }
};

export const primaryNav = [
  { label: "Opportunities", to: "/opportunities" },
  { label: "Practice tests", to: "/practice" },
  { label: "Guides", to: "/guides" },
  { label: "Materials", to: "/resources" },
  { label: "Pricing", to: "/pricing" }
];

export const footerNav = [
  {
    heading: "Opportunities",
    links: [
      { label: "All opportunities", to: "/opportunities" },
      { label: "Government scholarships", to: "/opportunities?category=government-scholarship" },
      { label: "European programmes", to: "/opportunities?category=eu-programme" },
      { label: "Leadership fellowships", to: "/opportunities?category=leadership-fellowship" },
      { label: "Remote-first employers", to: "/opportunities?category=remote-employer" }
    ]
  },
  {
    heading: "Prepare",
    links: [
      { label: "All practice tests", to: "/practice" },
      { label: "Test types", to: "/test-types" },
      { label: "Numerical reasoning", to: "/test-types/numerical-reasoning" },
      { label: "Verbal reasoning", to: "/test-types/verbal-reasoning" },
      { label: "Situational judgement", to: "/test-types/situational-judgement" }
    ]
  },
  {
    heading: "Learn",
    links: [
      { label: "All guides", to: "/guides" },
      { label: "Study abroad", to: "/guides?pillar=study-abroad" },
      { label: "Remote job exams", to: "/guides?pillar=remote-jobs" },
      { label: "Technical assessments", to: "/guides?pillar=assessments" },
      { label: "Work from home", to: "/guides?pillar=work-from-home" }
    ]
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Editorial policy", to: "/editorial-policy" },
      { label: "Materials", to: "/resources" },
      { label: "Contact", to: "/contact" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" }
    ]
  }
];
