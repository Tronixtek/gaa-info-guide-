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

/** Backend base. Firebase rewrites /api/** to the checkout function. */
export const API_BASE = (env.VITE_API_BASE_URL as string | undefined) ?? "/api";

export const gateways: Gateway[] = [
  {
    id: "paystack",
    name: "Paystack",
    blurb: "Cards, bank transfer, USSD and mobile money across Nigeria, Ghana, Kenya and South Africa.",
    methods: ["Card", "Bank transfer", "USSD", "Mobile money"],
    currencies: ["NGN", "USD"],
    configured: Boolean(PAYSTACK_PUBLIC_KEY)
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    blurb: "Wide African coverage plus international cards, with mobile money in several markets.",
    methods: ["Card", "Bank transfer", "Mobile money"],
    currencies: ["NGN", "USD"],
    configured: Boolean(FLUTTERWAVE_PUBLIC_KEY)
  },
  {
    id: "stripe",
    name: "Stripe",
    blurb: "International cards, Apple Pay and Google Pay. The default for buyers outside Africa.",
    methods: ["Card", "Apple Pay", "Google Pay"],
    currencies: ["USD"],
    configured: Boolean(STRIPE_PUBLISHABLE_KEY)
  },
  {
    id: "paypal",
    name: "PayPal",
    blurb: "Pay with a PayPal balance or a linked card, without sharing card details with us.",
    methods: ["PayPal balance", "Card"],
    currencies: ["USD"],
    configured: Boolean(PAYPAL_CLIENT_ID)
  }
];

export const configuredGateways = () => gateways.filter((gateway) => gateway.configured);

export const gatewaysForCurrency = (currency: Currency) =>
  configuredGateways().filter((gateway) => gateway.currencies.includes(currency));

/** True when no gateway has a publishable key — checkout must say so, not pretend. */
export const checkoutEnabled = () => configuredGateways().length > 0;

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
  /** Stripe and PayPal hand back a URL or order id to hand to their SDK. */
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
