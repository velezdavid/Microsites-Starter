/**
 * Editorial site content (news + registry), normalized from Sanity, plus everything derived from it:
 * recognitions and medals of each organization, positions by year, "más premiadas", leaders,
 * totals, open calls, upcoming galas, previous galas, coverages and the "mencionados" cards.
 */
import type { ArticleTeaser, EdImage, MedalLevel } from "@microsites/ui/editorial";
import type {
  PtBlock,
  RawArticle,
  RawAward,
  RawEditorial,
  RawEditorialPage,
  RawEvent,
  RawImage,
  RawIssue,
  RawOrganization,
  RawOrganizer,
  RawSettings,
} from "./queries";

export type ImageUrl = (image: RawImage | undefined, width: number, height?: number) => string | undefined;

/* ---------- Labels ---------- */

export const ARTICLE_TYPE_LABEL: Record<string, string> = {
  noticia: "Noticia",
  entrevista: "Entrevista",
  opinion: "Opinión",
  caso: "Caso",
  campana: "Campaña",
  informe: "Informe",
  analisis: "Análisis",
  datos: "Datos",
  reportaje: "Reportaje",
  cronica: "Crónica",
  galeria: "Galería",
};

export const AWARD_TYPE_LABEL = { ranking: "Ranking", premio: "Premio", certificacion: "Certificación" } as const;

export const EVENT_TYPE_LABEL = { gala: "Gala de premiación", foro: "Foro", taller: "Taller", encuentro: "Encuentro" } as const;
export const EVENT_TYPE_FILTER = { gala: "Galas de premiación", foro: "Foros y congresos", taller: "Talleres", encuentro: "Encuentros" } as const;

const LEVEL_LABEL: Record<MedalLevel, string> = { grand: "Gran Premio", oro: "Oro", plata: "Plata", bronce: "Bronce", mencion: "Mención", finalista: "Finalista" };
const LEVEL_MARK: Record<MedalLevel, string> = { grand: "GP", oro: "O", plata: "P", bronce: "B", mencion: "M", finalista: "F" };
const LEVEL_ORDER: MedalLevel[] = ["grand", "oro", "plata", "bronce", "mencion", "finalista"];

/* ---------- Dates ---------- */

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MONTHS_LONG = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DAYS_LONG = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const ECUADOR_OFFSET_MS = -5 * 3600_000;

export const parts = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d, weekday: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
};
/** "2026-10-29" → "29 oct 2026". */
export const shortDate = (iso: string) => {
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
/** "2026-10-29" → "29 oct". */
export const dayMonth = (iso: string) => shortDate(iso).split(" ").slice(0, 2).join(" ");
/** "2026-10-24" → "24 de octubre". */
export const longDate = (iso: string) => {
  const { m, d } = parts(iso);
  return `${d} de ${MONTHS_LONG[m - 1]}`;
};
/** "Miércoles 2 de diciembre". */
export const longDay = (iso: string) => {
  const { m, d, weekday } = parts(iso);
  return `${DAYS_LONG[weekday]} ${d} de ${MONTHS_LONG[m - 1]}`;
};
export const monthName = (m: number) => MONTHS_LONG[m - 1];
/** Calendar date in Ecuador of an instant. */
const localDate = (instant: string) => new Date(new Date(instant).getTime() + ECUADOR_OFFSET_MS).toISOString().slice(0, 10);
/** Today in Ecuador (build time; countdowns are recomputed in the browser). */
export const today = () => localDate(new Date().toISOString());
export const daysUntil = (iso: string) => {
  const { y, m, d } = parts(iso);
  const t = parts(today());
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(t.y, t.m - 1, t.d)) / 864e5);
};

/* ---------- Helpers ---------- */

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** "BL" from "Banco del Litoral": initials of the first two words longer than two letters. */
export const initials = (name: string) =>
  name
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** Plain text of a Portable Text block. */
export const blockText = (b: PtBlock) => (b.children ?? []).map((c: { text?: string }) => c.text ?? "").join("");

const words = (blocks: PtBlock[] | undefined) =>
  (blocks ?? []).filter((b) => b._type === "block").reduce((n, b) => n + blockText(b).split(/\s+/).filter(Boolean).length, 0);

export const articleHref = (slug: string) => `/actualidad/${slug}`;
export const awardHref = (slug: string) => `/rankings/${slug}`;
export const editionHref = (e: { award: string; year: number }) => `/rankings/${e.award}/${e.year}`;
export const orgHref = (slug: string) => `/empresas/${slug}`;
export const eventHref = (slug: string) => `/eventos/${slug}`;

