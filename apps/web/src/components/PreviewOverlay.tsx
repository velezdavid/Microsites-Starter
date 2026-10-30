import { VisualEditingComponent, type VisualEditingComponentProps } from "@sanity/astro/visual-editing/component";

/**
 * Click-to-edit overlays, only inside the Studio (Presentation iframe or its pop-up window).
 * Shared preview links open the page on its own: drafts are visible, but nothing is editable.
 */
export default function PreviewOverlay(props: VisualEditingComponentProps) {
  const inStudio = window.self !== window.top || !!window.opener;
  return inStudio ? <VisualEditingComponent {...props} /> : null;
}
