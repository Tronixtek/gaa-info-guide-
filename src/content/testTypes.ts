import type { TestType } from "./types";

export const testTypes: TestType[] = [
  {
    slug: "numerical-reasoning",
    name: "Numerical Reasoning Test",
    shortName: "Numerical",
    summary:
      "Interpret tables, charts and financial data under time pressure, then answer multi-step calculation questions.",
    description: [
      "A numerical reasoning test gives you a data set — usually a table, a bar chart or a short financial extract — and asks questions that can only be answered by reading the data correctly and doing two or three arithmetic steps. The mathematics rarely goes beyond percentages, ratios, and simple rates of change. The difficulty is in the reading and the clock.",
      "Employers use it because it predicts how reliably a candidate handles quantitative information in a real role: reading a budget, checking a supplier quote, spotting that a reported figure cannot be right. It is the single most common test in graduate and commercial hiring."
    ],
    measures: "Data interpretation, percentage and ratio work, and accuracy under time pressure.",
    pace: "60–75 seconds per question, with the data set shared across several questions",
    publishers: ["SHL", "Talogy (Cubiks)", "Saville Assessment", "IBM Kenexa", "Pearson TalentLens"],
    industries: ["Banking and finance", "Consulting", "FMCG", "Retail", "Technology"],
    employers: ["Deloitte", "PwC", "HSBC", "Unilever", "Amazon"],
    tips: [
      "Read the question before you read the data set — it tells you which column actually matters.",
      "Check the units line every time. Figures reported in thousands or millions are the most common trap.",
      "Do percentage change as (new − old) ÷ old, and write the division down before you reach for the calculator.",
      "Round aggressively to eliminate options first. Most questions have only one option in the right order of magnitude.",
      "If a question needs more than three steps, flag it and come back. Nothing is worth two questions' time."
    ],
    commonMistakes: [
      "Answering the percentage-point question with a percentage-change figure.",
      "Using the total row when the question asked about a single category.",
      "Mixing a year-on-year rate with a cumulative rate.",
      "Spending calculator time on a question the options could have eliminated by estimation."
    ]
  },
  {
    slug: "verbal-reasoning",
    name: "Verbal Reasoning Test",
    shortName: "Verbal",
    summary:
      "Judge whether statements are true, false or indeterminate based strictly on a short business passage.",
    description: [
      "A verbal reasoning test presents a passage of business or general-interest prose and asks you to evaluate statements against it. The standard format is True / False / Cannot Say: the statement follows from the passage, contradicts it, or the passage simply does not contain enough information to decide.",
      "The test is not a vocabulary test and not a general knowledge test. It measures whether you can hold yourself to the text — which is exactly why outside knowledge is the most common reason candidates lose marks."
    ],
    measures: "Close reading, logical inference, and the discipline to reason only from the given text.",
    pace: "45–60 seconds per statement, with one passage covering three to five statements",
    publishers: ["SHL", "Talogy (Cubiks)", "Saville Assessment", "IBM Kenexa", "Pearson TalentLens"],
    industries: ["Law", "Consulting", "Public sector", "Media", "Banking and finance"],
    employers: ["Clifford Chance", "PwC", "Civil Service", "Deloitte", "HSBC"],
    tips: [
      "Treat the passage as the entire universe of facts. What you know about the topic is inadmissible.",
      "'Cannot Say' is correct far more often than candidates expect — it is not the safe fallback, it is a real answer.",
      "Watch the quantifiers: all, some, most, only, never. A statement that widens a quantifier is False, not True.",
      "A statement that is merely plausible given the passage is 'Cannot Say'. Plausible is not stated.",
      "Read the statement twice before returning to the passage. Most errors are misread statements, not misread passages."
    ],
    commonMistakes: [
      "Marking True because the statement is true in the real world.",
      "Marking False when the passage is simply silent — that is Cannot Say.",
      "Missing a causal claim smuggled into a statement that the passage only reports as correlation.",
      "Re-reading the whole passage for every statement instead of locating the relevant sentence."
    ]
  },
  {
    slug: "logical-reasoning",
    name: "Logical Reasoning Test",
    shortName: "Logical",
    summary:
      "Identify the rule governing a sequence of shapes or symbols and apply it to predict what comes next.",
    description: [
      "Logical reasoning — often sold as inductive reasoning or abstract reasoning — strips out language and arithmetic entirely. You are shown a sequence or a set of figures and must work out the underlying rule, then apply it.",
      "Because it is language-free, it is the test employers trust most across international candidate pools, and it correlates strongly with general problem-solving ability. It is also the test where systematic method beats raw intuition by the widest margin."
    ],
    measures: "Pattern recognition, rule induction, and hypothesis testing without domain knowledge.",
    pace: "45–60 seconds per item",
    publishers: ["SHL", "Saville Assessment", "Talogy (Cubiks)", "Arctic Shores", "Pearson TalentLens"],
    industries: ["Technology", "Engineering", "Consulting", "Manufacturing", "Research"],
    employers: ["Google", "Dyson", "Rolls-Royce", "Accenture", "Shell"],
    tips: [
      "Check one attribute at a time in a fixed order: number, shape, size, shading, rotation, position.",
      "Write the rule in words before you look at the options. Options are designed to be individually plausible.",
      "Count elements first. Counting rules are the most common and the fastest to confirm.",
      "Rotation is usually a constant number of degrees in a constant direction — check the first two frames, confirm on the third.",
      "If two rules both fit the sequence, the correct answer is the one that fits every frame, not most frames."
    ],
    commonMistakes: [
      "Locking onto the first rule found and never testing it against the final frame.",
      "Confusing rotation with reflection — a reflected figure has a reversed handedness, a rotated one does not.",
      "Missing a second, simultaneous rule operating on a different attribute.",
      "Picking the option that looks most like the last frame rather than the one the rule produces."
    ]
  },
  {
    slug: "situational-judgement",
    name: "Situational Judgement Test",
    shortName: "Situational",
    summary:
      "Choose the most and least effective response to realistic workplace scenarios drawn from the actual role.",
    description: [
      "A situational judgement test describes a workplace scenario and offers four or five possible responses. You rank them, or pick the most and least effective. There is a scoring key, built from what experienced high performers in that role actually said they would do.",
      "It is the one aptitude test where the employer's own values shape the answer key, which makes researching the organisation genuinely useful preparation — unlike every other test in this list."
    ],
    measures: "Workplace judgement, prioritisation, escalation instincts, and fit with the employer's stated values.",
    pace: "60–90 seconds per scenario",
    publishers: ["SHL", "Talogy (Cubiks)", "Cappfinity", "IBM Kenexa"],
    industries: ["Healthcare", "Public sector", "Retail", "Consulting", "Financial services"],
    employers: ["NHS", "Civil Service", "PwC", "Aldi", "Barclays"],
    tips: [
      "Read the employer's published values and competency framework first — the key is built from them.",
      "Prefer responses that address the problem directly and involve the right person, rather than escalating immediately or acting entirely alone.",
      "Doing nothing, or waiting to see what happens, is almost always the least effective option.",
      "Responses that solve the immediate issue but hide it from a manager score badly even when they work.",
      "Answer as the role described, not as your current seniority. A graduate does not overrule a client."
    ],
    commonMistakes: [
      "Escalating to a manager as the first move when the scenario is clearly within your own remit.",
      "Choosing the most assertive option because it sounds decisive.",
      "Ignoring the stated role and answering as someone with authority you were not given.",
      "Treating 'most effective' and 'what I would actually do' as the same question."
    ]
  },
  {
    slug: "diagrammatic-reasoning",
    name: "Diagrammatic Reasoning Test",
    shortName: "Diagrammatic",
    summary:
      "Trace inputs through a chain of process operators and work out the output — or the missing operator.",
    description: [
      "Diagrammatic reasoning tests present a flow of inputs through labelled operators, each of which transforms the input in a defined way. You either predict the output, or identify which operator must sit in a gap to produce a known output.",
      "It is used heavily for engineering, IT and process roles because it maps closely onto reading a system diagram or debugging a pipeline."
    ],
    measures: "Process logic, sequential reasoning, and holding intermediate state accurately.",
    pace: "60–75 seconds per item",
    publishers: ["SHL", "Saville Assessment", "Talogy (Cubiks)"],
    industries: ["Engineering", "Technology", "Manufacturing", "Utilities", "Defence"],
    employers: ["BAE Systems", "Siemens", "IBM", "National Grid", "Airbus"],
    tips: [
      "Derive each operator's rule from the worked examples before touching the question.",
      "Write the intermediate state after every operator. Holding it mentally is where the errors come from.",
      "Apply operators strictly left to right unless the test states otherwise.",
      "When solving for a missing operator, work backwards from the output as well as forwards from the input and meet in the middle.",
      "Check whether an operator acts on position, on shape, or on both — many act on only one attribute."
    ],
    commonMistakes: [
      "Assuming an operator that swapped two items in one example always swaps those same two positions.",
      "Applying operators in the wrong order and landing on a distractor that was built from exactly that error.",
      "Forgetting that some operators are conditional and only fire on a matching input.",
      "Not verifying the derived rule against the second worked example."
    ]
  },
  {
    slug: "coding-assessment",
    name: "Coding Assessment",
    shortName: "Coding",
    summary:
      "Timed programming tasks and automated work samples used in technical and remote-first hiring pipelines.",
    description: [
      "Coding assessments range from short automated screens of algorithmic questions to multi-hour take-home work samples. Remote-first employers lean on them heavily because they are the cheapest reliable signal available before an interview.",
      "The scoring is rarely pure correctness. Hidden test cases, time and space complexity, readability, and whether you handled edge cases all contribute — and on take-homes, so does your README."
    ],
    measures: "Problem decomposition, correctness on edge cases, complexity awareness, and code clarity.",
    pace: "20–45 minutes per algorithmic task; 2–6 hours for a take-home work sample",
    publishers: ["HackerRank", "Codility", "CoderPad", "CodeSignal", "Karat"],
    industries: ["Technology", "Financial services", "Startups", "Remote-first companies"],
    employers: ["Stripe", "Shopify", "Revolut", "GitLab", "Automattic"],
    tips: [
      "Restate the problem and enumerate edge cases before writing a line — empty input, single element, duplicates, overflow.",
      "Get a correct brute-force solution passing first, then optimise. A working O(n²) scores far above an unfinished O(n log n).",
      "Say your complexity out loud in the comments. Graders and reviewers look for it explicitly.",
      "On take-homes, the README carries real marks: how to run it, what you traded off, what you would do with more time.",
      "Practise in the platform's own editor. No autocomplete and no local tooling is its own separate skill."
    ],
    commonMistakes: [
      "Optimising before anything passes and submitting nothing that runs.",
      "Ignoring the stated input constraints, which usually tell you the intended complexity.",
      "Leaving no tests on a take-home that explicitly asked for engineering judgement.",
      "Silent failure on edge cases that the hidden test suite covers and the sample input does not."
    ]
  },
  {
    slug: "video-interview",
    name: "Asynchronous Video Interview",
    shortName: "Video interview",
    summary:
      "Recorded, one-way interviews with fixed preparation and answer windows, scored on structure and evidence.",
    description: [
      "In an asynchronous video interview you receive a question on screen, get a short preparation window, then record an answer within a fixed time limit — often with only one take. There is no interviewer to read, no follow-up prompt, and no opportunity to recover a rambling answer.",
      "Scoring is against a competency framework. Structure and concrete evidence matter far more than polish, and the fixed time limit means an unstructured answer simply runs out before the result."
    ],
    measures: "Structured communication, competency evidence, and composure without interviewer feedback.",
    pace: "30–60 seconds preparation, 90–180 seconds to answer",
    publishers: ["HireVue", "Talogy (Cubiks)", "Sonru", "Willo"],
    industries: ["Consulting", "Retail", "Financial services", "Remote-first companies", "Public sector"],
    employers: ["Unilever", "Vodafone", "Goldman Sachs", "PwC", "Accenture"],
    tips: [
      "Use STAR and land the Result before your time expires — budget roughly 15% Situation, 20% Task, 45% Action, 20% Result.",
      "Prepare six evidence stories that can each be reframed for several competencies, rather than one story per question.",
      "Look at the camera lens, not your own image on screen. Disable self-view if the platform allows it.",
      "Do a full technical rehearsal on the same device, network and lighting you will use on the day.",
      "Open with a one-sentence answer to the question, then evidence it. Do not build to the point."
    ],
    commonMistakes: [
      "Running out of time in the Situation and never reaching the Result.",
      "Reading a visibly scripted answer, which scores worse than an imperfect spoken one.",
      "Backlighting from a window that renders the candidate as a silhouette.",
      "Answering a competency question with a generic description of the role instead of a specific incident."
    ]
  },
  {
    slug: "english-proficiency",
    name: "English Proficiency Test",
    shortName: "English proficiency",
    summary:
      "IELTS, TOEFL, PTE and Duolingo English Test preparation for study abroad and visa applications.",
    description: [
      "English proficiency tests gate most study-abroad admissions and many skilled work visas. The four skills — listening, reading, writing and speaking — are scored separately, and institutions usually set both an overall band and a per-section minimum you must clear.",
      "The per-section minimum matters more than most candidates realise: a strong overall score with one weak section fails an application outright, so preparation should be weighted toward your weakest skill, not your strongest."
    ],
    measures: "Listening, reading, writing and speaking proficiency against a banded scale.",
    pace: "Two to three hours across four sections, depending on the test",
    publishers: ["IELTS", "TOEFL iBT", "PTE Academic", "Duolingo English Test"],
    industries: ["Higher education", "Immigration", "Healthcare", "Public sector"],
    employers: ["University admissions", "Immigration authorities", "Professional registration bodies"],
    tips: [
      "Check the per-section minimum for every institution on your list before you book, not after you score.",
      "Confirm which tests your target institution and your visa route each accept — they are not always the same list.",
      "Weight your preparation toward the weakest section. Overall band is usually the easier constraint.",
      "In writing tasks, answer the exact question asked. Off-prompt essays are capped regardless of language quality.",
      "Book early. Score reporting takes days to weeks and admission deadlines do not move."
    ],
    commonMistakes: [
      "Meeting the overall band but missing a single section minimum.",
      "Sitting a test the target visa route does not accept, even though the university does.",
      "Preparing only for the strongest section because practice there feels productive.",
      "Booking so late that scores arrive after the application deadline."
    ]
  }
];

export const testTypeBySlug = (slug: string) => testTypes.find((type) => type.slug === slug);

/** Unique, sorted values across a facet — powers the publisher/industry/employer axes. */
export const facetValues = (facet: "publishers" | "industries" | "employers") =>
  Array.from(new Set(testTypes.flatMap((type) => type[facet]))).sort((a, b) => a.localeCompare(b));

export const testTypesByFacet = (facet: "publishers" | "industries" | "employers", value: string) =>
  testTypes.filter((type) => type[facet].includes(value));
