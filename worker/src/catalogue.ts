/**
 * Server-side price catalogue — the ONLY authority on what anything costs.
 *
 * This deliberately duplicates the prices in src/content/commerce.ts rather
 * than importing them. The client bundle is attacker-controlled: a browser can
 * post any amount it likes. Pricing here means a tampered request is priced
 * from this file and the tampering has no effect.
 *
 * Amounts are in KOBO (NGN minor units). Paystack expects minor units, and
 * integers avoid the rounding bugs floats would introduce.
 */

export interface CatalogueFile {
  label: string;
  /** Object key inside the R2 bucket. Never exposed to the client directly. */
  path: string;
}

export interface CatalogueEntry {
  title: string;
  NGN: number;
  files: CatalogueFile[];
}

export const CATALOGUE: Record<string, CatalogueEntry> = {
  "remote-job-assessment-pack": {
    title: "Remote Job Assessment Pack",
    NGN: 4_500_000, // ₦45,000
    files: [
      { label: "Remote Job Assessment Pack (PDF)", path: "packs/remote-job-assessment-pack.pdf" },
      { label: "Application tracker (XLSX)", path: "packs/application-tracker.xlsx" }
    ]
  },
  "study-abroad-readiness-kit": {
    title: "Study Abroad Readiness Kit",
    NGN: 6_000_000, // ₦60,000
    files: [
      { label: "Study Abroad Readiness Kit (PDF)", path: "packs/study-abroad-readiness-kit.pdf" },
      { label: "Twelve-month timeline tracker (XLSX)", path: "packs/timeline-tracker.xlsx" }
    ]
  },
  "global-career-training-bundle": {
    title: "Global Career Training Bundle",
    NGN: 12_000_000, // ₦120,000
    files: [
      {
        label: "Global Career Training Bundle (PDF)",
        path: "packs/global-career-training-bundle.pdf"
      },
      { label: "All trackers and templates (ZIP)", path: "packs/all-trackers.zip" }
    ]
  }
};

export const SUPPORTED_CURRENCIES = ["NGN"] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export interface PricedLine {
  title: string;
  amount: number;
  currency: Currency;
  files: CatalogueFile[];
}

/**
 * Resolves a product and currency to a priced line.
 * Throws on anything unknown rather than defaulting, so a bad slug can never
 * be silently priced at zero.
 */
export function priceFor(productSlug: unknown, currency: unknown): PricedLine {
  if (typeof productSlug !== "string" || !(productSlug in CATALOGUE)) {
    throw new Error(`Unknown product: ${String(productSlug)}`);
  }
  if (currency !== "NGN") {
    throw new Error(`Unsupported currency: ${String(currency)}`);
  }

  const entry = CATALOGUE[productSlug];
  if (!Number.isInteger(entry.NGN) || entry.NGN <= 0) {
    throw new Error(`No NGN price configured for ${productSlug}`);
  }

  return { title: entry.title, amount: entry.NGN, currency: "NGN", files: entry.files };
}
