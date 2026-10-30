/**
 * Preview site of each microsite (a second Netlify site of the same repo with SANITY_PREVIEW_SITE=true).
 * Each entry adds a "Vista previa" tool (Sanity Presentation) to the deployed Studio.
 * Guide: docs/nuevo-micrositio.md.
 */
export const previewSites: { slug: string; title: string; url: string }[] = [
  { slug: "mediaudience", title: "Mediaudience", url: "https://mediaudience-preview.netlify.app" },
];
