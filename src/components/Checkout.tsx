import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  FLUTTERWAVE_PUBLIC_KEY,
  PAYPAL_CLIENT_ID,
  PAYSTACK_PUBLIC_KEY,
  SCRIPTS,
  availabilityOf,
  createOrder,
  formatPrice,
  gateways,
  loadScript,
  verifyOrder,
  workingGateways,
  type Currency,
  type Gateway,
  type GatewayId,
  type UnavailableReason,
  type VerifyResponse
} from "../lib/payments";
import type { Product } from "../content/types";
import { GatewayLogo } from "./GatewayLogo";

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

interface Blocked {
  gateway: Gateway;
  reason: UnavailableReason;
}

export function Checkout({ product }: { product: Product }) {
  // NGN is the default: Paystack is the live gateway and settles in naira.
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [gateway, setGateway] = useState<GatewayId | null>(null);
  const [blocked, setBlocked] = useState<Blocked | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);
  const blockedRef = useRef<HTMLDivElement>(null);

  const amount = currency === "NGN" ? product.priceNgn : product.priceUsd;

  // Switching currency can invalidate an already-chosen gateway.
  useEffect(() => {
    if (!gateway) return;
    const chosen = gateways.find((entry) => entry.id === gateway);
    if (chosen && !availabilityOf(chosen, currency).available) setGateway(null);
  }, [currency, gateway]);

  // Send focus to the notice so it is announced rather than silently swapped in.
  useEffect(() => {
    if (blocked) blockedRef.current?.focus();
  }, [blocked]);

  const choose = (entry: Gateway) => {
    const { available, reason } = availabilityOf(entry, currency);
    if (!available && reason) {
      setBlocked({ gateway: entry, reason });
      setGateway(null);
      return;
    }
    setBlocked(null);
    setGateway(entry.id);
  };

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
          onclose: () => setStage((current) => (current === "paying" ? "form" : current))
        });
        return;
      }

      if (gateway === "stripe") {
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

  /* ------------------------------------------------ gateway unavailable view */

  if (blocked) {
    const alternatives = workingGateways(currency);
    const otherCurrency: Currency = currency === "USD" ? "NGN" : "USD";
    const worksInOther =
      blocked.reason === "wrong-currency" && availabilityOf(blocked.gateway, otherCurrency).available;

    return (
      <div className="checkout-panel checkout-blocked" tabIndex={-1} ref={blockedRef} role="status">
        <span className="blocked-logo">
          <GatewayLogo id={blocked.gateway.id} size={54} />
        </span>

        <h2>{blocked.gateway.name} is currently unavailable</h2>

        {blocked.reason === "not-configured" ? (
          <p>
            We have not finished setting up {blocked.gateway.name} on Scholar Zone yet, so it cannot
            take a payment right now. Nothing has been charged. Please choose a different gateway
            below.
          </p>
        ) : (
          <p>
            {blocked.gateway.name} does not support <strong>{currency}</strong> payments here. It
            accepts {blocked.gateway.currencies.join(" and ")}. Nothing has been charged.
          </p>
        )}

        {worksInOther && (
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              setCurrency(otherCurrency);
              setBlocked(null);
              setGateway(blocked.gateway.id);
            }}
          >
            Switch to {otherCurrency} and use {blocked.gateway.name}{" "}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        )}

        {alternatives.length > 0 ? (
          <div className="blocked-alternatives">
            <h3>Try a different gateway</h3>
            <div className="gateway-grid">
              {alternatives.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className="gateway gateway-button"
                  onClick={() => {
                    setBlocked(null);
                    setGateway(entry.id);
                  }}
                >
                  <GatewayLogo id={entry.id} />
                  <span className="gateway-text">
                    <span className="gateway-name">{entry.name}</span>
                    <span className="gateway-methods">{entry.methods.join(" · ")}</span>
                  </span>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="checkout-disabled">
            <AlertTriangle size={18} aria-hidden="true" />
            <span>
              No payment gateway is available yet on this deployment. Join the waitlist and we will
              email you the moment checkout opens.
            </span>
          </p>
        )}

        <button type="button" className="link-button" onClick={() => setBlocked(null)}>
          <ArrowLeft size={14} aria-hidden="true" /> Back to checkout
        </button>
      </div>
    );
  }

  /* -------------------------------------------------------------- paid view */

  if (stage === "done" && result) {
    return (
      <div className="checkout-panel checkout-done">
        <span className="checkout-tick" aria-hidden="true">
          <Check size={26} />
        </span>
        <h2>Payment confirmed</h2>
        <p>
          Verified with Paystack. Your
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
        <p className="checkout-save-warning">
          <AlertTriangle size={16} aria-hidden="true" />
          <span>
            <strong>Save these links now.</strong> They work for 7 days, but we do not email them
            yet — Paystack's receipt confirms your payment but does not include your downloads. If
            you lose them, email us your reference and we will reissue them.
          </span>
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------ checkout form */

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
          {gateways.map((entry) => {
            const { available } = availabilityOf(entry, currency);
            const selected = gateway === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                className={[
                  "gateway",
                  "gateway-button",
                  selected ? "is-selected" : "",
                  available ? "" : "is-unavailable"
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-pressed={selected}
                onClick={() => choose(entry)}
              >
                <GatewayLogo id={entry.id} />
                <span className="gateway-text">
                  <span className="gateway-name">{entry.name}</span>
                  <span className="gateway-methods">{entry.methods.join(" · ")}</span>
                </span>
                {selected && <Check size={18} aria-hidden="true" className="gateway-check" />}
              </button>
            );
          })}
        </div>
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

      {!gateway && <p className="footnote">Choose a payment method to continue.</p>}

      {message && (
        <p className={stage === "error" ? "checkout-error" : "footnote"} role="status">
          {message}
        </p>
      )}

      <p className="checkout-trust">
        <ShieldCheck size={16} aria-hidden="true" />
        <span>
          Card details go straight to the payment provider and never touch our servers. Every payment
          is verified with the provider before any download is released.
        </span>
      </p>
    </form>
  );
}
