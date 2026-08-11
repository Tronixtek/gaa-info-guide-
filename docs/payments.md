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
