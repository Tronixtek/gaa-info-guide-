/**
 * Scholar Zone checkout API — Cloudflare Worker.
 *
 * Threat model:
 * - The browser is attacker-controlled. It never sets a price (catalogue.ts),
 *   and its "payment succeeded" callback is never trusted.
 * - Access is granted on ONE of two things: a server-to-server verification
 *   against Paystack, or a webhook whose HMAC signature we have checked.
 * - Fulfilment is idempotent on reference, so a replayed verify call or a
 *   webhook delivered twice cannot fulfil twice.
 * - Pack files live in a private R2 bucket. Downloads are streamed through
 *   this Worker behind a short-lived signed token; object keys never reach
 *   the client.
 */

import { priceFor, CATALOGUE } from "./catalogue";

export interface Env {
  DB: D1Database;
  PACKS: R2Bucket;
  /** Paystack secret key (sk_live_… / sk_test_…). Set via `wrangler secret put`. */
  PAYSTACK_SECRET_KEY: string;
  /** Random 32+ byte string used to sign download tokens. */
  DOWNLOAD_SIGNING_KEY: string;
  /** e.g. https://scholar-zone.web.app */
  ALLOWED_ORIGIN: string;
  /**
   * Optional Paystack subaccount (ACCT_xxxx). When set, settlement for these
   * transactions is routed to that subaccount's bank account, keeping Scholar
   * Zone revenue separate from the other app on the same Paystack business.
   * Unset = everything settles to the main account as normal.
   */
  PAYSTACK_SUBACCOUNT?: string;
}

/**
 * Payment channels offered on the checkout. `bank_transfer` gives the buyer a
 * one-off account number to send money to — the "customer transfers to an
 * account" flow, without needing Dedicated Virtual Accounts (which require a
 * CAC-registered business and are metered per customer).
 */
const PAYSTACK_CHANNELS = ["card", "bank_transfer", "ussd", "bank"];

const DOWNLOAD_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/* ------------------------------------------------------------------ helpers */

const corsHeaders = (env: Env) => ({
  "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin"
});

const json = (env: Env, status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(env) }
  });

const isEmail = (value: unknown): value is string =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320;

const newReference = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `sz_${Date.now().toString(36)}_${hex}`;
};

const toHex = (buffer: ArrayBuffer) =>
  [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function hmac(key: string, message: string, hash: "SHA-256" | "SHA-512") {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash },
    false,
    ["sign"]
  );
  return toHex(await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message)));
}

/** Constant-time compare — a fast-exit compare leaks the signature byte by byte. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* -------------------------------------------------------- download tokens */

const b64url = (value: string) =>
  btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const unb64url = (value: string) =>
  atob(value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "="));

async function signDownload(env: Env, reference: string, path: string) {
  const expires = Math.floor(Date.now() / 1000) + DOWNLOAD_TTL_SECONDS;
  const payload = b64url(JSON.stringify({ reference, path, expires }));
  const signature = await hmac(env.DOWNLOAD_SIGNING_KEY, payload, "SHA-256");
  return `${payload}.${signature}`;
}

