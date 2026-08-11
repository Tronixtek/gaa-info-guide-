import type { Opportunity, OpportunityCategory } from "./types";

/**
 * Named, real programmes only.
 *
 * Deadlines, award amounts and eligibility lists change every cycle, so none
 * are stated here — every entry links the official page and the UI tells the
 * reader to verify there. Publishing a stale deadline would be worse than
 * publishing nothing.
 */

export const opportunityCategories: {
  id: OpportunityCategory;
  label: string;
  blurb: string;
}[] = [
  {
    id: "government-scholarship",
    label: "Government scholarships",
    blurb:
      "State-funded awards for postgraduate study abroad. Usually the largest packages available, and usually the most competitive."
  },
  {
    id: "eu-programme",
    label: "European programmes",
    blurb:
      "EU-funded routes, including joint degrees delivered across several universities in different countries."
  },
  {
    id: "leadership-fellowship",
    label: "Leadership fellowships",
    blurb:
      "Cohort-based programmes that fund a degree and build a network. Selection weights trajectory and leadership over grades alone."
  },
  {
    id: "remote-employer",
    label: "Remote-first employers",
    blurb:
      "Companies that hire globally by default and publish how their process works — the most learnable hiring pipelines available."
  }
];

export const opportunities: Opportunity[] = [
  {
    slug: "chevening",
    name: "Chevening Scholarships",
    category: "government-scholarship",
    host: "UK government (Foreign, Commonwealth & Development Office)",
    destination: "United Kingdom",
    level: "One-year taught master's",
    summary:
      "The UK government's flagship international scholarship, funding a one-year master's for people with demonstrated leadership potential.",
    openTo:
      "Citizens of Chevening-eligible countries and territories. The eligible list is set per cycle — confirm your country is on the current one before investing time.",
    covers: [
      "Tuition for a one-year taught master's",
      "A monthly living allowance",
      "Return airfare to the UK",
      "Additional grants covering standard arrival and visa costs"
    ],
    selection: [
      "Leadership and influencing potential, evidenced with specific examples",
      "A genuine, articulated networking ability",
      "A clear and credible career plan the scholarship visibly accelerates",
      "Work experience — typically a required minimum number of hours",
      "Three UK university course choices, with an unconditional offer needed by a stated point"
    ],
    whatToPrepare: [
      "Four essays: leadership, networking, study plan, career plan. These carry the application — start them months before, not weeks.",
      "Concrete leadership evidence with outcomes. 'Led a team of six and cut processing time 40%' beats any adjective.",
      "Your work-experience hours, calculated and documented before you start writing.",
      "English proficiency at the level your chosen universities require, with room for a retake."
    ],
    officialUrl: "https://www.chevening.org/",
    relatedTestTypes: ["english-proficiency"],
    relatedGuides: ["study-abroad-application-timeline"]
  },
  {
    slug: "commonwealth-scholarships",
    name: "Commonwealth Scholarships",
    category: "government-scholarship",
    host: "Commonwealth Scholarship Commission in the UK",
    destination: "United Kingdom",
    level: "Master's and PhD",
    summary:
      "UK-funded awards under the Commonwealth Scholarship and Fellowship Plan, with a strong development focus and distinct routes for low and middle income countries.",
    openTo:
      "Citizens of Commonwealth member states — roughly 56 countries. This is a hard eligibility gate: if your country is not a member, no route here applies to you.",
    covers: [
      "Tuition fees",
      "A living stipend",
      "Return airfare",
      "Route-dependent allowances, including some for study in your home country"
    ],
    selection: [
      "Academic merit",
      "The development impact of your proposed study on your home country",
      "Quality and feasibility of the plan you set out",
      "Nomination through an approved body for some routes"
    ],
    whatToPrepare: [
      "A development impact statement that is specific about the problem, your role and the mechanism — vagueness fails here more than anywhere.",
      "Check which route applies to you first. Master's, PhD, distance learning and shared scholarships each have separate criteria.",
      "Identify whether your route needs nomination by a national agency or university, which changes your timeline substantially.",
      "Referees briefed on the development framing, not just your academic record."
    ],
    officialUrl: "https://cscuk.fcdo.gov.uk/",
    relatedGuides: ["study-abroad-application-timeline"]
  },
  {
    slug: "fulbright-foreign-student",
    name: "Fulbright Foreign Student Program",
    category: "government-scholarship",
    host: "United States government",
    destination: "United States",
    level: "Master's and PhD",
    summary:
      "The US government's flagship international exchange programme, operating through a commission or embassy in each participating country.",
    openTo:
      "Citizens of participating countries. Criteria, deadlines and even the degree levels supported are set country by country — your national commission's page is the only authority for your case.",
    covers: [
      "Tuition",
      "A living stipend",
      "Airfare",
      "Health benefits, with specifics varying by country programme"
    ],
    selection: [
      "Academic record and the strength of your study objective",
      "Leadership and the potential to contribute to mutual understanding between countries",
      "Interview at the national commission or embassy stage",
      "Country-specific requirements, which differ substantially between programmes"
    ],
    whatToPrepare: [
      "Find your own country's Fulbright commission page first. Advice written for another country routinely does not apply.",
      "A study objective that is specific about field, method and why the US in particular.",
      "A personal statement that connects your trajectory to the exchange purpose of the programme.",
      "Standardised tests where your country's programme requires them, sat early enough to retake."
    ],
    officialUrl: "https://foreign.fulbrightonline.org/",
    relatedTestTypes: ["english-proficiency"],
    relatedGuides: ["study-abroad-application-timeline"]
  },
  {
    slug: "daad-scholarships",
    name: "DAAD Scholarships",
    category: "government-scholarship",
    host: "German Academic Exchange Service",
    destination: "Germany",
    level: "Master's, PhD and research stays",
    summary:
      "Germany's academic exchange service funds international students and researchers across a large catalogue of separate programmes rather than one single award.",
    openTo:
      "Varies entirely by programme. DAAD runs a searchable database of individual scholarships, each with its own eligibility, field and nationality rules.",
    covers: [
      "A monthly stipend, at rates set by programme and degree level",
      "Health, accident and liability insurance cover",
      "Travel allowance on many programmes",
      "Study and research allowances depending on the programme"
    ],
    selection: [
      "Academic performance and the fit of your proposal to the chosen programme",
      "Quality of the motivation letter and, for research, the proposal itself",
      "Relevance to the specific programme's aims rather than general merit",
      "Language requirements, which differ between German-taught and English-taught routes"
    ],
    whatToPrepare: [
      "Use the DAAD scholarship database to find the specific programme that matches you before writing anything.",
      "Note that public universities in Germany generally charge no tuition, so the stipend is often the whole funding question — the maths differs from the UK or US.",
      "Check the language of instruction. English-taught master's exist in volume, but German requirements appear on many programmes.",
      "A motivation letter written to that programme's stated aims, not a general one."
    ],
    officialUrl: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    relatedTestTypes: ["english-proficiency"],
    relatedGuides: ["study-abroad-application-timeline"]
  },
  {
    slug: "erasmus-mundus",
    name: "Erasmus Mundus Joint Masters",
    category: "eu-programme",
    host: "European Union",
    destination: "Multiple European countries",
    level: "Master's",
    summary:
      "EU-funded joint master's degrees delivered by a consortium of universities, with study split across at least two countries and a single joint or multiple degree awarded.",
    openTo:
      "Applicants worldwide. Each joint master's runs its own admission and its own scholarship competition, with its own criteria.",
    covers: [
      "Participation costs, including tuition",
      "A monthly subsistence allowance",
      "A contribution to travel and installation costs",
      "Specifics set by each individual joint master's"
    ],
    selection: [
      "Academic excellence relative to the consortium's stated criteria",
      "Motivation and fit with that specific programme's structure",
      "Language requirements per consortium",
      "Geographic balance rules applied by some programmes"
    ],
    whatToPrepare: [
      "Browse the official catalogue and shortlist programmes by content, not by country — you will study in several.",
      "Apply to more than one. Each is a separate competition with separate odds.",
      "Plan for mobility: at least two countries means two sets of residence and practical logistics.",
      "Check each consortium's language requirements individually; they are not standardised."
    ],
    officialUrl:
      "https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters-scholarships",
    relatedTestTypes: ["english-proficiency"],
    relatedGuides: ["study-abroad-application-timeline"]
  },
  {
    slug: "mext-scholarship",
    name: "MEXT Scholarship",
    category: "government-scholarship",
    host: "Japanese government (Ministry of Education, MEXT)",
    destination: "Japan",
    level: "Research student, undergraduate and specialised routes",
    summary:
      "The Japanese government's scholarship for international students, reachable either through a Japanese embassy in your country or by recommendation from a Japanese university.",
    openTo:
      "Varies by route and country. Embassy recommendation and university recommendation are genuinely different processes with different timelines.",
    covers: [
      "Tuition at the host institution",
      "A monthly allowance",
      "Travel to and from Japan",
      "Exact terms set per route and per cycle"
    ],
    selection: [
      "Academic record and the strength of your research plan for research-student routes",
      "Written examinations on some routes",
      "Interview at the embassy stage where applicable",
      "Contact with a prospective supervisor, which materially helps university-recommendation routes"
    ],
    whatToPrepare: [
      "Decide your route early — embassy recommendation and university recommendation open at different times of year.",
      "A research plan specific enough that a supervisor can judge feasibility.",
      "Approach prospective supervisors well ahead; an interested supervisor changes the odds on the university route.",
      "Check whether your route requires Japanese language ability or offers a preparatory language year."
    ],
    officialUrl: "https://www.studyinjapan.go.jp/en/planning/scholarship/",
    relatedGuides: ["study-abroad-application-timeline"]
  },
  {
    slug: "mastercard-foundation-scholars",
    name: "Mastercard Foundation Scholars Program",
    category: "leadership-fellowship",
    host: "Mastercard Foundation, with partner universities",
    destination: "Africa and partner institutions internationally",
    level: "Secondary through postgraduate, depending on partner",
    summary:
      "A comprehensive scholarship focused on academically talented young people from economically disadvantaged backgrounds, delivered through partner universities rather than centrally.",
    openTo:
      "Primarily young people from Africa, with criteria set by each partner institution. You apply to the partner university's programme, not to the foundation directly.",
    covers: [
      "Tuition",
      "Accommodation",
      "A living stipend",
      "Travel support, books and study materials, varying by partner",
      "Mentoring and leadership development alongside the funding"
    ],
    selection: [
      "Academic talent combined with demonstrated financial need",
      "Leadership and a commitment to giving back to your community",
      "Criteria and process set by the individual partner university"
    ],
    whatToPrepare: [
      "Identify which partner universities run the programme for your level and country — this is the step most applicants get wrong.",
      "Apply through the partner institution's own process and calendar.",
      "Evidence of community contribution with specifics, since giving back is a stated selection criterion rather than a nice-to-have.",
      "Documentation supporting financial need, prepared in advance."
    ],
    officialUrl: "https://mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/",
    relatedGuides: ["study-abroad-application-timeline"]
  },
  {
    slug: "schwarzman-scholars",
    name: "Schwarzman Scholars",
    category: "leadership-fellowship",
    host: "Schwarzman Scholars at Tsinghua University",
    destination: "Beijing, China",
    level: "One-year master's in global affairs",
    summary:
      "A fully funded one-year master's in global affairs at Tsinghua University, built as a leadership programme with scholars living together at Schwarzman College.",
    openTo:
      "Applicants worldwide within the programme's stated age range, holding an undergraduate degree by matriculation. Instruction is in English.",
    covers: [
      "Tuition",
      "Room and board at Schwarzman College",
      "Travel to and from Beijing",
      "A personal stipend, plus in-country study travel"
    ],
    selection: [
      "Demonstrated leadership, weighted heavily",
      "Intellectual and academic ability",
      "Entrepreneurial spirit and the ability to anticipate emerging trends",
      "Interview at the final stage"
    ],
    whatToPrepare: [
      "A leadership record with scale and outcomes attached, not titles.",
      "A clear answer to why China and why now, connected to your specific trajectory.",
      "Interview preparation — the final stage is a panel and it is decisive.",
      "Recommenders who can speak to leadership specifically, not only academics."
    ],
    officialUrl: "https://www.schwarzmanscholars.org/",
    relatedTestTypes: ["video-interview"],
    relatedGuides: ["situational-judgement-test-scoring-explained"]
  },
  {
    slug: "gitlab-remote",
    name: "GitLab",
    category: "remote-employer",
    host: "GitLab Inc.",
    destination: "Distributed — no offices",
    level: "Engineering, product, sales, support and operations",
    summary:
      "An all-remote company that publishes its entire way of working, including its hiring process, in a public handbook — making it the most studiable pipeline in remote hiring.",
    openTo:
      "Candidates in countries where the company can employ or contract. Check the country list on a specific role before investing in the application.",
    covers: [
      "Fully remote roles with no office requirement",
      "Documented, asynchronous-first working norms",
      "Hiring process published openly in advance"
    ],
    selection: [
      "Screening call, then team interviews structured around published values",
      "Written communication assessed throughout, since the culture is documentation-first",
      "Role-specific technical or work-sample assessment"
    ],
    whatToPrepare: [
      "Read the public handbook's hiring section — the process, and often the questions' shape, are documented before you apply.",
      "Prepare evidence of asynchronous working: written handovers, documentation you own, decisions recorded in writing.",
      "State your timezone and overlap hours explicitly in the application.",
      "Expect written exercises to carry real weight; treat them as deliverables, not formalities."
    ],
    officialUrl: "https://about.gitlab.com/jobs/",
    relatedTestTypes: ["coding-assessment", "video-interview"],
    relatedGuides: ["online-assessment-tests-remote-first-companies"]
  },
  {
    slug: "automattic-remote",
    name: "Automattic",
    category: "remote-employer",
    host: "Automattic (WordPress.com, Tumblr, WooCommerce)",
    destination: "Distributed across many countries",
    level: "Engineering, design, support, marketing and operations",
    summary:
      "A long-established distributed company known for a text-based interview process and a paid trial project that carries more weight than the interview itself.",
    openTo:
      "Candidates globally, subject to the contracting arrangements available in your country.",
    covers: [
      "Fully distributed roles",
      "A paid trial project as a core selection stage",
      "Asynchronous, written-first working"
    ],
    selection: [
      "Application reviewed with attention to written communication",
      "Text-based interview conducted over chat rather than video",
      "A paid trial project completed at your own pace, which is the decisive stage"
    ],
    whatToPrepare: [
      "Practise interviewing by text. It is a genuinely different skill from speaking, and it is the format used.",
      "Budget real time for the trial project — it carries the decision, and rushing it is the common failure.",
      "Write an application that demonstrates the written clarity the role requires rather than describing it.",
      "Have your contracting and payment route settled before the offer stage."
    ],
    officialUrl: "https://automattic.com/work-with-us/",
    relatedTestTypes: ["coding-assessment"],
    relatedGuides: [
      "online-assessment-tests-remote-first-companies",
      "work-from-home-getting-paid-across-borders"
    ]
  }
];

export const opportunityBySlug = (slug: string) =>
  opportunities.find((opportunity) => opportunity.slug === slug);

export const opportunitiesByCategory = (category: OpportunityCategory) =>
  opportunities.filter((opportunity) => opportunity.category === category);

export const opportunityCategoryById = (id: OpportunityCategory) =>
  opportunityCategories.find((category) => category.id === id);

/** Shown on every opportunity surface — terms change every cycle. */
export const VERIFY_NOTICE =
  "Deadlines, award amounts and eligibility change every cycle. Always confirm the current terms on the official page before applying — we deliberately do not publish figures that go stale.";
