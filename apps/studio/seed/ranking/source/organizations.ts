/**
 * Directory sample data of ranking.ec (organizations), from the prototypes.
 * Counts and "last recognition" are sample values: in Sanity they come from the registry.
 */
import type { MedalLevel } from "./types";
import { award, EDITIONS, resultLabel, slugify, TYPE_LABEL } from "./registry";

export interface Recognition {
  year: number;
  award: string;
  category: string;
  /** Ranking, Premio, Certificación. */
  type: string;
  level: MedalLevel;
  result: string;
  href?: string;
}

export interface Organization {
  slug: string;
  name: string;
  sector: string;
  city: string;
  verified: boolean;
  /** Total recognitions in the registry. */
  recognitions: number;
  lastRecognition: string;
  /** Profile details (only some organizations have them in the sample). */
  shortSector?: string;
  founded?: number;
  employees?: string;
  website?: string;
  linkedin?: string;
  description?: string;
  updated?: string;
  medals?: Partial<Record<MedalLevel, number>>;
  recognitionsByYear?: Recognition[];
  positions?: { name: string; byYear: Record<number, string> }[];
}

const ORGS: [string, string, string, boolean, number, string][] = [
  ["Banco del Litoral", "Banca y seguros", "Guayaquil", true, 14, "Merco Empresas 2026 · 1.er lugar"],
  ["Grupo Pacífico", "Consumo masivo", "Guayaquil", true, 11, "Great Place to Work 2026 · 1.er lugar"],
  ["Cerámica Andina", "Industria", "Cuenca", true, 9, "Premios Verdes 2026 · Oro"],
  ["Telecom Sierra", "Telecomunicaciones", "Quito", true, 8, "Merco Talento 2026 · 1.er lugar"],
  ["Alimentos del Valle", "Consumo masivo", "Quito", false, 7, "Premios Summum 2026 · Plata"],
  ["Cervecería del Sur", "Consumo masivo", "Guayaquil", true, 7, "Premios Summum 2026 · Oro"],
  ["Seguros Equinoccio", "Banca y seguros", "Quito", false, 6, "Premios Verdes 2026 · Plata"],
  ["Farmacéutica Ecuatorial", "Salud", "Quito", true, 5, "Merco Talento 2026 · Mención"],
  ["Supermercados Costa", "Retail", "Guayaquil", false, 5, "Merco Empresas 2026 · 8.º lugar"],
  ["Petroandes", "Energía y minería", "Quito", false, 4, "Merco Empresas 2026 · 11.º lugar"],
  ["Exportadora Bananera Oro", "Agroindustria", "Machala", true, 4, "Excelencia Exportadora 2025 · Ganador"],
  ["Banco Andino", "Banca y seguros", "Quito", false, 4, "Merco Empresas 2026 · 6.º lugar"],
  ["Lácteos Cotopaxi", "Consumo masivo", "Latacunga", false, 3, "Premios Summum 2026 · Bronce"],
  ["Clínica Metropolitana", "Salud", "Quito", false, 3, "Great Place to Work 2026 · 7.º lugar"],
  ["Cementos Chimborazo", "Industria", "Riobamba", false, 2, "Premios Verdes 2025 · Mención"],
  ["Electro Hogar", "Retail", "Cuenca", false, 2, "Merco Empresas 2026 · 20.º lugar"],
  ["Cooperativa Sierra Sur", "Banca y seguros", "Quito", false, 9, "Merco Empresas 2026 · 12.º lugar"],
  ["Aerolíneas del Ecuador", "Transporte", "Quito", false, 2, "Merco Empresas 2026 · 14.º lugar"],
  ["Bebidas Tropicales", "Consumo masivo", "Guayaquil", false, 2, "Merco Empresas 2026 · 17.º lugar"],
  ["Constructora Guayas", "Construcción", "Guayaquil", false, 1, "Merco Empresas 2026 · 19.º lugar"],
  ["Banco Cordillera", "Banca y seguros", "Quito", false, 8, "Merco Empresas 2025 · 15.º lugar"],
  ["Mutualista Austro", "Banca y seguros", "Cuenca", false, 5, "Premios Verdes 2025 · Mención"],
];

