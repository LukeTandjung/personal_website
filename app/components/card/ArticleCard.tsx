import * as React from "react";
import { Link } from "react-router";
import { type Article } from "types";

// One row in the Articles list: title + description on the left, reading
// metadata on the right, separated by ruled pencil lines.
export function ArticleCard({
  title,
  description,
  meta_data,
  article_index,
  parts,
}: Article): React.ReactElement {
  return (
    <Link
      to={`/articles/${article_index}/part/${parts[0]}`}
      className="grid grid-cols-[1fr_170px] gap-5 border-b border-line-subtle px-2 py-[18px] !text-char-default hover:bg-paper-bg-light hover:!opacity-100"
    >
      <span>
        <span className="mb-1 block font-semibold">{title}</span>
        <span className="block text-sm text-pretty text-char-muted">
          {description}
        </span>
      </span>
      <span className="text-right text-xs text-char-faint">{meta_data}</span>
    </Link>
  );
}
