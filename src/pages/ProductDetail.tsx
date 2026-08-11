import { Check, FileText, Package } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { BuyPanel } from "../components/BuyPanel";
import { Breadcrumbs, PageHeader, Tag } from "../components/ui";
import { productBySlug, products } from "../content/commerce";
import { site } from "../content/site";
import { breadcrumbJsonLd, useSeo } from "../lib/seo";
import { formatPrice } from "../lib/format";
import { NotFound } from "./NotFound";

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? productBySlug(slug) : undefined;

  useSeo({
    title: product?.title ?? "Preparation pack",
    description: product?.description ?? site.description,
    path: `/resources/${slug ?? ""}`,
    jsonLd: product
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: product.description,
          brand: { "@type": "Brand", name: site.name },
          offers: {
            "@type": "Offer",
            price: product.priceUsd,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `${site.url}/resources/${product.slug}`
          }
        }
      : undefined
  });

  if (!product) return <NotFound />;

  return (
    <div className="page">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Materials", path: "/resources" },
          { name: product.title, path: `/resources/${product.slug}` }
        ]}
      />

      <div className="product-layout">
        <div>
          <PageHeader eyebrow={product.badge} title={product.title} lede={product.description} />

          <p className="product-price-line">
            <strong>{formatPrice(product.priceUsd, "USD")}</strong>
            <span>or {formatPrice(product.priceNgn, "NGN")}</span>
          </p>

          <section className="fact-panel">
            <h2>
              <Package size={18} aria-hidden="true" /> What you receive
            </h2>
            <ul>
              {product.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="footnote">
              <FileText size={14} aria-hidden="true" /> Format: {product.format}
            </p>
          </section>

          <section>
            <h2>What is inside</h2>
            <ul className="check-list">
              {product.includes.map((item) => (
                <li key={item}>
                  <Check size={16} aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Best for</h2>
            <p>{product.bestFor}</p>
          </section>

          <section>
            <h2>Refunds</h2>
            <p>
              If the pack is not what you expected, email us within 14 days of purchase and we will
              refund it. Digital goods, so there is nothing to return — see the{" "}
              <Link to="/terms">terms</Link> for the full position.
            </p>
          </section>

          <section>
            <h2>Other packs</h2>
            <ul className="plain-link-list">
              {products
                .filter((entry) => entry.slug !== product.slug)
                .map((entry) => (
                  <li key={entry.slug}>
                    <Link to={`/resources/${entry.slug}`}>
                      {entry.title} — {formatPrice(entry.priceUsd, "USD")}
                    </Link>
                    <span>{entry.description}</span>
                  </li>
                ))}
            </ul>
          </section>
        </div>

        <aside className="product-buy">
          <Tag tone="accent">{product.badge}</Tag>
          <BuyPanel product={product} />
        </aside>
      </div>
    </div>
  );
}
