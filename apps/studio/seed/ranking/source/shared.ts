import type { EdNewsletterBlock } from "./types";

/** Newsletter band shown before the footer of every page. */
export const newsletterBlock = (text: string): EdNewsletterBlock => ({
  _type: "edNewsletter",
  eyebrow: "Ranking Newsletter",
  title: "Ranking Newsletter.",
  text,
  cta: "Suscribirme",
  consent: "Acepto la política de tratamiento de datos.",
  placeholder: "nombre@empresa.com",
  formName: "newsletter",
  success: "Listo. Revisa tu correo para confirmar.",
});
