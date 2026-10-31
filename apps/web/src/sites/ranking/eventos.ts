import type { EditorialBlock } from "@microsites/ui/editorial";
import type { ListingPage } from "./actualidad";
import { ARTICLES_BY_DATE, teaser } from "./content";
import {
  COVERAGES,
  EVENT_TYPE_FILTER,
  EVENT_TYPE_LABEL,
  EVENTS,
  FEATURED_EVENT,
  eventHref,
  hasPage,
  icsCalendar,
  longDay,
  monthName,
  parts,
  type EventRecord,
  type EventType,
} from "./events";
import { award, EDITIONS, editionHref, resultMark } from "./registry";
import { newsletterBlock } from "./shared";

const NEWSLETTER = "Cada lunes: premios, rankings, eventos y convocatorias de las empresas en Ecuador.";
const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** Build-time text of a countdown (the browser recomputes it every visit). */
function countdownText(iso: string, mode: "days" | "flag"): string {
  const { y, m, d } = parts(iso);
  const now = new Date();
  const days = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
  if (mode === "days") return String(Math.max(0, days));
  return days < 0 ? "Finalizado" : days === 0 ? "Hoy" : days <= 45 ? `Quedan ${days} días` : `En ${Math.round(days / 7)} semanas`;
}

const icsName = (e: EventRecord) => `${e.slug}.ics`;

/** "/eventos": agenda with list and month views. */
export function agendaPage(): ListingPage {
  const featured = EVENTS.find((e) => e.slug === FEATURED_EVENT)!;
  const monthKeys = [...new Set(EVENTS.map((e) => e.date.slice(0, 7)))].sort();
  const months = monthKeys.map((key) => {
    const [y, m] = key.split("-").map(Number);
    const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
    return { key, label: `${monthName(m)} ${y}`, offset: (first + 6) % 7, days: new Date(Date.UTC(y, m, 0)).getUTCDate() };
  });
  const types = [...new Set(EVENTS.map((e) => e.type))] as EventType[];

  const blocks: EditorialBlock[] = [
    {
      _type: "edDirectoryIntro",
      eyebrow: "Agenda",
      title: "Eventos",
      text: "Las galas de premiación, foros y encuentros donde se reconoce y se discute el liderazgo empresarial en el país.",
      sideWidth: 420,
      totals: [
        { value: String(EVENTS.length), label: "eventos en agenda" },
        { value: String(EVENTS.filter((e) => e.type === "gala").length), label: "galas de premiación" },
        { value: String(new Set(EVENTS.map((e) => e.city)).size), label: "ciudades" },
      ],
    },
    {
      _type: "edEventFeature",
      eyebrow: `Destacado · ${EVENT_TYPE_LABEL[featured.type]}`,
      title: featured.featured!.title.slice(0, 2).map((l, i) => (i === 1 ? `${l} ${featured.date.slice(0, 4)}` : l)),
      highlight: featured.date.slice(0, 4),
      text: featured.featured!.summary,
      cta: "Ver la gala",
      href: eventHref(featured.slug),
      countdown: { label: "Quedan", unit: "Días", date: featured.date, fallback: countdownText(featured.date, "days") },
      facts: [
        { label: "Fecha", value: longDay(featured.date) },
        ...(featured.time ? [{ label: "Hora", value: featured.time }] : []),
        { label: "Sede", value: `${featured.venue} · ${featured.city}` },
      ],
    },
    {
      _type: "edColumns",
      spaceTop: 64,
      dividers: true,
      alignTop: true,
      gap: "clamp(20px,3.75vw,48px)",
      columns: [
        {
          width: "1fr",
          blocks: [
            {
              _type: "edAgenda",
              title: "Próximos eventos",
              views: ["Lista", "Mes"],
              typeLabel: "Tipo",
              types: [{ value: "", label: "Todos" }, ...types.map((t) => ({ value: t, label: EVENT_TYPE_FILTER[t] }))],
              cityLabel: "Ciudad",
              cities: ["Todas", ...new Set(EVENTS.map((e) => e.city))].slice(0, 4),
              months,
              weekdays: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
              events: EVENTS.map((e) => ({
                date: e.date,
                day: String(parts(e.date).d).padStart(2, "0"),
                weekday: WEEKDAYS[parts(e.date).weekday],
                type: e.type,
                typeLabel: EVENT_TYPE_LABEL[e.type],
                name: e.name,
                short: e.short,
                organizer: e.organizer,
                city: e.city,
                venue: e.venue,
                href: hasPage(e) ? eventHref(e.slug) : undefined,
                strong: e.type === "gala",
                countdown: { date: e.date, fallback: countdownText(e.date, "flag") },
              })),
              empty: "No hay eventos con esos filtros.",
              legend: ["Gala de premiación", "Otros eventos"],
              prevLabel: "← Anterior",
              nextLabel: "Siguiente →",
            },
          ],
        },
        {
          width: "300px",
          aside: true,
          gap: "clamp(20px,3.13vw,40px)",
          blocks: [
            { _type: "edCoverageList", title: "Ya pasó · Coberturas", items: COVERAGES, more: { label: "Todas las coberturas", href: "/actualidad" } },
            {
              _type: "edCtaBox",
              variant: "plain",
              block: true,
              eyebrow: "Suscríbete al calendario",
              title: [],
              text: "Añade la agenda de ranking.ec a tu calendario y recibe cada evento nuevo automáticamente.",
              cta: { label: "Añadir al calendario", href: "/agenda.ics" },
            },
            {
              _type: "edCtaBox",
              dark: true,
              block: true,
              eyebrow: "Para organizadores",
              title: ["¿Organizas", "un evento?"],
              text: "Envía fecha, sede y programa. Lo publicamos en la agenda tras verificarlo.",
              cta: { label: "Publicar un evento", href: "/participa/envia-tu-informacion" },
            },
          ],
        },
      ],
    },
    { ...newsletterBlock(NEWSLETTER), spaceTop: 80 },
  ];
  return { path: "eventos", title: "ranking.ec · Eventos", blocks };
}

