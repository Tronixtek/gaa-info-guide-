import { ArrowUpRight, Check, Clock, Info, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../content/types";
import { formatPrice } from "../lib/format";

/**
 * Buying happens on Paystack, not here.
 *
 * Paystack Storefront hosts the product page, takes the payment and delivers
 * the file automatically. That removes the entire reason we would otherwise
 * need a backend: no order records to keep, no payment to verify server-side,
 * no signed download links to issue, no webhook to receive. Adding one to sell
 * three PDFs would be infrastructure with nothing to do.
 *
 * If the product has no link yet, this says so plainly rather than rendering a
 * button that goes nowhere.
 */
export function BuyPanel({ product }: { product: Product }) {
  const live = Boolean(product.paystackUrl);

  return (
    <div className="buy-panel">
      <div className="buy-price">
        <strong>{formatPrice(product.priceNgn, "NGN")}</strong>
        <span>≈ {formatPrice(product.priceUsd, "USD")} · one-time</span>
      </div>

      {live ? (
        <>
          <a
            className="button button-primary buy-cta"
            href={product.paystackUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy on Paystack <ArrowUpRight size={18} aria-hidden="true" />
          </a>

          <ul className="buy-points">
            <li>
              <Check size={15} aria-hidden="true" /> Card, bank transfer, USSD
            </li>
            <li>
              <Check size={15} aria-hidden="true" /> Download sent right after payment
            </li>
            <li>
              <Check size={15} aria-hidden="true" /> Lifetime access, including updates
            </li>
          </ul>

          <p className="buy-trust">
            <ShieldCheck size={15} aria-hidden="true" />
            <span>
              Payment is handled entirely by Paystack. Your card details never touch Scholar Zone.
            </span>
          </p>
        </>
      ) : (
        <>
          <p className="buy-pending">
            <Clock size={17} aria-hidden="true" />
            <span>
              <strong>Not on sale yet.</strong> This pack is still being finished. Join the waitlist
              and we will email you the moment it goes live.
            </span>
          </p>
          <Link className="button button-secondary buy-cta" to="/contact">
            Join the waitlist
          </Link>
        </>
      )}

      <p className="buy-refund">
        <Info size={14} aria-hidden="true" />
        <span>
          Not what you expected? Email us within 14 days for a full refund — see the{" "}
          <Link to="/terms">terms</Link>.
        </span>
      </p>
    </div>
  );
}
