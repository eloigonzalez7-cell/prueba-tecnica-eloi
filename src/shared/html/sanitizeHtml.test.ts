import { sanitizeHtml } from "@/shared/html/sanitizeHtml";

describe("sanitizeHtml", () => {
  it("keeps safe markup used in episode descriptions", () => {
    const dirty =
      '<p>Hello <strong>world</strong></p><a href="https://example.com">link</a>';

    expect(sanitizeHtml(dirty)).toBe(
      '<p>Hello <strong>world</strong></p><a href="https://example.com">link</a>',
    );
  });

  it("strips script tags", () => {
    const dirty = '<p>ok</p><script>alert("xss")</script>';

    expect(sanitizeHtml(dirty)).toBe("<p>ok</p>");
  });

  it("strips inline event handlers", () => {
    const dirty = '<img src="x" onerror="alert(1)" alt="cover" />';

    expect(sanitizeHtml(dirty)).not.toMatch(/onerror/i);
    expect(sanitizeHtml(dirty)).not.toMatch(/alert/i);
  });

  it("blocks javascript: URLs in anchors", () => {
    const dirty = '<a href="javascript:alert(1)">click</a>';

    expect(sanitizeHtml(dirty)).not.toMatch(/javascript:/i);
  });

  it("returns an empty string for empty input", () => {
    expect(sanitizeHtml("")).toBe("");
  });

  it("decodes entity-encoded HTML before sanitizing", () => {
    const dirty =
      "&lt;p&gt;Encoded &lt;strong&gt;html&lt;/strong&gt;&lt;/p&gt;";

    expect(sanitizeHtml(dirty)).toBe("<p>Encoded <strong>html</strong></p>");
  });
});

