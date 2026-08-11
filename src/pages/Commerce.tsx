import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs, FaqList, PageHeader, SectionHeading, Tag } from "../components/ui";
import { faqs, pricingTiers, products } from "../content/commerce";
import { stats } from "../content/site";
import { breadcrumbJsonLd, faqJsonLd, useSeo } from "../lib/seo";

export function Resources() {
  useSeo({
    title: "Preparation packs and resources",
    description:
      "Downloadable preparation packs, trackers and templates for aptitude assessments, remote job applications and study abroad — built from the same material as the free guides.",
    path: "/resources",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Resources", path: "/resources" }
    ])
  });

  return (
    <div className="page">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" }
        ]}
      />
      <PageHeader
        eyebrow="Resource store"
        title="Preparation packs and templates"
        lede="The free practice tests and guides stay free. These packs turn the same material into working documents — trackers, checklists and extended drill sets you can use on a live application."
      />

      <div className="card-grid card-grid-3">
        {products.map((product) => (
          <article key={product.slug} className="product-card">
            <Tag>{product.badge}</Tag>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p className="product-best-for">
              <strong>Best for:</strong> {product.bestFor}
            </p>
            <ul className="check-list">
              {product.includes.map((item) => (
                <li key={item}>
                  <Check size={16} aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
            <div className="product-footer">
              <strong className="price">${product.priceUsd}</strong>
              <Link className="button button-primary button-small" to="/contact">
                Join the waitlist <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <p className="footnote">
        Checkout is not open yet. Packs are in production and the waitlist gets first access with
        launch pricing. The {stats.questionCount} practice questions and {stats.guideCount} guides on
        this site remain free regardless.
      </p>
    </div>
  );
}

export function Pricing() {
  useSeo({
    title: "Pricing",
    description:
      "Every practice test and guide is free. Paid packs add extended drill sets, downloadable trackers and employer-specific practice. No subscription required.",
    path: "/pricing",
    jsonLd: faqJsonLd(faqs)
  });

  return (
    <div className="page">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" }
        ]}
      />
      <PageHeader
        eyebrow="Pricing"
        title="The tests are free. The packs are optional."
        lede="Paid tiers add depth and downloadable tooling. They never gate a practice test or a worked solution that is already on this site."
      />

      <div className="pricing-grid">
        {pricingTiers.map((tier) => (
          <article key={tier.name} className={tier.featured ? "pricing-card is-featured" : "pricing-card"}>
            {tier.featured && <Tag>Most popular</Tag>}
            <h2>{tier.name}</h2>
            <p className="pricing-amount">
              <strong>{tier.price}</strong> <span>{tier.cadence}</span>
            </p>
            <p className="pricing-tagline">{tier.tagline}</p>
            <ul className="check-list">
              {tier.features.map((feature) => (
                <li key={feature}>
                  <Check size={16} aria-hidden="true" /> {feature}
                </li>
              ))}
            </ul>
            <Link
              className={tier.featured ? "button button-primary" : "button button-secondary"}
              to={tier.name === "Free" ? "/practice" : "/resources"}
            >
              {tier.cta}
            </Link>
          </article>
        ))}
      </div>

      <section className="band">
        <SectionHeading eyebrow="Also available" title="Cohort training and institutional licensing" />
        <p className="lede">
          Cohort-based training runs on a waitlist. Licensing for universities, career services and
          employability teams is in development — get in touch with your cohort size and timeline.
        </p>
        <Link className="button button-secondary" to="/contact">
          Talk to us <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <section className="band">
        <SectionHeading eyebrow="Questions" title="Before you buy" />
        <FaqList entries={faqs} />
      </section>
    </div>
  );
}
