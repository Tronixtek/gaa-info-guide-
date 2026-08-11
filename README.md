# Scholar Zone

**Find the opportunity. Be ready to win it.**

Scholar Zone does two things, in this order: it shows people the funded
opportunities that exist — scholarships, fellowships, remote-first employers
hiring globally — and then sells the material that gets them ready to win one.

Awareness leads, preparation converts. Someone who has never heard of Chevening
has no reason to buy an assessment pack.

Brand guidelines — palette, type, logo usage and voice — are in
[docs/brand.md](docs/brand.md). Read it before changing any design token.

## What is in here

| Area | Route | Notes |
| --- | --- | --- |
| Home | `/` | Opportunity-led hero, featured opportunities, practice, materials |
| Opportunities | `/opportunities` | Filterable by category |
| Opportunity | `/opportunities/:slug` | Eligibility, coverage, selection, what to prepare |
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
    opportunities.ts  Named funded programmes and remote-first employers
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
  brand.md                 Palette, type, logo usage, voice
  competitive-research.md  Platform research and the decisions taken from it
  product-plan.md          Audience, pillars and revenue direction
```

**Opportunity data policy.** Deadlines, award amounts and eligibility lists
change every cycle, so none are stored in `opportunities.ts`. Every entry links
the official page and every opportunity surface carries a verify notice. A stale
deadline is worse than no deadline.

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
- Product pack files (every `paystackUrl` is empty until they exist)
- Backend for the contact and newsletter forms
- Publisher- and employer-specific landing pages at volume
