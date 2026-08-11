# Payments — Paystack setup runbook

**Live gateway:** Paystack. **Currency:** NGN only. **Backend:** Cloudflare
Worker (`worker/`), with D1 for orders and R2 for pack files.

Flutterwave, Stripe and PayPal are visible in the checkout selector but
deliberately unavailable — clicking one explains why and offers Paystack.

---

## What I need from you

### Safe to share in chat

| Item | Looks like | Where I use it |
| --- | --- | --- |
| Paystack **public** key | `pk_live_…` / `pk_test_…` | `VITE_PAYSTACK_PUBLIC_KEY` in the frontend build |
| Your Cloudflare **subdomain** | `yourname.workers.dev` | `VITE_API_BASE_URL` |

The public key is public by design — it ships in the browser bundle on every
Paystack integration.

### NEVER share — you set these yourself

| Item | Looks like | How to set it |
| --- | --- | --- |
| Paystack **secret** key | `sk_live_…` | `wrangler secret put PAYSTACK_SECRET_KEY` |
| Download signing key | 32+ random bytes | `wrangler secret put DOWNLOAD_SIGNING_KEY` |
| Paystack **subaccount** (optional) | `ACCT_…` | `wrangler secret put PAYSTACK_SUBACCOUNT` |

Anyone with the secret key can charge cards, issue refunds and read your
customer data. It must never appear in chat, in git, or in any `VITE_*`
variable. If it is ever exposed, roll it in the Paystack dashboard immediately.

Generate the signing key with:

```bash
openssl rand -hex 32
```

### Things that must exist before launch

- [ ] **The pack files.** `worker/src/catalogue.ts` lists six objects under
      `packs/`. They do not exist yet. A verified payment currently succeeds and
      then has nothing to serve.
- [ ] **Confirmed NGN prices.** Currently ₦45,000 / ₦60,000 / ₦120,000 — my
      placeholders, not your decision.
- [ ] **A Cloudflare account.** Free tier is enough; no card required.

---

## Security model

Three rules the code enforces. Do not work around them.

**1. The browser never sets a price.** `createOrder` sends a product slug, not
an amount. The Worker prices it from `worker/src/catalogue.ts`. A client posting
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

### 1. Install and log in

```bash
cd worker
npm install
npx wrangler login
```

### 2. Create the database

```bash
npx wrangler d1 create scholar-zone-orders
```

Paste the returned `database_id` into `wrangler.toml`, then create the table:

```bash
npm run db:init
```

### 3. Create the bucket

```bash
npx wrangler r2 bucket create scholar-zone-packs
```

**Keep it private.** Downloads are streamed through the Worker behind a signed
token — object keys never reach the browser. A public bucket would make every
pack free to anyone who guesses a filename.

Upload the packs:

```bash
npx wrangler r2 object put scholar-zone-packs/packs/remote-job-assessment-pack.pdf --file=./remote-job-assessment-pack.pdf
# …repeat for the other five, matching the paths in src/catalogue.ts
```

### 4. Set the secrets

```bash
npx wrangler secret put PAYSTACK_SECRET_KEY     # paste sk_live_… when prompted
npx wrangler secret put DOWNLOAD_SIGNING_KEY    # paste `openssl rand -hex 32`
```

`wrangler secret put` prompts interactively and does not echo — the value never
touches your shell history.

### 5. Deploy the Worker

```bash
npm run deploy
```

Note the URL it prints, e.g. `https://scholar-zone-api.yourname.workers.dev`.
Check it is alive:

```bash
curl https://scholar-zone-api.yourname.workers.dev/api/health
# {"ok":true,"products":3,"gateway":"paystack","currency":"NGN"}
```

### 6. Point the frontend at it

```bash
cd ..
cp .env.example .env.local
```

Set both values, then rebuild and deploy:

```bash
npm run build
firebase deploy --only hosting
```

### 7. Register the webhook

Paystack dashboard → Settings → API Keys & Webhooks → Webhook URL:

```
https://scholar-zone-api.yourname.workers.dev/api/webhooks/paystack
```

The webhook is the source of truth. It arrives even when the buyer closes the
tab before the browser's verify call runs — without it, those buyers pay and
receive nothing.

---

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
cd worker
npx wrangler secret put PAYSTACK_SUBACCOUNT   # ACCT_xxxxxxxxxx
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

Inspect orders:

```bash
npx wrangler d1 execute scholar-zone-orders --remote \
  --command="SELECT reference, email, amount, status, created_at FROM orders ORDER BY created_at DESC LIMIT 20"
```

Watch live logs: `npm run tail`

---

## Known gaps

**No email delivery yet.** Download links appear on screen only. Paystack sends
its own payment receipt, but that does not contain your links. The success
screen says so plainly and tells buyers to save their links. Until email is
wired, a buyer who closes the tab must contact you — look their order up by
email in D1 and reissue.

**Links expire after 7 days.** Change `DOWNLOAD_TTL_SECONDS` in
`worker/src/index.ts` if you want longer.

---

## Changing prices

Prices live in **two** places and both must change together:

- `src/content/commerce.ts` — `priceNgn`, what the buyer sees (naira)
- `worker/src/catalogue.ts` — `NGN`, what is actually charged (**kobo**)

The duplication is deliberate: the server must not trust a price that came from
the client bundle. If they disagree the server wins, and the buyer sees one
amount on the page and another at Paystack — so keep them in sync.

## Adding USD later

Paystack USD settlement is not on by default and must be approved per account.
Once it is live:

1. Add `"USD"` to the Paystack entry in `src/lib/payments.ts`
2. Add a `USD` amount to each entry in `worker/src/catalogue.ts`
3. Allow `"USD"` in `SUPPORTED_CURRENCIES` and `priceFor`
