# Scholar Zone — brand guidelines

## The name

**Scholar Zone.** Written as one brand, two weights: `Scholar` in the display
serif, `ZONE` in tracked uppercase sans. Never "ScholarZone", never "Scholar
zone", never all-caps "SCHOLAR ZONE" in body copy.

## Positioning

Scholar Zone shows people the opportunities that exist and sells the material
that gets them ready to win one.

Two halves, in this order:

1. **Opportunity discovery** — scholarships, fellowships, remote roles and
   funded pathways that a candidate may not know exist.
2. **Preparation material** — the packs, drills and guides that convert
   awareness into an application that actually places.

The order matters. Someone who does not know Chevening exists has no reason to
buy an assessment pack. Opportunity leads, preparation converts.

### Deliberate separation from the assessment platform

Scholar Zone must not read as the same product as the GAA assessment platform
in the parent workspace. That platform is teal `#00a7a7`, navy `#172033`, amber
`#f7c948`, Inter throughout, 8px radii — an institutional, cool, exam-room
feel. Scholar Zone is warm, editorial and aspirational, and shares none of
those values. If a change would move Scholar Zone toward cool teal-on-grey,
reject it.

## Logo

The mark is a geometric **Z** whose rising diagonal reads as ascent, set in a
squircle carrying the brand gradient. Source: `src/components/Logo.tsx`,
`public/favicon.svg`.

- **Minimum size** — 28px for the mark. Below that the Z counters fill in.
- **Clear space** — at least half the mark's height on every side.
- **Squircle radius** — 30% of the mark's width (`rx=12` at 40px). Do not
  square it off; the softness is doing brand work against the exam platform's
  hard 8px corners.
- **On dark surfaces** — keep the gradient squircle, invert the wordmark only.
- **Do not** re-colour the mark flat, add a stroke, stretch it, or set the
  wordmark in a single weight.

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| `--violet-700` | `#7C3AED` | Primary. Links, active states, gradient start |
| `--violet-800` | `#6D28D9` | Primary hover |
| `--violet-900` | `#5B21B6` | Headings on light, deep accents |
| `--plum-950` | `#241B47` | Body ink — warm dark, never blue-black |
| `--coral-500` | `#FF6B4A` | Accent. CTAs, gradient end, highlights |
| `--coral-600` | `#F2542D` | Accent hover |
| `--gold-400` | `#F5B841` | Sparing — award and funded markers only |
| `--cream-50` | `#FBF8F4` | Page background — warm, never cool grey |
| `--cream-100` | `#F4EEE7` | Sunken surfaces, subtle fills |
| `--surface` | `#FFFFFF` | Cards |
| `--line` | `#E8DFD5` | Borders — warm, tinted to the cream |

The signature gradient is `violet-700 → #9333EA → coral-500` on a 135° axis.
Use it on the mark, the hero, and result surfaces. Do not use it behind body
text.

**Accessibility.** Violet-800 on cream and plum-950 on cream both clear WCAG AA
for body text. Coral is an accent, not a text colour — never set body copy in
coral on cream, it does not pass.

## Typography

- **Display — Fraunces.** Headings, the `Scholar` wordmark, pull quotes.
  A soft, high-contrast serif; the opposite of the exam platform's Inter.
  Use optical sizing, weights 500–700.
- **Body — Plus Jakarta Sans.** Body copy, UI, labels, the `ZONE` wordmark.
  Weights 400–800.
- **Mono — system monospace.** Data tables and question stimuli only.

Headings set tight (`line-height: 1.05–1.15`) with `letter-spacing: -0.02em`.
Body sets at 1.7 for long-form reading.

## Shape and depth

- Radii: `14px` small, `20px` default, `28px` large. Pills at `999px`.
- Shadows are warm-tinted (`rgba(36, 27, 71, …)`), never neutral black.
- Borders are `--line`, warm. A cool grey border will read as the other product.

## Voice

Direct, specific, and free of hype. The reader is usually applying under time
pressure from outside the hiring or admitting country.

- Name the real thing — "Chevening", "an async video interview", not
  "opportunities abroad" or "modern hiring".
- Give the number or say you do not have it. Never imply precision we lack.
- Never invent a deadline, an award amount or a success rate. Link the official
  page and tell the reader to verify there.
- Respect the reader's constraints. Timezone, cost and visa eligibility are
  real, and pretending otherwise loses trust immediately.

## Files

| Asset | Path |
| --- | --- |
| Logo component | `src/components/Logo.tsx` |
| Favicon | `public/favicon.svg` |
| Social card source | `public/og-card.svg` |
| Design tokens | `:root` in `src/styles.css` |

**Social card caveat:** `og-card.svg` is the layout source. Facebook, LinkedIn
and X do not render SVG social cards — export it to a 1200×630 PNG at
`public/og-card.png` and point `og:image` at that before relying on link
previews.
