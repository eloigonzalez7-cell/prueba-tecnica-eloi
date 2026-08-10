import DOMPurify from "dompurify";

/**
 * Sanitize untrusted HTML (e.g. episode descriptions from iTunes)
 * before rendering with dangerouslySetInnerHTML.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
  });
}
