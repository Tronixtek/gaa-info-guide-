import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  GraduationCap,
  ListChecks,
  MapPin,
  Send,
  ShoppingBag,
  Sparkles,
  Timer
} from "lucide-react";
import { Link } from "react-router-dom";
import { FaqList, SectionHeading, StatRow, Tag, formatDate } from "../components/ui";
import { faqs, products } from "../content/commerce";
import { guides, pillars } from "../content/guides";
import { opportunities, opportunityCategoryById } from "../content/opportunities";
import { questionsForTestType } from "../content/questions";
import { site, stats } from "../content/site";
import { testTypes } from "../content/testTypes";
import { useSeo } from "../lib/seo";

export function Home() {
  useSeo({
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    path: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: site.name,
      url: site.url,
      description: site.description,
      email: site.contactEmail,
      foundingDate: site.founded,
      slogan: site.tagline
    }
  });

  const latestGuides = [...guides]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  const featuredOpportunities = opportunities.slice(0, 4);
  const featuredTestTypes = testTypes.filter((type) => questionsForTestType(type.slug).length > 0);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">
            <Sparkles size={15} aria-hidden="true" /> Opportunities + preparation
          </p>
          <h1>
            Find the opportunity. <em>Be ready to win it.</em>
          </h1>
          <p className="hero-lede">
            Fully funded scholarships, leadership fellowships and remote-first employers hiring
            globally — with the preparation material that turns a shortlist into an offer.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/opportunities">
              Browse opportunities <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-ghost" to="/practice">
              Take a free practice test
            </Link>
          </div>
          <StatRow
            items={[
              { value: `${stats.opportunityCount}`, label: "Opportunities" },
              { value: `${stats.destinationCount}`, label: "Destinations" },
              { value: `${stats.questionCount}`, label: "Practice questions" },
              { value: `${stats.guideCount}`, label: "In-depth guides" }
            ]}
          />
        </div>

        <aside className="hero-brief" aria-label="How Scholar Zone works">
          <div>
            <Compass size={20} aria-hidden="true" />
            <strong>Discover</strong>
            <span>
              Real named programmes — Chevening, Fulbright, DAAD, Erasmus Mundus — with who each one is
              genuinely open to.
            </span>
          </div>
          <div>
            <ListChecks size={20} aria-hidden="true" />
            <strong>Prepare</strong>
            <span>
              Free timed practice tests with a full worked solution on every question, and a scored
              report that tells you what to fix.
            </span>
          </div>
          <div>
            <Send size={20} aria-hidden="true" />
            <strong>Apply</strong>
            <span>
              Timelines, trackers and templates that keep an application on schedule when several are
              running at once.
            </span>
          </div>
        </aside>
      </section>

      <section className="band page" aria-label="Featured opportunities" style={{ paddingBottom: 0 }}>
        <SectionHeading
          eyebrow="Opportunities"
          title="You cannot apply for something you have never heard of"
          lede="Fully funded routes that most candidates never see. Each page covers eligibility, coverage, how selection actually works, and what to prepare."
        />
        <div className="card-grid card-grid-2">
          {featuredOpportunities.map((opportunity) => (
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
                <Link
                  className="button button-secondary button-small"
                  to={`/opportunities/${opportunity.slug}`}
                >
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
        <div style={{ marginTop: "22px" }}>
          <Link className="link-arrow" to="/opportunities">
            See all {stats.opportunityCount} opportunities <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="band page" aria-label="Practice tests" style={{ paddingBottom: 0 }}>
        <SectionHeading
          eyebrow="Prepare free"
          title="Practice the exact test standing in your way"
          lede="Timed, scored, and free — no account. Every question carries a worked solution that also explains why each wrong option was built to tempt you."
        />
        <div className="card-grid card-grid-3">
          {featuredTestTypes.slice(0, 3).map((type) => {
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
                </div>
              </article>
            );
          })}
        </div>
        <div style={{ marginTop: "22px" }}>
          <Link className="link-arrow" to="/practice">
            All {stats.testTypeCount} test formats, including coding screens and video interviews{" "}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="band page" aria-label="Preparation materials" style={{ paddingBottom: 0 }}>
        <SectionHeading
          eyebrow="Materials"
          title="Preparation packs that do the organising for you"
          lede="Trackers, templates and extended drill sets built from the same material as the free guides — for when several applications are running at once."
        />
        <div className="card-grid card-grid-3">
          {products.map((product) => (
            <article key={product.slug} className="product-card">
              <Tag tone="accent">{product.badge}</Tag>
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <p className="product-best-for">
                <strong>Best for:</strong> {product.bestFor}
              </p>
              <div className="product-footer">
                <strong className="price">${product.priceUsd}</strong>
                <Link className="button button-primary button-small" to="/resources">
                  <ShoppingBag size={16} aria-hidden="true" /> View pack
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="band page content-layout" aria-label="Latest guides" style={{ paddingBottom: 0 }}>
        <div>
          <SectionHeading eyebrow="Latest guides" title="Advice you can act on this week" />
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
          <Timer size={26} aria-hidden="true" />
          <h2>Applying to more than one?</h2>
          <p>
            Most people lose these on timing, not merit — an essay started too late, a test sat with no
            room to retake. The packs exist to stop that.
          </p>
          <ul>
            <li>Deadline trackers ordered by what cannot be recovered</li>
            <li>Statement planners with per-programme tailoring</li>
            <li>Scholarship pipeline running parallel to admissions</li>
          </ul>
          <Link className="button button-primary" to="/resources">
            See the packs
          </Link>
        </aside>
      </section>

      <section className="band page" aria-label="Frequently asked questions" style={{ paddingBottom: 0 }}>
        <SectionHeading eyebrow="Questions" title="What people ask before they start" />
        <FaqList entries={faqs.slice(0, 5)} />
      </section>

      <section className="page" style={{ paddingTop: "var(--stack)", paddingBottom: 0 }}>
        <div className="newsletter" style={{ marginBottom: 0 }}>
          <Compass size={28} aria-hidden="true" />
          <div>
            <p className="eyebrow">Never miss one</p>
            <h2>New opportunities and practice sets, as they publish.</h2>
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
        </div>
      </section>
    </>
  );
}