/* ---------- Normalized records ---------- */

export interface Article {
  id: string;
  slug: string;
  type: string;
  kicker: string;
  title: string;
  highlight?: string;
  dek?: string;
  author: string;
  authors: { name: string; role?: string }[];
  /** Calendar date in Ecuador (yyyy-mm-dd). */
  date: string;
  publishedAt: string;
  readTime?: string;
  place?: string;
  image?: EdImage;
  feature: boolean;
  photoCredit?: string;
  keyFacts?: { value: string; label: string }[];
  body: PtBlock[];
  topics: { title: string; slug: string }[];
  mentions: string[];
  sponsored: boolean;
  sponsor?: { brand: string; label?: string; note?: string };
}

export interface Award {
  id: string;
  slug: string;
  name: string;
  fullName?: string;
  type: RawAward["type"];
  category: string;
  organizer: string;
  scope: string;
  periodicity: string;
  firstEdition?: number;
  website?: string;
  description: string;
  unit: string;
  corporate: boolean;
  family?: { key: string; label: string };
  about?: { title: string; text: string }[];
  nextEdition?: { year: number; steps: { when: string; what: string }[]; note: string };
  call?: RawAward["call"];
}

export interface Result {
  name: string;
  org?: string;
  sector?: string;
  position?: number;
  level?: MedalLevel;
  label?: string;
  category?: string;
  score?: number;
  change?: string;
}

export interface Edition {
  id: string;
  award: string;
  year: number;
  number?: number;
  published: string;
  /** Results of the full edition (the registry may hold only the top). */
  total: number;
  summary: string;
  intro?: string;
  source?: string;
  methodology?: { text: string; weights: { label: string; value: number }[] };
  results: Result[];
}

export interface Organization {
  id: string;
  slug: string;
  name: string;
  logo?: RawImage;
  sector: string;
  shortSector: string;
  city: string;
  verified: boolean;
  founded?: number;
  employees?: string;
  website?: string;
  linkedin?: string;
  description?: string;
  /** "24 oct 2026". */
  updated?: string;
}

export interface Recognition {
  year: number;
  published: string;
  award: string;
  category: string;
  type: string;
  level: MedalLevel;
  result: string;
  href: string;
}

export interface EventRecord {
  id: string;
  slug: string;
  date: string;
  time?: string;
  type: RawEvent["type"];
  name: string;
  short: string;
  organizer: string;
  city: string;
  venue: string;
  hasPage: boolean;
  page?: NonNullable<RawEvent["page"]>;
  edition?: { award: string; year: number };
  streamUrl?: string;
}

/* ---------- Content ---------- */

export class EditorialContent {
  readonly settings: RawSettings;
  readonly articles: Article[];
  readonly organizers: RawOrganizer[];
  readonly organizations: Organization[];
  readonly awards: Award[];
  readonly editions: Edition[];
  readonly events: EventRecord[];
  readonly movements: { initials: string; name: string; role: string; organization: string }[];
  readonly issues: RawIssue[];
  readonly pages: RawEditorialPage[];
  readonly front: NonNullable<RawEditorial["front"]>;

  private readonly byId = new Map<string, { kind: "article" | "organization" | "award" | "edition" | "event"; slug: string; year?: number }>();
  private recognitionCache = new Map<string, Recognition[]>();

