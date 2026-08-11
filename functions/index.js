/**
 * Scholar Zone checkout API — Firebase Functions v2.
 *
 * Served at /api/** via a Firebase Hosting rewrite, so the API is same-origin
 * with the site. That removes CORS entirely and means download links can be
 * relative.
 *
 * Threat model:
 * - The browser is attacker-controlled. It never sets a price (catalogue.js),
 *   and Paystack's client-side onSuccess is never trusted.
 * - Access is granted on ONE of two things: a server-to-server verification
 *   against Paystack, or a webhook whose HMAC-SHA512 signature we checked.
 * - Fulfilment is idempotent on reference, so a replayed verify call or a
 *   webhook delivered twice cannot fulfil twice.
 * - Pack files live in a private Cloud Storage bucket and are streamed through
 *   this function behind a short-lived signed token. Object paths never reach
 *   the client.
 */

const crypto = require("node:crypto");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { CATALOGUE, priceFor } = require("./catalogue");

admin.initializeApp();
const db = admin.firestore();

const PAYSTACK_SECRET_KEY = defineSecret("PAYSTACK_SECRET_KEY");
const DOWNLOAD_SIGNING_KEY = defineSecret("DOWNLOAD_SIGNING_KEY");
/**
 * Optional Paystack subaccount (ACCT_xxxx). When set, settlement for these
 * transactions routes to that subaccount's bank account, keeping Scholar Zone
 * revenue separate from the other app on the same Paystack business.
 * Unset = everything settles to the main account as normal.
 */
const PAYSTACK_SUBACCOUNT = defineSecret("PAYSTACK_SUBACCOUNT");

const SECRETS = [PAYSTACK_SECRET_KEY, DOWNLOAD_SIGNING_KEY, PAYSTACK_SUBACCOUNT];

const DOWNLOAD_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Payment channels offered on the checkout. `bank_transfer` gives the buyer a
 * one-off account number to send money to — the "customer transfers to an
 * account" flow, without needing Dedicated Virtual Accounts (which require a
 * CAC-registered business and are metered per customer).
 */
const PAYSTACK_CHANNELS = ["card", "bank_transfer", "ussd", "bank"];

/* ------------------------------------------------------------------ helpers */

const isEmail = (value) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320;

const newReference = () => `sz_${Date.now().toString(36)}_${crypto.randomBytes(8).toString("hex")}`;

/** Constant-time compare — a fast-exit compare leaks the signature byte by byte. */
function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

const b64url = (value) =>
  Buffer.from(value).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const unb64url = (value) =>
  Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");

const sign = (key, payload) => crypto.createHmac("sha256", key).update(payload).digest("hex");

function signDownload(key, reference, path) {
  const expires = Math.floor(Date.now() / 1000) + DOWNLOAD_TTL_SECONDS;
  const payload = b64url(JSON.stringify({ reference, path, expires }));
  return `${payload}.${sign(key, payload)}`;
}

