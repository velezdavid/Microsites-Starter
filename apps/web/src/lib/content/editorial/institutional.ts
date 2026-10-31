import type { EdForm, EditorialBlock } from "@microsites/ui/editorial";
import { blockText, shortDate, slugify, type EditorialContent } from "./content";
import type { RawEditorialPage } from "./queries";
import { newsletterBlock, type ListingPage } from "./shared";

/* ---------- Netlify Forms: fields stay in code (their names must not change between builds) ---------- */

const contact = (corporate = false): EdForm["fields"] => [
  { name: "nombre", label: "Nombre y apellido", type: "text", required: true, error: "Escribe tu nombre." },
  { name: "email", label: corporate ? "Correo corporativo" : "Correo electrónico", type: "email", required: true, placeholder: "nombre@empresa.com", error: "Escribe un correo válido." },
];

const FORM_FIELDS: Record<string, EdForm["fields"]> = {
  "envia-tu-informacion": [
    ...contact(),
    { name: "empresa", label: "Organización", type: "text", required: true, full: true, error: "Escribe tu organización." },
    { name: "tipo", label: "Tipo de información", type: "select", required: true, options: ["Noticia", "Nombramiento", "Reconocimiento", "Evento", "Otro"], full: true, error: "Elige un tipo." },
    { name: "mensaje", label: "Mensaje", type: "textarea", required: true, error: "Cuéntanos de qué se trata." },
    { name: "enlace", label: "Enlace (opcional)", type: "url", placeholder: "https://", full: true },
  ],
  "publica-resultados": [
    ...contact(true),
    { name: "organizador", label: "Organizador", type: "text", required: true, error: "Escribe el organizador." },
    { name: "galardon", label: "Galardón", type: "text", required: true, error: "Escribe el galardón." },
    { name: "edicion", label: "Edición o año", type: "text", required: true, error: "Escribe la edición." },
    { name: "fuente", label: "Enlace a los resultados oficiales", type: "url", required: true, placeholder: "https://", full: true, error: "Agrega el enlace oficial." },
    { name: "mensaje", label: "Comentarios", type: "textarea" },
  ],
  "corrige-una-ficha": [
    ...contact(true),
    { name: "empresa", label: "Organización (ficha)", type: "text", required: true, error: "Escribe la organización." },
    { name: "cargo", label: "Cargo", type: "text" },
    { name: "cambio", label: "Qué hay que corregir o agregar", type: "textarea", required: true, error: "Describe el cambio." },
  ],
};

const NEWSLETTER_SECTORS = [
  "Banca y seguros",
  "Consumo masivo",
  "Telecomunicaciones",
  "Energía y minería",
  "Salud",
  "Retail",
  "Industria",
  "Servicios",
  "Agroindustria y exportación",
  "Agencia de comunicación o publicidad",
  "Sector público",
  "ONG o academia",
  "Medios",
  "Otro",
];

const GROUP_LABEL = { institucional: "Institucional", participa: "Participa" } as const;
const pagePath = (p: RawEditorialPage) => (p.group === "participa" ? `participa/${p.slug}` : p.slug);

