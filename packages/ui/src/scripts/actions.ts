/**
 * Progressive enhancement for tabs, filters and cross-section actions.
 * All states are rendered in the HTML; this script only toggles `hidden` and ARIA attributes.
 *
 * Markup contracts:
 * - Tabs:    [data-tabs="scope"] > [role=tab][data-tab="id"] + [data-tab-content="id"]
 * - Filters: [data-filter-scope="scope"][data-filter-all="value"] > button[data-filter-value] + [data-filter-tags="a b"]
 * - Actions: [data-action="tab|filter|highlight"][data-action-target="scope"][data-action-value="value"]
 */

export const CLOSE_MENUS_EVENT = "ui:close-menus";

const ownedBy = (scope: Element, attr: string) => (el: Element) => el.closest(`[${attr}]`) === scope;

function selectTab(scope: Element, id: string, focus = false) {
  const owned = ownedBy(scope, "data-tabs");
  scope.querySelectorAll<HTMLElement>("[data-tab]").forEach((tab) => {
    if (!owned(tab)) return;
    const on = tab.dataset.tab === id;
    tab.setAttribute("aria-selected", String(on));
    tab.tabIndex = on ? 0 : -1;
    if (on && focus) tab.focus();
  });
  scope.querySelectorAll<HTMLElement>("[data-tab-content]").forEach((panel) => {
    if (owned(panel)) panel.hidden = panel.dataset.tabContent !== id;
  });
}

function applyFilter(scope: HTMLElement, value: string) {
  const all = scope.dataset.filterAll;
  scope.querySelectorAll<HTMLElement>("[data-filter-value]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.filterValue === value));
  });
  scope.querySelectorAll<HTMLElement>("[data-filter-tags]").forEach((item) => {
    const tags = (item.dataset.filterTags ?? "").split(" ");
    item.hidden = value !== all && !tags.includes(value);
  });
}

function highlight(scope: HTMLElement, id: string) {
  if (scope.dataset.filterAll) applyFilter(scope, scope.dataset.filterAll);
  scope.querySelectorAll<HTMLElement>("[data-highlighted]").forEach((el) => el.removeAttribute("data-highlighted"));
  document.getElementById(id)?.setAttribute("data-highlighted", "");
}

function runAction(type: string, target: string, value: string) {
  if (type === "tab") {
    const scope = document.querySelector(`[data-tabs="${target}"]`);
    if (scope) selectTab(scope, value);
  } else {
    const scope = document.querySelector<HTMLElement>(`[data-filter-scope="${target}"]`);
    if (!scope) return;
    if (type === "filter") {
      scope.querySelectorAll("[data-highlighted]").forEach((el) => el.removeAttribute("data-highlighted"));
      applyFilter(scope, value);
    } else if (type === "highlight") {
      highlight(scope, value);
    }
  }
}

document.addEventListener("click", (event) => {
  const el = (event.target as Element).closest<HTMLElement>("[data-tab], [data-filter-value], [data-action]");
  if (!el) return;

  if (el.dataset.action) {
    runAction(el.dataset.action, el.dataset.actionTarget ?? "", el.dataset.actionValue ?? "");
    document.dispatchEvent(new CustomEvent(CLOSE_MENUS_EVENT));
    return;
  }
  if (el.dataset.tab) {
    const scope = el.closest("[data-tabs]");
    if (scope) selectTab(scope, el.dataset.tab);
    return;
  }
  const scope = el.closest<HTMLElement>("[data-filter-scope]");
  if (scope && el.dataset.filterValue) {
    scope.querySelectorAll("[data-highlighted]").forEach((h) => h.removeAttribute("data-highlighted"));
    applyFilter(scope, el.dataset.filterValue);
  }
});

const KEYS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

document.addEventListener("keydown", (event) => {
  const tab = (event.target as Element).closest?.<HTMLElement>("[role=tab][data-tab]");
  const scope = tab?.closest("[data-tabs]");
  if (!tab || !scope) return;
  const tabs = Array.from(scope.querySelectorAll<HTMLElement>("[role=tab][data-tab]")).filter(ownedBy(scope, "data-tabs"));
  const i = tabs.indexOf(tab);
  let next = -1;
  if (event.key in KEYS) next = (i + KEYS[event.key] + tabs.length) % tabs.length;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = tabs.length - 1;
  if (next < 0) return;
  event.preventDefault();
  selectTab(scope, tabs[next].dataset.tab!, true);
});
