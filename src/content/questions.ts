import type { Question } from "./types";

const SALES_TABLE = `Meridian Group — revenue by region, 2025 (figures in $000s)

Region     Q1      Q2      Q3      Q4
North     420     465     500     615
South     310     298     340     352
East      180     225     270     325
West      290     285     300     308`;

const PASSAGE_FOUR_DAY = `Meridian Logistics moved its UK office operations to a four-day working week in January 2024. In the twelve months that followed, the company recorded a 12% fall in voluntary staff turnover and a 4% rise in output per employee. Absence attributed to sickness fell from 3.1% to 2.4% of scheduled days. The company has stated that it has no plans to extend the arrangement to its warehouse teams, who remain on a five-day rota. An internal survey found that 78% of office staff reported improved wellbeing, though the survey did not ask about workload intensity.`;

const PASSAGE_ASSESSMENT = `The National Skills Agency published its 2025 review of graduate recruitment. It found that 68% of employers surveyed used at least one form of online assessment during selection, up from 54% in 2020. Numerical and situational judgement tests were the two most commonly used formats. Among employers using online assessment, 41% reported that they had removed a minimum degree classification requirement from at least one role. The review surveyed 1,200 employers across nine sectors; the public sector was not included.`;

const OPERATORS = `Each operator transforms a sequence of items:

  ALPHA   swaps the first and last items
  BETA    reverses the whole sequence
  GAMMA   moves the first item to the end
  DELTA   removes the middle item (only acts on odd-length sequences)

Operators are applied strictly left to right.`;

const TRUE_FALSE_CANNOT_SAY = ["True", "False", "Cannot Say"];

