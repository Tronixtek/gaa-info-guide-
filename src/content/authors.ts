import type { Author } from "./types";

export const authors: Author[] = [
  {
    slug: "editorial-team",
    name: "Scholar Zone Editorial Team",
    role: "Assessment research and content standards",
    credentials: [
      "Content reviewed against published test-publisher specifications",
      "Every guide re-checked on a six-month cycle"
    ],
    bio:
      "The Scholar Zone editorial team builds and maintains the practice question bank and the written guides. Every question is mapped to a named test type and topic, carries a worked solution, and is checked against the format and timing published by the assessment vendors candidates actually sit.",
    focus: ["Question bank", "Worked solutions", "Editorial standards"],
    initials: "SZ"
  },
  {
    slug: "assessment-practice",
    name: "Assessment Practice Desk",
    role: "Aptitude and psychometric test preparation",
    credentials: [
      "Test formats tracked across SHL, Talogy, Saville, Kenexa and Pearson",
      "Timing and scoring models derived from publicly documented test specifications"
    ],
    bio:
      "The assessment desk covers numerical, verbal, logical, diagrammatic and situational judgement testing: what each test measures, how it is scored, where candidates lose marks, and what a realistic preparation schedule looks like in the weeks before a live sitting.",
    focus: ["Aptitude tests", "Situational judgement", "Assessment centres"],
    initials: "AP"
  },
  {
    slug: "global-careers",
    name: "Global Careers Desk",
    role: "Remote hiring, study abroad and international work",
    credentials: [
      "Guidance based on published employer hiring processes and official immigration guidance",
      "Country and visa material sourced only from government or institutional pages"
    ],
    bio:
      "The global careers desk covers the paths around the test itself: remote hiring pipelines and work-sample tasks, study-abroad admissions timelines, scholarship applications, and the practical mechanics of getting paid for online work from outside the hiring country.",
    focus: ["Remote hiring", "Study abroad", "Work from home"],
    initials: "GC"
  }
];

export const authorBySlug = (slug: string) => authors.find((author) => author.slug === slug);
