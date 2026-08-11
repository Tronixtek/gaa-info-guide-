import { Link } from "react-router-dom";
import { PageHeader } from "../components/ui";
import { useSeo } from "../lib/seo";

export function NotFound() {
  useSeo({
    title: "Page not found",
    description: "The page you were looking for does not exist.",
    path: "/404"
  });

  return (
    <div className="page page-narrow">
      <PageHeader
        eyebrow="404"
        title="That page does not exist"
        lede="The link may be out of date, or the page may have moved. Here is where most people are heading."
      />
      <ul className="plain-link-list">
        <li>
          <Link to="/practice">Free practice tests</Link>
          <span>Timed tests with worked solutions across every format we cover.</span>
        </li>
        <li>
          <Link to="/test-types">Test types</Link>
          <span>What each assessment format measures and how it is scored.</span>
        </li>
        <li>
          <Link to="/guides">Guides</Link>
          <span>Preparation for assessments, remote hiring, study abroad and remote income.</span>
        </li>
        <li>
          <Link to="/">Home</Link>
          <span>Start from the top.</span>
        </li>
      </ul>
    </div>
  );
}
