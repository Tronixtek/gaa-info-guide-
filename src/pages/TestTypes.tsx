import { ArrowRight, Building2, Factory, Layers } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs, FactPanel, PageHeader, SectionHeading, Tag } from "../components/ui";
import { guides } from "../content/guides";
import { questionsForTestType } from "../content/questions";
import { stats } from "../content/site";
import { facetValues, testTypeBySlug, testTypes } from "../content/testTypes";
import { breadcrumbJsonLd, useSeo } from "../lib/seo";
import { NotFound } from "./NotFound";

export function TestTypesIndex() {
  useSeo({
    title: "Aptitude and assessment test types",
    description: `A guide to ${stats.testTypeCount} assessment formats used in hiring and admissions — what each test measures, how it is scored, the publishers behind it, and the mistakes that cost the most marks.`,
    path: "/test-types",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Test types", path: "/test-types" }
    ])
  });

  return (
    <div className="page">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Test types", path: "/test-types" }
        ]}
      />
      <PageHeader
        eyebrow="Taxonomy"
        title="Assessment test types"
        lede="Employers pick from a small, stable set of assessment formats. Knowing which one you are facing — and how it is scored — is the highest-leverage thing you can establish before you prepare."
      />

      <div className="card-grid card-grid-2">
        {testTypes.map((type) => {
          const count = questionsForTestType(type.slug).length;
          return (
            <article key={type.slug} className="type-card">
              <h2>
                <Link to={`/test-types/${type.slug}`}>{type.name}</Link>
              </h2>
              <p>{type.summary}</p>
              <p className="type-measures">
                <strong>Measures:</strong> {type.measures}
              </p>
              <ul className="topic-tags">
                {type.publishers.slice(0, 3).map((publisher) => (
                  <li key={publisher}>
                    <Tag tone="muted">{publisher}</Tag>
                  </li>
                ))}
              </ul>
              <div className="card-actions">
                <Link className="link-arrow" to={`/test-types/${type.slug}`}>
                  Format guide <ArrowRight size={16} aria-hidden="true" />
                </Link>
                {count > 0 && (
                  <Link className="button button-secondary button-small" to={`/practice/${type.slug}`}>
                    {count} practice questions
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <section className="band">
        <SectionHeading
          eyebrow="Other ways in"
          title="Browse by publisher, industry or employer"
          lede="The same formats show up under different vendor names and in different sectors. These are the axes candidates usually search along."
        />
        <div className="facet-grid">
          <div>
            <h3>
              <Layers size={18} aria-hidden="true" /> Test publishers
            </h3>
            <ul className="topic-tags">
              {facetValues("publishers").map((value) => (
                <li key={value}>
                  <Tag tone="muted">{value}</Tag>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>
              <Factory size={18} aria-hidden="true" /> Industries
            </h3>
            <ul className="topic-tags">
              {facetValues("industries").map((value) => (
                <li key={value}>
                  <Tag tone="muted">{value}</Tag>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>
              <Building2 size={18} aria-hidden="true" /> Employers
            </h3>
            <ul className="topic-tags">
              {facetValues("employers").map((value) => (
                <li key={value}>
                  <Tag tone="muted">{value}</Tag>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="footnote">
          Publisher, industry and employer names are listed to describe where each format is commonly
          used. They are not endorsements, and no affiliation is implied.
        </p>
      </section>
    </div>
  );
}

export function TestTypeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const testType = slug ? testTypeBySlug(slug) : undefined;
  const questions = slug ? questionsForTestType(slug) : [];
  const relatedGuides = guides.filter((guide) => guide.relatedTestTypes?.includes(slug ?? ""));

  useSeo({
    title: testType?.name ?? "Test type",
    description: testType
      ? `${testType.summary} Learn what a ${testType.name.toLowerCase()} measures, how it is scored, typical timing, and the mistakes that cost the most marks.`
      : "Assessment test format guide.",
    path: `/test-types/${slug ?? ""}`,
    type: "article",
    jsonLd: testType
      ? breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Test types", path: "/test-types" },
          { name: testType.name, path: `/test-types/${testType.slug}` }
        ])
      : undefined
  });

  if (!testType) return <NotFound />;

  return (
    <div className="page">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Test types", path: "/test-types" },
          { name: testType.shortName, path: `/test-types/${testType.slug}` }
        ]}
      />

      <article className="article">
        <PageHeader eyebrow="Format guide" title={testType.name} lede={testType.summary}>
          {questions.length > 0 && (
            <Link className="button button-primary" to={`/practice/${testType.slug}`}>
              Take the free practice test ({questions.length} questions){" "}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          )}
        </PageHeader>

        <dl className="spec-table">
          <div>
            <dt>Measures</dt>
            <dd>{testType.measures}</dd>
          </div>
          <div>
            <dt>Typical pace</dt>
            <dd>{testType.pace}</dd>
          </div>
          <div>
            <dt>Common publishers</dt>
            <dd>{testType.publishers.join(", ")}</dd>
          </div>
          <div>
            <dt>Common industries</dt>
            <dd>{testType.industries.join(", ")}</dd>
          </div>
          <div>
            <dt>Frequently used by</dt>
            <dd>{testType.employers.join(", ")}</dd>
          </div>
        </dl>

        <section>
          <h2>What this test is</h2>
          {testType.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <FactPanel heading="How to prepare" items={testType.tips} />
        <FactPanel heading="Where candidates lose marks" items={testType.commonMistakes} />

        {questions.length > 0 && (
          <section className="cta-panel">
            <h2>Practise this format now</h2>
            <p>
              {questions.length} timed questions with a full worked solution on every one, plus a scored
              report with topic breakdown and pacing analysis. Free, no account.
            </p>
            <Link className="button button-primary" to={`/practice/${testType.slug}`}>
              Start the test <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </section>
        )}

        {relatedGuides.length > 0 && (
          <section>
            <h2>Related guides</h2>
            <ul className="plain-link-list">
              {relatedGuides.map((guide) => (
                <li key={guide.slug}>
                  <Link to={`/guides/${guide.slug}`}>{guide.title}</Link>
                  <span>{guide.summary}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}
