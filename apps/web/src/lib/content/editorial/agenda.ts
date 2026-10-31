import type { EditorialBlock } from "@microsites/ui/editorial";
import {
  EVENT_TYPE_FILTER,
  EVENT_TYPE_LABEL,
  daysUntil,
  editionHref,
  eventHref,
  longDay,
  monthName,
  parts,
  type EditorialContent,
  type EventRecord,
} from "./content";
import { newsletterBlock, type ListingPage } from "./shared";

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** Build-time text of a countdown (the browser recomputes it on every visit). */
function countdownText(iso: string, mode: "days" | "flag"): string {
  const days = daysUntil(iso);
  if (mode === "days") return String(Math.max(0, days));
  return days < 0 ? "Finalizado" : days === 0 ? "Hoy" : days <= 45 ? `Quedan ${days} días` : `En ${Math.round(days / 7)} semanas`;
}

const icsName = (e: EventRecord) => `${e.slug}.ics`;

/** The event shown as "Destacado": the one chosen on the front page, or the next gala with its own page. */
const featuredEvent = (c: EditorialContent) => {
  const chosen = c.eventById(c.front.featuredEvent);
  return chosen && chosen.hasPage ? chosen : c.upcomingEvents.find((e) => e.hasPage && e.type === "gala") ?? c.upcomingEvents.find((e) => e.hasPage);
};

