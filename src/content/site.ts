import { guides } from "./guides";
import { questions } from "./questions";
import { testTypes } from "./testTypes";

export const site = {
  name: "GAA Info Guide",
  shortName: "GAA",
  // Firebase Hosting default domain. Change this and SITE_URL in
  // scripts/generate-sitemap.mjs together when a custom domain is connected —
  // canonical tags and the sitemap both read from here.
  url: "https://scholar-zone.web.app",
  tagline: "Practice tests and preparation guides for global careers",
  description:
    "Free timed practice tests with worked solutions for numerical, verbal, logical, diagrammatic and situational judgement assessments — plus preparation guides for remote hiring, study abroad and work-from-home careers.",
  locale: "en",
  contactEmail: "hello@gaainfoguide.com",
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
  get workedSolutionCount() {
    return questions.filter((question) => question.workedSolution.length > 0).length;
  },
  get publisherCount() {
    return new Set(testTypes.flatMap((type) => type.publishers)).size;
  }
};

export const primaryNav = [
  { label: "Practice tests", to: "/practice" },
  { label: "Test types", to: "/test-types" },
  { label: "Guides", to: "/guides" },
  { label: "Resources", to: "/resources" },
  { label: "Pricing", to: "/pricing" }
];

export const footerNav = [
  {
    heading: "Practice",
    links: [
      { label: "All practice tests", to: "/practice" },
      { label: "Numerical reasoning", to: "/test-types/numerical-reasoning" },
      { label: "Verbal reasoning", to: "/test-types/verbal-reasoning" },
      { label: "Logical reasoning", to: "/test-types/logical-reasoning" },
      { label: "Situational judgement", to: "/test-types/situational-judgement" }
    ]
  },
  {
    heading: "Learn",
    links: [
      { label: "All guides", to: "/guides" },
      { label: "Technical assessments", to: "/guides?pillar=assessments" },
      { label: "Remote job exams", to: "/guides?pillar=remote-jobs" },
      { label: "Study abroad", to: "/guides?pillar=study-abroad" },
      { label: "Work from home", to: "/guides?pillar=work-from-home" }
    ]
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Editorial policy", to: "/editorial-policy" },
      { label: "Contact", to: "/contact" },
      { label: "Resources", to: "/resources" },
      { label: "Pricing", to: "/pricing" }
    ]
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", to: "/privacy" },
      { label: "Terms of use", to: "/terms" }
    ]
  }
];