/** Institutional and "Participa" pages, each group with its side menu. */
export function editorialPages(c: EditorialContent, siteName: string): ListingPage[] {
  return c.pages.map((p) => {
    const group = c.pages.filter((x) => x.group === p.group);
    const form = p.form && FORM_FIELDS[p.form];
    const copy = p.formCopy ?? {};
    const doc: EditorialBlock = {
      _type: "edDocPage",
      menuTitle: GROUP_LABEL[p.group],
      menu: group.map((m) => ({ label: m.menuLabel, href: `/${pagePath(m)}`, current: m._id === p._id })),
      eyebrow: p.eyebrow ?? "",
      title: p.title,
      lead: p.lead ?? "",
      sections: (p.sections ?? []).map((s) => ({
        id: slugify(s.title),
        title: s.title,
        paragraphs: (s.body ?? []).filter((b) => b._type === "block").map(blockText).filter(Boolean),
        rows: s.rows?.length ? s.rows.map((r) => ({ label: r.key ?? "", value: r.value ?? "" })) : undefined,
      })),
      form: form
        ? {
            name: p.form!,
            fields: form,
            submit: copy.submit ?? "Enviar ↗",
            note: copy.note,
            success: { eyebrow: copy.successEyebrow ?? "Recibido", title: copy.successTitle ?? "Gracias.", text: copy.successText ?? "" },
          }
        : undefined,
      footnote: p.footnote?.text ? { text: p.footnote.text, link: p.footnote.link } : undefined,
      tocTitle: p.sections?.length ? "En esta página" : undefined,
    };
    return {
      path: pagePath(p),
      title: `${siteName} · ${p.seo?.title || p.menuLabel}`,
      description: p.seo?.description || p.lead,
      noIndex: p.seo?.noIndex === true,
      blocks: [
        { _type: "edBreadcrumb", items: [{ label: "Inicio", href: "/" }, { label: GROUP_LABEL[p.group] }, { label: p.menuLabel }] },
        doc,
        { ...newsletterBlock(c, p.newsletterText), spaceTop: 80 },
      ],
    };
  });
}

/** "/newsletter": subscription (Netlify Forms) and archive. */
export function newsletterPage(c: EditorialContent, siteName: string): ListingPage {
  const n = c.settings.newsletterPage ?? {};
  const latest = c.issues[0];
  const form: EdForm = {
    name: "newsletter-completo",
    fields: [
      { name: "email", label: "Correo electrónico", type: "email", required: true, placeholder: "nombre@empresa.com", full: true, error: "Escribe un correo válido." },
      { name: "nombre", label: "Nombre y apellido", type: "text", required: true, placeholder: "María Pérez", error: "Escribe tu nombre." },
      { name: "cargo", label: "Cargo", type: "text", required: true, placeholder: "Directora de Comunicación", error: "Escribe tu cargo." },
      { name: "empresa", label: "Empresa", type: "text", required: true, placeholder: "Nombre de la empresa", full: true, error: "Escribe tu empresa." },
      { name: "sector", label: "Sector", type: "select", required: true, placeholder: "Selecciona un sector", options: NEWSLETTER_SECTORS, full: true, error: "Elige un sector." },
    ],
    checkbox: { name: "alertas", label: "Avisarme también cuando se publique un ranking o los ganadores de un galardón.", checked: true },
    submit: "Suscribirme ↗",
    note: n.formNote,
    success: { eyebrow: n.successEyebrow ?? "", title: n.successTitle ?? "", text: n.successText ?? "" },
  };

  const blocks: EditorialBlock[] = [
    {
      _type: "edNewsletterHero",
      eyebrow: n.eyebrow ?? "",
      title: n.title?.length ? n.title : ["Newsletter."],
      text: n.text ?? "",
      totals: [...(latest ? [{ value: String(latest.number), label: "ediciones publicadas" }] : []), ...(n.totals ?? [])],
      formTitle: n.formTitle ?? "",
      form,
    },
  ];
  if (n.benefits?.length) {
    blocks.push({
      _type: "edColumns",
      spaceTop: 80,
      columns: [
        {
          blocks: [
            { _type: "edHeading", eyebrow: n.benefitsEyebrow ?? "", title: n.benefitsTitle ?? "", size: "lg" },
            { _type: "edNumberedColumns", variant: "big", items: n.benefits.map((b) => ({ title: b.title, text: b.text ?? "" })) },
          ],
        },
      ],
    });
  }
  if (c.issues.length) {
    blocks.push({
      _type: "edArchive",
      eyebrow: "Archivo",
      title: "Ediciones anteriores",
      searchPlaceholder: "Buscar en el archivo",
      items: c.issues.map((i) => ({ number: String(i.number), date: shortDate(i.date), title: i.title, href: i.url })),
      empty: "Ninguna edición coincide.",
      more: { label: `Ver las ${latest.number} ediciones`, href: "/newsletter" },
    });
  }
  return { path: "newsletter", title: `${siteName} · ${n.title?.join(" ").replace(/\.$/, "") || "Newsletter"}`, blocks, section: "/newsletter", flushFooter: true };
}
