import type { Faq, PricingTier, Product } from "./types";

export const products: Product[] = [
  {
    slug: "remote-job-assessment-pack",
    title: "Remote Job Assessment Pack",
    badge: "Starter",
    description:
      "Everything needed to clear the automated stages of a remote hiring pipeline: aptitude drills, coding screen practice, and a scored async video interview rehearsal.",
    priceUsd: 29,
    priceNgn: 45000,
    format: "PDF workbook + editable spreadsheet trackers",
    paystackUrl: "",
    deliverables: [
      "68-page PDF workbook",
      "3 spreadsheet trackers (Google Sheets and Excel)",
      "Printable error-log template",
      "Lifetime access, including future revisions"
    ],
    bestFor: "Candidates with a live application and a test booked in the next few weeks.",
    includes: [
      "Timed numerical, verbal and logical drill sets with worked solutions",
      "Coding screen warm-up set with complexity notes and edge-case checklists",
      "Async video interview question bank with a STAR timing template",
      "Application tracker covering stage, timezone overlap and follow-up dates",
      "Error log template with the cause-classification scheme"
    ]
  },
  {
    slug: "study-abroad-readiness-kit",
    title: "Study Abroad Readiness Kit",
    badge: "Most popular",
    description:
      "The twelve-month application timeline turned into working documents — deadline tracker, statement planner, scholarship pipeline and a per-country document checklist.",
    priceUsd: 39,
    priceNgn: 60000,
    format: "PDF planner + editable spreadsheet trackers",
    paystackUrl: "",
    deliverables: [
      "84-page PDF planner",
      "Twelve-month timeline tracker (Google Sheets and Excel)",
      "Programme comparison and scholarship pipeline sheets",
      "Document and financial-evidence checklists",
      "Lifetime access, including future revisions"
    ],
    bestFor: "Applicants targeting an intake twelve months out who need the sequencing handled.",
    includes: [
      "Twelve-month timeline tracker with irreversibility-ordered milestones",
      "Programme comparison sheet recording per-section English minimums",
      "Statement of purpose planner with a per-programme tailoring section",
      "Scholarship pipeline tracker running parallel to admissions deadlines",
      "Recommender request pack and follow-up schedule",
      "Financial evidence and visa document checklist"
    ]
  },
  {
    slug: "global-career-training-bundle",
    title: "Global Career Training Bundle",
    badge: "Best value",
    description:
      "The four-week preparation plan delivered as a structured programme, combined with CV positioning for international applications and the full practice question bank.",
    priceUsd: 79,
    priceNgn: 120000,
    format: "Full PDF library + all trackers + structured programme",
    paystackUrl: "",
    deliverables: [
      "Everything in both packs above",
      "Four-week programme as a day-by-day PDF schedule",
      "CV and portfolio positioning workbook",
      "Remote work setup guide covering contracting and payment routes",
      "Twelve months of updates as new material publishes"
    ],
    bestFor: "Career changers running assessments, applications and interviews at the same time.",
    includes: [
      "Everything in both packs above",
      "The four-week preparation plan as a day-by-day schedule",
      "CV and portfolio positioning workbook for international applications",
      "Full access to the practice question bank across all test types",
      "Remote work setup guide: contracting models, timezone framing and payment routes",
      "Twelve months of updates as new material is published"
    ]
  }
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    tagline: "Every practice test on this site, with full worked solutions.",
    features: [
      "All practice tests across every test type",
      "Step-by-step worked solution on every question",
      "Scored report with topic breakdown and pacing analysis",
      "Full guide library",
      "No account required"
    ],
    cta: "Start a practice test"
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "per pack",
    tagline: "A focused preparation pack for one specific goal.",
    featured: true,
    features: [
      "Everything in Free",
      "Extended drill sets beyond the free question bank",
      "Downloadable trackers, templates and checklists",
      "Employer and publisher-specific practice sets",
      "Lifetime access to the pack you buy"
    ],
    cta: "Browse packs"
  },
  {
    name: "All-Access",
    price: "$79",
    cadence: "one-time",
    tagline: "Every pack, every test type, plus twelve months of updates.",
    features: [
      "Everything in Pro, across all packs",
      "The four-week plan as a structured programme",
      "CV and portfolio positioning workbook",
      "Priority for cohort training places",
      "Twelve months of new material as it is published"
    ],
    cta: "Get All-Access"
  }
];

export const faqs: Faq[] = [
  {
    question: "Are the practice tests really free?",
    answer:
      "Yes. Every practice test on this site, including the worked solution on every question and the full scored report, is free and needs no account. Paid packs add extended drill sets, downloadable trackers and employer-specific practice — they do not unlock the tests already here."
  },
  {
    question: "How closely do these match the real tests?",
    answer:
      "Question formats, timing and answer structures are built to match the specifications published by the major test vendors — SHL, Talogy, Saville, IBM Kenexa and Pearson TalentLens. They are original questions written to those formats, not copies of any live test paper."
  },
  {
    question: "Do you store my results?",
    answer:
      "Results are held in your browser for the current session so the report can be displayed. Nothing is sent to a server and nothing is stored after you close the tab. Cross-device progress tracking will require an account when that ships."
  },
  {
    question: "How is my percentile calculated?",
    answer:
      "The percentile band on your report is derived from the difficulty weighting of the questions you answered correctly and the published score distributions for the corresponding commercial test formats. It is an indicative band, not a norm-referenced score against a live candidate pool."
  },
  {
    question: "Is there negative marking?",
    answer:
      "Not on these tests, and not on most commercial aptitude tests either. That makes an eliminated-down guess strictly better than a blank answer. Always answer every question you reach."
  },
  {
    question: "How often is the content reviewed?",
    answer:
      "Every guide carries a visible last-reviewed date and is re-checked at least every six months, in line with the standard for career and education content. Test format details are re-checked whenever a vendor publishes a change."
  },
  {
    question: "Can I use this if I am applying from outside the UK, US or EU?",
    answer:
      "Yes. The aptitude test formats covered here are the ones used internationally by the major vendors, and the remote hiring and study abroad material is written specifically for candidates applying across borders — including the timezone, contracting and payment questions that decide many of those outcomes."
  },
  {
    question: "Do you offer training for groups or institutions?",
    answer:
      "Cohort-based training runs on a waitlist, and institutional licensing for universities and career services is in development. Get in touch through the contact page with your cohort size and timeline."
  }
];

export const productBySlug = (slug: string) => products.find((product) => product.slug === slug);
