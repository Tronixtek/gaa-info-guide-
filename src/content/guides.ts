import type { Guide, Pillar } from "./types";

export const pillars: { id: Pillar; label: string; blurb: string }[] = [
  {
    id: "assessments",
    label: "Technical assessments",
    blurb: "Aptitude tests, coding screens, assessment centres and the scoring models behind them."
  },
  {
    id: "remote-jobs",
    label: "Remote job exams",
    blurb: "Global hiring pipelines, work-sample tasks, async interviews and international applications."
  },
  {
    id: "study-abroad",
    label: "Study abroad",
    blurb: "Admissions tests, English proficiency, scholarships, documents and visa timelines."
  },
  {
    id: "work-from-home",
    label: "Work from home",
    blurb: "Skills, portfolios, client acquisition and getting paid across borders."
  }
];

export const guides: Guide[] = [
  {
    slug: "four-week-aptitude-test-preparation-plan",
    title: "A four-week preparation plan for aptitude and reasoning tests",
    pillar: "assessments",
    summary:
      "A week-by-week schedule that moves from untimed accuracy to full timed simulation, with the diagnostic and review routine that makes practice actually compound.",
    authorSlug: "assessment-practice",
    publishedAt: "2026-06-02",
    reviewedAt: "2026-08-05",
    readMinutes: 11,
    relatedTestTypes: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning"],
    keyTakeaways: [
      "Diagnose before you drill — practising your strongest test type is the most common way to waste a preparation month.",
      "Build accuracy untimed first. Speed added to a broken method just produces confident wrong answers faster.",
      "Log every wrong answer by cause, not by topic. Three causes account for most lost marks.",
      "Simulate the real conditions — same device, same time of day, no pauses — at least three times before the live sitting."
    ],
    sections: [
      {
        heading: "Week 1 — diagnose, then stop guessing what to work on",
        body: [
          "Sit one full, timed test in each format you are likely to face. Do not prepare for these. The point is a clean baseline, and a baseline you have warmed up for is worthless.",
          "Record three numbers per test: raw score, questions attempted, and the number of questions you got wrong that you had time to check. That third number separates a speed problem from an accuracy problem, and they need opposite fixes."
        ],
        list: [
          "Scoring well but attempting few questions — you have a pace problem. Work on elimination and estimation.",
          "Attempting everything but scoring poorly — you have a method problem. Slow down and go untimed for a week.",
          "Low on both — start with method. Speed built on a broken method does not transfer."
        ]
      },
      {
        heading: "Week 2 — rebuild method untimed",
        body: [
          "Work in blocks of ten questions with no clock at all. For every question, write down the step you took before you look at the options. In numerical reasoning that means writing the division before you touch the calculator; in verbal reasoning it means locating the exact sentence before you judge the statement.",
          "This feels slow and it is meant to. You are installing a repeatable procedure so that when the clock returns, the procedure runs without deliberation."
        ]
      },
      {
        heading: "Week 3 — reintroduce the clock in stages",
        body: [
          "Set a per-question target rather than a whole-test target: around 60 seconds for numerical, 45 for verbal statements, 45 to 60 for logical items. Use a timer you can see. When you hit the target without an answer, make your best elimination and move on — that habit is worth more marks than any individual question.",
          "Move to full-length timed sections by the end of the week, but keep reviewing every question afterwards."
        ]
      },
      {
        heading: "Week 4 — simulate, then taper",
        body: [
          "Run at least three full simulations under real conditions: the device you will actually use, the time of day of your booked slot, no pauses, phone in another room. Most score drops on the day come from conditions, not content.",
          "In the final two days stop drilling new material. Re-read your error log and your worked solutions instead. Cramming new question types late reliably reduces scores."
        ]
      },
      {
        heading: "The error log that does the actual work",
        body: [
          "Practice volume alone plateaus quickly. What compounds is classification. After every session, log each wrong answer against one of these causes:"
        ],
        list: [
          "Misread the question — answered a real question, but not the one asked.",
          "Method error — right question, wrong procedure.",
          "Arithmetic or transcription slip — right method, wrong execution.",
          "Ran out of time — never actually attempted it.",
          "Genuine knowledge gap — did not know the technique at all."
        ]
      },
      {
        heading: "Reading the log",
        body: [
          "After two weeks the distribution tells you what to fix. Mostly misreads means you are reading the data before the question — reverse that order. Mostly time-outs means your elimination discipline is weak, not your maths. Mostly method errors means going back to untimed work for a few more sessions.",
          "Candidates who log by cause rather than by topic consistently improve faster, because the fix for a misread is nothing like the fix for a knowledge gap — and topic-based logs cannot tell them apart."
        ]
      }
    ],
    sources: [
      { label: "AssessmentDay — practice tests and worked solutions", url: "https://www.assessmentday.com/" },
      { label: "Practice Aptitude Tests — psychometric test guide", url: "https://www.practiceaptitudetests.com/psychometric-tests/" }
    ]
  },
  {
    slug: "online-assessment-tests-remote-first-companies",
    title: "How remote-first companies actually screen candidates",
    pillar: "remote-jobs",
    summary:
      "The four-stage pipeline most distributed companies run, what each stage is really scoring, and where international applicants lose offers they had already earned.",
    authorSlug: "global-careers",
    publishedAt: "2026-05-18",
    reviewedAt: "2026-07-28",
    readMinutes: 10,
    relatedTestTypes: ["coding-assessment", "video-interview", "situational-judgement"],
    keyTakeaways: [
      "Remote pipelines front-load automated filtering because they receive far more applications per role.",
      "The work-sample task carries the most weight and is where most candidates under-invest.",
      "Async video interviews are scored against a competency framework, not on charisma.",
      "Timezone overlap and payment logistics decide more international outcomes than skill does."
    ],
    sections: [
      {
        heading: "The pipeline is four stages, and it is mostly automated at the top",
        body: [
          "A distributed company hiring globally receives an order of magnitude more applications than a company hiring within commuting distance of one office. The response is heavy automated filtering early, and heavy human attention late."
        ],
        list: [
          "Stage 1 — application screen: keyword and eligibility matching, often before a human sees anything.",
          "Stage 2 — automated assessment: a coding screen, an aptitude test, or a short work sample.",
          "Stage 3 — async video interview: fixed questions, fixed answer windows, scored against a rubric.",
          "Stage 4 — live interviews and a paid or unpaid work-sample project."
        ]
      },
      {
        heading: "Stage 1 — write for the filter and the human",
        body: [
          "Mirror the exact terminology of the job posting. If the posting says 'asynchronous collaboration', do not write 'remote teamwork' and expect a match. This is not keyword stuffing; it is making the same claim in the vocabulary the filter was built around.",
          "State your timezone and your overlap hours explicitly, in the application itself. Remote teams filter hard on overlap, and a candidate who leaves it ambiguous is treated as a risk rather than given the benefit of the doubt."
        ]
      },
      {
        heading: "Stage 2 — the automated assessment",
        body: [
          "For technical roles this is usually a timed coding screen on a platform like HackerRank, Codility or CodeSignal. Hidden test cases mean partial correctness is normal and expected: a working brute-force solution that passes most cases scores far above an elegant solution that never compiled.",
          "For non-technical roles it is typically a numerical or situational judgement test. The scoring is percentile-based against other applicants for the same role, which is why practising the specific format matters more than general ability."
        ]
      },
      {
        heading: "Stage 3 — async video, where structure beats polish",
        body: [
          "You get a question on screen, a short preparation window, and one recording attempt inside a fixed limit. There is no interviewer to read and no follow-up prompt to rescue a drifting answer.",
          "Use STAR and budget the time so you actually reach the Result. Roughly 15% Situation, 20% Task, 45% Action, 20% Result. The most common scoring failure is a rich Situation, a detailed Task, and the recording cutting off before any outcome is stated.",
          "Prepare six evidence stories rather than one answer per question. Six well-chosen stories can be reframed to cover most competency frameworks."
        ]
      },
      {
        heading: "Stage 4 — the work sample carries the most weight",
        body: [
          "This is the stage that most often decides the offer, and the stage candidates most often rush. If the brief asks for engineering judgement, the README is part of the deliverable: how to run it, what you traded off, what you would do with another week.",
          "Treat any explicit instruction in the brief as a scored item. Briefs frequently contain a deliberate instruction — a specific file name, a stated constraint, a required format — precisely to test whether you read carefully."
        ]
      },
      {
        heading: "Where international candidates actually lose offers",
        body: [
          "Rarely on capability. Usually on three logistics questions that go unanswered:"
        ],
        list: [
          "Overlap — name your guaranteed overlap window in the employer's timezone, in writing, early.",
          "Contracting — know whether you would be a contractor or employed through an employer-of-record, and be ready to say which you can accommodate.",
          "Payment — have a receiving route that works for the employer's finance team before you are asked, not after."
        ]
      }
    ],
    sources: [
      { label: "GraduatesFirst — assessment and video interview practice", url: "https://www.graduatesfirst.com/" },
      { label: "Indeed Career Guide", url: "https://www.indeed.com/career-advice" }
    ]
  },
  {
    slug: "situational-judgement-test-scoring-explained",
    title: "How situational judgement tests are actually scored",
    pillar: "assessments",
    summary:
      "Why the answer key comes from the employer's own high performers, what that means for preparation, and the response patterns that score consistently across employers.",
    authorSlug: "assessment-practice",
    publishedAt: "2026-04-21",
    reviewedAt: "2026-08-01",
    readMinutes: 8,
    relatedTestTypes: ["situational-judgement", "video-interview"],
    keyTakeaways: [
      "The key is built from what experienced high performers in that role said they would do.",
      "This is the one aptitude test where researching the employer genuinely changes your answers.",
      "Inaction is almost always the lowest-scoring option available.",
      "Answer as the role described, not at your real level of seniority."
    ],
    sections: [
      {
        heading: "Where the answer key comes from",
        body: [
          "Situational judgement tests are not scored against an abstract notion of good behaviour. The publisher builds the key empirically: they present the scenarios to experienced, high-performing people already in that role, collect their rankings, and score candidates against that consensus.",
          "Two consequences follow directly. First, the key encodes that specific employer's norms, so the same scenario can score differently at two organisations. Second, there is often partial credit — ranking formats award marks for getting the order approximately right, so an unanswered item is strictly worse than a considered guess."
        ]
      },
      {
        heading: "Research that actually changes your answers",
        body: [
          "Read the employer's published values and competency framework before you sit the test. These are usually on the careers site, and the scenarios are frequently written directly against them.",
          "A firm that leads on 'client first' and a firm that leads on 'speak up early' will key the same escalation scenario differently. This is the only aptitude test where that research converts into marks."
        ]
      },
      {
        heading: "Patterns that score well across most employers",
        body: [
          "Employer-specific weighting sits on top of a fairly stable base. These patterns hold nearly everywhere:"
        ],
        list: [
          "Address the problem directly, at the level you own it, before escalating.",
          "Involve the right person — not nobody, and not everybody.",
          "Disclose errors early, with their impact quantified and a fix proposed.",
          "Prefer responses that solve the immediate issue and prevent recurrence.",
          "Where accuracy and speed conflict, secure accuracy and give a firm short timeline."
        ]
      },
      {
        heading: "Patterns that score badly nearly everywhere",
        body: [
          "The failure modes are just as consistent, and they are worth memorising because they let you eliminate options quickly under time pressure:"
        ],
        list: [
          "Waiting to see whether a known problem resolves itself — usually the single lowest-scoring option.",
          "Escalating immediately on something clearly inside your own remit.",
          "Acting entirely alone on something that affects others.",
          "Solving the visible symptom while concealing it from anyone who should know.",
          "Choosing the most assertive option because it reads as decisive."
        ]
      },
      {
        heading: "Answer as the role, not as yourself",
        body: [
          "The scenario always tells you your position. If it says you are a graduate analyst, you do not overrule a client, and you do not make unilateral calls on external communication.",
          "A related trap: 'most effective' and 'what I would actually do' are different questions. Candidates who answer honestly about their own instincts rather than about effectiveness lose marks they did not need to lose."
        ]
      }
    ],
    sources: [
      { label: "AssessmentDay — situational judgement tests", url: "https://www.assessmentday.com/" }
    ]
  },
  {
    slug: "study-abroad-application-timeline",
    title: "A twelve-month study abroad application timeline",
    pillar: "study-abroad",
    summary:
      "Month-by-month sequencing of tests, documents, scholarships and visas — ordered by which deadlines cannot be recovered once missed.",
    authorSlug: "global-careers",
    publishedAt: "2026-03-14",
    reviewedAt: "2026-07-19",
    readMinutes: 12,
    relatedTestTypes: ["english-proficiency"],
    keyTakeaways: [
      "Sequence by irreversibility: financial documents and visa slots recover the slowest.",
      "Check per-section English minimums before booking, not after scoring.",
      "Most scholarship deadlines fall before or alongside admission deadlines, not after.",
      "Build in one full retake cycle for every test you sit."
    ],
    sections: [
      {
        heading: "Months 12–10: shortlist and confirm the real requirements",
        body: [
          "Build a shortlist of eight to twelve programmes across three tiers of selectivity. For each one, record the exact admission deadline, the required tests, the minimum overall score, the minimum per-section score, and the financial evidence required.",
          "Per-section minimums are the requirement candidates most often miss. An overall band that clears the bar with one section below its minimum fails the application outright, and no amount of strength elsewhere compensates."
        ]
      },
      {
        heading: "Months 10–8: sit tests early enough to retake",
        body: [
          "Book your English proficiency test with enough runway for one full retake cycle — that means scores back, a booked resit, and results reported, all before the earliest deadline on your list.",
          "Confirm which tests both the institution and your visa route accept. They are not always the same list, and a score that satisfies admissions but not the immigration authority is a wasted sitting."
        ]
      },
      {
        heading: "Months 8–6: documents and recommenders",
        body: [
          "Request transcripts and any required credential evaluations now; institutional turnaround is slow and outside your control. Approach recommenders with a package that makes writing easy."
        ],
        list: [
          "Your CV and the specific programme description.",
          "Two or three concrete things you did in their class or team, with detail.",
          "The deadline, the submission route, and whether it is a portal link or an email.",
          "A polite reminder scheduled for two weeks before the deadline."
        ]
      },
      {
        heading: "Months 6–4: statement of purpose",
        body: [
          "Write one strong core statement, then tailor a substantive section for each programme. Generic statements are visible immediately, and so are lightly find-and-replaced ones — naming the university while describing a course it does not offer is a recognisable failure.",
          "A structure that works: what you want to study and why now; the specific evidence that you can do it; why this programme in particular, naming named faculty, modules or facilities; and what you intend to do afterwards."
        ]
      },
      {
        heading: "Months 6–3: scholarships run in parallel, not after",
        body: [
          "Treat scholarships as a parallel track. Many close before or alongside admission deadlines, and a substantial number of applicants discover this only after being admitted.",
          "Apply across the full range: institutional awards from the university, government schemes from the host country, and external foundations. Institutional awards are usually the largest and the most predictable, so make those the priority."
        ]
      },
      {
        heading: "Months 3–0: offers, finance and visa",
        body: [
          "Once you hold an offer, the visa becomes the critical path and it is the least forgiving part of the timeline. Financial evidence typically has to sit in an eligible account for a defined minimum period — often 28 days — before the application, so moving money late invalidates it regardless of the amount.",
          "Book biometrics and appointments the day you become eligible. Appointment availability, not processing time, is what most often causes a deferred start."
        ]
      },
      {
        heading: "The ordering principle",
        body: [
          "When timelines compress, prioritise by how badly a miss can be recovered. Financial evidence maturing and visa appointment availability cannot be accelerated at any price. Test dates can sometimes be brought forward. Statements can be written quickly under pressure. Sequence accordingly, and protect the slow items first."
        ]
      }
    ],
    sources: [
      { label: "Shiksha Study Abroad — country, visa and scholarship guides", url: "https://www.shiksha.com/studyabroad/" }
    ]
  },
  {
    slug: "numerical-reasoning-data-interpretation-method",
    title: "The reading method that fixes most numerical reasoning errors",
    pillar: "assessments",
    summary:
      "Most lost marks in numerical reasoning are reading failures, not arithmetic failures. A five-step routine that removes them.",
    authorSlug: "assessment-practice",
    publishedAt: "2026-05-06",
    reviewedAt: "2026-08-03",
    readMinutes: 7,
    relatedTestTypes: ["numerical-reasoning"],
    keyTakeaways: [
      "Read the question before the data set — it tells you which column matters.",
      "Check the units line every single time; scale errors are the most common trap built into these tests.",
      "'Percentage points' and 'percent' are different quantities and are tested deliberately.",
      "Estimate first to eliminate options, and only then calculate precisely."
    ],
    sections: [
      {
        heading: "Why the arithmetic is not the problem",
        body: [
          "The mathematics in a numerical reasoning test rarely exceeds percentages, ratios and rates of change — material most candidates covered years earlier. Yet scores cluster well below what that suggests.",
          "The reason is that these tests are constructed as reading comprehension exercises wearing numerical clothing. The distractors are not random: each one is the answer to a plausible misreading of the question. That is why a candidate can execute flawless arithmetic and still land squarely on a wrong option."
        ]
      },
      {
        heading: "The five-step routine",
        body: [
          "Applied consistently, this removes the large majority of avoidable errors:"
        ],
        list: [
          "Read the question first. Then read only the part of the data set it names.",
          "Check the units line. Thousands, millions, percentages, index points — confirm before calculating.",
          "Identify the quantity asked for: absolute change, percentage change, share of total, or percentage-point change. These are four different questions.",
          "Estimate and eliminate. Round hard and discard options in the wrong order of magnitude.",
          "Calculate precisely only among the survivors."
        ]
      },
      {
        heading: "The three traps that are built in deliberately",
        body: [
          "First, percentage change divides by the original value, not the new one. Dividing by the new value is the most frequently planted distractor in the whole format.",
          "Second, a percentage-point change is a subtraction of two percentages, while a percentage change is a ratio of them. Where a question involves shares of a total across two periods, expect both to appear among the options.",
          "Third, the total row. When a question names one category, using the total is a reading error that produces a clean-looking number and a wrong answer."
        ]
      },
      {
        heading: "Estimation is a scoring technique, not a shortcut",
        body: [
          "Options in these tests are usually spread widely enough that rounding to one significant figure eliminates two of four. That converts a 60-second question into a 20-second one, and the time saved is what lets you attempt the questions you would otherwise never reach.",
          "Since most numerical reasoning tests score raw correct answers with no negative marking, an eliminated-down guess on an unfinished question is strictly better than leaving it blank."
        ]
      }
    ],
    sources: [
      { label: "JobTestPrep — aptitude test practice", url: "https://www.jobtestprep.com/aptitude-tests" }
    ]
  },
  {
    slug: "work-from-home-getting-paid-across-borders",
    title: "Building a remote income: skills, proof, clients and getting paid",
    pillar: "work-from-home",
    summary:
      "The practical sequence for earning online from outside the hiring country — choosing a service, proving it without clients, finding the first three, and receiving money reliably.",
    authorSlug: "global-careers",
    publishedAt: "2026-02-27",
    reviewedAt: "2026-07-22",
    readMinutes: 10,
    relatedTestTypes: ["coding-assessment", "video-interview"],
    keyTakeaways: [
      "Sell one specific outcome, not a list of skills — narrow beats broad for the first clients.",
      "Self-directed proof works. Three finished public artefacts substitute for a client history.",
      "The first three clients come from proximity, not from marketplaces.",
      "Sort out the payment route before you need it; it decides which clients you can accept."
    ],
    sections: [
      {
        heading: "Pick a specific outcome, not a skill list",
        body: [
          "'I do web development' competes against everyone. 'I rebuild slow Shopify product pages so they load under two seconds' competes against very few, and it tells a buyer exactly when to call you.",
          "Narrowness feels like it shrinks the market, and it does — but it raises your conversion rate on the smaller market by far more, which is what matters when you need three clients rather than three hundred."
        ]
      },
      {
        heading: "Prove it before anyone hires you",
        body: [
          "The circular problem of needing experience to get experience dissolves if you generate the proof yourself. Three finished, public artefacts substitute effectively for a client history:"
        ],
        list: [
          "A rebuild — take a real public example in your niche, improve it, and document what changed with before-and-after measurements.",
          "A teardown — analyse a real product or process in your niche in public, showing how you think.",
          "A tool or template — something small that solves one recurring problem, free to use."
        ]
      },
      {
        heading: "Where the first three clients actually come from",
        body: [
          "Almost never from cold marketplace bidding, where you compete purely on price against a global pool. They come from proximity: people who already know you or already know your work.",
          "Tell your existing network specifically what you now do — not that you are 'available for opportunities' but the exact outcome you sell. Answer questions in public in the communities where your buyers gather. Approach small businesses with a specific observed problem and a specific fix, not a generic offer of services."
        ]
      },
      {
        heading: "Price on value, and never on hours worked",
        body: [
          "Hourly pricing penalises you for getting faster, which is the exact opposite of the incentive you want. Quote a fixed price per project, scoped tightly, with a written definition of what is included and what triggers a new quote.",
          "Take a deposit before starting — 30% to 50% is standard and unremarkable. A client unwilling to pay a deposit is telling you something useful before it becomes expensive."
        ]
      },
      {
        heading: "Getting paid is a real constraint, so solve it first",
        body: [
          "Your receiving route determines which clients you can accept, so treat it as infrastructure rather than an afterthought. Work out, before you need it, how a client in your target market can pay you, what it costs in fees and FX spread, and how long it takes to clear.",
          "Compare the total cost rather than the headline fee — the exchange-rate margin is frequently larger than the stated transfer fee. Keep a second route available, because account restrictions and regional service changes happen without warning and mid-project is the worst time to discover it.",
          "Keep business receipts separate from personal ones from the first invoice, and check your own country's rules on declaring foreign income early. Both are far cheaper to set up than to reconstruct later."
        ]
      },
      {
        heading: "Make the second project automatic",
        body: [
          "The most reliable source of the fourth client is the first one. Close every project with a short written summary: what you did, what it achieved in numbers, and what you would recommend next.",
          "That document does three jobs — it justifies the invoice, it seeds the follow-on project, and it becomes the case study that wins the client after that."
        ]
      }
    ]
  }
];

export const guideBySlug = (slug: string) => guides.find((guide) => guide.slug === slug);

export const guidesByPillar = (pillar: Pillar) => guides.filter((guide) => guide.pillar === pillar);

export const guidesByAuthor = (authorSlug: string) =>
  guides.filter((guide) => guide.authorSlug === authorSlug);

export const pillarById = (id: Pillar) => pillars.find((pillar) => pillar.id === id);
