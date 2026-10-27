import type { APIRoute } from "astro";
import { getSite } from "../lib/content/site";

/** Favicon drawn from the site's brand: concentric rings, or the first letter of its name. */
export const GET: APIRoute = async () => {
  const { name, theme, logo } = await getSite();
  const content =
    logo.mark?.type === "rings"
      ? `<circle cx="16" cy="16" r="13" fill="none" stroke="${theme.accent}" stroke-width="3" opacity=".4"/>` +
        `<circle cx="16" cy="16" r="7.5" fill="none" stroke="${theme.accent}" stroke-width="3" opacity=".7"/>` +
        `<circle cx="16" cy="16" r="3" fill="${theme.accent}"/>`
      : `<text x="16" y="22" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="${theme.onAccent}">${name.charAt(0).toUpperCase()}</text>`;
  const background = logo.mark?.type === "rings" ? theme.bg : theme.accent;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${background}"/>${content}</svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
};
