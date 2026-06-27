/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_NAME?: string;
  readonly VITE_SITE_TAGLINE?: string;
  readonly VITE_SITE_EMAIL?: string;
  readonly VITE_SITE_PHONE?: string;
  readonly VITE_SITE_LOCATION?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_WHATSAPP_URL?: string;
  readonly VITE_CONTACT_ENDPOINT?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ANALYTICS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