function readDownloadToken(key, token) {
  const [payload, signature] = String(token).split(".");
  if (!payload || !signature) return null;
  if (!safeEqual(signature, sign(key, payload))) return null;

  try {
    const parsed = JSON.parse(unb64url(payload));
    if (parsed.expires < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Download links are relative because the API is same-origin with the site
 * through the Hosting rewrite.
 */
const issueDownloads = (key, reference, files) =>
  files.map((file) => ({
    label: file.label,
    url: `/api/download?token=${encodeURIComponent(signDownload(key, reference, file.path))}`
  }));

/* --------------------------------------------------------------- Paystack */

async function verifyWithPaystack(reference, secret) {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret}` } }
  );
  const body = await response.json();
  const data = body && body.data;

  return {
    ok: body?.status === true && data?.status === "success",
    amount: data?.amount,
    currency: data?.currency,
    providerRef: data?.id ? String(data.id) : undefined
  };
}

/* ------------------------------------------------------------ persistence */

/**
 * Flips an order to paid exactly once. Running inside a transaction means two
 * concurrent calls (verify racing a webhook) cannot both fulfil.
 */
async function fulfil(reference, providerRef) {
  const ref = db.collection("orders").doc(reference);
  await db.runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    if (!snapshot.exists) throw new Error("Unknown order reference");
    if (snapshot.data().status === "paid") return;

    tx.update(ref, {
      status: "paid",
      providerRef: providerRef || null,
      paidAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
}

/* ----------------------------------------------------------------- routes */

exports.api = onRequest({ secrets: SECRETS, region: "us-central1" }, async (req, res) => {
  // Hosting may forward either /api/checkout/create or /checkout/create
  // depending on the rewrite; normalise both.
  const path = req.path.replace(/^\/api/, "").replace(/\/+$/, "") || "/";

  try {
    /* ---------------------------------------------------- create an order */
    if (path === "/checkout/create" && req.method === "POST") {
      const { productSlug, currency, email, name, gateway } = req.body || {};

      if (!isEmail(email)) {
        return res.status(400).json({ error: "A valid email address is required." });
      }
      if (gateway !== "paystack") {
        return res
          .status(400)
          .json({ error: "Only Paystack is available at the moment. Please choose Paystack." });
      }

      // Price comes from the server catalogue. Any `amount` in the request
      // body is ignored entirely.
      const line = priceFor(productSlug, currency);
      const reference = newReference();

      // Initialise server-side rather than handing amount+key to inline JS.
      // Two reasons: `subaccount` and `channels` can ONLY be set here, and the
      // amount never passes through the browser at all — the client receives
      // an opaque access code and nothing it can tamper with.
      const initBody = {
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

      const subaccount = PAYSTACK_SUBACCOUNT.value();
      if (subaccount) initBody.subaccount = subaccount;

      const initResponse = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY.value()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(initBody)
      });
      const initJson = await initResponse.json();

      if (!initJson?.status || !initJson?.data?.access_code) {
        console.error("paystack initialize failed", initJson?.message);
        return res.status(502).json({
          error: "We could not start this payment. Nothing has been charged — please try again."
        });
      }

      await db.collection("orders").doc(reference).set({
        reference,
        productSlug,
        title: line.title,
        amount: line.amount,
        currency: line.currency,
        gateway: "paystack",
        email,
        name: typeof name === "string" ? name : null,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        reference,
        amount: line.amount,
        currency: line.currency,
        accessCode: initJson.data.access_code,
        // Fallback for buyers whose browser blocks the inline modal.
        redirectUrl: initJson.data.authorization_url
      });
    }

    /* ------------------------------------------------------ verify payment */
    if (path === "/checkout/verify" && req.method === "POST") {
      const reference = String((req.body || {}).reference || "");
      const snapshot = await db.collection("orders").doc(reference).get();
      if (!snapshot.exists) return res.status(404).json({ error: "Unknown reference." });

      const order = snapshot.data();

      // Already fulfilled — reissue links rather than verifying again.
      if (order.status === "paid") {
        const line = priceFor(order.productSlug, order.currency);
        return res.status(200).json({
          status: "paid",
          reference,
          downloads: issueDownloads(DOWNLOAD_SIGNING_KEY.value(), reference, line.files)
        });
      }

      const outcome = await verifyWithPaystack(reference, PAYSTACK_SECRET_KEY.value());

      // "Succeeded" is not enough. It has to have succeeded for the right
      // amount in the right currency, or a cheap payment could unlock an
      // expensive pack.
      if (!outcome.ok || outcome.amount !== order.amount || outcome.currency !== order.currency) {
        await db
          .collection("orders")
          .doc(reference)
          .update({ status: "failed", failureReason: outcome.ok ? "amount_mismatch" : "declined" });

        return res.status(200).json({
          status: "failed",
          reference,
          message:
            "We could not confirm this payment. If money left your account, contact us with this reference and we will sort it out."
        });
      }

      await fulfil(reference, outcome.providerRef);
      const line = priceFor(order.productSlug, order.currency);

      return res.status(200).json({
        status: "paid",
        reference,
        downloads: issueDownloads(DOWNLOAD_SIGNING_KEY.value(), reference, line.files)
      });
    }

    /* --------------------------------------------------- Paystack webhook */
    // The source of truth: this arrives even if the buyer closes the tab
    // before the browser's verify call runs.
    if (path === "/webhooks/paystack" && req.method === "POST") {
      const raw = req.rawBody ? req.rawBody.toString("utf8") : JSON.stringify(req.body);
      const expected = crypto
        .createHmac("sha512", PAYSTACK_SECRET_KEY.value())
        .update(raw)
        .digest("hex");

      if (!safeEqual(req.get("x-paystack-signature") || "", expected)) {
        return res.status(401).send("bad signature");
      }

      const event = req.body;
      if (event?.event === "charge.success" && event?.data?.reference) {
        const snapshot = await db.collection("orders").doc(event.data.reference).get();
        const order = snapshot.exists ? snapshot.data() : null;

        // Same amount/currency check as the verify path — an authenticated
        // webhook still is not proof it is the right payment.
        if (order && order.amount === event.data.amount && order.currency === event.data.currency) {
          await fulfil(event.data.reference, String(event.data.id || ""));
        }
      }

      return res.status(200).send("ok");
    }

    /* ------------------------------------------------------------ download */
    if (path === "/download" && req.method === "GET") {
      const claim = readDownloadToken(DOWNLOAD_SIGNING_KEY.value(), req.query.token || "");
      if (!claim) {
        return res.status(403).send("This download link has expired or is invalid.");
      }

      // Re-check the order is still paid; a refunded order should not keep
      // serving files just because the token has not expired.
      const snapshot = await db.collection("orders").doc(claim.reference).get();
      if (!snapshot.exists || snapshot.data().status !== "paid") {
        return res.status(403).send("This purchase is no longer active.");
      }

      const file = admin.storage().bucket().file(claim.path);
      const [exists] = await file.exists();
      if (!exists) return res.status(404).send("File not found.");

      const filename = claim.path.split("/").pop() || "download";
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Cache-Control", "private, no-store");

      return file
        .createReadStream()
        .on("error", (error) => {
          console.error("download stream failed", error);
          if (!res.headersSent) res.status(500).send("Download failed.");
        })
        .pipe(res);
    }

    /* -------------------------------------------------------------- health */
    if (path === "/health") {
      return res.status(200).json({
        ok: true,
        products: Object.keys(CATALOGUE).length,
        gateway: "paystack",
        currency: "NGN",
        subaccountRouting: Boolean(PAYSTACK_SUBACCOUNT.value()),
        channels: PAYSTACK_CHANNELS
      });
    }

    return res.status(404).json({ error: "Not found" });
  } catch (error) {
    console.error("checkout error", error);
    return res.status(500).json({ error: "Checkout failed. No payment was taken." });
  }
});
