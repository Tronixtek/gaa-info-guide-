/// <reference types="vite/client" />

/**
 * No payment keys here — buying happens on Paystack's hosted product pages,
 * so the site never touches a Paystack key, public or otherwise.
 */
interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