/** "/eventos/<slug>": event page (before the event). */
export function eventPages(): ListingPage[] {
  return EVENTS.filter(hasPage).map((e) => {
    const f = e.featured!;
    const edition = e.award && EDITIONS.find((x) => x.award === e.award!.slug && x.year === e.award!.year);
    const awardName = e.award ? award(e.award.slug).name : undefined;
    const news = ARTICLES_BY_DATE.filter((a) => awardName && `${a.kicker} ${a.title}`.toLowerCase().includes(awardName.toLowerCase()))
      .slice(0, 3)
      .map((a) => teaser(a.slug));

    const section = (blocks: EditorialBlock[]): EditorialBlock => ({ _type: "edColumns", columns: [{ gap: 20, blocks }] });
    const main: EditorialBlock[] = [];
    if (e.delivers) main.push(section([{ _type: "edSectionHeader", title: "Qué se entrega" }, { _type: "edStatRow", text: e.delivers.text, items: e.delivers.items }]));
    if (e.program) {
      main.push(
        section([
          { _type: "edSectionHeader", title: "Programa" },
          { _type: "edProgram", items: e.program, note: "Horarios referenciales, sujetos a confirmación del organizador." },
        ]),
      );
    }
    if (e.follow) main.push(section([{ _type: "edSectionHeader", title: "Cómo seguirla" }, { _type: "edNumberedColumns", variant: "cards", items: e.follow }]));
    if (e.venueInfo) {
      main.push(
        section([
          { _type: "edSectionHeader", title: "La sede" },
          {
            _type: "edVenue",
            image: `Foto del ${e.venueInfo.name.replace(/ Guayaquil$/, "")}`,
            name: e.venueInfo.name,
            address: e.venueInfo.address,
            note: e.venueInfo.note,
            map: { label: "Cómo llegar", href: e.venueInfo.map },
          },
        ]),
      );
    }

    const aside: EditorialBlock[] = [];
    if (edition) {
      aside.push({
        _type: "edHighlightBox",
        eyebrow: `Edición ${edition.year}`,
        title: `Las ${edition.total} empresas ya se conocen`,
        items: edition.results.slice(0, 3).map((r) => ({ mark: resultMark(r), name: r.name })),
        more: { label: `Ver el ranking ${edition.year}`, href: editionHref(edition) },
      });
    }
    if (e.previous?.length) aside.push({ _type: "edYearLinks", title: "Galas anteriores", items: e.previous.map((p) => ({ year: String(p.year), detail: p.detail, href: p.href })) });
    if (news.length) aside.push({ _type: "edNewsList", title: "Noticias", items: news });

    const { y } = parts(e.date);
    const blocks: EditorialBlock[] = [
      {
        _type: "edEventHero",
        breadcrumb: [{ label: "Inicio", href: "/" }, { label: "Eventos", href: "/eventos" }, { label: e.name }],
        status: "Próxima",
        eyebrow: e.type === "gala" ? "Gala de entrega" : EVENT_TYPE_LABEL[e.type],
        title: f.title,
        highlight: f.highlight,
        text: f.dek,
        facts: [
          { label: "Fecha", value: `${longDay(e.date).replace(/^(\S+)/, "$1,")} de ${y}${e.time ? ` · ${e.time}` : ""}` },
          { label: "Sede", value: `${e.venueInfo?.name.replace(` ${e.city}`, "") ?? e.venue} · ${e.city}` },
          { label: "Organiza", value: e.organizer },
          ...(e.access ? [{ label: "Acceso", value: e.access }] : []),
        ],
        countdown: { date: e.date, fallback: countdownText(e.date, "days"), label: e.type === "gala" ? "Días para la gala" : "Días para el evento" },
      },
      {
        _type: "edActionBar",
        actions: [
          { label: "Añadir al calendario", href: `/${icsName(e)}`, primary: true, download: true },
          { label: "Avísame cuando empiece", href: "/newsletter" },
        ],
      },
      {
        _type: "edColumns",
        spaceTop: 56,
        dividers: true,
        alignTop: true,
        gap: "clamp(20px,3.75vw,48px)",
        columns: [
          { width: "1fr", gap: "clamp(20px,5vw,64px)", blocks: main },
          { width: "300px", aside: true, gap: "clamp(20px,3.13vw,40px)", blocks: aside },
        ],
      },
      { ...newsletterBlock(NEWSLETTER), spaceTop: 80 },
    ];
    return { path: `eventos/${e.slug}`, title: `ranking.ec · ${f.title.join(" ")}`, blocks };
  });
}

/** Calendar files: the whole agenda and one per event page. */
export function calendarFiles(siteUrl: string) {
  return [
    { filename: "agenda.ics", content: icsCalendar(EVENTS, "Agenda ranking.ec", siteUrl), contentType: "text/calendar; charset=utf-8" },
    ...EVENTS.filter(hasPage).map((e) => ({ filename: icsName(e), content: icsCalendar([e], e.name, siteUrl), contentType: "text/calendar; charset=utf-8" })),
  ];
}
