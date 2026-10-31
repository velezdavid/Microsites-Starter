/**
 * Article bodies: Portable Text from Sanity → nodes of the editorial kit
 * (standard layout: ArticleBodyNode; long-form "reportaje": EdFeatureNode).
 */
import { escapeHTML, toHTML } from "@portabletext/to-html";
import type { ArticleBodyNode, EdFeatureNode, EdLink } from "@microsites/ui/editorial";
import { blockText, editionHref, orgHref, type Article, type EditorialContent } from "./content";
import type { PtBlock, RawImage } from "./queries";

/** Inline markup of a paragraph, only when it has marks (plain paragraphs render as text). */
function inlineHtml(b: PtBlock): string | undefined {
  const marked = (b.children ?? []).some((c: { marks?: string[] }) => c.marks?.length);
  if (!marked) return undefined;
  return toHTML(b as never, {
    components: {
      block: ({ children }) => children ?? "",
      marks: {
        textLink: ({ children, value }) => {
          const href = String(value?.href ?? "");
          const external = /^https?:\/\//.test(href);
          return `<a href="${escapeHTML(href)}"${external ? ' rel="noopener"' : ""}>${children}</a>`;
        },
      },
    },
  });
}

const ratioOf = (r?: string) => r || "3/2";

function rankingTable(c: EditorialContent, n: PtBlock): Extract<ArticleBodyNode, { _type: "rankingTable" }> | undefined {
  const more: EdLink | undefined = n.more?.label && n.more?.href ? { label: n.more.label, href: n.more.href } : undefined;
  const edition = c.editionById(n.edition?._ref);
  if (edition) {
    const a = c.award(edition.award)!;
    const rows = edition.results
      .filter((r) => r.position)
      .sort((x, y) => x.position! - y.position!)
      .slice(0, n.limit ?? 10)
      .map((r) => ({ position: r.position!, name: r.name, detail: r.sector, change: r.change, href: r.org ? orgHref(r.org) : undefined }));
    return {
      _type: "rankingTable",
      rows,
      highlight: n.highlight,
      source: n.source || `Fuente: ${a.fullName ?? a.name} ${edition.year}. Variación frente a ${edition.year - 1}.`,
      more: more ?? { label: `Ver las ${edition.total}`, href: editionHref(edition) },
    };
  }
  if (!n.rows?.length) return undefined;
  return {
    _type: "rankingTable",
    rows: n.rows.map((r: { position?: number; name: string; detail?: string; change?: string; href?: string }, i: number) => ({ ...r, position: r.position ?? i + 1 })),
    highlight: n.highlight,
    source: n.source,
    more,
  };
}

/** Body of a standard article. */
export function standardBody(c: EditorialContent, a: Article): ArticleBodyNode[] {
  return a.body.flatMap((n): ArticleBodyNode[] => {
    switch (n._type) {
      case "block": {
        const text = blockText(n);
        if (!text.trim()) return [];
        return n.style === "h2" ? [{ _type: "h2", text }] : [{ _type: "p", text, html: inlineHtml(n) }];
      }
      case "pullQuote":
        return [{ _type: "pullQuote", text: n.text, author: n.author, role: n.role }];
      case "bodyImage":
        return n.image ? [{ _type: "image", image: c.image(n.image as RawImage, "Imagen", 1200), ratio: ratioOf(n.ratio) }] : [];
      case "imagePair":
        return (n.images ?? []).map((im: PtBlock) => ({ _type: "image" as const, image: c.image(im.image as RawImage, "Foto", 1200), ratio: ratioOf(im.ratio) }));
      case "rankingTable": {
        const t = rankingTable(c, n);
        return t ? [t] : [];
      }
      case "recordList": {
        const org = c.organizations.find((o) => o.id === n.organization?._ref);
        if (!org) return [];
        const rows = c
          .recognitionsOf(org.slug)
          .slice(0, n.limit ?? 4)
          .map((r, i) => ({ position: i + 1, name: `${r.award} ${r.year}`, detail: r.result, href: r.href }));
        return rows.length ? [{ _type: "rankingTable", rows, more: { label: "Ver ficha", href: orgHref(org.slug) } }] : [];
      }
      default:
        return [];
    }
  });
}

const WEIGHTS: Record<string, [number, number]> = { "1:1": [1, 1], "3:2": [3, 2], "2:3": [2, 3] };

/** Body of a long-form article ("reportaje"): drop cap on the first paragraph, sponsor note at the end. */
export function featureBody(c: EditorialContent, a: Article): EdFeatureNode[] {
  let first = true;
  const nodes = a.body.flatMap((n): EdFeatureNode[] => {
    switch (n._type) {
      case "block": {
        const text = blockText(n);
        if (!text.trim()) return [];
        if (n.style === "h2") return [{ _type: "h2", text }];
        const dropCap = first && n.style !== "closing";
        first = false;
        return [{ _type: "p", text, html: dropCap ? undefined : inlineHtml(n), dropCap: dropCap || undefined, closing: n.style === "closing" || undefined }];
      }
      case "pullQuote":
        return [{ _type: "pullQuote", text: n.text, author: n.author, role: n.role }];
      case "bodyImage":
      case "imagePair": {
        const images: PtBlock[] = n._type === "imagePair" ? (n.images ?? []) : [n];
        return [
          {
            _type: "imagePair",
            weights: images.length === 2 ? (WEIGHTS[n.weights] ?? [1, 1]) : [1, 0],
            images: images.map((im) => {
              const img = c.image(im.image as RawImage, "Foto", 1400);
              return { label: img.label ?? "Foto", caption: img.caption, ratio: ratioOf(im.ratio), src: img.src, alt: img.alt };
            }),
          },
        ];
      }
      case "recordList": {
        const org = c.organizations.find((o) => o.id === n.organization?._ref);
        if (!org) return [];
        const items = c
          .recognitionsOf(org.slug)
          .slice(0, n.limit ?? 4)
          .map((r) => ({ year: String(r.year), award: `${r.award} · ${r.category}`, level: r.level, result: r.result, href: r.href }));
        return items.length ? [{ _type: "recordList", title: n.title || "Reconocimientos en el registro", more: { label: "Ver ficha", href: orgHref(org.slug) }, items }] : [];
      }
      default:
        return [];
    }
  });
  if (a.sponsor) {
    nodes.push({ _type: "sponsor", label: a.sponsor.label ?? "Contenido de marca · Presentado por", logo: a.sponsor.brand, note: a.sponsor.note ?? "" });
  }
  return nodes;
}
