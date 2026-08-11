/// <reference types="vite/client" />

/**
 * Publishable payment keys only. Every VITE_ variable is inlined into the
 * browser bundle at build time and is publicly readable — secret keys belong
 * in Firebase secrets, read by functions/index.js.
 */
interface ImportMetaEnv {
  readonly VITE_PAYSTACK_PUBLIC_KEY?: string;
  readonly VITE_FLUTTERWAVE_PUBLIC_KEY?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_PAYPAL_CLIENT_ID?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