  constructor(
    raw: RawEditorial,
    readonly imageUrl: ImageUrl,
  ) {
    this.settings = raw.settings ?? {};
    this.front = raw.front ?? {};
    this.organizers = raw.organizers;
    this.issues = raw.issues;
    this.pages = raw.pages;

    this.articles = raw.articles.map((a) => this.article$(a));
    this.organizations = raw.organizations.map((o) => this.organization$(o));
    const orgName = new Map(this.organizations.map((o) => [o.slug, o]));
    this.awards = raw.awards.map((a) => this.award$(a));
    const awardSlugs = new Set(this.awards.map((a) => a.slug));

    this.editions = raw.editions
      .filter((e) => awardSlugs.has(e.award))
      .map((e) => ({
        id: e._id,
        award: e.award,
        year: e.year,
        number: e.number,
        published: e.publishedAt,
        total: e.total ?? e.results?.length ?? 0,
        summary: e.summary ?? "",
        intro: e.intro,
        source: e.sourceUrl,
        methodology: e.methodology?.text ? { text: e.methodology.text, weights: e.methodology.weights ?? [] } : undefined,
        results: (e.results ?? []).map((r) => {
          const org = r.org ? orgName.get(r.org) : undefined;
          return {
            name: r.name || r.orgName || "",
            org: org?.slug,
            // Ranked results without a category show the organization's sector (the organizer's own label wins).
            sector: r.sector || (r.position && !r.category ? org?.shortSector : undefined),
            position: r.position,
            level: r.level as MedalLevel | undefined,
            label: r.label,
            category: r.category,
            score: r.score,
            change: r.change,
          };
        }),
      }));
    for (const e of this.editions) for (const r of e.results) r.change ??= this.computedChange(e, r);

    this.events = raw.events.map((e) => ({
      id: e._id,
      slug: e.slug,
      date: e.date,
      time: e.time,
      type: e.type,
      name: e.name,
      short: e.shortName,
      organizer: e.organizer ?? "",
      city: e.city,
      venue: e.venue,
      hasPage: !!e.hasPage && !!e.page?.title?.length,
      page: e.page,
      edition: e.edition?.award ? e.edition : undefined,
      streamUrl: e.streamUrl,
    }));
    this.movements = raw.movements.map((m) => ({ initials: initials(m.person), name: m.person, role: m.role, organization: m.organization ?? "" }));

    for (const a of this.articles) this.byId.set(a.id, { kind: "article", slug: a.slug });
    for (const o of this.organizations) this.byId.set(o.id, { kind: "organization", slug: o.slug });
    for (const a of this.awards) this.byId.set(a.id, { kind: "award", slug: a.slug });
    for (const e of this.editions) this.byId.set(e.id, { kind: "edition", slug: e.award, year: e.year });
    for (const e of this.events) this.byId.set(e.id, { kind: "event", slug: e.slug });
  }

  private article$(a: RawArticle): Article {
    const minutes = a.readingMinutes ?? (words(a.body) >= 150 ? Math.ceil(words(a.body) / 200) : undefined);
    const authors = a.authors?.filter(Boolean) ?? [];
    return {
      id: a._id,
      slug: a.slug,
      type: a.type,
      kicker: a.kicker,
      title: a.title,
      highlight: a.highlight,
      dek: a.dek,
      author: authors.map((x) => x.name).join(" y "),
      authors,
      date: localDate(a.publishedAt),
      publishedAt: a.publishedAt,
      readTime: minutes ? `${minutes} min` : undefined,
      place: a.place,
      image: a.image ? this.image(a.image, "Foto principal", 1600) : undefined,
      feature: a.layout === "feature",
      photoCredit: a.photoCredit,
      keyFacts: a.keyFacts?.length ? a.keyFacts : undefined,
      body: a.body ?? [],
      topics: a.topics?.filter(Boolean) ?? [],
      mentions: a.mentions ?? [],
      sponsored: !!a.sponsored,
      sponsor: a.sponsored ? a.sponsor : undefined,
    };
  }

  private organization$(o: RawOrganization): Organization {
    return {
      id: o._id,
      slug: o.slug,
      name: o.name,
      logo: o.logo,
      sector: o.sector ?? "",
      shortSector: o.shortSector || o.sector || "",
      city: o.city,
      verified: !!o.verified,
      founded: o.founded,
      employees: o.employees,
      website: o.website,
      linkedin: o.linkedin,
      description: o.description,
      updated: o.updatedAt ? shortDate(o.updatedAt) : undefined,
    };
  }

  private award$(a: RawAward): Award {
    return {
      id: a._id,
      slug: a.slug,
      name: a.name,
      fullName: a.fullName,
      type: a.type,
      category: a.category,
      organizer: a.organizer ?? "",
      scope: a.scope ?? "",
      periodicity: a.periodicity ?? "",
      firstEdition: a.firstEdition,
      website: a.website,
      description: a.description,
      unit: a.unit || "empresas",
      corporate: !!a.corporate,
      family: a.family?.key && a.family.label ? { key: a.family.key, label: a.family.label } : undefined,
      about: a.about?.filter((x) => x.title).map((x) => ({ title: x.title, text: x.text ?? "" })),
      nextEdition: a.nextEdition?.year ? { year: a.nextEdition.year, steps: a.nextEdition.steps ?? [], note: a.nextEdition.note ?? "" } : undefined,
      call: a.call,
    };
  }

