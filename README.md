# GAA Info Guide

A preparation platform for people sitting the assessments that gate jobs, study
places and international opportunities: free timed practice tests with worked
solutions, plus in-depth guides covering remote hiring, study abroad and
work-from-home careers.

## What is in here

| Area | Route | Notes |
| --- | --- | --- |
| Home | `/` | Hero, live content counts, pillars, latest guides, FAQ |
| Practice hub | `/practice` | Every test type that has a question bank |
| Practice runner | `/practice/:slug` | Timed test, scored report, worked solutions |
| Test type taxonomy | `/test-types` | 8 formats, plus publisher / industry / employer facets |
| Test type guide | `/test-types/:slug` | Format, scoring, pace, tips, common mistakes |
| Guides | `/guides` | Filterable by content pillar |
| Guide | `/guides/:slug` | Byline, review date, takeaways, sources |
| Resources | `/resources` | Preparation packs |
| Pricing | `/pricing` | Free / Pro / All-Access ladder and FAQ |
| About & authors | `/about`, `/about/:slug` | Editorial desks and their remits |
| Editorial policy | `/editorial-policy` | Sourcing, review cycle, corrections |
| Contact | `/contact` | Waitlist, licensing, corrections |
| Legal | `/privacy`, `/terms` | |

## Architecture

```
src/
  content/     Typed content layer — the single source of truth
    types.ts       Shared interfaces
    testTypes.ts   Test taxonomy + publisher/industry/employer facets
    questions.ts   Practice question bank with worked solutions
    guides.ts      Long-form guides and the four content pillars
    authors.ts     Editorial desks (E-E-A-T bylines)
    commerce.ts    Products, pricing tiers, FAQs
    site.ts        Site config, navigation, derived stats
  lib/
    seo.ts         Per-route document head + JSON-LD
    scoring.ts     Attempt scoring, banding, pacing diagnosis
  components/  Layout, TestRunner, shared UI primitives
  pages/       Route components
scripts/
  generate-sitemap.mjs   Derives sitemap.xml from the content slugs
docs/
  competitive-research.md  Platform research and the decisions taken from it
  product-plan.md          Audience, pillars and revenue direction
```

Content is data, not markup. Headline figures (`stats` in `src/content/site.ts`)
are getters over the content arrays, so a stated count cannot drift away from
what the site actually contains.

## Local development

```bash
npm install
npm run dev        # http://localhost:5174
npm run typecheck
npm run build      # regenerates sitemap, typechecks, then builds
npm run preview
```

## Deployment

The app uses `BrowserRouter`, so the host must rewrite unknown paths to
`index.html` or every deep link 404s on refresh.

- **Firebase Hosting** — `"rewrites": [{ "source": "**", "destination": "/index.html" }]`
- **Vercel / Netlify** — SPA fallback is on by default
- **Nginx** — `try_files $uri $uri/ /index.html;`

Update `site.url` in `src/content/site.ts` and the `SITE_URL` constant in
`scripts/generate-sitemap.mjs` when the real domain is confirmed — the canonical
tags and sitemap both read from those.

## Editorial standards

Career and education content is treated as YMYL, so the site carries the
surfaces that entails: named bylines linking to author profiles, visible
publication and last-reviewed dates, cited sources, and a published editorial
policy at `/editorial-policy`. See `docs/competitive-research.md` for why.

Practice questions are original material written to publicly documented test
formats. No live commercial test paper is reproduced.

## Not built yet

- Accounts and cross-device progress (results are session-only today)
- Payment capture — `/pricing` and `/resources` are presentational
- Backend for the contact and newsletter forms
- Publisher- and employer-specific landing pages at volume
