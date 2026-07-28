/**
 * Pure helpers for resolving Payload upload fields to URLs / alt text.
 * No server dependency — safe to import from client components.
 */

/** Resolve a Payload upload field to a usable URL, else the built-in fallback. */
export function mediaUrl(media: unknown, fallback: string): string {
  if (media && typeof media === 'object' && 'url' in media) {
    const url = (media as { url?: string | null }).url;
    if (url) return url;
  }
  return fallback;
}

/** Resolve a media field's alt text, else a fallback. */
export function mediaAlt(media: unknown, fallback = ''): string {
  if (media && typeof media === 'object' && 'alt' in media) {
    const alt = (media as { alt?: string | null }).alt;
    if (alt) return alt;
  }
  return fallback;
}
