import ibmPlexSans400 from "@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2?url";
import jetbrainsMono400 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2?url";
import spaceGrotesk600 from "@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2?url";
import type { Theme } from "@microsites/ui";

/** Latin file of the base weight of each self-hosted family (see fonts.css), keyed by CSS family name. */
const BASE_FILES: Record<string, string> = {
  "Space Grotesk": spaceGrotesk600,
  "IBM Plex Sans": ibmPlexSans400,
  "JetBrains Mono": jetbrainsMono400,
};

/** Font files to preload: the base weight of the first family of each theme font stack. */
export function fontPreloads(theme: Theme): string[] {
  const primary = (stack: string) => stack.split(",")[0].trim().replace(/^['"]|['"]$/g, "").replace(/ Variable$/, "");
  return [theme.fontDisplay, theme.fontBody, theme.fontMono]
    .map((stack) => BASE_FILES[primary(stack)])
    .filter((url): url is string => !!url);
}
