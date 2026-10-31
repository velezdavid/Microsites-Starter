/**
 * Registry blocks: awards, editions and their results (ranking / directory sites).
 */
import type { ArticleTeaser, EdLink, MedalLevel } from "./types";

/** Search box over the registry (results filtered in the browser). */
export interface EdRegistrySearch {
  label: string;
  placeholder: string;
  button: string;
  suggestionsLabel: string;
  suggestions: string[];
  empty: string;
  more?: EdLink;
  /** Searchable entries. */
  index: { title: string; detail: string; result: string; href: string }[];
}

export interface EdHubIntroBlock {
  _type: "edHubIntro";
  eyebrow: string;
  /** Title lines; the last one uses the accent color. */
  lines: string[];
  text?: string;
  search?: EdRegistrySearch;
  totals?: { value: string; label: string }[];
}

export interface EdEditionCardsBlock {
  _type: "edEditionCards";
  items: {
    type: string;
    date: string;
    name: string;
    summary: string;
    top: { mark: string; name: string }[];
    cta: string;
    href: string;
  }[];
}

export interface EdAwardTableBlock {
  _type: "edAwardTable";
  anchor?: string;
  eyebrow: string;
  title: string;
  note: string;
  columns: [string, string, string, string, string];
  /** Filter chips; the first one shows everything. */
  filters: string[];
  rows: { name: string; type: string; category: string; organizer: string; edition: string; winner: string; href: string }[];
  footer?: { text: string; cta: EdLink };
}

export interface EdLeaderListBlock {
  _type: "edLeaderList";
  eyebrow: string;
  title: string;
  items: { name: string; leader: string; edition: string; href: string }[];
  more?: EdLink;
}

export interface EdAgendaPanelBlock {
  _type: "edAgendaPanel";
  eyebrow: string;
  title: string;
  items: { day: string; month: string; name: string; place: string; flag: string; soon?: boolean; href?: string }[];
  more?: EdLink;
}

/** Page header of a registry record (award, edition, organization). */
export interface EdRecordHeaderBlock {
  _type: "edRecordHeader";
  eyebrow: string;
  /** Title lines. */
  lines: string[];
  /** Text of the title shown in the accent color. */
  highlight?: string;
  /** Short accent rule under the title. */
  rule?: boolean;
  text?: string;
  facts: { label: string; value: string }[];
  link?: EdLink;
  /** Width of the facts column. */
  asideWidth?: number;
  /** Bottom-align both columns (edition) instead of top (award). */
  alignEnd?: boolean;
  /** Space below, in px. */
  spaceBottom?: number;
  titleSize?: "md" | "lg";
}

/** Bar of section tabs, optionally with a group of chips on the right (edition years). */
export interface EdTabBarBlock {
  _type: "edTabBar";
  items: (EdLink & { current?: boolean })[];
  chips?: { label: string; items: (EdLink & { current?: boolean })[] };
  /** Inset bar (edition page) instead of full width. */
  inset?: boolean;
  gap?: number;
  spaceTop?: number;
}

export interface EdLatestEditionBlock {
  _type: "edLatestEdition";
  eyebrow: string;
  status: string;
  year: string;
  detail: string;
  cta: EdLink;
  top: { position: string; name: string; detail: string; href?: string }[];
}

export interface EdEditionsTableBlock {
  _type: "edEditionsTable";
  columns: [string, string, string, string];
  rows: { year: string; winner: string; count: string; date: string; href: string }[];
}

export interface EdHeatmapBlock {
  _type: "edHeatmap";
  years: string[];
  totalLabel: string;
  rows: { name: string; cells: (0 | 1 | 2)[]; href?: string }[];
  legend: [string, string, string];
}

export interface EdNumberedColumnsBlock {
  _type: "edNumberedColumns";
  /** "cards": separate columns with an ink rule on top; "big": large accent numbers. */
  variant?: "cards" | "big";
  items: { title: string; text: string }[];
}

export interface EdTimelineBlock {
  _type: "edTimeline";
  title: string;
  heading: string;
  steps: { when: string; what: string }[];
  note?: string;
}

export interface EdOrganizerBlock {
  _type: "edOrganizer";
  title: string;
  name: string;
  detail: string;
  siblingsLabel?: string;
  siblings: EdLink[];
}

export interface EdCtaBoxBlock {
  _type: "edCtaBox";
  /** "plain": no background, ink rule on top. */
  variant?: "plain";
  eyebrow?: string;
  /** Title lines. */
  title: string | string[];
  text: string;
  cta: EdLink;
  /** Dark variant. */
  dark?: boolean;
  /** Full-width button. */
  block?: boolean;
}

export interface EdPodiumBlock {
  _type: "edPodium";
  items: { position: number; name: string; detail: string; score?: string; change?: string; href?: string }[];
}

export interface EdResultsTableBlock {
  _type: "edResultsTable";
  searchPlaceholder: string;
  filters: string[];
  columns: [string, string, string, string, string];
  rows: { position: number; name: string; sector: string; score: string; change: string; href?: string }[];
  /** Rows shown before filtering (the podium covers the top ones). */
  skip?: number;
  highlight?: number;
  count: string;
  empty: string;
  more?: EdLink;
  note?: string;
}