  /** Image with its CDN URL, or a placeholder label when there is no file. */
  image(img: RawImage, label: string, width: number, height?: number): EdImage {
    return { src: this.imageUrl(img, width, height), alt: img.alt, label, caption: img.caption, credit: img.credit };
  }

  /* ---------- Articles ---------- */

  /** Newest first (the query orders by publishedAt). */
  get articlesByDate(): Article[] {
    return this.articles;
  }

  articleById(id: string | undefined): Article | undefined {
    const ref = id ? this.byId.get(id) : undefined;
    return ref?.kind === "article" ? this.articles.find((a) => a.slug === ref.slug) : undefined;
  }

  /** Curated articles (ids), skipping missing ones; `fallback` fills the list when it is empty. */
  curated(ids: string[] | undefined, fallback: () => Article[], max: number): Article[] {
    const picked = (ids ?? []).map((id) => this.articleById(id)).filter((a): a is Article => !!a);
    return (picked.length ? picked : fallback()).slice(0, max);
  }

  latestOfType(types: string[], exclude: Article[] = []): Article[] {
    return this.articles.filter((a) => types.includes(a.type) && !exclude.includes(a));
  }

  /** Card data of an article. `parts` chooses which optional fields the card shows. */
  teaser(a: Article, parts: { dek?: boolean; author?: boolean; date?: boolean; readTime?: boolean; image?: string } = {}): ArticleTeaser {
    return {
      href: articleHref(a.slug),
      kicker: a.kicker,
      title: a.title,
      dek: parts.dek ? a.dek : undefined,
      author: parts.author ? a.author : undefined,
      date: parts.date ? shortDate(a.date) : undefined,
      readTime: parts.readTime ? a.readTime : undefined,
      image: a.image?.src ? { ...a.image, caption: undefined, credit: undefined } : parts.image ? { label: parts.image } : undefined,
      sponsored: a.sponsored,
    };
  }

  /** Articles about a record: those that mention it first, then those that name it in the kicker or title. */
  newsAbout(recordIds: string[], name: string, fields: (a: Article) => string = (a) => `${a.kicker} ${a.title}`): Article[] {
    const n = name.toLowerCase();
    return this.articles.filter((a) => a.mentions.some((m) => recordIds.includes(m)) || fields(a).toLowerCase().includes(n));
  }

  /* ---------- Registry ---------- */

  award(slug: string): Award | undefined {
    return this.awards.find((a) => a.slug === slug);
  }

  organizer(slug: string): RawOrganizer | undefined {
    return this.organizers.find((o) => o.slug === slug);
  }

  organization(slug: string | undefined): Organization | undefined {
    return slug ? this.organizations.find((o) => o.slug === slug) : undefined;
  }

  editionsOf(slug: string): Edition[] {
    return this.editions.filter((e) => e.award === slug).sort((a, b) => b.year - a.year);
  }

  latestEdition(slug: string): Edition | undefined {
    return this.editionsOf(slug)[0];
  }

  /** Awards with at least one edition (the ones with pages and table rows). */
  get awardsWithEditions(): Award[] {
    return this.awards.filter((a) => this.latestEdition(a.slug));
  }

  get editionsByDate(): Edition[] {
    return [...this.editions].sort((a, b) => b.published.localeCompare(a.published));
  }

  editionLabel(e: Edition): string {
    return `${this.award(e.award)?.name ?? ""} ${e.year}`;
  }

  /** Variation against the previous edition of the same award, when the organization is in both. */
  private computedChange(e: Edition, r: Result): string | undefined {
    if (!r.org || !r.position) return undefined;
    const prev = this.editions.find((x) => x.award === e.award && x.year === e.year - 1);
    const before = prev?.results.find((x) => x.org === r.org && x.position)?.position;
    if (!before) return undefined;
    const diff = before - r.position;
    return diff === 0 ? "=" : diff > 0 ? `▲ ${diff}` : `▼ ${-diff}`;
  }

  /** "1.er lugar", "Oro", "Certificada"… */
  resultLabel(r: Result): string {
    if (r.label) return r.label;
    if (r.level) return LEVEL_LABEL[r.level];
    if (r.position) return r.position === 1 ? "1.er lugar" : `${r.position}.º lugar`;
    return "";
  }

  /** Short mark for compact lists: position, or GP / O / P / B / M. */
  resultMark(r: Result): string {
    if (r.position) return String(r.position);
    if (r.level) return LEVEL_MARK[r.level];
    return "·";
  }

