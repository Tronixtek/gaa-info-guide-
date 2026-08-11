import { Link } from "react-router-dom";
import { Breadcrumbs, PageHeader } from "../components/ui";
import { site } from "../content/site";
import { useSeo } from "../lib/seo";

const LAST_UPDATED = "11 August 2026";

export function Privacy() {
  useSeo({
    title: "Privacy policy",
    description: `How ${site.name} handles personal data, practice test results and analytics.`,
    path: "/privacy"
  });

  return (
    <div className="page page-narrow">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Privacy policy", path: "/privacy" }
        ]}
      />
      <article className="article">
        <PageHeader
          eyebrow="Legal"
          title="Privacy policy"
          lede={`Last updated ${LAST_UPDATED}. This describes what the site currently does, and is updated when that changes.`}
        />

        <section>
          <h2>Practice test results</h2>
          <p>
            Practice test answers, timings and results are held in your browser for the duration of the
            session so the report can be rendered. They are not transmitted to a server and they are not
            retained after you close the tab. No account is required to take a test, and taking one does
            not create a record associated with you.
          </p>
        </section>

        <section>
          <h2>Information you give us</h2>
          <p>
            If you contact us or join a waitlist, we hold the name, email address and message you
            submit, and use them only to reply and to send what you asked for. We do not sell or rent
            that information, and we do not share it with third parties for their own marketing.
          </p>
          <p>
            You can ask us to delete anything we hold about you at any time by emailing{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
        </section>

        <section>
          <h2>Analytics and cookies</h2>
          <p>
            The site does not currently set advertising cookies and does not run third-party ad
            tracking. If analytics are introduced, this page will be updated before they are enabled and
            the provider will be named here.
          </p>
        </section>

        <section>
          <h2>Third-party links</h2>
          <p>
            Guides link to external sources, including test publishers, employers and government pages.
            Those sites have their own privacy practices, which we do not control and are not
            responsible for.
          </p>
        </section>

        <section>
          <h2>Your rights</h2>
          <p>
            Depending on where you live, you may have rights to access, correct, export or delete
            personal data we hold, and to object to certain processing. Email us to exercise any of
            them; we will respond within 30 days.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about this policy go to{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
        </section>
      </article>
    </div>
  );
}

export function Terms() {
  useSeo({
    title: "Terms of use",
    description: `The terms governing use of ${site.name}, including acceptable use and the limits of the guidance published here.`,
    path: "/terms"
  });

  return (
    <div className="page page-narrow">
      <Breadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Terms of use", path: "/terms" }
        ]}
      />
      <article className="article">
        <PageHeader
          eyebrow="Legal"
          title="Terms of use"
          lede={`Last updated ${LAST_UPDATED}. By using this site you agree to these terms.`}
        />

        <section>
          <h2>What this site provides</h2>
          <p>
            {site.name} publishes preparation material: practice questions, worked solutions and written
            guides. It is educational content. It is not legal advice, immigration advice, financial
            advice or a guarantee of any outcome in a recruitment or admissions process.
          </p>
          <p>
            Requirements set by employers, universities and immigration authorities change, and differ by
            country, route and institution. Always verify what applies to you directly with the
            organisation concerned before acting.
          </p>
        </section>

        <section>
          <h2>Practice test scores</h2>
          <p>
            Scores and bands produced by the practice tests are indicative and are generated from the
            difficulty weighting of our own question sets. They are not norm-referenced against a live
            candidate pool, they do not predict performance on any specific commercial assessment, and
            they carry no standing with any employer or institution.
          </p>
        </section>

        <section>
          <h2>Acceptable use</h2>
          <p>You may use this site for personal preparation. You may not:</p>
          <ul className="body-list">
            <li>Copy, republish or resell the questions, worked solutions or guides.</li>
            <li>Scrape the site or extract the question bank in bulk by automated means.</li>
            <li>Present this material as your own, or as the material of any test publisher.</li>
            <li>Use it in a way that interferes with the site's operation or other people's access.</li>
          </ul>
          <p>
            For classroom, cohort or institutional use, contact us about licensing rather than
            redistributing the material.
          </p>
        </section>

        <section>
          <h2>Intellectual property</h2>
          <p>
            Practice questions and worked solutions on this site are original material written to
            publicly documented test formats. Names of test publishers, employers and assessment
            products belong to their respective owners and are used descriptively to explain where a
            format is used. No affiliation, sponsorship or endorsement is implied in either direction.
          </p>
        </section>

        <section>
          <h2>Availability and changes</h2>
          <p>
            The site is provided as is. We do not warrant uninterrupted availability, and we may change,
            add or remove content and features. Material changes to these terms are reflected in the
            last-updated date above.
          </p>
        </section>

        <section>
          <h2>Limitation of liability</h2>
          <p>
            To the extent permitted by law, we are not liable for losses arising from reliance on this
            content, including outcomes in recruitment, admissions or visa processes. Nothing here
            excludes liability that cannot lawfully be excluded.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about these terms, or about licensing, go to{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. See also our{" "}
            <Link to="/editorial-policy">editorial policy</Link> and{" "}
            <Link to="/privacy">privacy policy</Link>.
          </p>
        </section>
      </article>
    </div>
  );
}
