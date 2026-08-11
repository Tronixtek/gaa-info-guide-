export type Currency = "USD" | "NGN";

export const formatPrice = (amount: number, currency: Currency) =>
  new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
