import * as React from "react";
import { type Article } from "types";
import { Separator } from "@base-ui-components/react/separator";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Link } from "react-router";

export function ArticleCard({
  title,
  description,
  meta_data,
  article_index,
}: Article): React.ReactElement {
  return (
    <div
      id={`${title}-article-card`}
      className="flex p-3 flex-col items-start gap-3 rounded-sm bg-panel-alt/75"
    >
      <header
        id={`${title}-article-header`}
        className="flex justify-between items-center self-stretch"
      >
        <h3 className="font-serif font-normal text-lg text-char-default">
          {title}
        </h3>
      </header>
      <div
        id={`${title}-article-description`}
        className="flex items-start self-stretch"
      >
        <p className="font-mono font-normal text-base text-char-alt">
          {description}
        </p>
      </div>
      <Separator className="w-full h-[1px] bg-line-unfocus" />
      <footer
        id={`${title}-article-footer`}
        className="flex justify-between items-start self-stretch"
      >
        <span className="font-mono font-medium text-sm text-char-alt">
          {meta_data}
        </span>
        <Link to={`/articles/${article_index}/part/0`}>
          <OpenInNewWindowIcon className="size-4 text-char-alt" />
        </Link>
      </footer>
    </div>
  );
}
