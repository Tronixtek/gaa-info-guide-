/**
 * Scholar Zone identity.
 *
 * The mark is a geometric "Z" whose rising diagonal reads as ascent — the
 * brand idea is upward movement toward an opportunity. It sits in a squircle
 * carrying the violet-to-coral brand gradient.
 *
 * The wordmark deliberately mixes the two brand faces: "Scholar" in the
 * display serif, "ZONE" in tracked-out uppercase sans. That contrast is the
 * most recognisable part of the identity — keep it in any reproduction.
 */

interface LogoProps {
  size?: number;
  /** Renders the wordmark in white for use on dark surfaces. */
  inverted?: boolean;
  /** Mark only, no wordmark — used for compact and square placements. */
  markOnly?: boolean;
}

let gradientSeed = 0;

export function LogoMark({ size = 40 }: { size?: number }) {
  // Each instance needs its own gradient id, or multiple marks on one page
  // all resolve to the first definition.
  const id = `sz-grad-${(gradientSeed += 1)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="0.55" stopColor="#9333EA" />
          <stop offset="1" stopColor="#FF6B4A" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill={`url(#${id})`} />
      <path
        d="M13 13.5H27L13 26.5H27"
        stroke="#FFFFFF"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ size = 40, inverted = false, markOnly = false }: LogoProps) {
  if (markOnly) return <LogoMark size={size} />;

  return (
    <span className={inverted ? "logo logo-inverted" : "logo"}>
      <LogoMark size={size} />
      <span className="logo-word">
        <span className="logo-scholar">Scholar</span>
        <span className="logo-zone">ZONE</span>
      </span>
    </span>
  );
}
