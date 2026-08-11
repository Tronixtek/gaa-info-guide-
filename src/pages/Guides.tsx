import { ArrowRight, CalendarCheck, Clock, ExternalLink, User } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Breadcrumbs, PageHeader, Tag, formatDate } from "../components/ui";
import { authorBySlug } from "../content/authors";
import { guideBySlug, guides, pillars } from "../content/guides";
import { site } from "../content/site";
import { testTypeBySlug } from "../content/testTypes";
import type { Pillar } from "../content/types";
import { breadcrumbJsonLd, useSeo } from "../lib/seo";
import { NotFound } from "./NotFound";

const isPillar = (value: string | null): value is Pillar =>
  pillars.some((pillar) => pillar.id === value);

export function GuidesIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pillarParam = searchParams.get("pillar");
  const activePillar = isPillar(pillarParam) ? pillarParam : null;

  const visible = activePillar ? guides.filter((guide) => guide.pillar === activePillar) : guides;
  const activeLabel = activePillar
    ? pillars.find((pillar) => pillar.id === activePillar)?.label
    : undefined;

  useSeo({
    title: activeLabel ? `${activeLabel} guides` : "Preparation guides",
    description: activeLabel
      ? `${activeLabel} guides from ${site.name}: practical preparation advice with named authors and visible review dates.`
      : "In-depth preparation guides covering technical assessments, remote job exams, study abroad and work-from-home careers.",
    path: activePillar ? `/guides?pillar=${activePillar}` : "/guides",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" }
    ])
  });

  return (
    <div className="page">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" }
        ]}
      />
      <PageHeader
        eyebrow="Library"
        title="Preparation guides"
        lede="Every guide carries a named author, a publication date and a visible last-reviewed date. Factual claims are attributed to their source."
      />

      <div className="filter-row" role="group" aria-label="Filter guides by category">
        <button
          type="button"
          className={!activePillar ? "chip is-active" : "chip"}
          aria-pressed={!activePillar}
          onClick={() => setSearchParams({})}
        >
          All ({guides.length})
        </button>
        {pillars.map((pillar) => {
          const count = guides.filter((guide) => guide.pillar === pillar.id).length;
          const isActive = activePillar === pillar.id;
          return (
            <button
              key={pillar.id}
              type="button"
              className={isActive ? "chip is-active" : "chip"}
              aria-pressed={isActive}
              onClick={() => setSearchParams(isActive ? {} : { pillar: pillar.id })}
            >
              {pillar.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="card-grid card-grid-2">
        {visible.map((guide) => {
          const author = authorBySlug(guide.authorSlug);
          return (
            <article key={guide.slug} className="guide-card">
              <Tag>{pillars.find((pillar) => pillar.id === guide.pillar)?.label}</Tag>
              <h2>
                <Link to={`/guides/${guide.slug}`}>{guide.title}</Link>
              </h2>
              <p>{guide.summary}</p>
              <p className="byline">
                <User size={15} aria-hidden="true" /> {author?.name}
                <span aria-hidden="true"> · </span>
                <Clock size={15} aria-hidden="true" /> {guide.readMinutes} min
                <span aria-hidden="true"> · </span>
                <CalendarCheck size={15} aria-hidden="true" /> reviewed {formatDate(guide.reviewedAt)}
              </p>
              <Link className="link-arrow" to={`/guides/${guide.slug}`}>
                Read guide <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? guideBySlug(slug) : undefined;
  const author = guide ? authorBySlug(guide.authorSlug) : undefined;

  useSeo({
    title: guide?.title ?? "Guide",
    description: guide?.summary ?? site.description,
    path: `/guides/${slug ?? ""}`,
    type: "article",
    jsonLd: guide
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.summary,
          datePublished: guide.publishedAt,
          dateModified: guide.reviewedAt,
          author: { "@type": "Organization", name: author?.name ?? site.name },
          publisher: { "@type": "Organization", name: site.name },
          mainEntityOfPage: `${site.url}/guides/${guide.slug}`
        }
      : undefined
  });

  if (!guide) return <NotFound />;

  const pillar = pillars.find((entry) => entry.id === guide.pillar);
  const related = guides
    .filter((entry) => entry.pillar === guide.pillar && entry.slug !== guide.slug)
    .slice(0, 3);

  return (
    <div className="page">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: pillar?.label ?? "Guide", path: `/guides?pillar=${guide.pillar}` }
        ]}
      />

      <article className="article">
        <PageHeader eyebrow={pillar?.label} title={guide.title} lede={guide.summary} />

        <div className="article-byline">
          <span className="avatar" aria-hidden="true">
            {author?.initials}
          </span>
          <div>
            <p>
              By{" "}
              <Link to={`/about/${author?.slug}`}>
                <strong>{author?.name}</strong>
              </Link>
              , {author?.role}
            </p>
            <p className="byline-dates">
              Published {formatDate(guide.publishedAt)} · Last reviewed {formatDate(guide.reviewedAt)} ·{" "}
              {guide.readMinutes} min read
            </p>
          </div>
        </div>

        <section className="takeaways">
          <h2>Key takeaways</h2>
          <ul>
            {guide.keyTakeaways.map((takeaway) => (
              <li key={takeaway}>{takeaway}</li>
            ))}
          </ul>
        </section>

        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.list && (
              <ul className="body-list">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {guide.relatedTestTypes && guide.relatedTestTypes.length > 0 && (
          <section className="cta-panel">
            <h2>Practise the formats in this guide</h2>
            <ul className="plain-link-list">
              {guide.relatedTestTypes.map((typeSlug) => {
                const type = testTypeBySlug(typeSlug);
                if (!type) return null;
                return (
                  <li key={typeSlug}>
                    <Link to={`/test-types/${type.slug}`}>{type.name}</Link>
                    <span>{type.summary}</span>
                  </li>
                );
              })}
            </ul>
            <Link className="button button-primary" to="/practice">
              Start a free practice test <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </section>
        )}

        {guide.sources && guide.sources.length > 0 && (
          <section className="sources">
            <h2>Sources</h2>
            <ul>
              {guide.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.label} <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="author-box">
          <span className="avatar" aria-hidden="true">
            {author?.initials}
          </span>
          <div>
            <h2>About {author?.name}</h2>
            <p>{author?.bio}</p>
            <Link className="link-arrow" to={`/about/${author?.slug}`}>
              All guides by {author?.name} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <p className="review-note">
          This guide was last reviewed on {formatDate(guide.reviewedAt)} and is re-checked at least every
          six months. See our <Link to="/editorial-policy">editorial policy</Link> for how content is
          written and reviewed.
        </p>

        {related.length > 0 && (
          <section>
            <h2>More on {pillar?.label.toLowerCase()}</h2>
            <ul className="plain-link-list">
              {related.map((entry) => (
                <li key={entry.slug}>
                  <Link to={`/guides/${entry.slug}`}>{entry.title}</Link>
                  <span>{entry.summary}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}
