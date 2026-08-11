import { ArrowRight, Check, Mail } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs, FactPanel, PageHeader, SectionHeading, formatDate } from "../components/ui";
import { authorBySlug, authors } from "../content/authors";
import { guidesByAuthor } from "../content/guides";
import { site, stats } from "../content/site";
import { breadcrumbJsonLd, useSeo } from "../lib/seo";
import { NotFound } from "./NotFound";

export function About() {
  useSeo({
    title: "About",
    description: `Who writes ${site.name}, how the practice questions are built, and the standards the content is held to.`,
    path: "/about",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" }
    ])
  });

  return (
    <div className="page">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" }
        ]}
      />
      <PageHeader
        eyebrow="About"
        title={`What ${site.name} is`}
        lede="Two halves, in this order. First we show people the opportunities that exist — fully funded scholarships, fellowships and employers hiring globally. Then we sell the material that gets them ready to win one."
      />

      <section>
        <h2>Why that order</h2>
        <p>
          Someone who has never heard of Chevening has no reason to buy an assessment pack. Awareness
          comes first, and it is the part that is genuinely hard to come by if you are applying from
          outside the hiring or admitting country. So the opportunity pages are free, detailed, and
          honest about eligibility — including when a programme is closed to you.
        </p>
        <p>
          Being ready is the part people actually lose on. Not eligibility, but an essay started too
          late, a test sat with no room to retake, a work-sample task rushed. That is what the
          preparation material is for.
        </p>
      </section>

      <section>
        <h2>What we publish</h2>
        <p>
          {stats.opportunityCount} named opportunities across {stats.destinationCount} destinations,
          each covering who it is genuinely open to, what it covers, how selection works and what to
          prepare. A bank of {stats.questionCount} original practice questions across{" "}
          {stats.testTypeCount} assessment formats, timed, scored and carrying a full worked solution.
          And {stats.guideCount} in-depth guides covering the pathway around the application.
        </p>
        <p>
          Practice questions are written to the format and timing published by the major assessment
          vendors — {stats.publisherCount} of them are referenced across the test-type guides. They are
          original questions written to those specifications, not reproductions of any live test paper.
        </p>
      </section>

      <FactPanel
        heading="What we will not do"
        items={[
          "Publish a deadline or award amount that could go stale — we link the official page instead.",
          "Imply a programme is open to you when its eligibility rules say otherwise.",
          "Publish or reproduce questions from live commercial test papers.",
          "State a statistic we cannot attribute to a named source or derive from our own content.",
          "Present an indicative score band as though it were a norm-referenced percentile.",
          "Put a practice test or a worked solution behind a payment or an email address.",
          "Give legal, immigration or financial advice — we point to the authority that can."
        ]}
      />

      <section className="band">
        <SectionHeading
          eyebrow="Authorship"
          title="Who writes this"
          lede="Every guide is attributed to a named desk with a stated remit. Bylines link to a full profile listing what that desk covers and the basis for its guidance."
        />
        <div className="card-grid card-grid-3">
          {authors.map((author) => (
            <article key={author.slug} className="author-card">
              <span className="avatar" aria-hidden="true">
                {author.initials}
              </span>
              <h3>
                <Link to={`/about/${author.slug}`}>{author.name}</Link>
              </h3>
              <p className="author-role">{author.role}</p>
              <p>{author.bio}</p>
              <Link className="link-arrow" to={`/about/${author.slug}`}>
                View profile <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-panel">
        <h2>How this is funded</h2>
        <p>
          Through paid preparation packs and, in future, cohort training and institutional licensing.
          The free tier is not a trial and is not time-limited: the practice tests, the worked solutions
          and the guides stay free. If that ever changes, it will be stated here first.
        </p>
        <Link className="button button-secondary" to="/pricing">
          See pricing <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}

export function AuthorProfile() {
  const { slug } = useParams<{ slug: string }>();
  const author = slug ? authorBySlug(slug) : undefined;
  const written = slug ? guidesByAuthor(slug) : [];

  useSeo({
    title: author?.name ?? "Author",
    description: author?.bio ?? site.description,
    path: `/about/${slug ?? ""}`,
    jsonLd: author
      ? {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Organization",
            name: author.name,
            description: author.bio,
            knowsAbout: author.focus
          }
        }
      : undefined
  });

  if (!author) return <NotFound />;

  return (
    <div className="page">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: author.name, path: `/about/${author.slug}` }
        ]}
      />

      <div className="profile-header">
        <span className="avatar avatar-large" aria-hidden="true">
          {author.initials}
        </span>
        <div>
          <PageHeader eyebrow="Author profile" title={author.name} lede={author.role} />
        </div>
      </div>

      <section>
        <h2>Remit</h2>
        <p>{author.bio}</p>
      </section>

      <FactPanel heading="Basis for this desk's guidance" items={author.credentials} />

      <section>
        <h2>Areas covered</h2>
        <ul className="check-list">
          {author.focus.map((area) => (
            <li key={area}>
              <Check size={16} aria-hidden="true" /> {area}
            </li>
          ))}
        </ul>
      </section>

      {written.length > 0 && (
        <section>
          <h2>
            Guides by {author.name} ({written.length})
          </h2>
          <ul className="plain-link-list">
            {written.map((guide) => (
              <li key={guide.slug}>
                <Link to={`/guides/${guide.slug}`}>{guide.title}</Link>
                <span>
                  {guide.summary} Last reviewed {formatDate(guide.reviewedAt)}.
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export function EditorialPolicy() {
  useSeo({
    title: "Editorial policy",
    description: `How ${site.name} writes, sources and reviews its practice questions and guides, and how to report an error.`,
    path: "/editorial-policy",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Editorial policy", path: "/editorial-policy" }
    ])
  });

  return (
    <div className="page page-narrow">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Editorial policy", path: "/editorial-policy" }
        ]}
      />
      <article className="article">
        <PageHeader
          eyebrow="Standards"
          title="Editorial policy"
          lede="Career and education advice affects decisions that are expensive to get wrong. These are the standards this site holds itself to, published so they can be checked."
        />

        <section>
          <h2>Who writes the content</h2>
          <p>
            Every guide is attributed to a named editorial desk with a stated remit, linked from the
            byline to a full profile. Nothing on this site is published anonymously. The profile states
            what that desk covers and the basis on which its guidance is given.
          </p>
        </section>

        <section>
          <h2>How practice questions are built</h2>
          <p>
            Questions are written to the published format, structure and timing of the commercial
            assessments candidates actually sit. Every question is mapped to a named test type, a topic
            and a difficulty level, and carries a step-by-step worked solution that explains not only the
            correct answer but why each distractor was constructed to be tempting.
          </p>
          <p>
            We do not reproduce questions from live commercial test papers. Every item is original
            material written to a public specification.
          </p>
        </section>

        <section>
          <h2>Review cycle</h2>
          <p>
            Every guide displays its publication date and its last-reviewed date. Guides are re-checked
            at least every six months, which is the standard applied to content that affects significant
            life decisions. Test format details are re-checked whenever a vendor publishes a change to a
            format, ahead of the scheduled cycle.
          </p>
        </section>

        <section>
          <h2>Sourcing</h2>
          <p>
            Factual claims are attributed. Where a guide cites a statistic, a test format or an official
            requirement, the source is linked at the foot of the guide. Country, visa and immigration
            material is sourced only from government or institutional pages, and is presented as a
            pointer to the authority rather than as advice in itself.
          </p>
        </section>

        <section>
          <h2>Scores and score bands</h2>
          <p>
            The band shown on a practice test report is indicative. It is derived from the difficulty
            weighting of the question set, not from a live candidate pool, and it is labelled as
            indicative wherever it appears. We do not present it as a norm-referenced percentile,
            because it is not one.
          </p>
        </section>

        <section>
          <h2>Commercial relationships</h2>
          <p>
            The site is funded by paid preparation packs. Publishers, employers and test vendors are
            named throughout to describe where formats are used — those references are descriptive, are
            not paid placements, and imply no affiliation or endorsement in either direction.
          </p>
        </section>

        <section>
          <h2>Corrections</h2>
          <p>
            If something here is wrong, tell us and it gets fixed. Material corrections to a guide are
            reflected in its last-reviewed date. Report an error at{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> with the page and the
            specific claim.
          </p>
        </section>

        <section>
          <h2>What this site is not</h2>
          <p>
            It is a preparation resource. It is not legal advice, immigration advice or financial
            advice, and it cannot confirm what any particular institution or authority will require of
            you. Always verify requirements with the organisation concerned before acting on them.
          </p>
        </section>
      </article>
    </div>
  );
}

export function Contact() {
  useSeo({
    title: "Contact",
    description: `Get in touch with ${site.name} about cohort training, institutional licensing, corrections or partnerships.`,
    path: "/contact",
    jsonLd: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" }
    ])
  });

  return (
    <div className="page page-narrow">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" }
        ]}
      />
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        lede="Waitlist requests, cohort training, institutional licensing, corrections and partnerships."
      />

      <div className="contact-layout">
        <form
          className="contact-form"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="field">
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" required autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="contact-topic">What is this about?</label>
            <select id="contact-topic" name="topic" defaultValue="waitlist">
              <option value="waitlist">Joining the resource waitlist</option>
              <option value="training">Cohort training</option>
              <option value="institution">Institutional licensing</option>
              <option value="correction">Reporting an error</option>
              <option value="other">Something else</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" rows={5} required />
          </div>
          <button type="submit" className="button button-primary">
            Send message
          </button>
          <p className="footnote">
            The form is not connected to a backend yet. Until it is, email is the reliable route.
          </p>
        </form>

        <aside className="contact-aside">
          <h2>
            <Mail size={20} aria-hidden="true" /> Email
          </h2>
          <p>
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          </p>
          <h2>Reporting an error</h2>
          <p>
            Include the page URL and the specific claim you believe is wrong. Corrections are made
            promptly and reflected in the guide's last-reviewed date, as set out in our{" "}
            <Link to="/editorial-policy">editorial policy</Link>.
          </p>
          <h2>Institutions</h2>
          <p>
            For universities, career services and employability teams, include your cohort size and the
            timeline you are working to.
          </p>
        </aside>
      </div>
    </div>
  );
}
