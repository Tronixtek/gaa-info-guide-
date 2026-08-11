# Payments — Paystack setup runbook

**Live gateway:** Paystack. **Currency:** NGN only. **Backend:** Firebase
Functions (`functions/`), with Firestore for orders and Cloud Storage for pack
files.

The API is served at `/api/**` through a Hosting rewrite, so it is same-origin
with the site — no CORS, and download links can be relative.

Flutterwave, Stripe and PayPal are visible in the checkout selector but
deliberately unavailable — clicking one explains why and offers Paystack.

---

## What I need from you

### Safe to share in chat

| Item | Looks like | Where I use it |
| --- | --- | --- |
| Paystack **public** key | `pk_live_…` / `pk_test_…` | `VITE_PAYSTACK_PUBLIC_KEY` in the frontend build |

The public key is public by design — it ships in the browser bundle on every
Paystack integration.

### NEVER share — you set these yourself

| Item | Looks like | How to set it |
| --- | --- | --- |
| Paystack **secret** key | `sk_live_…` | `firebase functions:secrets:set PAYSTACK_SECRET_KEY` |
| Download signing key | 32+ random bytes | `firebase functions:secrets:set DOWNLOAD_SIGNING_KEY` |
| Paystack **subaccount** (optional) | `ACCT_…` | `firebase functions:secrets:set PAYSTACK_SUBACCOUNT` |

Anyone with the secret key can charge cards, issue refunds and read your
customer data. It must never appear in chat, in git, or in any `VITE_*`
variable. If it is ever exposed, roll it in the Paystack dashboard immediately.

Generate the signing key with:

```bash
openssl rand -hex 32
```

### Things that must exist before launch

- [ ] **The pack files.** `functions/catalogue.js` lists six objects under
      `packs/`. They do not exist yet. A verified payment currently succeeds and
      then has nothing to serve.
- [ ] **Confirmed NGN prices.** Currently ₦45,000 / ₦60,000 / ₦120,000 — my
      placeholders, not your decision.
- [ ] **An open billing account** linked to the project (see Setup step 0).

---

## Security model

Three rules the code enforces. Do not work around them.

**1. The browser never sets a price.** `createOrder` sends a product slug, not
an amount. The Worker prices it from `functions/catalogue.js`. A client posting
`amount: 1` gets charged the catalogue price.

**2. Paystack's client-side `onSuccess` is not proof of payment.** Anyone can
fire it from a console. Access is granted only after the Worker calls
`api.paystack.co/transaction/verify` server-to-server, or a webhook arrives
whose HMAC-SHA512 signature matches.

**3. Verification checks amount and currency, not just status.** A real ₦45,000
payment must not unlock the ₦120,000 bundle.

Fulfilment is idempotent: the `UPDATE … WHERE status != 'paid'` means a replayed
verify call or a doubly-delivered webhook updates zero rows.

---

## Setup

### 0. Billing must actually be open

`firebase deploy --only functions` fails immediately if it is not:

```
Billing account for project '438344626822' is not open.
```

Upgrading to Blaze is not sufficient on its own — the billing account has to be
**linked to this project and in an open state**. Check it here:

https://console.cloud.google.com/billing/linkedaccount?project=scholar-zone

It should show an active billing account. If it shows none, or one that is
closed, link an open account before continuing. Nothing below works until this
is green.

### 1. Enable the services

```bash
firebase firestore:databases:create "(default)" --location=nam5 --project scholar-zone
```

Then enable Cloud Storage in the console (Build → Storage → Get started) and
note the default bucket name.

### 2. Set the secrets

```bash
firebase functions:secrets:set PAYSTACK_SECRET_KEY     # paste sk_live_… when prompted
firebase functions:secrets:set DOWNLOAD_SIGNING_KEY    # paste `openssl rand -hex 32`
firebase functions:secrets:set PAYSTACK_SUBACCOUNT     # ACCT_… (or a single space if unused)
```

These prompt without echoing, so values never enter your shell history. All
three must exist before deploy — `defineSecret` resolves them at deploy time.

`PAYSTACK_SUBACCOUNT` is optional in behaviour but required to exist. Set it to
a space if you are not routing to a subaccount yet.

### 3. Upload the pack files

Console → Storage → upload into a `packs/` folder, matching the paths in
`functions/catalogue.js`:

```
packs/remote-job-assessment-pack.pdf
packs/application-tracker.xlsx
packs/study-abroad-readiness-kit.pdf
packs/timeline-tracker.xlsx
packs/global-career-training-bundle.pdf
packs/all-trackers.zip
```

**Leave the bucket private** — the default rules already deny public reads.
Downloads are streamed through the function behind a signed token, so object
paths never reach the browser. Making the bucket public would hand every pack
away free to anyone who guesses a filename.

### 4. Deploy the function

```bash
firebase deploy --only functions
curl https://scholar-zone.web.app/api/health
# {"ok":true,"products":3,"gateway":"paystack","currency":"NGN","subaccountRouting":true,...}
```

### 5. Turn checkout on

Only now set the API base, because this is the switch that makes Paystack
selectable:

```bash
# .env.local
VITE_API_BASE_URL=/api
```

```bash
npm run build && firebase deploy --only hosting
```

### 6. Register the webhook

Paystack dashboard → Settings → API Keys & Webhooks → Webhook URL:

