# Payments — setup runbook

Four gateways are wired: **Paystack**, **Flutterwave**, **Stripe** and
**PayPal**, in USD and NGN.

## Current state

The frontend is deployed and complete. **Checkout is not yet taking money**,
because no publishable keys are configured and the backend function is not
deployed. With no keys present the checkout renders a plain "checkout is not
live yet" panel rather than a form that cannot complete — deliberately, so a
buyer is never dropped into a dead payment flow.

Everything below is what turns it on.

## Security model

Three rules the code enforces. Do not work around them.

**1. The browser never sets a price.** `createOrder` sends a product slug, not
an amount. The server prices it from `functions/catalogue.js`. A client posting
`amount: 1` gets charged the catalogue price.

**2. A client-side success callback is not proof of payment.** Gateways call
`onSuccess` in the browser, which anyone can trigger from a console. Access is
granted only after `/checkout/verify` calls the gateway server-to-server, or a
signature-verified webhook arrives.

**3. Verification checks amount and currency, not just status.** A payment that
succeeded for the wrong amount is rejected — otherwise a $29 payment could
unlock the $79 bundle.

Secret keys live in Firebase secrets and are never returned to the client. Only
publishable keys (`VITE_*`) reach the browser, which is what they are for.

## 1. Create merchant accounts

| Gateway | Dashboard | Key needed (public) | Key needed (secret) |
| --- | --- | --- | --- |
| Paystack | dashboard.paystack.com | `pk_test_…` / `pk_live_…` | `sk_test_…` / `sk_live_…` |
| Flutterwave | dashboard.flutterwave.com | `FLWPUBK…` | `FLWSECK…` + webhook hash |
| Stripe | dashboard.stripe.com | `pk_test_…` / `pk_live_…` | `sk_test_…` + webhook signing secret |
| PayPal | developer.paypal.com | Client ID | Client secret |

Start in test/sandbox mode. Every gateway issues separate test and live keys.

## 2. Upgrade Firebase to the Blaze plan

Cloud Functions require it. The free Spark plan cannot deploy the checkout
backend, so this is a hard prerequisite. Blaze is usage-billed and has a free
tier that comfortably covers low volume, but it does need a billing account.

Console → project → Upgrade.

You also need **Firestore** (order records) and **Cloud Storage** (the pack
files) enabled on the project.

## 3. Set the frontend publishable keys

```bash
cp .env.example .env.local
# fill in the VITE_* values, then rebuild
npm run build
```

Only gateways with a key present appear at checkout. Configuring just Paystack
is fine — the others simply do not render.

## 4. Set the backend secrets

```bash
firebase functions:secrets:set PAYSTACK_SECRET_KEY
firebase functions:secrets:set FLUTTERWAVE_SECRET_KEY
firebase functions:secrets:set FLUTTERWAVE_WEBHOOK_HASH
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
firebase functions:secrets:set PAYPAL_CLIENT_ID
firebase functions:secrets:set PAYPAL_SECRET
```

For live PayPal, also set the environment variable `PAYPAL_ENV=live`; it
defaults to sandbox.

## 5. Upload the pack files

Paths are declared in `functions/catalogue.js`. Upload to the default Cloud
Storage bucket under `packs/`:

```
packs/remote-job-assessment-pack.pdf
packs/application-tracker.xlsx
packs/study-abroad-readiness-kit.pdf
packs/timeline-tracker.xlsx
packs/global-career-training-bundle.pdf
packs/all-trackers.zip
```

**Keep the bucket private.** Downloads are issued as signed URLs valid for
seven days, generated only after payment is verified. A public bucket would
make every pack free to anyone who guesses a filename.

## 6. Deploy

```bash
cd functions && npm install && cd ..
firebase deploy --only functions,hosting
```

`firebase.json` rewrites `/api/**` to the `api` function, ahead of the SPA
catch-all — order matters there, or `/api/**` would be served `index.html`.

## 7. Register webhooks

Webhooks are the source of truth: they arrive even when the buyer closes the tab
before the browser's verify call runs.

| Gateway | Webhook URL |
| --- | --- |
| Paystack | `https://scholar-zone.web.app/api/webhooks/paystack` |
| Flutterwave | `https://scholar-zone.web.app/api/webhooks/flutterwave` |
| Stripe | `https://scholar-zone.web.app/api/webhooks/stripe` (event: `checkout.session.completed`) |

PayPal is captured synchronously during verification and needs no webhook.

## 8. Test before going live

Run one full purchase per gateway in test mode, then confirm:

- [ ] The order appears in Firestore with `status: "paid"`.
- [ ] Download links work and expire as expected.
- [ ] Calling `/checkout/verify` twice does not create a second fulfilment.
- [ ] A tampered request (`amount: 1` in the create body) still charges full price.
- [ ] A webhook with a bad signature is rejected with 401.

Test cards: Paystack and Flutterwave publish test card numbers in their docs;
Stripe uses `4242 4242 4242 4242`; PayPal uses sandbox buyer accounts.

## Changing prices

Prices live in **two** places and both must change together:

- `src/content/commerce.ts` — what the buyer sees (major units)
- `functions/catalogue.js` — what is actually charged (**minor** units)

The duplication is deliberate: the server must not trust a price that came from
the client bundle. If they disagree, the server wins and the buyer sees a
different amount at the gateway than on the page — so keep them in sync.

NGN prices are set by the business, not converted at runtime. A live FX
conversion in the client would drift from what the gateway settles at and would
show a different price on each page load.