  /** The winner of an edition: first position or highest level. */
  topResult(e: Edition): Result | undefined {
    const rank = (r: Result) => LEVEL_ORDER.indexOf(r.level ?? "finalista");
    return [...e.results].sort((a, b) => (a.position ?? 99) - (b.position ?? 99) || rank(a) - rank(b))[0];
  }

  /** Recognitions of an organization in the registry, newest first. */
  recognitionsOf(slug: string): Recognition[] {
    let list = this.recognitionCache.get(slug);
    if (!list) {
      list = this.editions
        .flatMap((e) =>
          e.results
            .filter((r) => r.org === slug)
            .map((r) => {
              const a = this.award(e.award)!;
              return {
                year: e.year,
                published: e.published,
                award: a.name,
                category: r.category ?? r.sector ?? "General",
                type: AWARD_TYPE_LABEL[a.type],
                level: r.level ?? (r.position === 1 ? "grand" : "oro"),
                result: this.resultLabel(r),
                href: editionHref(e),
              } satisfies Recognition;
            }),
        )
        .sort((a, b) => b.published.localeCompare(a.published));
      this.recognitionCache.set(slug, list);
    }
    return list;
  }

  medalsOf(slug: string): Record<"grand" | "oro" | "plata" | "bronce" | "mencion", number> {
    const medals = { grand: 0, oro: 0, plata: 0, bronce: 0, mencion: 0 };
    for (const r of this.recognitionsOf(slug)) if (r.level in medals) medals[r.level as keyof typeof medals]++;
    return medals;
  }

  /** "Merco Empresas 2026 · 1.er lugar". */
  lastRecognition(slug: string): string {
    const r = this.recognitionsOf(slug)[0];
    return r ? `${r.award} ${r.year} · ${r.result}` : "";
  }

  /** Positions in ranked editions over the given years. */
  positionsOf(slug: string, years: number[]): { name: string; byYear: Record<number, string> }[] {
    const rows = new Map<string, Record<number, string>>();
    for (const e of [...this.editions].sort((a, b) => a.year - b.year)) {
      const r = e.results.find((x) => x.org === slug && x.position);
      if (!r || !years.includes(e.year)) continue;
      const name = this.award(e.award)!.name;
      rows.set(name, { ...rows.get(name), [e.year]: String(r.position) });
    }
    return [...rows].map(([name, byYear]) => ({ name, byYear }));
  }

  /** "Más premiadas": organizations with most top-10 places in the loaded editions (2 = first, 1 = top 10, 0 = out). */
  historyOf(slug: string): { years: number[]; rows: { name: string; cells: (0 | 1 | 2)[] }[] } | undefined {
    const editions = this.editionsOf(slug)
      .filter((e) => e.results.some((r) => r.position))
      .reverse();
    if (editions.length < 2) return undefined;
    const names = new Map<string, (0 | 1 | 2)[]>();
    editions.forEach((e, i) => {
      for (const r of e.results) {
        if (!r.position || r.position > 10) continue;
        const cells = names.get(r.name) ?? editions.map(() => 0 as const);
        cells[i] = r.position === 1 ? 2 : 1;
        names.set(r.name, cells);
      }
    });
    const score = (cells: number[]) => cells.reduce((n, c) => n + c, 0);
    const rows = [...names]
      .map(([name, cells]) => ({ name, cells }))
      .sort((a, b) => score(b.cells) - score(a.cells))
      .slice(0, 6);
    return { years: editions.map((e) => e.year), rows };
  }

  get totals() {
    return {
      awards: this.awardsWithEditions.length,
      recognitions: this.editions.reduce((n, e) => n + e.results.length, 0),
      organizations: this.organizations.length,
      verified: this.organizations.filter((o) => o.verified).length,
    };
  }

  /** Awards whose call for entries is open or upcoming, soonest first. */
  get openCalls() {
    return this.awards
      .filter((a) => a.call?.status === "abierta" || a.call?.status === "proxima")
      .sort((a, b) => (a.call?.closesAt ?? "9999").localeCompare(b.call?.closesAt ?? "9999"))
      .map((a) => {
        const c = a.call!;
        return {
          award: a.name,
          edition: c.edition ?? "",
          closes: c.closesAt ? dayMonth(c.closesAt) : "",
          daysLeft: c.status === "abierta" && c.closesAt ? Math.max(0, daysUntil(c.closesAt)) : undefined,
          status: c.status as "abierta" | "proxima",
        };
      });
  }