```
https://scholar-zone.web.app/api/webhooks/paystack
```

The webhook is the source of truth. It arrives even when the buyer closes the
tab before the browser's verify call runs — without it, those buyers pay and
receive nothing.

## Separating this project's money from your other app

You already have a Paystack business with another app using its keys. Two
Paystack features could separate Scholar Zone's revenue, and they solve
different problems.

### Subaccount — what we use

A [subaccount](https://paystack.com/docs/payments/multi-split-payments/) routes
settlement for a transaction to a different bank account, using the **same
Paystack business and the same keys**. You pass `subaccount: "ACCT_xxxx"` when
initialising a transaction; Paystack settles that payment to the subaccount's
bank account instead of your main one.

How the money divides:

- `percentage_charge` is set when you create the subaccount and is the share
  the **main** account keeps. Set it to `0` for 100% to the subaccount.
- `transaction_charge` overrides that with a flat fee to the main account.
- `bearer` decides who pays Paystack's fee. Default is the main account; pass
  `bearer: "subaccount"` to move it.

Create it in Dashboard → Settings → Subaccounts (or via the create subaccount
API), pointing at the bank account you want Scholar Zone money to land in. Then
set it on the Worker:

```bash
firebase functions:secrets:set PAYSTACK_SUBACCOUNT   # ACCT_xxxxxxxxxx
```

Leave it unset and everything settles to your main account as normal — the
integration works either way.

**Why this and not a second Paystack account:** a separate business account
means separate KYC, separate compliance and a separate dashboard to reconcile.
A subaccount gives you a separate settlement bank account and clean per-project
reporting without any of that.

### Dedicated Virtual Accounts — not the right fit here

A DVA gives a customer a permanent bank account number to transfer into. It
sounds like what you described, but it does not suit one-off pack sales:

- **Nigeria-only, and registered businesses only.** Requires CAC registration
  (or local equivalent) with **every** KYC document submitted and approved. A
  "starter business" account cannot use it.
- **Per customer, capped at 1,000 accounts.** You would burn that allowance on
  one-time buyers who never return.
- Requires collecting each customer's full name and phone number up front.

DVAs are built for recurring collections and wallet top-ups from customers you
have a continuing relationship with — not strangers buying a PDF once.

### You still get "customer transfers to an account"

Paystack Checkout already offers **bank transfer** as a payment channel. The
buyer picks it and Paystack shows a one-off account number to send money to,
which resolves automatically. Same experience, no DVA, no CAC gate.

The Worker enables it explicitly:

```ts
const PAYSTACK_CHANNELS = ["card", "bank_transfer", "ussd", "bank"];
```

Drop any channel from that array to hide it at checkout.

### Why the transaction is now initialised server-side

`subaccount` and `channels` can only be set on the
[Initialize Transaction](https://paystack.com/docs/payments/accept-payments/)
call, which requires the secret key — so it must happen on the Worker. The
Worker returns an `access_code`, and the browser calls
`new PaystackPop().resumeTransaction(accessCode)`.

This is also strictly safer than the old inline flow: the amount, currency,
channels and subaccount are all fixed before the browser is involved, and the
client holds nothing but an opaque code. If the inline modal is blocked, the
code falls back to Paystack's hosted checkout URL.

---

## Testing before going live

Use **test** keys first (`pk_test_` / `sk_test_`). Paystack's test card:

```
Card    4084 0840 8408 4081
CVV     408
Expiry  any future date
PIN     0000     OTP  123456
```

Then check:

- [ ] Order row appears in D1 with `status = 'paid'`
- [ ] Download links work, and stop working after 7 days
- [ ] Verifying the same reference twice does not double-fulfil
- [ ] A tampered create request (`amount: 1` in the body) still charges full price
- [ ] A webhook with a bad signature returns 401
- [ ] Refunding in Paystack and re-requesting a download returns 403

Inspect orders (Firestore console → `orders` collection, or):

https://console.firebase.google.com/project/scholar-zone/firestore/data/~2Forders

Look an order up by email there when a buyer loses their download links, then
re-run verify on the reference to reissue them.

Watch live logs: `firebase functions:log --only api`

---

## Known gaps

**No email delivery yet.** Download links appear on screen only. Paystack sends
its own payment receipt, but that does not contain your links. The success
screen says so plainly and tells buyers to save their links. Until email is
wired, a buyer who closes the tab must contact you — look their order up by
email in D1 and reissue.

**Links expire after 7 days.** Change `DOWNLOAD_TTL_SECONDS` in `functions/index.js` if you want longer.

---

## Changing prices

Prices live in **two** places and both must change together:

- `src/content/commerce.ts` — `priceNgn`, what the buyer sees (naira)
- `functions/catalogue.js` — `NGN`, what is actually charged (**kobo**)

The duplication is deliberate: the server must not trust a price that came from
the client bundle. If they disagree the server wins, and the buyer sees one
amount on the page and another at Paystack — so keep them in sync.

## Adding USD later

Paystack USD settlement is not on by default and must be approved per account.
Once it is live:

1. Add `"USD"` to the Paystack entry in `src/lib/payments.ts`
2. Add a `USD` amount to each entry in `functions/catalogue.js`
3. Allow `"USD"` in `priceFor` in `functions/catalogue.js`