export interface EdWeightsBlock {
  _type: "edWeights";
  title: string;
  text?: string;
  items: { label: string; value: number }[];
  more?: EdLink;
}

export interface EdLabeledListBlock {
  _type: "edLabeledList";
  title: string;
  items: { label: string; name: string; value?: string; href?: string }[];
}

export interface EdCardGridBlock {
  _type: "edCardGrid";
  columns?: number;
  items: { eyebrow: string; title: string; detail: string; href: string }[];
}

/** Compact article list for sidebars ("Noticias del ranking"). */
export interface EdNewsListBlock {
  _type: "edNewsList";
  title: string;
  items: ArticleTeaser[];
}


/** Directory header: big title with search box (filters the directory on the page) and totals. */
export interface EdDirectoryIntroBlock {
  _type: "edDirectoryIntro";
  eyebrow: string;
  title: string;
  text?: string;
  /** Search box that filters the directory below (omit for no search). */
  search?: { placeholder: string; button: string };
  totals: { value: string; label: string }[];
  /** Width of the right column in px (default 500). */
  sideWidth?: number;
}

export interface EdRecentListBlock {
  _type: "edRecentList";
  title: string;
  more?: EdLink;
  items: { date: string; name: string; result: string; award: string; href: string }[];
}

/** Filterable organization directory (search from EdDirectoryIntro, sector counts from EdSectorCounts). */
export interface EdDirectoryBlock {
  _type: "edDirectory";
  title: string;
  sortLabel: string;
  /** [most recognized, A–Z]. */
  sorts: [string, string];
  sectorLabel: string;
  sectors: string[];
  cityLabel: string;
  cities: string[];
  verifiedLabel: string;
  verifiedBadge: string;
  columns: [string, string, string, string, string];
  rows: { initials: string; name: string; href: string; verified: boolean; sector: string; city: string; count: number; last: string }[];
  /** "Mostrando {n} de 96 empresas". */
  count: string;
  empty: string;
  loadMore: string;
  pageSize: number;
}

export interface EdSectorCountsBlock {
  _type: "edSectorCounts";
  title: string;
  items: { label: string; count: number }[];
}

export interface EdOrgHeaderBlock {
  _type: "edOrgHeader";
  eyebrow: string;
  verified?: string;
  name: string;
  meta: string;
  links: EdLink[];
  medalsTitle: string;
  medalsRange: string;
  medals: { level: MedalLevel; label: string; count: number }[];
}

export interface EdRecognitionsBlock {
  _type: "edRecognitions";
  /** First filter shows everything; the rest match `type`. */
  filters: { label: string; type?: string }[];
  years: { year: string; items: { award: string; category: string; type: string; level: MedalLevel; result: string; href?: string }[] }[];
}

export interface EdPositionsBlock {
  _type: "edPositions";
  label: string;
  years: string[];
  rows: { name: string; values: string[]; href?: string }[];
}

export interface EdAboutBoxBlock {
  _type: "edAboutBox";
  title: string;
  text?: string;
  facts: { label: string; value: string }[];
}

export interface EdRankedListBlock {
  _type: "edRankedList";
  title: string;
  items: { name: string; count: string; href?: string; current?: boolean }[];
  highlight?: number;
}


/** Days until a date, computed in the browser. */
export interface EdCountdown {
  /** ISO date. */
  date: string;
  /** Build-time text, replaced in the browser. */
  fallback: string;
}

export interface EdEventFeatureBlock {
  _type: "edEventFeature";
  eyebrow: string;
  title: string[];
  highlight?: string;
  text: string;
  cta: string;
  href: string;
  countdown: EdCountdown & { label: string; unit: string };
  facts: { label: string; value: string }[];
}

export interface EdAgendaEvent {
  date: string;
  day: string;
  weekday: string;
  type: string;
  typeLabel: string;
  name: string;
  short: string;
  organizer: string;
  city: string;
  venue: string;
  href?: string;
  /** Highlighted in the month view. */
  strong?: boolean;
  countdown: EdCountdown;
}

/** Agenda with list / month views and type + city filters. */
export interface EdAgendaBlock {
  _type: "edAgenda";
  title: string;
  views: [string, string];
  typeLabel: string;
  types: { value: string; label: string }[];
  cityLabel: string;
  cities: string[];
  months: { key: string; label: string; offset: number; days: number }[];
  weekdays: string[];
  events: EdAgendaEvent[];
  empty: string;
  legend: [string, string];
  prevLabel: string;
  nextLabel: string;
}

export interface EdCoverageListBlock {
  _type: "edCoverageList";
  title: string;
  items: { date: string; kind: string; title: string; href: string }[];
  more?: EdLink;
}

/** Dark header of an event page, with breadcrumb, facts and countdown. */
export interface EdEventHeroBlock {
  _type: "edEventHero";
  breadcrumb: { label: string; href?: string }[];
  status: string;
  eyebrow: string;
  title: string[];
  highlight?: string;
  text: string;
  facts: { label: string; value: string }[];
  countdown?: EdCountdown & { label: string };
}

