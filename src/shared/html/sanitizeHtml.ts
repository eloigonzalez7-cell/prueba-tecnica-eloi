import DOMPurify from "dompurify";

const ENCODED_TAG_PATTERN = /&lt;\/?[a-z]/i;

/**
 * Decode common HTML entities when Apple returns markup as escaped text
 * (e.g. `&lt;p&gt;Hello&lt;/p&gt;` instead of `<p>Hello</p>`).
 */
export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

/**
 * Sanitize untrusted HTML (e.g. episode descriptions from iTunes)
 * before rendering with dangerouslySetInnerHTML.
 */
export function sanitizeHtml(dirty: string): string {
  let content = dirty.trim();
  if (!content) {
    return "";
  }

  if (ENCODED_TAG_PATTERN.test(content)) {
    content = decodeHtmlEntities(content);
  }

  return DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
  });
}