const DETAILS: Record<string, Partial<Organization>> = {
  "banco-del-litoral": {
    shortSector: "Banca",
    founded: 1976,
    employees: "4.800",
    website: "https://bancodellitoral.ec",
    linkedin: "https://www.linkedin.com",
    description:
      "Entidad financiera fundada en Manta en 1976. Atiende a 1,2 millones de clientes en 14 provincias, con foco en crédito productivo para pesca, agricultura y comercio.",
    updated: "24 oct 2026",
    medals: { grand: 3, oro: 7, plata: 4, bronce: 2, mencion: 1 },
    recognitionsByYear: [
      { year: 2026, award: "Merco Empresas", category: "Ranking general de reputación", type: "Ranking", level: "grand", result: "1.º lugar", href: "/rankings/merco-empresas/2026" },
      { year: 2026, award: "Great Place to Work", category: "Más de 1.000 colaboradores", type: "Certificación", level: "oro", result: "Certificada", href: "/rankings/great-place-to-work" },
      { year: 2026, award: "Effie Awards Ecuador", category: "Servicios financieros", type: "Premio", level: "plata", result: "Plata" },
      { year: 2025, award: "Premios Verdes", category: "Finanzas sostenibles", type: "Premio", level: "oro", result: "Ganador", href: "/rankings/premios-verdes" },
      { year: 2025, award: "Merco Empresas", category: "Ranking general de reputación", type: "Ranking", level: "oro", result: "3.º lugar", href: "/rankings/merco-empresas/2025" },
      { year: 2024, award: "Merco Empresas", category: "Sector financiero", type: "Ranking", level: "grand", result: "1.º del sector", href: "/rankings/merco-empresas/2024" },
      { year: 2024, award: "Premio Nacional a la Calidad", category: "Gran empresa de servicios", type: "Premio", level: "mencion", result: "Mención" },
    ],
    positions: [
      { name: "Merco Empresas · general", byYear: { 2022: "9", 2023: "7", 2024: "4", 2025: "3", 2026: "1" } },
      { name: "Merco Talento", byYear: { 2022: "—", 2023: "12", 2024: "10", 2025: "8", 2026: "6" } },
      { name: "Great Place to Work · +1.000", byYear: { 2022: "14", 2023: "11", 2024: "9", 2025: "7", 2026: "5" } },
    ],
  },
};

export const ORGANIZATIONS: Organization[] = ORGS.map(([name, sector, city, verified, recognitions, lastRecognition]) => {
  const slug = slugify(name);
  return { slug, name, sector, city, verified, recognitions, lastRecognition, ...DETAILS[slug] };
});

/** Directory-wide totals shown in the header (sample). */
export const DIRECTORY_TOTALS = { organizations: 96, verified: 41, recognitions: 214 };

export const orgHref = (slug: string) => `/empresas/${slug}`;

/** "BL" from "Banco del Litoral": initials of the first two words longer than two letters. */
export const initials = (name: string) =>
  name
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** Recognitions of an organization: its own sample list, or the ones found in the registry. */
export function recognitionsOf(o: Organization): Recognition[] {
  if (o.recognitionsByYear) return o.recognitionsByYear;
  return EDITIONS.flatMap((e) =>
    e.results
      .filter((r) => r.org === o.slug)
      .map((r) => {
        const a = award(e.award);
        return {
          year: e.year,
          award: a.name,
          category: r.category ?? r.sector ?? "General",
          type: TYPE_LABEL[a.type],
          level: r.level ?? (r.position === 1 ? "grand" : "oro"),
          result: resultLabel(r),
          href: `/rankings/${e.award}/${e.year}`,
        } satisfies Recognition;
      }),
  ).sort((a, b) => b.year - a.year);
}

/** Medal counts: the sample totals, or counted from the recognitions. */
export function medalsOf(o: Organization): Record<"grand" | "oro" | "plata" | "bronce" | "mencion", number> {
  const base = { grand: 0, oro: 0, plata: 0, bronce: 0, mencion: 0 };
  if (o.medals) return { ...base, ...o.medals };
  for (const r of recognitionsOf(o)) if (r.level in base) base[r.level as keyof typeof base]++;
  return base;
}

/** Positions in ranking editions over the last years (sample list or registry). */
export function positionsOf(o: Organization, years: number[]): { name: string; byYear: Record<number, string> }[] {
  if (o.positions) return o.positions;
  const rows = new Map<string, Record<number, string>>();
  for (const e of EDITIONS) {
    const r = e.results.find((x) => x.org === o.slug && x.position);
    if (!r || !years.includes(e.year)) continue;
    const name = award(e.award).name;
    rows.set(name, { ...rows.get(name), [e.year]: String(r.position) });
  }
  return [...rows].map(([name, byYear]) => ({ name, byYear }));
}
