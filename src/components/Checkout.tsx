import { AlertTriangle, ArrowRight, Check, Download, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  FLUTTERWAVE_PUBLIC_KEY,
  PAYPAL_CLIENT_ID,
  PAYSTACK_PUBLIC_KEY,
  SCRIPTS,
  checkoutEnabled,
  createOrder,
  formatPrice,
  gatewaysForCurrency,
  loadScript,
  verifyOrder,
  type Currency,
  type GatewayId,
  type VerifyResponse
} from "../lib/payments";
import type { Product } from "../content/types";

// Gateway SDKs attach themselves to window; these are the surfaces we touch.
declare global {
  interface Window {
    PaystackPop?: { newTransaction: (options: Record<string, unknown>) => void };
    FlutterwaveCheckout?: (options: Record<string, unknown>) => void;
    paypal?: {
      Buttons: (options: Record<string, unknown>) => {
        render: (target: HTMLElement) => Promise<void>;
      };
    };
  }
}

type Stage = "form" | "paying" | "verifying" | "done" | "error";

export function Checkout({ product }: { product: Product }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [gateway, setGateway] = useState<GatewayId | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);

  const available = gatewaysForCurrency(currency);
  const amount = currency === "NGN" ? product.priceNgn : product.priceUsd;

  // Reset the chosen gateway when it is not offered in the new currency.
  useEffect(() => {
    if (gateway && !available.some((entry) => entry.id === gateway)) setGateway(null);
  }, [currency, gateway, available]);

  if (!checkoutEnabled()) {
    return (
      <div className="checkout-panel">
        <h2>Checkout is not live yet</h2>
        <p className="checkout-disabled">
          <AlertTriangle size={18} aria-hidden="true" />
          <span>
            No payment gateway is configured for this deployment, so nothing here can take a payment.
            Rather than show a checkout that cannot complete, we have disabled it. Join the waitlist and
            you will be first to know when it opens.
          </span>
        </p>
        <a className="button button-primary" href="/contact">
          Join the waitlist <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    );
  }

  const fail = (error: unknown) => {
    setStage("error");
    setMessage(error instanceof Error ? error.message : "Something went wrong. No payment was taken.");
  };

  /** Server-side verification is the only thing that grants access. */
  const confirm = async (reference: string, chosen: GatewayId) => {
    setStage("verifying");
    try {
      const verified = await verifyOrder({ reference, gateway: chosen });
      if (verified.status === "paid") {
        setResult(verified);
        setStage("done");
      } else {
        setStage("error");
        setMessage(
          verified.message ??
            "We could not confirm this payment. If money left your account, email us with the reference and we will sort it out."
        );
      }
    } catch (error) {
      fail(error);
    }
  };

  const start = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!gateway) return;

    setStage("paying");
    setMessage("");

    try {
      // The server prices the product and issues the reference. We deliberately
      // do not send an amount — see the note in lib/payments.ts.
      const order = await createOrder({ productSlug: product.slug, gateway, currency, email, name });

      if (gateway === "paystack") {
        await loadScript(SCRIPTS.paystack);
        window.PaystackPop?.newTransaction({
          key: PAYSTACK_PUBLIC_KEY,
          email,
          amount: order.amount,
          currency: order.currency,
          reference: order.reference,
          onSuccess: () => void confirm(order.reference, "paystack"),
          onCancel: () => {
            setStage("form");
            setMessage("Payment cancelled. Nothing was charged.");
          }
        });
        return;
      }

      if (gateway === "flutterwave") {
        await loadScript(SCRIPTS.flutterwave);
        window.FlutterwaveCheckout?.({
          public_key: FLUTTERWAVE_PUBLIC_KEY,
          tx_ref: order.reference,
          amount: order.amount / 100,
          currency: order.currency,
          customer: { email, name },
          customizations: { title: "Scholar Zone", description: product.title },
          callback: () => void confirm(order.reference, "flutterwave"),
          onclose: () => {
            setStage((current) => (current === "paying" ? "form" : current));
          }
        });
        return;
      }

      if (gateway === "stripe") {
        // Stripe Checkout Sessions must be created server-side; we only follow
        // the URL the server hands back.
        if (!order.redirectUrl) throw new Error("Stripe session was not created.");
        window.location.href = order.redirectUrl;
        return;
      }

      if (gateway === "paypal") {
        await loadScript(SCRIPTS.paypal(PAYPAL_CLIENT_ID, currency));
        if (!paypalRef.current || !window.paypal) throw new Error("PayPal could not load.");
        paypalRef.current.innerHTML = "";
        await window.paypal
          .Buttons({
            createOrder: () => order.providerOrderId,
            onApprove: () => confirm(order.reference, "paypal"),
            onError: fail
          })
          .render(paypalRef.current);
      }
    } catch (error) {
      fail(error);
    }
  };

  if (stage === "done" && result) {
    return (
      <div className="checkout-panel checkout-done">
        <span className="checkout-tick" aria-hidden="true">
          <Check size={26} />
        </span>
        <h2>Payment confirmed</h2>
        <p>
          Verified against the payment provider and receipted to <strong>{email}</strong>. Your
          reference is <code>{result.reference}</code> — keep it for any support request.
        </p>
        {result.downloads && result.downloads.length > 0 && (
          <ul className="download-list">
            {result.downloads.map((file) => (
              <li key={file.url}>
                <a className="button button-secondary" href={file.url}>
                  <Download size={16} aria-hidden="true" /> {file.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className="footnote">
          Download links are time-limited. The same links are in your email receipt, so you can come
          back to them later.
        </p>
      </div>
    );
  }

  return (
    <form className="checkout-panel" onSubmit={start}>
      <h2>Buy {product.title}</h2>

      <div className="checkout-price">
        <strong>{formatPrice(amount, currency)}</strong>
        <span>one-time · lifetime access</span>
      </div>

      <fieldset className="checkout-field">
        <legend>Currency</legend>
        <div className="segmented">
          {(["USD", "NGN"] as Currency[]).map((code) => (
            <button
              key={code}
              type="button"
              className={currency === code ? "segment is-active" : "segment"}
              aria-pressed={currency === code}
              onClick={() => setCurrency(code)}
            >
              {code === "USD" ? "USD $" : "NGN ₦"}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="checkout-field">
        <legend>Pay with</legend>
        <div className="gateway-grid">
          {available.map((entry) => (
            <label key={entry.id} className={gateway === entry.id ? "gateway is-selected" : "gateway"}>
              <input
                type="radio"
                name="gateway"
                value={entry.id}
                checked={gateway === entry.id}
                onChange={() => setGateway(entry.id)}
                required
              />
              <span className="gateway-name">{entry.name}</span>
              <span className="gateway-blurb">{entry.blurb}</span>
              <span className="gateway-methods">{entry.methods.join(" · ")}</span>
            </label>
          ))}
        </div>
        {available.length === 0 && (
          <p className="footnote">No gateway is available for {currency} on this deployment.</p>
        )}
      </fieldset>

      <div className="field">
        <label htmlFor="checkout-email">Email for the receipt and downloads</label>
        <input
          id="checkout-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="checkout-name">Name</label>
        <input
          id="checkout-name"
          required
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      {gateway === "paypal" && <div ref={paypalRef} className="paypal-target" />}

      {gateway !== "paypal" && (
        <button
          type="submit"
          className="button button-primary"
          disabled={stage === "paying" || stage === "verifying" || !gateway}
        >
          {stage === "paying" || stage === "verifying" ? (
            <>
              <Loader2 size={18} aria-hidden="true" className="spin" />
              {stage === "verifying" ? "Confirming payment…" : "Opening checkout…"}
            </>
          ) : (
            <>
              Pay {formatPrice(amount, currency)} <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
      )}

      {message && (
        <p className={stage === "error" ? "checkout-error" : "footnote"} role="status">
          {message}
        </p>
      )}

      <p className="checkout-trust">
        <ShieldCheck size={16} aria-hidden="true" />
        <span>
          Card details go straight to the payment provider and never touch our servers. Every payment is
          verified with the provider before any download is released.
        </span>
      </p>
    </form>
  );
}