export const questions: Question[] = [
  // ---------------------------------------------------------------- Numerical
  {
    id: "num-01",
    testType: "numerical-reasoning",
    topic: "Percentage change",
    difficulty: "foundation",
    stimulus: SALES_TABLE,
    stem: "By what percentage did North region revenue increase from Q1 to Q4?",
    options: ["31.7%", "39.8%", "46.4%", "53.2%"],
    answerIndex: 2,
    targetSeconds: 60,
    workedSolution: [
      "North Q1 = 420 and North Q4 = 615.",
      "Absolute increase = 615 − 420 = 195.",
      "Percentage change divides by the ORIGINAL value: 195 ÷ 420 = 0.4643.",
      "0.4643 × 100 = 46.4%.",
      "The 31.7% distractor divides by the new value (195 ÷ 615) — the single most common error on this question type."
    ]
  },
  {
    id: "num-02",
    testType: "numerical-reasoning",
    topic: "Comparison across categories",
    difficulty: "foundation",
    stimulus: SALES_TABLE,
    stem: "Which region recorded the largest absolute increase in revenue between Q2 and Q3?",
    options: ["North", "South", "East", "West"],
    answerIndex: 2,
    targetSeconds: 55,
    workedSolution: [
      "Compute each Q3 − Q2 difference rather than reading the largest Q3 figure.",
      "North: 500 − 465 = 35.",
      "South: 340 − 298 = 42.",
      "East: 270 − 225 = 45.",
      "West: 300 − 285 = 15.",
      "East is largest at 45. North is the trap: it has the biggest revenue but not the biggest increase."
    ]
  },
  {
    id: "num-03",
    testType: "numerical-reasoning",
    topic: "Share of total",
    difficulty: "standard",
    stimulus: SALES_TABLE,
    stem: "East region revenue in Q4 represented approximately what share of total Q4 revenue?",
    options: ["17.6%", "20.3%", "22.9%", "25.1%"],
    answerIndex: 1,
    targetSeconds: 70,
    workedSolution: [
      "Total Q4 = 615 + 352 + 325 + 308.",
      "615 + 352 = 967; 967 + 325 = 1,292; 1,292 + 308 = 1,600.",
      "East's share = 325 ÷ 1,600 = 0.2031.",
      "0.2031 × 100 = 20.3%.",
      "Estimation shortcut: 325 is close to a fifth of 1,600 (320), so 20% — enough to pick the option without finishing the division."
    ]
  },
  {
    id: "num-04",
    testType: "numerical-reasoning",
    topic: "Units and scale",
    difficulty: "standard",
    stimulus: SALES_TABLE,
    stem: "What was North region's total revenue across the full year 2025?",
    options: ["$200,000", "$2.0 million", "$20 million", "$2.0 billion"],
    answerIndex: 1,
    targetSeconds: 55,
    workedSolution: [
      "Sum the North row: 420 + 465 + 500 + 615 = 2,000.",
      "Now apply the units line. The table is stated in $000s, so 2,000 means 2,000 × $1,000.",
      "2,000 × $1,000 = $2,000,000, i.e. $2.0 million.",
      "Every distractor here is the right digits with the wrong scale. Reading the units line takes two seconds and protects the mark."
    ]
  },
  {
    id: "num-05",
    testType: "numerical-reasoning",
    topic: "Percentage points vs percentages",
    difficulty: "advanced",
    stimulus: SALES_TABLE,
    stem: "By how many percentage points did East region's share of total quarterly revenue change from Q1 to Q4?",
    options: [
      "5.3 percentage points",
      "20.3 percentage points",
      "35.4 percentage points",
      "80.6 percentage points"
    ],
    answerIndex: 0,
    targetSeconds: 95,
    workedSolution: [
      "This needs two shares, then a subtraction — not a percentage change.",
      "Total Q1 = 420 + 310 + 180 + 290 = 1,200. East share = 180 ÷ 1,200 = 15.0%.",
      "Total Q4 = 1,600 (from the previous question). East share = 325 ÷ 1,600 = 20.3%.",
      "Percentage-point change = 20.3 − 15.0 = 5.3 percentage points.",
      "The distractors are each a real calculation answering a different question: 35.4% is the percentage change in the share (5.3 ÷ 15), and 80.6% is the percentage growth in East's revenue (325 ÷ 180 − 1). Read the question wording carefully — 'percentage points' and 'percent' are different quantities."
    ]
  },
  {
    id: "num-06",
    testType: "numerical-reasoning",
    topic: "Forecasting from a growth rate",
    difficulty: "advanced",
    stimulus: SALES_TABLE,
    stem: "If West region revenue grows from Q4 2025 to Q1 2026 at the same percentage rate as it grew from Q3 to Q4 2025, what will Q1 2026 revenue be, to the nearest $1,000?",
    options: ["$314,000", "$316,000", "$318,000", "$324,000"],
    answerIndex: 1,
    targetSeconds: 100,
    workedSolution: [
      "First find the Q3→Q4 growth rate for West: (308 − 300) ÷ 300 = 8 ÷ 300 = 0.02667, or 2.667%.",
      "Apply that rate to Q4: 308 × 1.02667 = 316.2.",
      "The table is in $000s, so 316.2 means $316,200, which rounds to $316,000.",
      "The $324,000 distractor applies the absolute increase of 8 twice over, or applies the North region's growth rate by mistake — always confirm you are reading the row the question named."
    ]
  },

  // ------------------------------------------------------------------- Verbal
  {
    id: "verb-01",
    testType: "verbal-reasoning",
    topic: "Direct contradiction",
    difficulty: "foundation",
    stimulus: PASSAGE_FOUR_DAY,
    stem: "Statement: Meridian Logistics' warehouse teams work a four-day week.",
    options: TRUE_FALSE_CANNOT_SAY,
    answerIndex: 1,
    targetSeconds: 45,
    workedSolution: [
      "Locate the relevant sentence: 'no plans to extend the arrangement to its warehouse teams, who remain on a five-day rota'.",
      "The passage states directly that warehouse teams are on a five-day rota.",
      "The statement asserts the opposite, so it is contradicted by the passage.",
      "Answer: False. When the passage explicitly states the negation, the answer is False, never Cannot Say."
    ]
  },
  {
    id: "verb-02",
    testType: "verbal-reasoning",
    topic: "Causation vs correlation",
    difficulty: "advanced",
    stimulus: PASSAGE_FOUR_DAY,
    stem: "Statement: The move to a four-day week caused the fall in voluntary staff turnover.",
    options: TRUE_FALSE_CANNOT_SAY,
    answerIndex: 2,
    targetSeconds: 60,
    workedSolution: [
      "The passage reports two things: the change happened in January 2024, and turnover fell 12% in the twelve months that followed.",
      "That is a statement of sequence, not of cause. The passage never claims the change produced the fall.",
      "Any number of other factors — the labour market, pay changes, restructuring — could explain it, and the passage rules none of them out.",
      "Answer: Cannot Say. A causal claim built on top of a reported correlation is the single most reliable Cannot Say pattern in verbal reasoning tests."
    ]
  },
  {
    id: "verb-03",
    testType: "verbal-reasoning",
    topic: "Quantifier check",
    difficulty: "standard",
    stimulus: PASSAGE_FOUR_DAY,
    stem: "Statement: More than three-quarters of surveyed office staff reported improved wellbeing.",
    options: TRUE_FALSE_CANNOT_SAY,
    answerIndex: 0,
    targetSeconds: 45,
    workedSolution: [
      "The passage states 78% of office staff reported improved wellbeing.",
      "Three-quarters is 75%.",
      "78% > 75%, so 'more than three-quarters' holds.",
      "Note the scope is right too: the passage says office staff, and so does the statement. Answer: True."
    ]
  },
  {
    id: "verb-04",
    testType: "verbal-reasoning",
    topic: "Scope exclusion",
    difficulty: "standard",
    stimulus: PASSAGE_ASSESSMENT,
    stem: "Statement: The review's findings cover public sector employers.",
    options: TRUE_FALSE_CANNOT_SAY,
    answerIndex: 1,
    targetSeconds: 45,
    workedSolution: [
      "The final sentence states: 'the public sector was not included'.",
      "The statement claims the findings do cover public sector employers.",
      "This is directly contradicted by the passage.",
      "Answer: False. Scope limits stated at the end of a passage are easy to skim past — read to the final full stop before answering."
    ]
  },
  {
    id: "verb-05",
    testType: "verbal-reasoning",
    topic: "Information not given",
    difficulty: "standard",
    stimulus: PASSAGE_ASSESSMENT,
    stem: "Statement: Verbal reasoning was the third most commonly used assessment format.",
    options: TRUE_FALSE_CANNOT_SAY,
    answerIndex: 2,
    targetSeconds: 50,
    workedSolution: [
      "The passage names numerical and situational judgement tests as the two most commonly used formats.",
      "It says nothing about what ranked third, and does not mention verbal reasoning at all.",
      "The statement may well be true in reality, but the passage gives no basis to decide.",
      "Answer: Cannot Say. Knowing that verbal reasoning is common in practice is outside knowledge and inadmissible here."
    ]
  },
  {
    id: "verb-06",
    testType: "verbal-reasoning",
    topic: "Reading a figure precisely",
    difficulty: "advanced",
    stimulus: PASSAGE_ASSESSMENT,
    stem: "Statement: In 2020, a majority of surveyed employers used at least one form of online assessment.",
    options: TRUE_FALSE_CANNOT_SAY,
    answerIndex: 0,
    targetSeconds: 55,
    workedSolution: [
      "The passage gives the 2020 figure as 54%, framed as the baseline the 68% rose from.",
      "A majority means more than 50%.",
      "54% > 50%, so a majority did use at least one form of online assessment.",
      "Answer: True. The trap is reading 54% as 'about half' and calling the statement False — check the figure against the threshold rather than against your impression of it."
    ]
  },

  // ------------------------------------------------------------------ Logical
  {
    id: "log-01",
    testType: "logical-reasoning",
    topic: "Two simultaneous rules",
    difficulty: "standard",
    stimulus: `Frame 1: two white triangles
Frame 2: three white triangles
Frame 3: four black triangles
Frame 4: five black triangles
Frame 5: six white triangles`,
    stem: "What should Frame 6 contain?",
    options: [
      "Seven white triangles",
      "Seven black triangles",
      "Six black triangles",
      "Eight white triangles"
    ],
    answerIndex: 0,
    targetSeconds: 60,
    workedSolution: [
      "Check attributes in a fixed order. Start with count: 2, 3, 4, 5, 6 — it increases by one each frame, so Frame 6 has seven triangles.",
      "Now shading: white, white, black, black, white — it flips every two frames.",
      "Frame 5 is the first white of a new pair, so Frame 6 is the second white of that pair.",
      "Frame 6 = seven white triangles.",
      "Both distractors that change only one attribute are built from stopping after the first rule you found. Always confirm every attribute before answering."
    ]
  },
  {
    id: "log-02",
    testType: "logical-reasoning",
    topic: "Rotation",
    difficulty: "foundation",
    stimulus: `Frame 1: arrow pointing north
Frame 2: arrow pointing north-east
Frame 3: arrow pointing east
Frame 4: arrow pointing south-east`,
    stem: "Which direction does the arrow point in Frame 5?",
    options: ["South-west", "South", "East", "North-west"],
    answerIndex: 1,
    targetSeconds: 40,
    workedSolution: [
      "Each step moves the arrow one compass point clockwise, which is 45°.",
      "Confirm on more than one pair: north → north-east is 45° clockwise, and east → south-east is also 45° clockwise.",
      "Applying it to Frame 4: south-east + 45° clockwise = south.",
      "Answer: south. The north-west distractor is the anticlockwise reading — fix the direction of travel from the first two frames and hold it."
    ]
  },
  {
    id: "log-03",
    testType: "logical-reasoning",
    topic: "Alternating operations",
    difficulty: "standard",
    stem: "What number continues the sequence: 3, 4, 8, 9, 18, 19, ?",
    options: ["20", "27", "38", "39"],
    answerIndex: 2,
    targetSeconds: 55,
    workedSolution: [
      "The gaps are not constant, so test alternating operations rather than a single rule.",
      "3 → 4 is +1. 4 → 8 is ×2. 8 → 9 is +1. 9 → 18 is ×2. 18 → 19 is +1.",
      "The pattern alternates +1, ×2 and the last applied step was +1, so the next is ×2.",
      "19 × 2 = 38.",
      "The 20 distractor continues with +1; when a sequence alternates, track which operation was used last, not just the pattern in the abstract."
    ]
  },
  {
    id: "log-04",
    testType: "logical-reasoning",
    topic: "Second-order differences",
    difficulty: "standard",
    stem: "What number continues the sequence: 2, 3, 5, 8, 12, 17, ?",
    options: ["21", "22", "23", "24"],
    answerIndex: 2,
    targetSeconds: 50,
    workedSolution: [
      "Write out the differences: 3−2=1, 5−3=2, 8−5=3, 12−8=4, 17−12=5.",
      "The differences are 1, 2, 3, 4, 5 — they increase by one each time.",
      "The next difference is therefore 6.",
      "17 + 6 = 23.",
      "When first differences are not constant, always take the differences of the differences before trying anything more exotic. It resolves the majority of numeric series items."
    ]
  },
  {
    id: "log-05",
    testType: "logical-reasoning",
    topic: "Position and shading together",
    difficulty: "advanced",
    stimulus: `A 2×2 grid contains a single dot.

Frame 1: black dot, top-left
Frame 2: white dot, top-right
Frame 3: black dot, bottom-right
Frame 4: white dot, bottom-left`,
    stem: "What should Frame 5 contain?",
    options: [
      "Black dot, top-left",
      "White dot, top-left",
      "Black dot, top-right",
      "Black dot, bottom-left"
    ],
    answerIndex: 0,
    targetSeconds: 70,
    workedSolution: [
      "Take position first: top-left → top-right → bottom-right → bottom-left is a clockwise cycle around the four cells.",
      "After bottom-left, the cycle returns to top-left.",
      "Now shading: black, white, black, white alternates every frame, so Frame 5 is black.",
      "Frame 5 = black dot in the top-left.",
      "The white-top-left distractor gets the position right and the shading wrong. On a four-cell cycle the position repeats every 4 frames while shading repeats every 2, so both realign only on odd-numbered frames — check them independently."
    ]
  },

  // ------------------------------------------------------- Situational judgement
  {
    id: "sjt-01",
    testType: "situational-judgement",
    topic: "Accuracy under pressure",
    difficulty: "foundation",
    stimulus: `You are a graduate analyst in a client meeting alongside your manager. The client asks you directly for a figure from an analysis you completed last week. You believe you remember it, but you are not certain, and the figure will inform a decision the client makes today.`,
    stem: "Which response is MOST effective?",
    options: [
      "Give your best recollection so the client is not kept waiting, and note that it is approximate.",
      "Say you want to confirm the exact figure, commit to sending it within the hour, and then do so.",
      "Say nothing and let your manager answer on your behalf.",
      "Tell the client the figure is not currently available."
    ],
    answerIndex: 1,
    targetSeconds: 75,
    workedSolution: [
      "The scenario flags two things deliberately: you are not certain, and the figure drives a decision today.",
      "Option B addresses the question directly, protects accuracy, and gives the client a concrete commitment inside their decision window. It owns the task rather than deflecting it.",
      "Option A prioritises appearing responsive over being right, on a figure that will drive a client decision — the highest-risk choice on the list.",
      "Option C is passive and abandons a question addressed to you; option D is technically true but unhelpfully closed, since the figure is available, just unconfirmed.",
      "The general principle: where accuracy and speed conflict, the highest-scoring response almost always secures accuracy while giving a firm, short timeline."
    ]
  },
  {
    id: "sjt-02",
    testType: "situational-judgement",
    topic: "Error disclosure",
    difficulty: "standard",
    stimulus: `You discover an error in a report that was sent to a client two days ago. The error changes one figure in a summary table but does not change the report's overall recommendation.`,
    stem: "Which response is MOST effective?",
    options: [
      "Correct it in the next version of the report and say nothing, since the recommendation is unchanged.",
      "Tell your manager immediately, setting out the error, its impact, and a proposed correction.",
      "Email the client directly with a corrected table before telling anyone internally.",
      "Wait to see whether the client raises it."
    ],
    answerIndex: 1,
    targetSeconds: 75,
    workedSolution: [
      "Option B is most effective: it discloses promptly, quantifies the impact so others can judge severity, and arrives with a solution rather than only a problem.",
      "Option A conceals an error in material already in the client's hands. Responses that quietly fix something without disclosure score poorly even when the fix works.",
      "Option C has the right instinct — the client should know — but bypasses your manager on external communication about a mistake, which is not a graduate-level call to make alone.",
      "Option D is inaction on a known error and would rank as least effective.",
      "The pattern to internalise: disclose early, size the impact, propose the fix, and respect who owns client communication."
    ]
  },
  {
    id: "sjt-03",
    testType: "situational-judgement",
    topic: "Peer performance",
    difficulty: "standard",
    stimulus: `A colleague on your team has missed three internal deadlines in the past month. Their delays are now pushing your own work later, and you have had to work additional hours twice to stay on schedule.`,
    stem: "Which response is LEAST effective?",
    options: [
      "Raise it with the colleague directly and ask what is blocking them.",
      "Escalate to your manager without speaking to the colleague first.",
      "Absorb the extra work yourself and mention it to nobody.",
      "Wait several more weeks to see whether the pattern resolves on its own."
    ],
    answerIndex: 3,
    targetSeconds: 80,
    workedSolution: [
      "The question asks for the LEAST effective response — read the direction of the question before scanning the options.",
      "Option D is pure inaction on a problem that is already recurring and already causing measurable harm. Nothing about waiting addresses either cause or effect.",
      "Option C is also poor — it hides a systemic issue and is unsustainable — but it does at least protect the immediate deliverable, so it ranks above D.",
      "Option B is imperfect, since going direct first is normally expected, but escalation is a legitimate step once a pattern is established.",
      "Option A is the most effective response here. In situational judgement tests, 'do nothing and see' is almost always the lowest-scoring option available."
    ]
  },
  {
    id: "sjt-04",
    testType: "situational-judgement",
    topic: "Remote and cross-timezone working",
    difficulty: "standard",
    stimulus: `You work remotely, six hours ahead of your main client. They have begun requesting recurring calls at a time that falls well outside your normal working hours. There is a three-hour window each day in which both parties are working.`,
    stem: "Which response is MOST effective?",
    options: [
      "Accept every requested call to demonstrate commitment to the client.",
      "Decline the calls and ask the client to communicate by email only.",
      "Propose a recurring slot inside the shared three-hour window, and offer written updates for anything falling outside it.",
      "Accept the calls but join late so the impact on your evening is smaller."
    ],
    answerIndex: 2,
    targetSeconds: 75,
    workedSolution: [
      "Option C is most effective: it names the constraint, proposes a workable alternative that exists in the scenario, and covers the residual need with written updates so nothing is lost.",
      "Option A is unsustainable and quietly stores up a problem — accepting an arrangement you cannot maintain is not commitment.",
      "Option B removes a channel the client has asked for without offering an alternative, which reads as inflexible.",
      "Option D is the weakest: it degrades the service while still costing you the evening, and does so without telling anyone.",
      "The generalisable rule for cross-timezone scenarios: protect the boundary, but always pair the constraint with a concrete alternative."
    ]
  },
  {
    id: "sjt-05",
    testType: "situational-judgement",
    topic: "Integrity and disclosure",
    difficulty: "advanced",
    stimulus: `You are preparing a client deck. A senior colleague asks you to include a performance metric that is technically accurate but, on the basis it is calculated, will give the client a materially more favourable impression than the underlying data supports.`,
    stem: "Which response is MOST effective?",
    options: [
      "Include the metric as requested — it is accurate, and the colleague is senior to you.",
      "Include the metric with a clear footnote stating the basis of calculation, and raise your concern with the colleague before the deck goes out.",
      "Remove the metric from the deck without telling anyone.",
      "Include the metric and raise your concern after the client meeting has taken place."
    ],
    answerIndex: 1,
    targetSeconds: 90,
    workedSolution: [
      "Option B is most effective: transparency about the basis of calculation resolves the substantive problem, and raising it before publication gives the colleague the chance to decide with full information.",
      "Option A defers to seniority on a question of whether a client will be misled, which is the wrong axis to defer on.",
      "Option C unilaterally overrides a senior colleague's instruction and conceals that you did so — the concealment is what makes it worse than simply disagreeing.",
      "Option D allows the potential harm to occur first, which makes the later conversation largely academic.",
      "The pattern: where an integrity concern is real but not clear-cut, the highest-scoring response adds transparency and raises the concern through the proper route before the point of no return."
    ]
  },

  // ------------------------------------------------------------ Diagrammatic
  {
    id: "diag-01",
    testType: "diagrammatic-reasoning",
    topic: "Sequential operators",
    difficulty: "foundation",
    stimulus: OPERATORS,
    stem: "Input [A, B, C, D] passes through ALPHA then GAMMA. What is the output?",
    options: ["[B, C, A, D]", "[D, B, C, A]", "[B, C, D, A]", "[A, C, B, D]"],
    answerIndex: 0,
    targetSeconds: 60,
    workedSolution: [
      "Write the intermediate state after every operator rather than holding it mentally.",
      "ALPHA swaps first and last: [A, B, C, D] becomes [D, B, C, A].",
      "GAMMA moves the first item to the end: [D, B, C, A] becomes [B, C, A, D].",
      "Output: [B, C, A, D].",
      "The [D, B, C, A] distractor is the state after ALPHA only — a mark lost purely by stopping one operator early."
    ]
  },
  {
    id: "diag-02",
    testType: "diagrammatic-reasoning",
    topic: "Conditional operators",
    difficulty: "standard",
    stimulus: OPERATORS,
    stem: "Input [P, Q, R] passes through BETA then DELTA. What is the output?",
    options: ["[R, P]", "[P, R]", "[R, Q]", "[R, Q, P]"],
    answerIndex: 0,
    targetSeconds: 65,
    workedSolution: [
      "BETA reverses the sequence: [P, Q, R] becomes [R, Q, P].",
      "DELTA removes the middle item, but only acts on odd-length sequences. [R, Q, P] has length 3, which is odd, so DELTA fires.",
      "The middle item of [R, Q, P] is Q. Removing it leaves [R, P].",
      "Output: [R, P].",
      "The [P, R] distractor applies DELTA before BETA. Conditional operators are placed in these tests precisely to punish reordering, so apply strictly left to right."
    ]
  },
  {
    id: "diag-03",
    testType: "diagrammatic-reasoning",
    topic: "Identifying a missing operator",
    difficulty: "standard",
    stimulus: OPERATORS,
    stem: "Input [1, 2, 3, 4] passes through a single unknown operator and produces [4, 2, 3, 1]. Which operator was it?",
    options: ["ALPHA", "BETA", "GAMMA", "DELTA"],
    answerIndex: 0,
    targetSeconds: 55,
    workedSolution: [
      "Compare input and output position by position: 1 and 4 have traded places, while 2 and 3 have not moved.",
      "That is exactly ALPHA's definition — swap the first and last items.",
      "Test the alternatives to confirm: BETA would give [4, 3, 2, 1], which moves 2 and 3 as well.",
      "GAMMA would give [2, 3, 4, 1], and DELTA does not act on an even-length sequence at all.",
      "Answer: ALPHA. On any four-item sequence, BETA and ALPHA differ only in whether the middle two items move — that is the check to make."
    ]
  },
  {
    id: "diag-04",
    testType: "diagrammatic-reasoning",
    topic: "Three-stage chains",
    difficulty: "advanced",
    stimulus: OPERATORS,
    stem: "Input [W, X, Y, Z] passes through GAMMA, then BETA, then ALPHA. What is the output?",
    options: ["[X, Z, Y, W]", "[W, Z, Y, X]", "[Z, Y, X, W]", "[X, Y, Z, W]"],
    answerIndex: 0,
    targetSeconds: 85,
    workedSolution: [
      "GAMMA moves the first item to the end: [W, X, Y, Z] becomes [X, Y, Z, W].",
      "BETA reverses that: [X, Y, Z, W] becomes [W, Z, Y, X].",
      "ALPHA swaps the first and last of that: [W, Z, Y, X] becomes [X, Z, Y, W].",
      "Output: [X, Z, Y, W].",
      "Every distractor is a genuine intermediate state from this chain — [X, Y, Z, W] after GAMMA and [W, Z, Y, X] after BETA. On three-stage chains the discipline of writing each state down is worth more than speed."
    ]
  }
];

export const questionsForTestType = (slug: string) =>
  questions.filter((question) => question.testType === slug);

export const testTypesWithQuestions = () =>
  Array.from(new Set(questions.map((question) => question.testType)));
