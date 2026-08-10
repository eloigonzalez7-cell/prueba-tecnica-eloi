import DOMPurify from "dompurify";

const ENCODED_TAG_PATTERN = /&lt;\/?[a-z]/i;
const HTML_TAG_PATTERN = /<[a-z][\s\S]*>/i;
/** Bare http(s) URLs, www.*, or domain/path without a scheme. */
const BARE_URL_PATTERN =
  /(https?:\/\/[^\s<]+|www\.[^\s<]+|(?:[a-z0-9-]+\.)+[a-z]{2,}\/[^\s<]*)/gi;

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toHref(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return `https://${url}`;
}

function trimTrailingUrlPunctuation(url: string): {
  href: string;
  trailing: string;
} {
  const match = /^(.*?)([.,;:!?)\]}'"]*)$/.exec(url);
  if (!match) {
    return { href: url, trailing: "" };
  }
  return { href: match[1] ?? url, trailing: match[2] ?? "" };
}

function anchorHtml(url: string): string {
  const href = escapeHtml(toHref(url));
  const label = escapeHtml(url);
  return `<a href="${href}" rel="noopener noreferrer" target="_blank">${label}</a>`;
}

/**
 * Escape plain text and wrap bare URLs in anchors.
 */
export function linkifyPlainText(text: string): string {
  const escaped = escapeHtml(text);
  return escaped.replace(BARE_URL_PATTERN, (raw) => {
    const { href: url, trailing } = trimTrailingUrlPunctuation(raw);
    if (!url) {
      return raw;
    }
    return `${anchorHtml(url)}${trailing}`;
  });
}

/**
 * After sanitization, turn bare URLs in text nodes into anchors.
 * Skips text already inside an <a> so existing links are not nested.
 */
export function linkifySanitizedHtml(html: string): string {
  if (!html || typeof document === "undefined") {
    return html;
  }

  const root = document.createElement("div");
  root.innerHTML = html;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  for (const textNode of textNodes) {
    if (textNode.parentElement?.closest("a")) {
      continue;
    }

    const value = textNode.nodeValue ?? "";
    BARE_URL_PATTERN.lastIndex = 0;
    if (!BARE_URL_PATTERN.test(value)) {
      continue;
    }

    const wrapper = document.createElement("span");
    wrapper.innerHTML = linkifyPlainText(value);
    const fragment = document.createDocumentFragment();
    while (wrapper.firstChild) {
      fragment.appendChild(wrapper.firstChild);
    }
    textNode.parentNode?.replaceChild(fragment, textNode);
  }

  return root.innerHTML;
}

/**
 * Sanitize untrusted HTML (e.g. episode descriptions from iTunes)
 * before rendering with dangerouslySetInnerHTML.
 *
 * iTunes often returns plain text with bare https:// URLs (no <a> tags).
 * Those are escaped, newlines become <br>, then URLs are linkified.
 */
export function sanitizeHtml(dirty: string): string {
  let content = dirty.trim();
  if (!content) {
    return "";
  }

  if (ENCODED_TAG_PATTERN.test(content)) {
    content = decodeHtmlEntities(content);
  }

  if (!HTML_TAG_PATTERN.test(content)) {
    content = escapeHtml(content).replace(/\r\n|\r|\n/g, "<br>");
  }

  const clean = DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target"],
  });

  return linkifySanitizedHtml(clean);
}
