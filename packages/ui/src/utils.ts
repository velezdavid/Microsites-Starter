import type { Action, Theme } from "./types";

/** Data attributes consumed by scripts/actions.ts. */
export function actionAttrs(action?: Action): Record<string, string> {
  if (!action) return {};
  return { "data-action": action.type, "data-action-target": action.target, "data-action-value": action.value };
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

const THEME_VARS: Record<keyof Theme, string> = {
  bg: "--color-bg",
  surface: "--color-surface",
  surface2: "--color-surface-2",
  surfaceEnd: "--color-surface-end",
  deep: "--color-deep",
  raised: "--color-raised",
  accent: "--color-accent",
  accentHover: "--color-accent-hover",
  accentSoft: "--color-accent-soft",
  onAccent: "--color-on-accent",
  text: "--color-text",
  muted: "--color-muted",
  dim: "--color-dim",
  line: "--color-line",
  lineSoft: "--color-line-soft",
  placeholder: "--color-placeholder",
  fontDisplay: "--font-display",
  fontBody: "--font-body",
  fontMono: "--font-mono",
  premium: "--color-premium",
  accentText: "--color-accent-text",
};

export function themeStyle(theme: Theme): string {
  return (Object.keys(THEME_VARS) as (keyof Theme)[])
    .filter((k) => theme[k] !== undefined)
    .map((k) => `${THEME_VARS[k]}:${theme[k]}`)
    .join(";");
}

/** Splits a title around the highlighted substring. */
export function splitHighlight(title: string, highlight?: string): [string, string, string] {
  const i = highlight ? title.indexOf(highlight) : -1;
  if (!highlight || i < 0) return [title, "", ""];
  return [title.slice(0, i), highlight, title.slice(i + highlight.length)];
}
