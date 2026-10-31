/**
 * Events sample data of ranking.ec (agenda and galas), from the prototypes.
 * Fictitious: replaced by the editors' records in Sanity (stage 3).
 */
import { slugify } from "./registry";

export type EventType = "gala" | "foro" | "taller" | "encuentro";

export interface EventRecord {
  slug: string;
  /** ISO date and local time (America/Guayaquil). */
  date: string;
  time?: string;
  type: EventType;
  name: string;
  /** Short name for the month calendar. */
  short: string;
  organizer: string;
  city: string;
  venue: string;
  /** Gala page details. */
  featured?: { title: string[]; highlight: string; dek: string; summary: string };
  access?: string;
  award?: { slug: string; year: number };
  delivers?: { text: string; items: { value: string; label: string }[] };
  program?: { time: string; title: string; detail?: string }[];
  follow?: { title: string; text: string }[];
  venueInfo?: { name: string; address: string[]; note: string; map: string };
  previous?: { year: number; detail: string; href?: string }[];
}

export const EVENT_TYPE_LABEL: Record<EventType, string> = { gala: "Gala de premiación", foro: "Foro", taller: "Taller", encuentro: "Encuentro" };
export const EVENT_TYPE_FILTER: Record<EventType, string> = { gala: "Galas de premiación", foro: "Foros y congresos", taller: "Talleres", encuentro: "Encuentros" };

const BASE: [string, EventType, string, string, string, string, string][] = [
  ["2026-11-05", "foro", "Foro de Reputación Corporativa 2026", "Foro de Reputación", "Asociación de Comunicadores", "Quito", "Hotel Quito"],
  ["2026-11-12", "gala", "Great Place to Work · Reconocimiento 2026", "GPTW 2026", "Great Place to Work Ecuador", "Quito", "Swissôtel"],
  ["2026-11-18", "taller", "Taller: comunicar resultados ESG", "Taller ESG", "Cámara de Industrias", "Guayaquil", "Cámara de Industrias"],
  ["2026-11-19", "gala", "Premios a la Innovación Corporativa", "Innovación Corp.", "Cámara de Industrias", "Guayaquil", "Centro de Convenciones"],
  ["2026-11-26", "foro", "Congreso de Sostenibilidad Empresarial", "Congreso Sostenib.", "Consejo Empresarial", "Cuenca", "Centro Cultural"],
  ["2026-12-02", "gala", "Gala Merco Empresas 2026", "Gala Merco", "Merco", "Guayaquil", "Hilton Colón"],
  ["2026-12-09", "gala", "Excelencia Exportadora 2026", "Excel. Exportadora", "Cámara de Comercio Exterior", "Guayaquil", "Centro de Convenciones"],
  ["2026-12-10", "encuentro", "Desayuno DirCom: balance del año", "Desayuno DirCom", "ranking.ec", "Quito", "Club Pichincha"],
  ["2027-01-14", "foro", "Foro de Perspectivas Económicas 2027", "Perspectivas 2027", "Cámara de Comercio", "Quito", "Centro de Eventos"],
  ["2027-01-22", "gala", "Premios Verdes · Entrega regional", "Premios Verdes", "Banco de Fomento Verde", "Cuenca", "Teatro Sucre"],
  ["2027-01-28", "taller", "Taller: postular a un galardón", "Taller postulación", "ranking.ec", "Guayaquil", "Espacio Cowork Puerto"],
];

