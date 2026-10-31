/**
 * GROQ query of an editorial site (news + registry) and the raw shapes it returns.
 * One request per build: every document of the site, with references resolved to slugs or names.
 */
import type { SanityImage } from "../queries";

const image = /* groq */ `{..., "asset": asset{_ref}}`;
const svgImage = /* groq */ `{alt, "url": asset->url, "dimensions": asset->metadata.dimensions}`;

export const EDITORIAL_QUERY = /* groq */ `{
  "settings": *[_type == "editorialSettings" && site._ref == $siteId] | order(_updatedAt desc)[0]{
    masthead, sections[]{label, "slug": slug.current, types},
    footer{tagline, columns, bottomLeft, bottomRight, "logo": logo${svgImage}},
    actualidad, rankings, rankingsSearch, empresas, eventos, newsletterBand, newsletterPage
  },
  "front": *[_type == "frontPage" && site._ref == $siteId] | order(_updatedAt desc)[0]{
    "lead": lead._ref, "secondary": secondary[]._ref, "newsRow": newsRow[]._ref, "opinion": opinion[]._ref,
    "interviews": interviews[]._ref, "report": report._ref, "analysis": analysis[]._ref, "mostRead": mostRead[]._ref,
    "featuredEdition": featuredEdition._ref, "featuredEvent": featuredEvent._ref
  },
  "articles": *[_type == "article" && site._ref == $siteId && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc){
    _id, type, kicker, title, highlight, dek, "slug": slug.current, "authors": authors[]->{name, role},
    publishedAt, place, "image": image${image}, layout, photoCredit, keyFacts[]{value, label}, body, readingMinutes,
    "topics": topics[]->{title, "slug": slug.current}, "mentions": mentions[]._ref, sponsored, sponsor{brand, label, note}
  },
  "organizers": *[_type == "organizer" && site._ref == $siteId]{_id, name, "slug": slug.current, description, website},
  "organizations": *[_type == "organization" && site._ref == $siteId && defined(slug.current)] | order(name asc){
    _id, name, "slug": slug.current, "logo": logo${image}, "sector": sector->title, "shortSector": sector->shortTitle,
    city, founded, employees, website, linkedin, description, verified, updatedAt
  },
  "awards": *[_type == "award" && site._ref == $siteId && defined(slug.current)] | order(name asc){
    _id, name, fullName, "slug": slug.current, type, category, "organizer": organizer->slug.current, scope, periodicity,
    firstEdition, website, description, unit, corporate, family, about[]{title, text}, nextEdition{year, steps[]{when, what}, note}, call
  },
  "editions": *[_type == "edition" && site._ref == $siteId && defined(award) && defined(year)]{
    _id, "award": award->slug.current, year, number, publishedAt, total, summary, intro, sourceUrl,
    methodology{text, weights[]{label, value}},
    "results": results[]{
      "org": organization->slug.current, "orgName": organization->name, name, position, level, label, category, sector, score, change
    }
  },
  "events": *[_type == "event" && site._ref == $siteId && defined(slug.current)] | order(date asc){
    _id, name, shortName, "slug": slug.current, type, date, time, "organizer": organizer->name, city, venue,
    "edition": edition->{"award": award->slug.current, year}, hasPage, page, streamUrl
  },
  "movements": *[_type == "movement" && site._ref == $siteId] | order(date desc){
    person, role, "organization": coalesce(organization->name, organizationName), "photo": photo${image}
  },
  "issues": *[_type == "newsletterIssue" && site._ref == $siteId] | order(number desc){number, date, title, url},
  "pages": *[_type == "editorialPage" && site._ref == $siteId && defined(slug.current)] | order(order asc){
    _id, group, menuLabel, "slug": slug.current, seo, eyebrow, title, lead, sections, form, formCopy, footnote, newsletterText
  }
}`;

/* ---------- Raw shapes ---------- */

export type RawImage = SanityImage & { caption?: string; credit?: string; hotspot?: unknown; crop?: unknown };
export type RawSvg = { alt?: string; url?: string; dimensions?: { width: number; height: number } };
export type PtBlock = { _type: string; _key: string; [field: string]: any };
type Link = { label: string; href: string };
type Fact = { value: string; label: string };
type TitledText = { title: string; text?: string };

export interface RawHub {
  eyebrow?: string;
  title?: string[];
  text?: string;
  newsletterText?: string;
}