/** "/eventos": agenda with list and month views. */
export function agendaPage(c: EditorialContent, siteName: string): ListingPage {
  const hub = c.settings.eventos;
  const events = c.upcomingEvents;
  const featured = featuredEvent(c);
  const monthKeys = [...new Set(events.map((e) => e.date.slice(0, 7)))].sort();
  const months = monthKeys.map((key) => {
    const [y, m] = key.split("-").map(Number);
    const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
    return { key, label: `${monthName(m)} ${y}`, offset: (first + 6) % 7, days: new Date(Date.UTC(y, m, 0)).getUTCDate() };
  });
  const types = [...new Set(events.map((e) => e.type))];

  const blocks: EditorialBlock[] = [
    {
      _type: "edDirectoryIntro",
      eyebrow: hub?.eyebrow ?? "",
      title: hub?.title?.join(" ") || "Eventos",
      text: hub?.text ?? "",
      sideWidth: 420,
      totals: [
        { value: String(events.length), label: "eventos en agenda" },
        { value: String(events.filter((e) => e.type === "gala").length), label: "galas de premiación" },
        { value: String(new Set(events.map((e) => e.city)).size), label: "ciudades" },
      ],
    },
  ];
  if (featured) {
    const year = featured.date.slice(0, 4);
    const title = featured.page!.title!;
    blocks.push({
      _type: "edEventFeature",
      eyebrow: `Destacado · ${EVENT_TYPE_LABEL[featured.type]}`,
      // The first two title lines, the second one with the year (e.g. "Gala Merco" / "Empresas 2026").
      title: title.length > 1 ? [title[0], title[1].includes(year) ? title[1] : `${title[1]} ${year}`] : [`${title[0]} ${year}`],
      highlight: year,
      text: featured.page?.summary ?? featured.page?.dek ?? "",
      cta: featured.type === "gala" ? "Ver la gala" : "Ver el evento",
      href: eventHref(featured.slug),
      countdown: { label: "Quedan", unit: "Días", date: featured.date, fallback: countdownText(featured.date, "days") },
      facts: [
        { label: "Fecha", value: longDay(featured.date) },
        ...(featured.time ? [{ label: "Hora", value: featured.time }] : []),
        { label: "Sede", value: `${featured.venue} · ${featured.city}` },
      ],
    });
  }
  blocks.push(
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
              cities: ["Todas", ...new Set(events.map((e) => e.city))].slice(0, 4),
              months,
              weekdays: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
              events: events.map((e) => ({
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
                href: e.hasPage ? eventHref(e.slug) : undefined,
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
            { _type: "edCoverageList", title: "Ya pasó · Coberturas", items: c.coverages, more: { label: "Todas las coberturas", href: "/actualidad" } },
            {
              _type: "edCtaBox",
              variant: "plain",
              block: true,
              eyebrow: "Suscríbete al calendario",
              title: [],
              text: `Añade la agenda de ${siteName} a tu calendario y recibe cada evento nuevo automáticamente.`,
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
    { ...newsletterBlock(c, hub?.newsletterText), spaceTop: 80 },
  );
  return { path: "eventos", title: `${siteName} · Eventos`, blocks, section: "/eventos" };
}

/** "/eventos/<slug>": event page (before the event). */
export function eventPages(c: EditorialContent, siteName: string): ListingPage[] {
  const newsText = c.settings.eventos?.newsletterText;
  return c.events
    .filter((e) => e.hasPage)
    .map((e) => {
      const f = e.page!;
      const edition = c.editionOf(e);
      const awardDoc = edition && c.award(edition.award);
      const news = awardDoc ? c.newsAbout([e.id, awardDoc.id, edition.id], awardDoc.name).slice(0, 3) : c.newsAbout([e.id], e.name).slice(0, 3);
      const previous = c.previousGalas(e);
      const venue = f.venueDetails;

      const section = (blocks: EditorialBlock[]): EditorialBlock => ({ _type: "edColumns", columns: [{ gap: 20, blocks }] });
      const main: EditorialBlock[] = [];
      if (f.delivers?.text || f.delivers?.items?.length) {
        main.push(section([{ _type: "edSectionHeader", title: "Qué se entrega" }, { _type: "edStatRow", text: f.delivers.text ?? "", items: f.delivers.items ?? [] }]));
      }
      if (f.program?.length) {
        main.push(section([{ _type: "edSectionHeader", title: "Programa" }, { _type: "edProgram", items: f.program, note: "Horarios referenciales, sujetos a confirmación del organizador." }]));
      }
      if (f.follow?.length) {
        main.push(section([{ _type: "edSectionHeader", title: "Cómo seguirla" }, { _type: "edNumberedColumns", variant: "cards", items: f.follow.map((x) => ({ title: x.title, text: x.text ?? "" })) }]));
      }
      if (venue?.name) {
        main.push(
          section([
            { _type: "edSectionHeader", title: "La sede" },
            {
              _type: "edVenue",
              image: `Foto del ${venue.name.replace(` ${e.city}`, "")}`,
              name: venue.name,
              address: (venue.address ?? "").split("\n").filter(Boolean),
              note: venue.note ?? "",
              map: venue.mapUrl ? { label: "Cómo llegar", href: venue.mapUrl } : undefined,
            },
          ]),
        );
      }

      const aside: EditorialBlock[] = [];
      if (edition && awardDoc) {
        aside.push({
          _type: "edHighlightBox",
          eyebrow: `Edición ${edition.year}`,
          title: `Las ${edition.total} ${awardDoc.unit} ya se conocen`,
          items: edition.results.slice(0, 3).map((r) => ({ mark: c.resultMark(r), name: r.name })),
          more: { label: `Ver ${awardDoc.type === "ranking" ? "el ranking" : "los ganadores"} ${edition.year}`, href: editionHref(edition) },
        });
      }
      if (previous.length) aside.push({ _type: "edYearLinks", title: e.type === "gala" ? "Galas anteriores" : "Ediciones anteriores", items: previous });
      if (news.length) aside.push({ _type: "edNewsList", title: "Noticias", items: news.map((a) => c.teaser(a)) });

      const { y } = parts(e.date);
      const days = daysUntil(e.date);
      const blocks: EditorialBlock[] = [
        {
          _type: "edEventHero",
          breadcrumb: [{ label: "Inicio", href: "/" }, { label: "Eventos", href: "/eventos" }, { label: e.name }],
          status: days > 0 ? "Próxima" : days === 0 ? "Hoy" : "Finalizada",
          eyebrow: e.type === "gala" ? "Gala de entrega" : EVENT_TYPE_LABEL[e.type],
          title: f.title!,
          highlight: f.highlight,
          text: f.dek ?? "",
          facts: [
            { label: "Fecha", value: `${longDay(e.date).replace(/^(\S+)/, "$1,")} de ${y}${e.time ? ` · ${e.time}` : ""}` },
            { label: "Sede", value: `${venue?.name?.replace(` ${e.city}`, "") ?? e.venue} · ${e.city}` },
            { label: "Organiza", value: e.organizer },
            ...(f.access ? [{ label: "Acceso", value: f.access }] : []),
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
        { ...newsletterBlock(c, newsText), spaceTop: 80 },
      ];
      return { path: `eventos/${e.slug}`, title: `${siteName} · ${f.title!.join(" ")}`, description: f.summary ?? f.dek, blocks, section: "/eventos" };
    });
}

/** iCalendar file with the given events (agenda feed or one event). */
function icsCalendar(events: EventRecord[], name: string, siteName: string, siteUrl: string): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const host = new URL(siteUrl).hostname;
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", `PRODID:-//${siteName}//Agenda//ES`, `X-WR-CALNAME:${esc(name)}`, "X-WR-TIMEZONE:America/Guayaquil"];
  for (const e of events) {
    const day = e.date.replace(/-/g, "");
    const [h, min] = (e.time ?? "").split(":");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.slug}@${host}`,
      `DTSTAMP:${stamp}`,
      e.time ? `DTSTART;TZID=America/Guayaquil:${day}T${h}${min}00` : `DTSTART;VALUE=DATE:${day}`,
      `SUMMARY:${esc(e.name)}`,
      `LOCATION:${esc(`${e.venue}, ${e.city}`)}`,
      `DESCRIPTION:${esc(`${EVENT_TYPE_LABEL[e.type]} · ${e.organizer}`)}`,
      ...(e.hasPage ? [`URL:${new URL(eventHref(e.slug), siteUrl).href}`] : []),
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

/** Calendar files: the upcoming agenda and one per event page. */
export function calendarFiles(c: EditorialContent, siteName: string, siteUrl: string) {
  const type = "text/calendar; charset=utf-8";
  return [
    { filename: "agenda.ics", content: icsCalendar(c.upcomingEvents, `Agenda ${siteName}`, siteName, siteUrl), contentType: type },
    ...c.events.filter((e) => e.hasPage).map((e) => ({ filename: icsName(e), content: icsCalendar([e], e.name, siteName, siteUrl), contentType: type })),
  ];
}
