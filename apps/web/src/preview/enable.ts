import type { APIRoute } from "astro";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { sanityClient } from "sanity:client";
import { previewCookieHeader, readToken } from "../lib/content/preview";

/**
 * Entry point of Sanity Presentation (previewMode.enable). The Studio opens this URL with a
 * short-lived secret it just stored in the dataset; when it checks out, the browser gets the
 * signed preview cookie and is redirected to the requested page.
 */
export const GET: APIRoute = async ({ request }) => {
  const token = readToken();
  if (!token) return new Response("Preview is not configured (SANITY_API_READ_TOKEN).", { status: 500 });

  const { isValid, redirectTo = "/" } = await validatePreviewUrl(sanityClient.withConfig({ token, useCdn: false }), request.url);
  if (!isValid) return new Response("Invalid preview secret.", { status: 401 });

  return new Response(null, { status: 307, headers: { Location: redirectTo, "Set-Cookie": previewCookieHeader() } });
};
