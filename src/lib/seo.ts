import { useEffect } from "react";
import { site } from "../content/site";

interface SeoOptions {
  title: string;
  description: string;
  /** Path only, e.g. "/guides/foo". Combined with site.url for the canonical. */
  path: string;
  /** Any schema.org object; injected as a JSON-LD script and cleaned up on unmount. */
  jsonLd?: Record<string, unknown>;
  type?: "website" | "article";
}

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
  return element;
};

const upsertLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
  return element;
};

/**
 * Keeps document head metadata in sync with the active route. A SPA serves one
 * HTML file, so without this every route would share the index.html title and
 * description in search results and link previews.
 */
export function useSeo({ title, description, path, jsonLd, type = "website" }: SeoOptions) {
  const fullTitle = title === site.name ? title : `${title} | ${site.name}`;
  const canonical = `${site.url}${path}`;

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertLink("canonical", canonical);

    upsertMeta('meta[property="og:title"]', { property: "og:title", content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: site.name });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
  }, [fullTitle, description, canonical, type]);

  useEffect(() => {
    if (!jsonLd) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
    // Serialising is the only stable way to compare a structured object across renders.
  }, [JSON.stringify(jsonLd ?? null)]);
}

export const breadcrumbJsonLd = (trail: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: `${site.url}${crumb.path}`
  }))
});

export const faqJsonLd = (entries: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: entries.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: { "@type": "Answer", text: entry.answer }
  }))
});
