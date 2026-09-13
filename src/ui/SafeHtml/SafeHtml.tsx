import { FC } from "react";
import DOMPurify from "dompurify";

import { SafeHtmlProps } from "./SafeHtml.types";

// Question feedback/explanations may carry light formatting and source
// links imported from external question banks (e.g. <i>...</i>, <a href>).
// Keep this list narrow — it's a display allowlist, not a general-purpose
// rich-text feature.
const ALLOWED_TAGS = ["b", "strong", "i", "em", "br", "a", "p", "ul", "ol", "li"];
const ALLOWED_ATTR = ["href", "target", "rel"];

// Force safe `rel` on any link that opens in a new tab, regardless of what
// the imported content set (or forgot to set) — prevents reverse tabnabbing.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer");
  }
});

const SafeHtml: FC<SafeHtmlProps> = ({ html, className }) => {
  const sanitized = DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });

  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />
  );
};

export default SafeHtml;