  /** Latest published editions with their winner ("Resultados publicados"). */
  publishedResults(count: number): { award: string; when: string; level: MedalLevel; winner: string; detail: string; href: string }[] {
    return this.editionsByDate.slice(0, count).flatMap((e) => {
      const r = this.topResult(e);
      if (!r) return [];
      const detail = r.position ? `1.º de ${e.total}` : (r.category ?? this.resultLabel(r));
      return [{ award: this.editionLabel(e), when: dayMonth(e.published), level: r.level ?? "oro", winner: r.name, detail: `· ${detail.charAt(0).toLowerCase()}${detail.slice(1)}`, href: editionHref(e) }];
    });
  }

  /* ---------- Events ---------- */

  get upcomingEvents(): EventRecord[] {
    const t = today();
    return this.events.filter((e) => e.date >= t);
  }

  event(slug: string): EventRecord | undefined {
    return this.events.find((e) => e.slug === slug);
  }

  eventById(id: string | undefined): EventRecord | undefined {
    const ref = id ? this.byId.get(id) : undefined;
    return ref?.kind === "event" ? this.event(ref.slug) : undefined;
  }

  editionById(id: string | undefined): Edition | undefined {
    const ref = id ? this.byId.get(id) : undefined;
    return ref?.kind === "edition" ? this.editions.find((e) => e.award === ref.slug && e.year === ref.year) : undefined;
  }

  editionOf(e: EventRecord): Edition | undefined {
    return e.edition && this.editions.find((x) => x.award === e.edition!.award && x.year === e.edition!.year);
  }

  /** Galas of earlier editions of the same award, newest first. */
  previousGalas(e: EventRecord): { year: string; detail: string; href?: string }[] {
    if (!e.edition) return [];
    return this.events
      .filter((x) => x.edition?.award === e.edition!.award && x.edition.year < e.edition!.year)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((x) => ({ year: String(x.edition!.year), detail: `${x.city} · ${x.venue}`, href: x.hasPage ? eventHref(x.slug) : undefined }));
  }

  /** Chronicles and galleries of past events. */
  get coverages(): { date: string; kind: string; title: string; href: string }[] {
    const t = today();
    const pastEvents = new Set(this.events.filter((e) => e.date < t).map((e) => e.id));
    return this.articles
      .filter((a) => (a.type === "cronica" || a.type === "galeria") && a.mentions.some((m) => pastEvents.has(m)))
      .slice(0, 4)
      .map((a) => ({ date: dayMonth(a.date), kind: ARTICLE_TYPE_LABEL[a.type], title: a.title, href: articleHref(a.slug) }));
  }

  /* ---------- "Mencionados en esta nota" ---------- */

  mention(id: string): { type: string; initials: string; name: string; detail: string; cta: string; href: string } | undefined {
    const ref = this.byId.get(id);
    if (!ref) return undefined;
    switch (ref.kind) {
      case "organization": {
        const o = this.organization(ref.slug)!;
        const n = this.recognitionsOf(o.slug).length;
        return { type: "Empresa", initials: initials(o.name), name: o.name, detail: `${o.shortSector} · ${n} ${n === 1 ? "reconocimiento" : "reconocimientos"}`, cta: "Ver ficha", href: orgHref(o.slug) };
      }
      case "edition": {
        const e = this.editionById(id)!;
        const a = this.award(e.award)!;
        return {
          type: AWARD_TYPE_LABEL[a.type],
          initials: initials(a.name),
          name: `${a.name} ${e.year}`,
          detail: e.summary || a.description,
          cta: a.type === "ranking" ? "Ver ranking" : "Ver ganadores",
          href: editionHref(e),
        };
      }
      case "award": {
        const a = this.award(ref.slug)!;
        return { type: AWARD_TYPE_LABEL[a.type], initials: initials(a.name), name: a.name, detail: a.description, cta: "Ver galardón", href: awardHref(a.slug) };
      }
      case "event": {
        const e = this.event(ref.slug)!;
        const { d, m } = parts(e.date);
        const gala = e.type === "gala";
        return {
          type: gala ? "Gala" : EVENT_TYPE_LABEL[e.type],
          initials: `${d}${MONTHS[m - 1][0].toUpperCase()}`,
          name: e.name,
          detail: `${d} ${MONTHS[m - 1]} · ${e.venue}, ${e.city}`,
          cta: gala ? "Ver gala" : "Ver evento",
          href: e.hasPage ? eventHref(e.slug) : "/eventos",
        };
      }
      default:
        return undefined;
    }
  }
}
