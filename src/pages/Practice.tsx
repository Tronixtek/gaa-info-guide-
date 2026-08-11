import { ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { TestRunner } from "../components/TestRunner";
import { Breadcrumbs, PageHeader, Tag } from "../components/ui";
import { questionsForTestType } from "../content/questions";
import { site, stats } from "../content/site";
import { testTypeBySlug, testTypes } from "../content/testTypes";
import { breadcrumbJsonLd, useSeo } from "../lib/seo";
import { NotFound } from "./NotFound";

export function PracticeIndex() {
  useSeo({
    title: "Free practice tests",
    description: `Free timed aptitude practice tests across ${stats.testTypeCount} formats, with a full worked solution on every question and a scored report. No account required.`,
    path: "/practice",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Practice tests", path: "/practice" }
    ])
  });

  const withQuestions = testTypes.filter((type) => questionsForTestType(type.slug).length > 0);
  const upcoming = testTypes.filter((type) => questionsForTestType(type.slug).length === 0);

  return (
    <div className="page">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Practice tests", path: "/practice" }
        ]}
      />
      <PageHeader
        eyebrow="Practice"
        title="Free practice tests"
        lede={`${stats.questionCount} questions across ${withQuestions.length} test formats. Every question is timed, scored, and comes with a step-by-step worked solution. Nothing is stored and no account is needed.`}
      />

      <div className="card-grid card-grid-2">
        {withQuestions.map((type) => {
          const questions = questionsForTestType(type.slug);
          const targetSeconds = questions.reduce((sum, question) => sum + question.targetSeconds, 0);
          const topics = Array.from(new Set(questions.map((question) => question.topic)));
          return (
            <article key={type.slug} className="practice-card">
              <h2>{type.name}</h2>
              <p>{type.summary}</p>
              <dl className="mini-meta">
                <div>
                  <dt>Questions</dt>
                  <dd>{questions.length}</dd>
                </div>
                <div>
                  <dt>Suggested time</dt>
                  <dd>{Math.round(targetSeconds / 60)} min</dd>
                </div>
                <div>
                  <dt>Topics</dt>
                  <dd>{topics.length}</dd>
                </div>
              </dl>
              <ul className="topic-tags">
                {topics.map((topic) => (
                  <li key={topic}>
                    <Tag tone="muted">{topic}</Tag>
                  </li>
                ))}
              </ul>
              <div className="card-actions">
                <Link className="button button-primary button-small" to={`/practice/${type.slug}`}>
                  Start test <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link className="link-arrow" to={`/test-types/${type.slug}`}>
                  Format guide
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {upcoming.length > 0 && (
        <section className="band">
          <h2>Formats covered by guide, with practice sets in development</h2>
          <p className="lede">
            These formats do not yet have a question bank. The format guides cover scoring, timing and the
            mistakes that cost the most marks.
          </p>
          <ul className="plain-link-list">
            {upcoming.map((type) => (
              <li key={type.slug}>
                <Link to={`/test-types/${type.slug}`}>{type.name}</Link>
                <span>{type.summary}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export function PracticeTest() {
  const { slug } = useParams<{ slug: string }>();
  const testType = slug ? testTypeBySlug(slug) : undefined;
  const questions = slug ? questionsForTestType(slug) : [];

  useSeo({
    title: testType ? `${testType.name} practice test` : "Practice test",
    description: testType
      ? `Free timed ${testType.name.toLowerCase()} practice test with ${questions.length} questions, worked solutions and a scored report. ${testType.summary}`
      : site.description,
    path: `/practice/${slug ?? ""}`,
    jsonLd: testType
      ? breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Practice tests", path: "/practice" },
          { name: testType.name, path: `/practice/${testType.slug}` }
        ])
      : undefined
  });

  if (!testType) return <NotFound />;

  return (
    <div className="page page-narrow">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Practice tests", path: "/practice" },
          { name: testType.shortName, path: `/practice/${testType.slug}` }
        ]}
      />
      {/* Keyed on the slug so moving between test types remounts the runner.
          Without it React Router reuses the component and the answer array
          stays sized for the previous test. */}
      <TestRunner key={testType.slug} testType={testType} questions={questions} />
    </div>
  );
}
