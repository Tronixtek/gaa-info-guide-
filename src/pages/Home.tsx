import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  GraduationCap,
  Laptop,
  ListChecks,
  Timer,
  Users
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FaqList, SectionHeading, StatRow, Tag, formatDate } from "../components/ui";
import { faqs } from "../content/commerce";
import { guides, pillars } from "../content/guides";
import { questionsForTestType } from "../content/questions";
import { site, stats } from "../content/site";
import { testTypes } from "../content/testTypes";
import type { Pillar } from "../content/types";
import { useSeo } from "../lib/seo";

const pillarIcons: Record<Pillar, ReactNode> = {
  assessments: <FileText size={22} aria-hidden="true" />,
  "remote-jobs": <BriefcaseBusiness size={22} aria-hidden="true" />,
  "study-abroad": <GraduationCap size={22} aria-hidden="true" />,
  "work-from-home": <Laptop size={22} aria-hidden="true" />
};

export function Home() {
  useSeo({
    title: `${site.name} — free aptitude practice tests and career preparation guides`,
    description: site.description,
    path: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: site.name,
      url: site.url,
      description: site.description,
      email: site.contactEmail,
      foundingDate: site.founded
    }
  });

  const latestGuides = [...guides]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  const featuredTestTypes = testTypes.filter((type) => questionsForTestType(type.slug).length > 0);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">
            <BadgeCheck size={16} aria-hidden="true" /> Preparation hub for global opportunities
          </p>
          <h1>Pass the test that stands between you and the offer.</h1>
          <p className="hero-lede">
            Free timed practice tests with a full worked solution on every question, plus preparation
            guides for remote hiring, study abroad and work-from-home careers. No account needed.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/practice">
              Start a free practice test <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-ghost" to="/guides">
              Browse the guides
            </Link>
          </div>
          <StatRow
            items={[
              { value: `${stats.questionCount}`, label: "Practice questions" },
              { value: `${stats.workedSolutionCount}`, label: "Worked solutions" },
              { value: `${stats.testTypeCount}`, label: "Test types covered" },
              { value: `${stats.guideCount}`, label: "In-depth guides" }
            ]}
          />
        </div>

        <aside className="hero-brief" aria-label="What you get">
          <div>
            <Timer size={20} aria-hidden="true" />
            <strong>Real timing</strong>
            <span>
              Per-question targets matched to the pace of the commercial tests employers actually use.
            </span>
          </div>
          <div>
            <ListChecks size={20} aria-hidden="true" />
            <strong>Every step shown</strong>
            <span>
              Not an answer key — the full reasoning, plus why each wrong option was built to tempt you.
            </span>
          </div>
          <div>
            <BadgeCheck size={20} aria-hidden="true" />
            <strong>Scored report</strong>
            <span>
              Topic breakdown, pacing analysis and an indicative band, right after you submit.
            </span>
          </div>
        </aside>
      </section>

      <section className="band" aria-label="Practice tests by test type">
        <SectionHeading
          eyebrow="Start here"
          title="Free practice tests, no signup"
          lede="Pick the format you are facing. Every test is timed, scored and comes with worked solutions."
        />
        <div className="card-grid card-grid-3">
          {featuredTestTypes.map((type) => {
            const count = questionsForTestType(type.slug).length;
            return (
              <article key={type.slug} className="practice-card">
                <h3>{type.name}</h3>
                <p>{type.summary}</p>
                <dl className="mini-meta">
                  <div>
                    <dt>Questions</dt>
                    <dd>{count}</dd>
                  </div>
                  <div>
                    <dt>Pace</dt>
                    <dd>{type.pace.split(",")[0]}</dd>
                  </div>
                </dl>
                <div className="card-actions">
                  <Link className="button button-primary button-small" to={`/practice/${type.slug}`}>
                    Take the test <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <Link className="link-arrow" to={`/test-types/${type.slug}`}>
                    Format guide
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <Link className="link-arrow" to="/test-types">
          See all {stats.testTypeCount} test types, including coding screens and video interviews{" "}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <section className="band" aria-label="Guide categories">
        <SectionHeading
          eyebrow="Four pillars"
          title="Preparation for the whole pathway, not just the test"
          lede="The assessment is one stage. The guides cover the pipeline around it — applications, admissions, timezones and getting paid."
        />
        <div className="card-grid card-grid-4">
          {pillars.map((pillar) => {
            const count = guides.filter((guide) => guide.pillar === pillar.id).length;
            return (
              <Link key={pillar.id} className="category-card" to={`/guides?pillar=${pillar.id}`}>
                <span className="card-icon">{pillarIcons[pillar.id]}</span>
                <strong>{pillar.label}</strong>
                <p>{pillar.blurb}</p>
                <span className="card-count">
                  {count} {count === 1 ? "guide" : "guides"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="band content-layout" aria-label="Latest guides">
        <div>
          <SectionHeading eyebrow="Latest guides" title="Preparation advice you can use this week" />
          <div className="guide-list">
            {latestGuides.map((guide) => (
              <article key={guide.slug}>
                <Tag>{pillars.find((pillar) => pillar.id === guide.pillar)?.label}</Tag>
                <h3>
                  <Link to={`/guides/${guide.slug}`}>{guide.title}</Link>
                </h3>
                <p>{guide.summary}</p>
                <div className="guide-list-footer">
                  <small>
                    {guide.readMinutes} min read · reviewed {formatDate(guide.reviewedAt)}
                  </small>
                  <Link className="link-arrow" to={`/guides/${guide.slug}`}>
                    Read guide <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="coaching-panel">
          <Users size={26} aria-hidden="true" />
          <h2>Training for serious applicants</h2>
          <p>
            Cohort-based training for candidates preparing for remote job assessments, study
            applications and global career transitions.
          </p>
          <ul>
            <li>
              <CheckCircle2 size={17} aria-hidden="true" /> Timed assessment drills with review
            </li>
            <li>
              <CheckCircle2 size={17} aria-hidden="true" /> CV and portfolio positioning
            </li>
            <li>
              <CheckCircle2 size={17} aria-hidden="true" /> Interview and application coaching
            </li>
          </ul>
          <Link className="button button-primary" to="/contact">
            Join the waitlist
          </Link>
        </aside>
      </section>

      <section className="band" aria-label="Frequently asked questions">
        <SectionHeading eyebrow="Questions" title="What people ask before they start" />
        <FaqList entries={faqs.slice(0, 5)} />
      </section>

      <section className="newsletter">
        <BookOpen size={28} aria-hidden="true" />
        <div>
          <p className="eyebrow">Stay prepared</p>
          <h2>Get new practice sets and guides as they publish.</h2>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label className="visually-hidden" htmlFor="home-newsletter-email">
            Email address
          </label>
          <input id="home-newsletter-email" type="email" required placeholder="you@example.com" />
          <button type="submit" className="button button-primary">
            Subscribe
          </button>
        </form>
      </section>
    </>
  );
}
