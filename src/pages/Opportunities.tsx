import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  GraduationCap,
  Info,
  MapPin,
  Target
} from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Breadcrumbs, FactPanel, PageHeader, SectionHeading, Tag } from "../components/ui";
import { guideBySlug } from "../content/guides";
import {
  VERIFY_NOTICE,
  opportunities,
  opportunityBySlug,
  opportunityCategories,
  opportunityCategoryById
} from "../content/opportunities";
import { site, stats } from "../content/site";
import { testTypeBySlug } from "../content/testTypes";
import type { OpportunityCategory } from "../content/types";
import { breadcrumbJsonLd, useSeo } from "../lib/seo";
import { NotFound } from "./NotFound";

const isCategory = (value: string | null): value is OpportunityCategory =>
  opportunityCategories.some((category) => category.id === value);

function VerifyNotice() {
  return (
    <p className="verify-notice">
      <Info size={18} aria-hidden="true" />
      <span>{VERIFY_NOTICE}</span>
    </p>
  );
}

export function OpportunitiesIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const activeCategory = isCategory(categoryParam) ? categoryParam : null;

  const visible = activeCategory
    ? opportunities.filter((opportunity) => opportunity.category === activeCategory)
    : opportunities;
  const activeLabel = activeCategory ? opportunityCategoryById(activeCategory)?.label : undefined;

  useSeo({
    title: activeLabel ?? "Opportunities",
    description: activeLabel
      ? `${activeLabel} for international candidates — who each one is open to, what it covers, how selection works, and what to prepare.`
      : `${stats.opportunityCount} funded scholarships, fellowships and remote-first employers hiring globally. What each is open to, what it covers, and exactly what to prepare.`,
    path: activeCategory ? `/opportunities?category=${activeCategory}` : "/opportunities",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Opportunities", path: "/opportunities" }
    ])
  });

  return (
    <div className="page">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Opportunities", path: "/opportunities" }
        ]}
      />
      <PageHeader
        eyebrow="Opportunities"
        title="Opportunities worth knowing about"
        lede={`${stats.opportunityCount} funded programmes and globally-hiring employers across ${stats.destinationCount} destinations. For each one: who it is genuinely open to, what it covers, how selection actually works, and what to prepare.`}
      />

      <VerifyNotice />

      <div className="filter-row" role="group" aria-label="Filter opportunities by category">
        <button
          type="button"
          className={!activeCategory ? "chip is-active" : "chip"}
          aria-pressed={!activeCategory}
          onClick={() => setSearchParams({})}
        >
          All ({opportunities.length})
        </button>
        {opportunityCategories.map((category) => {
          const count = opportunities.filter((item) => item.category === category.id).length;
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              className={isActive ? "chip is-active" : "chip"}
              aria-pressed={isActive}
              onClick={() => setSearchParams(isActive ? {} : { category: category.id })}
            >
              {category.label} ({count})
            </button>
          );
        })}
      </div>

      {activeCategory && (
        <p className="lede" style={{ marginTop: "-12px", marginBottom: "24px" }}>
          {opportunityCategoryById(activeCategory)?.blurb}
        </p>
      )}

      <div className="card-grid card-grid-2">
        {visible.map((opportunity) => (
          <article key={opportunity.slug} className="opportunity-card">
            <div className="opportunity-head">
              <h2>
                <Link to={`/opportunities/${opportunity.slug}`}>{opportunity.name}</Link>
              </h2>
              <Tag tone="accent">{opportunityCategoryById(opportunity.category)?.label}</Tag>
            </div>

            <p className="opportunity-where">
              <span>
                <MapPin size={15} aria-hidden="true" /> {opportunity.destination}
              </span>
              <span>
                <GraduationCap size={15} aria-hidden="true" /> {opportunity.level}
              </span>
            </p>

            <p>{opportunity.summary}</p>

            <div className="card-actions">
              <Link className="button button-secondary button-small" to={`/opportunities/${opportunity.slug}`}>
                What to prepare <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                className="link-arrow"
                href={opportunity.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Official site <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>

      <section className="band">
        <SectionHeading
          eyebrow="How to use this"
          title="Awareness is the cheap part. Being ready is not."
          lede="Most people lose these on preparation, not eligibility — an essay started too late, a test sat too late to retake, a work-sample task rushed. Each page below says what to prepare and when."
        />
        <div className="card-grid card-grid-2">
          {opportunityCategories.map((category) => (
            <Link
              key={category.id}
              className="category-card"
              to={`/opportunities?category=${category.id}`}
            >
              <span className="card-icon">
                {category.id === "remote-employer" ? (
                  <Building2 size={22} aria-hidden="true" />
                ) : (
                  <Target size={22} aria-hidden="true" />
                )}
              </span>
              <strong>{category.label}</strong>
              <p>{category.blurb}</p>
              <span className="card-count">
                {opportunities.filter((item) => item.category === category.id).length} listed
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function OpportunityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const opportunity = slug ? opportunityBySlug(slug) : undefined;

  useSeo({
    title: opportunity?.name ?? "Opportunity",
    description: opportunity
      ? `${opportunity.summary} Who it is open to, what it covers, how selection works and what to prepare.`
      : site.description,
    path: `/opportunities/${slug ?? ""}`,
    type: "article",
    jsonLd: opportunity
      ? breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Opportunities", path: "/opportunities" },
          { name: opportunity.name, path: `/opportunities/${opportunity.slug}` }
        ])
      : undefined
  });

  if (!opportunity) return <NotFound />;

  const category = opportunityCategoryById(opportunity.category);

  return (
    <div className="page">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Opportunities", path: "/opportunities" },
          { name: opportunity.name, path: `/opportunities/${opportunity.slug}` }
        ]}
      />

      <article className="article">
        <PageHeader eyebrow={category?.label} title={opportunity.name} lede={opportunity.summary}>
          <a
            className="button button-primary official-link"
            href={opportunity.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Official application page <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </PageHeader>

        <VerifyNotice />

        <dl className="spec-table">
          <div>
            <dt>Funded by</dt>
            <dd>{opportunity.host}</dd>
          </div>
          <div>
            <dt>Destination</dt>
            <dd>{opportunity.destination}</dd>
          </div>
          <div>
            <dt>Level</dt>
            <dd>{opportunity.level}</dd>
          </div>
          <div>
            <dt>Open to</dt>
            <dd>{opportunity.openTo}</dd>
          </div>
        </dl>

        <div className="detail-columns">
          <section className="fact-panel" style={{ marginBottom: 0 }}>
            <h2>What it covers</h2>
            <ul>
              {opportunity.covers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="fact-panel" style={{ marginBottom: 0 }}>
            <h2>How selection works</h2>
            <ul>
              {opportunity.selection.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <FactPanel heading="What to prepare" items={opportunity.whatToPrepare} />

        {(opportunity.relatedTestTypes?.length || opportunity.relatedGuides?.length) && (
          <section className="cta-panel">
            <h2>Get ready for this one</h2>
            <ul className="plain-link-list">
              {opportunity.relatedTestTypes?.map((typeSlug) => {
                const type = testTypeBySlug(typeSlug);
                if (!type) return null;
                return (
                  <li key={typeSlug}>
                    <Link to={`/test-types/${type.slug}`}>{type.name}</Link>
                    <span>{type.summary}</span>
                  </li>
                );
              })}
              {opportunity.relatedGuides?.map((guideSlug) => {
                const guide = guideBySlug(guideSlug);
                if (!guide) return null;
                return (
                  <li key={guideSlug}>
                    <Link to={`/guides/${guide.slug}`}>{guide.title}</Link>
                    <span>{guide.summary}</span>
                  </li>
                );
              })}
            </ul>
            <Link className="button button-primary" to="/practice">
              Start a free practice test <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </section>
        )}

        <section>
          <h2>Before you apply</h2>
          <ul className="check-list">
            <li>
              <Check size={16} aria-hidden="true" /> Confirm your country and level are on the current
              eligibility list — this changes between cycles.
            </li>
            <li>
              <Check size={16} aria-hidden="true" /> Check this cycle's deadline on the official page and
              work backwards from it.
            </li>
            <li>
              <Check size={16} aria-hidden="true" /> Leave room for one full retake of any test the
              application requires.
            </li>
            <li>
              <Check size={16} aria-hidden="true" /> Brief your referees early, with the specific
              criteria this programme selects on.
            </li>
          </ul>
          <p>
            <a
              className="official-link"
              href={opportunity.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to the official page <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </p>
        </section>

        <section>
          <h2>Other opportunities</h2>
          <ul className="plain-link-list">
            {opportunities
              .filter((item) => item.slug !== opportunity.slug)
              .slice(0, 4)
              .map((item) => (
                <li key={item.slug}>
                  <Link to={`/opportunities/${item.slug}`}>{item.name}</Link>
                  <span>{item.summary}</span>
                </li>
              ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
