/**
 * Payment gateway configuration.
 *
 * SECURITY — the rules this module exists to enforce:
 *
 * 1. Only PUBLISHABLE keys ever appear here. Secret keys live on the server.
 *    Anything in `import.meta.env.VITE_*` is compiled into the bundle and is
 *    readable by anyone who opens devtools.
 * 2. The browser never decides what a thing costs. It sends a product slug;
 *    the server looks the price up in its own catalogue. A client that posts
 *    `amount: 1` must not be able to buy a $79 pack.
 * 3. A gateway's client-side success callback is a hint, not proof. Access is
 *    granted only after the server verifies the transaction against the
 *    gateway's API, or receives a signature-checked webhook.
 */

export type GatewayId = "paystack" | "flutterwave" | "stripe" | "paypal";

export type Currency = "USD" | "NGN";

export interface Gateway {
  id: GatewayId;
  name: string;
  blurb: string;
  methods: string[];
  currencies: Currency[];
  /** Whether the publishable key for this gateway is present at build time. */
  configured: boolean;
}

const env = import.meta.env;

export const PAYSTACK_PUBLIC_KEY = (env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined) ?? "";
export const FLUTTERWAVE_PUBLIC_KEY = (env.VITE_FLUTTERWAVE_PUBLIC_KEY as string | undefined) ?? "";
export const STRIPE_PUBLISHABLE_KEY = (env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined) ?? "";
export const PAYPAL_CLIENT_ID = (env.VITE_PAYPAL_CLIENT_ID as string | undefined) ?? "";

/**
 * Checkout API base — the Cloudflare Worker, on its own origin.
 * The site is static on Firebase Hosting, which cannot rewrite to a Worker, so
 * this must be the Worker's absolute URL in any real deployment.
 */
export const API_BASE = (env.VITE_API_BASE_URL as string | undefined) ?? "/api";

/**
 * A publishable key alone is not enough to take a payment — every gateway also
 * needs the checkout API deployed to price the order and verify the result.
 *
 * The API is same-origin ("/api", rewritten by Firebase Hosting to the `api`
 * function), so we cannot detect it by shape. Instead this is an explicit
 * opt-in: VITE_API_BASE_URL must be SET. Unset means the function is not
 * deployed yet, and the gateway stays honestly unavailable rather than failing
 * mid-payment when "/api" falls through to index.html and returns HTML.
 */
export const BACKEND_READY = Boolean(env.VITE_API_BASE_URL);

export const gateways: Gateway[] = [
  {
    id: "paystack",
    name: "Paystack",
    blurb: "Cards, bank transfer, USSD and mobile money across Nigeria, Ghana, Kenya and South Africa.",
    methods: ["Card", "Bank transfer", "USSD", "Mobile money"],
    // NGN only. Paystack USD settlement is not enabled by default and has to
    // be approved per account — add "USD" here once it is live, and add a USD
    // price to the worker catalogue at the same time.
    currencies: ["NGN"],
    configured: Boolean(PAYSTACK_PUBLIC_KEY) && BACKEND_READY
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    blurb: "Wide African coverage plus international cards, with mobile money in several markets.",
    methods: ["Card", "Bank transfer", "Mobile money"],
    currencies: ["NGN", "USD"],
    configured: Boolean(FLUTTERWAVE_PUBLIC_KEY) && BACKEND_READY
  },
  {
    id: "stripe",
    name: "Stripe",
    blurb: "International cards, Apple Pay and Google Pay. The default for buyers outside Africa.",
    methods: ["Card", "Apple Pay", "Google Pay"],
    currencies: ["USD"],
    configured: Boolean(STRIPE_PUBLISHABLE_KEY) && BACKEND_READY
  },
  {
    id: "paypal",
    name: "PayPal",
    blurb: "Pay with a PayPal balance or a linked card, without sharing card details with us.",
    methods: ["PayPal balance", "Card"],
    currencies: ["USD"],
    configured: Boolean(PAYPAL_CLIENT_ID) && BACKEND_READY
  }
];

export const configuredGateways = () => gateways.filter((gateway) => gateway.configured);

export const gatewaysForCurrency = (currency: Currency) =>
  configuredGateways().filter((gateway) => gateway.currencies.includes(currency));

/** True when no gateway has a publishable key — checkout must say so, not pretend. */
export const checkoutEnabled = () => configuredGateways().length > 0;

export type UnavailableReason = "not-configured" | "wrong-currency";

export interface Availability {
  available: boolean;
  reason?: UnavailableReason;
}

/**
 * Every gateway is shown in the selector so buyers can see what is supported,
 * but a gateway can be unusable for two different reasons and the customer
 * deserves to be told which — "try another one" is useless if the real fix is
 * switching currency.
 */
export function availabilityOf(gateway: Gateway, currency: Currency): Availability {
  if (!gateway.configured) return { available: false, reason: "not-configured" };
  if (!gateway.currencies.includes(currency)) return { available: false, reason: "wrong-currency" };
  return { available: true };
}

/** Gateways that would work right now, for suggesting an alternative. */
export const workingGateways = (currency: Currency) =>
  gateways.filter((gateway) => availabilityOf(gateway, currency).available);

/** Currencies a given gateway could work in, if it is configured at all. */
export const currenciesFor = (gateway: Gateway) => (gateway.configured ? gateway.currencies : []);

export const formatPrice = (amount: number, currency: Currency) =>
  new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);

/**
 * Loads a gateway's inline script once and resolves when it is ready.
 * Repeat calls reuse the in-flight or completed load.
 */
const scriptPromises = new Map<string, Promise<void>>();

export function loadScript(src: string): Promise<void> {
  const existing = scriptPromises.get(src);
  if (existing) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      // Drop the rejected promise so a later attempt can retry rather than
      // replaying the cached failure forever.
      scriptPromises.delete(src);
      reject(new Error(`Could not load ${src}`));
    };
    document.head.appendChild(script);
  });

  scriptPromises.set(src, promise);
  return promise;
}

export const SCRIPTS = {
  paystack: "https://js.paystack.co/v2/inline.js",
  flutterwave: "https://checkout.flutterwave.com/v3.js",
  paypal: (clientId: string, currency: Currency) =>
    `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${currency}`
} as const;

export interface CreateOrderResponse {
  /** Server-generated reference. The client never invents this. */
  reference: string;
  /** Amount the SERVER decided, in minor units, echoed back for display only. */
  amount: number;
  currency: Currency;
  /** Paystack access code from the server-side initialize call. */
  accessCode?: string;
  /** Hosted-checkout URL; also the fallback if the inline modal is blocked. */
  redirectUrl?: string;
  providerOrderId?: string;
  publicKey?: string;
}

export interface VerifyResponse {
  status: "paid" | "pending" | "failed";
  reference: string;
  /** Time-limited download links, issued only after server-side verification. */
  downloads?: { label: string; url: string }[];
  message?: string;
}

const request = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const payload = (await response.json().catch(() => null)) as (T & { error?: string }) | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? `Checkout failed (${response.status})`);
  }
  if (!payload) {
    throw new Error("Checkout returned an unreadable response.");
  }
  return payload;
};

/**
 * Asks the server to open an order. Note what is NOT sent: an amount. The
 * server prices the slug from its own catalogue.
 */
export const createOrder = (input: {
  productSlug: string;
  gateway: GatewayId;
  currency: Currency;
  email: string;
  name?: string;
}) => request<CreateOrderResponse>("/checkout/create", input);

export const verifyOrder = (input: { reference: string; gateway: GatewayId }) =>
  request<VerifyResponse>("/checkout/verify", input);
