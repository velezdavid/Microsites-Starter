/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly SANITY_API_READ_TOKEN?: string;
  readonly SITE_SLUG: string;
  /** "editorial" renders the news/registry template; empty = landing template. */
  readonly SITE_TEMPLATE?: string;
  /** "true": content from apps/web/src/sites/<slug> instead of Sanity (static port stage). */
  readonly SITE_LOCAL_DATA?: string;
  /** "true" enables visual editing (Sanity Presentation) in `astro dev` only. */
  readonly SANITY_VISUAL_EDITING?: string;
  /** "true" only on the preview site: server-rendered, drafts for sessions opened from the Studio. */
  readonly SANITY_PREVIEW_SITE?: string;
  /** Studio that click-to-edit overlays open (default http://localhost:3333). */
  readonly SANITY_STUDIO_URL?: string;
  /** Google Tag Manager container id (GTM-XXXX). Leave empty to disable. */
  readonly PUBLIC_GTM_ID?: string;
  /** GA4 measurement id (G-XXXX). Used only when no GTM id is set. Leave empty to disable. */
  readonly PUBLIC_GA4_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
