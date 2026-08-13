import DOMPurify from "isomorphic-dompurify";

/**
 * Tags the blog rich-text editor can produce. Anything outside this list is
 * stripped — the editor is trusted, the stored string is not, because it is
 * rendered with dangerouslySetInnerHTML on a public page.
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
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href", "target", "rel"],
    // Anchors are the only attribute-carrying tag, and only to safe schemes.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#|\/)/i,
  });
}

/** True when the HTML has no visible text and no content-bearing tags. */
export function isBlankHtml(html: string) {
  return !html.replace(/<[^>]*>/g, "").trim() && !/<(img|hr)\b/i.test(html);
}
