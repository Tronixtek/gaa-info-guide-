-- Scholar Zone checkout — D1 schema.
-- Apply with: wrangler d1 execute scholar-zone-orders --file=./schema.sql --remote

CREATE TABLE IF NOT EXISTS orders (
  -- Server-generated. The client never invents a reference.
  reference      TEXT PRIMARY KEY,
  product_slug   TEXT NOT NULL,
  title          TEXT NOT NULL,
  -- Minor units (kobo). Compared against what Paystack reports before any
  -- order is fulfilled.
  amount         INTEGER NOT NULL,
  currency       TEXT NOT NULL,
  gateway        TEXT NOT NULL,
  email          TEXT NOT NULL,
  name           TEXT,
  -- pending | paid | failed
  status         TEXT NOT NULL DEFAULT 'pending',
  failure_reason TEXT,
  -- Paystack's own transaction id, kept for reconciliation and support.
  provider_ref   TEXT,
  created_at     TEXT NOT NULL,
  paid_at        TEXT
);

-- Support lookups: "customer says they paid, find their order".
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders (email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at);