const DETAILS: Record<string, Partial<EventRecord>> = {
  "gala-merco-empresas-2026": {
    time: "19:30",
    access: "Por invitación",
    award: { slug: "merco-empresas", year: 2026 },
    featured: {
      title: ["Gala Merco", "Empresas", "Ecuador 2026"],
      highlight: "Ecuador 2026",
      dek: "La entrega de reconocimientos a las empresas con mejor reputación del país. Los resultados se publicaron el 24 de octubre; el 2 de diciembre se entregan en el escenario.",
      summary: "La entrega del reconocimiento a las 100 empresas con mejor reputación del país. ranking.ec cubre la ceremonia minuto a minuto.",
    },
    delivers: {
      text: "La gala entrega los reconocimientos de la 14.ª edición de Merco Empresas Ecuador, cuyos resultados se publicaron el 24 de octubre. Las diez primeras empresas reciben su distinción en el escenario; el resto de las 100 se anuncia en pantalla.",
      items: [
        { value: "100", label: "empresas reconocidas en el ranking general de reputación." },
        { value: "10", label: "distinciones entregadas en el escenario a las primeras posiciones." },
        { value: "12", label: "reconocimientos a la empresa líder de cada sector." },
      ],
    },
    program: [
      { time: "19:30", title: "Recepción y registro de invitados", detail: "Lobby del salón principal" },
      { time: "20:15", title: "Bienvenida", detail: "Palabras del director de Merco en Ecuador" },
      { time: "20:30", title: "Presentación de resultados", detail: "Metodología y principales hallazgos de la edición 2026" },
      { time: "21:00", title: "Líderes por sector", detail: "Entrega de los 12 reconocimientos sectoriales" },
      { time: "21:30", title: "Las diez primeras", detail: "Entrega de distinciones en orden ascendente, del 10.º al 1.º" },
      { time: "22:15", title: "Cóctel de cierre" },
    ],
    follow: [
      { title: "Minuto a minuto", text: "Desde las 19:30, en esta misma página, con cada reconocimiento entregado." },
      { title: "Transmisión", text: "Señal en directo del organizador, insertada aquí cuando comience la gala." },
      { title: "Ranking Newsletter", text: "Al día siguiente, la crónica y la lista completa en tu correo." },
    ],
    venueInfo: {
      name: "Hotel Hilton Colón Guayaquil",
      address: ["Av. Francisco de Orellana, Kennedy Norte", "Guayaquil, Guayas"],
      note: "Salón de eventos principal. Estacionamiento en el hotel.",
      map: "https://www.google.com/maps/search/?api=1&query=Hotel+Hilton+Colon+Guayaquil",
    },
    previous: [
      { year: 2025, detail: "Quito · JW Marriott" },
      { year: 2024, detail: "Guayaquil · Hotel Oro Verde" },
      { year: 2023, detail: "Quito · Swissôtel" },
    ],
  },
};

export const EVENTS: EventRecord[] = BASE.map(([date, type, name, short, organizer, city, venue]) => {
  const slug = slugify(name);
  return { slug, date, type, name, short, organizer, city, venue, ...DETAILS[slug] };
});

/** The event shown as "Destacado" on the agenda. */
export const FEATURED_EVENT = "gala-merco-empresas-2026";

/** Past events with coverage (links to the related articles). */
export const COVERAGES = [
  { date: "24 oct", kind: "Crónica", title: "Así fue la presentación de Merco Empresas 2026 en Quito", href: "/actualidad" },
  { date: "16 oct", kind: "Galería", title: "Premios Verdes 2026: la noche en imágenes", href: "/actualidad" },
  { date: "02 oct", kind: "Crónica", title: "Premios Summum: la cocina de la Costa se lleva la noche", href: "/actualidad" },
  { date: "22 sep", kind: "Resumen", title: "Cinco ideas del Foro de Comunicación Interna", href: "/actualidad" },
];

export const eventHref = (slug: string) => `/eventos/${slug}`;
/** Events with their own page (the rest only appear in the agenda). */
export const hasPage = (e: EventRecord) => !!e.featured;

const DAY = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTH = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export const parts = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m, d, weekday };
};
/** "Miércoles 2 de diciembre". */
export const longDay = (iso: string) => {
  const p = parts(iso);
  return `${DAY[p.weekday]} ${p.d} de ${MONTH[p.m - 1]}`;
};
export const monthName = (m: number) => MONTH[m - 1];

/** iCalendar file with the given events (agenda feed or one event). */
export function icsCalendar(events: EventRecord[], name: string, siteUrl: string): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ranking.ec//Agenda//ES", `X-WR-CALNAME:${esc(name)}`, "X-WR-TIMEZONE:America/Guayaquil"];
  for (const e of events) {
    const day = e.date.replace(/-/g, "");
    const [h, min] = (e.time ?? "").split(":");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.slug}@ranking.ec`,
      `DTSTAMP:${stamp}`,
      e.time ? `DTSTART;TZID=America/Guayaquil:${day}T${h}${min}00` : `DTSTART;VALUE=DATE:${day}`,
      `SUMMARY:${esc(e.name)}`,
      `LOCATION:${esc(`${e.venue}, ${e.city}`)}`,
      `DESCRIPTION:${esc(`${EVENT_TYPE_LABEL[e.type]} · ${e.organizer}`)}`,
      ...(hasPage(e) ? [`URL:${new URL(eventHref(e.slug), siteUrl).href}`] : []),
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
