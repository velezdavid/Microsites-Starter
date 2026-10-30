import type { APIRoute } from "astro";
import { clearPreviewCookieHeader } from "../lib/content/preview";

/** Ends the preview session (back to published content). */
export const GET: APIRoute = () =>
  new Response(null, { status: 307, headers: { Location: "/", "Set-Cookie": clearPreviewCookieHeader() } });
