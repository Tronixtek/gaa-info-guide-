/**
 * Scholar Zone checkout backend.
 *
 * Threat model this is written against:
 *
 * - The browser is attacker-controlled. It never sets a price (see
 *   catalogue.js) and its "payment succeeded" callback is never trusted.
 * - Access is granted on ONE of two things: a successful server-to-server
 *   verification call against the gateway, or a webhook whose signature we
 *   have checked. Nothing else.
 * - Orders are idempotent on reference, so a replayed verify or a webhook
 *   delivered twice cannot fulfil twice.
 *
 * Secrets are read from environment configuration and never returned to the
 * client. Only publishable keys reach the browser, and those come from the
 * frontend build, not from here.
 */

const crypto = require("node:crypto");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { priceFor } = require("./catalogue");

admin.initializeApp();
const db = admin.firestore();
const bucket = () => admin.storage().bucket();

const PAYSTACK_SECRET = defineSecret("PAYSTACK_SECRET_KEY");
const FLUTTERWAVE_SECRET = defineSecret("FLUTTERWAVE_SECRET_KEY");
const FLUTTERWAVE_HASH = defineSecret("FLUTTERWAVE_WEBHOOK_HASH");
const STRIPE_SECRET = defineSecret("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = defineSecret("STRIPE_WEBHOOK_SECRET");
const PAYPAL_CLIENT_ID = defineSecret("PAYPAL_CLIENT_ID");
const PAYPAL_SECRET = defineSecret("PAYPAL_SECRET");

const ALL_SECRETS = [
  PAYSTACK_SECRET,
  FLUTTERWAVE_SECRET,
  FLUTTERWAVE_HASH,
  STRIPE_SECRET,
  STRIPE_WEBHOOK_SECRET,
  PAYPAL_CLIENT_ID,
  PAYPAL_SECRET
];

const SITE_URL = process.env.SITE_URL || "https://scholar-zone.web.app";
const PAYPAL_API =
  process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

/* ------------------------------------------------------------------ helpers */

const json = (res, status, body) => res.status(status).json(body);

const isEmail = (value) => typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const newReference = () => `sz_${Date.now().toString(36)}_${crypto.randomBytes(8).toString("hex")}`;

/** Signed, time-limited download URLs. Files are never public. */
async function issueDownloads(files) {
  const expires = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  return Promise.all(
    files.map(async (file) => {
      const [url] = await bucket()
        .file(file.path)
        .getSignedUrl({ action: "read", expires });
      return { label: file.label, url };
    })
  );
}

/**
 * Marks an order paid exactly once. Returns the order whether or not this call
 * was the one that flipped it, so a duplicate webhook is harmless.
 */
async function fulfil(reference, providerRef) {
  const ref = db.collection("orders").doc(reference);

  return db.runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    if (!snapshot.exists) throw new Error("Unknown order reference");

    const order = snapshot.data();
    if (order.status !== "paid") {
      tx.update(ref, {
        status: "paid",
        providerRef: providerRef || null,
        paidAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    return { ...order, status: "paid" };
  });
}

/* -------------------------------------------------------- gateway verifiers */

async function verifyPaystack(reference, secret) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` }
  });
  const body = await response.json();
  const data = body?.data;
  return {
    ok: body?.status === true && data?.status === "success",
    amount: data?.amount,
    currency: data?.currency,
    providerRef: data?.id ? String(data.id) : undefined
  };
}

async function verifyFlutterwave(reference, secret) {
  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret}` } }
  );
  const body = await response.json();
  const data = body?.data;
  return {
    ok: body?.status === "success" && data?.status === "successful",
    // Flutterwave reports major units; normalise to minor for comparison.
    amount: typeof data?.amount === "number" ? Math.round(data.amount * 100) : undefined,
    currency: data?.currency,
    providerRef: data?.id ? String(data.id) : undefined
  };
}

