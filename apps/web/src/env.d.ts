/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly SANITY_API_READ_TOKEN?: string;
  readonly SITE_SLUG: string;
  /** Google Tag Manager container id (GTM-XXXX). Leave empty to disable. */
  readonly PUBLIC_GTM_ID?: string;
  /** GA4 measurement id (G-XXXX). Used only when no GTM id is set. Leave empty to disable. */
  readonly PUBLIC_GA4_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
