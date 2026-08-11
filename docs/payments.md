# Payments — Paystack Storefront

**How buying works:** Paystack hosts the product page, takes the payment and
delivers the file. Scholar Zone links to it. That is the whole integration.

## Why there is no backend

An earlier version of this repo had one: Firebase Functions (later a Cloudflare
Worker) to create orders, verify payments server-side, receive webhooks and
issue signed download links. All of that existed for one reason — we were
taking the payment ourselves, so we had to prove it happened before releasing a
file.

Paystack Storefront does that part. Once payment and delivery both happen on
Paystack, there is nothing left for a backend to do: no orders to record, no
transaction to verify, no webhook to receive, no signed URLs to mint. Running a
backend to sell three PDFs would be infrastructure with no job.

Consequences worth knowing:

- No Firebase Blaze plan, no billing account, no Firestore, no Cloud Storage.
- No Paystack secret key anywhere in this project. Not even the public key —
  the site never calls Paystack's API.
- Nothing to keep patched, and no way for a bug on our side to take someone's
  money and fail to deliver.

The removed backend is in git history if it is ever needed again.

## Setup

### 1. Create the product on Paystack

Dashboard → **Commerce → Products → Create Product**. For each pack:

- Name and description
- Price in **NGN**
- Upload the file as a **digital product** so Paystack delivers it after payment

### 2. Copy the product link

Each product has a share link, something like
`https://paystack.shop/<your-store>/<product>`.

### 3. Paste it into the catalogue

`src/content/commerce.ts` — set `paystackUrl` on the matching product:

```ts
{
  slug: "study-abroad-readiness-kit",
  paystackUrl: "https://paystack.shop/scholar-zone/study-abroad-readiness-kit",
  …
}
```

An empty string means "not on sale yet": the product page shows a waitlist
prompt instead of a button that goes nowhere.

### 4. Ship

```bash
npm run build
firebase deploy --only hosting
```

## How the customer receives the material

Paystack does the whole delivery. Two paths, both automatic, which between them
cover the usual failure modes:

1. **Instant redirect.** After a successful payment the buyer lands on a
   download page and can take the files immediately.
2. **Automated email.** Paystack also emails a link to that same download page,
   so a buyer who closes the tab has not lost the purchase.

Limits: **10 files per product, up to 5 GB per file.**

Two things follow for this catalogue:

- The Global Career Training Bundle does not need a ZIP. Upload the trackers as
  separate files on the product — nicer for the buyer than one archive.
- Nothing needs to be reissued by hand. When a buyer says they lost the file,
  point them at the Paystack email or resend from the dashboard.

## Routing this project's money separately

You have another app on the same Paystack business. Two options:

**Storefront settlement account** — a Storefront can settle to a chosen bank
account, which is the simplest separation and needs no code.

**Subaccount** — create one under Settings → Subaccounts pointing at a
different bank account. `percentage_charge` is the share the **main** account
keeps, so set it to `0` for everything to reach Scholar Zone.

A separate Paystack business account would also work but means separate KYC,
compliance and a second dashboard to reconcile.

## Prices

Set in **two** places, which must agree:

- Paystack product (what is actually charged)
- `priceNgn` / `priceUsd` in `src/content/commerce.ts` (what the site displays)

Paystack is the one that takes the money, so if they disagree the buyer sees
one number on the site and another at checkout. `priceUsd` is display-only —
Storefront charges in NGN.

## Still outstanding

- [ ] **The pack files.** Nothing can be sold until they exist. Every
      `paystackUrl` is empty and every product page correctly says so.
- [ ] **Confirmed NGN prices.** ₦45,000 / ₦60,000 / ₦120,000 are placeholders.

## When a backend would be worth it again

- Checkout without leaving the site
- Purchases tied to user accounts, unlocking content on return visits
- Subscriptions, seat licensing, or per-institution access
- Bundling rules Paystack products cannot express

None of these apply today. Revisit when one does.