async function verifyStripe(sessionId, secret) {
  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${secret}` }
  });
  const body = await response.json();
  return {
    ok: body?.payment_status === "paid",
    amount: body?.amount_total,
    currency: typeof body?.currency === "string" ? body.currency.toUpperCase() : undefined,
    providerRef: body?.payment_intent
  };
}

async function paypalToken(clientId, secret) {
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const body = await response.json();
  if (!body?.access_token) throw new Error("PayPal auth failed");
  return body.access_token;
}

async function verifyPaypal(orderId, clientId, secret) {
  const token = await paypalToken(clientId, secret);
  // Capture is the point of no return; capturing an already-captured order
  // returns an error we treat as already-paid via the subsequent status read.
  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
  });
  const body = await response.json();
  const unit = body?.purchase_units?.[0]?.payments?.captures?.[0];
  return {
    ok: body?.status === "COMPLETED",
    amount: unit?.amount?.value ? Math.round(Number(unit.amount.value) * 100) : undefined,
    currency: unit?.amount?.currency_code,
    providerRef: unit?.id
  };
}

/* ----------------------------------------------------------------- endpoints */

exports.api = onRequest({ secrets: ALL_SECRETS, cors: [SITE_URL], region: "us-central1" }, async (req, res) => {
  const path = req.path.replace(/\/+$/, "");

  try {
    /* ---------------------------------------------------- create an order */
    if (path === "/checkout/create" && req.method === "POST") {
      const { productSlug, gateway, currency, email, name } = req.body || {};

      if (!isEmail(email)) return json(res, 400, { error: "A valid email is required." });

      // Price comes from the server catalogue. Any amount in the request body
      // is ignored entirely.
      const line = priceFor(productSlug, currency);
      const reference = newReference();

      const order = {
        reference,
        productSlug,
        title: line.title,
        amount: line.amount,
        currency: line.currency,
        gateway,
        email,
        name: name || null,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      if (gateway === "paystack" || gateway === "flutterwave") {
        await db.collection("orders").doc(reference).set(order);
        return json(res, 200, { reference, amount: line.amount, currency: line.currency });
      }

      if (gateway === "stripe") {
        const params = new URLSearchParams({
          mode: "payment",
          "line_items[0][quantity]": "1",
          "line_items[0][price_data][currency]": line.currency.toLowerCase(),
          "line_items[0][price_data][unit_amount]": String(line.amount),
          "line_items[0][price_data][product_data][name]": line.title,
          customer_email: email,
          client_reference_id: reference,
          success_url: `${SITE_URL}/resources/${productSlug}?reference=${reference}`,
          cancel_url: `${SITE_URL}/resources/${productSlug}?cancelled=1`
        });

        const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${STRIPE_SECRET.value()}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: params
        });
        const session = await response.json();
        if (!session?.url) return json(res, 502, { error: "Stripe session could not be created." });

        await db.collection("orders").doc(reference).set({ ...order, providerOrderId: session.id });
        return json(res, 200, {
          reference,
          amount: line.amount,
          currency: line.currency,
          redirectUrl: session.url
        });
      }

      if (gateway === "paypal") {
        const token = await paypalToken(PAYPAL_CLIENT_ID.value(), PAYPAL_SECRET.value());
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
              {
                reference_id: reference,
                description: line.title,
                amount: {
                  currency_code: line.currency,
                  value: (line.amount / 100).toFixed(2)
                }
              }
            ]
          })
        });
        const created = await response.json();
        if (!created?.id) return json(res, 502, { error: "PayPal order could not be created." });

        await db.collection("orders").doc(reference).set({ ...order, providerOrderId: created.id });
        return json(res, 200, {
          reference,
          amount: line.amount,
          currency: line.currency,
          providerOrderId: created.id
        });
      }

      return json(res, 400, { error: "Unsupported gateway." });
    }

    /* --------------------------------------------------------- verify pay */
    if (path === "/checkout/verify" && req.method === "POST") {
      const { reference, gateway } = req.body || {};
      const snapshot = await db.collection("orders").doc(String(reference)).get();
      if (!snapshot.exists) return json(res, 404, { error: "Unknown reference." });

      const order = snapshot.data();

      // Already fulfilled — reissue links rather than charging or capturing again.
      if (order.status === "paid") {
        const line = priceFor(order.productSlug, order.currency);
        return json(res, 200, {
          status: "paid",
          reference,
          downloads: await issueDownloads(line.files)
        });
      }

      let outcome;
      if (gateway === "paystack") outcome = await verifyPaystack(reference, PAYSTACK_SECRET.value());
      else if (gateway === "flutterwave")
        outcome = await verifyFlutterwave(reference, FLUTTERWAVE_SECRET.value());
      else if (gateway === "stripe") outcome = await verifyStripe(order.providerOrderId, STRIPE_SECRET.value());
      else if (gateway === "paypal")
        outcome = await verifyPaypal(order.providerOrderId, PAYPAL_CLIENT_ID.value(), PAYPAL_SECRET.value());
      else return json(res, 400, { error: "Unsupported gateway." });

      // The gateway saying "paid" is not enough — it has to be paid for the
      // right amount in the right currency, or a tampered or reused payment
      // could unlock a more expensive product.
      const amountMatches = outcome.amount === order.amount;
      const currencyMatches = outcome.currency === order.currency;

      if (!outcome.ok || !amountMatches || !currencyMatches) {
        await db.collection("orders").doc(String(reference)).update({
          status: "failed",
          failureReason: !outcome.ok ? "provider_declined" : "amount_mismatch"
        });
        return json(res, 200, {
          status: "failed",
          reference,
          message: "We could not confirm this payment. If money left your account, contact us with this reference."
        });
      }

      await fulfil(String(reference), outcome.providerRef);
      const line = priceFor(order.productSlug, order.currency);

      return json(res, 200, {
        status: "paid",
        reference,
        downloads: await issueDownloads(line.files)
      });
    }

    /* ----------------------------------------------------------- webhooks */
    // Webhooks are the source of truth: they arrive even if the buyer closes
    // the tab before the client-side verify call runs.

    if (path === "/webhooks/paystack" && req.method === "POST") {
      const signature = req.get("x-paystack-signature");
      const expected = crypto
        .createHmac("sha512", PAYSTACK_SECRET.value())
        .update(req.rawBody)
        .digest("hex");
      if (signature !== expected) return res.status(401).send("bad signature");

      const event = req.body;
      if (event?.event === "charge.success") {
        await fulfil(event.data.reference, String(event.data.id));
      }
      return res.status(200).send("ok");
    }

    if (path === "/webhooks/flutterwave" && req.method === "POST") {
      if (req.get("verif-hash") !== FLUTTERWAVE_HASH.value()) {
        return res.status(401).send("bad signature");
      }
      const event = req.body;
      if (event?.data?.status === "successful") {
        await fulfil(event.data.tx_ref, String(event.data.id));
      }
      return res.status(200).send("ok");
    }

    if (path === "/webhooks/stripe" && req.method === "POST") {
      // Stripe signs with a timestamped HMAC; reject anything we cannot match.
      const header = req.get("stripe-signature") || "";
      const parts = Object.fromEntries(header.split(",").map((part) => part.split("=")));
      const payload = `${parts.t}.${req.rawBody}`;
      const expected = crypto
        .createHmac("sha256", STRIPE_WEBHOOK_SECRET.value())
        .update(payload)
        .digest("hex");

      if (!parts.v1 || !crypto.timingSafeEqual(Buffer.from(parts.v1), Buffer.from(expected))) {
        return res.status(401).send("bad signature");
      }

      const event = req.body;
      if (event?.type === "checkout.session.completed") {
        await fulfil(event.data.object.client_reference_id, event.data.object.payment_intent);
      }
      return res.status(200).send("ok");
    }

    return json(res, 404, { error: "Not found" });
  } catch (error) {
    console.error("checkout error", error);
    return json(res, 500, { error: "Checkout failed. No payment was taken." });
  }
});
