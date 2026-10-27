import type { Action } from "@microsites/ui";
import type { RawCategory, RawItem, RawSection } from "./queries";
import { pageHref } from "./types";

export interface ResolvedLink {
  href: string;
  action?: Action;
}

/**
 * Catalog of a site plus the rules that decide where an item links to.
 * The rules derive from how the home page displays each category, so menus,
 * footers and cross-links stay correct when editors add or reorder items.
 */
export class Catalog {
  private readonly itemsById: Map<string, RawItem>;
  private readonly categoriesById: Map<string, RawCategory>;

  constructor(
    categories: RawCategory[],
    private readonly allItems: RawItem[],
    private readonly homeSections: RawSection[],
  ) {
    this.itemsById = new Map(allItems.map((i) => [i._id, i]));
    this.categoriesById = new Map(categories.map((c) => [c._id, c]));
  }

  category(id?: string): RawCategory | undefined {
    return id ? this.categoriesById.get(id) : undefined;
  }

  item(id: string): RawItem | undefined {
    return this.itemsById.get(id);
  }

  itemsOf(categoryId?: string): RawItem[] {
    return this.allItems.filter((i) => i.category === categoryId);
  }

  /** Related items of `item` that belong to `categoryId`. */
  relatedIn(item: RawItem, categoryId?: string): RawItem[] {
    return (item.related ?? []).map((id) => this.itemsById.get(id)).filter((i): i is RawItem => !!i && i.category === categoryId);
  }

  /** Items of `categoryId` that list `item` among their related items. */
  referencing(item: RawItem, categoryId?: string): RawItem[] {
    return this.itemsOf(categoryId).filter((i) => i.related?.includes(item._id));
  }

  pageHref(item: RawItem): string | undefined {
    return item.hasPage ? pageHref(item.path ?? "") : undefined;
  }

  private homeBlock(type: string, field: string, categoryId: string): RawSection | undefined {
    return this.homeSections.find((s) => s._type === type && s[field]?._ref === categoryId && s.anchor);
  }

  /**
   * Where an item links to. On the home page links can trigger in-page actions;
   * elsewhere they point to the home anchors instead.
   */
  link(item: RawItem, onHome: boolean): ResolvedLink {
    const toHome = (anchor: string, action: Action): ResolvedLink =>
      onHome ? { href: `#${anchor}`, action } : { href: `/#${anchor}` };

    const tabs = this.homeBlock("catalogTabs", "category", item.category);
    if (tabs) return toHome(tabs.anchor, { type: "tab", target: tabs.anchor, value: item.slug });

    const grid = this.homeBlock("catalogFilterGrid", "category", item.category);
    if (grid) {
      const cardId = cardAnchor(grid, item);
      return onHome
        ? { href: `#${cardId}`, action: { type: "highlight", target: grid.anchor, value: cardId } }
        : { href: `/#${cardId}` };
    }

    const filtered = this.homeBlock("catalogFilterGrid", "filterCategory", item.category);
    if (filtered) return toHome(filtered.anchor, { type: "filter", target: filtered.anchor, value: item.slug });

    const page = this.pageHref(item);
    if (page) return { href: page };

    const anchor = this.category(item.category)?.anchor;
    return { href: anchor ? `${onHome ? "" : "/"}#${anchor}` : "/" };
  }

  /** Link of a category heading (menu column title). */
  categoryLink(categoryId: string, onHome: boolean): ResolvedLink {
    const anchor = this.category(categoryId)?.anchor;
    if (!anchor) return { href: "/" };
    if (!onHome) return { href: `/#${anchor}` };
    const grid = this.homeBlock("catalogFilterGrid", "category", categoryId);
    return grid ? { href: `#${anchor}`, action: { type: "filter", target: grid.anchor, value: "all" } } : { href: `#${anchor}` };
  }
}

export const cardAnchor = (grid: RawSection, item: RawItem) => `${grid.cardAnchorPrefix ?? ""}${item.slug}`;

/** Replaces `{title}` in editor-provided labels. */
export const fillTemplate = (template: string | undefined, title: string) => (template ?? "").replaceAll("{title}", title);