export interface EdActionBarBlock {
  _type: "edActionBar";
  actions: (EdLink & { primary?: boolean; download?: boolean })[];
}

export interface EdStatRowBlock {
  _type: "edStatRow";
  text?: string;
  items: { value: string; label: string }[];
}

export interface EdProgramBlock {
  _type: "edProgram";
  items: { time: string; title: string; detail?: string }[];
  note?: string;
}

export interface EdVenueBlock {
  _type: "edVenue";
  image: string;
  name: string;
  address: string[];
  note?: string;
  map?: EdLink;
}

export interface EdHighlightBoxBlock {
  _type: "edHighlightBox";
  eyebrow: string;
  title: string;
  items: { mark: string; name: string }[];
  more?: EdLink;
}

/** Two-line heading with an ink rule ("EN CADA EDICIÓN / QUÉ RECIBES"). */
export interface EdHeadingBlock {
  _type: "edHeading";
  eyebrow: string;
  title: string;
  size?: "md" | "lg";
}

export interface EdYearLinksBlock {
  _type: "edYearLinks";
  title: string;
  items: { year: string; detail: string; href?: string }[];
}


/* ---------- Forms (Netlify Forms) ---------- */

export interface EdFormField {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select" | "url";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  /** Takes the whole row (default: half). */
  full?: boolean;
  error?: string;
}

export interface EdForm {
  /** Netlify Forms name. */
  name: string;
  fields: EdFormField[];
  /** Optional checkbox (e.g. alerts). */
  checkbox?: { name: string; label: string; checked?: boolean };
  submit: string;
  note?: string;
  success: { eyebrow?: string; title: string; text: string };
}

export interface EdNewsletterHeroBlock {
  _type: "edNewsletterHero";
  eyebrow: string;
  title: string[];
  text: string;
  totals: { value: string; label: string }[];
  formTitle: string;
  form: EdForm;
}

export interface EdArchiveBlock {
  _type: "edArchive";
  eyebrow: string;
  title: string;
  searchPlaceholder: string;
  items: { number: string; title: string; date: string; href?: string }[];
  empty: string;
  more?: EdLink;
}

/** Text page with section menu and table of contents (institutional, forms). */
export interface EdDocPageBlock {
  _type: "edDocPage";
  menuTitle: string;
  menu: (EdLink & { current?: boolean })[];
  eyebrow: string;
  title: string;
  lead?: string;
  sections: { id: string; title: string; paragraphs: string[]; rows?: { label: string; value: string }[] }[];
  form?: EdForm;
  footnote?: { text: string; link?: EdLink };
  tocTitle?: string;
}

/** Long-form feature (sponsored reports): full-bleed photo and a centered column. */
export type EdFeatureNode =
  | { _type: "p"; text: string; html?: string; dropCap?: boolean; closing?: boolean }
  | { _type: "h2"; text: string }
  | { _type: "pullQuote"; text: string; author?: string; role?: string }
  | { _type: "imagePair"; images: { label: string; caption?: string; ratio: string; src?: string; alt?: string }[]; weights: [number, number] }
  | { _type: "recordList"; title: string; more?: EdLink; items: { year: string; award: string; level: MedalLevel; result: string; href?: string }[] }
  | { _type: "sponsor"; label: string; logo: string; note: string };

export interface EdFeatureArticleBlock {
  _type: "edFeatureArticle";
  image: { label: string; caption?: string; credit?: string; src?: string; alt?: string };
  eyebrow: string;
  title: string;
  highlight?: string;
  dek: string;
  author: string;
  meta: string;
  shareUrl: string;
  body: EdFeatureNode[];
}

export type RegistryBlock =
  | EdHubIntroBlock
  | EdEditionCardsBlock
  | EdAwardTableBlock
  | EdLeaderListBlock
  | EdAgendaPanelBlock
  | EdRecordHeaderBlock
  | EdTabBarBlock
  | EdLatestEditionBlock
  | EdEditionsTableBlock
  | EdHeatmapBlock
  | EdNumberedColumnsBlock
  | EdTimelineBlock
  | EdOrganizerBlock
  | EdCtaBoxBlock
  | EdPodiumBlock
  | EdResultsTableBlock
  | EdWeightsBlock
  | EdLabeledListBlock
  | EdCardGridBlock
  | EdNewsListBlock
  | EdDirectoryIntroBlock
  | EdRecentListBlock
  | EdDirectoryBlock
  | EdSectorCountsBlock
  | EdOrgHeaderBlock
  | EdRecognitionsBlock
  | EdPositionsBlock
  | EdAboutBoxBlock
  | EdRankedListBlock
  | EdEventFeatureBlock
  | EdAgendaBlock
  | EdCoverageListBlock
  | EdEventHeroBlock
  | EdActionBarBlock
  | EdStatRowBlock
  | EdProgramBlock
  | EdVenueBlock
  | EdHighlightBoxBlock
  | EdYearLinksBlock
  | EdHeadingBlock
  | EdNewsletterHeroBlock
  | EdArchiveBlock
  | EdDocPageBlock
  | EdFeatureArticleBlock;

export type { MedalLevel };
