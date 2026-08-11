/**
 * Server-side price catalogue — the ONLY authority on what anything costs.
 *
 * This deliberately duplicates the prices in src/content/commerce.ts rather
 * than importing them. The client bundle is attacker-controlled: a browser can
 * post any amount it likes. Pricing here means a tampered request is priced
 * from this file and the tampering has no effect.
 *
 * Amounts are in MINOR units (kobo for NGN, cents for USD) because every
 * gateway here expects minor units, and floats would introduce rounding bugs.
 */

const CATALOGUE = {
  "remote-job-assessment-pack": {
    title: "Remote Job Assessment Pack",
    USD: 2900,
    NGN: 4500000,
    files: [
      { label: "Remote Job Assessment Pack (PDF)", path: "packs/remote-job-assessment-pack.pdf" },
      { label: "Application tracker (XLSX)", path: "packs/application-tracker.xlsx" }
    ]
  },
  "study-abroad-readiness-kit": {
    title: "Study Abroad Readiness Kit",
    USD: 3900,
    NGN: 6000000,
    files: [
      { label: "Study Abroad Readiness Kit (PDF)", path: "packs/study-abroad-readiness-kit.pdf" },
      { label: "Twelve-month timeline tracker (XLSX)", path: "packs/timeline-tracker.xlsx" }
    ]
  },
  "global-career-training-bundle": {
    title: "Global Career Training Bundle",
    USD: 7900,
    NGN: 12000000,
    files: [
      { label: "Global Career Training Bundle (PDF)", path: "packs/global-career-training-bundle.pdf" },
      { label: "All trackers and templates (ZIP)", path: "packs/all-trackers.zip" }
    ]
  }
};

const SUPPORTED_CURRENCIES = ["USD", "NGN"];

/**
 * Resolves a product and currency to a priced line item.
 * Throws on anything not in the catalogue rather than defaulting, so an
 * unknown slug can never be silently priced at zero.
 */
function priceFor(productSlug, currency) {
  const product = CATALOGUE[productSlug];
  if (!product) {
    throw new Error(`Unknown product: ${productSlug}`);
  }
  if (!SUPPORTED_CURRENCIES.includes(currency)) {
    throw new Error(`Unsupported currency: ${currency}`);
  }

  const amount = product[currency];
  if (typeof amount !== "number" || amount <= 0) {
    throw new Error(`No ${currency} price configured for ${productSlug}`);
  }

  return { title: product.title, amount, currency, files: product.files };
}

module.exports = { CATALOGUE, SUPPORTED_CURRENCIES, priceFor };
