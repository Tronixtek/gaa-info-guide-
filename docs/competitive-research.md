# Competitive Research — Assessment Preparation Platforms

Research date: 2026-08-11. Reviewed to inform the GAA Info Guide build-out.

## 1. Platforms reviewed

| Platform | Positioning | What it does well |
| --- | --- | --- |
| [PracticeAptitudeTests](https://www.practiceaptitudetests.com/psychometric-tests/) | Free + Pro practice library | Four-axis taxonomy (test type / publisher / employer / industry); huge free tier; hard volume numbers per test |
| [AssessmentDay](https://www.assessmentday.com/) | Publisher-accurate practice packs | Worked solutions, personal dashboard with trend graphs, percentile benchmarking, adjustable timers |
| [JobTestPrep](https://www.jobtestprep.com/) | Since 1992, 500k+ candidates | Personalised study plans, progress tracking, video tutorials, immediate feedback |
| [GraduatesFirst](https://www.graduatesfirst.com/) | Graduate-scheme prep | Founded by ex-SHL/IBM-Kenexa chartered psychologists; industry bundles; institutional licensing to 150+ universities |
| [Indeed Career Guide](https://www.indeed.com/career-advice) | 100k+ article career hub | Flat, browsable category taxonomy; editorial team page; article-first SEO |
| [Shiksha Study Abroad](https://www.shiksha.com/studyabroad/) | Study-abroad marketplace | Course/university/scholarship search with filters; country guides; visa + pre-departure content |

## 2. Patterns that are table stakes in this category

**Multi-axis taxonomy.** Every serious competitor lets a visitor arrive from four
different directions: *test type* (numerical reasoning), *publisher* (SHL, Talogy,
Saville, Kenexa, Pearson), *employer* (PwC, Deloitte, Amazon, HSBC) and *industry*
(banking, law, consulting, tech). A single flat blog does not compete for these
queries. GAA had none of these axes.

**A free, timed, real practice test on the front door.** Not a marketing page
about practice — an actual test the visitor can start in one click. This is the
core acquisition mechanic across the whole category. Conversion to paid happens
*after* the score screen.

**Worked solutions, not just answers.** AssessmentDay and JobTestPrep both lead
with "in-depth worked solutions". An answer key alone is treated as a low-quality
product in this market.

**Score feedback with benchmarking.** Percentile against other test-takers,
per-topic breakdown, and time-per-question. Raw score alone is not enough.

**Hard, specific numbers.** "30 tests | 480 questions", "9 million tests taken",
"4.9 / 5 from 530 reviews". Vague claims read as untrustworthy here.

**Freemium with a visible price ladder.** Free tier (a few full tests with
feedback) → single-pack purchase → all-access membership. Institutional/B2B
licensing is the third revenue line for the more mature players.

**Credentialed authorship.** GraduatesFirst leads with "founded by former SHL and
IBM Kenexa Chartered Psychologists" and BPS/Science Council accreditation. This is
the single strongest trust differentiator in the vertical.

## 3. E-E-A-T requirements (career/education is YMYL)

Career and education advice sits in Google's *Your Money or Your Life* category,
which carries the strictest quality bar, and author authority became a direct
ranking input in the March 2026 update. Required surfaces:

- Visible author byline on every article, linked to a full author page listing
  credentials, experience and published work.
- A public editorial policy: who writes, who reviews, what qualifications
  reviewers hold, how often content is refreshed.
- "Last reviewed" date on every article, with YMYL content reviewed at least
  every 6 months.
- Source citations for factual claims.
- Transparent ownership, contact route and legal pages.

Sites lacking verified author credentials, citations and a transparent editorial
process saw the largest ranking drops.

## 4. Gap analysis — GAA Info Guide before this work

| Gap | Severity | Consequence |
| --- | --- | --- |
| Single static page, no routes | Critical | Nothing to index, nothing to link, no taxonomy |
| No practice test | Critical | Missing the category's core acquisition mechanic |
| No test-type / publisher / employer / industry axes | Critical | Invisible for every high-intent search query |
| No author, editorial policy or review dates | High | Fails YMYL E-E-A-T outright |
| No meta description, OG tags, canonical, JSON-LD, sitemap, robots | High | Poor SERP presentation and crawlability |
| No pricing page | High | No path from visitor to revenue |
| No footer, no legal pages | High | Reads as an unfinished template |
| Placeholder counts ("42 guides") with no backing content | Medium | Actively damages trust once clicked |
| Hero image hot-linked from Unsplash CDN | Medium | Third-party LCP dependency |
| Nav toggle without `aria-expanded`, no skip link, no focus-visible | Medium | Accessibility failures |

## 5. Decisions adopted for GAA

1. **Adopt the four-axis taxonomy**, scoped to GAA's audience: test type,
   publisher, employer and industry. Test type ships first as full pages; the
   other three ship as filter facets over the same question bank.
2. **Ship a working timed test runner** with per-question worked solutions,
   score breakdown by topic, percentile banding and time-per-question — free, no
   signup, on the front door.
3. **Keep the four original content pillars** (technical assessments, remote job
   exams, study abroad, work from home) as the *guide* taxonomy, sitting
   alongside the practice taxonomy rather than replacing it.
4. **Build the E-E-A-T surfaces before scaling content**: author pages, editorial
   policy, review dates, citations. Retrofitting these is far more expensive.
5. **Three-tier price ladder** (Free / Pro / All-Access) mirroring the category
   norm, with institutional licensing named as a future line.
6. **State only true numbers.** Counts render from the actual content arrays, so
   they cannot drift from reality.

## 6. Deliberately deferred

- User accounts and cross-device progress (needs Supabase; local persistence for now).
- Payment capture (Stripe/Paystack) — pricing page is presentational until then.
- Publisher-specific and employer-specific landing pages at volume.
- Video solutions and cohort delivery.
