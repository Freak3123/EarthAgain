import sanitizeHtml from "sanitize-html";

/**
 * Tags the blog rich-text editor can produce. Anything outside this list is
 * stripped — the editor is trusted, the stored string is not, because it is
 * rendered with dangerouslySetInnerHTML on a public page.
 *
 * Parser-based (htmlparser2) rather than DOMPurify: DOMPurify needs a DOM,
 * which on the server means jsdom, and Next treats jsdom as an external
 * package so it stays a runtime require() inside the serverless bundle —
 * where its ESM-only dependencies blow up with ERR_REQUIRE_ESM. This has no
 * DOM dependency and gets bundled normally. Both call sites are server-side,
 * so nothing here ever needed to run in a browser.
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "code",
  "pre",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "hr",
  "a",
];

/**
 * Sanitise article HTML. Applied on save so nothing dangerous is ever stored,
 * and again on render so posts written before this existed are covered too.
 */
export function sanitizeBlogHtml(html: unknown): string {
  if (typeof html !== "string" || !html.trim()) return "";
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    // Anchors are the only attribute-carrying tag we keep.
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href"],
    // "//evil.com" would otherwise inherit the page's scheme.
    allowProtocolRelative: false,
    transformTags: {
      // A new-tab link must not hand the opener over to the destination.
      a: (tagName, attribs) => ({
        tagName,
        attribs:
          attribs.target === "_blank"
            ? { ...attribs, rel: "noopener noreferrer" }
            : attribs,
      }),
    },
  });
}

/** True when the HTML has no visible text and no content-bearing tags. */
export function isBlankHtml(html: string) {
  return !html.replace(/<[^>]*>/g, "").trim() && !/<(img|hr)\b/i.test(html);
}
