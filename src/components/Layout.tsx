import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { footerNav, primaryNav, site } from "../content/site";
import { Logo } from "./Logo";

function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer on navigation, otherwise it stays open over the
  // page the user just moved to.
  useEffect(() => setNavOpen(false), [location.pathname]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" aria-label={`${site.name} home`}>
          <Logo size={38} />
        </Link>

        <nav id="primary-nav" className={navOpen ? "is-open" : ""} aria-label="Primary">
          {primaryNav.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "is-active" : "")}>
              {item.label}
            </NavLink>
          ))}
          <Link className="nav-cta" to="/practice">
            Start free test
          </Link>
        </nav>

        <button
          type="button"
          className="icon-button mobile-only"
          onClick={() => setNavOpen((open) => !open)}
          aria-expanded={navOpen}
          aria-controls="primary-nav"
          aria-label={navOpen ? "Close menu" : "Open menu"}
        >
          {navOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" aria-label={`${site.name} home`}>
            <Logo size={38} inverted />
          </Link>
          <p>{site.description}</p>
        </div>

        {footerNav.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2>{column.heading}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="footer-base">
        <p>
          © {new Date().getFullYear()} {site.name}. Practice questions are original material written to
          published test-vendor formats.
        </p>
        <p>
          Preparation guidance only. Nothing here is legal, immigration or financial advice — always
          confirm requirements with the institution or authority concerned.
        </p>
      </div>
    </footer>
  );
}

/** Resets scroll on route change, which a SPA does not do on its own. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export function Layout() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