async function readDownloadToken(env: Env, token: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = await hmac(env.DOWNLOAD_SIGNING_KEY, payload, "SHA-256");
  if (!safeEqual(signature, expected)) return null;

  try {
    const parsed = JSON.parse(unb64url(payload)) as {
      reference: string;
      path: string;
      expires: number;
    };
    if (parsed.expires < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Download URLs must be absolute and point at THIS Worker. The site is served
 * from Firebase Hosting on a different origin, so a relative /api/download
 * would hit the static host and 404.
 */
const issueDownloads = async (
  env: Env,
  workerOrigin: string,
  reference: string,
  files: { label: string; path: string }[]
) =>
  Promise.all(
    files.map(async (file) => ({
      label: file.label,
      url: `${workerOrigin}/api/download?token=${await signDownload(env, reference, file.path)}`
    }))
  );

/* --------------------------------------------------------------- Paystack */

interface PaystackVerification {
  ok: boolean;
  amount?: number;
  currency?: string;
  providerRef?: string;
}

async function verifyWithPaystack(reference: string, secret: string): Promise<PaystackVerification> {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret}` } }
  );

  const body = (await response.json()) as {
    status?: boolean;
    data?: { status?: string; amount?: number; currency?: string; id?: number };
  };

  const data = body?.data;
  return {
    ok: body?.status === true && data?.status === "success",
    amount: data?.amount,
    currency: data?.currency,
    providerRef: data?.id ? String(data.id) : undefined
  };
}

/* ------------------------------------------------------------ persistence */

/**
 * Flips an order to paid exactly once. The WHERE clause carries the
 * idempotency: a second call updates zero rows and is harmless.
 */
async function fulfil(env: Env, reference: string, providerRef?: string) {
  await env.DB.prepare(
    `UPDATE orders
        SET status = 'paid', provider_ref = ?, paid_at = ?
      WHERE reference = ? AND status != 'paid'`
  )
    .bind(providerRef ?? null, new Date().toISOString(), reference)
    .run();
}

/* ----------------------------------------------------------------- routes */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const workerOrigin = url.origin;
    const path = url.pathname.replace(/^\/api/, "").replace(/\/+$/, "") || "/";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    try {
      /* ------------------------------------------------ create an order */
      if (path === "/checkout/create" && request.method === "POST") {
        const body = (await request.json()) as Record<string, unknown>;
        const { productSlug, currency, email, name, gateway } = body;

        if (!isEmail(email)) {
          return json(env, 400, { error: "A valid email address is required." });
        }
        if (gateway !== "paystack") {
          return json(env, 400, {
            error: "Only Paystack is available at the moment. Please choose Paystack."
          });
        }

        // Price comes from the server catalogue. Any `amount` in the request
        // body is ignored entirely.
        const line = priceFor(productSlug, currency);
        const reference = newReference();

        await env.DB.prepare(
          `INSERT INTO orders
             (reference, product_slug, title, amount, currency, gateway, email, name, status, created_at)
           VALUES (?, ?, ?, ?, ?, 'paystack', ?, ?, 'pending', ?)`
        )
          .bind(
            reference,
            productSlug as string,
            line.title,
            line.amount,
            line.currency,
            email,
            typeof name === "string" ? name : null,
            new Date().toISOString()
          )
          .run();

        // Initialise server-side rather than handing amount+key to inline JS.
        // Two reasons: `subaccount` and `channels` can ONLY be set here, and
        // the amount now never passes through the browser at all — the client
        // receives an opaque access code and nothing it can tamper with.
        const initBody: Record<string, unknown> = {
          email,
          amount: line.amount,
          currency: line.currency,
          reference,
          channels: PAYSTACK_CHANNELS,
          metadata: {
            product_slug: productSlug,
            product_title: line.title,
            customer_name: typeof name === "string" ? name : null
          }
        };

        // Route settlement to the project's own subaccount when configured.
        if (env.PAYSTACK_SUBACCOUNT) {
          initBody.subaccount = env.PAYSTACK_SUBACCOUNT;
        }

        const initResponse = await fetch("https://api.paystack.co/transaction/initialize", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(initBody)
        });

        const initJson = (await initResponse.json()) as {
          status?: boolean;
          message?: string;
          data?: { access_code?: string; authorization_url?: string };
        };

        if (!initJson.status || !initJson.data?.access_code) {
          console.error("paystack initialize failed", initJson.message);
          return json(env, 502, {
            error: "We could not start this payment. Nothing has been charged — please try again."
          });
        }

        return json(env, 200, {
          reference,
          amount: line.amount,
          currency: line.currency,
          accessCode: initJson.data.access_code,
          // Fallback for buyers whose browser blocks the inline modal.
          redirectUrl: initJson.data.authorization_url
        });
      }

      /* ------------------------------------------------- verify a payment */
      if (path === "/checkout/verify" && request.method === "POST") {
        const body = (await request.json()) as Record<string, unknown>;
        const reference = String(body.reference ?? "");

        const order = await env.DB.prepare(`SELECT * FROM orders WHERE reference = ?`)
          .bind(reference)
          .first<{
            reference: string;
            product_slug: string;
            amount: number;
            currency: string;
            status: string;
          }>();

        if (!order) return json(env, 404, { error: "Unknown reference." });

        // Already fulfilled — reissue links rather than verifying again.
        if (order.status === "paid") {
          const line = priceFor(order.product_slug, order.currency);
          return json(env, 200, {
            status: "paid",
            reference,
            downloads: await issueDownloads(env, workerOrigin, reference, line.files)
          });
        }

        const outcome = await verifyWithPaystack(reference, env.PAYSTACK_SECRET_KEY);

        // "Succeeded" is not enough. It has to have succeeded for the right
        // amount in the right currency, or a cheap payment could unlock an
        // expensive pack.
        const amountMatches = outcome.amount === order.amount;
        const currencyMatches = outcome.currency === order.currency;

        if (!outcome.ok || !amountMatches || !currencyMatches) {
          await env.DB.prepare(
            `UPDATE orders SET status = 'failed', failure_reason = ? WHERE reference = ? AND status != 'paid'`
          )
            .bind(outcome.ok ? "amount_mismatch" : "provider_declined", reference)
            .run();

          return json(env, 200, {
            status: "failed",
            reference,
            message:
              "We could not confirm this payment. If money left your account, contact us with this reference and we will sort it out."
          });
        }

        await fulfil(env, reference, outcome.providerRef);
        const line = priceFor(order.product_slug, order.currency);

        return json(env, 200, {
          status: "paid",
          reference,
          downloads: await issueDownloads(env, workerOrigin, reference, line.files)
        });
      }

      /* ---------------------------------------------------- Paystack webhook */
      // The source of truth: this arrives even if the buyer closes the tab
      // before the browser's verify call runs.
      if (path === "/webhooks/paystack" && request.method === "POST") {
        const raw = await request.text();
        const signature = request.headers.get("x-paystack-signature") ?? "";
        const expected = await hmac(env.PAYSTACK_SECRET_KEY, raw, "SHA-512");

        if (!safeEqual(signature, expected)) {
          return new Response("bad signature", { status: 401 });
        }

        const event = JSON.parse(raw) as {
          event?: string;
          data?: { reference?: string; id?: number; amount?: number; currency?: string };
        };

        if (event.event === "charge.success" && event.data?.reference) {
          const order = await env.DB.prepare(
            `SELECT amount, currency FROM orders WHERE reference = ?`
          )
            .bind(event.data.reference)
            .first<{ amount: number; currency: string }>();

          // Same amount/currency check as the verify path — a webhook is
          // authenticated, but that does not make it the right payment.
          if (
            order &&
            order.amount === event.data.amount &&
            order.currency === event.data.currency
          ) {
            await fulfil(env, event.data.reference, String(event.data.id ?? ""));
          }
        }

        return new Response("ok", { status: 200 });
      }

      /* -------------------------------------------------------- downloads */
      if (path === "/download" && request.method === "GET") {
        const token = url.searchParams.get("token") ?? "";
        const claim = await readDownloadToken(env, token);
        if (!claim) {
          return new Response("This download link has expired or is invalid.", { status: 403 });
        }

        // Re-check the order is still paid; a refunded order should not keep
        // serving files just because the token has not expired.
        const order = await env.DB.prepare(`SELECT status FROM orders WHERE reference = ?`)
          .bind(claim.reference)
          .first<{ status: string }>();

        if (order?.status !== "paid") {
          return new Response("This purchase is no longer active.", { status: 403 });
        }

        const object = await env.PACKS.get(claim.path);
        if (!object) return new Response("File not found.", { status: 404 });

        const filename = claim.path.split("/").pop() ?? "download";
        return new Response(object.body, {
          headers: {
            "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "private, no-store"
          }
        });
      }

      /* ------------------------------------------------------------ health */
      if (path === "/health") {
        return json(env, 200, {
          ok: true,
          products: Object.keys(CATALOGUE).length,
          gateway: "paystack",
          currency: "NGN",
          subaccountRouting: Boolean(env.PAYSTACK_SUBACCOUNT),
          channels: PAYSTACK_CHANNELS
        });
      }

      return json(env, 404, { error: "Not found" });
    } catch (error) {
      console.error("checkout error", error);
      return json(env, 500, { error: "Checkout failed. No payment was taken." });
    }
  }
};