export interface RawSettings {
  masthead?: { locale?: string; nav?: Link[] };
  sections?: { label: string; slug: string; types: string[] }[];
  footer?: { tagline?: string; columns?: { title: string; links?: Link[] }[]; bottomLeft?: string; bottomRight?: string; logo?: RawSvg };
  actualidad?: RawHub;
  rankings?: RawHub;
  rankingsSearch?: string[];
  empresas?: RawHub;
  eventos?: RawHub;
  newsletterBand?: { eyebrow?: string; title: string; text?: string; cta?: string; placeholder?: string; consent?: string; success?: string };
  newsletterPage?: {
    eyebrow?: string;
    title?: string[];
    text?: string;
    totals?: Fact[];
    formTitle?: string;
    formNote?: string;
    successEyebrow?: string;
    successTitle?: string;
    successText?: string;
    benefitsEyebrow?: string;
    benefitsTitle?: string;
    benefits?: TitledText[];
  };
}

export interface RawFront {
  lead?: string;
  secondary?: string[];
  newsRow?: string[];
  opinion?: string[];
  interviews?: string[];
  report?: string;
  analysis?: string[];
  mostRead?: string[];
  featuredEdition?: string;
  featuredEvent?: string;
}

export interface RawArticle {
  _id: string;
  type: string;
  kicker: string;
  title: string;
  highlight?: string;
  dek?: string;
  slug: string;
  authors?: { name: string; role?: string }[];
  publishedAt: string;
  place?: string;
  image?: RawImage;
  layout?: "standard" | "feature";
  photoCredit?: string;
  keyFacts?: Fact[];
  body?: PtBlock[];
  readingMinutes?: number;
  topics?: { title: string; slug: string }[];
  mentions?: string[];
  sponsored?: boolean;
  sponsor?: { brand: string; label?: string; note?: string };
}

export interface RawOrganizer {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
}

export interface RawOrganization {
  _id: string;
  name: string;
  slug: string;
  logo?: RawImage;
  sector?: string;
  shortSector?: string;
  city: string;
  founded?: number;
  employees?: string;
  website?: string;
  linkedin?: string;
  description?: string;
  verified?: boolean;
  updatedAt?: string;
}

export interface RawAward {
  _id: string;
  name: string;
  fullName?: string;
  slug: string;
  type: "ranking" | "premio" | "certificacion";
  category: string;
  organizer?: string;
  scope?: string;
  periodicity?: string;
  firstEdition?: number;
  website?: string;
  description: string;
  unit?: string;
  corporate?: boolean;
  family?: { key?: string; label?: string };
  about?: TitledText[];
  nextEdition?: { year?: number; steps?: { when: string; what: string }[]; note?: string };
  call?: { status?: "abierta" | "proxima" | "cerrada"; edition?: string; closesAt?: string };
}

export interface RawResult {
  org?: string;
  orgName?: string;
  name?: string;
  position?: number;
  level?: string;
  label?: string;
  category?: string;
  sector?: string;
  score?: number;
  change?: string;
}

export interface RawEdition {
  _id: string;
  award: string;
  year: number;
  number?: number;
  publishedAt: string;
  total?: number;
  summary?: string;
  intro?: string;
  sourceUrl?: string;
  methodology?: { text?: string; weights?: { label: string; value: number }[] };
  results?: RawResult[];
}

export interface RawEvent {
  _id: string;
  name: string;
  shortName: string;
  slug: string;
  type: "gala" | "foro" | "taller" | "encuentro";
  date: string;
  time?: string;
  organizer?: string;
  city: string;
  venue: string;
  edition?: { award: string; year: number };
  hasPage?: boolean;
  page?: {
    title?: string[];
    highlight?: string;
    dek?: string;
    summary?: string;
    access?: string;
    venueDetails?: { name?: string; address?: string; note?: string; mapUrl?: string };
    delivers?: { text?: string; items?: Fact[] };
    program?: { time: string; title: string; detail?: string }[];
    follow?: TitledText[];
  };
  streamUrl?: string;
}

export interface RawMovement {
  person: string;
  role: string;
  organization?: string;
  photo?: RawImage;
}

export interface RawIssue {
  number: number;
  date: string;
  title: string;
  url?: string;
}

export interface RawEditorialPage {
  _id: string;
  group: "institucional" | "participa";
  menuLabel: string;
  slug: string;
  seo?: { title?: string; description?: string; noIndex?: boolean };
  eyebrow?: string;
  title: string;
  lead?: string;
  sections?: { _key: string; title: string; body?: PtBlock[]; rows?: { key?: string; value?: string }[] }[];
  form?: string;
  formCopy?: { submit?: string; note?: string; successEyebrow?: string; successTitle?: string; successText?: string };
  footnote?: { text?: string; link?: Link };
  newsletterText?: string;
}

export interface RawEditorial {
  settings: RawSettings | null;
  front: RawFront | null;
  articles: RawArticle[];
  organizers: RawOrganizer[];
  organizations: RawOrganization[];
  awards: RawAward[];
  editions: RawEdition[];
  events: RawEvent[];
  movements: RawMovement[];
  issues: RawIssue[];
  pages: RawEditorialPage[];
}
