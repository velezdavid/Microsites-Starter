import { toHTML, uriLooksSafe } from "@portabletext/to-html";
import type { Block, BlockBase, Decor } from "@microsites/ui";
import { cardAnchor, fillTemplate, type Catalog } from "./catalog";
import type { RawSection } from "./queries";

interface Context {
  catalog: Catalog;
  onHome: boolean;
}

const base = (s: RawSection): BlockBase => ({
  _key: s._key,
  anchor: s.anchor || undefined,
  tone: s.tone || undefined,
  decor: (s.decor as Decor[] | undefined) ?? undefined,
});

const list = <T>(value: T[] | undefined | null): T[] => value ?? [];
const pairs = (rows: { key?: string; value?: string }[] | undefined): [string, string][] =>
  list(rows).map((r) => [r.key ?? "", r.value ?? ""]);

const portableText = (body: unknown[]) =>
  toHTML(body as never, {
    components: {
      marks: {
        link: ({ children, value }) => {
          const href = String(value?.href ?? "");
          return uriLooksSafe(href) ? `<a href="${href}">${children}</a>` : children;
        },
      },
    },
  });

/** Maps a Sanity page-builder block to the props of its UI component. Unknown types are dropped. */
export function mapSection(s: RawSection, { catalog, onHome }: Context): Block | null {
  switch (s._type) {
    case "hero": {
      const aside = list<any>(s.aside)[0];
      return {
        ...base(s),
        _type: "hero",
        variant: s.variant,
        breadcrumb: s.breadcrumb?.length ? [...s.breadcrumb.map((c: any) => ({ label: c.label, href: c.href })), { label: s.title }] : undefined,
        eyebrow: s.eyebrow,
        title: s.title,
        titleHighlight: s.titleHighlight,
        lead: s.lead,
        text: s.text,
        actions: list(s.actions).map((a: any) => ({ label: a.label, href: a.href, style: a.style })),
        aside:
          aside?._type === "heroStatCard"
            ? { type: "stat", label: aside.label, value: aside.value, caption: aside.caption }
            : aside?._type === "heroStatTabs"
              ? {
                  type: "statTabs",
                  id: aside.id,
                  title: aside.title,
                  ariaLabel: aside.ariaLabel,
                  tabs: list<any>(aside.tabs).map((t) => ({ id: t.id, label: t.label, meta: t.meta, stats: list(t.stats) })),
                }
              : undefined,
      };
    }

    case "cardGrid":
      return {
        ...base(s),
        _type: "cardGrid",
        layout: s.layout,
        numbering: s.numbering,
        eyebrow: s.eyebrow,
        title: s.title,
        intro: s.intro,
        cards: list<any>(s.cards).map((c) => ({ title: c.title, text: c.text, highlight: c.highlight })),
        chips: s.chips?.length ? { label: s.chipsLabel ?? "", items: s.chips } : undefined,
      };

    case "statGrid":
      return {
        ...base(s),
        _type: "statGrid",
        layout: s.layout,
        eyebrow: s.eyebrow,
        title: s.title,
        items: list<any>(s.items).map((i) => ({ eyebrow: i.eyebrow, value: i.value, text: i.text, highlight: i.highlight })),
        highlights: s.highlights?.length ? { label: s.highlightsLabel ?? "", items: s.highlights } : undefined,
        source: s.source,
      };

    case "featureList": {
      const items = s.category
        ? catalog.itemsOf(s.category._ref).map((it) => {
            const href = catalog.pageHref(it);
            return { code: it.meta ?? "", title: it.title, text: it.text ?? "", link: href ? { label: s.linkLabel, href } : undefined };
          })
        : list<any>(s.items).map((it) => ({
            code: it.code,
            title: it.title,
            text: it.text,
            link: it.href ? { label: s.linkLabel, href: it.href } : undefined,
          }));
      return { ...base(s), _type: "featureList", eyebrow: s.eyebrow, title: s.title, intro: s.intro, items };
    }

    case "splitList":
      return {
        ...base(s),
        _type: "splitList",
        eyebrow: s.eyebrow,
        title: s.title,
        statement: s.statement,
        text: s.text,
        tiles: s.tiles,
        listLabel: s.listLabel,
        listStyle: s.listStyle,
        items: list(s.items),
      };

    case "variantCards":
      return {
        ...base(s),
        _type: "variantCards",
        eyebrow: s.eyebrow,
        title: s.title,
        note: s.note,
        cards: list<any>(s.cards).map((c) => ({ badge: c.badge, title: c.title, text: c.text, highlight: c.highlight, rows: pairs(c.rows) })),
      };

    case "specTable":
      return {
        ...base(s),
        _type: "specTable",
        eyebrow: s.eyebrow,
        title: s.title,
        rows: pairs(s.rows),
        notes: s.notes,
        tips: s.tips?.length ? { label: s.tipsLabel ?? "", items: s.tips } : undefined,
      };

    case "stepFlow":
      return { ...base(s), _type: "stepFlow", eyebrow: s.eyebrow, title: s.title, text: s.text, steps: list(s.steps), note: s.note };

    case "contactSection": {
      const f = s.form;
      return {
        ...base(s),
        _type: "contactSection",
        eyebrow: s.eyebrow,
        title: s.title,
        text: s.text,
        contact: { title: s.contactTitle, subtitle: s.contactSubtitle, email: s.email, emailSubject: s.emailSubject, note: s.note },
        form: f?.enabled
          ? {
              mode: "mailto",
              subject: f.subject ?? "",
              context: f.contextLabel ? [{ label: f.contextLabel, value: f.contextValue ?? "" }] : [],
              fields: list<any>(f.fields).map((x) => ({
                name: x.name,
                label: x.label,
                type: x.type,
                required: x.required,
                placeholder: x.placeholder,
                options: x.options,
              })),
              submitLabel: f.submitLabel ?? "",
              successMessage: f.successMessage ?? "",
            }
          : undefined,
      };
    }

    case "richText":
      return {
        ...base(s),
        _type: "richText",
        eyebrow: s.eyebrow,
        title: s.title,
        meta: s.meta,
        sections: list<any>(s.sections).map((x) => ({ title: x.title, html: portableText(list(x.body)) })),
      };

    case "catalogTabs":
      return {
        ...base(s),
        _type: "catalogTabs",
        id: s.anchor,
        eyebrow: s.eyebrow,
        title: s.title,
        intro: s.intro,
        ariaLabel: s.ariaLabel ?? "",
        tabs: catalog.itemsOf(s.category?._ref).map((it) => {
          const page = catalog.pageHref(it);
          return {
            id: it.slug,
            label: it.title,
            meta: it.meta,
            headline: it.headline ?? "",
            text: it.text ?? "",
            chipsLabel: s.chipsLabel,
            chips: it.chips,
            cardsLabel: s.cardsLabel,
            cards: list(it.recommended)
              .map((id) => catalog.item(id))
              .filter((r) => !!r)
              .map((r) => ({ eyebrow: r.meta, title: r.title, linkLabel: s.cardLinkLabel ?? "", ...catalog.link(r, onHome) })),
            cta: page ? { label: fillTemplate(s.ctaLabel, it.title), href: page } : undefined,
          };
        }),
      };

    case "catalogFilterGrid": {
      const filters = catalog.itemsOf(s.filterCategory?._ref);
      return {
        ...base(s),
        _type: "catalogFilterGrid",
        id: s.anchor,
        eyebrow: s.eyebrow,
        title: s.title,
        filterAriaLabel: s.filterAriaLabel ?? "",
        filters: [{ value: "all", label: s.allLabel ?? "" }, ...filters.map((f) => ({ value: f.slug, label: f.title }))],
        cards: catalog.itemsOf(s.category?._ref).map((it) => {
          const page = catalog.pageHref(it);
          return {
            id: cardAnchor(s, it),
            tags: catalog.relatedIn(it, s.filterCategory?._ref).map((f) => f.slug),
            eyebrow: it.meta,
            stat: [it.stat, it.statLabel].filter(Boolean).join(" ") || undefined,
            title: it.title,
            text: it.text ?? "",
            bullets: it.bullets,
            chips: catalog.relatedIn(it, s.chipsCategory?._ref).map((c) => ({ label: c.title, ...catalog.link(c, onHome) })),
            cta: page ? { label: fillTemplate(s.ctaLabel, it.title), href: page } : undefined,
          };
        }),
      };
    }

    case "catalogGrid":
      return {
        ...base(s),
        _type: "catalogGrid",
        eyebrow: s.eyebrow,
        title: s.title,
        items: catalog.itemsOf(s.category?._ref).map((it) => {
          const n = s.countCategory ? catalog.referencing(it, s.countCategory._ref).length : 0;
          return {
            title: it.title,
            stat: it.stat ?? "",
            statLabel: it.statLabel ?? "",
            text: it.text ?? "",
            primary: { label: s.primaryLabel ?? "", href: catalog.pageHref(it) ?? catalog.link(it, onHome).href },
            secondary: s.countCategory
              ? { label: `${n} ${n === 1 ? s.countSingular : s.countPlural}`, ...catalog.link(it, onHome) }
              : undefined,
          };
        }),
      };

    case "relatedItems":
      return {
        ...base(s),
        _type: "relatedItems",
        eyebrow: s.eyebrow,
        linkLabel: s.linkLabel ?? "",
        items: list<{ _ref: string }>(s.items)
          .map((r) => catalog.item(r._ref))
          .filter((it) => !!it?.hasPage)
          .map((it) => ({
            eyebrow: catalog.category(it!.category)?.title.toUpperCase(),
            title: it!.title,
            href: catalog.pageHref(it!)!,
          })),
      };

    default:
      return null;
  }
}
