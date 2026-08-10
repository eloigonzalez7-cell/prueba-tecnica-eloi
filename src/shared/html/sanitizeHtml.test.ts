import { linkifyPlainText, sanitizeHtml } from "@/shared/html/sanitizeHtml";

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

  it("turns bare https URLs in plain text into anchors", () => {
    const dirty =
      "Support the show: https://musicsavedme.net/ See omnystudio.com/listener for privacy.";

    const html = sanitizeHtml(dirty);

    expect(html).toContain(
      '<a href="https://musicsavedme.net/" rel="noopener noreferrer" target="_blank">https://musicsavedme.net/</a>',
    );
    expect(html).toContain(
      '<a href="https://omnystudio.com/listener" rel="noopener noreferrer" target="_blank">omnystudio.com/listener</a>',
    );
  });

  it("preserves newlines in plain text as line breaks", () => {
    expect(sanitizeHtml("Line one\nLine two")).toBe("Line one<br>Line two");
  });

  it("linkifies bare URLs inside existing HTML text nodes", () => {
    const dirty = "<p>More at https://example.com/show.</p>";

    expect(sanitizeHtml(dirty)).toBe(
      '<p>More at <a href="https://example.com/show" rel="noopener noreferrer" target="_blank">https://example.com/show</a>.</p>',
    );
  });

  it("does not nest anchors when a link already exists", () => {
    const dirty = '<a href="https://example.com">https://example.com</a>';

    expect(sanitizeHtml(dirty)).toBe(
      '<a href="https://example.com">https://example.com</a>',
    );
  });
});

describe("linkifyPlainText", () => {
  it("escapes HTML while linkifying", () => {
    expect(linkifyPlainText('<script>x</script> https://ok.test')).toBe(
      '&lt;script&gt;x&lt;/script&gt; <a href="https://ok.test" rel="noopener noreferrer" target="_blank">https://ok.test</a>',
    );
  });
});
