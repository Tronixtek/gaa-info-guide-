import type { GatewayId } from "../lib/payments";

/**
 * Stylised payment-method marks drawn in each provider's brand colour.
 *
 * These are simplified geometric representations for a payment selector, not
 * reproductions of the official logos. Before going live, swap them for the
 * real assets from each provider's brand/press kit — Paystack, Flutterwave,
 * Stripe and PayPal all publish one, and several require specific usage under
 * their brand guidelines.
 */

const BRAND: Record<GatewayId, { bg: string; fg: string }> = {
  paystack: { bg: "#011B33", fg: "#00C3F7" },
  flutterwave: { bg: "#F5A623", fg: "#FFFFFF" },
  stripe: { bg: "#635BFF", fg: "#FFFFFF" },
  paypal: { bg: "#003087", fg: "#009CDE" }
};

export function GatewayLogo({ id, size = 36 }: { id: GatewayId; size?: number }) {
  const { bg, fg } = BRAND[id];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className="gateway-logo"
    >
      <rect width="36" height="36" rx="10" fill={bg} />

      {id === "paystack" && (
        // Four stacked bars — the "stack".
        <g fill={fg}>
          <rect x="9" y="10" width="18" height="3.2" rx="1.6" />
          <rect x="9" y="15" width="18" height="3.2" rx="1.6" />
          <rect x="9" y="20" width="11" height="3.2" rx="1.6" />
          <rect x="22" y="20" width="5" height="3.2" rx="1.6" />
        </g>
      )}

      {id === "flutterwave" && (
        // Ascending wave.
        <path
          d="M9 24C13 24 13 15 18 15C23 15 23 24 27 24"
          stroke={fg}
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {id === "stripe" && (
        // Offset "S" strokes.
        <g fill={fg}>
          <rect x="10" y="11" width="16" height="3.4" rx="1.7" />
          <rect x="10" y="16.3" width="11" height="3.4" rx="1.7" />
          <rect x="15" y="21.6" width="11" height="3.4" rx="1.7" />
        </g>
      )}

      {id === "paypal" && (
        // Overlapping double-P in the two brand blues.
        <g>
          <path
            d="M13 25V12h5.2a3.9 3.9 0 0 1 0 7.8H16"
            stroke={fg}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M19 27V14h4.4a3.5 3.5 0 0 1 0 7H21"
            stroke="#FFFFFF"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.85"
          />
        </g>
      )}
    </svg>
  );
}
